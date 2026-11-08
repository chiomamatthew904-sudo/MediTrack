import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  User,
  CalendarCheck,
  ShieldCheck,
  Heart,
  UserPlus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

// IMPORT YOUR LOCAL PROJECT ASSETS
import medimg from '../assets/medimg.jpg';
import doctorHeroImg from '../assets/getdocimg.jpg';

// IMPORT SUPABASE CLIENT
import { supabase } from '../supabaseClient';

export default function GetStarted() {
  // Registration Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Call Supabase Auth sign up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'patient' // default role assignment
          }
        }
      });

      if (error) {
        setErrors({ email: error.message });
        setIsLoading(false);
        return;
      }

      // Success state reached
      setIsLoading(false);
      setIsSubmitted(true);

    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setErrors({ email: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-split-container">
        
        {/* LEFT SECTION – HERO COVER IMAGE WITH OVERLAY TEXT */}
        <div 
          className="register-hero-section" 
          style={{ backgroundImage: `url(${doctorHeroImg})` }}
        >
          <div className="hero-overlay-tint"></div>

          <div className="hero-top-brand">
            <Link to="/">
              <img src={medimg} alt="MediTrack Logo" className="hero-logo" />
            </Link>
          </div>

        <Link to="/" className="back-home-link"> 
        <ArrowRight size={16} /> Back to Home 
        </Link>

          <div className="hero-content">
            <h1 className="hero-title">Get Started with MediTrack</h1>
            <p className="hero-desc">
              Create your account and take control of your healthcare journey.
            </p>

            <div className="benefit-list">
              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <CalendarCheck size={18} />
                </div>
                <span>Book Appointments Anytime, Anywhere.</span>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <ShieldCheck size={18} />
                </div>
                <span>Access Your Health Records Securely.</span>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <Heart size={18} />
                </div>
                <span>Take Control of Your Healthcare.</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – REGISTRATION FORM / CONFIRMATION STATE */}
        <div className="register-form-section">
          <div className="register-card">
            
            {isSubmitted ? (
              /* CONFIRMATION STATE */
              <div className="confirmation-box">
                <div className="confirmation-icon-circle">
                  <CheckCircle2 size={44} className="success-check-icon" />
                </div>
                <h2 className="confirmation-heading">You're Almost There!</h2>
                <p className="confirmation-subtext">
                  Your account has been successfully created. Please check your email inbox to verify your MediTrack account before logging in.
                </p>
                <div className="confirmation-actions">
                  <Link to="/login" className="btn-back-login">
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <>
                <div className="form-header">
                  <h2 className="create-heading">Create Your Account</h2>
                  <p className="create-subtext">Join MediTrack and take control of your healthcare appointments.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                  
                  {/* First Name & Last Name Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <div className="input-with-icon">
                        <User size={18} className="input-prefix-icon" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="standalone-input"
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="input-prefix-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-prefix-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-prefix-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-prefix-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="form-group-checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                      <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span>
                    </label>
                    {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-register" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner-text">Creating Account...</span>
                    ) : (
                      <>
                        <UserPlus size={18} /> Create Account
                      </>
                    )}
                  </button>

                  {/* Already have an account */}
                  <div className="login-prompt">
                    Already have an account? <Link to="/login">Sign In</Link>
                  </div>

                </form>
              </>
            )}

          </div>
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .back-home-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 100px;
          position: relative;
          z-index: 3;
          opacity: 0.9;
          transition: opacity 0.2s ease;
        }

        .back-home-link:hover {
           opacity: 1;
        }

        .register-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #F4FAF9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 4%;
        }

        .register-split-container {
          width: 100%;
          max-width: 1200px;
          background: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 20px 45px rgba(8, 127, 110, 0.1);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          overflow: hidden;
          border: 1px solid #E1F0EE;
          align-items: stretch;
        }

        /* LEFT SECTION - COVER HERO PHOTO WITH OVERLAY */
        .register-hero-section {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 30px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .hero-overlay-tint {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(8, 127, 110, 0.85) 0%, rgba(15, 41, 38, 0.88) 100%);
          z-index: 1;
        }

        .hero-top-brand,
        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-top-brand .hero-logo {
          width: 150px;
          height: auto;
          display: block;
          background: #FFFFFF;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .hero-title {
          font-size: clamp(32px, 3.8vw, 44px);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.15;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .hero-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #E2E8F0;
          margin-bottom: 30px;
          max-width: 420px;
        }

        .benefit-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
        }

        .benefit-icon-box {
          width: 36px;
          height: 36px;
          background: #FFFFFF;
          color: #087F6E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        /* RIGHT SECTION - REGISTRATION FORM */
        .register-form-section {
          background: #FFFFFF;
          padding: 30px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-card {
          width: 100%;
          max-width: 420px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .create-heading {
          font-size: 24px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 2px;
          letter-spacing: -0.02em;
        }

        .create-subtext {
          font-size: 12px;
          color: #4A6360;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #0F2926;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
        }

        .input-with-icon input,
        .standalone-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-size: 13px;
          color: #0F2926;
          background: #F8FCFC;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .standalone-input {
          padding-left: 14px;
        }

        .input-with-icon input:focus,
        .standalone-input:focus {
          border-color: #087F6E;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(8, 127, 110, 0.1);
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748B;
          display: flex;
          align-items: center;
        }

        .error-text {
          font-size: 11px;
          color: #E53E3E;
          font-weight: 500;
        }

        .form-group-checkbox {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 2px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: #4A6360;
          cursor: pointer;
          line-height: 1.4;
        }

        .checkbox-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #087F6E;
          margin-top: 2px;
          cursor: pointer;
        }

        .checkbox-label a {
          color: #087F6E;
          text-decoration: none;
          font-weight: 600;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .btn-register {
          width: 100%;
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 13px;
          border-radius: 28px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
          margin-top: 4px;
        }

        .btn-register:hover {
          background: #066658;
        }

        .login-prompt {
          text-align: center;
          font-size: 12px;
          color: #4A6360;
          margin-top: 6px;
        }

        .login-prompt a {
          color: #087F6E;
          text-decoration: none;
          font-weight: 700;
        }

        .login-prompt a:hover {
          text-decoration: underline;
        }

        /* CONFIRMATION STATE STYLES */
        .confirmation-box {
          text-align: center;
          padding: 20px 10px;
        }

        .confirmation-icon-circle {
          width: 70px;
          height: 70px;
          background: #EEF8F6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
        }

        .success-check-icon {
          color: #087F6E;
        }

        .confirmation-heading {
          font-size: 24px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 10px;
        }

        .confirmation-subtext {
          font-size: 14px;
          line-height: 1.6;
          color: #4A6360;
          margin-bottom: 24px;
        }

        .btn-back-login {
          background: #087F6E;
          color: #FFFFFF;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .btn-back-login:hover {
          background: #066658;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .register-split-container {
            grid-template-columns: 1fr;
            max-width: 550px;
          }

          .register-hero-section {
            padding: 35px 24px;
            min-height: 320px;
          }

          .register-form-section {
            padding: 35px 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}