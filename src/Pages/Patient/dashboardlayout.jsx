import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  History,
  Bell,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useNotifications } from '../../context/notificationcontext';
import { useProfile } from '../../context/profilecontext';

// Import local project assets
import medimg from '../../assets/medimg.jpg';


export default function DashboardLayout() {
 const { unreadCount } = useNotifications();
 const { profile } = useProfile();

  // State for desktop sidebar expansion/collapse and mobile menu drawer
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Placeholder logout handler
  const handleLogout = (e) => {
  e.preventDefault();
  // Clear any user session storage if you use any later (e.g., localStorage.clear())
  navigate('/'); // Or navigate('/login')
  };
  
  return (
    <div className="dashboard-layout-wrapper">
      
      {/* 1. COLLAPSIBLE VERTICAL SIDEBAR */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'expanded' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Sidebar Header & MediTrack Logo */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo-link">
            <img src={medimg} alt="MediTrack Logo" className="sidebar-logo-img" />
          </Link>
          {sidebarOpen && (
            <span className="sidebar-logo-subtitle">Your Health. Our Priority</span>
          )}
        </div>

        {/* 3 & 4. Navigation Links with NavLink for Active Highlighting */}
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/dashboard/my-appointment" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={20} />
            {sidebarOpen && <span>My Appointments</span>}
          </NavLink>

          <NavLink to="/dashboard/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            {sidebarOpen && <span>Appointment Calendar</span>}
          </NavLink>

          <NavLink to="/dashboard/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <History size={20} />
            {sidebarOpen && <span>Appointment History</span>}
          </NavLink>

          <NavLink to="/dashboard/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-icon-wrapper">
              <Bell size={20} />
              {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
            </div>
            {sidebarOpen && <span>Notifications & Reminders</span>}
          </NavLink>

          <NavLink to="/dashboard/assistant" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bot size={20} />
            {sidebarOpen && <span>AI Assistant</span>}
          </NavLink>

          <NavLink to="/dashboard/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            {sidebarOpen && <span>My Profile</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer (Logout & Trust Indicator) */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn" aria-label="Logout">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>

          {sidebarOpen && (
            <div className="sidebar-trust-box">
              <Shield size={16} className="trust-icon" />
              <div className="trust-text">
                <strong>Trusted Healthcare</strong>
                <span>Partner</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 5 & 11. MAIN CONTENT AREA & ROUTER OUTLET */}
      <div className={`main-content-area ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* 7. TOP NAVIGATION BAR */}
        <header className="top-navbar">
          <div className="navbar-left">
            {/* Desktop hamburger toggle */}
            <button onClick={toggleSidebar} className="hamburger-btn desktop-toggle" aria-label="Toggle Sidebar">
              <Menu size={22} />
            </button>
            {/* Mobile hamburger toggle */}
            <button onClick={toggleMobileMenu} className="hamburger-btn mobile-toggle" aria-label="Toggle Mobile Menu">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="navbar-right">
            
            {/* 8. Notification Bell navigating to /dashboard/notifications */}
            <Link to="/dashboard/notifications" className="nav-icon-btn" aria-label="Notifications & Reminders">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>

            {/* 9. Profile Section navigating to /dashboard/profile */}
            <Link to="/dashboard/profile" className="profile-menu-link" aria-label="My Profile">
            {profile.avatar ? (
           <img
            src={profile.avatar}
            alt="Patient Profile"
            className="top-profile-avatar"
           />
           ) : (
           <div className="top-profile-avatar top-avatar-placeholder">
           <User size={22} />
           </div>
         )}
           </Link>
          </div>
        </header>

        {/* 11. React Router Outlet to render nested patient views */}
        <main className="outlet-container">
          <Outlet />
        </main>
      </div>

      {/* 6. Mobile Backdrop overlay when drawer is open */}
      {mobileMenuOpen && <div className="mobile-backdrop" onClick={toggleMobileMenu}></div>}

      {/* INTERNAL COMPONENT STYLING */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: #F4FAF9;
        }

        /* Sidebar Base Styling */
        .dashboard-sidebar {
          background: #087F6E;
          color: #FFFFFF;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 20px rgba(8, 127, 110, 0.1);
          overflow-x: hidden;
        }

        .dashboard-sidebar.expanded {
          width: 250px;
          padding: 24px 16px;
        }

        .dashboard-sidebar.collapsed {
          width: 80px;
          padding: 24px 12px;
        }

        .sidebar-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }

        .sidebar-logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .sidebar-logo-img {
          width: 140px;
          height: auto;
          background: #FFFFFF;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .dashboard-sidebar.collapsed .sidebar-logo-img {
          width: 52px;
          padding: 4px;
        }

        .sidebar-logo-subtitle {
          font-size: 11px;
          color: #A7F3D0;
          padding-left: 2px;
        }

        /* Sidebar Navigation Items */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          color: #E2E8F0;
          text-decoration: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .nav-item.active {
          background: #065F53;
          color: #FFFFFF;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
        }

        .nav-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .badge-dot {
          position: absolute;
          top: -4px;
          right: -6px;
          background: #EF4444;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 16px;
        }

        .logout-btn {
          color: #FCA5A5;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
        }

        .sidebar-trust-box {
          background: rgba(255, 255, 255, 0.08);
          padding: 10px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trust-icon {
          color: #6EE7B7;
          flex-shrink: 0;
        }

        .trust-text {
          display: flex;
          flex-direction: column;
          font-size: 11px;
          color: #D1D5DB;
          line-height: 1.2;
        }
        .trust-text strong {
          color: #FFFFFF;
        }

        /* Main Content Area & Navbar */
        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }

        .main-content-area.sidebar-expanded {
          margin-left: 250px;
        }

        .main-content-area.sidebar-collapsed {
          margin-left: 80px;
        }

        .top-navbar {
          height: 72px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .navbar-left, .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hamburger-btn {
          background: none;
          border: none;
          color: #0F2926;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .hamburger-btn:hover {
          background: #F1F5F9;
        }

        .mobile-toggle {
          display: none;
        }

        .nav-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          background: #F4FAF9;
          border: 1px solid #E2E8F0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F2926;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .nav-icon-btn:hover {
          background: #E8F8F5;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #EF4444;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
        }

        .profile-menu-link {
          display: flex;
          align-items: center;
        }

        .top-profile-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #087F6E;
        }

        .top-avatar-placeholder {
         display: flex;
         align-items: center;
         justify-content: center;
         background: #E8F8F5;
         color: #087F6E;
        }

        .outlet-container {
          padding: 32px;
          flex: 1;
        }

        .mobile-backdrop {
          display: none;
        }

                /* ==================================
           DARK MODE - PATIENT DASHBOARD LAYOUT
        ================================== */

        html[data-theme="dark"] .dashboard-layout-wrapper {
          background: #102222;
          color: #E2E8F0;
        }

        /* Sidebar */
        html[data-theme="dark"] .dashboard-sidebar {
          background: #123D39;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
        }

        html[data-theme="dark"] .sidebar-logo-subtitle {
          color: #99F6E4;
        }

        html[data-theme="dark"] .nav-item {
          color: #CBD5E1;
        }

        html[data-theme="dark"] .nav-item:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }

        html[data-theme="dark"] .nav-item.active {
          background: #0D9488;
          color: #FFFFFF;
        }

        html[data-theme="dark"] .sidebar-footer {
          border-top-color: rgba(255, 255, 255, 0.2);
        }

        html[data-theme="dark"] .sidebar-trust-box {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Main navigation bar */
        html[data-theme="dark"] .top-navbar {
          background: #172B2B;
          border-bottom-color: #294343;
        }

        html[data-theme="dark"] .hamburger-btn {
          color: #E2E8F0;
        }

        html[data-theme="dark"] .hamburger-btn:hover {
          background: #294343;
        }

        html[data-theme="dark"] .nav-icon-btn {
          background: #203838;
          border-color: #345050;
          color: #E2E8F0;
        }

        html[data-theme="dark"] .nav-icon-btn:hover {
          background: #294343;
        }

        html[data-theme="dark"] .notification-badge {
          border-color: #172B2B;
        }

        html[data-theme="dark"] .top-profile-avatar {
          border-color: #0D9488;
        }

        html[data-theme="dark"] .top-avatar-placeholder {
          background: #203F3B;
          color: #5EEAD4;
        }

        /* Main page background */
        html[data-theme="dark"] .outlet-container {
          background: #102222;
        }

        /* Responsive Media Queries for Mobile/Tablet */
        @media (max-width: 992px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
            width: 260px !important;
            padding: 24px 16px !important;
          }
          .dashboard-sidebar.mobile-open {
            transform: translateX(0);
          }
          .main-content-area.sidebar-expanded,
          .main-content-area.sidebar-collapsed {
            margin-left: 0 !important;
          }
          .desktop-toggle {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
          .mobile-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            z-index: 95;
          }
          .outlet-container {
            padding: 20px 16px;
          }
          .top-navbar {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}