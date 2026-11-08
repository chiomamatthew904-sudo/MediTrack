import React, { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      facility_name: 'St. Nicholas Hospital',
      doctor_name: 'Dr. Chioma Nnamani',
      department: 'Endocrinology',
      reason: 'Quarterly Diabetics & HbA1c Follow-up',
      appointment_date: '2026-11-10',
      appointment_time: '14:30:00',
      facility_address: '57 Campbell St, Lagos Island, Lagos',
      reminder_preference: '1 day before',
      notes: 'Bring Previous lab result printouts',
      status: 'Upcoming'
    },
    {
      id: 2,
      facility_name: 'Lagos State University Teaching Hospital (LASUTH)',
      doctor_name: 'Dr. Adetokunbo Fabamwo',
      department: 'Obstetrics & Gynecology',
      reason: 'Post-Consultation Ultrasound Scan',
      appointment_date: '2026-11-06',
      appointment_time: '02:00:00',
      facility_address: '1-5 Oba Akinjobi way, Ikeja, Lagos',
      reminder_preference: '2 days before',
      notes: 'Follow-up appointment scheduled',
      status: 'Upcoming'
    },
    {
      id: 3,
      facility_name: 'Eko Hospital',
      doctor_name: 'Dr. Sonny KuKu',
      department: 'Cardiology',
      reason: 'Routine Blood Pressure Review',
      appointment_date: '2026-11-15',
      appointment_time: '10:00:00',
      facility_address: '31 Mobolaji Bank Anthony Way, Ikeja, Lagos',
      reminder_preference: '1 day before',
      notes: 'Patient completed routine blood pressure check',
      status: 'Completed'
    },
    {
      id: 4,
      facility_name: 'St. Nicholas Hospital',
      doctor_name: 'Dr. Ebun Bamgboye',
      department: 'Nephrology / Internal Medicine',
      reason: 'Routine Kidney Function & Serum Creatinine Review',
      appointment_date: '2026-11-02',
      appointment_time: '09:30:00',
      facility_address: '57 Campbell St, Lagos Island, Lagos',
      reminder_preference: 'On the appointment day',
      notes: 'Patient missed scheduled checkup',
      status: 'Missed'
    },
    {
      id: 5,
      facility_name: 'Bishop Shanahan Hospital',
      doctor_name: 'Dr. Chukwuemeka Eze',
      department: 'Pediatrics',
      reason: 'Routine Post-Consultation Follow-up & Lab Review',
      appointment_date: '2026-11-04',
      appointment_time: '11:00:00',
      facility_address: '9 Enugu Road, Odenigwe, Nsukka, Enugu State',
      reminder_preference: '1 day before',
      notes: 'Missed appointment due to unexpected travel schedule.',
      status: 'Cancelled'
    },
    {
      hospital_name: 'National Hospital Abuja',
      doctor_name: 'Dr. Aminu Bello',
      department: 'Cardiology',
      reason: 'Urgent Blood Pressure & Medication Check',
      appointment_date: '2026-11-06',
      appointment_time: '14:30:00',
      facility_address: 'Independence Avenue, Central Business District, Abuja',
      reminder_preference: 'On the appointment day',
      notes: 'Patient requested a same-day reminder test.',
      status: 'Upcoming'
    }
  ]);

  const addAppointment = (newAppData) => {
    const newApp = {
      id: Date.now(),
      ...newAppData,
      status: 'Upcoming'
    };
    setAppointments((prev) => [newApp, ...prev]);
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updatedData } : app))
    );
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Cancelled' } : app))
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        setAppointments,
        addAppointment,
        updateAppointment,
        cancelAppointment
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentContext);
}