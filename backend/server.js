import 'dotenv/config';
import { Webhook } from 'standardwebhooks';

import { requireAdmin } from './middleware/adminAuth.js';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import rateLimit from 'express-rate-limit';

import { supabase } from './config/supabase.js';
import {
  generateDueReminders,
  generateDueRemindersForAllPatients
} from './services/reminderService.js';
import { markMissedAppointments } from './services/missedappointmentservice.js';
import {
  sendAuthEmail,
  sendEnquiryReply,
  sendSupportNotification
} from './services/emailservice.js';
import { generateAIResponse } from './services/aiservice.js';


const app = express();
const port = process.env.PORT || 5000;


// Authenticate patients before allowing access to the AI Assistant
const authenticatePatient = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to use the AI Assistant.'
      });
    }

    const accessToken = authHeader.split(' ')[1];

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.'
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Patient verification error:', profileError.message);

      return res.status(500).json({
        success: false,
        message: 'Unable to verify your account permissions.'
      });
    }

    if (!profile || profile.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only registered patients can use the AI Assistant.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Patient authentication error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to verify your login session.'
    });
  }
};


// Limit each authenticated patient to 10 AI requests per minute
const aiChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  // Identify each patient by their authenticated user ID
  keyGenerator: (req) => req.user.id,

  message: {
    success: false,
    message: 'You have reached your AI message limit. Please try again in one minute.'
  }
});



 // Supabase Authentication Email Hook
app.post(
  '/api/auth/send-email',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const hookSecret = process.env.SEND_EMAIL_HOOK_SECRET;

      if (!hookSecret) {
        throw new Error('Missing SEND_EMAIL_HOOK_SECRET environment variable.');
      }

      const payload = req.body.toString('utf8');

      const headers = Object.fromEntries(
        Object.entries(req.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : value
        ])
      );

      const webhook = new Webhook(
        hookSecret.replace('v1,whsec_', '')
      );

      const { user, email_data } = webhook.verify(payload, headers);

      const actionType = email_data.email_action_type;

      // Create a confirmation link when the email action requires one
      const buildConfirmationUrl = (tokenHash) => {
        if (!tokenHash) {
          throw new Error('Missing email verification token hash.');
        }

        const url = new URL(
          '/auth/v1/verify',
          process.env.SUPABASE_URL
        );

        const params = new URLSearchParams({
          token: tokenHash,
          type: actionType
        });

        if (email_data.redirect_to) {
          params.set('redirect_to', email_data.redirect_to);
        }

        url.search = params.toString();

        return url.toString();
      };

      // Secure Email Change: send to both addresses
      if (actionType === 'email_change') {
        if (
          !user.email ||
          !user.new_email ||
          !email_data.token ||
          !email_data.token_new ||
          !email_data.token_hash ||
          !email_data.token_hash_new
        ) {
          throw new Error('Missing secure email-change details.');
        }

        // Send confirmation to the current email address
        await sendAuthEmail({
          to: user.email,
          actionType,
          confirmationUrl: buildConfirmationUrl(email_data.token_hash_new),
          token: email_data.token,
          oldEmail: user.email,
          newEmail: user.new_email
        });

        // Send confirmation to the new email address
        await sendAuthEmail({
          to: user.new_email,
          actionType,
          confirmationUrl: buildConfirmationUrl(email_data.token_hash),
          token: email_data.token_new,
          oldEmail: user.email,
          newEmail: user.new_email
        });

      } else {
        if (!user.email) {
          throw new Error('Missing authentication email recipient.');
        }

        const isReauthentication = actionType === 'reauthentication';
        const isNotification = actionType.endsWith('_notification');

        let confirmationUrl;

        if (!isReauthentication && !isNotification) {
          confirmationUrl = buildConfirmationUrl(email_data.token_hash);
        }

        await sendAuthEmail({
          to: user.email,
          actionType,
          confirmationUrl,
          token: email_data.token,
          oldEmail: email_data.old_email,
          newEmail: user.new_email,
          phone: user.phone,
          oldPhone: email_data.old_phone,
          provider: email_data.provider,
          factorType: email_data.factor_type
        });
      }

      return res.status(200).json({});

    } catch (error) {
      console.error('Supabase email hook error:', error.message);

      return res.status(500).json({
        error: {
          http_code: 500,
          message: 'Unable to send authentication email.'
        }
      });
    }
  }
);



// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medi-track-gamma-lyart.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test that Express and Supabase are connected
app.get('/api/health', async (_req, res) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) throw error;

    return res.json({
      status: 'ok',
      message: 'MediTrack API and Supabase are connected successfully.'
    });
  } catch (error) {
    console.error('Supabase connection error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Supabase connection failed.'
    });
  }
});

// Verify administrator access
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Administrator access verified successfully.',
    userId: req.user.id
  });
});


// Fetch real data for the Admin Dashboard
app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    // Fetch dashboard statistics and recent records
    const [
      patientsCount,
      appointmentsCount,
      upcomingCount,
      enquiriesCount,
      recentPatientsResult,
      recentAppointmentsResult,
      recentEnquiriesResult
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'patient'),

      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true }),

      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Upcoming'),

      supabase
        .from('contact_enquiries')
        .select('id', { count: 'exact', head: true })
        .ilike('status', 'new'),

      supabase
        .from('profiles')
        .select('id, full_name, email, created_at, role')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
        .from('appointments')
        .select(`
          id,
          user_id,
          facility_name,
          doctor_name,
          appointment_date,
          appointment_time,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
        .from('contact_enquiries')
        .select('id, full_name, email, subject, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Check for database errors
    const results = [
      patientsCount,
      appointmentsCount,
      upcomingCount,
      enquiriesCount,
      recentPatientsResult,
      recentAppointmentsResult,
      recentEnquiriesResult
    ];

    const failedQuery = results.find(result => result.error);

    if (failedQuery) {
      throw failedQuery.error;
    }

    // Retrieve patient names for recent appointments
    const patientIds = [
      ...new Set(
        (recentAppointmentsResult.data || []).map(
          appointment => appointment.user_id
        )
      )
    ];

    let patientProfiles = [];

    if (patientIds.length > 0) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', patientIds);

      if (error) throw error;

      patientProfiles = data || [];
    }

    const patientNameMap = new Map(
      patientProfiles.map(patient => [
        patient.id,
        patient.full_name
      ])
    );

    // Attach patient names to appointment records
    const recentAppointments = (
      recentAppointmentsResult.data || []
    ).map(appointment => ({
      ...appointment,
      patient_name:
        patientNameMap.get(appointment.user_id) || 'Unknown Patient'
    }));

    return res.status(200).json({
      success: true,

      statistics: {
        totalPatients: patientsCount.count ?? 0,
        totalAppointments: appointmentsCount.count ?? 0,
        upcomingAppointments: upcomingCount.count ?? 0,
        newEnquiries: enquiriesCount.count ?? 0
      },

      recentPatients: recentPatientsResult.data || [],
      recentAppointments,
      recentEnquiries: recentEnquiriesResult.data || []
    });

  } catch (error) {
    console.error('Admin dashboard data error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve Admin Dashboard data.'
    });
  }
});


// Fetch all records for the Admin Management page
app.get('/api/admin/management', requireAdmin, async (req, res) => {
  try {
    const [
      patientsResult,
      appointmentsResult,
      enquiriesResult
    ] = await Promise.all([
      // Fetch registered patients
      supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at, role')
        .eq('role', 'patient')
        .order('created_at', { ascending: false }),

      // Fetch all appointments
      supabase
        .from('appointments')
        .select(`
          id,
          user_id,
          facility_name,
          doctor_name,
          reason,
          appointment_date,
          appointment_time,
          status,
          created_at
        `)
        .order('created_at', { ascending: false }),

      // Fetch all contact enquiries
      supabase
        .from('contact_enquiries')
        .select(`
          id,
          full_name,
          email,
          subject,
          message,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
    ]);

    // Check for database errors
    const results = [
      patientsResult,
      appointmentsResult,
      enquiriesResult
    ];

    const failedQuery = results.find(result => result.error);

    if (failedQuery) {
      throw failedQuery.error;
    }

    // Create a map of patient names
    const patientNameMap = new Map(
      (patientsResult.data || []).map(patient => [
        patient.id,
        patient.full_name
      ])
    );

    // Attach patient names to appointments
    const appointments = (appointmentsResult.data || []).map(appointment => ({
      ...appointment,
      patient_name:
        patientNameMap.get(appointment.user_id) || 'Unknown Patient'
    }));

    return res.status(200).json({
      success: true,
      patients: patientsResult.data || [],
      appointments,
      enquiries: enquiriesResult.data || []
    });

  } catch (error) {
    console.error('Admin management data error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve Management data.'
    });
  }
});



// Update contact enquiry status (Admin only)
app.patch('/api/admin/enquiries/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow these two status updates
    const allowedStatuses = ['read', 'replied'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry status.'
      });
    }

    const { data, error } = await supabase
      .from('contact_enquiries')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: `Enquiry marked as ${status}.`,
      enquiry: data
    });

  } catch (error) {
    console.error('Enquiry status update error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to update enquiry status.'
    });
  }
});


// Send an email reply and create an in-app notification (Admin only)
app.post('/api/admin/enquiries/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a reply message.'
      });
    }


    // Prevent excessively long messages
if (message.trim().length > 2000) {
  return res.status(400).json({
    success: false,
    message: 'Your message is too long. Please keep it under 2,000 characters.'
  });
}


    // 1. Retrieve the enquiry, including its patient account ID
    const { data: enquiry, error: fetchError } = await supabase
      .from('contact_enquiries')
      .select('id, full_name, email, subject, user_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Send the email reply
    await sendEnquiryReply({
      to: enquiry.email,
      subject: enquiry.subject,
      message: message.trim()
    });

    // 3. Update enquiry status after successful email delivery
    const { error: updateError } = await supabase
      .from('contact_enquiries')
      .update({ status: 'replied' })
      .eq('id', id);

    if (updateError) throw updateError;

    // 4. Create an in-app notification for registered patients
    if (enquiry.user_id) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: enquiry.user_id,
          appointment_id: null,
          title: 'Admin Replied to Your Enquiry',
          message: `An administrator has responded to your enquiry: ${enquiry.subject}`,
          notification_type: 'enquiry_reply',
          is_read: false,
          sent_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error(
          'Email sent, but notification creation failed:',
          notificationError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Reply sent successfully.',
      enquiry: {
        id: enquiry.id,
        status: 'replied'
      },
      notificationCreated: Boolean(enquiry.user_id)
    });

  } catch (error) {
    console.error('Enquiry reply error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to send enquiry reply.'
    });
  }
});



// AI Assistant chat endpoint
app.post(
  '/api/ai/chat',
  authenticatePatient,
  aiChatLimiter,
  async (req, res) => {
    try {
      const { message } = req.body;

      // Validate the patient's message
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a message.'
        });
      }

      // Prevent excessively long messages
      if (message.trim().length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Your message is too long. Please keep it under 2,000 characters.'
        });
      }

      // Generate a response using Google Gemini
      const aiResponse = await generateAIResponse(message.trim());

      return res.status(200).json({
        success: true,
        response: aiResponse
      });

   } catch (error) {
  console.error('AI Assistant error:', error.message);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.publicMessage ||
      'Unable to generate a response. Please try again.'
  });
   }
  }
);



 // Receive and save Contact form enquiries
app.post('/api/contact-enquiries', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }
// Identify the logged-in patient, if a valid session exists
let userId = null;

const authHeader = req.headers.authorization;

console.log(
  'Contact enquiry Authorization header received:',
  Boolean(authHeader)
);

if (authHeader?.startsWith('Bearer ')) {
  const accessToken = authHeader.split(' ')[1];

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(accessToken);

  console.log('Contact enquiry authentication result:', {
    authenticated: Boolean(user),
    userId: user?.id || null,
    error: authError?.message || null
  });

  if (!authError && user) {
    userId = user.id;
  }
} else {
  console.log('No valid Bearer token received for contact enquiry.');
}

    const { data, error } = await supabase
      .from('contact_enquiries')
      .insert({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        user_id: userId
      })
      .select('id, full_name, email, subject, status, created_at, user_id')
      .single();

     if (error) throw error;

// Send a notification to MediTrack Support
try {
  await sendSupportNotification({
    fullName: data.full_name,
    email: data.email,
    subject: data.subject,
    message: message.trim()
  });
} catch (emailError) {
  console.error(
    'Enquiry saved, but support email notification failed:',
    emailError.message
  );
}

// Return success response
return res.status(201).json({
  success: true,
  message: 'Your enquiry has been submitted successfully.',
  enquiry: data
}); 
   

  } catch (error) {
    console.error('Contact enquiry error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to submit your enquiry. Please try again.'
    });
  }
});

// Check reminders for the authenticated patient when they log in
app.post('/api/reminders/check', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Auconst auththentication required.'
      });
    }

    const accessToken = authHeader.split(' ')[1];

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired login session.'
      });
    }

    const remindersCreated = await generateDueReminders(user.id);

    return res.status(200).json({
      success: true,
      message: 'Reminder check completed successfully.',
      remindersCreated
    });
  } catch (error) {
    console.error('Reminder check error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to check appointment reminders.'
    });
  }
});

// Automatically check all patients' reminders every day at 8:00 AM Nigerian time
cron.schedule(
  '0 8 * * *',
  async () => {
    console.log('Starting daily MediTrack reminder check...');

    try {
      const remindersCreated =
        await generateDueRemindersForAllPatients();

      console.log(
        `Daily reminder check completed. ${remindersCreated} reminder(s) created.`
      );
    } catch (error) {
      console.error('Daily reminder scheduler error:', error.message);
    }
  },
  {
    timezone: 'Africa/Lagos'
  }
);

console.log('MediTrack daily reminder scheduler configured for 8:00 AM.');

// Automatically check for missed appointments every 15 minutes
cron.schedule(
  '*/15 * * * *',
  async () => {
    console.log('Starting automatic missed appointment check...');

    try {
      const missedCount = await markMissedAppointments();

      console.log(
        `Missed appointment check completed. ${missedCount} appointment(s) updated.`
      );
    } catch (error) {
      console.error('Missed appointment scheduler error:', error.message);
    }
  },
  {
    timezone: 'Africa/Lagos'
  }
);

console.log('MediTrack missed appointment scheduler configured for every 15 minutes.');

// Start Express server
app.listen(port, () => {
  console.log(`MediTrack API listening on port ${port}`);
});
