
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send Supabase authentication emails
export async function sendAuthEmail({
  to,
  actionType,
  confirmationUrl,
  token,
  oldEmail,
  newEmail,
  phone,
  oldPhone,
  provider,
  factorType
}) {
  const emailDetails = {
    signup: {
      subject: 'Confirm Your MediTrack Account',
      heading: 'Welcome to MediTrack!',
      message: 'Please confirm your email address to complete your registration.'
    },
    recovery: {
      subject: 'Reset Your MediTrack Password',
      heading: 'Password Reset Request',
      message: 'We received a request to reset your MediTrack password.'
    },
    email_change: {
      subject: 'Confirm Your MediTrack Email Change',
      heading: 'Confirm Your Email Change',
      message: 'Please confirm your email address using the link below.'
    },
    email_change_new: {
      subject: 'Confirm Your MediTrack Email Change',
      heading: 'Confirm Your Email Change',
      message: 'Please confirm your email address using the link below.'
    },
    invite: {
      subject: 'You Have Been Invited to MediTrack',
      heading: 'MediTrack Invitation',
      message: 'You have been invited to join MediTrack.'
    },
    magiclink: {
      subject: 'Your MediTrack Login Link',
      heading: 'Sign in to MediTrack',
      message: 'Use the link below to sign in to your account.'
    },
    email: {
      subject: 'Your MediTrack Verification Link',
      heading: 'Verify Your Email',
      message: 'Use the link below to verify your email address.'
   },
    reauthentication: {
      subject: 'Your MediTrack Verification Code',
      heading: 'Confirm Your Identity',
      message: 'Use the verification code below to confirm your identity.'
    },
    password_changed_notification: {
      subject: 'Your MediTrack Password Was Changed',
      heading: 'Password Changed',
      message: 'Your MediTrack account password has been changed.'
    },
    email_changed_notification: {
      subject: 'Your MediTrack Email Was Changed',
      heading: 'Email Address Changed',
      message: 'Your MediTrack account email address has been changed.'
    },
    phone_changed_notification: {
      subject: 'Your MediTrack Phone Number Was Changed',
      heading: 'Phone Number Changed',
      message: 'Your MediTrack account phone number has been changed.'
    },
    identity_linked_notification: {
      subject: 'A Sign-in Method Was Added to MediTrack',
      heading: 'Sign-in Method Added',
      message: 'A new sign-in method has been linked to your MediTrack account.'
    },
    identity_unlinked_notification: {
      subject: 'A Sign-in Method Was Removed from MediTrack',
      heading: 'Sign-in Method Removed',
      message: 'A sign-in method has been unlinked from your MediTrack account.'
    },
    mfa_factor_enrolled_notification: {
      subject: 'A Verification Method Was Added to MediTrack',
      heading: 'Verification Method Added',
      message: 'A new multi-factor authentication method has been added to your account.'
    },
    mfa_factor_unenrolled_notification: {
      subject: 'A Verification Method Was Removed from MediTrack',
      heading: 'Verification Method Removed',
      message: 'A multi-factor authentication method has been removed from your account.'
    }
  };

  const details = emailDetails[actionType];

  if (!details) {
    throw new Error(`Unsupported authentication email type: ${actionType}`);
  }

  const isReauthentication = actionType === 'reauthentication';
  const isSecurityNotification = actionType.endsWith('_notification');

  if (isReauthentication && !token) {
    throw new Error('Missing reauthentication verification code.');
  }

  if (!isReauthentication && !isSecurityNotification && !confirmationUrl) {
    throw new Error('Missing authentication confirmation link.');
  }

  const extraDetails = [
    oldEmail ? `Previous email: ${oldEmail}` : '',
    newEmail ? `New email: ${newEmail}` : '',
    phone ? `Phone number: ${phone}` : '',
    oldPhone ? `Previous phone number: ${oldPhone}` : '',
    provider ? `Sign-in provider: ${provider}` : '',
    factorType ? `Verification method: ${factorType}` : ''
  ].filter(Boolean).join('\n');

  const textContent = [
    details.message,
    token ? `\nYour verification code is: ${token}` : '',
    confirmationUrl ? `\nContinue here: ${confirmationUrl}` : '',
    extraDetails ? `\n${extraDetails}` : '',
    '\nIf you did not make this request, please contact MediTrack Support.'
  ].filter(Boolean).join('\n');

  const linkHtml = confirmationUrl
    ? `<p>
        <a href="${confirmationUrl}"
          style="display:inline-block;background:#159b8c;color:white;padding:12px 22px;text-decoration:none;border-radius:6px;">
          Continue to MediTrack
        </a>
      </p>
      <p>If the button does not work, copy this link into your browser:</p>
      <p>${confirmationUrl}</p>`
    : '';

  const tokenHtml = token
    ? `<p style="font-size:22px;font-weight:bold;letter-spacing:3px;">${token}</p>`
    : '';

  const info = await transporter.sendMail({
    from: {
      name: process.env.EMAIL_FROM || 'MediTrack Support',
      address: process.env.EMAIL_USER
    },
    to,
    subject: details.subject,
    text: textContent,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#333;">
        <h2 style="color:#159b8c;">${details.heading}</h2>
        <p>${details.message}</p>
        ${tokenHtml}
        ${linkHtml}
        ${extraDetails ? `<p>${extraDetails.replace(/\n/g, '<br>')}</p>` : ''}
        <p>If you did not make this request, please contact MediTrack Support.</p>
        <p>Regards,<br>MediTrack Support</p>
      </div>
    `
  });

  return { success: true, data: info };
}


// Reply to patient enquiries
export async function sendEnquiryReply({ to, subject, message }) {
  try {
    const info = await transporter.sendMail({
      from: {
        name: process.env.EMAIL_FROM || 'MediTrack Support',
        address: process.env.EMAIL_USER
      },
      to,
      subject: `Re: ${subject}`,
      text: message
    });

    return {
      success: true,
      data: info
    };

  } catch (error) {
    console.error('Email sending error:', error.message);
    throw error;
  }
}

// Notify MediTrack Support about new enquiries
export async function sendSupportNotification({
  fullName,
  email,
  subject,
  message
}) {
  try {
    const info = await transporter.sendMail({
      from: {
        name: process.env.EMAIL_FROM || 'MediTrack Support',
        address: process.env.EMAIL_USER
      },
      to: process.env.MEDITRACK_SUPPORT_EMAIL,
      replyTo: email,
      subject: `New MediTrack Enquiry: ${subject}`,
      text: `
A new enquiry has been submitted through MediTrack.

Patient Name: ${fullName}
Patient Email: ${email}

Subject: ${subject}

Message:
${message}
      `
    });

    return {
      success: true,
      data: info
    };

  } catch (error) {
    console.error('Support notification error:', error.message);
    throw error;
  }
}

