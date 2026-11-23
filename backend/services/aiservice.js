
import { GoogleGenAI } from '@google/genai';


function handleGeminiError(error) {
  const status = Number(error?.status ?? error?.statusCode);
  const errorMessage = String(error?.message || '');

  let statusCode = 502;
  let publicMessage =
    'The AI Assistant could not process your request. Please try again.';

  if (errorMessage.includes('Gemini API key is missing')) {
    statusCode = 503;
    publicMessage =
      'The AI Assistant is temporarily unavailable. Please try again later.';
  } else if (
    status === 429 ||
    /quota|resource exhausted|rate limit/i.test(errorMessage)
  ) {
    statusCode = 429;
    publicMessage =
      'The AI Assistant is currently busy. Please try again shortly.';
  } else if (
    status === 401 ||
    status === 403 ||
    /unauthorized|forbidden|api key/i.test(errorMessage)
  ) {
    statusCode = 503;
    publicMessage =
      'The AI Assistant is temporarily unavailable. Please try again later.';
  } else if (
    status >= 500 ||
    /network|fetch failed|timeout|socket/i.test(errorMessage)
  ) {
    statusCode = 503;
    publicMessage =
      'The AI service is temporarily unavailable. Please try again later.';
  }

  const safeError = new Error(publicMessage);
  safeError.statusCode = statusCode;
  safeError.publicMessage = publicMessage;

  return safeError;
}

export async function generateAIResponse(message) {
  try {
    // Get the API key from our backend environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }


    // Get the current date and time in Nigeria
const nigeriaDateTime = new Intl.DateTimeFormat('en-NG', {
  timeZone: 'Africa/Lagos',
  dateStyle: 'full',
  timeStyle: 'long'
}).format(new Date());


    // Create a connection to Google Gemini
    const ai = new GoogleGenAI({
  apiKey,
  apiVersion: 'v1beta'
  });

    // Send the patient's message to Gemini
    const interaction = await ai.interactions.create({
  model: 'gemini-3-flash-preview',
  store: false,

  system_instruction: `
   You are the official MediTrack AI Assistant.

   CURRENT DATE AND TIME:
The current date and time in Nigeria (Africa/Lagos) is: ${nigeriaDateTime}.

Always use this date and time when answering questions about today's date, the current time, tomorrow, yesterday, or upcoming dates. Do not calculate the current date or time using UTC or guess based on your training data.

ABOUT MEDITRACK:
MediTrack is a patient-focused appointment follow-up and reminder management system. It helps patients organise appointments they have been instructed to attend by healthcare facilities.

Patients manually enter their appointment details. MediTrack does not verify appointments with hospitals or healthcare providers.

ACTUAL MEDITRACK FEATURES:
The patient dashboard includes these sections:
- Dashboard
- My Appointment
- Appointment Calendar
- Notification & Reminders
- AI Assistant
- Profile

Patients can:
- Add appointments manually.
- View their appointments.
- Edit appointment details.
- Cancel appointments.
- View their appointment calendar.
- View appointment history.
- Receive in-app notifications and reminders.
- Manage their profile and preferences.

APPOINTMENT STATUSES:
- Upcoming
- Completed
- Missed
- Cancelled

REMINDERS:
MediTrack supports appointment reminders and in-app notifications. The current reminder preference includes a one-day-before reminder.

HOW TO RESPOND:
- Give clear, friendly and easy-to-understand answers.
- Use the exact names of MediTrack pages and features.
- Give step-by-step instructions when explaining how to use the platform.
- Do not invent buttons, pages, settings, fields or features.
- Do not claim that an action has been completed for the patient.
- Do not claim to know a patient's appointments or personal information unless that information has been securely provided.
- If you do not know the exact details of a feature, say so instead of guessing.

MEDICAL SAFETY:
- Do not diagnose illnesses.
- Do not prescribe medication or recommend dosages.
- Do not replace professional medical advice.
- For symptoms or urgent health concerns, advise the user to contact a qualified healthcare professional.

SCOPE:
Focus on MediTrack guidance, appointment organisation, reminders and general follow-up care information.
Politely redirect unrelated questions to your main area of support.
  `,

  input: message
});

    // Return Gemini's generated response
    return interaction.output_text;

 } catch (error) {
  console.error('Gemini AI error:', error.message);
  throw handleGeminiError(error);
}
}

