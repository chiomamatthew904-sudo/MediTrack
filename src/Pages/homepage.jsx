import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import medimg from "../assets/medimg.jpg";
import {
  CalendarCheck,
  HeartPulse,
  Menu,
  X,
  ArrowRight,
  Bell,
  Clock3,
  CalendarDays,
  UserRound,
  ChevronRight,
  House,
  History,
  Settings,
  UserPlus,
  CalendarPlus,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="home-page">

        {/* NAVIGATION BAR */}
        <header className="navbar">
          <Link to="/" className="logo">
            <img src={medimg} alt="MediTrack Logo" />
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          <nav className={menuOpen ? "nav-links active" : "nav-links"}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="login-link-btn">
              Login
            </Link>
            <Link to="/get-started" className="primary-button">
              Get Started
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-label">
              <HeartPulse size={17} />
              <span>Better Appointments, Healthier You.</span>
            </div>

            <h1 className="hero-title">
              Stay on top of your
              <span> hospital appointments.</span>
            </h1>

            <p className="hero-description">
              Organise your follow-up appointments, keep track of dates and receive reminders all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/get-started" className="primary-button hero-btn">
                Get Started
                <ArrowRight size={19} />
              </Link>

              <Link to="/how-it-works" className="secondary-button">
                How It Works
                <ChevronRight size={19} />
              </Link>
            </div>
          </div>

          {/* DASHBOARD PREVIEW INTERACTIVE CONTAINER */}
          <div 
            className="dashboard-preview" 
            onClick={() => navigate('/dashboard')}
            title="Click to enter patient portal"
          >
            <div className="dashboard-sidebar">
              <div className="mini-logo">
                <CalendarCheck size={20} />
                <span>MediTrack</span>
              </div>

              <div className="sidebar-links">
                <div className="sidebar-item selected">
                  <House size={16} />
                  <span>Home</span>
                </div>
                <div className="sidebar-item">
                  <CalendarDays size={16} />
                  <span>Appointments</span>
                </div>
                <div className="sidebar-item">
                  <Bell size={16} />
                  <span>Reminders</span>
                </div>
                <div className="sidebar-item">
                  <History size={16} />
                  <span>History</span>
                </div>
                <div className="sidebar-item">
                  <UserRound size={16} />
                  <span>Profile</span>
                </div>
              </div>

              <div className="sidebar-settings">
                <Settings size={16} />
                <span>Settings</span>
              </div>
            </div>

            <div className="dashboard-main">
              <div className="dashboard-top">
                <div>
                  <h3>Good morning!</h3>
                  <p>Here's your upcoming appointment.</p>
                </div>
                <UserRound size={23} />
              </div>

              <div className="appointment-card">
                <div className="appointment-icon">
                  <CalendarCheck size={23} />
                </div>
                <div className="appointment-info">
                  <h4>General Check-up</h4>
                  <p>City General Hospital</p>

                  <div className="appointment-time">
                    <Clock3 size={14} />
                    <span>Tuesday, 10:30 AM</span>
                  </div>

                  <span className="reminder-tag">
                    <Bell size={12} />
                    Reminder: 1 day before
                  </span>
                </div>
              </div>

              <div className="quick-actions">
                <h4>Quick Actions</h4>
                <div className="action-grid">
                  <div className="action-card">
                    <CalendarDays size={23} />
                    <span>My Appointments</span>
                  </div>
                  <div className="action-card">
                    <Clock3 size={23} />
                    <span>View History</span>
                  </div>
                  <div className="action-card">
                    <Bell size={23} />
                    <span>Manage Reminders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE STRIP SECTION */}
        <section className="value-strip">
          <div className="value-item">
            <CalendarCheck size={28} className="value-icon" />
            <span>Keep appointments organised</span>
          </div>

          <div className="value-divider"></div>

          <div className="value-item">
            <Bell size={28} className="value-icon" />
            <span>Get timely reminders</span>
          </div>

          <div className="value-divider"></div>

          <div className="value-item">
            <History size={28} className="value-icon" />
            <span>Track appointment history</span>
          </div>
        </section>

        {/* KEY FEATURES SECTION */}
        <section className="key-features-section">
          <div className="features-header">
            <span className="features-label">KEY FEATURES</span>
            <h2 className="features-title">
              Everything you need for better appointment management.
            </h2>
            <p className="features-subtitle">
              Simple tools. Smarter reminders. A healthier you.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <CalendarCheck size={28} />
              </div>
              <h3>Appointment Management</h3>
              <p>Easily book, reschedule or cancel appointments at your convenience.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Bell size={28} />
              </div>
              <h3>Smart Reminders</h3>
              <p>Get timely notifications so you never miss an important appointment.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <History size={28} />
              </div>
              <h3>Appointment History</h3>
              <p>View your past and upcoming appointments, all in one place.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="how-it-works-section">
          <div className="how-it-works-header">
            <span className="how-it-works-label">HOW IT WORKS</span>
            <h2 className="how-it-works-title">
              Get started in 3 simple steps.
            </h2>
            <p className="how-it-works-subtitle">
              It only takes a few minutes to take control of your appointments.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-icon-group">
                <div className="step-number">1</div>
                <div className="step-icon-circle">
                  <UserPlus size={28} />
                </div>
              </div>
              <h3>Create an account</h3>
              <p>Sign up with your details and get started in minutes.</p>
            </div>

            <div className="step-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="step-item">
              <div className="step-icon-group">
                <div className="step-number">2</div>
                <div className="step-icon-circle">
                  <CalendarPlus size={28} />
                </div>
              </div>
              <h3>Add your appointment</h3>
              <p>Enter your appointment details and save it to your calendar.</p>
            </div>

            <div className="step-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="step-item">
              <div className="step-icon-group">
                <div className="step-number">3</div>
                <div className="step-icon-circle">
                  <Bell size={28} />
                </div>
              </div>
              <h3>Get reminders</h3>
              <p>Receive timely notifications and stay on track.</p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="cta-banner">
          <div className="cta-content">
            <h2>Ready to take control<br />of your health appointments?</h2>
            <p>Join MediTrack today and never miss an important appointment again.</p>
          </div>
          <div className="cta-action">
            <Link to="/get-started" className="cta-button">
              Get Started
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-logo">
              <img src={medimg} alt="MediTrack Logo" />
            </div>

            <div className="footer-socials">
              <a href="#twitter" aria-label="X"><X size={18} /></a>
              <a href="#instagram" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#facebook" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 MediTrack. All rights reserved.</p>
            <div className="footer-tagline">
              <HeartPulse size={16} />
              <span>Built for a healthier tomorrow.</span>
            </div>
          </div>
        </footer>

      </div>

      {/* STYLESHEET */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .home-page {
          width: 100%;
          min-height: 100vh;
          background: #F8FAF9;
          color: #1F2937;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .logo img {
          width: 190px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        /* NAVBAR */
        .navbar {
          width: 100%;
          min-height: 80px;
          padding: 12px 5.5%;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid #E2E8F0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #087F6E;
          text-decoration: none;
          flex-shrink: 0;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-links a {
          text-decoration: none;
          color: #1F2937;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: #087F6E;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .login-link-btn {
          text-decoration: none;
          color: #1F2937;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .login-link-btn:hover {
          color: #087F6E;
        }

        .primary-button {
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 13px 23px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .primary-button:hover {
          background: #065F56;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #123B3A;
          cursor: pointer;
        }

        /* HERO SECTION */
        .hero {
          min-height: 405px;
          padding: 55px 5.5%;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 45px;
          background: linear-gradient(110deg, #EAF9F5, #F8FAF9);
        }

        .hero-content {
          flex: 1;
          min-width: 0;
        }

        .hero-title {
          font-size: 48px;
          line-height: 1.15;
          font-weight: 700;
          text-align: left;
          width: 100%;
          font-family: 'Manrope', sans-serif;
          color: #123B3A;
          margin-bottom: 18px;
        }

        .hero-title span {
          color: #087F6E;
        }

        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border-radius: 30px;
          background: #DDF5EF;
          color: #087F6E;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .hero-description {
          font-size: 15px;
          line-height: 1.8;
          color: #64748B;
          max-width: 430px;
          margin-bottom: 27px;
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          gap: 13px;
          flex-wrap: wrap;
        }

        .hero-btn {
          min-width: 155px;
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 20px;
          border: 1px solid #087F6E;
          border-radius: 30px;
          color: #087F6E;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          background: #FFFFFF;
          transition: background 0.2s ease;
        }

        .secondary-button:hover {
          background: #DDF5EF;
        }

        /* DASHBOARD PREVIEW */
        .dashboard-preview {
          width: 100%;
          max-width: 570px;
          min-height: 290px;
          margin-left: auto;
          background: #FFFFFF;
          border: 1px solid #DCEBE7;
          border-radius: 14px;
          display: grid;
          grid-template-columns: 115px 1fr;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(18, 59, 58, 0.09);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dashboard-preview:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(18, 59, 58, 0.12);
        }

        .dashboard-sidebar {
          padding: 20px 10px;
          background: #F8FAF9;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }

        .mini-logo {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #087F6E;
          margin-bottom: 30px;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 6px;
          font-size: 9px;
          color: #64748B;
          border-radius: 6px;
        }

        .sidebar-item.selected {
          background: #DDF5EF;
          color: #087F6E;
        }

        .sidebar-settings {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          color: #64748B;
        }

        .dashboard-main {
          padding: 20px 15px;
        }

        .dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          color: #123B3A;
        }

        .dashboard-top h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .dashboard-top p {
          font-size: 9px;
          color: #64748B;
        }

        .appointment-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 11px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(18, 59, 58, 0.04);
        }

        .appointment-icon {
          background: #DDF5EF;
          color: #087F6E;
          padding: 9px;
          border-radius: 50%;
        }

        .appointment-info h4 {
          font-size: 11px;
          color: #123B3A;
          margin-bottom: 5px;
        }

        .appointment-info p {
          font-size: 9px;
          color: #64748B;
          margin-bottom: 10px;
        }

        .appointment-time {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #64748B;
          font-size: 9px;
          margin-bottom: 10px;
        }

        .reminder-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #DDF5EF;
          color: #087F6E;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 8px;
        }

        .quick-actions {
          margin-top: 20px;
        }

        .quick-actions h4 {
          font-size: 11px;
          color: #123B3A;
          margin-bottom: 10px;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .action-card {
          min-height: 65px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #087F6E;
          text-align: center;
        }

        .action-card span {
          font-size: 8px;
          color: #123B3A;
        }

        /* VALUE STRIP SECTION */
        .value-strip {
          width: 100%;
          background: #F8FAF9;
          padding: 35px 5.5%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          border-bottom: 1px solid #EAEFEF;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #123B3A;
          font-weight: 600;
          font-size: 15px;
        }

        .value-icon {
          color: #087F6E;
          flex-shrink: 0;
        }

        .value-divider {
          width: 1px;
          height: 32px;
          background-color: #CBD5E1;
        }

        /* KEY FEATURES SECTION */
        .key-features-section {
          width: 100%;
          background: #F8FAF9;
          padding: 85px 5.5%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .features-header {
          text-align: center;
          max-width: 650px;
          margin-bottom: 50px;
        }

        .features-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #087F6E;
          margin-bottom: 12px;
          display: block;
        }

        .features-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: #123B3A;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .features-subtitle {
          font-size: 15px;
          color: #64748B;
          line-height: 1.5;
        }

        .features-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          max-width: 1200px;
        }

        .feature-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 35px 30px;
          box-shadow: 0 4px 20px rgba(18, 59, 58, 0.03);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(18, 59, 58, 0.07);
        }

        .feature-icon-wrapper {
          width: 60px;
          height: 60px;
          background: #DDF5EF;
          color: #087F6E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-card h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #123B3A;
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #64748B;
        }

        /* HOW IT WORKS SECTION */
        .how-it-works-section {
          width: 100%;
          background: #F8FAF9;
          padding: 85px 5.5%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .how-it-works-header {
          text-align: center;
          max-width: 650px;
          margin-bottom: 55px;
        }

        .how-it-works-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #087F6E;
          margin-bottom: 12px;
          display: block;
        }

        .how-it-works-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 800;
          color: #123B3A;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .how-it-works-subtitle {
          font-size: 15px;
          color: #64748B;
          line-height: 1.5;
        }

        .steps-container {
          width: 100%;
          max-width: 1100px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-icon-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        .step-icon-circle {
          width: 64px;
          height: 64px;
          background: #DDF5EF;
          color: #087F6E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          margin-top: 22px;
        }

        .step-item h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #123B3A;
          margin-bottom: 10px;
        }

        .step-item p {
          font-size: 14px;
          line-height: 1.6;
          color: #64748B;
          max-width: 260px;
        }

        /* CALL TO ACTION BANNER */
        .cta-banner {
          width: 100%;
          background: #087F6E;
          padding: 55px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          position: relative;
          overflow: hidden;
        }

        .cta-content h2 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .cta-content p {
          font-size: 15px;
          color: #E2F8F4;
          font-weight: 400;
        }

        .cta-button {
          background: #FFFFFF;
          color: #087F6E;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .cta-button:hover {
          background: #F0FDFB;
          transform: translateY(-2px);
        }

        /* FOOTER */
        .footer {
          width: 100%;
          background: #FFFFFF;
          padding: 50px 5.5% 35px 5.5%;
          border-top: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-top {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 35px;
          border-bottom: 1px solid #E2E8F0;
          gap: 20px;
        }

        .footer-logo img {
          width: 160px;
          height: auto;
          display: block;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-socials a {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #087F6E;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .footer-socials a:hover {
          background: #087F6E;
          color: #FFFFFF;
          border-color: #087F6E;
        }

        .footer-bottom {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
          padding-top: 20px;
          font-size: 13px;
          color: #64748B;
        }

        .footer-tagline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
        }

        .footer-tagline svg {
          color: #087F6E;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 900px) {
          .navbar { padding: 12px 4%; }
          .nav-links { gap: 15px; }
          .hero { padding: 45px 4%; gap: 25px; grid-template-columns: 1fr; }
          .dashboard-preview { margin: 0 auto; }
          .hero h1 { font-size: 34px; }
          .value-strip { gap: 30px; padding: 30px 4%; flex-wrap: wrap; }
          .value-divider { display: none; }
          .features-grid { grid-template-columns: 1fr; max-width: 500px; }
          .steps-container { flex-direction: column; align-items: center; }
          .step-arrow { transform: rotate(90deg); margin: 10px 0; }
          .cta-banner { flex-direction: column; align-items: flex-start; padding: 45px 5%; }
        }

        @media (max-width: 650px) {
          .navbar { min-height: 72px; padding: 12px 5%; }
          .menu-toggle { display: block; margin-left: auto; }
          .nav-links {
            display: none;
            position: absolute;
            top: 72px;
            left: 0;
            width: 100%;
            padding: 20px 5%;
            background: #FFFFFF;
            border-top: 1px solid #E2E8F0;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .nav-links.active { display: flex; }
          .nav-actions { display: none; }
        }
      `}</style>
    </>
  );
}