
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEnquiryReply({ to, subject, message }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MediTrack <onboarding@resend.dev>',
      to,
      subject: `Re: ${subject}`,
      text: message
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('Email sending error:', error.message);
    throw error;
  }
}
