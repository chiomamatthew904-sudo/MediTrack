
import cron from 'node-cron';
import { supabase } from '../config/supabase.js';

// Get today's date in Nigerian time (Africa/Lagos)
function getTodayInNigeria() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  return `${values.year}-${values.month}-${values.day}`;
}

// Add or subtract days without timezone problems
function addDays(dateString, numberOfDays) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return date.toISOString().slice(0, 10);
}

// Check appointments and create due reminders
export async function generateDueReminders() {
  const today = getTodayInNigeria();
  const lastDate = addDays(today, 7);

  // Number of days before the appointment for each preference
  const reminderDays = {
    '1_day_before': 1,
    '2_days_before': 2,
    '1_week_before': 7,
    'appointment_day': 0
  };

  // Get upcoming appointments within the next seven days
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      user_id,
      facility_name,
      appointment_date,
      appointment_time,
      reminder_preference
    `)
    .eq('status', 'upcoming')
    .gte('appointment_date', today)
    .lte('appointment_date', lastDate);

  if (error) {
    throw error;
  }

  if (!appointments || appointments.length === 0) {
    console.log('No upcoming appointments found.');
    return 0;
  }

  // Find appointments whose reminder date is today
  const dueAppointments = appointments.filter((appointment) => {
    const daysBefore = reminderDays[appointment.reminder_preference];

    if (daysBefore === undefined) {
      return false;
    }

    const reminderDate = addDays(
      appointment.appointment_date,
      -daysBefore
    );

    return reminderDate === today;
  });

  if (dueAppointments.length === 0) {
    console.log('No reminders are due today.');
    return 0;
  }

  // Check which reminders have already been created
  const appointmentIds = dueAppointments.map(
    (appointment) => appointment.id
  );

  const { data: existingReminders, error: reminderError } =
    await supabase
      .from('notifications')
      .select('appointment_id')
      .eq('notification_type', 'appointment_reminder')
      .in('appointment_id', appointmentIds);

  if (reminderError) {
    throw reminderError;
  }

  const existingIds = new Set(
    (existingReminders || []).map(
      (reminder) => reminder.appointment_id
    )
  );

  // Prepare notifications only for appointments without a reminder
  const newNotifications = dueAppointments
    .filter((appointment) => !existingIds.has(appointment.id))
    .map((appointment) => ({
      user_id: appointment.user_id,
      appointment_id: appointment.id,
      title: 'Appointment Reminder',
      message: `Your appointment at ${appointment.facility_name} is scheduled for ${appointment.appointment_date} at ${appointment.appointment_time}.`,
      notification_type: 'appointment_reminder',
      scheduled_for: `${today}T08:00:00+01:00`
    }));

  if (newNotifications.length === 0) {
    console.log('All due reminders have already been created.');
    return 0;
  }

  // Save the new reminders in Supabase
  const { error: insertError } = await supabase
    .from('notifications')
    .insert(newNotifications);

  if (insertError) {
    throw insertError;
  }

  console.log(`${newNotifications.length} reminder(s) created.`);

  return newNotifications.length;
}

// Run the reminder check every day at 8:00 AM Nigerian time
export function startReminderScheduler() {
  cron.schedule(
    '0 8 * * *',
    async () => {
      try {
        console.log('Checking for due appointment reminders...');
        await generateDueReminders();
      } catch (error) {
        console.error('Reminder scheduler error:', error.message);
      }
    },
    {
      timezone: 'Africa/Lagos'
    }
  );

  console.log('Reminder scheduler started.');
}
