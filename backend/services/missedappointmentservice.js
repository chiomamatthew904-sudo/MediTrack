
import { supabase } from '../config/supabase.js';

// Get the current date and time in Nigeria
function getNigeriaDateTime() {
  const now = new Date();

  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);

  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);

  const getValue = (parts, type) =>
    parts.find(part => part.type === type).value;

  return {
    today: `${getValue(dateParts, 'year')}-${getValue(dateParts, 'month')}-${getValue(dateParts, 'day')}`,
    currentTime: `${getValue(timeParts, 'hour')}:${getValue(timeParts, 'minute')}:${getValue(timeParts, 'second')}`
  };
}

// Automatically mark overdue appointments as missed
export async function markMissedAppointments() {
  try {
    const { today, currentTime } = getNigeriaDateTime();

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time')
      .eq('status', 'Upcoming')
      .lte('appointment_date', today);

    if (error) throw error;

    if (!appointments || appointments.length === 0) {
      return 0;
    }

    const missedIds = appointments
      .filter(appointment => {
        if (appointment.appointment_date < today) {
          return true;
        }

        return appointment.appointment_time <= currentTime;
      })
      .map(appointment => appointment.id);

    if (missedIds.length === 0) {
      return 0;
    }

    const { data, error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'Missed' })
      .in('id', missedIds)
      .eq('status', 'Upcoming')
      .select('id');

    if (updateError) throw updateError;

    console.log(`${data.length} appointment(s) automatically marked as Missed.`);

    return data.length;

  } catch (error) {
    console.error('Missed appointment check error:', error.message);
    throw error;
  }
}

