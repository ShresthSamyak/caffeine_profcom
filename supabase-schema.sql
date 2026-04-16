-- ============================================
-- Caffeine Survey — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON public.users (LOWER(email));

-- Responses table
CREATE TABLE IF NOT EXISTS public.responses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  answers     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS responses_user_id_idx ON public.responses (user_id);
CREATE INDEX IF NOT EXISTS responses_created_at_idx ON public.responses (created_at DESC);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (survey submission — no auth required)
CREATE POLICY "anon_insert_users"
  ON public.users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_responses"
  ON public.responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow select (needed for dashboard API via service role / anon)
CREATE POLICY "anon_select_users"
  ON public.users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_select_responses"
  ON public.responses FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================
-- Sample Data (optional — remove in production)
-- ============================================

-- INSERT INTO public.users (name, email) VALUES
--   ('Alice Chen', 'alice@example.com'),
--   ('Bob Smith', 'bob@example.com');
