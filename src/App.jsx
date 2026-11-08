import './supabaseClient';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Context Providers
import { AppointmentProvider } from './context/appointmentcontext';
import { NotificationProvider } from './context/notificationcontext';
import { ProfileProvider } from './context/profilecontext';

// Import Admin Layout and Dashboard
import AdminLayout from './Pages/Admin/adminlayout';
import AdminDashboard from './Pages/Admin/admindashboard';
import Management from './Pages/Admin/management';

// Public Pages
import Home from './Pages/homepage';
import AboutPage from './Pages/about';
import HowItWorksPage from './Pages/how-it-works';
import ContactPage from './Pages/contact';
import LoginPage from './Pages/login';
import GetStartedPage from './Pages/get-started';

// Patient Dashboard Layout & Sub-Views
import DashboardLayout from './Pages/Patient/dashboardlayout';
import PatientDashboard from './Pages/Patient/dashboard';
import MyAppointments from './Pages/Patient/my-appointment';
import AppointmentCalendar from './Pages/Patient/calendar';
import AppointmentHistory from './Pages/Patient/history';
import NotificationsPage from './Pages/Patient/notification';
import AIAssistantPage from './Pages/Patient/assistant';
import ProfilePage from './Pages/Patient/profile';

export default function App() {
  return (
    <ProfileProvider>
      <NotificationProvider>
        <AppointmentProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. Public Standalone Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />


              {/* Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="management" element={<Management />} />
              </Route>

              {/* 2. Protected Patient Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<PatientDashboard />} />
                <Route path="my-appointment" element={<MyAppointments />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="calendar" element={<AppointmentCalendar />} />
                <Route path="history" element={<AppointmentHistory />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="assistant" element={<AIAssistantPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* 3. Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppointmentProvider>
      </NotificationProvider>
    </ProfileProvider>
  );
}