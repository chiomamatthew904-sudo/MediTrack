
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check that the required environment variables exist
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Check backend/.env');
}

// Create the Supabase server-side client
export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
);
