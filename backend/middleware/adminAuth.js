
import { supabase } from '../config/supabase.js';

export async function requireAdmin(req, res, next) {
console.log('Admin middleware was reached.');

  try {
    // Get the access token from the request
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const accessToken = authHeader.split(' ')[1];

    // Verify the user's Supabase session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired login session.'
      });
    }

    // Retrieve the user's actual role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Admin profile lookup error:', profileError.message);
      console.error('Error code:', profileError.code);

      return res.status(403).json({
        success: false,
        message: 'Unable to verify administrator permissions.'
      });
    }

    if (!profile) {
      console.error('No profile found for authenticated user.');

      return res.status(403).json({
        success: false,
        message: 'No matching profile was found.'
      });
    }

    // Allow only administrators
    if (profile.role?.trim().toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    // Make the verified user available to the protected route
    req.user = user;

    next();

  } catch (error) {
    console.error('Admin authentication error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to verify administrator access.'
    });
  }
}
