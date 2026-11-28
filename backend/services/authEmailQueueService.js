
import { supabase } from '../config/supabase.js';
import { sendAuthEmail } from './emailservice.js';

// Process pending authentication emails
export async function processAuthEmailQueue() {
  // Safely claim up to 5 pending emails
  const { data: queuedEmails, error } = await supabase.rpc(
    'claim_auth_email_queue',
    { batch_size: 5 }
  );

  if (error) {
    console.error('Error claiming authentication emails:', error.message);
    return;
  }

  if (!queuedEmails || queuedEmails.length === 0) {
    return;
  }

  for (const queuedEmail of queuedEmails) {
    try {
     const { user, email_data } = queuedEmail.payload || {};

if (!user || !email_data) {
  throw new Error('Invalid authentication email payload.');
}

const actionType = email_data.email_action_type;

if (typeof actionType !== 'string' || !actionType.trim()) {
  throw new Error('Missing or invalid authentication email action type.');
}

      // Build the Supabase confirmation link
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

      // Handle secure email changes
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

        await sendAuthEmail({
          to: user.email,
          actionType,
          confirmationUrl: buildConfirmationUrl(
            email_data.token_hash_new
          ),
          token: email_data.token,
          oldEmail: user.email,
          newEmail: user.new_email
        });

        await sendAuthEmail({
          to: user.new_email,
          actionType,
          confirmationUrl: buildConfirmationUrl(
            email_data.token_hash
          ),
          token: email_data.token_new,
          oldEmail: user.email,
          newEmail: user.new_email
        });
      } else {
        if (!user.email) {
          throw new Error('Missing authentication email recipient.');
        }

        const isReauthentication =
          actionType === 'reauthentication';

        const isNotification =
          actionType.endsWith('_notification');

        let confirmationUrl;

        if (!isReauthentication && !isNotification) {
          confirmationUrl = buildConfirmationUrl(
            email_data.token_hash
          );
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

      // Mark the email as successfully sent
      const { error: sentError } = await supabase
        .from('auth_email_queue')
        .update({
          status: 'sent',
          processing_at: null,
          last_error: null
        })
        .eq('id', queuedEmail.id)
        .eq('status', 'processing');

      if (sentError) {
        console.error(
          'Email sent, but status update failed:',
          sentError.message
        );
      } else {
        console.log(
          `Authentication email ${queuedEmail.id} sent successfully.`
        );
      }

    } catch (sendError) {
      console.error(
        'Authentication email failed:',
        sendError.message
      );

      // Retry up to 5 times
      const newStatus =
        queuedEmail.attempts >= 5 ? 'failed' : 'pending';

      const { error: failedUpdateError } = await supabase
        .from('auth_email_queue')
        .update({
          status: newStatus,
          processing_at: null,
          last_error: sendError.message
        })
        .eq('id', queuedEmail.id)
        .eq('status', 'processing');

      if (failedUpdateError) {
        console.error(
          'Could not update failed email:',
          failedUpdateError.message
        );
      }
    }
  }
}

