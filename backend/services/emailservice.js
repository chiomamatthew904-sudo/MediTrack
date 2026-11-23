
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEnquiryReply({ to, subject, message }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
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

export async function sendSupportNotification({
  fullName,
  email,
  subject,
  message
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
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

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('Support notification error:', error.message);
    throw error;
  }
}
