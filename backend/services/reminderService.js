import { supabase } from '../config/supabase.js';

// Get today's date in Nigerian time
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

// Add or subtract days safely
function addDays(dateString, numberOfDays) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return date.toISOString().slice(0, 10);
}

// Supported reminder preferences
const reminderDays = {
  '1_day_before': 1,
  '1 day before': 1,
  '2_days_before': 2,
  '2 days before': 2,
  '1_week_before': 7,
  '1 week before': 7,
  'appointment_day': 0,
  'on the appointment day': 0
};

// Fetch appointments and create due reminders
async function processAppointments(appointments) {
  const today = getTodayInNigeria();

  const dueAppointments = appointments.filter((appointment) => {
    const status = (appointment.status || '').trim().toLowerCase();

    if (status !== 'upcoming') return false;

    const daysBefore = reminderDays[
      (appointment.reminder_preference || '').trim().toLowerCase()
    ];

    if (daysBefore === undefined) return false;

    const reminderDate = addDays(
      appointment.appointment_date,
      -daysBefore
    );

    return reminderDate <= today;
  });

  if (dueAppointments.length === 0) return 0;

  const appointmentIds = dueAppointments.map(
    (appointment) => appointment.id
  );

  const { data: existingReminders, error: reminderError } =
    await supabase
      .from('notifications')
      .select('appointment_id')
      .eq('notification_type', 'appointment_reminder')
      .in('appointment_id', appointmentIds);

  if (reminderError) throw reminderError;

  const existingIds = new Set(
    (existingReminders || []).map(
      (reminder) => reminder.appointment_id
    )
  );

  const newNotifications = dueAppointments
    .filter((appointment) => !existingIds.has(appointment.id))
    .map((appointment) => {
      const daysBefore = reminderDays[
        (appointment.reminder_preference || '').trim().toLowerCase()
      ];

      const reminderDate = addDays(
        appointment.appointment_date,
        -daysBefore
      );

      return {
        user_id: appointment.user_id,
        appointment_id: appointment.id,
        title: 'Appointment Reminder',
        message: `Your appointment at ${appointment.facility_name} is scheduled for ${appointment.appointment_date} at ${appointment.appointment_time}.`,
        notification_type: 'appointment_reminder',
        scheduled_for: `${reminderDate}T00:00:00+01:00`
      };
    });

  if (newNotifications.length === 0) return 0;

  const { error: insertError } = await supabase
    .from('notifications')
    .insert(newNotifications);

  if (insertError) throw insertError;

  console.log(`${newNotifications.length} reminder(s) created.`);

  return newNotifications.length;
}

// Fetch appointments for one patient
async function fetchUpcomingAppointments(userId = null) {
  const today = getTodayInNigeria();
  const lastDate = addDays(today, 7);

  let query = supabase
    .from('appointments')
    .select(`
      id,
      user_id,
      facility_name,
      appointment_date,
      appointment_time,
      reminder_preference,
      status
    `)
    .gte('appointment_date', today)
    .lte('appointment_date', lastDate);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

// Check reminders for one patient
export async function generateDueReminders(userId) {
  if (!userId) {
    throw new Error('A valid patient user ID is required.');
  }

  const appointments = await fetchUpcomingAppointments(userId);

  return processAppointments(appointments);
}

// Automatically check reminders for all patients
export async function generateDueRemindersForAllPatients() {
  const appointments = await fetchUpcomingAppointments();

  if (appointments.length === 0) {
    console.log('No appointments found for reminder checking.');
    return 0;
  }

  return processAppointments(appointments);
}

