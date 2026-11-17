
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { supabase } from '../supabaseClient';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default reminder settings
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    defaultPreference: '1 day before',
    channels: {
      inApp: true,
      email: true,
      browser: false
    }
  });

  // Fetch notifications belonging to the authenticated patient

// Fetch the authenticated patient's notification settings
const fetchReminderSettings = async () => {
  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) return;

    const { data, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (settingsError) throw settingsError;

    if (data) {
      setReminderSettings({
        enabled: data.enabled,
        defaultPreference: data.default_preference,
        channels: data.channels
      });
    }
  } catch (err) {
    console.error('Error fetching reminder settings:', err);
  }
};

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotifications([]);

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setNotifications([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formatted = (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        description: n.message,

      category:
       n.notification_type === 'appointment_reminder'
         ? 'Appointment Reminder'
          : n.notification_type === 'appointment_update'
         ? 'Appointment Updated'
          : n.notification_type === 'enquiry_reply'
         ? 'Enquiry Reply'
          : 'General',

        isRead: n.is_read,

        time: new Date(n.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),

        group: isToday(n.created_at)
          ? 'Today'
          : isYesterday(n.created_at)
          ? 'Yesterday'
          : 'Earlier',

        relatedPath: n.appointment_id
          ? '/dashboard/my-appointment'
          : '/dashboard'
      }));

      setNotifications(formatted);

    } catch (err) {
      console.error('Error fetching notifications:', err.message);
      setError('Failed to load notifications.');

    } finally {
      setLoading(false);
    }
  };

  // Check reminders when an authenticated patient opens MediTrack
  useEffect(() => {
    let isMounted = true;

    let notificationChannel = null;


const subscribeToNotifications = (userId, accessToken) => {
  // Ensure the patient's authentication token is available
  if (!accessToken) {
    console.error('Realtime authentication token is missing.');
    return;
  }

  // Set the authenticated user's token for Realtime
  supabase.realtime.setAuth(accessToken);

  // Remove any previous subscription
  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
  }

  notificationChannel = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('NEW NOTIFICATION EVENT RECEIVED:', payload);

        const n = payload.new;

        const formattedNotification = {
          id: n.id,
          title: n.title,
          description: n.message,
          category:
            n.notification_type === 'appointment_reminder'
              ? 'Appointment Reminder'
              : n.notification_type === 'appointment_update'
              ? 'Appointment Updated'
              : n.notification_type === 'enquiry_reply'
              ? 'Enquiry Reply'
              : 'General',
          isRead: n.is_read,
          time: new Date(n.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          group: isToday(n.created_at)
            ? 'Today'
            : isYesterday(n.created_at)
            ? 'Yesterday'
            : 'Earlier',
          relatedPath: n.appointment_id
            ? '/dashboard/my-appointment'
            : '/dashboard'
        };

        setNotifications((prev) => {
          if (prev.some((item) => item.id === n.id)) {
            return prev;
          }

          return [formattedNotification, ...prev];
        });
      }
    )
  
    .subscribe((status, err) => {
  console.log('Notification Realtime status:', status);

  if (err) {
    console.error('Notification Realtime error:', err);
  }

  if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
    console.error('Realtime subscription failed:', err);
  }
});
};
    
    const checkRemindersAndRefresh = async (session) => {
      if (!session?.access_token) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/reminders/check',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || 'Unable to check appointment reminders.'
          );
        }

        console.log(
          `${result.remindersCreated} new reminder(s) created.`
        );

      } catch (err) {
        console.error('Reminder check error:', err.message);
      } 
      finally {
        // Fetch saved preferences and notifications
        if (isMounted) {
          await fetchReminderSettings();
          await fetchNotifications();
        }
      }
    };

    // Listen for the initial session and future sign-ins
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {

        if (session?.user?.id) {
       subscribeToNotifications(
       session.user.id,
       session.access_token
     );
    }
        // Run after the auth callback has finished
        setTimeout(() => {
          if (isMounted) {
            checkRemindersAndRefresh(session);
          }
        }, 0);
      }

     if (event === 'SIGNED_OUT') {
  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
    notificationChannel = null;
  }

  setNotifications([]);
  setLoading(false);
}

    });

   return () => {
  isMounted = false;
  subscription.unsubscribe();

  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
    notificationChannel = null;
  }
};

  }, []);

  // Helper date checkers
  function isToday(dateStr) {
    const d = new Date(dateStr);
    const today = new Date();

    return d.toDateString() === today.toDateString();
  }

  function isYesterday(dateStr) {
    const d = new Date(dateStr);
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return d.toDateString() === yesterday.toDateString();
  }

  // Calculate unread count
  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  // Mark one notification as read
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );

    } catch (err) {
      console.error('Error marking notification as read:', err.message);
    }
  };

  // Mark one notification as unread
  const markAsUnread = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: false } : n
        )
      );

    } catch (err) {
      console.error('Error marking notification as unread:', err.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

    } catch (err) {
      console.error('Error marking all as read:', err.message);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );

    } catch (err) {
      console.error('Error deleting notification:', err.message);
    }
  };

 
// Update and save reminder settings to Supabase
const updateSettings = async (newSettings) => {
  try {
    setError(null);

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      throw new Error('Please log in to save notification preferences.');
    }

    const { error: saveError } = await supabase
      .from('notification_settings')
      .upsert(
        {
          user_id: user.id,
          enabled: newSettings.enabled,
          default_preference: newSettings.defaultPreference,
          channels: newSettings.channels,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );

    if (saveError) throw saveError;

    setReminderSettings(newSettings);

    return { success: true };

  } catch (err) {
    console.error('Error saving notification settings:', err);
    setError(err.message || 'Failed to save notification settings.');

    return { success: false, error: err.message };
  }
};


  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        reminderSettings,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        updateSettings,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
