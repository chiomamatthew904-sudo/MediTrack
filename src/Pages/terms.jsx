import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import medimg from '../assets/medimg.jpg';

const SECTIONS = [
  { id: 'introduction', number: 1, title: 'Introduction' },
  { id: 'about-meditrack', number: 2, title: 'About MediTrack' },
  { id: 'user-registration', number: 3, title: 'User Registration and Account Responsibilities' },
  { id: 'appointment-management', number: 4, title: 'Appointment Management' },
  { id: 'medical-disclaimer', number: 5, title: 'Medical Disclaimer' },
  { id: 'notifications-reminders', number: 6, title: 'Notifications and Reminders' },
  { id: 'acceptable-use', number: 7, title: 'Acceptable Use' },
  { id: 'privacy-information', number: 8, title: 'Privacy and Personal Information' },
  { id: 'platform-availability', number: 9, title: 'Platform Availability' },
  { id: 'account-suspension', number: 10, title: 'Account Suspension or Termination' },
  { id: 'changes-terms', number: 11, title: 'Changes to These Terms' },
  { id: 'contact-information', number: 12, title: 'Contact Information' }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      localStorage.getItem('theme') === 'dark'
    );
  });

  // Sync theme state with global document classes/attributes
  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Smooth scroll to section on TOC click
  const scrollToSection = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  // Highlight active TOC item while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`terms-page-wrapper ${isDark ? 'terms-dark' : ''}`}>
      {/* TOP NAVIGATION HEADER */}
      <header className="terms-navbar">
        <div className="terms-navbar-inner">
          <div className="terms-nav-left">
            <Link to="/" className="terms-brand-logo">
            <img src={medimg} alt="MediTrack Logo" className="terms-brand-image" />
             </Link>

            <Link to="/" className="terms-back-link">
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="terms-nav-right">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="terms-theme-toggle"
              aria-label="Toggle Light or Dark Mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Sun size={15} className={`theme-icon-sun ${!isDark ? 'active' : ''}`} />
              <span className={`theme-switch-pill ${isDark ? 'is-dark' : ''}`}>
                <span className="theme-switch-thumb" />
              </span>
              <Moon size={15} className={`theme-icon-moon ${isDark ? 'active' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="terms-main-container">
        {/* HERO BANNER */}
        <section className="terms-hero-card">
          <div className="terms-hero-overlay" />
          <div className="terms-hero-content">
            <h1 className="terms-hero-title">Terms of Service</h1>
            <p className="terms-hero-subtitle">
              By using MediTrack, you agree to these Terms of Service. Please read them carefully.
            </p>
            <div className="terms-effective-date">
              <Calendar size={15} />
              <span>Effective Date: November 18, 2026</span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LEGAL DOCUMENT LAYOUT */}
        <div className="terms-content-grid">
          {/* STICKY SIDEBAR TABLE OF CONTENTS */}
          <aside className="terms-toc-sidebar">
            <div className="terms-toc-card">
              <h2 className="terms-toc-heading">Table of Contents</h2>
              <nav aria-label="Terms of Service Sections">
                <ul className="terms-toc-list">
                  {SECTIONS.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        onClick={(e) => scrollToSection(e, sec.id)}
                        className={`terms-toc-link ${activeSection === sec.id ? 'active' : ''}`}
                      >
                        <span className="toc-num">{sec.number}.</span>
                        <span className="toc-text">{sec.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* LEGAL SECTIONS BODY */}
          <div className="terms-document-card">
            {/* 1. Introduction */}
            <section id="introduction" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">1</span>
                <h2>Introduction and Acceptance of Terms</h2>
              </div>
              <p>
                Welcome to MediTrack. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the MediTrack patient follow-up and appointment reminder management web application. By registering for an account, accessing, or using MediTrack, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue use of the platform.
              </p>
            </section>

            {/* 2. About MediTrack */}
            <section id="about-meditrack" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">2</span>
                <h2>About MediTrack and Its Services</h2>
              </div>
              <p>
                MediTrack is a patient-focused organizational tool designed to help individuals track and manage their healthcare follow-up appointments. The platform enables users to manually enter appointment details received from hospitals or healthcare providers, monitor appointment statuses (Upcoming, Completed, Missed, and Cancelled), and receive in-app appointment reminders.
              </p>
              <p>
                Please note that MediTrack is not a hospital management system, electronic medical records (EMR) system, or healthcare provider. MediTrack does not schedule appointments directly with hospitals and does not independently verify the appointment details entered by users.
              </p>
            </section>

            {/* 3. User Registration and Account Responsibilities */}
            <section id="user-registration" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">3</span>
                <h2>User Registration and Account Responsibilities</h2>
              </div>
              <p>
                To use MediTrack&rsquo;s appointment management features, you must create a personal account and provide accurate, complete registration details. You are responsible for maintaining the confidentiality of your login credentials and for all activity conducted under your account. If you believe your account has been accessed without authorization, please notify our support team promptly.
              </p>
            </section>

            {/* 4. Appointment Management */}
            <section id="appointment-management" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">4</span>
                <h2>Appointment Management and Accuracy of User-Entered Information</h2>
              </div>
              <p>
                Because appointment records in MediTrack are entered directly by you, you are solely responsible for ensuring that dates, times, hospital or clinic names, and follow-up details are accurate. You can add, view, edit, or cancel your saved appointments at any time, and you should update your records promptly whenever a healthcare provider reschedules or modifies your visit.
              </p>
            </section>

            {/* 5. Medical Disclaimer */}
            <section id="medical-disclaimer" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">5</span>
                <h2>Medical Disclaimer and Platform Limitations</h2>
              </div>
              <div className="terms-disclaimer-callout">
                <AlertTriangle size={20} className="disclaimer-icon" />
                <div>
                  <strong>Important Medical Disclaimer:</strong> MediTrack is not a hospital, clinic, emergency service, or medical diagnosis platform. It does not provide medical advice, diagnose health conditions, prescribe medications, or replace qualified doctors and healthcare professionals. Always follow the direct medical advice and instructions of your healthcare provider, and seek immediate emergency medical care when needed.
                </div>
              </div>
            </section>

            {/* 6. Notifications and Reminders */}
            <section id="notifications-reminders" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">6</span>
                <h2>Notifications and Appointment Reminders</h2>
              </div>
              <p>
                MediTrack provides automated in-app appointment reminders based on the dates, times, and reminder preferences you configure in your account. While these notifications are designed to support your personal scheduling, you should not rely exclusively on MediTrack reminders for critical or time-sensitive medical appointments. Always maintain independent awareness of your healthcare schedule.
              </p>
            </section>

            {/* 7. Acceptable Use */}
            <section id="acceptable-use" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">7</span>
                <h2>Acceptable Use and Prohibited Activities</h2>
              </div>
              <p>
                You agree to use MediTrack strictly for lawful, personal appointment organization purposes. You must not attempt to access another user&rsquo;s account or data, interfere with or disrupt the platform&rsquo;s normal operation, submit false or misleading information, or attempt to bypass any technical safeguards or access controls.
              </p>
            </section>

            {/* 8. Privacy and Personal Information */}
            <section id="privacy-information" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">8</span>
                <h2>User Privacy and Reference to the Privacy Policy</h2>
              </div>
              <p>
                Your personal information and appointment records are handled in accordance with our{' '}
                <Link to="/privacy" className="terms-inline-link">
                  Privacy Policy
                </Link>
                . Please review our{' '}
                <Link to="/privacy" className="terms-inline-link">
                  Privacy Policy
                </Link>{' '}
                to understand how MediTrack collects, uses, and manages your account information.
              </p>
            </section>

            {/* 9. Platform Availability */}
            <section id="platform-availability" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">9</span>
                <h2>Platform Availability and Technical Interruptions</h2>
              </div>
              <p>
                We strive to keep MediTrack accessible and reliable; however, the platform is provided on an &ldquo;as available&rdquo; basis. Access may occasionally be interrupted due to scheduled maintenance, updates, network issues, or unforeseen technical disruptions. MediTrack is not liable for missed appointments resulting from temporary service unavailability.
              </p>
            </section>

            {/* 10. Account Suspension or Termination */}
            <section id="account-suspension" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">10</span>
                <h2>Account Suspension and Termination</h2>
              </div>
              <p>
                You may stop using MediTrack at any time. We reserve the right to restrict, suspend, or terminate your account if you violate these Terms of Service, misuse the platform, or engage in activities that compromise the safety or integrity of MediTrack and its users.
              </p>
            </section>

            {/* 11. Changes to These Terms */}
            <section id="changes-terms" className="terms-section-block">
              <div className="terms-section-header">
                <span className="terms-section-badge">11</span>
                <h2>Changes to the Terms of Service</h2>
              </div>
              <p>
                We may update or revise these Terms of Service periodically to reflect improvements to MediTrack or operational updates. When changes are made, we will update the &ldquo;Effective Date&rdquo; displayed at the top of this page. Continued use of MediTrack after updates take effect constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section id="contact-information" className="terms-section-block last-section">
              <div className="terms-section-header">
                <span className="terms-section-badge">12</span>
                <h2>Contact and Support Information</h2>
              </div>
              <p>
                If you have questions, feedback, or concerns regarding these Terms of Service or your MediTrack account, please contact our support team at:{' '}
                <a href="mailto:meditracksupport@gmail.com" className="terms-inline-link">
                  meditracksuppoort@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        {/* PRIVACY POLICY FOOTER BANNER */}
        <div className="terms-privacy-banner">
          <ShieldCheck size={20} className="privacy-banner-icon" />
          <p>
            For more details on how your data is handled, please review our{' '}
            <Link to="/privacy" className="terms-inline-link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      {/* MINIMAL SITE FOOTER */}
      <footer className="terms-footer">
        <div className="terms-footer-inner">
           <Link to="/" className="terms-footer-brand">
            <img src={medimg} alt="MediTrack Logo" className="terms-footer-image" />
             </Link>

          <p className="terms-footer-tagline">Your Health. Our Priority.</p>

          <div className="terms-footer-links">
            <Link to="/terms">Terms of Service</Link>
            <span className="footer-sep">|</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-sep">|</span>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </footer>

      {/* COMPONENT STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .terms-page-wrapper {
          --bg-page: #F5FBF9;
          --bg-surface: #FFFFFF;
          --bg-tint: #EAF7F4;
          --bg-callout: #E9F6F4;
          --border-color: #DCEEEB;
          --border-subtle: #EDF5F4;
          --text-primary: #0F2926;
          --text-secondary: #47625E;
          --text-muted: #647C78;
          --teal-main: #087F6E;
          --teal-hover: #066658;
          --teal-soft: #D7F2EE;
          --footer-bg: #073832;
          --shadow-card: 0 4px 20px rgba(8, 127, 110, 0.05);

          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: var(--bg-page);
          color: var(--text-primary);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        /* DARK MODE VARIABLES */
        .terms-page-wrapper.terms-dark,
        .dark .terms-page-wrapper,
        [data-theme='dark'] .terms-page-wrapper {
          --bg-page: #0B1917;
          --bg-surface: #112421;
          --bg-tint: #16302C;
          --bg-callout: #152E2A;
          --border-color: #1F3F3A;
          --border-subtle: #1A3531;
          --text-primary: #ECFDF9;
          --text-secondary: #B4CECA;
          --text-muted: #84A39E;
          --teal-main: #14B8A6;
          --teal-hover: #2DD4BF;
          --teal-soft: rgba(20, 184, 166, 0.16);
          --footer-bg: #061210;
          --shadow-card: 0 6px 24px rgba(0, 0, 0, 0.28);
        }

        /* NAVBAR */
        .terms-navbar {
          position: sticky;
          top: 0;
          z-index: 40;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          padding: 14px 24px;
        }

        .terms-navbar-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .terms-nav-left {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .terms-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .terms-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background-color: #087F6E;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .terms-brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .terms-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .terms-back-link:hover {
          color: var(--teal-main);
        }

        /* THEME TOGGLE */
        .terms-theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: var(--text-muted);
        }

        .theme-icon-sun.active,
        .theme-icon-moon.active {
          color: var(--teal-main);
        }

        .theme-switch-pill {
          width: 38px;
          height: 20px;
          background-color: #16302C;
          border-radius: 999px;
          position: relative;
          display: inline-block;
          transition: background-color 0.2s ease;
        }

        .theme-switch-pill.is-dark {
          background-color: #14B8A6;
        }

        .theme-switch-thumb {
          width: 14px;
          height: 14px;
          background-color: #FFFFFF;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.2s ease;
        }

        .theme-switch-pill.is-dark .theme-switch-thumb {
          transform: translateX(18px);
        }

        /* MAIN CONTAINER */
        .terms-main-container {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          padding: 28px 24px 48px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* HERO BANNER */
        .terms-hero-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(125deg, #065F52 0%, #0A8473 55%, #1E6E78 100%);
          padding: 44px 42px;
          color: #FFFFFF;
          box-shadow: 0 10px 28px rgba(8, 127, 110, 0.16);
        }

        .terms-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 40%, rgba(255, 255, 255, 0.14) 0%, transparent 55%);
          pointer-events: none;
        }

        .terms-hero-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .terms-hero-title {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
          line-height: 1.15;
        }

        .terms-hero-subtitle {
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 0 18px;
        }

        .terms-effective-date {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.22);
        }

        /* TWO-COLUMN DOCUMENT GRID */
        .terms-content-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* TABLE OF CONTENTS SIDEBAR */
        .terms-toc-sidebar {
          position: sticky;
          top: 84px;
        }

        .terms-toc-card {
          background-color: var(--bg-tint);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 22px 18px;
        }

        .terms-toc-heading {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 14px 8px;
        }

        .terms-toc-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .terms-toc-link {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          line-height: 1.4;
          transition: background-color 0.18s ease, color 0.18s ease;
        }

        .terms-toc-link:hover {
          background-color: var(--teal-soft);
          color: var(--text-primary);
        }

        .terms-toc-link.active {
          background-color: var(--teal-soft);
          color: var(--teal-main);
          font-weight: 700;
        }

        .toc-num {
          flex-shrink: 0;
        }

        /* DOCUMENT CONTENT CARD */
        .terms-document-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 32px 36px;
          box-shadow: var(--shadow-card);
        }

        .terms-section-block {
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .terms-section-block.last-section {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: none;
        }

        .terms-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .terms-section-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #087F6E;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .terms-section-header h2 {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .terms-section-block p {
          margin: 0 0 10px 38px;
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        .terms-section-block p:last-child {
          margin-bottom: 0;
        }

        /* MEDICAL DISCLAIMER CALLOUT */
        .terms-disclaimer-callout {
          margin-left: 38px;
          background-color: var(--bg-callout);
          border: 1px solid var(--border-color);
          border-left: 4px solid #087F6E;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .disclaimer-icon {
          color: var(--teal-main);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* INLINE LINKS */
        .terms-inline-link {
          color: var(--teal-main);
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .terms-inline-link:hover {
          color: var(--teal-hover);
        }

        /* PRIVACY BANNER */
        .terms-privacy-banner {
          background-color: var(--bg-tint);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .privacy-banner-icon {
          color: var(--teal-main);
          flex-shrink: 0;
        }

        .terms-privacy-banner p {
          margin: 0;
        }

        /* FOOTER */
        .terms-footer {
          background-color: var(--footer-bg);
          color: #FFFFFF;
          padding: 22px 24px;
          margin-top: auto;
        }

        .terms-footer-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .terms-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #FFFFFF;
          text-decoration: none;
          font-weight: 800;
          font-size: 17px;
        }

        .terms-footer-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background-color: #FFFFFF;
          color: #073832;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .terms-footer-tagline {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .terms-footer-links {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .terms-footer-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 600;
        }

        .terms-footer-links a:hover {
          color: #5EEAD4;
        }

        .footer-sep {
          color: rgba(255, 255, 255, 0.35);
        }

        .terms-brand-image {
         width: 150px;
         height: auto;
         object-fit: contain;
       }

        .terms-footer-image {
         width: 135px;
         height: auto;
         object-fit: contain;
       }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 900px) {
          .terms-content-grid {
            grid-template-columns: 1fr;
          }

          .terms-toc-sidebar {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .terms-hero-card {
            padding: 32px 24px;
          }

          .terms-hero-title {
            font-size: 28px;
          }

          .terms-document-card {
            padding: 24px 20px;
          }

          .terms-section-block p,
          .terms-disclaimer-callout {
            margin-left: 0;
          }

          .terms-footer-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}