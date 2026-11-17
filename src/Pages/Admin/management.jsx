import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Mail,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function Management() {
  // Active Tab State: 'patients' | 'appointments' | 'enquiries'
  const [activeTab, setActiveTab] = useState('patients');

  // Search & Filter States
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('All');

  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('All');

  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Modal States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Enquiry Reply States
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Pagination States per Tab
  const [patientPage, setPatientPage] = useState(1);
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [enquiryPage, setEnquiryPage] = useState(1);
  const rowsPerPage = 5;


  // Fetch real management data from the backend
const fetchManagementData = async () => {
  try {
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('Please log in again to continue.');
    }

    const response = await fetch(
      'http://localhost:5000/api/admin/management',
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || 'Unable to fetch management data.'
      );
    }

    // Convert database records to the format used by the existing tables
    setPatientsData(
      (result.patients || []).map(patient => ({
        id: patient.id,
        name: patient.full_name || 'Unnamed Patient',
        email: patient.email || '—',
        phone: patient.phone || '—',
        regDate: patient.created_at
          ? new Date(patient.created_at).toLocaleDateString('en-NG', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Africa/Lagos'
            })
          : '—',
        status: 'Active'
      }))
    );

    setAppointmentsData(
      (result.appointments || []).map(appointment => ({
        id: appointment.id,
        name: appointment.patient_name || 'Unknown Patient',
        clinic: appointment.facility_name || '—',
        reason: appointment.reason || '—',
        date: appointment.appointment_date || '—',
        time: appointment.appointment_time || '—',
        status: appointment.status || 'Upcoming'
      }))
    );

    setEnquiriesData(
      (result.enquiries || []).map(enquiry => ({
        id: enquiry.id,
        sender: enquiry.full_name || 'Unknown Sender',
        email: enquiry.email || '—',
        subject: enquiry.subject || '—',
        message: enquiry.message || '—',
        date: enquiry.created_at
          ? new Date(enquiry.created_at).toLocaleString('en-NG', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Africa/Lagos'
            })
          : '—',
       status: enquiry.status
       ? enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1).toLowerCase()
       : 'New'
      }))
    );

  } catch (error) {
    console.error('Management data error:', error.message);
    alert(error.message);
  }
};


// Fetch management data when the page loads
useEffect(() => {
  fetchManagementData();
}, []);


  // Data retrieved from Supabase
  const [patientsData, setPatientsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [enquiriesData, setEnquiriesData] = useState([]);

  // Current Date formatted for top right
  const currentDateFormatted = new Date().toLocaleDateString('en-NG', {
  timeZone: 'Africa/Lagos',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

  // --- FILTER & PAGINATION LOGIC: PATIENTS ---
  const filteredPatients = patientsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.email.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesStatus = patientStatusFilter === 'All' || p.status === patientStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPatientPages = Math.ceil(filteredPatients.length / rowsPerPage) || 1;
  const patientStartIndex = (patientPage - 1) * rowsPerPage;
  const currentPatients = filteredPatients.slice(patientStartIndex, patientStartIndex + rowsPerPage);

  // --- FILTER & PAGINATION LOGIC: APPOINTMENTS ---
  const filteredAppointments = appointmentsData.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(appointmentSearch.toLowerCase()) || a.clinic.toLowerCase().includes(appointmentSearch.toLowerCase());
    const matchesStatus = appointmentStatusFilter === 'All' || a.status === appointmentStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalAppointmentPages = Math.ceil(filteredAppointments.length / rowsPerPage) || 1;
  const apptStartIndex = (appointmentPage - 1) * rowsPerPage;
  const currentAppointments = filteredAppointments.slice(apptStartIndex, apptStartIndex + rowsPerPage);

  // --- FILTER & PAGINATION LOGIC: ENQUIRIES ---
  const filteredEnquiries = enquiriesData.filter(e => {
    const matchesSearch = e.sender.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalEnquiryPages = Math.ceil(filteredEnquiries.length / rowsPerPage) || 1;
  const enquiryStartIndex = (enquiryPage - 1) * rowsPerPage;
  const currentEnquiries = filteredEnquiries.slice(enquiryStartIndex, enquiryStartIndex + rowsPerPage);

  // --- ACTIONS FOR ENQUIRIES ---
const updateEnquiryStatus = async (id, status) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Your admin session has expired. Please log in again.');
    }

    const response = await fetch(
      `http://localhost:5000/api/admin/enquiries/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to update enquiry.');
    }

   // Convert database status to dashboard display format
  const displayStatus =
  result.enquiry.status.charAt(0).toUpperCase() +
  result.enquiry.status.slice(1).toLowerCase();

// Update the enquiry list
setEnquiriesData(prev =>
  prev.map(e =>
    e.id === id ? { ...e, status: displayStatus } : e
  )
);

// Update the selected enquiry if it is currently open
setSelectedEnquiry(prev =>
  prev?.id === id
    ? { ...prev, status: displayStatus }
    : prev
); 

  } catch (error) {
    console.error('Error updating enquiry:', error);
    alert(error.message || 'Unable to update enquiry status.');
  }
};

const handleMarkAsRead = (id) => {
  updateEnquiryStatus(id, 'read');
};


const handleSendReply = async () => {
  if (!replyMessage.trim()) {
    alert('Please enter a reply message.');
    return;
  }

  try {
    setSendingReply(true);

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error('Please log in again.');
    }

    const response = await fetch(
      `http://localhost:5000/api/admin/enquiries/${selectedEnquiry.id}/reply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          message: replyMessage.trim()
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send reply.');
    }

    setEnquiriesData(prev =>
      prev.map(enquiry =>
        enquiry.id === selectedEnquiry.id
          ? { ...enquiry, status: 'Replied' }
          : enquiry
      )
    );

    setSelectedEnquiry(prev => ({
      ...prev,
      status: 'Replied'
    }));

    setReplyMessage('');

    alert('Reply sent successfully!');

  } catch (error) {
    console.error('Reply error:', error);
    alert(error.message);
  } finally {
    setSendingReply(false);
  }
};


const handleMarkAsReplied = (id) => {
  updateEnquiryStatus(id, 'replied');
};

  return (
    <div className="mt-management-container">
      
      {/* HEADER BANNER */}
      <div className="mt-welcome-card">
        <div className="mt-welcome-left">
          <div className="mt-shield-icon-wrap">
            <Users size={28} color="#0D9488" />
          </div>
          <div>
            <h1>Management</h1>
            <p>Monitor and manage patients, appointments and contact enquiries.</p>
          </div>
        </div>
        <div className="mt-welcome-right">
          <Calendar size={16} color="#0D9488" />
          <span>{currentDateFormatted}</span>
        </div>
      </div>

      {/* THREE INTERACTIVE TABS */}
      <div className="mt-tabs-bar">
        <button 
          className={`mt-tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <Users size={18} /> Patients
        </button>
        <button 
          className={`mt-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={18} /> Appointments
        </button>
        <button 
          className={`mt-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          <Mail size={18} /> Contact Enquiries
        </button>
      </div>

      {/* ================= TAB 1: PATIENTS ================= */}
      {activeTab === 'patients' && (
        <div className="mt-card">
          <div className="mt-card-top-controls">
            <div>
              <h3>Patients</h3>
              <p className="mt-section-subtitle">View and manage registered patient accounts.</p>
            </div>
            <div className="mt-controls-right">
              <div className="mt-search-box">
                <Search size={16} color="#64748B" />
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setPatientPage(1); }}
                />
              </div>
              <select 
                className="mt-filter-select"
                value={patientStatusFilter}
                onChange={(e) => { setPatientStatusFilter(e.target.value); setPatientPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
              <button className="mt-refresh-btn" onClick={() => { setPatientSearch(''); setPatientStatusFilter('All'); setPatientPage(1); }}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>

          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-semibold">{patient.name}</td>
                      <td className="text-muted">{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.regDate}</td>
                      <td>
                        <span className={`mt-status-badge ${patient.status.toLowerCase()}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        <button className="mt-action-btn" onClick={() => setSelectedPatient(patient)}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="mt-empty-row">No patient records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Fully Functional Pagination Footer */}
          <div className="mt-pagination-footer">
            <span className="mt-pagination-info">
              Showing {filteredPatients.length > 0 ? patientStartIndex + 1 : 0}-{Math.min(patientStartIndex + rowsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
            </span>
            <div className="mt-pagination-buttons">
              <button 
                className="mt-page-arrow" 
                onClick={() => setPatientPage(prev => Math.max(prev - 1, 1))}
                disabled={patientPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPatientPages)].map((_, i) => (
                <button 
                  key={i + 1} 
                  className={`mt-page-num ${patientPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setPatientPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className="mt-page-arrow" 
                onClick={() => setPatientPage(prev => Math.min(prev + 1, totalPatientPages))}
                disabled={patientPage === totalPatientPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: APPOINTMENTS ================= */}
      {activeTab === 'appointments' && (
        <div className="mt-card">
          <div className="mt-card-top-controls">
            <div>
              <h3>Appointments</h3>
              <p className="mt-section-subtitle">Monitor patient appointment records (View-Only).</p>
            </div>
            <div className="mt-controls-right">
              <div className="mt-search-box">
                <Search size={16} color="#64748B" />
                <input 
                  type="text" 
                  placeholder="Search appointments..." 
                  value={appointmentSearch}
                  onChange={(e) => { setAppointmentSearch(e.target.value); setAppointmentPage(1); }}
                />
              </div>
              <select 
                className="mt-filter-select"
                value={appointmentStatusFilter}
                onChange={(e) => { setAppointmentStatusFilter(e.target.value); setAppointmentPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button className="mt-refresh-btn" onClick={() => { setAppointmentSearch(''); setAppointmentStatusFilter('All'); setAppointmentPage(1); }}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>

          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Hospital / Clinic</th>
                  <th>Appointment Reason</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td className="font-semibold">{appt.name}</td>
                      <td className="text-muted">{appt.clinic}</td>
                      <td>{appt.reason}</td>
                      <td>{appt.date}, {appt.time}</td>
                      <td>
                        <span className={`mt-status-badge ${appt.status.toLowerCase()}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <button className="mt-action-btn" onClick={() => setSelectedAppointment(appt)}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="mt-empty-row">No appointment records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-pagination-footer">
            <span className="mt-pagination-info">
              Showing {filteredAppointments.length > 0 ? apptStartIndex + 1 : 0}-{Math.min(apptStartIndex + rowsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
            </span>
            <div className="mt-pagination-buttons">
              <button 
                className="mt-page-arrow" 
                onClick={() => setAppointmentPage(prev => Math.max(prev - 1, 1))}
                disabled={appointmentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalAppointmentPages)].map((_, i) => (
                <button 
                  key={i + 1} 
                  className={`mt-page-num ${appointmentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setAppointmentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className="mt-page-arrow" 
                onClick={() => setAppointmentPage(prev => Math.min(prev + 1, totalAppointmentPages))}
                disabled={appointmentPage === totalAppointmentPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CONTACT ENQUIRIES ================= */}
      {activeTab === 'enquiries' && (
        <div className="mt-card">
          <div className="mt-card-top-controls">
            <div>
              <h3>Contact Enquiries</h3>
              <p className="mt-section-subtitle">Manage messages submitted from the public Contact page.</p>
            </div>
            <div className="mt-controls-right">
              <div className="mt-search-box">
                <Search size={16} color="#64748B" />
                <input 
                  type="text" 
                  placeholder="Search enquiries..." 
                  value={enquirySearch}
                  onChange={(e) => { setEnquirySearch(e.target.value); setEnquiryPage(1); }}
                />
              </div>
              <select 
                className="mt-filter-select"
                value={enquiryStatusFilter}
                onChange={(e) => { setEnquiryStatusFilter(e.target.value); setEnquiryPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Replied">Replied</option>
              </select>
              <button className="mt-refresh-btn" onClick={() => { setEnquirySearch(''); setEnquiryStatusFilter('All'); setEnquiryPage(1); }}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>

          <div className="mt-table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Sender Name</th>
                  <th>Email Address</th>
                  <th>Subject</th>
                  <th>Date Received</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEnquiries.length > 0 ? (
                  currentEnquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td className="font-semibold">{enq.sender}</td>
                      <td className="text-muted">{enq.email}</td>
                      <td>{enq.subject}</td>
                      <td>{enq.date}</td>
                      <td>
                        <span className={`mt-enquiry-badge ${enq.status.toLowerCase()}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        <button className="mt-action-btn" onClick={() => setSelectedEnquiry(enq)}>
                          <Eye size={14} /> View Message
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="mt-empty-row">No contact enquiries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-pagination-footer">
            <span className="mt-pagination-info">
              Showing {filteredEnquiries.length > 0 ? enquiryStartIndex + 1 : 0}-{Math.min(enquiryStartIndex + rowsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
            </span>
            <div className="mt-pagination-buttons">
              <button 
                className="mt-page-arrow" 
                onClick={() => setEnquiryPage(prev => Math.max(prev - 1, 1))}
                disabled={enquiryPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalEnquiryPages)].map((_, i) => (
                <button 
                  key={i + 1} 
                  className={`mt-page-num ${enquiryPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setEnquiryPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className="mt-page-arrow" 
                onClick={() => setEnquiryPage(prev => Math.min(prev + 1, totalEnquiryPages))}
                disabled={enquiryPage === totalEnquiryPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Patient Details Modal */}
      {selectedPatient && (
        <div className="mt-modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mt-modal-header">
              <h3>Patient Profile Details</h3>
              <button className="mt-modal-close" onClick={() => setSelectedPatient(null)}><X size={18} /></button>
            </div>
            <div className="mt-modal-body">
              <div className="mt-detail-row">
                <span className="mt-detail-label">Full Name:</span>
                <span className="mt-detail-val font-semibold">{selectedPatient.name}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Email Address:</span>
                <span className="mt-detail-val">{selectedPatient.email}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Phone Number:</span>
                <span className="mt-detail-val">{selectedPatient.phone}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Registration Date:</span>
                <span className="mt-detail-val">{selectedPatient.regDate}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Account Status:</span>
                <span className={`mt-status-badge ${selectedPatient.status.toLowerCase()}`}>{selectedPatient.status}</span>
              </div>
              <div className="mt-admin-notice">
                <ShieldCheck size={16} color="#0D9488" />
                <span>Patient passwords and sensitive credentials are encrypted and secure from administrator view.</span>
              </div>
            </div>
            <div className="mt-modal-footer">
              <button className="mt-btn-secondary" onClick={() => setSelectedPatient(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Appointment Details Modal (View-Only) */}
      {selectedAppointment && (
        <div className="mt-modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mt-modal-header">
              <h3>Appointment Record Inspection</h3>
              <button className="mt-modal-close" onClick={() => setSelectedAppointment(null)}><X size={18} /></button>
            </div>
            <div className="mt-modal-body">
              <div className="mt-detail-row">
                <span className="mt-detail-label">Patient Name:</span>
                <span className="mt-detail-val font-semibold">{selectedAppointment.name}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Hospital / Clinic:</span>
                <span className="mt-detail-val">{selectedAppointment.clinic}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Appointment Reason:</span>
                <span className="mt-detail-val">{selectedAppointment.reason}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Date & Time:</span>
                <span className="mt-detail-val">{selectedAppointment.date} at {selectedAppointment.time}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Current Status:</span>
                <span className={`mt-status-badge ${selectedAppointment.status.toLowerCase()}`}>{selectedAppointment.status}</span>
              </div>
              <div className="mt-admin-notice view-only">
                <Clock size={16} color="#D97706" />
                <span><strong>View-Only Record:</strong> This appointment was entered by the patient and cannot be edited or modified by administrators.</span>
              </div>
            </div>
            <div className="mt-modal-footer">
              <button className="mt-btn-secondary" onClick={() => setSelectedAppointment(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="mt-modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="mt-modal-card enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mt-modal-header">
              <h3>Contact Enquiry Message</h3>
              <button className="mt-modal-close" onClick={() => setSelectedEnquiry(null)}><X size={18} /></button>
            </div>
            <div className="mt-modal-body">
              <div className="mt-detail-row">
                <span className="mt-detail-label">Sender Name:</span>
                <span className="mt-detail-val font-semibold">{selectedEnquiry.sender}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Sender Email:</span>
                <span className="mt-detail-val">{selectedEnquiry.email}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Subject:</span>
                <span className="mt-detail-val font-semibold">{selectedEnquiry.subject}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Date Received:</span>
                <span className="mt-detail-val">{selectedEnquiry.date}</span>
              </div>
              <div className="mt-detail-row">
                <span className="mt-detail-label">Status:</span>
                <span className={`mt-enquiry-badge ${selectedEnquiry.status.toLowerCase()}`}>{selectedEnquiry.status}</span>
              </div>
              <div className="mt-message-box">
                <p className="mt-message-title">Message Content:</p>
                <p className="mt-message-text">{selectedEnquiry.message}</p>
              </div>

               
<div className="mt-reply-section">
  <label htmlFor="enquiry-reply" className="mt-message-title">
    Write Your Reply:
  </label>

  <textarea
    id="enquiry-reply"
    className="mt-reply-textarea"
    value={replyMessage}
    onChange={(e) => setReplyMessage(e.target.value)}
    placeholder="Write your response to this enquiry..."
    rows={5}
    disabled={sendingReply}
  />

  <button
    type="button"
    className="mt-btn-action-replied"
    onClick={handleSendReply}
    disabled={sendingReply || !replyMessage.trim()}
  >
    {sendingReply ? 'Sending...' : 'Send Reply'}
  </button>
</div>

            </div>
            <div className="mt-modal-footer enquiry-footer">
              <div className="mt-footer-action-left">
                {selectedEnquiry.status !== 'Read' && (
                  <button className="mt-btn-action-read" onClick={() => handleMarkAsRead(selectedEnquiry.id)}>
                    Mark as Read
                  </button>
                )}
                
              </div>
              <button className="mt-btn-secondary" onClick={() => setSelectedEnquiry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED STYLING */}
      <style>{`
        .mt-management-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* WELCOME BANNER */
        .mt-welcome-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .mt-welcome-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .mt-shield-icon-wrap {
          width: 52px;
          height: 52px;
          background: #CCFBF1;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mt-welcome-left h1 {
          font-size: 22px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .mt-welcome-left p {
          font-size: 13.5px;
          color: #64748B;
        }
        .mt-welcome-right {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }

        /* TABS BAR */
        .mt-tabs-bar {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 4px;
        }
        .mt-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mt-tab-btn:hover {
          background: #F8FAFC;
          color: #0D9488;
        }
        .mt-tab-btn.active {
          background: #0D9488;
          color: #FFFFFF;
          border-color: #0D9488;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
        }

        /* CARD & CONTROLS */
        .mt-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mt-card-top-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .mt-card-top-controls h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
        }
        .mt-section-subtitle {
          font-size: 13px;
          color: #64748B;
          margin-top: 2px;
        }
        .mt-controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mt-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 8px 14px;
          border-radius: 10px;
          width: 240px;
        }
        .mt-search-box input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 13px;
          color: #0F172A;
          width: 100%;
        }
        .mt-filter-select {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          color: #0F172A;
          outline: none;
          cursor: pointer;
        }
        .mt-refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #0F172A;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .mt-refresh-btn:hover {
          background: #E2E8F0;
        }

        /* TABLES */
        .mt-table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .mt-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }
        .mt-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 600;
          padding: 12px 14px;
          border-bottom: 1px solid #E2E8F0;
        }
        .mt-table td {
          padding: 14px;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
        }
        .mt-table tr:hover td {
          background: #FAFAFA;
        }
        .font-semibold { font-weight: 600; color: #0F172A; }
        .text-muted { color: #64748B; font-size: 13px; }
        .mt-empty-row {
          text-align: center;
          color: #64748B;
          padding: 30px !important;
          font-style: italic;
        }

        /* BUTTONS & BADGES */
        .mt-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #BFDBFE;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mt-action-btn:hover {
          background: #DBEAFE;
        }

        .mt-status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .mt-status-badge.active { background: #CCFBF1; color: #0F766E; }
        .mt-status-badge.pending { background: #FEF3C7; color: #B45309; }
        .mt-status-badge.upcoming { background: #EFF6FF; color: #1D4ED8; }
        .mt-status-badge.completed { background: #D1FAE5; color: #065F46; }
        .mt-status-badge.missed { background: #FEF3C7; color: #92400E; }
        .mt-status-badge.cancelled { background: #FEE2E2; color: #B91C1C; }

        .mt-enquiry-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .mt-enquiry-badge.new { background: #EFF6FF; color: #2563EB; }
        .mt-enquiry-badge.read { background: #F1F5F9; color: #475569; }
        .mt-enquiry-badge.replied { background: #D1FAE5; color: #047857; }

        /* PAGINATION */
        .mt-pagination-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid #E2E8F0;
        }
        .mt-pagination-info {
          font-size: 13px;
          color: #64748B;
        }
        .mt-pagination-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .mt-page-num, .mt-page-arrow {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #334155;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .mt-page-num.active {
          background: #0D9488;
          color: #FFFFFF;
          border-color: #0D9488;
        }
        .mt-page-num:hover:not(.active) {
          background: #F8FAFC;
        }
        .mt-page-arrow:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* MODALS */
        .mt-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 16px;
        }
        .mt-modal-card {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .mt-modal-card.enquiry-modal {
          max-width: 540px;
        }
        .mt-modal-header {
          padding: 20px 24px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mt-modal-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
        }
        .mt-modal-close {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
        }
        .mt-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mt-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
        }
        .mt-detail-label {
          color: #64748B;
          font-weight: 500;
        }
        .mt-detail-val {
          color: #0F172A;
        }
        .mt-admin-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #CCFBF1;
          color: #0F766E;
          padding: 12px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.4;
          margin-top: 6px;
        }
        .mt-admin-notice.view-only {
          background: #FEF3C7;
          color: #92400E;
        }
        .mt-message-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 14px;
          border-radius: 10px;
          margin-top: 4px;
        }

/* Enquiry Email Reply Section */
.mt-reply-section {
  margin-top: 24px;
  padding: 18px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mt-reply-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  background: #FFFFFF;
  color: #334155;
  box-sizing: border-box;
}

.mt-reply-textarea:focus {
  border-color: #0D9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.mt-reply-textarea:disabled {
  background: #F1F5F9;
  cursor: not-allowed;
}

.mt-reply-section .mt-btn-action-replied {
  align-self: flex-end;
}

.mt-reply-section .mt-btn-action-replied:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
 
        .mt-message-title {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 6px;
        }
        .mt-message-text {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.5;
        }
        .mt-modal-footer {
          padding: 16px 24px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: flex-end;
        }
        .mt-modal-footer.enquiry-footer {
          justify-content: space-between;
          align-items: center;
        }
        .mt-footer-action-left {
          display: flex;
          gap: 8px;
        }
        .mt-btn-secondary {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #334155;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .mt-btn-action-read {
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #BFDBFE;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .mt-btn-action-replied {
          background: #D1FAE5;
          color: #047857;
          border: 1px solid #A7F3D0;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }


                /* ==================================
           DARK MODE - ADMIN MANAGEMENT
        ================================== */

        html[data-theme="dark"] .mt-management-container {
          color: #E2E8F0;
        }

        /* Welcome banner and cards */
        html[data-theme="dark"] .mt-welcome-card,
        html[data-theme="dark"] .mt-card {
          background: #172B2B;
          border-color: #294343;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        html[data-theme="dark"] .mt-welcome-left h1,
        html[data-theme="dark"] .mt-card-top-controls h3 {
          color: #F1F5F9;
        }

        html[data-theme="dark"] .mt-welcome-left p,
        html[data-theme="dark"] .mt-section-subtitle,
        html[data-theme="dark"] .mt-pagination-info {
          color: #A7B8B8;
        }

        html[data-theme="dark"] .mt-welcome-right {
          background: #203838;
          border-color: #345050;
          color: #E2E8F0;
        }

        html[data-theme="dark"] .mt-shield-icon-wrap {
          background: #203F3B;
        }

        /* Tabs */
        html[data-theme="dark"] .mt-tabs-bar {
          border-color: #294343;
        }

        html[data-theme="dark"] .mt-tab-btn {
          background: #172B2B;
          border-color: #345050;
          color: #A7B8B8;
        }

        html[data-theme="dark"] .mt-tab-btn:hover {
          background: #203838;
          color: #5EEAD4;
        }

        html[data-theme="dark"] .mt-tab-btn.active {
          background: #0D9488;
          border-color: #0D9488;
          color: #FFFFFF;
        }

        /* Search, filters and refresh */
        html[data-theme="dark"] .mt-search-box,
        html[data-theme="dark"] .mt-filter-select,
        html[data-theme="dark"] .mt-refresh-btn {
          background: #203838;
          border-color: #345050;
          color: #E2E8F0;
        }

        html[data-theme="dark"] .mt-search-box input {
          color: #F1F5F9;
        }

        html[data-theme="dark"] .mt-search-box input::placeholder {
          color: #8FA5A5;
        }

        html[data-theme="dark"] .mt-filter-select option {
          background: #172B2B;
          color: #E2E8F0;
        }

        html[data-theme="dark"] .mt-refresh-btn:hover {
          background: #294343;
        }

        /* Tables */
        html[data-theme="dark"] .mt-table th {
          background: #203838;
          color: #A7B8B8;
          border-bottom-color: #345050;
        }

        html[data-theme="dark"] .mt-table td {
          color: #CBD5E1;
          border-bottom-color: #294343;
        }

        html[data-theme="dark"] .mt-table tr:hover td {
          background: #203838;
        }

        html[data-theme="dark"] .font-semibold {
          color: #F1F5F9;
        }

        html[data-theme="dark"] .text-muted {
          color: #A7B8B8;
        }

        html[data-theme="dark"] .mt-empty-row {
          color: #A7B8B8;
        }

        /* Pagination */
        html[data-theme="dark"] .mt-pagination-footer {
          border-top-color: #294343;
        }

        html[data-theme="dark"] .mt-page-num,
        html[data-theme="dark"] .mt-page-arrow {
          background: #203838;
          border-color: #345050;
          color: #CBD5E1;
        }

        html[data-theme="dark"] .mt-page-num:hover:not(.active) {
          background: #294343;
        }

        html[data-theme="dark"] .mt-page-num.active {
          background: #0D9488;
          border-color: #0D9488;
          color: #FFFFFF;
        }

        /* Modals */
        html[data-theme="dark"] .mt-modal-card {
          background: #172B2B;
        }

        html[data-theme="dark"] .mt-modal-header,
        html[data-theme="dark"] .mt-modal-footer {
          background: #203838;
          border-color: #345050;
        }

        html[data-theme="dark"] .mt-modal-header h3 {
          color: #F1F5F9;
        }

        html[data-theme="dark"] .mt-modal-close {
          color: #A7B8B8;
        }

        html[data-theme="dark"] .mt-detail-label,
        html[data-theme="dark"] .mt-message-title {
          color: #A7B8B8;
        }

        html[data-theme="dark"] .mt-detail-val,
        html[data-theme="dark"] .mt-message-text {
          color: #E2E8F0;
        }

        html[data-theme="dark"] .mt-message-box,
        html[data-theme="dark"] .mt-reply-section {
          background: #203838;
          border-color: #345050;
        }

        html[data-theme="dark"] .mt-reply-textarea {
          background: #102222;
          border-color: #456060;
          color: #F1F5F9;
        }

        html[data-theme="dark"] .mt-reply-textarea::placeholder {
          color: #8FA5A5;
        }

        html[data-theme="dark"] .mt-reply-textarea:disabled {
          background: #294343;
        }

        html[data-theme="dark"] .mt-btn-secondary {
          background: #203838;
          border-color: #456060;
          color: #E2E8F0;
        }

        html[data-theme="dark"] .mt-btn-secondary:hover {
          background: #294343;
        }


        @media (max-width: 768px) {
          .mt-card-top-controls {
            flex-direction: column;
            align-items: flex-start;
          }
          .mt-controls-right {
            width: 100%;
            flex-direction: column;
          }
          .mt-search-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}