import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Menu,
  ArrowRight,
  UserPlus,
  Building2,
  CalendarCheck,
  ClipboardList,
  CheckCircle,
  Zap,
  Clock,
  Layout,
  Globe,
  Activity
} from 'lucide-react';

// IMPORT YOUR LOCAL PROJECT ASSETS
import medimg from '../assets/medimg.jpg';
import heroImg from '../assets/hiwheroimg.jpg';

function HowItWorks() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="how-page-wrapper">
      
      {/* 1. NAVBAR */}
      <header className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <img src={medimg} alt="MediTrack Logo" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works" className="active">How It Works</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-auth">
          <Link to="/get-started" className="btn-get-started desktop-only-btn">
            Get Started <ArrowRight size={16} />
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu (Clean links only - no duplicate buttons) */}
      {menuOpen && (
        <div className="mobile-dropdown-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}


      {/* SECTION 1: HERO SECTION */}
      <section className="how-hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1 className="hero-title">
              Your healthcare <br />
              journey, made simple.
            </h1>
            <p className="hero-desc">
              Managing your hospital appointments doesn't have to be complicated. MediTrack helps you organize and manage your appointments in just a few simple steps.
            </p>
            <Link to="/get-started" className="btn-primary-pill">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hero-img-box">
            <img src={heroImg} alt="Woman using MediTrack on smartphone" className="hero-photo" />
          </div>
        </div>
      </section>


      {/* SECTION 2: HOW MEDITRACK WORKS (4 STEPS) */}
      <section className="steps-section">
        <div className="section-container">
          <div className="center-header">
            <h2 className="section-heading">How MediTrack Works</h2>
            <p className="sub-heading">Follow these simple steps to book and manage your appointments.</p>
          </div>

          <div className="steps-row">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-badge">1</div>
              <div className="step-icon-bg">
                <UserPlus size={24} />
              </div>
              <h3>Create an Account</h3>
              <p>Sign up on MediTrack with your personal details.</p>
            </div>

            <div className="step-arrow">→</div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-badge">2</div>
              <div className="step-icon-bg">
                <Building2 size={24} />
              </div>
              <h3>Find a Hospital or Doctor</h3>
              <p>Browse available hospitals, doctors or services.</p>
            </div>

            <div className="step-arrow">→</div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-badge">3</div>
              <div className="step-icon-bg">
                <CalendarCheck size={24} />
              </div>
              <h3>Book an Appointment</h3>
              <p>Choose a date and time and submit your request.</p>
            </div>

            <div className="step-arrow">→</div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-badge">4</div>
              <div className="step-icon-bg">
                <ClipboardList size={24} />
              </div>
              <h3>Manage Your Appointments</h3>
              <p>View details, track status and keep everything organized.</p>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 3: THE BOOKING PROCESS */}
      <section className="booking-process-section">
        <div className="section-container">
          <div className="split-grid">
            <div className="split-text">
              <h2 className="section-heading">The Booking Process</h2>
              <p className="split-desc">
                Booking an appointment on MediTrack is fast and easy. Here's how it works:
              </p>

              <ul className="check-list">
                <li><CheckCircle className="teal-check" size={20} /> Choose a hospital or healthcare provider</li>
                <li><CheckCircle className="teal-check" size={20} /> Select an available appointment date</li>
                <li><CheckCircle className="teal-check" size={20} /> Pick a convenient time</li>
                <li><CheckCircle className="teal-check" size={20} /> Review and submit your booking</li>
                <li><CheckCircle className="teal-check" size={20} /> Receive confirmation</li>
              </ul>
            </div>

            {/* UI Preview Card: Booking Steps */}
            <div className="ui-mockup-card">
              <div className="mock-header">
                <img src={medimg} alt="MediTrack Mini" className="mini-brand-logo" />
                <div className="mock-steps-stepper">
                  <span className="active">1 Provider</span>
                  <span className="active">2 Date</span>
                  <span className="active">3 Time</span>
                  <span>4 Review</span>
                </div>
              </div>

              <div className="mock-content">
                <label className="mock-label">Select Hospital</label>
                <div className="mock-dropdown">UNN Teaching Hospital</div>

                <div className="mock-date-time-grid">
                  <div className="mock-calendar">
                    <div className="cal-header">&lt; October 2026 &gt;</div>
                    <div className="cal-days">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      <span></span><span></span><span></span><span>1</span><span>2</span><span>3</span><span>4</span>
                      <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                      <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                      <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                      <span>26</span><span>27</span><span className="selected-day">28</span><span>29</span><span>30</span><span>31</span>
                    </div>
                  </div>

                  <div className="mock-time-picker">
                    <label className="mock-label">Choose Time</label>
                    <button className="time-btn active">9:00 AM</button>
                    <button className="time-btn">10:00 AM</button>
                    <button className="time-btn">11:00 AM</button>
                    <button className="time-btn">2:00 PM</button>
                  </div>
                </div>

                <button className="mock-confirm-btn">Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 4: MANAGE YOUR APPOINTMENTS */}
      <section className="manage-section">
        <div className="section-container">
          <div className="split-grid">
            
            {/* UI Preview Laptop/Dashboard */}
            <div className="dashboard-frame">
              <div className="dash-sidebar">
                <img src={medimg} alt="MediTrack Logo" className="dash-logo" />
                <div className="dash-menu-item active">Dashboard</div>
                <div className="dash-menu-item">Appointments</div>
                <div className="dash-menu-item">Profile</div>
                <div className="dash-menu-item">Logout</div>
              </div>

              <div className="dash-main">
                <div className="dash-topbar">
                  <h3>My Appointments</h3>
                  <span className="dash-link">View All +</span>
                </div>

                <div className="dash-card">
                  <div className="dash-card-left">
                    <div className="steth-icon">🩺</div>
                    <div>
                      <h4>General Checkup</h4>
                      <p>UNN Teaching Hospital</p>
                      <span className="dash-time-tag">Tue, Oct 28, 2026 • 9:00 AM</span>
                    </div>
                  </div>
                  <span className="status-badge confirmed">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="split-text">
              <h2 className="section-heading">Manage Your Appointments</h2>
              <p className="split-desc">
                After booking, you can:
              </p>

              <ul className="check-list">
                <li><CheckCircle className="teal-check" size={20} /> View upcoming appointments</li>
                <li><CheckCircle className="teal-check" size={20} /> Check appointment details</li>
                <li><CheckCircle className="teal-check" size={20} /> Track booking status</li>
                <li><CheckCircle className="teal-check" size={20} /> Access your appointment history</li>
              </ul>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 5: WHY USE MEDITRACK? */}
      <section className="why-section">
        <div className="section-container">
          <div className="center-header">
            <h2 className="section-heading">Why Use MediTrack?</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon"><Zap size={22} /></div>
              <div>
                <h3>Easy to Use</h3>
                <p>Simple appointment management.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-icon"><Clock size={22} /></div>
              <div>
                <h3>Saves Time</h3>
                <p>Organize appointments conveniently.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-icon"><Layout size={22} /></div>
              <div>
                <h3>Stay Organized</h3>
                <p>Keep all your appointment details in one place.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-icon"><Globe size={22} /></div>
              <div>
                <h3>Convenient Access</h3>
                <p>Get your appointment information online.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 6: CALL TO ACTION BANNER */}
      <section className="cta-wrapper">
        <div className="cta-banner">
          <div className="cta-left">
            <div className="cta-icon-box">
              <Activity color="#FFFFFF" size={32} />
            </div>
            <div className="cta-text">
              <h2>Ready to take control of your appointments?</h2>
              <p>Get started with MediTrack and make managing your healthcare appointments easier.</p>
            </div>
          </div>
          <Link className="btn-cta-white" to="/get-started">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>


      {/* LIGHT GRADIENT FOOTER */}
      <footer className="footer-light" id="contact">
        <div className="footer-container">
          <div className="footer-left">
            <img src={medimg} alt="MediTrack Logo" className="footer-logo-img" />
            <div className="footer-divider"></div>
            <div className="footer-socials">
              <a href="#facebook" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#twitter" aria-label="X"><X size={18} /></a>
              <a href="#instagram" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-right">
            <p>&copy; 2026 MediTrack. All rights reserved.</p>
            <p className="footer-credit">Built with <span className="heart-icon">❤️</span> for better healthcare.</p>
          </div>
        </div>
      </footer>


      {/* STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .how-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #FFFFFF;
          color: #0F2926;
        }

        /* NAVBAR */
        .navbar {
          width: 100%;
          padding: 18px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border-bottom: 1px solid #EAF2F1;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-brand img {
          width: 140px;
          height: auto;
          display: block;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-links a {
          text-decoration: none;
          color: #4A6360;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: #087F6E;
          font-weight: 600;
        }

        .nav-links a.active {
          border-bottom: 2px solid #087F6E;
          padding-bottom: 4px;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .btn-get-started {
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 24px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #0F2926;
        }

        .mobile-dropdown-menu {
          display: none;
          flex-direction: column;
          background: #FFFFFF;
          padding: 20px 7%;
          border-bottom: 1px solid #E2E8F0;
          gap: 16px;
          position: sticky;
          top: 75px;
          z-index: 99;
          text-align: center;
        }

        .mobile-dropdown-menu a {
          text-decoration: none;
          color: #4A6360;
          font-size: 16px;
        }

        /* HERO */
        .how-hero {
          width: 100%;
          background: #E8F5F3;
          padding: 60px 7%;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 50px;
        }

        .hero-title {
          font-size: clamp(34px, 4vw, 46px);
          font-weight: 800;
          color: #087F6E;
          line-height: 1.15;
          margin-bottom: 18px;
        }

        .hero-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #4A6360;
          margin-bottom: 28px;
        }

        .btn-primary-pill {
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 12px 26px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-photo {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 20px;
          display: block;
        }

        /* STEPS SECTION */
        .steps-section {
          padding: 80px 7%;
          background: #FFFFFF;
        }

        .center-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-heading {
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 8px;
        }

        .sub-heading {
          font-size: 15px;
          color: #4A6360;
        }

        .steps-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .step-card {
          flex: 1;
          background: #FFFFFF;
          text-align: center;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-badge {
          width: 32px;
          height: 32px;
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .step-icon-bg {
          width: 60px;
          height: 60px;
          background: #E8F5F3;
          color: #087F6E;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .step-card h3 {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .step-card p {
          font-size: 12px;
          color: #4A6360;
          line-height: 1.5;
        }

        .step-arrow {
          font-size: 20px;
          color: #087F6E;
          font-weight: 700;
        }

        /* SPLIT SECTIONS (BOOKING & MANAGE) */
        .booking-process-section {
          padding: 70px 7%;
          background: #E8F5F3;
        }

        .manage-section {
          padding: 70px 7%;
          background: #FFFFFF;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 50px;
        }

        .split-desc {
          font-size: 15px;
          color: #4A6360;
          margin: 12px 0 24px 0;
        }

        .check-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .check-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: #0F2926;
          font-weight: 500;
        }

        .teal-check {
          color: #087F6E;
          flex-shrink: 0;
        }

        /* UI MOCKUP CARDS */
        .ui-mockup-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(8, 127, 110, 0.08);
          border: 1px solid #E1F0EE;
        }

        .mock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #EAF2F1;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }

        .mini-brand-logo {
          width: 100px;
          height: auto;
        }

        .mock-steps-stepper {
          display: flex;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
        }

        .mock-steps-stepper .active {
          color: #087F6E;
        }

        .mock-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #0F2926;
          margin-bottom: 6px;
        }

        .mock-dropdown {
          background: #F8FCFC;
          border: 1px solid #CBD5E1;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          color: #334155;
          margin-bottom: 18px;
        }

        .mock-date-time-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .mock-calendar {
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          padding: 12px;
          border-radius: 8px;
        }

        .cal-header {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .cal-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;
          font-size: 10px;
        }

        .cal-days span {
          padding: 4px 0;
        }

        .selected-day {
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 4px;
          font-weight: 700;
        }

        .mock-time-picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-btn {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11px;
          cursor: pointer;
        }

        .time-btn.active {
          background: #087F6E;
          color: #FFFFFF;
          border-color: #087F6E;
          font-weight: 700;
        }

        .mock-confirm-btn {
          width: 100%;
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        /* DASHBOARD LAPTOP FRAME */
        .dashboard-frame {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 14px;
          display: flex;
          min-height: 220px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
        }

        .dash-sidebar {
          width: 140px;
          background: #0F2926;
          padding: 16px 12px;
          color: #FFFFFF;
        }

        .dash-logo {
          width: 80px;
          margin-bottom: 20px;
          filter: brightness(0) invert(1);
        }

        .dash-menu-item {
          font-size: 11px;
          padding: 8px 10px;
          border-radius: 6px;
          color: #94A3B8;
          margin-bottom: 4px;
        }

        .dash-menu-item.active {
          background: #087F6E;
          color: #FFFFFF;
          font-weight: 600;
        }

        .dash-main {
          flex: 1;
          padding: 20px;
          background: #F8FCFC;
        }

        .dash-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dash-topbar h3 {
          font-size: 14px;
        }

        .dash-link {
          font-size: 11px;
          color: #087F6E;
          font-weight: 700;
        }

        .dash-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 14px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-card-left {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .dash-card-left h4 {
          font-size: 12px;
        }

        .dash-card-left p {
          font-size: 10px;
          color: #64748B;
        }

        .dash-time-tag {
          font-size: 9px;
          color: #087F6E;
          font-weight: 600;
        }

        .status-badge.confirmed {
          background: #DDF3EE;
          color: #087F6E;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 10px;
        }

        /* WHY MEDITRACK */
        .why-section {
          padding: 80px 7%;
          background: #F8FCFC;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .why-card {
          background: #FFFFFF;
          border: 1px solid #E1F0EE;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .why-icon {
          width: 42px;
          height: 42px;
          background: #E8F5F3;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .why-card h3 {
          font-size: 15px;
          margin-bottom: 4px;
        }

        .why-card p {
          font-size: 12px;
          color: #4A6360;
        }

        /* CALL TO ACTION BANNER */
        .cta-wrapper {
          width: 100%;
          padding: 40px 7%;
          background: #FFFFFF;
        }

        .cta-banner {
          max-width: 1200px;
          margin: 0 auto;
          background: #087F6E;
          border-radius: 30px;
          padding: 24px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 10px 25px rgba(8, 127, 110, 0.15);
        }

        .cta-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .cta-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cta-text h2 {
          color: #FFFFFF;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .cta-text p {
          color: #E1F0EE;
          font-size: 13px;
        }

        .btn-cta-white {
          background: #FFFFFF;
          color: #087F6E;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }

        .btn-cta-white:hover {
          transform: translateY(-2px);
        }

        /* LIGHT GRADIENT FOOTER */
        .footer-light {
          width: 100%;
          background: linear-gradient(180deg, #FFFFFF 0%, #D8F3EE 100%);
          padding: 30px 7%;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .footer-logo-img {
          width: 130px;
          height: auto;
          display: block;
        }

        .footer-divider {
          width: 1px;
          height: 24px;
          background: #CBD5E1;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
        }

        .footer-socials a {
          color: #0F2926;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .footer-socials a:hover {
          color: #087F6E;
        }

        .footer-right {
          text-align: right;
          font-size: 12px;
          color: #4A6360;
          line-height: 1.5;
        }

        .heart-icon {
          color: #FF4D4D;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .nav-links { display: none; }
          .desktop-only-btn { display: none !important; }
          .mobile-menu-btn { display: block; }
          .mobile-dropdown-menu { display: flex; }

          .hero-container,
          .split-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .steps-row {
            flex-direction: column;
          }

          .step-arrow {
            transform: rotate(90deg);
          }
        }

        @media (max-width: 850px) {
          .cta-banner {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }

          .cta-left {
            flex-direction: column;
          }

          .footer-container {
            flex-direction: column;
            gap: 20px;
            align-items: center;
            text-align: center;
          }

          .footer-right {
            text-align: center;
          }
        }

        @media (max-width: 600px) {
          .why-grid {
            grid-template-columns: 1fr;
          }

          .mock-date-time-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default HowItWorks;