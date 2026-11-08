import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/appointmentcontext';
import {
  History,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  User,
  Clock,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight
} from 'lucide-react';

export default function AppointmentHistory() {
  const appointmentContext = useAppointments() || {};
  const { appointments = [] } = appointmentContext;

  // Local state for search, filters, pagination, and details modal
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // State for View Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // 1. Filter out ONLY past / historical statuses (Completed, Missed, Cancelled)
  const pastAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const st = (app.status || '').trim() .toLowerCase();
      return st === 'completed' || st === 'missed' || st === 'cancelled';
    });
  }, [appointments]);

  // Extract unique departments for the dropdown filter dynamically
  const availableDepartments = useMemo(() => {
    const deps = pastAppointments.map((app) => app.department).filter(Boolean);
    return ['All', ...new Set(deps)];
  }, [pastAppointments]);

  // 2. Apply Search and Filters
  const filteredHistory = useMemo(() => {
    return pastAppointments.filter((app) => {
      const hospitalField = app.facility_name || app.hospital || '';
      const doctorField = app.doctor_name || app.doctor || '';
      const dateField = app.appointment_date || app.date || '';

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        hospitalField.toLowerCase().includes(query) ||
        doctorField.toLowerCase().includes(query) ||
        (app.reason || '').toLowerCase().includes(query) ||
        (app.department || '').toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        (app.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchesDept =
        departmentFilter === 'All' || app.department === departmentFilter;

      let matchesDate = true;
      if (dateFilter === 'This Month') {
        matchesDate = dateField.includes('2026-11') || dateField.includes('Nov 2026');
      } else if (dateFilter === 'Last Month') {
        matchesDate = dateField.includes('2026-10') || dateField.includes('Oct 2026');
      }

      return matchesSearch && matchesStatus && matchesDept && matchesDate;
    });
  }, [pastAppointments, searchQuery, statusFilter, departmentFilter, dateFilter]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredHistory.slice(start, start + recordsPerPage);
  }, [filteredHistory, currentPage]);

  // Metric Calculations from context history
  const totalPastCount = pastAppointments.length;
  const completedCount = pastAppointments.filter(
    (a) => (a.status || '').toLowerCase() === 'completed'
  ).length;
  const missedCount = pastAppointments.filter(
    (a) => (a.status || '').toLowerCase() === 'missed'
  ).length;
  const cancelledCount = pastAppointments.filter(
    (a) => (a.status || '').toLowerCase() === 'cancelled'
  ).length;

  // Status Badge Styling Helper
  const getStatusBadgeClass = (status) => {
    const st = (status || '').toLowerCase();
    if (st === 'completed') return 'badge-completed';
    if (st === 'missed') return 'badge-missed';
    if (st === 'cancelled') return 'badge-cancelled';
    return 'badge-upcoming';
  };

  // CSV Export Handler
  const handleDownloadCSV = () => {
    if (filteredHistory.length === 0) {
      alert('No appointment history records available to export.');
      return;
    }

    const headers = ['Appointment Date', 'Hospital/Clinic', 'Doctor', 'Department', 'Reason', 'Status'];
    const rows = filteredHistory.map((app) => [
      `"${app.appointment_date || app.date || ''}"`,
      `"${app.facility_name || app.hospital || ''}"`,
      `"${app.doctor_name || app.doctor || ''}"`,
      `"${app.department || ''}"`,
      `"${app.reason || ''}"`,
      `"${app.status || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MediTrack-Appointment-History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (false) return (
    <div className="history-page-container">
      
      {/* 1. PAGE HEADER SECTION */}
      <div className="page-header-section">
        <div className="header-titles">
          <h1 className="page-title">Appointment History</h1>
          <p className="page-description">
            Keep track of your past hospital appointments and visit records.
          </p>
        </div>
        <button onClick={handleDownloadCSV} className="btn-download-history">
          <Download size={18} /> Download History
        </button>
      </div>

      {/* 2. FOUR SUMMARY CARDS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box teal-bg">
            <CalendarCheck size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{totalPastCount}</span>
            <span className="metric-label">Total Past Appointments</span>
            <span className="metric-sub">All past appointment records</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green-bg">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{completedCount}</span>
            <span className="metric-label">Completed</span>
            <span className="metric-sub">Appointments attended</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box orange-bg">
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{missedCount}</span>
            <span className="metric-label">Missed</span>
            <span className="metric-sub">Appointments not attended</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box red-bg">
            <XCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{cancelledCount}</span>
            <span className="metric-label">Cancelled</span>
            <span className="metric-sub">Appointments cancelled</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH AND FILTERS TOOLBAR */}
      <div className="controls-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by hospital, doctor or reason..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filter-dropdowns-group">
          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <Filter size={15} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">Status: All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="filter-select-wrapper">
            <Calendar size={15} className="filter-icon" />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">Date: All Dates</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="filter-select-wrapper">
            <Building2 size={15} className="filter-icon" />
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {availableDepartments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  Department: {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. APPOINTMENT HISTORY TABLE CONTAINER */}
      <div className="table-container-card">
        <div className="table-responsive-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Appointment Date</th>
                <th>Hospital / Clinic</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((app, index) => (
                  <tr key={app.id || index}>
                    <td className="fw-bold">{app.appointment_date || app.date}</td>
                    <td>
                      <div className="hospital-cell">
                        <strong>{app.facility_name || app.hospital}</strong>
                      </div>
                    </td>
                    <td>{app.doctor_name || app.doctor || '—'}</td>
                    <td>{app.department || 'General'}</td>
                    <td className="reason-cell">{app.reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                        ● {app.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAppointment(app)}
                        className="btn-view-details"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state-cell">
                    <div className="empty-state-content">
                      <History size={40} className="empty-icon" />
                      <h3>No appointment history yet.</h3>
                      <p>Past appointments will appear here once their status is updated.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION & RECORD COUNT FOOTER */}
        <div className="table-footer">
          <span className="record-count-text">
            Showing {filteredHistory.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}-
            {Math.min(currentPage * recordsPerPage, filteredHistory.length)} of{' '}
            {filteredHistory.length} records
          </span>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="page-nav-btn"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. YOUR HEALTH RECORD BANNER */}
      <div className="health-record-banner">
        <div className="banner-left">
          <div className="banner-icon-circle">
            <CalendarCheck size={24} />
          </div>
          <div className="banner-text">
            <h2>Your Health Record</h2>
            <p>
              Keep track of your medical visits. A complete history helps you stay informed about your health journey.
            </p>
          </div>
        </div>
        <Link to="/dashboard/calendar" className="btn-view-calendar">
          View Calendar <ArrowRight size={16} />
        </Link>
      </div>

      {/* 6. VIEW APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div className="modal-backdrop" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="close-modal-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-status-banner">
              <div className="modal-date-display">
                <Calendar size={16} className="text-teal" />
                <span>{selectedAppointment.appointment_date || selectedAppointment.date} at {selectedAppointment.appointment_time || selectedAppointment.time || '10:00 AM'}</span>
              </div>
              <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                ● {selectedAppointment.status}
              </span>
            </div>

            <div className="modal-details-grid">
              <div className="detail-item">
                <span className="detail-label">Hospital / Clinic</span>
                <span className="detail-value">
                  <Building2 size={14} className="detail-inline-icon" />
                  {selectedAppointment.facility_name || selectedAppointment.hospital || 'General Hospital'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Doctor</span>
                <span className="detail-value">
                  <User size={14} className="detail-inline-icon" />
                  {selectedAppointment.doctor_name || selectedAppointment.doctor || 'Not specified'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{selectedAppointment.department || 'General'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reason</span>
                <span className="detail-value">{selectedAppointment.reason}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">
                  <MapPin size={14} className="detail-inline-icon" />
                  {selectedAppointment.facility_address || selectedAppointment.address || 'No address recorded'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reminder Preference</span>
                <span className="detail-value">
                  <Bell size={14} className="detail-inline-icon" />
                  {selectedAppointment.reminder_preference || selectedAppointment.reminder || '1 day before'}
                </span>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="modal-notes-section">
                <strong>Additional Notes:</strong>
                <p>{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="modal-footer">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="btn-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="history-page-container">
      
      {/* 1. PAGE HEADER SECTION */}
      <div className="page-header-section">
        <div className="header-titles">
          <h1 className="page-title">Appointment History</h1>
          <p className="page-description">
            Keep track of your past hospital appointments and visit records.
          </p>
        </div>
        <button onClick={handleDownloadCSV} className="btn-download-history">
          <Download size={18} /> Download History
        </button>
      </div>

      {/* 2. FOUR SUMMARY CARDS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box teal-bg">
            <CalendarCheck size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{totalPastCount}</span>
            <span className="metric-label">Total Past Appointments</span>
            <span className="metric-sub">All past appointment records</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green-bg">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{completedCount}</span>
            <span className="metric-label">Completed</span>
            <span className="metric-sub">Appointments attended</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box orange-bg">
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{missedCount}</span>
            <span className="metric-label">Missed</span>
            <span className="metric-sub">Appointments not attended</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box red-bg">
            <XCircle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{cancelledCount}</span>
            <span className="metric-label">Cancelled</span>
            <span className="metric-sub">Appointments cancelled</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH AND FILTERS TOOLBAR */}
      <div className="controls-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by hospital, doctor or reason..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filter-dropdowns-group">
          {/* Status Filter */}
          <div className="filter-select-wrapper">
            <Filter size={15} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">Status: All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="filter-select-wrapper">
            <Calendar size={15} className="filter-icon" />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">Date: All Dates</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="filter-select-wrapper">
            <Building2 size={15} className="filter-icon" />
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {availableDepartments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  Department: {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. APPOINTMENT HISTORY TABLE CONTAINER */}
      <div className="table-container-card">
        <div className="table-responsive-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Appointment Date</th>
                <th>Hospital / Clinic</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((app, index) => (
                  <tr key={app.id || index}>
                    {/* Fixed to read appointment_date with fallback to date */}
                    <td className="fw-bold">{app.appointment_date || app.date}</td>
                    <td>
                      <div className="hospital-cell">
                        {/* Fixed to read facility_name with fallback to hospital */}
                        <strong>{app.facility_name || app.hospital}</strong>
                      </div>
                    </td>
                    {/* Fixed to read doctor_name with fallback to doctor */}
                    <td>{app.doctor_name || app.doctor || '—'}</td>
                    <td>{app.department || 'General'}</td>
                    <td className="reason-cell">{app.reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                        ● {app.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAppointment(app)}
                        className="btn-view-details"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state-cell">
                    <div className="empty-state-content">
                      <History size={40} className="empty-icon" />
                      <h3>No appointment history yet.</h3>
                      <p>Past appointments will appear here once their status is updated.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION & RECORD COUNT FOOTER */}
        <div className="table-footer">
          <span className="record-count-text">
            Showing {filteredHistory.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}-
            {Math.min(currentPage * recordsPerPage, filteredHistory.length)} of{' '}
            {filteredHistory.length} records
          </span>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="page-nav-btn"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. YOUR HEALTH RECORD BANNER */}
      <div className="health-record-banner">
        <div className="banner-left">
          <div className="banner-icon-circle">
            <CalendarCheck size={24} />
          </div>
          <div className="banner-text">
            <h2>Your Health Record</h2>
            <p>
              Keep track of your medical visits. A complete history helps you stay informed about your health journey.
            </p>
          </div>
        </div>
        <Link to="/dashboard/calendar" className="btn-view-calendar">
          View Calendar <ArrowRight size={16} />
        </Link>
      </div>

      {/* 6. VIEW APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div className="modal-backdrop" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="close-modal-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-status-banner">
              <div className="modal-date-display">
                <Calendar size={16} className="text-teal" />
                <span>{selectedAppointment.appointment_date || selectedAppointment.date} at {selectedAppointment.appointment_time || selectedAppointment.time || '10:00 AM'}</span>
              </div>
              <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                ● {selectedAppointment.status}
              </span>
            </div>

            <div className="modal-details-grid">
              <div className="detail-item">
                <span className="detail-label">Hospital / Clinic</span>
                <span className="detail-value">
                  <Building2 size={14} className="detail-inline-icon" />
                  {selectedAppointment.facility_name || selectedAppointment.hospital || 'General Hospital'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Doctor</span>
                <span className="detail-value">
                  <User size={14} className="detail-inline-icon" />
                  {selectedAppointment.doctor_name || selectedAppointment.doctor || 'Not specified'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{selectedAppointment.department || 'General'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reason</span>
                <span className="detail-value">{selectedAppointment.reason}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">
                  <MapPin size={14} className="detail-inline-icon" />
                  {selectedAppointment.facility_address || selectedAppointment.address || 'No address recorded'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reminder Preference</span>
                <span className="detail-value">
                  <Bell size={14} className="detail-inline-icon" />
                  {selectedAppointment.reminder_preference || selectedAppointment.reminder || '1 day before'}
                </span>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="modal-notes-section">
                <strong>Additional Notes:</strong>
                <p>{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="modal-footer">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="btn-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERNAL STYLING */}
      <style>{`
        .history-page-container {
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

        .btn-download-history {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
          text-decoration: none;
        }
        .btn-download-history:hover {
          background: #066658;
        }

        /* METRICS SUMMARY CARDS */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric-card {
          background: #FFFFFF;
          border: 1px solid #E1F0EE;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 15px rgba(8, 127, 110, 0.03);
        }

        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .teal-bg { background: #E8F8F5; color: #087F6E; }
        .green-bg { background: #DCFCE7; color: #16A34A; }
        .orange-bg { background: #FEF3C7; color: #D97706; }
        .red-bg { background: #FEE2E2; color: #DC2626; }

        .metric-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 800;
          color: #0F2926;
          line-height: 1.1;
        }
        .metric-label {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }
        .metric-sub {
          font-size: 11px;
          color: #64748B;
        }

        /* CONTROLS TOOLBAR */
        .controls-toolbar {
          background: #FFFFFF;
          padding: 16px 24px;
          border-radius: 16px;
          border: 1px solid #E1F0EE;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 4px 15px rgba(8, 127, 110, 0.03);
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          max-width: 380px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
        }
        .search-input {
          width: 100%;
          padding: 10px 14px 10px 42px;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          font-size: 14px;
          color: #0F2926;
          outline: none;
          background: #F8FCFC;
          transition: border-color 0.2s ease;
        }
        .search-input:focus {
          border-color: #087F6E;
          background: #FFFFFF;
        }

        .filter-dropdowns-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .filter-icon {
          position: absolute;
          left: 12px;
          color: #64748B;
          pointer-events: none;
        }
        .filter-select {
          padding: 10px 14px 10px 36px;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #0F2926;
          background: #F8FCFC;
          outline: none;
          cursor: pointer;
        }
        .filter-select:focus {
          border-color: #087F6E;
        }

        /* TABLE CONTAINER */
        .table-container-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          overflow: hidden;
        }

        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .appointments-table th {
          background: #F8FCFC;
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          border-bottom: 1px solid #E2E8F0;
          letter-spacing: 0.05em;
        }

        .appointments-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #0F2926;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }

        .appointments-table tr:hover td {
          background: #F4FAF9;
        }

        .fw-bold { font-weight: 700; }
        .reason-cell {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .badge-completed { background: #DCFCE7; color: #15803D; }
        .badge-missed { background: #FEF3C7; color: #D97706; }
        .badge-cancelled { background: #FEE2E2; color: #DC2626; }

        .btn-view-details {
          background: #E8F8F5;
          color: #087F6E;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-view-details:hover {
          background: #D1F3EE;
        }

        /* EMPTY STATE */
        .empty-state-cell {
          text-align: center;
          padding: 60px 20px;
        }
        .empty-state-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #64748B;
        }
        .empty-icon { color: #CBD5E1; }

        /* TABLE FOOTER / PAGINATION */
        .table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
        }

        .record-count-text {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .page-nav-btn, .page-num-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #0F2926;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .page-num-btn.active {
          background: #087F6E;
          color: #FFFFFF;
          border-color: #087F6E;
        }
        .page-nav-btn:hover:not(:disabled), .page-num-btn:hover:not(.active) {
          background: #F1F5F9;
        }
        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* YOUR HEALTH RECORD BANNER */
        .health-record-banner {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px 32px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .banner-icon-circle {
          width: 52px;
          height: 52px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .banner-text h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 4px;
        }

        .banner-text p {
          font-size: 13px;
          color: #4A6360;
          line-height: 1.4;
        }

        .btn-view-calendar {
          background: #F4FAF9;
          color: #087F6E;
          border: 1px solid #D4F3EE;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s ease;
        }
        .btn-view-calendar:hover {
          background: #E8F8F5;
        }

        /* MODAL OVERLAY & STYLING */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
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
          max-width: 500px;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid #E1F0EE;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 90vh;
          overflow-y: auto;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-modal-btn:hover {
          background: #F1F5F9;
        }

        .modal-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FCFC;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E1F0EE;
        }

        .modal-date-display {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }
        .text-teal { color: #087F6E; }

        .modal-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 600;
          color: #0F2926;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detail-inline-icon {
          color: #087F6E;
          flex-shrink: 0;
        }

        .modal-notes-section {
          background: #F8FCFC;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E1F0EE;
          font-size: 13px;
          color: #334155;
        }
        .modal-notes-section strong {
          color: #0F2926;
          display: block;
          margin-bottom: 4px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 8px;
          border-top: 1px solid #F1F5F9;
        }

        .btn-modal-close {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-modal-close:hover {
          background: #066658;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .page-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .btn-download-history {
            width: 100%;
            justify-content: center;
          }
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .controls-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input-wrapper {
            max-width: 100%;
          }
          .filter-dropdowns-group {
            flex-direction: column;
            width: 100%;
          }
          .filter-select-wrapper, .filter-select {
            width: 100%;
          }
          .health-record-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-view-calendar {
            width: 100%;
            justify-content: center;
          }
          .modal-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}