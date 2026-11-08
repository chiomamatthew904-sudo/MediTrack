import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default reminder settings state
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    defaultPreference: '1 day before',
    channels: {
      inApp: true,
      email: true,
      browser: false
    }
  });

  // Fetch notifications from Supabase for the authenticated user only
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
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

      // Map Supabase rows to match your UI expected properties if necessary
      const formatted = (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        description: n.message,
        category: n.notification_type === 'appointment_reminder' ? 'Appointment Reminder' : 
                  n.notification_type === 'appointment_update' ? 'Appointment Updated' : 'General',
        isRead: n.is_read,
        time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        group: isToday(n.created_at) ? 'Today' : isYesterday(n.created_at) ? 'Yesterday' : 'Earlier',
        relatedPath: n.appointment_id ? '/dashboard/my-appointments' : '/dashboard'
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Helper date checkers
  function isToday(dateStr) {
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  function isYesterday(dateStr) {
    const d = new Date(dateStr);
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    return d.toDateString() === yest.toDateString();
  }

  // Calculate unread count from actual records
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err.message);
    }
  };

  // Mark single notification as unread
  const markAsUnread = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    } catch (err) {
      console.error('Error marking notification as unread:', err.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err.message);
    }
  };

  // Update reminder settings
  const updateSettings = (newSettings) => {
    setReminderSettings(newSettings);
    // Future expansion: save preferences to a user_profiles or settings table if needed
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