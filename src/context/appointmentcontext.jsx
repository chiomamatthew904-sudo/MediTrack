
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { supabase } from '../supabaseClient';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the authenticated patient's appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setAppointments([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (fetchError) throw fetchError;

      const cleanedData = (data || []).map((app) => ({
        ...app,
        appointment_date: app.appointment_date
          ? app.appointment_date.split('T')[0]
          : app.appointment_date
      }));

      setAppointments(cleanedData);

    } catch (err) {
      console.error('Error fetching appointments:', err.message);
      setError('Unable to load appointments.');

    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when the patient signs in
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        timeoutId = setTimeout(() => {
          if (isMounted && session) {
            fetchAppointments();
          } else if (isMounted) {
            setAppointments([]);
            setLoading(false);
          }
        }, 0);
      }

      if (event === 'SIGNED_OUT') {
        setAppointments([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Add appointment to shared state
  const addAppointment = (newApp) => {
    setAppointments((prev) => [newApp, ...prev]);
  };

  // Update appointment in shared state
  const updateAppointment = (id, updatedData) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...updatedData } : app
      )
    );
  };

  // Cancel appointment in shared state
  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'cancelled' }
          : app
      )
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        setAppointments,
        loading,
        error,
        fetchAppointments,
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
