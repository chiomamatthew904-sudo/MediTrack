import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Bell,
  Heart,
  Clock,
  MapPin,
  ArrowRight,
  Bot,
  Activity,
  CalendarDays
} from 'lucide-react';

import patientAvatar from '../../assets/patimg2.jpg';
import doctorAvatar from '../../assets/patdocimg.jpg';

// IMPORT SUPABASE CLIENT
import { supabase } from '../../supabaseClient';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching dashboard appointments:', error.message);
      } else {
        const cleanedData = (data || []).map(app => ({
          ...app,
          appointment_date: app.appointment_date ? app.appointment_date.split('T')[0] : app.appointment_date
        }));
        setAppointments(cleanedData);
      }
    } catch (err) {
      console.error('Unexpected error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute live metrics from database records
  const upcomingAppointments = appointments.filter(a => a.status && a.status.toLowerCase() === 'upcoming');
  const completedAppointments = appointments.filter(a => a.status && a.status.toLowerCase() === 'completed');
  
  const upcomingCount = upcomingAppointments.length;
  const completedCount = completedAppointments.length;
  
  // Get the very next upcoming appointment
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  return (
    <div className="patient-dashboard">
      
      {/* WELCOME BANNER */}
      <div className="welcome-banner">
        <div className="welcome-text-group">
          <div className="welcome-avatar-wrapper">
            <img src={patientAvatar} alt="Chioma" className="welcome-patient-avatar" />
          </div>
          <div>
            <h1 className="welcome-heading">Welcome back, Chioma!</h1>
            <p className="welcome-subtext">Here's an overview of your health journey.</p>
          </div>
        </div>

        <div className="banner-promo-badge">
          <div className="promo-badge-icon">
            <Heart size={24} />
          </div>
          <div className="promo-badge-text">
            <strong>Stay healthy,</strong>
            <span>stay informed.</span>
          </div>
        </div>
      </div>

      {/* STATISTICS CARDS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box teal-bg">
            <CalendarDays size={22} />
          </div>
          <div className="stat-data">
            <h3 className="stat-number">{upcomingCount}</h3>
            <span className="stat-label">Upcoming Appointments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box blue-bg">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-data">
            <h3 className="stat-number">{completedCount}</h3>
            <span className="stat-label">Completed Appointments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box orange-bg">
            <Bell size={22} />
          </div>
          <div className="stat-data">
            <h3 className="stat-number">2</h3>
            <span className="stat-label">Pending Reminders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple-bg">
            <Heart size={22} />
          </div>
          <div className="stat-data">
            <h3 className="stat-number">1</h3>
            <span className="stat-label">Health Alert</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION (NEXT APPOINTMENT & UPCOMING REMINDERS) */}
      <div className="dashboard-grid-split">
        
        {/* YOUR NEXT APPOINTMENT CARD */}
        <div className="dashboard-card next-appointment-card">
          <div className="card-header-flex">
            <h2 className="card-title">Your Next Appointment</h2>
            <Link to="/dashboard/appointments" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p className="loading-text">Loading appointment...</p>
          ) : nextAppointment ? (
            <div className="appointment-content-box">
              <div className="doctor-photo-frame">
                <img src={doctorAvatar} alt="Doctor consultation" className="next-doc-img" />
              </div>

              <div className="appointment-details">
                <h3 className="appointment-type">{nextAppointment.reason || 'General Checkup'}</h3>
                
                <div className="appointment-meta-row">
                  <Calendar size={16} className="meta-icon" />
                  <span>{nextAppointment.appointment_date} • {nextAppointment.appointment_time}</span>
                </div>

                <div className="appointment-meta-row">
                  <MapPin size={16} className="meta-icon" />
                  <span>{nextAppointment.facility_name}{nextAppointment.facility_address ? `, ${nextAppointment.facility_address}` : ''}</span>
                </div>

                <Link to="/dashboard/appointments" className="btn-view-details">
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <p className="no-data-text">No upcoming appointments scheduled.</p>
          )}
        </div>

        {/* UPCOMING REMINDERS CARD */}
        <div className="dashboard-card reminders-card">
          <div className="card-header-flex">
            <h2 className="card-title">Upcoming Reminders</h2>
            <Link to="/dashboard/calendar" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="reminders-list">
            <div className="reminder-item">
              <div className="reminder-icon-box teal-icon">
                <Bell size={16} />
              </div>
              <div className="reminder-info">
                <h4>Take your prescribed medication</h4>
                <span>Today • 8:00 PM</span>
              </div>
              <div className="reminder-status-dot"></div>
            </div>

            <div className="reminder-item">
              <div className="reminder-icon-box green-icon">
                <Activity size={16} />
              </div>
              <div className="reminder-info">
                <h4>Blood test appointment</h4>
                <span>14 Nov 2026</span>
              </div>
              <div className="reminder-status-dot"></div>
            </div>

            <div className="reminder-item">
              <div className="reminder-icon-box pink-icon">
                <Heart size={16} />
              </div>
              <div className="reminder-info">
                <h4>Follow up with your doctor</h4>
                <span>20 Nov 2026</span>
              </div>
              <div className="reminder-status-dot"></div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION (RECENT ACTIVITY & AI ASSISTANT PROMO) */}
      <div className="dashboard-grid-split bottom-grid">
        
        {/* RECENT ACTIVITY CARD */}
        <div className="dashboard-card activity-card">
          <div className="card-header-flex">
            <h2 className="card-title">Recent Activity</h2>
            <Link to="/dashboard/appointments" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="activity-list">
            {completedAppointments.slice(0, 3).map((app) => (
              <div className="activity-item" key={app.id}>
                <div className="activity-icon-circle green-circle">
                  <CheckCircle2 size={16} />
                </div>
                <div className="activity-desc">
                  <p>Appointment completed – {app.reason}</p>
                  <span>{app.appointment_date} • {app.appointment_time}</span>
                </div>
              </div>
            ))}
            {completedAppointments.length === 0 && (
              <div className="activity-item">
                <div className="activity-icon-circle teal-circle">
                  <CalendarDays size={16} />
                </div>
                <div className="activity-desc">
                  <p>Welcome to MediTrack! Start managing your appointments.</p>
                  <span>Today</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI ASSISTANT PROMOTIONAL CARD */}
        <div className="dashboard-card ai-assistant-promo-card">
          <div className="ai-card-content">
            <div className="ai-header-row">
              <div className="ai-bot-badge">
                <Bot size={24} />
              </div>
              <h2 className="card-title text-white">Need help?</h2>
            </div>
            <p className="ai-desc">
              Chat with our AI Assistant for instant health guidance.
            </p>
            <Link to="/dashboard/assistant" className="btn-open-ai">
              Open AI Assistant <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ai-robot-graphic">
            <Bot size={72} className="floating-bot-icon" />
          </div>
        </div>

      </div>

      {/* DASHBOARD STYLES */}
      <style>{`
        .patient-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
        }
        .loading-text, .no-data-text {
          font-size: 13px;
          color: #64748B;
          font-style: italic;
          padding: 16px 0;
        }

        /* WELCOME BANNER */
        .welcome-banner {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          border: 1px solid #E1F0EE;
        }

        .welcome-text-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .welcome-avatar-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #087F6E;
          flex-shrink: 0;
        }

        .welcome-patient-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .welcome-heading {
          font-size: 26px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .welcome-subtext {
          font-size: 14px;
          color: #4A6360;
        }

        .banner-promo-badge {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #F4FAF9;
          padding: 12px 20px;
          border-radius: 14px;
          border: 1px solid #D4F3EE;
        }

        .promo-badge-icon {
          color: #087F6E;
          display: flex;
          align-items: center;
        }

        .promo-badge-text {
          display: flex;
          flex-direction: column;
          font-size: 13px;
          color: #4A6360;
          line-height: 1.3;
        }

        .promo-badge-text strong {
          color: #0F2926;
          font-size: 15px;
        }

        /* STATS GRID */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: #FFFFFF;
          padding: 20px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 15px rgba(8, 127, 110, 0.04);
          border: 1px solid #E1F0EE;
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .teal-bg { background: #E8F8F5; color: #087F6E; }
        .blue-bg { background: #E0F2FE; color: #0284C7; }
        .orange-bg { background: #FEF3C7; color: #D97706; }
        .purple-bg { background: #FCE7F3; color: #DB2777; }

        .stat-data {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #0F2926;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 12px;
          color: #64748B;
          font-weight: 600;
        }

        /* SPLIT GRIDS */
        .dashboard-grid-split {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        .bottom-grid {
          grid-template-columns: 1fr 1fr;
        }

        .dashboard-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          border: 1px solid #E1F0EE;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F2926;
        }

        .view-all-link {
          font-size: 13px;
          font-weight: 700;
          color: #087F6E;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s ease;
        }
        .view-all-link:hover {
          color: #066658;
          text-decoration: underline;
        }

        /* NEXT APPOINTMENT */
        .appointment-content-box {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .doctor-photo-frame {
          width: 120px;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid #E1F0EE;
        }

        .next-doc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .appointment-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .appointment-type {
          font-size: 16px;
          font-weight: 700;
          color: #0F2926;
        }

        .appointment-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4A6360;
        }
        .meta-icon {
          color: #087F6E;
          flex-shrink: 0;
        }

        .btn-view-details {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          margin-top: 6px;
          width: fit-content;
          transition: background 0.2s ease;
        }
        .btn-view-details:hover {
          background: #066658;
        }

        /* REMINDERS LIST */
        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reminder-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #F8FCFC;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        .reminder-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .teal-icon { background: #E8F8F5; color: #087F6E; }
        .green-icon { background: #E6F4EA; color: #137333; }
        .pink-icon { background: #FCE7F3; color: #DB2777; }

        .reminder-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .reminder-info h4 {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }
        .reminder-info span {
          font-size: 11px;
          color: #64748B;
        }

        .reminder-status-dot {
          width: 8px;
          height: 8px;
          background: #087F6E;
          border-radius: 50%;
        }

        /* RECENT ACTIVITY */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .activity-icon-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .green-circle { background: #E6F4EA; color: #137333; }
        .teal-circle { background: #E8F8F5; color: #087F6E; }
        .orange-circle { background: #FEF3C7; color: #D97706; }

        .activity-desc p {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
          line-height: 1.3;
        }
        .activity-desc span {
          font-size: 11px;
          color: #64748B;
        }

        /* AI ASSISTANT PROMO CARD */
        .ai-assistant-promo-card {
          background: linear-gradient(135deg, #087F6E 0%, #065F53 100%);
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
        }

        .ai-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-bot-badge {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }

        .text-white {
          color: #FFFFFF !important;
        }

        .ai-desc {
          font-size: 14px;
          color: #E2E8F0;
          line-height: 1.5;
          max-width: 280px;
        }

        .btn-open-ai {
          background: #FFFFFF;
          color: #087F6E;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-top: 8px;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .btn-open-ai:hover {
          background: #F4FAF9;
        }

        .ai-robot-graphic {
          position: absolute;
          right: -10px;
          bottom: -15px;
          color: rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-grid-split,
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .welcome-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .banner-promo-badge {
            width: 100%;
          }
          .appointment-content-box {
            flex-direction: column;
            align-items: flex-start;
          }
          .doctor-photo-frame {
            width: 100%;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}