import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarCheck,
  ShieldCheck,
  Heart,
  ArrowRight,
  LogIn
} from 'lucide-react';

// IMPORT YOUR LOCAL PROJECT ASSETS
import medimg from '../assets/medimg.jpg';
import doctorHeroImg from '../assets/doclog3.jpg';

// IMPORT SUPABASE CLIENT
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    setErrors({});
    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Call Supabase sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({ password: error.message });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Login successful! Redirecting to dashboard...');
      
      // Short delay before navigating to dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Unexpected error during login:', err);
      setErrors({ password: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-split-container">
        
        {/* LEFT SECTION – HERO COVER IMAGE WITH OVERLAY TEXT */}
        <div 
          className="login-hero-section" 
          style={{ backgroundImage: `url(${doctorHeroImg})` }}
        >
          {/* Dark overlay to ensure text is readable over the photo */}
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
            <h1 className="hero-title">Welcome Back!</h1>
            <p className="hero-desc">
              Sign in to your MediTrack account and manage your appointments with ease.
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

        {/* RIGHT SECTION – LOGIN FORM */}
        <div className="login-form-section">
          <div className="login-card">
            
            <div className="form-header">
              <h2 className="sign-in-heading">Sign In</h2>
              <p className="sign-in-subtext">Enter your details to access your account.</p>
            </div>

            {successMessage && (
              <div className="success-alert">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              
              {/* Email Address Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-prefix-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-prefix-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Password"
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

              {/* Options Row */}
              <div className="form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span>Remember Me</span>
                </label>

                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-signin" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner-text">Signing In...</span>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Create Account Link */}
              <div className="create-account-prompt">
                Don't have an account? <Link to="/get-started">Create an Account <ArrowRight size={14} /></Link>
              </div>

            </form>
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

        .login-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #F4FAF9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 4%;
        }

        .login-split-container {
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

        /* LEFT SECTION - FULL COVER BACKGROUND PHOTO WITH OVERLAY */
        .login-hero-section {
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

        /* RIGHT SECTION - LOGIN FORM */
        .login-form-section {
          background: #FFFFFF;
          padding: 30px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .sign-in-heading {
          font-size: 26px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .sign-in-subtext {
          font-size: 13px;
          color: #4A6360;
        }

        .success-alert {
          background: #EEF8F6;
          border: 1px solid #087F6E;
          color: #087F6E;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 20px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
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

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
        }

        .input-with-icon input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          font-size: 14px;
          color: #0F2926;
          background: #F8FCFC;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-with-icon input:focus {
          border-color: #087F6E;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(8, 127, 110, 0.1);
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748B;
          display: flex;
          align-items: center;
        }

        .error-text {
          font-size: 12px;
          color: #E53E3E;
          font-weight: 500;
        }

        .form-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          margin: 4px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4A6360;
          cursor: pointer;
          font-weight: 500;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #087F6E;
          cursor: pointer;
        }

        .forgot-password-link {
          color: #087F6E;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .forgot-password-link:hover {
          color: #066658;
          text-decoration: underline;
        }

        .btn-signin {
          width: 100%;
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 14px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
          margin-top: 6px;
        }

        .btn-signin:hover {
          background: #066658;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #94A3B8;
          font-size: 13px;
          margin: 10px 0;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #E2E8F0;
        }

        .auth-divider span {
          padding: 0 10px;
          background: #FFFFFF;
        }

        .create-account-prompt {
          text-align: center;
          font-size: 13px;
          color: #4A6360;
        }

        .create-account-prompt a {
          color: #087F6E;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .create-account-prompt a:hover {
          text-decoration: underline;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .login-split-container {
            grid-template-columns: 1fr;
            max-width: 600px;
          }

          .login-hero-section {
            padding: 40px 30px;
            min-height: 350px;
          }

          .login-form-section {
            padding: 40px 30px;
          }
        }
      `}</style>
    </div>
  );
}