
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { supabase } from '../supabaseClient';

const ProfileContext = createContext(null);

const emptyProfile = {
  id: null,
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  avatar: null,
  role: 'Patient',
  memberSince: '',
  status: null,
  theme: 'light'
};

function formatProfile(data, user) {
  return {
    id: data?.id || user.id,
    fullName:
      data?.full_name ||
      user.user_metadata?.full_name ||
      '',
    email: user.email || data?.email || '',
    phone: data?.phone || '',
    dateOfBirth: data?.date_of_birth || '',
    gender: data?.gender || '',
    avatar: data?.avatar_url || null,
    role: data?.role || 'Patient',
    memberSince: data?.created_at
      ? new Date(data.created_at).toLocaleDateString('en-NG', {
          month: 'short',
          year: 'numeric'
        })
      : '',
    theme: data?.theme || 'light',
    status: null
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // Apply the saved theme across the entire application
useEffect(() => {
  // Wait until the user's profile has finished loading
  if (loading) return;

  // Use the account's saved theme when logged in.
  // When logged out, use the last saved theme from this browser.
  const savedTheme = user
    ? profile.theme
    : localStorage.getItem('meditrack-theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);

  // Remember the most recently selected theme on this device
  if (user) {
    localStorage.setItem('meditrack-theme', savedTheme);
  }
}, [profile.theme, user, loading]);


  // Fetch the logged-in user's profile
  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setProfile(emptyProfile);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // Clear the previous user's profile data
    // before loading the newly authenticated user's profile
      setProfile(emptyProfile);

      setUser(currentUser);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(
          'id, full_name, email, phone, role, created_at, date_of_birth, gender, avatar_url, theme'
        )
        .eq('id', currentUser.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setProfile(formatProfile(data, currentUser));
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile information.');
      setProfile(emptyProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for login and logout changes
  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      await fetchProfile(data.session?.user || null);
    };

    loadCurrentUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(emptyProfile);
        setError('');
        setLoading(false);
        return;
      }

      if (session?.user) {
        Promise.resolve().then(() => {
          if (mounted) {
            fetchProfile(session.user);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Update the patient's profile information
  const updateProfile = async (updatedFields) => {
    try {
      setError('');

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const currentUser = authData.user;

      if (!currentUser) {
        throw new Error('No authenticated user found.');
      }

      const dbUpdates = {};

      if (updatedFields.fullName !== undefined) {
        const fullName = updatedFields.fullName.trim();

        if (!fullName) {
          throw new Error('Full name cannot be empty.');
        }

        dbUpdates.full_name = fullName;
      }

      if (updatedFields.phone !== undefined) {
        dbUpdates.phone = updatedFields.phone.trim();
      }

      if (updatedFields.dateOfBirth !== undefined) {
        dbUpdates.date_of_birth = updatedFields.dateOfBirth || null;
      }

      if (updatedFields.gender !== undefined) {
        dbUpdates.gender = updatedFields.gender || null;
      }

      if (Object.keys(dbUpdates).length === 0) {
        return { success: true };
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', currentUser.id)
        .select(
          'id, full_name, email, phone, role, created_at, date_of_birth, gender, avatar_url, theme'
        )
        .single();

      if (updateError) throw updateError;

      setUser(currentUser);
      setProfile(formatProfile(data, currentUser));

      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Upload and save the patient's profile picture
  const uploadAvatar = async (file) => {
    try {
      setError('');

      if (!file) {
        throw new Error('Please select an image first.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must not exceed 5 MB.');
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const currentUser = authData.user;

      if (!currentUser) {
        throw new Error('No authenticated user found.');
      }

      // Each patient has a separate folder in Storage
      const filePath = `${currentUser.id}/avatar`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      // Save the image URL to this patient's profile
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', currentUser.id)
        .select(
          'id, full_name, email, phone, role, created_at, date_of_birth, gender, avatar_url, theme'
        )
        .single();

      if (updateError) throw updateError;

      setUser(currentUser);
      setProfile(formatProfile(data, currentUser));

      return {
        success: true,
        avatarUrl
      };
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.message || 'Failed to upload profile picture.');

      return {
        success: false,
        error: err.message
      };
    }
  };


  // Update and save the user's preferred theme
const updateTheme = async (newTheme) => {
  try {
    setError('');

    if (!['light', 'dark'].includes(newTheme)) {
      throw new Error('Invalid theme selected.');
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;

    const currentUser = authData.user;

    if (!currentUser) {
      throw new Error('No authenticated user found.');
    }

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ theme: newTheme })
      .eq('id', currentUser.id)
      .select(
        'id, full_name, email, phone, role, created_at, date_of_birth, gender, avatar_url, theme'
      )
      .single();

    if (updateError) throw updateError;

    setUser(currentUser);
    setProfile(formatProfile(data, currentUser));

    return { success: true };
  } catch (err) {
    console.error('Error updating theme:', err);
    setError(err.message || 'Failed to update theme.');

    return { success: false, error: err.message };
  }
};



// Update the patient's password through Supabase Auth
const updatePassword = async (currentPassword, newPassword) => {
  try {
    setError('');

    if (!user?.email) {
      throw new Error('No authenticated user found.');
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
      current_Password: currentPassword
    });

    if (passwordError) throw passwordError;

    return { success: true };
  } catch (err) {
    console.error('Error updating password:', err);
    setError(err.message || 'Failed to update password.');

    return { success: false, error: err.message };
  }
};


  // Log out the current user
  const logoutUser = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      throw logoutError;
    }

    return { success: true };
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        user,
        loading,
        error,
        updateProfile,
        updateTheme,
        uploadAvatar,
        updatePassword,
        logoutUser,
        fetchProfile,
        refreshProfile: () => fetchProfile(user)
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      'useProfile must be used within a ProfileProvider'
    );
  }

  return context;
}

