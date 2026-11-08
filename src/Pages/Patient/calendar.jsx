import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Eye,
  Edit3,
  ArrowRight,
  Clock,
  Building2,
  User
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAppointmentDateKey = (date) => (date ? String(date).slice(0, 10) : '');

export default function AppointmentCalendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => getLocalDateString(new Date()));

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('You must be signed in to view your appointments.');

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true });

        if (error) throw error;
        if (isMounted) setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching calendar appointments:', error);
        if (isMounted) setLoadError(error.message || 'Unable to load appointments.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(getLocalDateString(today));
  };

  // Generate Calendar Grid Days
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarDays.push({ dayNum, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to fill grid (up to 35 or 42 cells)
  const totalCells = calendarDays.length <= 35 ? 35 : 42;
  const nextMonthDaysCount = totalCells - calendarDays.length;
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNum: i, dateStr, isCurrentMonth: false });
  }

  // Helper to get status dot color
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Upcoming': return '#087F6E'; // teal/blue
      case 'Completed': return '#16A34A'; // green
      case 'Cancelled': return '#DC2626'; // red
      case 'Missed': return '#D97706'; // orange
      default: return '#087F6E';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Upcoming': return 'badge-upcoming';
      case 'Completed': return 'badge-completed';
      case 'Cancelled': return 'badge-cancelled';
      case 'Missed': return 'badge-missed';
      default: return 'badge-upcoming';
    }
  };

  const selectedDateAppointments = appointments.filter(
    app => getAppointmentDateKey(app.appointment_date) === selectedDateStr
  );

  // Get next 3 upcoming appointments for bottom section
  const upcomingAppointments = appointments
    .filter(app => app.status === 'Upcoming')
    .sort((a, b) => getAppointmentDateKey(a.appointment_date).localeCompare(getAppointmentDateKey(b.appointment_date)))
    .slice(0, 3);

  // Format selected date display header e.g. "20 November 2026"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

   const formatShortDate = (dateString) => {
    if (!dateString) return { day: '', monthName: '' }; // <-- Guard clause prevents crash
    const [y, m, d] = dateString.split('-');
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.toLocaleDateString('en-GB', { day: 'numeric' });
    const monthName = dateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    return { day, monthName };
  };

  return (
    <div className="calendar-page-container">
      
      {/* PAGE HEADER */}
      <div className="page-header-section">
        <div>
          <h1 className="page-title">Appointment Calendar</h1>
          <p className="page-description">View and keep track of your scheduled hospital appointments.</p>
        </div>
        <Link to="/dashboard/appointments" className="btn-add-appointment">
          <Plus size={18} /> Add Appointment
        </Link>
      </div>

      {/* CALENDAR CONTROLS & LEGEND BAR */}
      <div className="calendar-controls-bar">
        <div className="calendar-nav-controls">
          <button onClick={handlePrevMonth} className="nav-arrow-btn" aria-label="Previous Month">
            <ChevronLeft size={20} />
          </button>
          <h2 className="current-month-title">{monthNames[month]} {year}</h2>
          <button onClick={handleNextMonth} className="nav-arrow-btn" aria-label="Next Month">
            <ChevronRight size={20} />
          </button>
          <button onClick={handleToday} className="btn-today">
            Today
          </button>
        </div>

        {/* STATUS LEGEND */}
        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-dot teal-dot"></span> Upcoming</div>
          <div className="legend-item"><span className="legend-dot green-dot"></span> Completed</div>
          <div className="legend-item"><span className="legend-dot red-dot"></span> Cancelled</div>
          <div className="legend-item"><span className="legend-dot orange-dot"></span> Missed</div>
        </div>
      </div>

      {loadError && <p className="calendar-error" role="alert">{loadError}</p>}

      {/* MAIN CONTENT SPLIT GRID (CALENDAR + DETAILS PANEL) */}
      <div className="calendar-content-grid">
        
        {/* LEFT: MONTHLY CALENDAR GRID */}
        <div className="calendar-card">
          <div className="weekday-header-row">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="calendar-days-grid">
            {calendarDays.map((cell, index) => {
              const dayAppointments = appointments.filter(
                app => getAppointmentDateKey(app.appointment_date) === cell.dateStr
              );
              const isSelected = cell.dateStr === selectedDateStr;
              const todayStr = getLocalDateString(new Date());
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`calendar-cell ${!cell.isCurrentMonth ? 'outside-month' : ''} ${isSelected ? 'selected-cell' : ''} ${isToday ? 'today-cell' : ''}`}
                >
                  <span className="cell-day-number">{cell.dayNum}</span>
                  
                  {/* APPOINTMENT DOTS */}
                  {dayAppointments.length > 0 && (
                    <div className="cell-indicators">
                      {dayAppointments.slice(0, 2).map((app, idx) => (
                        <span
                          key={idx}
                          className="appointment-dot"
                          style={{ backgroundColor: getStatusDotColor(app.status) }}
                          title={`${app.reason} (${app.status})`}
                        ></span>
                      ))}
                      {dayAppointments.length > 2 && (
                        <span className="more-indicator" title={`${dayAppointments.length - 2} more appointments`}>+more</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SELECTED DATE APPOINTMENTS PANEL */}
        <div className="selected-date-panel">
          <div className="panel-date-header">
            <CalendarIcon size={20} className="panel-calendar-icon" />
            <h3>{formatDisplayDate(selectedDateStr)}</h3>
          </div>

          <div className="panel-appointments-list">
            {loading ? (
              <p className="no-upcoming-text">Loading appointments...</p>
            ) : selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((app) => (
                <div key={app.id} className="panel-appointment-item">
                  <div className="panel-item-top">
                    <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <h4 className="panel-app-reason">{app.reason}</h4>
                  
                  <div className="panel-meta-row">
                    <Building2 size={15} className="meta-icon" />
                    <span>{app.facility_name}</span>
                  </div>

                  <div className="panel-meta-row">
                    <User size={15} className="meta-icon" />
                    <span>{app.doctor_name || 'General Doctor'} ({app.department || 'General'})</span>
                  </div>

                  <div className="panel-meta-row">
                    <Clock size={15} className="meta-icon" />
                    <span>{app.appointment_time}</span>
                  </div>

                  <div className="panel-action-buttons">
                    <button
                      onClick={() => navigate('/dashboard/appointments')}
                      className="btn-panel-action view-action"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/appointments')}
                      className="btn-panel-action edit-action"
                    >
                      <Edit3 size={14} /> Edit Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="panel-empty-state">
                <CalendarIcon size={40} className="empty-icon" />
                <p>No appointments scheduled for this date.</p>
                <button
                  onClick={() => navigate('/dashboard/appointments')}
                  className="btn-schedule-prompt"
                >
                  Record Appointment
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: UPCOMING APPOINTMENTS */}
      <div className="upcoming-section-card">
        <div className="card-header-flex">
          <div className="header-title-group">
            <div className="header-icon-box">
              <CalendarIcon size={20} />
            </div>
            <h2>Upcoming Appointments</h2>
          </div>
          <Link to="/dashboard/appointments" className="view-all-link">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="upcoming-cards-grid">
          {loading ? (
            <p className="no-upcoming-text">Loading appointments...</p>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((app) => {
              const { day, monthName } = formatShortDate(getAppointmentDateKey(app.appointment_date));
              return (
                <div key={app.id} className="upcoming-item-card">
                  <div className="upcoming-date-badge">
                    <span className="up-day">{day}</span>
                    <span className="up-month">{monthName}</span>
                  </div>
                  <div className="upcoming-details">
                    <h4>{app.reason}</h4>
                    <span>{app.facility_name} • {app.appointment_time}</span>
                  </div>
                  <span className="status-badge badge-upcoming">
                    {app.status}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="no-upcoming-text">No upcoming appointments found.</p>
          )}
        </div>
      </div>

      {/* INTERNAL STYLES */}
      <style>{`
        .calendar-page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1300px;
          margin: 0 auto;
        }

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

        .btn-add-appointment {
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
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s ease;
        }
        .btn-add-appointment:hover {
          background: #066658;
        }

        /* CONTROLS BAR */
        .calendar-controls-bar {
          background: #FFFFFF;
          padding: 16px 24px;
          border-radius: 16px;
          border: 1px solid #E1F0EE;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(8, 127, 110, 0.03);
          flex-wrap: wrap;
          gap: 16px;
        }

        .calendar-error {
          margin: -8px 0 0;
          padding: 12px 16px;
          border: 1px solid #FECACA;
          border-radius: 12px;
          background: #FEF2F2;
          color: #B91C1C;
          font-size: 14px;
        }

        .calendar-nav-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-arrow-btn {
          width: 36px;
          height: 36px;
          background: #F4FAF9;
          border: 1px solid #D4F3EE;
          border-radius: 10px;
          color: #087F6E;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .nav-arrow-btn:hover {
          background: #E8F8F5;
        }

        .current-month-title {
          font-size: 16px;
          font-weight: 800;
          color: #0F2926;
          min-width: 150px;
          text-align: center;
        }

        .btn-today {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .calendar-legend {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: #4A6360;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .teal-dot { background: #087F6E; }
        .green-dot { background: #16A34A; }
        .red-dot { background: #DC2626; }
        .orange-dot { background: #D97706; }

        /* CONTENT GRID */
        .calendar-content-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr;
          gap: 24px;
        }

        /* CALENDAR CARD */
        .calendar-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .weekday-header-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 10px;
        }

        .calendar-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .calendar-cell {
          aspect-ratio: 1;
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .calendar-cell:hover {
          border-color: #087F6E;
          background: #E8F8F5;
        }

        .calendar-cell.outside-month {
          opacity: 0.35;
          background: #FFFFFF;
        }

        .calendar-cell.today-cell {
          border-color: #087F6E;
          background: #F4FAF9;
        }

        .calendar-cell.selected-cell {
          background: #087F6E !important;
          color: #FFFFFF !important;
          border-color: #087F6E !important;
        }
        .calendar-cell.selected-cell .cell-day-number {
          color: #FFFFFF;
        }

        .cell-day-number {
          font-size: 12px;
          font-weight: 700;
          color: #0F2926;
        }

        .cell-indicators {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-wrap: wrap;
        }

        .appointment-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .more-indicator {
          font-size: 8px;
          font-weight: 700;
          color: #087F6E;
          background: #E8F8F5;
          padding: 1px 2px;
          border-radius: 3px;
        }

        /* SELECTED DATE PANEL */
        .selected-date-panel {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-date-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 12px;
          color: #087F6E;
        }
        .panel-date-header h3 {
          font-size: 15px;
          font-weight: 800;
          color: #0F2926;
        }

        .panel-appointments-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          max-height: 450px;
        }

        .panel-appointment-item {
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .panel-item-top {
          display: flex;
          justify-content: flex-end;
        }

        .panel-app-reason {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
        }

        .panel-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4A6360;
        }
        .meta-icon {
          color: #087F6E;
          flex-shrink: 0;
        }

        .panel-action-buttons {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          padding-top: 8px;
          border-top: 1px solid #E2E8F0;
        }

        .btn-panel-action {
          flex: 1;
          padding: 6px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          text-decoration: none;
        }
        .view-action { background: #E8F8F5; color: #087F6E; }
        .edit-action { background: #E0F2FE; color: #0284C7; }

        .panel-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 10px;
          color: #64748B;
          gap: 10px;
        }
        .empty-icon { color: #CBD5E1; }
        .btn-schedule-prompt {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* UPCOMING SECTION */
        .upcoming-section-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-icon-box {
          width: 34px;
          height: 34px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-header-flex h2 {
          font-size: 16px;
          font-weight: 800;
          color: #0F2926;
        }

        .view-all-link {
          font-size: 12px;
          font-weight: 700;
          color: #087F6E;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .upcoming-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .upcoming-item-card {
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .upcoming-date-badge {
          background: #087F6E;
          color: #FFFFFF;
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 48px;
        }
        .up-day { font-size: 16px; font-weight: 800; line-height: 1; }
        .up-month { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; }

        .upcoming-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }
        .upcoming-details h4 { font-size: 13px; font-weight: 800; color: #0F2926; }
        .upcoming-details span { font-size: 11px; color: #64748B; }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-upcoming { background: #E8F8F5; color: #087F6E; }
        .badge-completed { background: #DCFCE7; color: #15803D; }
        .badge-cancelled { background: #FEE2E2; color: #DC2626; }
        .badge-missed { background: #FEF3C7; color: #D97706; }

        /* RESPONSIVE MOBILE MEDIA QUERY FIXES */
        @media (max-width: 992px) {
          .page-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
          }
          .btn-add-appointment {
            width: 100%;
            justify-content: center;
          }
          .calendar-controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .calendar-nav-controls {
            justify-content: space-between;
          }
          .calendar-content-grid {
            grid-template-columns: 1fr;
          }
          .upcoming-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}