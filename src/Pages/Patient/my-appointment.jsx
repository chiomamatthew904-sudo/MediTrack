import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  X,
  Bell,
  Bot,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

// IMPORT SUPABASE CLIENT
import { supabase } from '../../supabaseClient';
import { useAppointments } from '../../context/appointmentcontext';

export default function MyAppointments() {
  const { appointments, setAppointments } = useAppointments();
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form State matching database column mappings
  const [formData, setFormData] = useState({
    facility_name: '',
    doctor_name: '',
    department: '',
    reason: '',
    appointment_date: '',
    appointment_time: '',
    facility_address: '',
    reminder_preference: '1 day before',
    notes: ''
  });

  // Fetch appointments from Supabase on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error.message);
      } else {
        // Clean and normalize dates to YYYY-MM-DD format
        const cleanedData = (data || []).map(app => ({
          ...app,
          appointment_date: app.appointment_date ? app.appointment_date.split('T')[0] : app.appointment_date
        }));
        setAppointments(cleanedData);
      }
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Summary Counts
  const totalCount = appointments.length;
  const upcomingCount = appointments.filter(a => a.status && a.status.toLowerCase() === 'upcoming').length;
  const completedCount = appointments.filter(a => a.status && a.status.toLowerCase() === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status && (a.status.toLowerCase().includes('cancelled') || a.status.toLowerCase().includes('missed'))).length;

  // Filter Logic with flexible status matching
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      (app.facility_name && app.facility_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.doctor_name && app.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.reason && app.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.department && app.department.toLowerCase().includes(searchQuery.toLowerCase()));

    // Flexible status match using includes to prevent strict mismatch issues
    const matchesStatus =
      statusFilter === 'All' || 
      (app.status && app.status.toLowerCase().includes(statusFilter.toLowerCase()));

    let matchesDate = true;
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (dateFilter === 'Today') {
      matchesDate = app.appointment_date === todayStr;
    } else if (dateFilter === 'This Week') {
      matchesDate = app.appointment_date >= todayStr;
    } else if (dateFilter === 'This Month') {
      const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g. "2026-11"
      matchesDate = app.appointment_date && app.appointment_date.startsWith(currentMonthPrefix);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      facility_name: '',
      doctor_name: '',
      department: '',
      reason: '',
      appointment_date: '',
      appointment_time: '',
      facility_address: '',
      reminder_preference: '1 day before',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewAppointment = async (e) => {
    e.preventDefault();
    if (!formData.facility_name || !formData.reason || !formData.appointment_date || !formData.appointment_time) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to add an appointment.');
        return;
      }

      const newAppRecord = {
        user_id: user.id,
        facility_name: formData.facility_name,
        doctor_name: formData.doctor_name,
        department: formData.department,
        reason: formData.reason,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        facility_address: formData.facility_address,
        reminder_preference: formData.reminder_preference,
        notes: formData.notes,
        status: 'Upcoming'
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppRecord])
        .select();

      if (error) {
        console.error('Error adding appointment:', error.message);
        alert('Failed to save appointment: ' + error.message);
      } else if (data) {
        const formattedNewApp = {
          ...data[0],
          appointment_date: data[0].appointment_date ? data[0].appointment_date.split('T')[0] : data[0].appointment_date
        };
        setAppointments(prev => [formattedNewApp, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Unexpected error saving appointment:', err);
    }
  };

  const handleOpenViewModal = (app) => {
    setSelectedAppointment(app);
    setIsViewModalOpen(true);
  };

 const handleOpenEditModal = (app) => {
    setSelectedAppointment(app);
    setFormData({
      facility_name: app.facility_name || '',
      doctor_name: app.doctor_name || '',
      department: app.department || '',
      reason: app.reason || '',
      appointment_date: app.appointment_date || '',
      appointment_time: app.appointment_time || '',
      facility_address: app.facility_address || '',
      reminder_preference: app.reminder_preference || '1 day before',
      notes: app.notes || ''
    });
    setIsViewModalOpen(false); // <-- Close view modal
    setIsEditModalOpen(true);  // <-- Open edit modal
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          facility_name: formData.facility_name,
          doctor_name: formData.doctor_name,
          department: formData.department,
          reason: formData.reason,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          facility_address: formData.facility_address,
          reminder_preference: formData.reminder_preference,
          notes: formData.notes
        })
        .eq('id', selectedAppointment.id)
        .select();

      if (error) {
        console.error('Error updating appointment:', error.message);
        alert('Failed to update: ' + error.message);
      } else if (data) {
        const updatedApp = {
          ...data[0],
          appointment_date: data[0].appointment_date ? data[0].appointment_date.split('T')[0] : data[0].appointment_date
        };
        setAppointments(prev => prev.map(item => item.id === selectedAppointment.id ? updatedApp : item));
        setIsEditModalOpen(false);
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error('Unexpected error updating appointment:', err);
    }
  };

  const handleOpenCancelConfirm = (app) => {
    setSelectedAppointment(app);
    setIsCancelConfirmOpen(true);
  };

  const confirmCancellation = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', selectedAppointment.id)
        .select();

      if (error) {
        console.error('Error cancelling appointment:', error.message);
        alert('Failed to cancel: ' + error.message);
      } else if (data) {
        const cancelledApp = {
          ...data[0],
          appointment_date: data[0].appointment_date ? data[0].appointment_date.split('T')[0] : data[0].appointment_date
        };
        setAppointments(prev => prev.map(item => item.id === selectedAppointment.id ? cancelledApp : item));
        setIsCancelConfirmOpen(false);
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error('Unexpected error cancelling appointment:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-upcoming';
    const lower = status.toLowerCase();
    if (lower.includes('completed')) return 'badge-completed';
    if (lower.includes('cancelled')) return 'badge-cancelled';
    if (lower.includes('missed')) return 'badge-missed';
    return 'badge-upcoming';
  };

  return (
    <div className="appointments-page-container">
      <div className="page-header-section">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-description">Manage and keep track of your hospital appointments.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-add-appointment">
          <Plus size={18} /> Add New Appointment
        </button>
      </div>

      <div className="summary-cards-grid">
        <div className="summary-card">
          <div className="summary-icon-box teal-bg"><CalendarDays size={22} /></div>
          <div className="summary-data"><h3>{totalCount}</h3><span>Total Appointments</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-box mint-bg"><Calendar size={22} /></div>
          <div className="summary-data"><h3>{upcomingCount}</h3><span>Upcoming</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-box green-bg"><CheckCircle2 size={22} /></div>
          <div className="summary-data"><h3>{completedCount}</h3><span>Completed</span></div>
        </div>
        <div className="summary-card">
          <div className="summary-icon-box red-bg"><XCircle size={22} /></div>
          <div className="summary-data"><h3>{cancelledCount}</h3><span>Cancelled / Missed</span></div>
        </div>
      </div>

      <div className="filter-search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by hospital, doctor or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-field"
          />
        </div>
        <div className="filter-dropdowns-group">
          <div className="filter-select-wrapper">
            <Filter size={16} className="filter-icon" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
          <div className="filter-select-wrapper">
            <Calendar size={16} className="filter-icon" />
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="filter-select">
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="appointments-table-card">
        <div className="table-responsive-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Hospital / Clinic</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-records-cell">Loading appointments from database...</td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="table-datetime">
                        <span className="app-date">{app.appointment_date}</span>
                        <span className="app-time">{app.appointment_time}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-hospital">
                        <strong>{app.facility_name}</strong>
                        {app.facility_address && <small>{app.facility_address}</small>}
                      </div>
                    </td>
                    <td>{app.doctor_name || '—'}</td>
                    <td>{app.department || 'General'}</td>
                    <td className="reason-cell">{app.reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button onClick={() => handleOpenViewModal(app)} className="action-btn view-btn" title="View Details">
                          <Eye size={16} />
                        </button>
                        {app.status && app.status.toLowerCase() === 'upcoming' && (
                          <>
                            <button onClick={() => handleOpenEditModal(app)} className="action-btn edit-btn" title="Edit">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleOpenCancelConfirm(app)} className="action-btn cancel-btn" title="Cancel">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-records-cell">No appointments found matching your search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bottom-sections-grid">
        <div className="bottom-promo-card reminders-promo">
          <div className="promo-icon-circle"><Bell size={24} /></div>
          <div className="promo-content">
            <h3>Set Your Reminders</h3>
            <p>Never miss a hospital follow-up. Customize notification preferences for your appointments.</p>
          </div>
          <Link to="/dashboard/calendar" className="btn-promo-action">Manage Reminders <ArrowRight size={16} /></Link>
        </div>
        <div className="bottom-promo-card help-promo">
          <div className="promo-icon-circle bot-circle"><Bot size={24} /></div>
          <div className="promo-content">
            <h3>Need Help?</h3>
            <p>Chat with our AI Assistant for instant guidance on navigating MediTrack.</p>
          </div>
          <Link to="/dashboard/assistant" className="btn-promo-action">Open AI Assistant <ArrowRight size={16} /></Link>
        </div>
      </div>

      {/* MODALS */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New Appointment</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="close-modal-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveNewAppointment} className="modal-form">
              <p className="modal-subtitle">Record a follow-up appointment prescribed by your doctor.</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Hospital/Clinic Name *</label>
                  <input type="text" name="facility_name" placeholder="e.g., City Wellness Hospital" value={formData.facility_name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Doctor's Name</label>
                  <input type="text" name="doctor_name" placeholder="e.g., Dr. Samuel Vance" value={formData.doctor_name} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department / Specialty</label>
                  <input type="text" name="department" placeholder="e.g., Cardiology" value={formData.department} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Appointment Reason *</label>
                  <input type="text" name="reason" placeholder="e.g., Blood Pressure Review" value={formData.reason} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Appointment Time *</label>
                  <input type="text" name="appointment_time" placeholder="e.g., 10:00 AM" value={formData.appointment_time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Hospital Address</label>
                <input type="text" name="facility_address" placeholder="e.g., 123 Health Way, Lagos" value={formData.facility_address} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Reminder Preference *</label>
                  <select name="reminder_preference" value={formData.reminder_preference} onChange={handleInputChange}>
                    <option value="1 day before">1 day before</option>
                    <option value="2 days before">2 days before</option>
                    <option value="1 week before">1 week before</option>
                    <option value="On the appointment day">On the appointment day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <input type="text" name="notes" placeholder="e.g., Fasting required" value={formData.notes} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedAppointment && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="close-modal-btn"><X size={20} /></button>
            </div>
            <div className="details-modal-body">
              <div className="detail-status-banner">
                <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`}>{selectedAppointment.status}</span>
                <span className="detail-date-badge">{selectedAppointment.appointment_date} at {selectedAppointment.appointment_time}</span>
              </div>
              <div className="detail-grid">
                <div className="detail-item"><span className="detail-label">Hospital / Clinic</span><span className="detail-value">{selectedAppointment.facility_name}</span></div>
                <div className="detail-item"><span className="detail-label">Doctor</span><span className="detail-value">{selectedAppointment.doctor_name || 'Not specified'}</span></div>
                <div className="detail-item"><span className="detail-label">Department</span><span className="detail-value">{selectedAppointment.department || 'General'}</span></div>
                <div className="detail-item"><span className="detail-label">Reason</span><span className="detail-value">{selectedAppointment.reason}</span></div>
                <div className="detail-item"><span className="detail-label">Hospital Address</span><span className="detail-value">{selectedAppointment.facility_address || 'No address recorded'}</span></div>
                <div className="detail-item"><span className="detail-label">Reminder Preference</span><span className="detail-value">{selectedAppointment.reminder_preference}</span></div>
              </div>
              {selectedAppointment.notes && (
                <div className="detail-notes-box">
                  <strong>Additional Notes:</strong>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}
              <div className="modal-footer">
                <button onClick={() => setIsViewModalOpen(false)} className="btn-primary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAppointment && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Appointment</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="close-modal-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateAppointment} className="modal-form">
              <p className="modal-subtitle">Update your recorded appointment information.</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Hospital/Clinic Name *</label>
                  <input type="text" name="facility_name" value={formData.facility_name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Doctor's Name</label>
                  <input type="text" name="doctor_name" value={formData.doctor_name} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department / Specialty</label>
                  <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Appointment Reason *</label>
                  <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Appointment Time *</label>
                  <input type="text" name="appointment_time" value={formData.appointment_time} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Hospital Address</label>
                <input type="text" name="facility_address" value={formData.facility_address} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Reminder Preference *</label>
                  <select name="reminder_preference" value={formData.reminder_preference} onChange={handleInputChange}>
                    <option value="1 day before">1 day before</option>
                    <option value="2 days before">2 days before</option>
                    <option value="1 week before">1 week before</option>
                    <option value="On the appointment day">On the appointment day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCancelConfirmOpen && selectedAppointment && (
        <div className="modal-backdrop">
          <div className="modal-container confirm-modal">
            <div className="confirm-icon-box"><AlertTriangle size={32} /></div>
            <h2>Cancel Appointment?</h2>
            <p>Are you sure you want to cancel your appointment at <strong>{selectedAppointment.facility_name}</strong> on {selectedAppointment.appointment_date}?</p>
            <div className="modal-footer center-footer">
              <button onClick={() => setIsCancelConfirmOpen(false)} className="btn-secondary">Keep Appointment</button>
              <button onClick={confirmCancellation} className="btn-danger">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .appointments-page-container { display: flex; flex-direction: column; gap: 24px; max-width: 1300px; margin: 0 auto; }
        .page-header-section { display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; padding: 24px 32px; border-radius: 20px; border: 1px solid #E1F0EE; box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05); }
        .page-title { font-size: 26px; font-weight: 800; color: #0F2926; margin-bottom: 4px; letter-spacing: -0.02em; }
        .page-description { font-size: 14px; color: #4A6360; }
        .btn-add-appointment { background: #087F6E; color: #FFFFFF; border: none; padding: 12px 20px; border-radius: 14px; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s ease; white-space: nowrap; }
        .btn-add-appointment:hover { background: #066658; }
        .summary-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .summary-card { background: #FFFFFF; padding: 20px; border-radius: 18px; display: flex; align-items: center; gap: 16px; border: 1px solid #E1F0EE; box-shadow: 0 4px 15px rgba(8, 127, 110, 0.04); }
        .summary-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .teal-bg { background: #E8F8F5; color: #087F6E; }
        .mint-bg { background: #F0FDF4; color: #16A34A; }
        .green-bg { background: #DCFCE7; color: #15803D; }
        .red-bg { background: #FEE2E2; color: #DC2626; }
        .summary-data h3 { font-size: 24px; font-weight: 800; color: #0F2926; }
        .summary-data span { font-size: 12px; color: #64748B; font-weight: 600; }
        .filter-search-container { background: #FFFFFF; padding: 18px 24px; border-radius: 16px; border: 1px solid #E1F0EE; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .search-input-wrapper { position: relative; flex: 1; max-width: 450px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #64748B; }
        .search-input-field { width: 100%; padding: 10px 14px 10px 42px; border: 1px solid #CBD5E1; border-radius: 10px; font-size: 14px; outline: none; background: #F8FCFC; color: #0F2926; }
        .search-input-field:focus { border-color: #087F6E; background: #FFFFFF; }
        .filter-dropdowns-group { display: flex; align-items: center; gap: 12px; }
        .filter-select-wrapper { position: relative; display: flex; align-items: center; }
        .filter-icon { position: absolute; left: 12px; color: #64748B; pointer-events: none; }
        .filter-select { padding: 10px 14px 10px 36px; border: 1px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 600; color: #0F2926; background: #F8FCFC; outline: none; cursor: pointer; }
        .appointments-table-card { background: #FFFFFF; border-radius: 20px; border: 1px solid #E1F0EE; box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05); overflow: hidden; }
        .table-responsive-wrapper { overflow-x: auto; }
        .appointments-table { width: 100%; border-collapse: collapse; text-align: left; }
        .appointments-table th { background: #F4FAF9; padding: 16px 20px; font-size: 12px; font-weight: 700; color: #4A6360; text-transform: uppercase; border-bottom: 1px solid #E1F0EE; }
        .appointments-table td { padding: 16px 20px; font-size: 14px; color: #0F2926; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
        .appointments-table tbody tr:hover { background: #F8FCFC; }
        .table-datetime { display: flex; flex-direction: column; }
        .app-date { font-weight: 700; color: #0F2926; }
        .app-time { font-size: 12px; color: #64748B; }
        .table-hospital { display: flex; flex-direction: column; }
        .table-hospital small { font-size: 11px; color: #64748B; }
        .reason-cell { max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .badge-upcoming { background: #E8F8F5; color: #087F6E; }
        .badge-completed { background: #DCFCE7; color: #15803D; }
        .badge-cancelled { background: #FEE2E2; color: #DC2626; }
        .badge-missed { background: #FEF3C7; color: #D97706; }
        .action-buttons-group { display: flex; align-items: center; gap: 8px; }
        .action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease; }
        .view-btn { background: #F1F5F9; color: #475569; }
        .view-btn:hover { background: #E2E8F0; }
        .edit-btn { background: #E0F2FE; color: #0284C7; }
        .edit-btn:hover { background: #BAE6FD; }
        .cancel-btn { background: #FEE2E2; color: #DC2626; }
        .cancel-btn:hover { background: #FECACA; }
        .no-records-cell { text-align: center; padding: 32px; color: #64748B; font-style: italic; }
        .bottom-sections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
        .bottom-promo-card { background: #FFFFFF; border-radius: 20px; padding: 24px; border: 1px solid #E1F0EE; box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05); display: flex; flex-direction: column; justify-content: space-between; }
        .promo-icon-circle { width: 48px; height: 48px; background: #E8F8F5; color: #087F6E; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .bot-circle { background: #E0F2FE; color: #0284C7; }
        .promo-content h3 { font-size: 18px; font-weight: 700; color: #0F2926; margin-bottom: 6px; }
        .promo-content p { font-size: 13px; color: #4A6360; margin-bottom: 16px; line-height: 1.5; }
        .btn-promo-action { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: #087F6E; text-decoration: none; transition: gap 0.2s ease; }
        .btn-promo-action:hover { gap: 10px; }
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 41, 38, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-container {
          background: #FFFFFF;
          width: 100%;
          max-width: 600px;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .modal-header h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0F2926;
        }
        .close-modal-btn {
          background: #F1F5F9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
        }
        .modal-form {
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
        .form-group input, .form-group select {
          padding: 10px 14px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          color: #0F2926;
          background: #F8FCFC;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: #087F6E;
          background: #FFFFFF;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-secondary {
          background: #F1F5F9;
          color: #475569;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-primary {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: #066658;
        }
      `}</style>
    </div>
  );
}