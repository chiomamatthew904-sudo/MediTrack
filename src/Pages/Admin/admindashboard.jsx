import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Current Date formatted for top right of welcome banner
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Sample Data for Tables & Lists
  const stats = [
    { title: 'Total Patients', count: '50', icon: <Users size={24} color="#0D9488" />, bg: '#CCFBF1', link: '/admin/management' },
    { title: 'Total Appointments', count: '120', icon: <Calendar size={24} color="#3B82F6" />, bg: '#EFF6FF', link: '/admin/management' },
    { title: 'Upcoming Appointments', count: '18', icon: <Clock size={24} color="#D97706" />, bg: '#FEF3C7', link: '/admin/management' },
    { title: 'New Enquiries', count: '4', icon: <Mail size={24} color="#8B5CF6" />, bg: '#EDE9FE', link: '/admin/management' }
  ];

  const recentPatients = [
    { name: 'Mary Johnson', email: 'mary.johnson@email.com', date: '18 Nov 2026', status: 'Active' },
    { name: 'David Okafor', email: 'david.okafor@email.com', date: '17 Nov 2026', status: 'Active' },
    { name: 'Blessing Eze', email: 'blessing.eze@email.com', date: '15 Nov 2026', status: 'Active' },
    { name: 'Chinedu Nwosu', email: 'chinedu.nwosu@email.com', date: '14 Nov 2026', status: 'Active' },
    { name: 'Adaobi Uche', email: 'adaobi.uche@email.com', date: '13 Nov 2026', status: 'Active' }
  ];

  const recentAppointments = [
    { name: 'Ngozi Okafor', clinic: 'General Hospital', date: '20 Nov 2026', status: 'Upcoming' },
    { name: 'Emeka Dike', clinic: 'City Medical Centre', date: '18 Nov 2026', status: 'Completed' },
    { name: 'Chisom Ani', clinic: 'General Hospital', date: '15 Nov 2026', status: 'Missed' },
    { name: 'Ifeanyi Okeke', clinic: 'St. Joseph Hospital', date: '12 Nov 2026', status: 'Cancelled' },
    { name: 'Ruth Eze', clinic: 'City Medical Centre', date: '10 Nov 2026', status: 'Completed' }
  ];

  const recentEnquiries = [
    { sender: 'Jane Doe', subject: 'Appointment Issue', date: '18 Nov 2026', status: 'New' },
    { sender: 'Michael Chukwu', subject: 'General Enquiry', date: '16 Nov 2026', status: 'Read' },
    { sender: 'Precious Umeh', subject: 'Support Request', date: '14 Nov 2026', status: 'Replied' },
    { sender: 'David Adeyemi', subject: 'Feature Suggestion', date: '12 Nov 2026', status: 'Read' },
    { sender: 'Grace Nwosu', subject: 'Account Help', date: '10 Nov 2026', status: 'Replied' }
  ];

  const recentActivity = [
    { text: 'New patient registered: Mary Johnson', time: '18 Nov 2026 • 10:24 AM', icon: <UserPlus size={16} color="#0D9488" />, bg: '#CCFBF1' },
    { text: 'Appointment added by Chinedu Nwosu', time: '17 Nov 2026 • 3:15 PM', icon: <CalendarPlus size={16} color="#3B82F6" />, bg: '#EFF6FF' },
    { text: 'New contact enquiry from Jane Doe', time: '16 Nov 2026 • 9:20 AM', icon: <Mail size={16} color="#8B5CF6" />, bg: '#EDE9FE' },
    { text: 'Appointment marked completed for Emeka Dike', time: '15 Nov 2026 • 11:30 AM', icon: <CheckCircle2 size={16} color="#059669" />, bg: '#D1FAE5' }
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
                {recentPatients.map((patient, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{patient.name}</td>
                    <td className="text-muted">{patient.email}</td>
                    <td>{patient.date}</td>
                    <td><span className="mt-status-badge active">Active</span></td>
                  </tr>
                ))}
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
                {recentAppointments.map((appt, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{appt.name}</td>
                    <td className="text-muted">{appt.clinic}</td>
                    <td>{appt.date}</td>
                    <td>{getAppointmentStatusBadge(appt.status)}</td>
                  </tr>
                ))}
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
                {recentEnquiries.map((enquiry, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{enquiry.sender}</td>
                    <td className="text-muted">{enquiry.subject}</td>
                    <td>{enquiry.date}</td>
                    <td>{getEnquiryStatusBadge(enquiry.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. RECENT ACTIVITY TIMELINE */}
        <div className="mt-card">
          <div className="mt-card-header">
            <h3>Recent Activity</h3>
            <span className="mt-view-all" onClick={() => navigate('/admin/management')}>
              View All <ArrowRight size={14} />
            </span>
          </div>
          <div className="mt-timeline-list">
            {recentActivity.map((act, i) => (
              <div key={i} className="mt-timeline-item">
                <div className="mt-timeline-icon" style={{ background: act.bg }}>
                  {act.icon}
                </div>
                <div className="mt-timeline-content">
                  <p className="mt-timeline-text">{act.text}</p>
                  <span className="mt-timeline-time">{act.time}</span>
                </div>
              </div>
            ))}
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

        @media (max-width: 1024px) {
          .mt-tables-grid {
            grid-template-columns: 1fr;
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