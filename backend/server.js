
import express from 'express';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import { startReminderScheduler } from './services/reminderService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

startReminderScheduler();

app.use(express.json());

// Test that the Express server is running
app.get('/api/health', async (_req, res) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      status: 'ok',
      message: 'MediTrack API and Supabase are connected successfully.'
    });
  } catch (error) {
    console.error('Supabase connection error:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Supabase connection failed.'
    });
  }
});

app.listen(port, () => {
  console.log(`MediTrack API listening on port ${port}`);

  startReminderScheduler();
});
