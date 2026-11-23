
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import medimg from '../assets/medimg.jpg';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Your password has been updated successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-card">
        <Link to="/" className="recovery-logo-link">
          <img src={medimg} alt="MediTrack Logo" className="recovery-logo" />
        </Link>

        <div className="recovery-icon">
          <ShieldCheck size={30} />
        </div>

        <div className="recovery-header">
          <h1>Create a New Password</h1>
          <p>Choose a strong password to secure your MediTrack account.</p>
        </div>

        <form onSubmit={handleSubmit} className="recovery-form">
          <div className="recovery-field">
            <label htmlFor="new-password">New Password</label>
            <div className="recovery-input-wrap">
              <Lock size={18} />
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="recovery-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle new password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="recovery-field">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="recovery-input-wrap">
              <Lock size={18} />
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="recovery-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {message && <div className="recovery-success" role="status">{message}</div>}
          {error && <div className="recovery-error" role="alert">{error}</div>}

          <button type="submit" className="recovery-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <Link to="/login" className="recovery-back-link">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>

      <style>{`
        .recovery-page {
          min-height: 100vh;
          padding: 30px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4FAF9;
          font-family: 'Manrope', sans-serif;
        }

        .recovery-card {
          width: 100%;
          max-width: 470px;
          background: #FFFFFF;
          padding: 42px;
          border: 1px solid #E1F0EE;
          border-radius: 24px;
          box-shadow: 0 20px 45px rgba(8, 127, 110, 0.1);
          text-align: center;
        }

        .recovery-logo-link {
          display: inline-block;
          margin-bottom: 30px;
        }

        .recovery-logo {
          width: 150px;
          height: auto;
          display: block;
        }

        .recovery-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EEF8F6;
          color: #087F6E;
        }

        .recovery-header h1 {
          color: #0F2926;
          font-size: 25px;
          font-weight: 800;
          margin: 0 0 12px;
        }

        .recovery-header p {
          color: #4A6360;
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 28px;
        }

        .recovery-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          text-align: left;
        }

        .recovery-field label {
          display: block;
          color: #0F2926;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .recovery-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          background: #F8FCFC;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          color: #94A3B8;
        }

        .recovery-input-wrap:focus-within {
          border-color: #087F6E;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(8, 127, 110, 0.1);
        }

        .recovery-input-wrap input {
          width: 100%;
          min-width: 0;
          padding: 14px 0;
          border: none;
          outline: none;
          background: transparent;
          color: #0F2926;
          font-size: 14px;
          font-family: inherit;
        }

        .recovery-toggle {
          border: none;
          background: transparent;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .recovery-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 30px;
          background: #087F6E;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .recovery-button:hover {
          background: #066658;
        }

        .recovery-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .recovery-success, .recovery-error {
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
        }

        .recovery-success {
          color: #087F6E;
          background: #EEF8F6;
          border: 1px solid #087F6E;
        }

        .recovery-error {
          color: #B42318;
          background: #FEF3F2;
          border: 1px solid #FDA29B;
        }

        .recovery-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 26px;
          color: #087F6E;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .recovery-back-link:hover {
          color: #066658;
          text-decoration: underline;
        }

        html[data-theme="dark"] .recovery-page {
          background: #102222;
        }

        html[data-theme="dark"] .recovery-card {
          background: #172B2B;
          border-color: #294343;
        }

        html[data-theme="dark"] .recovery-header h1,
        html[data-theme="dark"] .recovery-field label {
          color: #F1F5F9;
        }

        html[data-theme="dark"] .recovery-header p {
          color: #A7B8B8;
        }

        html[data-theme="dark"] .recovery-input-wrap {
          background: #203838;
          border-color: #345050;
        }

        html[data-theme="dark"] .recovery-input-wrap input {
          color: #E2E8F0;
        }

        html[data-theme="dark"] .recovery-icon {
          background: #164E45;
          color: #5EEAD4;
        }

        @media (max-width: 520px) {
          .recovery-card {
            padding: 30px 22px;
          }

          .recovery-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
