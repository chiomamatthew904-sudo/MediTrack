import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Patient Profile Information state
  const [profile, setProfile] = useState({
    fullName: 'Matthew Chioma Maryann',
    email: 'matthew.chioma@unn.edu.ng',
    phone: '080 1234 5678',
    dateOfBirth: '15 January 2000',
    gender: 'Male',
    avatar: null, // Temporary image preview URL
    role: 'Patient',
    memberSince: 'Nov 2026',
    status: 'Active'
  });

  const updateProfile = (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}