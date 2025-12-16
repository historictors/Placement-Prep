/*
  # Placement Preparation Tracker Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `target_role` (text) - e.g., Software Engineer, Data Analyst
      - `graduation_year` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `topics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text) - e.g., Data Structures, Algorithms, DBMS
      - `category` (text) - Technical, Aptitude, Soft Skills
      - `total_hours` (integer) - planned hours
      - `completed_hours` (integer) - actual hours spent
      - `status` (text) - Not Started, In Progress, Completed
      - `priority` (text) - High, Medium, Low
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `practice_problems`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `topic` (text)
      - `difficulty` (text) - Easy, Medium, Hard
      - `platform` (text) - LeetCode, HackerRank, etc.
      - `problem_url` (text)
      - `status` (text) - Todo, Attempted, Solved, Revision Needed
      - `attempts` (integer)
      - `notes` (text)
      - `solved_at` (timestamp)
      - `created_at` (timestamp)
    
    - `companies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `role` (text)
      - `application_status` (text) - Researching, Applied, Interview, Offer, Rejected
      - `application_deadline` (date)
      - `ctc` (text) - expected package
      - `preparation_notes` (text)
      - `interview_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `topic_id` (uuid, references topics)
      - `duration_minutes` (integer)
      - `session_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  target_role text DEFAULT '',
  graduation_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Technical',
  total_hours integer DEFAULT 0,
  completed_hours integer DEFAULT 0,
  status text DEFAULT 'Not Started',
  priority text DEFAULT 'Medium',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topics"
  ON topics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topics"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own topics"
  ON topics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create practice_problems table
CREATE TABLE IF NOT EXISTS practice_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  topic text NOT NULL,
  difficulty text DEFAULT 'Medium',
  platform text DEFAULT '',
  problem_url text DEFAULT '',
  status text DEFAULT 'Todo',
  attempts integer DEFAULT 0,
  notes text DEFAULT '',
  solved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE practice_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own problems"
  ON practice_problems FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problems"
  ON practice_problems FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own problems"
  ON practice_problems FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems"
  ON practice_problems FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text DEFAULT '',
  application_status text DEFAULT 'Researching',
  application_deadline date,
  ctc text DEFAULT '',
  preparation_notes text DEFAULT '',
  interview_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companies"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
  ON companies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  duration_minutes integer DEFAULT 0,
  session_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON study_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_user_id ON practice_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_topic_id ON study_sessions(topic_id);