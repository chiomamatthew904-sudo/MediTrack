import React, { useState } from 'react';
import { useProfile } from '../../context/profilecontext';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  ShieldAlert,
  Sun,
  Moon
} from 'lucide-react';
import medimg from '../../assets/medimg.jpg';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const { profile, loading, logoutUser, updateTheme } = useProfile();
  
if (loading) {
  return <div>Verifying administrator access...</div>;
}

if (!profile?.id || profile.role?.trim().toLowerCase() !== 'admin') {
  return <Navigate to="/login" replace />;
}

   const handleLogout = async (e) => {
  e.preventDefault();

  if (window.confirm("Are you sure you want to log out of MediTrack Admin?")) {
    await logoutUser();
    navigate('/login', { replace: true });
  }
};


  const handleThemeToggle = async () => {
  const newTheme = profile.theme === 'dark' ? 'light' : 'dark';

  const result = await updateTheme(newTheme);

  if (!result.success) {
    alert(result.error || 'Unable to change theme.');
  }
};

  return (
    <div className={`mt-admin-wrapper ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* ADMIN SIDEBAR */}
      <aside className={`mt-admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="mt-admin-logo-container">
          <img src={medimg} alt="MediTrack Logo" className="mt-admin-logo-img" />
          <p className="mt-admin-tagline">Your appointments organized in one place.</p>
        </div>

        <nav className="mt-admin-nav-links">
          <NavLink 
            to="/admin/dashboard" 
            end 
            className={({ isActive }) => isActive ? "mt-admin-nav-item active" : "mt-admin-nav-item"}
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/management" 
            className={({ isActive }) => isActive ? "mt-admin-nav-item active" : "mt-admin-nav-item"}
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
          >
            <Settings size={19} />
            <span>Management</span>
          </NavLink>
        </nav>

        <div className="mt-admin-sidebar-footer">
          <button onClick={handleLogout} className="mt-admin-logout-btn">
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="mt-admin-main">
        <header className="mt-admin-topbar">
          <div className="mt-topbar-left">
            <button 
              className="mt-admin-toggle-btn" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              <Menu size={22} />
            </button>
          </div>

            <div className="mt-topbar-right">
  <button
    className="mt-admin-icon-btn"
    title={profile.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    aria-label="Toggle Theme"
    onClick={handleThemeToggle}
  >
    {profile.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </button>

  <button
    className="mt-admin-icon-btn"
    title="Notifications"
    onClick={() => navigate('/admin/management')}
  >
    <Bell size={20} />
  </button>
</div>

            <div className="mt-admin-profile-menu-wrap">
              <div 
                className="mt-admin-profile-trigger" 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="mt-admin-avatar">A</div>
                <span className="mt-admin-name">Admin</span>
                <ChevronDown size={16} className="mt-chevron" />
              </div>

              {showProfileDropdown && (
                <div className="mt-admin-dropdown">
                  <div className="mt-dropdown-header">
                    <p className="mt-dropdown-user-name">Administrator</p>
                    <p className="mt-dropdown-user-role">System Controller</p>
                  </div>
                  <ul>
                    <li onClick={() => { navigate('/admin/dashboard'); setShowProfileDropdown(false); }}>
                      <LayoutDashboard size={15} /> Dashboard
                    </li>
                    <li onClick={() => { navigate('/admin/management'); setShowProfileDropdown(false); }}>
                      <Settings size={15} /> Management
                    </li>
                    <li className="logout-item" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
        </header>

        {/* PAGE OUTLET */}
        <main className="mt-admin-content">
          <Outlet />
        </main>
      </div>

      {/* EMBEDDED STYLING */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .mt-admin-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: 'Inter', sans-serif;
          color: #0F172A;
        }

        /* SIDEBAR */
        .mt-admin-sidebar {
          width: 260px;
          background: #FFFFFF;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          transition: transform 0.3s ease;
          padding: 24px 16px;
        }
        .mt-admin-wrapper.collapsed .mt-admin-sidebar {
          transform: translateX(-100%);
        }

        .mt-admin-logo-container {
          text-align: center;
          padding-bottom: 24px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 20px;
        }
        .mt-admin-logo-img {
          width: 130px;
          height: auto;
          margin-bottom: 8px;
        }
        .mt-admin-tagline {
          font-size: 11px;
          color: #64748B;
          line-height: 1.4;
        }

        .mt-admin-nav-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mt-admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #64748B;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .mt-admin-nav-item:hover {
          background: #F1F5F9;
          color: #0D9488;
        }
        .mt-admin-nav-item.active {
          background: #0D9488;
          color: #FFFFFF;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
        }

        .mt-admin-sidebar-footer {
          padding-top: 16px;
          border-top: 1px solid #E2E8F0;
        }
        .mt-admin-logout-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: #EF4444;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .mt-admin-logout-btn:hover {
          background: #FEF2F2;
        }

        /* MAIN CONTENT CONTAINER */
        .mt-admin-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .mt-admin-wrapper.collapsed .mt-admin-main {
          margin-left: 0;
        }

        /* TOPBAR */
        .mt-admin-topbar {
          height: 72px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .mt-admin-toggle-btn {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #0D9488;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .mt-admin-toggle-btn:hover {
          background: #E2E8F0;
        }

        .mt-topbar-left {
         display: flex;
         align-items: center;
         flex: 1;
        }

        .mt-topbar-right {
         display: flex;
         align-items: center;
         justify-content: flex-end;
         gap: 20px;
         margin-left: auto;
         flex-shrink: 0;
       }
        .mt-admin-icon-btn {
          position: relative;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mt-admin-icon-btn:hover {
          color: #0D9488;
          border-color: #0D9488;
        }
        .mt-admin-badge-count {
          position: absolute;
          top: -4px;
          right: -4px;
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

        .mt-admin-profile-menu-wrap {
          position: relative;
        }
        .mt-admin-profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 20px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          transition: background 0.2s;
        }
        .mt-admin-profile-trigger:hover {
          background: #F1F5F9;
        }
        .mt-admin-avatar {
          width: 32px;
          height: 32px;
          background: #0D9488;
          color: #FFFFFF;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .mt-admin-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #0F172A;
        }
        .mt-chevron {
          color: #64748B;
        }

        /* DROPDOWN */
        .mt-admin-dropdown {
          position: absolute;
          right: 0;
          top: 50px;
          width: 200px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 110;
        }
        .mt-dropdown-header {
          padding: 12px 16px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }
        .mt-dropdown-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
        }
        .mt-dropdown-user-role {
          font-size: 11px;
          color: #0D9488;
        }
        .mt-admin-dropdown ul {
          list-style: none;
          padding: 6px;
        }
        .mt-admin-dropdown li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: #334155;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mt-admin-dropdown li:hover {
          background: #F1F5F9;
          color: #0D9488;
        }
        .mt-admin-dropdown li.logout-item {
          color: #EF4444;
        }
        .mt-admin-dropdown li.logout-item:hover {
          background: #FEF2F2;
        }

        .mt-admin-content {
          flex: 1;
          padding: 32px;
        }



        /* ==================================
   DARK MODE - ADMIN LAYOUT
================================== */


/* Main wrapper and content */
html[data-theme="dark"] .mt-admin-wrapper {
background: #102222;
color: #E2E8F0;
}

html[data-theme="dark"] .mt-admin-main,
html[data-theme="dark"] .mt-admin-content {
background: #102222;
color: #E2E8F0;
}

/* Sidebar */
html[data-theme="dark"] .mt-admin-sidebar {
background: #172B2B;
border-right-color: #294343;
}

html[data-theme="dark"] .mt-admin-logo-container,
html[data-theme="dark"] .mt-admin-sidebar-footer {
border-color: #294343;
}

html[data-theme="dark"] .mt-admin-tagline {
color: #A7B8B8;
}

/* Sidebar navigation */
html[data-theme="dark"] .mt-admin-nav-item {
color: #CBD5E1;
}

html[data-theme="dark"] .mt-admin-nav-item:hover {
background: #203838;
color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-nav-item.active {
background: #0D9488;
color: #FFFFFF;
}

/* Logout */
html[data-theme="dark"] .mt-admin-logout-btn:hover {
background: #3B2025;
}

/* Top navigation */
html[data-theme="dark"] .mt-admin-topbar {
background: #172B2B;
border-bottom-color: #294343;
}

html[data-theme="dark"] .mt-admin-toggle-btn,
html[data-theme="dark"] .mt-admin-icon-btn,
html[data-theme="dark"] .mt-admin-profile-trigger {
background: #203838;
border-color: #345050;
color: #CBD5E1;
}

html[data-theme="dark"] .mt-admin-toggle-btn:hover,
html[data-theme="dark"] .mt-admin-icon-btn:hover,
html[data-theme="dark"] .mt-admin-profile-trigger:hover {
background: #294343;
color: #5EEAD4;
}

/* Admin profile */
html[data-theme="dark"] .mt-admin-name {
color: #F1F5F9;
}

html[data-theme="dark"] .mt-chevron {
color: #A7B8B8;
}

/* Profile dropdown */
html[data-theme="dark"] .mt-admin-dropdown {
background: #172B2B;
border-color: #345050;
}

html[data-theme="dark"] .mt-dropdown-header {
background: #203838;
border-bottom-color: #345050;
}

html[data-theme="dark"] .mt-dropdown-user-name {
color: #F1F5F9;
}

html[data-theme="dark"] .mt-dropdown-user-role {
color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-dropdown li {
color: #CBD5E1;
}

html[data-theme="dark"] .mt-admin-dropdown li:hover {
background: #294343;
color: #5EEAD4;
}

html[data-theme="dark"] .mt-admin-dropdown li.logout-item {
color: #F87171;
}

html[data-theme="dark"] .mt-admin-dropdown li.logout-item:hover {
background: #3B2025;
}


        @media (max-width: 768px) {
          .mt-admin-sidebar { transform: translateX(-100%); }
          .mt-admin-sidebar.open { transform: translateX(0); }
          .mt-admin-main { margin-left: 0 !important; }
          .mt-admin-topbar { padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}