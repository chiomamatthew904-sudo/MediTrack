import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Menu,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  HeartHandshake
} from 'lucide-react';

// IMPORT YOUR LOCAL PROJECT ASSETS
import medimg from '../assets/medimg.jpg';
import supportRepImg from '../assets/conhero.jpg'; 
import contactHeartImg from '../assets/coheart.jpg';   

export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Please select a subject.';
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
    } else {
      setErrors({});
      setSuccessMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    }
  };

  const faqs = [
    {
      q: '1. How do I create a MediTrack account?',
      a: 'Visit the website, click Get Started, and complete the registration form with the required personal details to create your account.'
    },
    {
      q: '2. How do I book an appointment?',
      a: 'Log in to your MediTrack account, browse available healthcare providers, select a suitable date and time, and submit your appointment request.'
    },
    {
      q: '3. How can I check my appointment status?',
      a: 'Log in to your account and visit the appointments section to view your booking details and current appointment status.'
    },
    {
      q: '4. Can I manage my appointments online?',
      a: 'Yes. MediTrack allows users to view their appointment details and manage their bookings through their dashboard, according to the available application features.'
    },
    {
      q: '5. What should I do if I experience a problem?',
      a: 'You can contact the MediTrack support team through the Contact form or the official support email for assistance.'
    }
  ];

  return (
    <div className="contact-page-wrapper">
      
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <img src={medimg} alt="MediTrack Logo" />
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/contact" className="active">Contact</Link>
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

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="mobile-dropdown-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="contact-hero">
        <div className="hero-container">
          <div className="hero-text-content">
            <span className="badge-pill">Contact Us</span>
            <h1 className="hero-title">We'd Love to Hear From You.</h1>
            <p className="hero-desc">
              Have questions, feedback, or need support? Our team is here to help.
            </p>
            <a href="#contact-form-section" className="btn-primary-pill">
              <Send size={16} /> Contact Us
            </a>
          </div>

          <div className="hero-image-wrapper">
            <img 
              src={supportRepImg} 
              alt="Customer support representative" 
              className="hero-photo"
            />
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="info-cards-section">
        <div className="section-container">
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-icon-circle">
                <Mail size={22} className="teal-icon" />
              </div>
              <div className="info-card-content">
                <h3>Email Support</h3>
                <p>Get help via email for any questions or enquiries.</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-circle">
                <Phone size={22} className="teal-icon" />
              </div>
              <div className="info-card-content">
                <h3>Phone Support</h3>
                <p>Speak with our support team for immediate assistance.</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-circle">
                <Clock size={22} className="teal-icon" />
              </div>
              <div className="info-card-content">
                <h3>Support Availability</h3>
                <p>Monday – Friday<br />9:00 AM – 6:00 PM (WAT)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-form-section" id="contact-form-section">
        <div className="section-container">
          <div className="form-card-wrapper">
            <div className="form-box">
              <div className="form-box-header">
                <span className="section-accent-line"></span>
                <h2 className="section-heading">Send Us a Message</h2>
              </div>
              <p className="form-subtext">Fill out the form below and we'll get back to you as soon as possible.</p>

              {successMessage && <div className="success-alert">{successMessage}</div>}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required-star">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject <span className="required-star">*</span></label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Appointment Booking Help">Appointment Booking Help</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="required-star">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button type="submit" className="btn-submit">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>

            <div className="form-image-box">
              <img 
                src={contactHeartImg} 
                alt="Stethoscope and heart visual" 
                className="side-visual-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="section-container">
          <div className="faq-header-wrapper">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>
          <p className="faq-subtext">Find quick answers to common questions.</p>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button 
                    className="faq-question-btn" 
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} className="teal-icon" /> : <ChevronDown size={20} className="teal-icon" />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADDITIONAL HELP */}
      <section className="additional-help-section">
        <div className="section-container">
          <div className="help-banner-card">
            <div className="help-banner-text">
              <h2>Need More Help?</h2>
              <p>Our support team is here to assist you.</p>
            </div>
            <Link to="/get-started" className="btn-help-cta">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

        .contact-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #FFFFFF;
          color: #0F2926;
        }

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
        }

        .nav-links a.active {
          color: #087F6E;
          font-weight: 600;
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

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .badge-pill {
          display: inline-block;
          background: #DDF3EE;
          color: #087F6E;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .teal-icon {
          color: #087F6E;
        }

        /* HERO - Clean layout without wrapper boxes */
        .contact-hero {
          width: 100%;
          background: #FFFFFF;
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
          font-size: clamp(34px, 4.2vw, 48px);
          font-weight: 800;
          color: #0F2926;
          line-height: 1.15;
          margin-bottom: 18px;
        }

        .hero-desc {
          font-size: 16px;
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

        .hero-image-wrapper {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .hero-photo {
          width: 100%;
          max-width: 520px;
          height: auto;
          border-radius: 20px;
        }

        /* INFO CARDS */
        .info-cards-section {
          padding: 40px 7%;
          background: #FFFFFF;
        }

        .info-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .info-card {
          background: #F4FAF9;
          border: 1px solid #E1F0EE;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .info-icon-circle {
          width: 48px;
          height: 48px;
          background: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-card-content h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0F2926;
          margin-bottom: 4px;
        }

        .info-card-content p {
          font-size: 13px;
          color: #4A6360;
          line-height: 1.5;
        }

        /* FORM SECTION */
        .contact-form-section {
          padding: 40px 7% 80px 7%;
          background: #FFFFFF;
        }

        .form-card-wrapper {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
        }

        .form-box-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .section-accent-line {
          width: 4px;
          height: 24px;
          background: #087F6E;
          border-radius: 2px;
        }

        .section-heading {
          font-size: clamp(24px, 2.5vw, 32px);
          font-weight: 800;
          color: #0F2926;
        }

        .form-subtext {
          font-size: 14px;
          color: #4A6360;
          margin-bottom: 24px;
        }

        .success-alert {
          background: #EEF8F6;
          border: 1px solid #087F6E;
          color: #087F6E;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }

        .required-star {
          color: #E53E3E;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-size: 14px;
          color: #0F2926;
          background: #FFFFFF;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #087F6E;
        }

        .error-text {
          font-size: 12px;
          color: #E53E3E;
        }

        .btn-submit {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .form-image-box {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .side-visual-img {
          width: 100%;
          max-width: 480px;
          height: auto;
          border-radius: 20px;
        }

        /* FAQ */
        .faq-section {
          padding: 80px 7%;
          background: #F4FAF9;
          text-align: center;
        }

        .faq-subtext {
          font-size: 15px;
          color: #4A6360;
          margin: 8px 0 40px 0;
        }

        .faq-accordion-list {
          max-width: 850px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        .faq-item {
          background: #FFFFFF;
          border: 1px solid #DDF3EE;
          border-radius: 12px;
          overflow: hidden;
        }

        .faq-question-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 700;
          color: #0F2926;
          cursor: pointer;
        }

        .faq-answer-panel {
          padding: 0 20px 18px 20px;
          font-size: 14px;
          line-height: 1.6;
          color: #4A6360;
          border-top: 1px solid #EAF2F1;
          padding-top: 12px;
        }

        /* ADDITIONAL HELP BANNER */
        .additional-help-section {
          padding: 60px 7%;
          background: #FFFFFF;
        }

        .help-banner-card {
          max-width: 1200px;
          margin: 0 auto;
          background: #087F6E;
          border-radius: 24px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .help-banner-text h2 {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .help-banner-text p {
          font-size: 14px;
          color: #E1F0EE;
        }

        .btn-help-cta {
          background: #FFFFFF;
          color: #087F6E;
          text-decoration: none;
          padding: 12px 26px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
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

        @media (max-width: 992px) {
          .nav-links { display: none; }
          .desktop-only-btn { display: none !important; }
          .mobile-menu-btn { display: block; }
          .mobile-dropdown-menu { display: flex; }

          .hero-container,
          .form-card-wrapper {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .info-cards-grid {
            grid-template-columns: 1fr;
          }

          .help-banner-card {
            flex-direction: column;
            text-align: center;
            gap: 20px;
            padding: 24px 20px;
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
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}