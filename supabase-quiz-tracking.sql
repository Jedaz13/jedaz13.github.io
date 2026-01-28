-- =====================================================
-- Quiz Event Tracking System
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Create the quiz_events table for step-by-step tracking
CREATE TABLE IF NOT EXISTS quiz_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Session identification
  session_id TEXT NOT NULL,                    -- Unique quiz session (generated client-side)
  quiz_source TEXT NOT NULL DEFAULT 'quiz-4',  -- Which quiz variant

  -- Event details
  event_type TEXT NOT NULL,                    -- 'screen_view', 'answer', 'email_capture', 'quiz_complete', 'quiz_abandon'
  screen_index INTEGER,                        -- 0-27 for quiz-4
  screen_id TEXT,                              -- e.g., 'future_vision', 'primary_complaint'
  screen_name TEXT,                            -- Human readable name
  phase_index INTEGER,                         -- 0-6 for quiz-4 (7 phases)
  phase_name TEXT,                             -- e.g., 'YOUR GOALS', 'YOUR SYMPTOMS'

  -- Answer data (for 'answer' events)
  answer_value TEXT,                           -- The selected value(s)
  answer_text TEXT,                            -- Human readable answer
  is_correct BOOLEAN,                          -- For knowledge quiz questions

  -- Timing
  time_on_screen_seconds INTEGER,              -- How long they spent on this screen
  time_since_start_seconds INTEGER,            -- Total time since quiz start

  -- User data (captured progressively)
  user_name TEXT,
  user_email TEXT,

  -- Protocol data (populated on completion)
  protocol_key TEXT,                           -- bloat_reset, regularity, etc.
  protocol_name TEXT,
  has_gut_brain BOOLEAN DEFAULT FALSE,

  -- Additional context
  primary_complaint TEXT,
  treatments_count INTEGER,
  has_red_flags BOOLEAN DEFAULT FALSE,

  -- Metadata
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_quiz_events_session_id ON quiz_events(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_created_at ON quiz_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_events_event_type ON quiz_events(event_type);
CREATE INDEX IF NOT EXISTS idx_quiz_events_screen_index ON quiz_events(screen_index);
CREATE INDEX IF NOT EXISTS idx_quiz_events_quiz_source ON quiz_events(quiz_source);

-- 3. Create composite index for funnel analysis
CREATE INDEX IF NOT EXISTS idx_quiz_events_funnel ON quiz_events(quiz_source, event_type, screen_index, created_at DESC);

-- 4. Create the RPC function for inserting events
CREATE OR REPLACE FUNCTION insert_quiz_event(event_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO quiz_events (
    session_id,
    quiz_source,
    event_type,
    screen_index,
    screen_id,
    screen_name,
    phase_index,
    phase_name,
    answer_value,
    answer_text,
    is_correct,
    time_on_screen_seconds,
    time_since_start_seconds,
    user_name,
    user_email,
    protocol_key,
    protocol_name,
    has_gut_brain,
    primary_complaint,
    treatments_count,
    has_red_flags,
    user_agent,
    referrer
  ) VALUES (
    event_data->>'session_id',
    COALESCE(event_data->>'quiz_source', 'quiz-4'),
    event_data->>'event_type',
    (event_data->>'screen_index')::INTEGER,
    event_data->>'screen_id',
    event_data->>'screen_name',
    (event_data->>'phase_index')::INTEGER,
    event_data->>'phase_name',
    event_data->>'answer_value',
    event_data->>'answer_text',
    (event_data->>'is_correct')::BOOLEAN,
    (event_data->>'time_on_screen_seconds')::INTEGER,
    (event_data->>'time_since_start_seconds')::INTEGER,
    event_data->>'user_name',
    event_data->>'user_email',
    event_data->>'protocol_key',
    event_data->>'protocol_name',
    COALESCE((event_data->>'has_gut_brain')::BOOLEAN, FALSE),
    event_data->>'primary_complaint',
    (event_data->>'treatments_count')::INTEGER,
    COALESCE((event_data->>'has_red_flags')::BOOLEAN, FALSE),
    event_data->>'user_agent',
    event_data->>'referrer'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- 5. Create view for funnel analysis (aggregated by screen)
CREATE OR REPLACE VIEW quiz_funnel_stats AS
SELECT
  quiz_source,
  screen_index,
  screen_id,
  screen_name,
  phase_name,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_views,
  AVG(time_on_screen_seconds) as avg_time_seconds,
  DATE_TRUNC('day', created_at) as date
FROM quiz_events
WHERE event_type = 'screen_view'
GROUP BY quiz_source, screen_index, screen_id, screen_name, phase_name, DATE_TRUNC('day', created_at)
ORDER BY screen_index;

-- 6. Create view for daily stats
CREATE OR REPLACE VIEW quiz_daily_stats AS
SELECT
  quiz_source,
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(DISTINCT CASE WHEN event_type = 'email_capture' THEN session_id END) as email_captures,
  COUNT(DISTINCT CASE WHEN event_type = 'quiz_complete' THEN session_id END) as completions,
  COUNT(DISTINCT CASE WHEN event_type = 'quiz_abandon' THEN session_id END) as abandons,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_type = 'email_capture' THEN session_id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT session_id), 0) * 100,
    2
  ) as email_capture_rate,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_type = 'quiz_complete' THEN session_id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT session_id), 0) * 100,
    2
  ) as completion_rate
FROM quiz_events
GROUP BY quiz_source, DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- 7. Create view for drop-off analysis
CREATE OR REPLACE VIEW quiz_dropoff_analysis AS
WITH screen_sessions AS (
  SELECT
    quiz_source,
    screen_index,
    screen_id,
    screen_name,
    phase_name,
    COUNT(DISTINCT session_id) as sessions_reached
  FROM quiz_events
  WHERE event_type = 'screen_view'
  GROUP BY quiz_source, screen_index, screen_id, screen_name, phase_name
),
first_screen AS (
  SELECT
    quiz_source,
    sessions_reached as total_starts
  FROM screen_sessions
  WHERE screen_index = 0
)
SELECT
  s.quiz_source,
  s.screen_index,
  s.screen_id,
  s.screen_name,
  s.phase_name,
  s.sessions_reached,
  f.total_starts,
  ROUND(s.sessions_reached::NUMERIC / NULLIF(f.total_starts, 0) * 100, 1) as pct_of_starts,
  LAG(s.sessions_reached) OVER (PARTITION BY s.quiz_source ORDER BY s.screen_index) as prev_screen_sessions,
  ROUND(
    (LAG(s.sessions_reached) OVER (PARTITION BY s.quiz_source ORDER BY s.screen_index) - s.sessions_reached)::NUMERIC /
    NULLIF(LAG(s.sessions_reached) OVER (PARTITION BY s.quiz_source ORDER BY s.screen_index), 0) * 100,
    1
  ) as dropoff_pct
FROM screen_sessions s
JOIN first_screen f ON s.quiz_source = f.quiz_source
ORDER BY s.quiz_source, s.screen_index;

-- 8. Create view for real-time active sessions (last 30 minutes)
CREATE OR REPLACE VIEW quiz_active_sessions AS
SELECT
  session_id,
  quiz_source,
  MAX(screen_index) as current_screen,
  MAX(screen_name) as current_screen_name,
  MAX(phase_name) as current_phase,
  MAX(user_name) as user_name,
  MAX(user_email) as user_email,
  MIN(created_at) as started_at,
  MAX(created_at) as last_activity,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))::INTEGER as session_duration_seconds,
  COUNT(*) as events_count,
  BOOL_OR(event_type = 'email_capture') as has_email,
  BOOL_OR(event_type = 'quiz_complete') as is_complete
FROM quiz_events
WHERE created_at > NOW() - INTERVAL '30 minutes'
GROUP BY session_id, quiz_source
ORDER BY last_activity DESC;

-- 9. Grant permissions
-- Anonymous users can only execute the insert function (not direct table access)
GRANT EXECUTE ON FUNCTION insert_quiz_event(JSONB) TO anon;

-- Authenticated users get table access (RLS will restrict to admins)
GRANT SELECT ON quiz_events TO authenticated;
GRANT SELECT ON quiz_funnel_stats TO authenticated;
GRANT SELECT ON quiz_daily_stats TO authenticated;
GRANT SELECT ON quiz_dropoff_analysis TO authenticated;
GRANT SELECT ON quiz_active_sessions TO authenticated;

-- 10. Enable Row Level Security
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS Policies

-- Policy: Allow inserts via the SECURITY DEFINER function only
-- (The insert_quiz_event function bypasses RLS because it's SECURITY DEFINER)
-- No direct INSERT policy needed for anon - they use the function

-- Policy: Only admins can read quiz events
CREATE POLICY "Admins can read quiz events"
ON quiz_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Policy: Only admins can delete quiz events (for cleanup)
CREATE POLICY "Admins can delete quiz events"
ON quiz_events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- 12. Create secure views for admin access
-- These views inherit RLS from the underlying table

-- Alternative: If you want views accessible without RLS check,
-- you can use SECURITY DEFINER functions instead.
-- But the current setup requires admin login to the admin panel.

-- 13. Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  );
$$;

-- Grant execute on helper function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- =====================================================
-- USAGE NOTES:
--
-- SECURITY MODEL:
-- - Quiz visitors (anonymous) can INSERT events via insert_quiz_event()
-- - Only authenticated admins (is_admin=true) can READ events
-- - The admin panel must authenticate users via Supabase Auth
-- - Views inherit RLS from the underlying quiz_events table
--
-- After running this SQL, the quiz will automatically track:
-- - Every screen view with timing
-- - Every answer given
-- - Email capture events
-- - Quiz completion events
-- - Quiz abandonment events
--
-- ADMIN QUERIES (must be authenticated as admin):
-- 1. quiz_funnel_stats - See how many reach each screen
-- 2. quiz_daily_stats - Daily conversion rates
-- 3. quiz_dropoff_analysis - Where people leave
-- 4. quiz_active_sessions - Real-time quiz takers
--
-- IMPORTANT: If you already ran the old version without RLS,
-- run these commands to add security:
--
-- ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Admins can read quiz events"
-- ON quiz_events FOR SELECT TO authenticated
-- USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true));
--
-- REVOKE SELECT ON quiz_events FROM anon;
-- =====================================================
