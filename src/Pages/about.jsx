import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Target,
  Eye,
  Zap,
  Users,
  ShieldCheck,
  Heart,
  ArrowRight,
  CalendarDays,
  Clock,
  Plus,
  Menu,
  Activity
} from 'lucide-react';

// IMPORT YOUR LOCAL PROJECT ASSETS
import medimg from '../assets/medimg.jpg';
import docpaImg from '../assets/docpa1.jpg';
import hospitalImg from '../assets/building.jpg';

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="about-page-wrapper">
      
      {/* 1. NAVIGATION BAR */}
      <header className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <img src={medimg} alt="MediTrack Logo" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/how-it-works">How It Works</Link>
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


      {/* 2. ABOUT HERO SECTION */}
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-text-content">
            <div className="badge-pill">ABOUT MEDITRACK</div>
            <h1 className="hero-title">
              Making healthcare <br />
              appointments simpler.
            </h1>
            <p className="hero-description">
              MediTrack is a modern platform that helps you organize, manage and keep track of your hospital appointments with ease.
            </p>
            <a href="#our-story" className="btn-primary-pill">
              Discover our story <ArrowRight size={16} />
            </a>
          </div>

          <div className="hero-image-wrapper">
            <img 
              src={docpaImg} 
              alt="Doctor attending to a patient" 
              className="hero-photo"
            />
          </div>
        </div>
      </section>


      {/* 3. OUR STORY SECTION */}
      <section className="our-story-section" id="our-story">
        <div className="story-container">
          <div className="story-image-wrapper">
            <img 
              src={hospitalImg} 
              alt="MediTrack Partner Hospital" 
              className="story-photo"
            />
          </div>

          <div className="story-text-content">
            <div className="badge-pill">OUR STORY</div>
            <h2 className="section-heading">Why MediTrack?</h2>
            <p className="story-paragraph">
              We noticed how stressful it can be to keep track of hospital appointments — long queues, missed dates, and confusion.
            </p>
            <p className="story-paragraph">
              That's why we built MediTrack: a smart, easy-to-use platform that puts your appointments in one place, so you can focus on what truly matters — your health.
            </p>
          </div>
        </div>
      </section>


      {/* 4. MISSION & VISION SECTION */}
      <section className="mission-vision-section">
        <div className="section-container">
          <div className="mv-grid">
            
            {/* Mission Card */}
            <div className="mv-card">
              <div className="mv-icon-box">
                <Target size={28} />
              </div>
              <div className="mv-card-body">
                <h3>Our Mission</h3>
                <p>To make healthcare more accessible and organized for everyone.</p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="mv-card">
              <div className="mv-icon-box">
                <Eye size={28} />
              </div>
              <div className="mv-card-body">
                <h3>Our Vision</h3>
                <p>To become the leading healthcare appointment platform across Africa.</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 5. WHAT WE DO SECTION */}
      <section className="what-we-do-section">
        <div className="section-container wwd-container">
          <div className="wwd-text-content">
            <div className="badge-pill">WHAT WE DO</div>
            <h2 className="section-heading">Your Health, Our Priority</h2>
            <p className="wwd-description">
              MediTrack helps patients book, manage and track hospital appointments effortlessly — anytime, anywhere.
            </p>
            <Link to="/get-started" className="btn-primary-pill">
              Start Using MediTrack <ArrowRight size={16} />
            </Link>
          </div>

          {/* Clean Vector Visual Illustrating App Core */}
          <div className="wwd-illustration-wrapper">
            <div className="calendar-illustration-card">
              <div className="illus-header">
                <CalendarDays size={22} className="illus-icon-teal" />
                <span className="illus-title">Upcoming Visits</span>
              </div>
              <div className="illus-check-grid">
                <div className="illus-check-item checked">✓ General Checkup</div>
                <div className="illus-check-item">□ Cardiology Follow-up</div>
                <div className="illus-check-item checked">✓ Blood Test</div>
                <div className="illus-check-item">□ Pediatric Review</div>
              </div>
              <div className="illus-floating-badge clock">
                <Clock size={18} />
              </div>
              <div className="illus-floating-badge plus">
                <Plus size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 6. OUR CORE VALUES SECTION */}
      <section className="core-values-section">
        <div className="section-container">
          <div className="values-header">
            <div className="badge-pill">OUR CORE VALUES</div>
            <h2 className="section-heading">What Drives Us</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box">
                <Zap size={24} />
              </div>
              <h3>Simplicity</h3>
              <p>Easy to use, always.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <Users size={24} />
              </div>
              <h3>Accessibility</h3>
              <p>Healthcare for all.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Reliability</h3>
              <p>You can count on us.</p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <Heart size={24} />
              </div>
              <h3>Patient-Centred Care</h3>
              <p>Your health comes first.</p>
            </div>
          </div>
        </div>
      </section>


      {/* 7. CALL TO ACTION BANNER */}
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


      {/* 8. FOOTER */}
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


      {/* INTERNAL CSS STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .about-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #FFFFFF;
          color: #0F2926;
        }

        /* NAVIGATION BAR */
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
          width: 150px;
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
          transition: background 0.2s ease;
        }

        .btn-get-started:hover {
          background: #066658;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #0F2926;
        }

        /* MOBILE DROPDOWN */
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
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          text-align: center;
        }

        .mobile-dropdown-menu a {
          text-decoration: none;
          color: #4A6360;
          font-size: 16px;
          font-weight: 500;
        }

        .mobile-dropdown-menu a:hover {
          color: #087F6E;
        }

        /* GENERAL SECTION CONTAINERS & BADGES */
        .badge-pill {
          display: inline-block;
          background: #DDF3EE;
          color: #087F6E;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .section-heading {
          font-size: clamp(28px, 3.2vw, 40px);
          font-weight: 800;
          color: #0F2926;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .btn-primary-pill {
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .btn-primary-pill:hover {
          background: #066658;
        }

        /* 2. HERO SECTION */
        .about-hero {
          width: 100%;
          background: #F4FAF9;
          padding: 60px 7%;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .hero-title {
          font-size: clamp(34px, 4vw, 48px);
          font-weight: 800;
          color: #0F2926;
          line-height: 1.15;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: 16px;
          line-height: 1.6;
          color: #4A6360;
          margin-bottom: 28px;
          max-width: 480px;
        }

        .hero-image-wrapper {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .hero-photo {
          width: 100%;
          max-width: 520px;
          height: 380px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(8, 127, 110, 0.08);
        }

        /* 3. OUR STORY SECTION */
        .our-story-section {
          width: 100%;
          padding: 90px 7%;
          background: #FFFFFF;
        }

        .story-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .story-photo {
          width: 100%;
          max-width: 520px;
          height: 360px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .story-paragraph {
          font-size: 15px;
          line-height: 1.75;
          color: #4A6360;
          margin-bottom: 16px;
        }

        /* 4. MISSION & VISION SECTION */
        .mission-vision-section {
          width: 100%;
          padding: 30px 7% 70px 7%;
          background: #FFFFFF;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .mv-card {
          background: #F4FAF9;
          border: 1px solid #E1F0EE;
          padding: 32px;
          border-radius: 18px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .mv-icon-box {
          width: 56px;
          height: 56px;
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mv-card-body h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0F2926;
          margin-bottom: 8px;
        }

        .mv-card-body p {
          font-size: 14px;
          color: #4A6360;
          line-height: 1.6;
        }

        /* 5. WHAT WE DO SECTION */
        .what-we-do-section {
          width: 100%;
          padding: 80px 7%;
          background: #F4FAF9;
        }

        .wwd-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .wwd-description {
          font-size: 16px;
          line-height: 1.6;
          color: #4A6360;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .wwd-illustration-wrapper {
          display: flex;
          justify-content: center;
        }

        .calendar-illustration-card {
          background: #FFFFFF;
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 20px 40px rgba(8, 127, 110, 0.08);
          position: relative;
        }

        .illus-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #EAF2F1;
          padding-bottom: 12px;
        }

        .illus-icon-teal {
          color: #087F6E;
        }

        .illus-title {
          font-weight: 700;
          font-size: 16px;
          color: #0F2926;
        }

        .illus-check-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .illus-check-item {
          background: #F8FCFC;
          border: 1px solid #EAF2F1;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          color: #4A6360;
          font-weight: 500;
        }

        .illus-check-item.checked {
          background: #EEF8F6;
          color: #087F6E;
          font-weight: 600;
        }

        .illus-floating-badge {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #087F6E;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(8, 127, 110, 0.2);
        }

        .illus-floating-badge.clock {
          bottom: -15px;
          left: 30px;
        }

        .illus-floating-badge.plus {
          top: -15px;
          right: 30px;
        }

        /* 6. OUR CORE VALUES SECTION */
        .core-values-section {
          width: 100%;
          padding: 90px 7%;
          background: #FFFFFF;
          text-align: center;
        }

        .values-header {
          margin-bottom: 50px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .value-card {
          background: #F4FAF9;
          border: 1px solid #E1F0EE;
          padding: 36px 20px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .value-card:hover {
          transform: translateY(-4px);
        }

        .value-icon-box {
          width: 52px;
          height: 52px;
          background: #DDF3EE;
          color: #087F6E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .value-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0F2926;
          margin-bottom: 8px;
        }

        .value-card p {
          font-size: 13px;
          color: #4A6360;
        }

        /* 7. CALL TO ACTION BANNER */
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

        /* 8. LIGHT GRADIENT FOOTER */
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

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .nav-links {
            display: none;
          }

          .desktop-only-btn {
            display: none !important;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-dropdown-menu {
            display: flex;
          }

          .hero-container,
          .story-container,
          .wwd-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-image-wrapper,
          .story-image-wrapper {
            justify-content: center;
          }

          .hero-photo,
          .story-photo {
            max-width: 100%;
            height: auto;
          }

          .mv-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
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
          .navbar {
            padding: 16px 5%;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

