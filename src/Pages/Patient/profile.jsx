import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  Bell,
  Info,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useProfile } from '../../context/profilecontext';
import { useNotifications } from '../../context/notificationcontext';

export default function ProfilePage() {
  // Convert dates to the format required by Supabase (YYYY-MM-DD)
const formatDateForDatabase = (dateValue) => {
  if (!dateValue) return null;

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
    const [day, month, year] = dateValue.split('/');
    return `${year}-${month}-${day}`;
  }

  return dateValue;
};

// Convert dates to a format suitable for an HTML date input
const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
    const [day, month, year] = dateValue.split('/');
    return `${year}-${month}-${day}`;
  }

  return '';
};

  const {
  profile,
  updateProfile,
  uploadAvatar,
  updatePassword,
  updateTheme
} = useProfile();
  const { reminderSettings, updateSettings } = useNotifications();

  // Personal Info Edit State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState(profile);
  useEffect(() => {
  setFormData(profile);
}, [profile]);
  const [infoSuccess, setInfoSuccess] = useState(false);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notification Preferences Local Form State (Synced with NotificationContext)
  const [prefForm, setPrefForm] = useState({
    inApp: reminderSettings.channels?.inApp ?? true,
    email: reminderSettings.channels?.email ?? true,
    browser: reminderSettings.channels?.browser ?? false,
    appointmentReminders: reminderSettings.enabled ?? true
  });
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Handle Profile Picture Change
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result = await uploadAvatar(file);

    if (!result.success) {
      alert(result.error || 'Failed to upload profile picture.');
    } else {
      alert('Profile picture updated successfully.');
    }

    // Allow the same image to be selected again if needed
    e.target.value = '';
  };

  // Handle Personal Info Save
const handleSaveInfo = async (e) => {
  e.preventDefault();

  if (!formData.fullName.trim()) {
    alert('Full Name is required.');
    return;
  }

  try {
    const result = await updateProfile({
      fullName: formData.fullName,
      phone: formData.phone || '',
      dateOfBirth: formatDateForDatabase(formData.dateOfBirth),
      gender: formData.gender || ''
    });

    if (!result.success) {
      alert(result.error || 'Failed to update your profile.');
      return;
    }

    setIsEditingInfo(false);
    setInfoSuccess(true);

    setTimeout(() => setInfoSuccess(false), 3000);

  } catch (error) {
    console.error('Profile update error:', error);
    alert(error.message || 'Something went wrong while updating your profile.');
  }
};


  // Handle Password Update Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordSuccess(false);

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError('All password fields must be completed.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New Password and Confirm New Password must match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('Your new password must be different from your current password.');
      return;
    }

    try {
      const result = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (!result.success) {
        setPasswordError(result.error || 'Failed to update password.');
        return;
      }

      setPasswordSuccess(true);

      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 2500);

    } catch (error) {
      console.error('Password update error:', error);
      setPasswordError(error.message || 'Something went wrong.');
    }
  };


  
  // Handle Preference Save
  const handleSavePreferences = async (e) => {
    e.preventDefault();

    setPrefSuccess(false);

    const result = await updateSettings({
      ...reminderSettings,
      enabled: prefForm.appointmentReminders,
      channels: {
        inApp: prefForm.inApp,
        email: prefForm.email,
        browser: prefForm.browser
      }
    });

    if (!result.success) {
      alert(result.error || 'Failed to save notification preferences.');
      return;
    }

    setPrefSuccess(true);

    setTimeout(() => setPrefSuccess(false), 3000);
  };


  // Handle theme selection
  const handleThemeChange = async (newTheme) => {
  const result = await updateTheme(newTheme);

  if (!result.success) {
    alert(result.error || 'Failed to update theme preference.');
  }
};


  return (
    <div className="profile-page-container">
      
      {/* 1. PAGE HEADER */}
      <div className="page-header-section">
        <div className="header-titles">
          <div className="title-with-icon">
            <h1 className="page-title">My Profile</h1>
          </div>
          <p className="page-description">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="security-badge-pill">
          <ShieldCheck size={16} className="text-teal" />
          <span>Your information is secure.</span>
        </div>
      </div>

      {/* 2. PROFILE OVERVIEW CARD */}
      <div className="profile-overview-card">
        <div className="profile-avatar-container">
          <div className="avatar-wrapper">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Patient Avatar" className="profile-avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <User size={48} />
              </div>
            )}
            <label htmlFor="avatar-upload" className="camera-upload-btn" title="Change Profile Picture">
              <Camera size={15} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="profile-user-meta">
            <h2>{profile.fullName}</h2>
            <div className="meta-row">
              <Mail size={14} className="text-muted" />
              <span>{profile.email}</span>
            </div>
            <div className="meta-badge-row">
              <span className="role-pill">
                <User size={12} /> {profile.role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(profile);
            setIsEditingInfo(true);
          }}
          className="btn-edit-profile-top"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* FEEDBACK BANNER FOR INFO SAVE */}
      {infoSuccess && (
        <div className="global-success-banner">
          <CheckCircle2 size={16} /> Personal information updated successfully!
        </div>
      )}

      {/* 3. TWO-COLUMN LAYOUT */}
      <div className="profile-grid-layout">
        
        {/* LEFT COLUMN: PERSONAL INFORMATION & HEALTHCARE NOTICE */}
        <div className="left-column">
          <div className="section-card">
            <div className="card-header-flex">
              <div className="card-title-group">
                <User size={18} className="text-teal" />
                <h2>Personal Information</h2>
              </div>
              {!isEditingInfo && (
                <button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditingInfo(true);
                  }}
                  className="btn-edit-inline"
                >
                  <Edit3 size={14} /> Edit Information
                </button>
              )}
            </div>

            {isEditingInfo ? (
              <form onSubmit={handleSaveInfo} className="edit-info-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address (Account Login)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <small className="field-hint">Note: Authentication email change requires verification.</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                 <div className="form-group">
                  <label>Date of Birth</label>
                    <input
                     type="date"
                     value={formatDateForInput(formData.dateOfBirth)}
                    onChange={(e) =>
                   setFormData({
                   ...formData,
                  dateOfBirth: e.target.value
                  })
                  }
                 />
                </div>

                  <div className="form-group">
                  <label>Gender</label>
                  <select
                   value={formData.gender || ''}
                    onChange={(e) =>
                  setFormData({
                  ...formData,
                  gender: e.target.value
                 })
                 }
                 >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
                </select>
                </div>
             

                <div className="form-actions-row">
                  <button type="submit" className="btn-primary-save">
                    <Save size={15} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="btn-secondary-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display-list">
                <div className="info-row">
                  <div className="info-label-group">
                    <User size={15} className="text-muted" />
                    <span>Full Name</span>
                  </div>
                  <strong className="info-value">{profile.fullName}</strong>
                </div>

                <div className="info-row">
                  <div className="info-label-group">
                    <Mail size={15} className="text-muted" />
                    <span>Email Address</span>
                  </div>
                  <strong className="info-value">{profile.email}</strong>
                </div>

                <div className="info-row">
                  <div className="info-label-group">
                    <Phone size={15} className="text-muted" />
                    <span>Phone Number</span>
                  </div>
                  <strong className="info-value">{profile.phone}</strong>
                </div>

                <div className="info-row">
                  <div className="info-label-group">
                    <Calendar size={15} className="text-muted" />
                    <span>Date of Birth</span>
                  </div>
                  <strong className="info-value">{profile.dateOfBirth}</strong>
                </div>

                <div className="info-row">
                  <div className="info-label-group">
                    <User size={15} className="text-muted" />
                    <span>Gender</span>
                  </div>
                  <strong className="info-value">{profile.gender}</strong>
                </div>
              </div>
            )}
          </div>

          {/* HEALTHCARE NOTICE CARD */}
          <div className="healthcare-notice-card">
          <div className="notice-icon-box">
          <Info size={20} />
          </div>
          <p>
          You enter your appointment details in MediTrack to keep them organised and receive reminders. MediTrack does not verify appointments with healthcare facilities or provide medical advice. For medical concerns or confirmation of appointment details, please contact your healthcare provider.
          </p>
          </div>
        </div>


        {/* APPEARANCE SECTION */}
<div className="section-card">
  <div className="card-header-flex">
    <div className="card-title-group">
      <h2>Appearance</h2>
    </div>
  </div>

  <p className="card-subtitle">
    Choose how you want MediTrack to look.
  </p>

  <div className="theme-options">
    <button
      type="button"
      className={`theme-option ${profile.theme === 'light' ? 'active' : ''}`}
      onClick={() => handleThemeChange('light')}
    >
      <span>☀️</span>
      <strong>Light Mode</strong>
      <small>Bright and clean appearance</small>
    </button>

    <button
      type="button"
      className={`theme-option ${profile.theme === 'dark' ? 'active' : ''}`}
      onClick={() => handleThemeChange('dark')}
    >
      <span>🌙</span>
      <strong>Dark Mode</strong>
      <small>Comfortable in low light</small>
    </button>
  </div>
</div>

        {/* RIGHT COLUMN: ACCOUNT SECURITY & NOTIFICATION PREFERENCES */}
        <div className="right-column">
          
          {/* ACCOUNT SECURITY SECTION */}
          <div className="section-card">
            <div className="card-header-flex">
              <div className="card-title-group">
                <ShieldCheck size={18} className="text-teal" />
                <h2>Account Security</h2>
              </div>
            </div>

            <div className="security-sub-blocks">
              {/* Change Password Block */}
              <div className="security-block-item">
                <div>
                  <h4>Change Password</h4>
                  <p>Keep your account secure by updating your password regularly.</p>
                </div>
                <button
                  onClick={() => {
                    setPasswordError('');
                    setShowPasswordModal(true);
                  }}
                  className="btn-change-password"
                >
                  <Lock size={14} /> Change Password
                </button>
              </div>

              {/* Account Information Block */}
              <div className="account-info-box">
                <div className="acc-info-title-row">
                  <Info size={15} className="text-teal" />
                  <h4>Account Information</h4>
                </div>
                <div className="acc-info-grid">
                  <div className="acc-info-item">
                    <span>Account Type:</span>
                    <strong>{profile.role}</strong>
                  </div>
                  <div className="acc-info-item">
                    <span>Account Status:</span>
                    <strong className="status-active-text">● {profile.status}</strong>
                  </div>
                  <div className="acc-info-item">
                    <span>Member Since:</span>
                    <strong>{profile.memberSince}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES SECTION */}
          <div className="section-card">
            <div className="card-header-flex">
              <div className="card-title-group">
                <Bell size={18} className="text-teal" />
                <div>
                  <h2>Notification Preferences</h2>
                  <p className="card-subtitle">Choose how you want to receive notifications.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSavePreferences} className="preferences-form">
              <div className="preference-toggle-item">
                <div className="pref-text">
                  <strong>In-app Notifications</strong>
                  <p>Get notifications inside MediTrack.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={prefForm.inApp}
                    onChange={(e) => setPrefForm({ ...prefForm, inApp: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="preference-toggle-item">
                <div className="pref-text">
                  <strong>Email Notifications</strong>
                  <p>Receive emails about your appointments.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={prefForm.email}
                    onChange={(e) => setPrefForm({ ...prefForm, email: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="preference-toggle-item">
                <div className="pref-text">
                  <strong>Browser Notifications</strong>
                  <p>Get browser alerts for important updates.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={prefForm.browser}
                    onChange={(e) => setPrefForm({ ...prefForm, browser: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="preference-toggle-item">
                <div className="pref-text">
                  <strong>Appointment Reminders</strong>
                  <p>Receive reminders for upcoming appointments.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={prefForm.appointmentReminders}
                    onChange={(e) => setPrefForm({ ...prefForm, appointmentReminders: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {prefSuccess && (
                <div className="success-feedback-banner">
                  <CheckCircle2 size={16} /> Notification preferences saved successfully!
                </div>
              )}

              <button type="submit" className="btn-save-preferences">
                <Save size={15} /> Save Preferences
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* 4. CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="close-modal-btn"
              >
                <X size={20} />
              </button>
            </div>
            <p className="modal-subtitle">Enter your current password and choose a secure new password.</p>

            <form onSubmit={handlePasswordSubmit} className="password-modal-form">
              <div className="form-group password-group">
                <label>Current Password</label>
                <div className="pass-input-wrapper">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="pass-toggle-btn"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group password-group">
                <label>New Password</label>
                <div className="pass-input-wrapper">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="pass-toggle-btn"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group password-group">
                <label>Confirm New Password</label>
                <div className="pass-input-wrapper">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="pass-toggle-btn"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="error-feedback-box">
                  <AlertCircle size={15} /> {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="success-feedback-banner">
                  <CheckCircle2 size={16} /> Password updated successfully!
                </div>
              )}

              <div className="modal-footer-buttons">
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERNAL STYLING */}
      <style>{`
        .profile-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* PAGE HEADER */
        .page-header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 24px 32px;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .page-description {
          font-size: 14px;
          color: #4A6360;
        }

        .security-badge-pill {
          background: #DCFCE7;
          color: #15803D;
          border: 1px solid #BBF7D0;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        /* PROFILE OVERVIEW CARD */
        .profile-overview-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .profile-avatar-container {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .avatar-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #E8F8F5;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #087F6E;
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: #087F6E;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #087F6E;
          color: #FFFFFF;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid #FFFFFF;
          transition: background 0.2s ease;
        }
        .camera-upload-btn:hover {
          background: #066658;
        }

        .profile-user-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-user-meta h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0F2926;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748B;
        }
        .meta-badge-row {
          margin-top: 4px;
        }
        .role-pill {
          background: #E8F8F5;
          color: #087F6E;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-edit-profile-top {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-edit-profile-top:hover {
          background: #066658;
        }

        .global-success-banner {
          background: #DCFCE7;
          color: #15803D;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* TWO COLUMN LAYOUT */
        .profile-grid-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 24px;
        }

        .left-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-title-group h2 {
          font-size: 16px;
          font-weight: 800;
          color: #0F2926;
        }
        .card-subtitle {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .text-teal { color: #087F6E; }
        .text-muted { color: #64748B; }

        .btn-edit-inline {
          background: #E8F8F5;
          color: #087F6E;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-edit-inline:hover {
          background: #D1F3EE;
        }

        /* INFO DISPLAY LIST */
        .info-display-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #F8FCFC;
        }

        .info-label-group {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
        }

        .info-value {
          font-size: 14px;
          color: #0F2926;
          font-weight: 700;
        }

        /* EDIT FORM */
        .edit-info-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
        .form-group input, .form-group select {
          padding: 10px 14px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          background: #F8FCFC;
          color: #0F2926;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: #087F6E;
          background: #FFFFFF;
        }
        .field-hint {
          font-size: 11px;
          color: #64748B;
        }

        .form-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }

        .btn-primary-save {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .btn-primary-save:hover { background: #066658; }

        .btn-secondary-cancel {
          background: #F1F5F9;
          color: #475569;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-secondary-cancel:hover { background: #E2E8F0; }

        /* HEALTHCARE NOTICE CARD */
        .healthcare-notice-card {
          background: #E8F8F5;
          border: 1px solid #C1EBE5;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: #0F2926;
        }
        .notice-icon-box {
          width: 40px;
          height: 40px;
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .healthcare-notice-card p {
          font-size: 13px;
          line-height: 1.4;
          font-weight: 600;
          color: #0F2926;
        }

        /* SECURITY SUB BLOCKS */
        .security-sub-blocks {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .security-block-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          padding: 16px;
          border-radius: 14px;
          gap: 12px;
        }
        .security-block-item h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 2px;
        }
        .security-block-item p {
          font-size: 12px;
          color: #64748B;
        }

        .btn-change-password {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s ease;
        }
        .btn-change-password:hover { background: #066658; }

        .account-info-box {
          background: #F4FAF9;
          border: 1px solid #D4F3EE;
          padding: 16px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .acc-info-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .acc-info-title-row h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
        }

        .acc-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .acc-info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .acc-info-item span {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }
        .acc-info-item strong {
          font-size: 13px;
          color: #0F2926;
        }
        .status-active-text { color: #16A34A; }

        /* PREFERENCES FORM */
        .preferences-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preference-toggle-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          padding: 12px 16px;
          border-radius: 12px;
          gap: 12px;
        }

        .pref-text strong {
          font-size: 13px;
          color: #0F2926;
          display: block;
        }
        .pref-text p {
          font-size: 11px;
          color: #64748B;
        }

        /* TOGGLE SWITCH */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #CBD5E1;
          transition: .3s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }
        input:checked + .slider { background-color: #087F6E; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }

        .success-feedback-banner {
          background: #DCFCE7;
          color: #15803D;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-save-preferences {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-save-preferences:hover { background: #066658; }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: #FFFFFF;
          width: 100%;
          max-width: 460px;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid #E1F0EE;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0F2926;
        }

        .close-modal-btn {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
        }
        .close-modal-btn:hover { background: #F1F5F9; }

        .modal-subtitle {
          font-size: 13px;
          color: #64748B;
          line-height: 1.4;
        }

        .password-modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .password-group {
          position: relative;
        }

        .pass-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pass-input-wrapper input {
          width: 100%;
          padding: 10px 40px 10px 14px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          background: #F8FCFC;
          color: #0F2926;
        }
        .pass-input-wrapper input:focus {
          border-color: #087F6E;
          background: #FFFFFF;
        }

        .pass-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .error-feedback-box {
          background: #FEE2E2;
          color: #DC2626;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-footer-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
        }

        .btn-primary {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-primary:hover { background: #066658; }

        .btn-secondary {
          background: #F1F5F9;
          color: #475569;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-secondary:hover { background: #E2E8F0; }

           /* APPEARANCE SETTINGS */
.theme-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  background: #F8FCFC;
  border: 2px solid #E2E8F0;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.theme-option span {
  font-size: 24px;
}

.theme-option strong {
  color: #0F2926;
  font-size: 13px;
}

.theme-option small {
  color: #64748B;
  font-size: 11px;
}

.theme-option.active {
  border-color: #087F6E;
  background: #E8F8F5;
}

@media (max-width: 480px) {
  .theme-options {
    grid-template-columns: 1fr;
  }
}  


/* ==================================
   DARK MODE - PATIENT PROFILE
================================== */

html[data-theme="dark"] .profile-page-container {
  color: #E2E8F0;
}

/* Header and profile overview */
html[data-theme="dark"] .page-header-section,
html[data-theme="dark"] .profile-overview-card,
html[data-theme="dark"] .section-card {
  background: #172B2B;
  border-color: #294343;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

html[data-theme="dark"] .page-title,
html[data-theme="dark"] .profile-user-meta h2,
html[data-theme="dark"] .card-title-group h2,
html[data-theme="dark"] .info-value,
html[data-theme="dark"] .security-block-item h4,
html[data-theme="dark"] .acc-info-title-row h4,
html[data-theme="dark"] .acc-info-item strong,
html[data-theme="dark"] .pref-text strong {
  color: #F1F5F9;
}

html[data-theme="dark"] .page-description,
html[data-theme="dark"] .meta-row,
html[data-theme="dark"] .info-label-group,
html[data-theme="dark"] .card-subtitle,
html[data-theme="dark"] .field-hint,
html[data-theme="dark"] .security-block-item p,
html[data-theme="dark"] .acc-info-item span,
html[data-theme="dark"] .pref-text p {
  color: #A7B8B8;
}

/* Profile avatar */
html[data-theme="dark"] .avatar-wrapper {
  background: #203F3B;
  border-color: #0D9488;
}

html[data-theme="dark"] .avatar-placeholder {
  color: #5EEAD4;
}

/* Personal information */
html[data-theme="dark"] .info-row {
  border-bottom-color: #294343;
}

html[data-theme="dark"] .form-group label {
  color: #CBD5E1;
}

html[data-theme="dark"] .form-group input,
html[data-theme="dark"] .form-group select,
html[data-theme="dark"] .pass-input-wrapper input {
  background: #203838;
  border-color: #345050;
  color: #E2E8F0;
}

html[data-theme="dark"] .form-group input:focus,
html[data-theme="dark"] .form-group select:focus,
html[data-theme="dark"] .pass-input-wrapper input:focus {
  background: #294343;
  border-color: #0D9488;
}

html[data-theme="dark"] .form-group select option {
  background: #172B2B;
  color: #E2E8F0;
}

/* Healthcare notice */
html[data-theme="dark"] .healthcare-notice-card {
  background: #1C3A37;
  border-color: #285B53;
  color: #E2E8F0;
}

html[data-theme="dark"] .healthcare-notice-card p {
  color: #CBD5E1;
}

/* Account security */
html[data-theme="dark"] .security-block-item,
html[data-theme="dark"] .preference-toggle-item {
  background: #203838;
  border-color: #345050;
}

html[data-theme="dark"] .account-info-box {
  background: #1C3A37;
  border-color: #285B53;
}

/* Appearance selector */
html[data-theme="dark"] .theme-option {
  background: #203838;
  border-color: #345050;
}

html[data-theme="dark"] .theme-option strong {
  color: #F1F5F9;
}

html[data-theme="dark"] .theme-option small {
  color: #A7B8B8;
}

html[data-theme="dark"] .theme-option.active {
  background: #164E45;
  border-color: #0D9488;
}

/* Section dividers */
html[data-theme="dark"] .card-header-flex {
  border-bottom-color: #345050;
}

/* Password modal */
html[data-theme="dark"] .modal-container {
  background: #172B2B;
  border-color: #345050;
  color: #E2E8F0;
}

html[data-theme="dark"] .modal-header h2 {
  color: #F1F5F9;
}

html[data-theme="dark"] .modal-subtitle {
  color: #A7B8B8;
}

html[data-theme="dark"] .close-modal-btn,
html[data-theme="dark"] .pass-toggle-btn {
  color: #CBD5E1;
}

html[data-theme="dark"] .close-modal-btn:hover {
  background: #294343;
}

html[data-theme="dark"] .modal-footer-buttons {
  border-top-color: #345050;
}

html[data-theme="dark"] .btn-secondary,
html[data-theme="dark"] .btn-secondary-cancel {
  background: #294343;
  color: #E2E8F0;
}

html[data-theme="dark"] .btn-secondary:hover,
html[data-theme="dark"] .btn-secondary-cancel:hover {
  background: #345050;
}

/* Teal icons and links */
html[data-theme="dark"] .text-teal {
  color: #5EEAD4;
}

/* Preserve success, error and security status colours */

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .page-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .profile-overview-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .btn-edit-profile-top {
            width: 100%;
            justify-content: center;
          }
          .profile-grid-layout {
            grid-template-columns: 1fr;
          }
          .acc-info-grid {
            grid-template-columns: 1fr;
          }

        }
      `}</style>
    </div>
  );
}