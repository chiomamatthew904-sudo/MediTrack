import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Mail,
  Globe,
  Trash2,
  Eye,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Save,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNotifications } from '../../context/notificationcontext';
import { useAppointments } from '../../context/appointmentcontext';

export default function NotificationsPage() {
  const navigate = useNavigate();

  const notificationContext = useNotifications() || {};
  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    error = null,
    reminderSettings = {},
    markAsRead = () => {},
    markAsUnread = () => {},
    markAllAsRead = () => {},
    deleteNotification = () => {},
    updateSettings = () => {}
  } = notificationContext;

  const appointmentContext = useAppointments() || {};
  const { appointments = [] } = appointmentContext;

  // Local state for filters
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  // Local state for settings form feedback
  const [settingsForm, setSettingsForm] = useState(reminderSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Filter Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'Unread') return !n.isRead;
      if (activeFilter === 'Read') return n.isRead;
      if (activeFilter === 'Appointment Reminders') return n.category === 'Appointment Reminder';
      if (activeFilter === 'Appointment Updates') return n.category === 'Appointment Updated' || n.category === 'Appointment Cancelled';
      return true; // 'All'
    });
  }, [notifications, activeFilter]);

  // Pagination for notifications list
  const totalPages = Math.ceil(filteredNotifications.length / recordsPerPage) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredNotifications.slice(start, start + recordsPerPage);
  }, [filteredNotifications, currentPage]);

  // Group notifications by Today, Yesterday, Earlier
  const groupedNotifications = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    paginatedNotifications.forEach((n) => {
      if (groups[n.group]) {
        groups[n.group].push(n);
      } else {
        groups['Earlier'].push(n);
      }
    });
    return groups;
  }, [paginatedNotifications]);

  // 2. Upcoming Reminders from Shared Appointment Context
  const upcomingReminders = useMemo(() => {
    return appointments.filter((app) => {
      const st = (app.status || '').toLowerCase();
      return st !== 'completed' && st !== 'missed' && st !== 'cancelled';
    });
  }, [appointments]);

  // Summary Card Counts
  const totalNotificationsCount = notifications.length;
  const readNotificationsCount = notifications.filter((n) => n.isRead).length;

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="notifications-page-container">
      
      {/* 1. PAGE HEADER */}
      <div className="page-header-section">
        <div className="header-titles">
          <div className="title-with-badge">
            <h1 className="page-title">Notifications &amp; Reminders</h1>
            <span className="heading-unread-pill">{unreadCount} unread</span>
          </div>
          <p className="page-description">
            Stay updated and never miss an important hospital appointment.
          </p>
        </div>
        <button onClick={markAllAsRead} className="btn-mark-all-read">
          <Check size={16} /> Mark All as Read
        </button>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box teal-bg">
            <Bell size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{totalNotificationsCount}</span>
            <span className="metric-label">Total Notifications</span>
            <span className="metric-sub">All notifications</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box mint-bg">
            <Mail size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{unreadCount}</span>
            <span className="metric-label">Unread</span>
            <span className="metric-sub">New notifications</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green-bg">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{readNotificationsCount}</span>
            <span className="metric-label">Read</span>
            <span className="metric-sub">Viewed notifications</span>
          </div>
        </div>
      </div>

      {/* 3. RECENT NOTIFICATIONS SECTION */}
      <div className="section-card">
        <div className="notifications-toolbar">
          <div className="toolbar-title-group">
            <Bell size={18} className="text-teal" />
            <h2>Recent Notifications</h2>
          </div>
          <div className="filter-pills-group">
            {['All', 'Unread', 'Read', 'Appointment Reminders', 'Appointment Updates'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setCurrentPage(1);
                }}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="notifications-list-wrapper">
          {loading ? (
            <div className="empty-notifications">
              <p>Loading notifications from database...</p>
            </div>
          ) : error ? (
            <div className="empty-notifications" style={{ color: '#DC2626' }}>
              <p>{error}</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            Object.entries(groupedNotifications).map(([groupName, groupItems]) => {
              if (groupItems.length === 0) return null;
              return (
                <div key={groupName} className="notification-group-block">
                  <h3 className="group-title">{groupName}</h3>
                  <div className="group-items">
                    {groupItems.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-card-item ${notif.isRead ? 'read-item' : 'unread-item'}`}
                      >
                        <div className="notif-card-left">
                          <div className="notif-icon-circle">
                            <Calendar size={18} />
                          </div>
                          <div className="notif-details">
                            <div className="notif-title-row">
                              <h4>{notif.title}</h4>
                              <span className={`status-pill ${notif.isRead ? 'read-pill' : 'unread-pill'}`}>
                                {notif.isRead ? 'Read' : 'Unread'}
                              </span>
                            </div>
                            <p className="notif-desc">{notif.description}</p>
                            <span className="notif-time">
                              <Clock size={12} /> {notif.time}
                            </span>
                          </div>
                        </div>

                        <div className="notif-card-actions">
                          <button
                            onClick={() => navigate(notif.relatedPath)}
                            className="btn-notif-action view-action"
                            title="View Associated Page"
                          >
                            <Eye size={14} /> View
                          </button>

                          {/* Toggle between Mark Read and Mark Unread based on current status */}
                          {!notif.isRead ? (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="btn-notif-action read-action"
                              title="Mark as Read"
                            >
                              Mark Read
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsUnread(notif.id)}
                              className="btn-notif-action read-action"
                              title="Mark as Unread"
                            >
                              Mark Unread
                            </button>
                          )}

                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="btn-notif-action delete-action"
                            title="Delete Notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-notifications">
              <Bell size={36} className="empty-icon" />
              <h3>No notifications found</h3>
              <p>You have no notifications matching this filter.</p>
            </div>
          )}
        </div>

        {/* Pagination footer */}
        <div className="table-footer">
          <span className="record-count-text">
            Showing {filteredNotifications.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}-
            {Math.min(currentPage * recordsPerPage, filteredNotifications.length)} of{' '}
            {filteredNotifications.length} notifications
          </span>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="page-nav-btn"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. UPCOMING REMINDERS SECTION */}
      <div className="upcoming-reminders-section">
        <div className="section-card">
          <div className="upcoming-header-flex">
            <div className="header-title-group">
              <div className="header-icon-box">
                <Calendar size={18} />
              </div>
              <h2>Upcoming Reminders</h2>
            </div>
            <Link to="/dashboard/calendar" className="view-calendar-link">
              View Calendar <ArrowRight size={16} />
            </Link>
          </div>

          <div className="upcoming-cards-grid">
            {upcomingReminders.length > 0 ? (
              upcomingReminders.slice(0, 3).map((app, idx) => {
                const dateStr = app.appointment_date || '2026-11-10';
                const [year, month, day] = dateStr.split('-');
                const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[parseInt(month, 10)] || 'Nov';

                return (
                  <div key={app.id || idx} className="upcoming-reminder-card">
                    <div className="reminder-card-top">
                      <div className="reminder-date-badge">
                        <span className="rem-day">{day || '10'}</span>
                        <span className="rem-mon">{monthName}</span>
                      </div>
                      <div className="reminder-info">
                        <h4>{app.reason || 'Medical Checkup'}</h4>
                        <p>{app.facility_name || app.hospital || 'General Hospital'} • {app.appointment_time || app.time || '10:30 AM'}</p>
                      </div>
                    </div>

                    <div className="reminder-card-bottom">
                      <div className="reminder-timing-note">
                        <Bell size={13} className="text-teal" />
                        <span>Reminder: {app.reminder_preference || '1 day before'}</span>
                      </div>
                      <span className="status-pill scheduled-pill">Scheduled</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-reminders">
                <p>No upcoming appointments found to generate reminders.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. REMINDER SETTINGS SECTION */}
      <div className="section-card settings-card">
        <div className="settings-header">
          <div className="header-title-group">
            <Bell size={18} className="text-teal" />
            <h2>Reminder Settings</h2>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="settings-form">
          <div className="setting-block">
            <div className="setting-label-row">
              <div>
                <h4>Enable Appointment Reminders</h4>
                <span>Get notified about your upcoming appointments</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settingsForm.enabled ?? true}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, enabled: e.target.checked })
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="setting-block">
            <h4>Reminder Preference</h4>
            <p className="setting-subtitle">When would you like to be reminded?</p>
            <div className="radio-options-list">
              {[
                '1 day before',
                '2 days before',
                '1 week before',
                'On the appointment day'
              ].map((pref) => (
                <label key={pref} className="radio-label">
                  <input
                    type="radio"
                    name="reminderPref"
                    value={pref}
                    checked={settingsForm.defaultPreference === pref}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, defaultPreference: e.target.value })
                    }
                  />
                  <span>{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="setting-block">
            <h4>Notification Channels</h4>
            <p className="setting-subtitle">Choose how you want to receive notifications</p>
            
            <div className="channels-grid-row">
              <div className="channel-toggle-row">
                <div className="channel-info">
                  <Calendar size={16} className="text-teal" />
                  <div>
                    <strong>In-app Notifications</strong>
                    <p>Show alerts in MediTrack</p>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settingsForm.channels?.inApp ?? true}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        channels: { ...settingsForm.channels, inApp: e.target.checked }
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="channel-toggle-row">
                <div className="channel-info">
                  <Mail size={16} className="text-teal" />
                  <div>
                    <strong>Email Notifications</strong>
                    <p>Send reminders to your email</p>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settingsForm.channels?.email ?? true}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        channels: { ...settingsForm.channels, email: e.target.checked }
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="channel-toggle-row">
                <div className="channel-info">
                  <Globe size={16} className="text-teal" />
                  <div>
                    <strong>Browser Notifications</strong>
                    <p>Get alerts in your browser</p>
                  </div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settingsForm.channels?.browser ?? false}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        channels: { ...settingsForm.channels, browser: e.target.checked }
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div className="success-feedback-banner">
              <CheckCircle2 size={16} /> Preferences saved successfully!
            </div>
          )}

          <button type="submit" className="btn-save-preferences">
            <Save size={16} /> Save Preferences
          </button>
        </form>
      </div>

      {/* INTERNAL STYLING */}
      <style>{`
        .notifications-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* PAGE HEADER */
        .page-header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 24px 32px;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .title-with-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: #0F2926;
          letter-spacing: -0.02em;
        }

        .heading-unread-pill {
          background: #FEE2E2;
          color: #DC2626;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .page-description {
          font-size: 14px;
          color: #4A6360;
        }

        .btn-mark-all-read {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .btn-mark-all-read:hover {
          background: #066658;
        }

        /* METRICS SUMMARY CARDS */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric-card {
          background: #FFFFFF;
          border: 1px solid #E1F0EE;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 15px rgba(8, 127, 110, 0.03);
        }

        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .teal-bg { background: #E8F8F5; color: #087F6E; }
        .mint-bg { background: #F0FDF4; color: #16A34A; }
        .green-bg { background: #DCFCE7; color: #15803D; }

        .metric-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 800;
          color: #0F2926;
          line-height: 1.1;
        }
        .metric-label {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }
        .metric-sub {
          font-size: 11px;
          color: #64748B;
        }

        .section-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          padding: 24px;
        }

        /* NOTIFICATIONS TOOLBAR */
        .notifications-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F1F5F9;
          flex-wrap: wrap;
        }

        .toolbar-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toolbar-title-group h2 {
          font-size: 16px;
          font-weight: 800;
          color: #0F2926;
        }
        .text-teal { color: #087F6E; }

        .filter-pills-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-pill {
          background: #F8FCFC;
          border: 1px solid #CBD5E1;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #4A6360;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-pill.active {
          background: #087F6E;
          color: #FFFFFF;
          border-color: #087F6E;
        }
        .filter-pill:hover:not(.active) {
          background: #E8F8F5;
          border-color: #087F6E;
        }

        /* NOTIFICATIONS LIST */
        .notifications-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .group-title {
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .group-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-card-item {
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .notification-card-item.unread-item {
          background: #F4FAF9;
          border-color: #D4F3EE;
        }

        .notif-card-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          flex: 1;
        }

        .notif-icon-circle {
          width: 38px;
          height: 38px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .notif-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .notif-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .notif-title-row h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
        }

        .status-pill {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .unread-pill { background: #E8F8F5; color: #087F6E; }
        .read-pill { background: #F1F5F9; color: #64748B; }

        .notif-desc {
          font-size: 13px;
          color: #4A6360;
          line-height: 1.4;
        }

        .notif-time {
          font-size: 11px;
          color: #64748B;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .notif-card-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .btn-notif-action {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.2s ease;
        }
        .view-action { background: #E8F8F5; color: #087F6E; }
        .view-action:hover { background: #D1F3EE; }
        .read-action { background: #F1F5F9; color: #475569; }
        .read-action:hover { background: #E2E8F0; }
        .delete-action { background: #FEE2E2; color: #DC2626; }
        .delete-action:hover { background: #FECACA; }

        .empty-notifications {
          text-align: center;
          padding: 40px 20px;
          color: #64748B;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-icon { color: #CBD5E1; }

        /* PAGINATION FOOTER */
        .table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #F1F5F9;
        }

        .record-count-text {
          font-size: 12px;
          color: #64748B;
          font-weight: 600;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-nav-btn, .page-num-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #0F2926;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .page-num-btn.active {
          background: #087F6E;
          color: #FFFFFF;
          border-color: #087F6E;
        }
        .page-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* UPCOMING REMINDERS SECTION */
        .upcoming-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .header-icon-box {
          width: 34px;
          height: 34px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .view-calendar-link {
          font-size: 13px;
          font-weight: 700;
          color: #087F6E;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .view-calendar-link:hover { text-decoration: underline; }

        .upcoming-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .upcoming-reminder-card {
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        }

        .reminder-card-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .reminder-date-badge {
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 52px;
          flex-shrink: 0;
        }
        .rem-day { font-size: 16px; font-weight: 800; line-height: 1; }
        .rem-mon { font-size: 9px; font-weight: 700; text-transform: uppercase; }

        .reminder-info h4 { font-size: 13px; font-weight: 800; color: #0F2926; margin-bottom: 2px; }
        .reminder-info p { font-size: 11px; color: #64748B; line-height: 1.3; }

        .reminder-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid #E2E8F0;
          gap: 8px;
        }

        .reminder-timing-note {
          font-size: 11px;
          color: #4A6360;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .status-pill {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .scheduled-pill { background: #E8F8F5; color: #087F6E; flex-shrink: 0; }

        .empty-reminders {
          grid-column: span 3;
          text-align: center;
          padding: 20px;
          color: #64748B;
        }

        /* REMINDER SETTINGS */
        .settings-header {
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 16px;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .setting-block h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
        }

        .setting-subtitle {
          font-size: 12px;
          color: #64748B;
        }

        .setting-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .setting-label-row span {
          font-size: 12px;
          color: #64748B;
        }

        /* TOGGLE SWITCH STYLING */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #CBD5E1;
          transition: .3s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }
        input:checked + .slider { background-color: #087F6E; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }

        .radio-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          font-weight: 600;
        }
        .radio-label input[type="radio"] {
          accent-color: #087F6E;
          width: 16px;
          height: 16px;
        }

        .channels-grid-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 6px;
        }

        .channel-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          padding: 12px 14px;
          border-radius: 12px;
          gap: 10px;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .channel-info strong {
          font-size: 13px;
          color: #0F2926;
          display: block;
        }
        .channel-info p {
          font-size: 11px;
          color: #64748B;
        }

        .success-feedback-banner {
          background: #DCFCE7;
          color: #15803D;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-save-preferences {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          width: fit-content;
        }
        .btn-save-preferences:hover { background: #066658; }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .page-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .btn-mark-all-read {
            width: 100%;
            justify-content: center;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          .upcoming-cards-grid, .channels-grid-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}