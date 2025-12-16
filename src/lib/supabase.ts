import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  target_role: string;
  graduation_year: number | null;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  total_hours: number;
  completed_hours: number;
  status: string;
  priority: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type PracticeProblem = {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  difficulty: string;
  platform: string;
  problem_url: string;
  status: string;
  attempts: number;
  notes: string;
  solved_at: string | null;
  created_at: string;
};

export type Company = {
  id: string;
  user_id: string;
  name: string;
  role: string;
  application_status: string;
  application_deadline: string | null;
  ctc: string;
  preparation_notes: string;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
};

export type StudySession = {
  id: string;
  user_id: string;
  topic_id: string | null;
  duration_minutes: number;
  session_date: string;
  notes: string;
  created_at: string;
};
