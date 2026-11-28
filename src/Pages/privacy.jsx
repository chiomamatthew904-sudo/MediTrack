import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Mail,
  Sun,
  Moon
} from 'lucide-react';
import medimg from '../assets/medimg.jpg';

export default function PrivacyPage() {
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

  return (
    <div className={`privacy-page-wrapper ${isDark ? 'privacy-dark' : ''}`}>
      {/* TOP NAVIGATION HEADER */}
      <header className="privacy-navbar">
        <div className="privacy-navbar-inner">
          <div className="privacy-nav-left">
            <Link to="/" className="privacy-brand-logo">
             <img
               src={medimg}
               alt="MediTrack"
               className="privacy-brand-image"
            />
            </Link>

            <Link to="/" className="privacy-back-link">
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="privacy-nav-right">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="privacy-theme-toggle"
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
      <main className="privacy-main-container">
        {/* HERO BANNER */}
        <section className="privacy-hero-card">
          <div className="privacy-hero-overlay" />
          <div className="privacy-hero-content">
            <div className="privacy-badge-pill">
              <ShieldCheck size={14} />
              <span>Privacy Policy</span>
            </div>
            <h1 className="privacy-hero-title">Your Privacy Matters</h1>
            <p className="privacy-hero-subtitle">
              Learn how MediTrack collects, uses, stores and protects your personal information.
            </p>
            <div className="privacy-effective-date">
              <Calendar size={15} />
              <span>Effective Date: November 17, 2026</span>
            </div>
          </div>
          <div className="privacy-hero-graphic">
            <div className="privacy-shield-badge">
              <ShieldCheck size={48} />
            </div>
          </div>
        </section>

        {/* SINGLE-COLUMN CENTERED DOCUMENT CARD */}
        <div className="privacy-document-card">
          {/* 1. Introduction */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">1</span>
              <h2>Introduction</h2>
            </div>
            <p>
              MediTrack is a patient-focused appointment follow-up and reminder management platform. This Privacy Policy explains how we collect, use, store and protect your personal information when you use our website and services.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">2</span>
              <h2>Information We Collect</h2>
            </div>
            <p>
              We may collect personal information such as your name, email address, phone number, appointment details, notification preferences and any information you provide when contacting us.
            </p>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">3</span>
              <h2>How We Use Your Information</h2>
            </div>
            <p>
              We use your information to manage your account, track appointments, send reminders, improve our services, and respond to enquiries or support requests. MediTrack provides appointment reminders but does not guarantee that every notification will be delivered.
            </p>
          </section>

          {/* 4. How Your Information Is Stored */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">4</span>
              <h2>How Your Information Is Stored</h2>
            </div>
            <p>
              Your data is securely stored using Supabase, our trusted database provider, and is protected with industry-standard security measures. Supabase handles authentication and database storage for the platform, while Express powers our backend architecture.
            </p>
          </section>

          {/* 5. Information Sharing and Access */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">5</span>
              <h2>Information Sharing and Access</h2>
            </div>
            <p>
              Your information is kept private. Authorised MediTrack administrators may access patient records for legitimate platform administration and support purposes. Patients should only be able to access their own appointment records. We do not sell, rent or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          {/* 6. Data Security */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">6</span>
              <h2>Data Security</h2>
            </div>
            <p>
              We take reasonable measures to protect your personal information from unauthorised access, loss, misuse or alteration. However, no online platform can guarantee complete security.
            </p>
          </section>

          {/* 7. Your Privacy Rights */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">7</span>
              <h2>Your Privacy Rights</h2>
            </div>
            <p>
              You have the right to access, correct or request deletion of your personal information. To exercise these rights, please contact us at{' '}
              <a href="mailto:meditracksupport@gmail.com" className="privacy-inline-link">
                meditracksupport@gmail.com
              </a>
              .
            </p>
          </section>

          {/* 8. Account Deletion Requests */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">8</span>
              <h2>Account Deletion Requests</h2>
            </div>
            <p>
              If you wish to delete your account, you can request this by emailing{' '}
              <a href="mailto:meditracksupport@gmail.com" className="privacy-inline-link">
                meditracksupport@gmail.com
              </a>
              . We will process your request subject to identity verification and any applicable data-retention requirements.
            </p>
          </section>

          {/* 9. Cookies and Local Storage */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">9</span>
              <h2>Cookies and Local Storage</h2>
            </div>
            <p>
              We may use cookies and similar technologies to enhance your experience, remember your preferences and analyse website usage. You can control cookies through your browser settings.
            </p>
          </section>

          {/* 10. Third-Party Services */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">10</span>
              <h2>Third-Party Services</h2>
            </div>
            <p>
              MediTrack may use trusted third-party services such as Supabase for authentication and data storage, and Resend for certain outgoing administrative emails. These services have their own privacy practices.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">11</span>
              <h2>Children's Privacy</h2>
            </div>
            <p>
              MediTrack is not specifically designed for children under 13. We do not knowingly collect personal information from children. If we become aware that we have collected such information, we will take steps to delete it.
            </p>
          </section>

          {/* 12. Changes to This Privacy Policy */}
          <section className="privacy-section-block">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">12</span>
              <h2>Changes to This Privacy Policy</h2>
            </div>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
            </p>
          </section>

          {/* 13. Contact Us */}
          <section className="privacy-section-block last-section">
            <div className="privacy-section-header">
              <span className="privacy-section-badge">13</span>
              <h2>Contact Us</h2>
            </div>
            <p>
              If you have any questions or concerns about this Privacy Policy, please reach out to us at:
            </p>

            <div className="privacy-contact-box">
              <div className="privacy-contact-icon">
                <Mail size={22} />
              </div>
              <div className="privacy-contact-details">
                <a href="mailto:meditracksupport@gmail.com" className="privacy-email-link">
                  meditracksuppoort@gmail.com
                </a>
                <span>We're here to help. Feel free to reach out anytime.</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* SITE FOOTER */}
      <footer className="privacy-footer">
        <div className="privacy-footer-inner">
          <Link to="/" className="privacy-footer-brand">
            <img
              src={medimg}
              alt="MediTrack"
              className="privacy-footer-image"
            />
          </Link>

          <div className="privacy-footer-links">
            <Link to="/terms">Terms of Service</Link>
            <span className="footer-sep">|</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-sep">|</span>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="privacy-footer-socials">
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon-btn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="#twitter" aria-label="X (Twitter)" className="social-icon-btn">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#youtube" aria-label="YouTube" className="social-icon-btn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <div className="privacy-footer-bottom">
          <p>© 2026 MediTrack. All rights reserved.</p>
        </div>
      </footer>

      {/* COMPONENT STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .privacy-page-wrapper {
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
        .privacy-page-wrapper.privacy-dark,
        .dark .privacy-page-wrapper,
        [data-theme='dark'] .privacy-page-wrapper {
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
        .privacy-navbar {
          position: sticky;
          top: 0;
          z-index: 40;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          padding: 14px 24px;
        }

        .privacy-navbar-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .privacy-nav-left {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .privacy-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .privacy-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background-color: #087F6E;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .privacy-brand-text {
          display: flex;
          flex-direction: column;
        }

        .privacy-brand-name {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .privacy-brand-tagline {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .privacy-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .privacy-back-link:hover {
          color: var(--teal-main);
        }

        /* THEME TOGGLE */
        .privacy-theme-toggle {
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
        .privacy-main-container {
          max-width: 920px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 24px 56px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* HERO BANNER */
        .privacy-hero-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(135deg, #065F52 0%, #087F6E 50%, #14B8A6 100%);
          padding: 48px 44px;
          color: #FFFFFF;
          box-shadow: 0 10px 30px rgba(8, 127, 110, 0.18);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .privacy-hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 90% 30%, rgba(255, 255, 255, 0.16) 0%, transparent 60%);
          pointer-events: none;
        }

        .privacy-hero-content {
          position: relative;
          z-index: 1;
          max-width: 540px;
        }

        .privacy-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(4px);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 14px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .privacy-hero-title {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
          line-height: 1.15;
        }

        .privacy-hero-subtitle {
          font-size: 15.5px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 0 18px;
        }

        .privacy-effective-date {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.22);
        }

        .privacy-hero-graphic {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .privacy-shield-badge {
          width: 90px;
          height: 90px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        /* CENTERED SINGLE-COLUMN DOCUMENT CARD */
        .privacy-document-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 44px 52px;
          box-shadow: var(--shadow-card);
        }

        .privacy-section-block {
          padding-bottom: 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .privacy-section-block.last-section {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: none;
        }

        .privacy-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .privacy-section-badge {
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

        .privacy-section-header h2 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .privacy-section-block p {
          margin: 0 0 0 38px;
          font-size: 14.5px;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        /* INLINE LINKS */
        .privacy-inline-link {
          color: var(--teal-main);
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .privacy-inline-link:hover {
          color: var(--teal-hover);
        }

        /* CONTACT BOX */
        .privacy-contact-box {
          margin: 16px 0 0 38px;
          background-color: var(--bg-callout);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .privacy-contact-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background-color: var(--teal-soft);
          color: var(--teal-main);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .privacy-contact-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .privacy-email-link {
          font-size: 16px;
          font-weight: 800;
          color: var(--teal-main);
          text-decoration: none;
        }

        .privacy-email-link:hover {
          text-decoration: underline;
        }

        .privacy-contact-details span {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* FOOTER */
        .privacy-footer {
          background-color: var(--footer-bg);
          color: #FFFFFF;
          padding: 32px 24px 24px;
          margin-top: auto;
        }

        .privacy-footer-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .privacy-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #FFFFFF;
          text-decoration: none;
        }

        .privacy-footer-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: #FFFFFF;
          color: #073832;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .privacy-footer-brand-text {
          display: flex;
          flex-direction: column;
        }

        .privacy-footer-brand-name {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.2;
        }

        .privacy-footer-tagline {
          margin: 0;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 500;
        }

        .privacy-footer-links {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13.5px;
        }

        .privacy-footer-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 600;
        }

        .privacy-footer-links a:hover {
          color: #5EEAD4;
        }

        .footer-sep {
          color: rgba(255, 255, 255, 0.35);
        }

        .privacy-footer-socials {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }

        .social-icon-btn:hover {
          background-color: #087F6E;
        }

        .privacy-footer-bottom {
          max-width: 1000px;
          margin: 20px auto 0;
          text-align: center;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.6);
        }

        .privacy-footer-bottom p {
          margin: 0;
        }

        .privacy-brand-image {
         width: 150px;
         height: auto;
         object-fit: contain;
       }

        .privacy-footer-image {
         width: 150px;
         height: auto;
         object-fit: contain;
       }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 768px) {
          .privacy-hero-card {
            flex-direction: column;
            padding: 36px 24px;
            text-align: center;
          }

          .privacy-hero-content {
            max-width: 100%;
          }

          .privacy-effective-date {
            justify-content: center;
          }

          .privacy-document-card {
            padding: 28px 22px;
          }

          .privacy-section-block p,
          .privacy-contact-box {
            margin-left: 0;
          }

          .privacy-footer-inner {
            flex-direction: column;
            text-align: center;
          }

          .privacy-footer-socials {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}