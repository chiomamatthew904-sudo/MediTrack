import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  Users,
  Calendar,
  Clock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CalendarPlus,
  UserPlus,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const response = await fetch(
        'http://localhost:5000/api/admin/dashboard',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Unable to load dashboard data.'
        );
      }

      setDashboardData(result);

    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Something went wrong while loading the dashboard.');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);


const recentActivity = [
  ...(dashboardData?.recentPatients || []).map(patient => ({
    id: `patient-${patient.id}`,
    text: `${patient.full_name || 'A patient'} registered on MediTrack`,
    date: patient.created_at,
    label: 'P',
    bg: '#e0f2f1'
  })),

  ...(dashboardData?.recentAppointments || []).map(appointment => ({
    id: `appointment-${appointment.id}`,
    text: `New appointment added for ${appointment.patient_name || 'a patient'}`,
    date: appointment.created_at,
    label: 'A',
    bg: '#e3f2fd'
  })),

  ...(dashboardData?.recentEnquiries || []).map(enquiry => ({
    id: `enquiry-${enquiry.id}`,
    text: `New enquiry received from ${enquiry.full_name || 'a visitor'}`,
    date: enquiry.created_at,
    label: 'E',
    bg: '#fff3e0'
  }))
]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  // Current Date formatted for top right of welcome banner
   const currentDateFormatted = new Date().toLocaleDateString('en-NG', {
  timeZone: 'Africa/Lagos',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

  // Sample Data for Tables & Lists
  const stats = [
  {
    title: 'Total Patients',
    count: dashboardData?.statistics?.totalPatients ?? 0,
    icon: <Users size={24} color="#0D9488" />,
    bg: '#CCFBF1',
    link: '/admin/management'
  },
  {
    title: 'Total Appointments',
    count: dashboardData?.statistics?.totalAppointments ?? 0,
    icon: <Calendar size={24} color="#3B82F6" />,
    bg: '#EFF6FF',
    link: '/admin/management'
  },
  {
    title: 'Upcoming Appointments',
    count: dashboardData?.statistics?.upcomingAppointments ?? 0,
    icon: <Clock size={24} color="#D97706" />,
    bg: '#FEF3C7',
    link: '/admin/management'
  },
  {
    title: 'New Enquiries',
    count: dashboardData?.statistics?.newEnquiries ?? 0,
    icon: <Mail size={24} color="#8B5CF6" />,
    bg: '#EDE9FE',
    link: '/admin/management'
  }
];


  const getAppointmentStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return <span className="mt-status-badge upcoming">Upcoming</span>;
      case 'completed': return <span className="mt-status-badge completed">Completed</span>;
      case 'missed': return <span className="mt-status-badge missed">Missed</span>;
      case 'cancelled': return <span className="mt-status-badge cancelled">Cancelled</span>;
      default: return <span className="mt-status-badge">{status}</span>;
    }
  };

  const getEnquiryStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'new': return <span className="mt-enquiry-badge new">New</span>;
      case 'read': return <span className="mt-enquiry-badge read">Read</span>;
      case 'replied': return <span className="mt-enquiry-badge replied">Replied</span>;
      default: return <span className="mt-enquiry-badge">{status}</span>;
    }
  };

    // Loading and error checks go HERE
   if (loading) {
  return <div className="mt-dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
  return <div className="mt-dashboard-error">{error}</div>;
  }

  return (
    <div className="mt-dashboard-container">
      {/* WELCOME BANNER */}
      <div className="mt-welcome-card">
        <div className="mt-welcome-left">
          <div className="mt-shield-icon-wrap">
            <ShieldCheck size={28} color="#0D9488" />
          </div>
          <div>
            <h1>Welcome, Administrator!</h1>
            <p>Here's an overview of MediTrack platform activity.</p>
          </div>
        </div>
        <div className="mt-welcome-right">
          <Calendar size={16} color="#0D9488" />
          <span>{currentDateFormatted}</span>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="mt-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="mt-stat-card" onClick={() => navigate(stat.link)}>
            <div className="mt-stat-content">
              <div className="mt-stat-icon-box" style={{ background: stat.bg }}>
                {stat.icon}
              </div>
              <div>
                <h2>{stat.count}</h2>
                <p>{stat.title}</p>
              </div>
            </div>
            <div className="mt-stat-arrow">
              <ArrowRight size={16} color="#94A3B8" />
            </div>
          </div>
        ))}
      </div>

      {/* DATA TABLES GRID (2x2 Layout) */}
      <div className="mt-tables-grid">
        
        {/* 1. RECENT PATIENT REGISTRATIONS */}
        <div className="mt-card">
          <div className="mt-card-header">
            <h3>Recent Patient Registrations</h3>
            <span className="mt-view-all" onClick={() => navigate('/admin/management')}>
              View All <ArrowRight size={14} />
            </span>
          </div>
          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email Address</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
             <tbody>
  {dashboardData?.recentPatients?.length > 0 ? (
    dashboardData.recentPatients.map((patient) => (
      <tr key={patient.id}>
        <td className="font-semibold">
          {patient.full_name || 'No name'}
        </td>

        <td className="text-muted">
          {patient.email}
        </td>

        <td>
          {new Date(patient.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </td>

        <td>
          <span className="mt-status-badge active">Registered</span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No patient registrations found.</td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>

        {/* 2. RECENT APPOINTMENT ACTIVITY (Read-Only) */}
        <div className="mt-card">
          <div className="mt-card-header">
            <h3>Recent Appointment Activity</h3>
            <span className="mt-view-all" onClick={() => navigate('/admin/management')}>
              View All <ArrowRight size={14} />
            </span>
          </div>
          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Hospital / Clinic</th>
                  <th>Appointment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {dashboardData?.recentAppointments?.length > 0 ? (
    dashboardData.recentAppointments.map((appt) => (
      <tr key={appt.id}>
        <td className="font-semibold">
          {appt.patient_name || 'Unknown Patient'}
        </td>

        <td className="text-muted">
          {appt.facility_name || 'Not specified'}
        </td>

        <td>
          {new Date(`${appt.appointment_date}T00:00:00`).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </td>

        <td>
          {getAppointmentStatusBadge(appt.status || 'Unknown')}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No appointment records found.</td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>

        {/* 3. RECENT CONTACT ENQUIRIES */}
        <div className="mt-card">
          <div className="mt-card-header">
            <h3>Recent Contact Enquiries</h3>
            <span className="mt-view-all" onClick={() => navigate('/admin/management')}>
              View All <ArrowRight size={14} />
            </span>
          </div>
          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Sender Name</th>
                  <th>Subject</th>
                  <th>Date Received</th>
                  <th>Status</th>
                </tr>
              </thead>
               <tbody>
  {dashboardData?.recentEnquiries?.length > 0 ? (
    dashboardData.recentEnquiries.map((enquiry) => (
      <tr key={enquiry.id}>
        <td className="font-semibold">
          {enquiry.full_name || 'Unknown Sender'}
        </td>

        <td className="text-muted">
          {enquiry.subject}
        </td>

        <td>
          {new Date(enquiry.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </td>

        <td>
          {getEnquiryStatusBadge(enquiry.status || 'New')}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No enquiries found.</td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>

        {/* 4. RECENT ACTIVITY TIMELINE */}
<div className="mt-card">
  <div className="mt-card-header">
    <h3>Recent Activity</h3>
    <span
      className="mt-view-all"
      onClick={() => navigate('/admin/management')}
    >
      View All <ArrowRight size={14} />
    </span>
  </div>

  <div className="mt-timeline-list">
    {recentActivity.length > 0 ? (
      recentActivity.map((act) => (
        <div key={act.id} className="mt-timeline-item">
          <div
            className="mt-timeline-icon"
            style={{ background: act.bg }}
          >
            {act.label}
          </div>

          <div className="mt-timeline-content">
            <p className="mt-timeline-text">{act.text}</p>

            <span className="mt-timeline-time">
              {new Date(act.date).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="mt-timeline-text">No recent activity available.</p>
    )}
  </div>
</div>

        </div>

      {/* EMBEDDED STYLING */}
      <style>{`
        .mt-dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* WELCOME BANNER */
        .mt-welcome-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .mt-welcome-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .mt-shield-icon-wrap {
          width: 52px;
          height: 52px;
          background: #CCFBF1;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mt-welcome-left h1 {
          font-size: 22px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .mt-welcome-left p {
          font-size: 13.5px;
          color: #64748B;
        }
        .mt-welcome-right {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }

        /* STATS GRID */
        .mt-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 20px;
        }
        .mt-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .mt-stat-card:hover {
          border-color: #0D9488;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px -3px rgba(13, 148, 136, 0.1);
        }
        .mt-stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .mt-stat-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mt-stat-card h2 {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
        }
        .mt-stat-card p {
          font-size: 12.5px;
          color: #64748B;
          font-weight: 500;
          margin-top: 2px;
        }
        .mt-stat-arrow {
          background: #F8FAFC;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* TABLES GRID */
        .mt-tables-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }
        .mt-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
        }
        .mt-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .mt-card-header h3 {
          font-size: 15.5px;
          font-weight: 700;
          color: #0F172A;
        }
        .mt-view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #0D9488;
          cursor: pointer;
          transition: color 0.15s;
        }
        .mt-view-all:hover {
          color: #0F766E;
          text-decoration: underline;
        }

        /* TABLES */
        .mt-table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .mt-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }
        .mt-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 600;
          padding: 10px 12px;
          border-bottom: 1px solid #E2E8F0;
        }
        .mt-table td {
          padding: 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
        }
        .mt-table tr:last-child td {
          border-bottom: none;
        }
        .font-semibold { font-weight: 600; color: #0F172A; }
        .text-muted { color: #64748B; font-size: 12.5px; }

        /* STATUS BADGES */
        .mt-status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .mt-status-badge.active { background: #CCFBF1; color: #0F766E; }
        .mt-status-badge.upcoming { background: #EFF6FF; color: #1D4ED8; }
        .mt-status-badge.completed { background: #D1FAE5; color: #065F46; }
        .mt-status-badge.missed { background: #FEF3C7; color: #92400E; }
        .mt-status-badge.cancelled { background: #FEE2E2; color: #B91C1C; }

        .mt-enquiry-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .mt-enquiry-badge.new { background: #EFF6FF; color: #2563EB; }
        .mt-enquiry-badge.read { background: #F1F5F9; color: #475569; }
        .mt-enquiry-badge.replied { background: #D1FAE5; color: #047857; }

        /* TIMELINE */
        .mt-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 4px;
        }
        .mt-timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .mt-timeline-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .mt-timeline-content {
          display: flex;
          flex-direction: column;
        }
        .mt-timeline-text {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }
        .mt-timeline-time {
          font-size: 11.5px;
          color: #64748B;
          margin-top: 2px;
        }


        /* ==================================
   DARK MODE - ADMIN DASHBOARD
================================== */

html[data-theme="dark"] .mt-dashboard-container {
  color: #E2E8F0;
}

html[data-theme="dark"] .mt-welcome-card,
html[data-theme="dark"] .mt-stat-card,
html[data-theme="dark"] .mt-card {
  background: #172B2B;
  border-color: #294343;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

html[data-theme="dark"] .mt-welcome-left h1,
html[data-theme="dark"] .mt-stat-card h2,
html[data-theme="dark"] .mt-card-header h3,
html[data-theme="dark"] .font-semibold,
html[data-theme="dark"] .mt-timeline-text {
  color: #F1F5F9;
}

html[data-theme="dark"] .mt-welcome-left p,
html[data-theme="dark"] .mt-stat-card p,
html[data-theme="dark"] .text-muted,
html[data-theme="dark"] .mt-timeline-time {
  color: #A7B8B8;
}

html[data-theme="dark"] .mt-welcome-right,
html[data-theme="dark"] .mt-stat-arrow,
html[data-theme="dark"] .mt-table th {
  background: #203838;
  border-color: #345050;
  color: #E2E8F0;
}

html[data-theme="dark"] .mt-table td {
  color: #CBD5E1;
  border-bottom-color: #294343;
}

html[data-theme="dark"] .mt-table th {
  color: #A7B8B8;
}

html[data-theme="dark"] .mt-view-all {
  color: #5EEAD4;
}

html[data-theme="dark"] .mt-view-all:hover {
  color: #99F6E4;
}

html[data-theme="dark"] .mt-stat-card:hover {
  border-color: #0D9488;
}

html[data-theme="dark"] .mt-dashboard-loading,
html[data-theme="dark"] .mt-dashboard-error {
  color: #E2E8F0;
}


        @media (max-width: 1024px) {
          .mt-tables-grid {
            grid-template-columns: 1fr;
          }


          /* ==================================
   DARK MODE - ADMIN LAYOUT
================================== */

html[data-theme="dark"] .mt-admin-wrapper {
  background: #102222;
  color: #E2E8F0;
}

html[data-theme="dark"] .mt-admin-sidebar,
html[data-theme="dark"] .mt-admin-topbar {
  background: #172B2B;
  border-color: #294343;
}

html[data-theme="dark"] .mt-admin-logo-container,
html[data-theme="dark"] .mt-admin-sidebar-footer {
  border-color: #294343;
}

html[data-theme="dark"] .mt-admin-tagline,
html[data-theme="dark"] .mt-admin-nav-item {
  color: #A7B8B8;
}

html[data-theme="dark"] .mt-admin-nav-item:hover {
  background: #203838;
  color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-nav-item.active {
  background: #0D9488;
  color: #FFFFFF;
}

html[data-theme="dark"] .mt-admin-toggle-btn,
html[data-theme="dark"] .mt-admin-icon-btn,
html[data-theme="dark"] .mt-admin-profile-trigger {
  background: #203838;
  border-color: #345050;
  color: #CBD5E1;
}

html[data-theme="dark"] .mt-admin-toggle-btn:hover,
html[data-theme="dark"] .mt-admin-profile-trigger:hover {
  background: #294343;
}

html[data-theme="dark"] .mt-admin-name {
  color: #F1F5F9;
}

html[data-theme="dark"] .mt-chevron {
  color: #A7B8B8;
}

html[data-theme="dark"] .mt-admin-dropdown {
  background: #172B2B;
  border-color: #345050;
}

html[data-theme="dark"] .mt-dropdown-header {
  background: #203838;
  border-color: #345050;
}

html[data-theme="dark"] .mt-dropdown-user-name {
  color: #F1F5F9;
}

html[data-theme="dark"] .mt-dropdown-user-role {
  color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-dropdown li {
  color: #CBD5E1;
}

html[data-theme="dark"] .mt-admin-dropdown li:hover {
  background: #294343;
  color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-content {
  background: #102222;
}

        }

        
        @media (max-width: 768px) {
          .mt-welcome-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .mt-admin-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}