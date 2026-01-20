-- Supabase RPC Function Update
-- Run this in Supabase SQL Editor to add quiz_source, goal_selection, and journey_stage support
--
-- This replaces the existing insert_quiz_lead function
--
-- IMPORTANT: This version fixes the JSONB -> text[] conversion for diagnoses and treatments_tried
-- and adds upsert_quiz_lead for two-stage submission (email capture + completion)

-- Helper function to convert JSONB array to text array
CREATE OR REPLACE FUNCTION jsonb_array_to_text_array(jsonb_arr JSONB)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN jsonb_arr IS NULL OR jsonb_arr = 'null'::jsonb THEN NULL
    WHEN jsonb_typeof(jsonb_arr) = 'array' THEN
      ARRAY(SELECT jsonb_array_elements_text(jsonb_arr))
    ELSE NULL
  END;
$$;

-- INSERT function (for new leads)
CREATE OR REPLACE FUNCTION insert_quiz_lead(user_data JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (
    -- Contact info
    name,
    email,

    -- Source tracking
    quiz_source,

    -- Quiz-3 specific fields
    goal_selection,
    journey_stage,

    -- Protocol info
    protocol,
    protocol_name,
    has_stress_component,

    -- Red flag info
    has_red_flags,
    red_flag_evaluated_cleared,
    red_flag_details,

    -- Question answers
    primary_complaint,
    symptom_frequency,
    relief_after_bm,
    frequency_during_flare,
    stool_during_flare,
    duration,
    diagnoses,
    treatments_tried,
    stress_connection,
    mental_health_impact,
    sleep_quality,
    life_impact_level,
    hardest_part,
    dream_outcome,

    -- User role/status
    role,
    status
  )
  VALUES (
    -- Contact info
    user_data->>'name',
    user_data->>'email',

    -- Source tracking
    user_data->>'quiz_source',

    -- Quiz-3 specific fields
    user_data->>'goal_selection',
    user_data->>'journey_stage',

    -- Protocol info (protocol is integer, extract and cast)
    (user_data->>'protocol')::integer,
    user_data->>'protocol_name',
    COALESCE((user_data->>'has_stress_component')::boolean, false),

    -- Red flag info
    COALESCE((user_data->>'has_red_flags')::boolean, false),
    COALESCE((user_data->>'red_flag_evaluated_cleared')::boolean, false),
    user_data->'red_flag_details',

    -- Question answers
    user_data->>'primary_complaint',
    user_data->>'symptom_frequency',
    user_data->>'relief_after_bm',
    user_data->>'frequency_during_flare',
    user_data->>'stool_during_flare',
    user_data->>'duration',
    -- FIX: Convert JSONB arrays to text[] arrays
    jsonb_array_to_text_array(user_data->'diagnoses'),
    jsonb_array_to_text_array(user_data->'treatments_tried'),
    user_data->>'stress_connection',
    user_data->>'mental_health_impact',
    user_data->>'sleep_quality',
    user_data->>'life_impact_level',
    user_data->>'hardest_part',
    user_data->>'dream_outcome',

    -- User role/status (with defaults)
    COALESCE(user_data->>'role', 'member'),
    COALESCE(user_data->>'status', 'lead')
  );
END;
$$;

-- UPSERT function (for two-stage submission: email capture + completion)
-- This inserts a new record on email capture, then updates it on quiz completion
CREATE OR REPLACE FUNCTION upsert_quiz_lead(user_data JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (
    -- Contact info
    name,
    email,

    -- Source tracking
    quiz_source,

    -- Quiz-3 specific fields
    goal_selection,
    journey_stage,

    -- Protocol info
    protocol,
    protocol_name,
    has_stress_component,

    -- Red flag info
    has_red_flags,
    red_flag_evaluated_cleared,
    red_flag_details,

    -- Question answers
    primary_complaint,
    symptom_frequency,
    relief_after_bm,
    frequency_during_flare,
    stool_during_flare,
    duration,
    diagnoses,
    treatments_tried,
    stress_connection,
    mental_health_impact,
    sleep_quality,
    life_impact_level,
    hardest_part,
    dream_outcome,

    -- User role/status
    role,
    status
  )
  VALUES (
    -- Contact info
    user_data->>'name',
    user_data->>'email',

    -- Source tracking
    user_data->>'quiz_source',

    -- Quiz-3 specific fields
    user_data->>'goal_selection',
    user_data->>'journey_stage',

    -- Protocol info
    (user_data->>'protocol')::integer,
    user_data->>'protocol_name',
    COALESCE((user_data->>'has_stress_component')::boolean, false),

    -- Red flag info
    COALESCE((user_data->>'has_red_flags')::boolean, false),
    COALESCE((user_data->>'red_flag_evaluated_cleared')::boolean, false),
    user_data->'red_flag_details',

    -- Question answers
    user_data->>'primary_complaint',
    user_data->>'symptom_frequency',
    user_data->>'relief_after_bm',
    user_data->>'frequency_during_flare',
    user_data->>'stool_during_flare',
    user_data->>'duration',
    jsonb_array_to_text_array(user_data->'diagnoses'),
    jsonb_array_to_text_array(user_data->'treatments_tried'),
    user_data->>'stress_connection',
    user_data->>'mental_health_impact',
    user_data->>'sleep_quality',
    user_data->>'life_impact_level',
    user_data->>'hardest_part',
    user_data->>'dream_outcome',

    -- User role/status
    COALESCE(user_data->>'role', 'member'),
    COALESCE(user_data->>'status', 'lead')
  )
  ON CONFLICT (email)
  DO UPDATE SET
    -- Update name if provided
    name = COALESCE(EXCLUDED.name, users.name),

    -- Update quiz-3 specific fields if provided
    goal_selection = COALESCE(EXCLUDED.goal_selection, users.goal_selection),
    journey_stage = COALESCE(EXCLUDED.journey_stage, users.journey_stage),

    -- Update protocol info if provided (only if not null/0)
    protocol = CASE WHEN EXCLUDED.protocol IS NOT NULL AND EXCLUDED.protocol > 0 THEN EXCLUDED.protocol ELSE users.protocol END,
    protocol_name = COALESCE(EXCLUDED.protocol_name, users.protocol_name),
    has_stress_component = CASE WHEN EXCLUDED.has_stress_component THEN EXCLUDED.has_stress_component ELSE users.has_stress_component END,

    -- Update red flag info
    has_red_flags = CASE WHEN EXCLUDED.has_red_flags THEN EXCLUDED.has_red_flags ELSE users.has_red_flags END,
    red_flag_evaluated_cleared = CASE WHEN EXCLUDED.red_flag_evaluated_cleared THEN EXCLUDED.red_flag_evaluated_cleared ELSE users.red_flag_evaluated_cleared END,
    red_flag_details = COALESCE(EXCLUDED.red_flag_details, users.red_flag_details),

    -- Update question answers (only if new value is not null)
    primary_complaint = COALESCE(EXCLUDED.primary_complaint, users.primary_complaint),
    symptom_frequency = COALESCE(EXCLUDED.symptom_frequency, users.symptom_frequency),
    relief_after_bm = COALESCE(EXCLUDED.relief_after_bm, users.relief_after_bm),
    frequency_during_flare = COALESCE(EXCLUDED.frequency_during_flare, users.frequency_during_flare),
    stool_during_flare = COALESCE(EXCLUDED.stool_during_flare, users.stool_during_flare),
    duration = COALESCE(EXCLUDED.duration, users.duration),
    diagnoses = COALESCE(EXCLUDED.diagnoses, users.diagnoses),
    treatments_tried = COALESCE(EXCLUDED.treatments_tried, users.treatments_tried),
    stress_connection = COALESCE(EXCLUDED.stress_connection, users.stress_connection),
    mental_health_impact = COALESCE(EXCLUDED.mental_health_impact, users.mental_health_impact),
    sleep_quality = COALESCE(EXCLUDED.sleep_quality, users.sleep_quality),
    life_impact_level = COALESCE(EXCLUDED.life_impact_level, users.life_impact_level),
    hardest_part = COALESCE(EXCLUDED.hardest_part, users.hardest_part),
    dream_outcome = COALESCE(EXCLUDED.dream_outcome, users.dream_outcome),

    -- Update timestamp
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION jsonb_array_to_text_array(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION jsonb_array_to_text_array(JSONB) TO anon;
GRANT EXECUTE ON FUNCTION insert_quiz_lead(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_quiz_lead(JSONB) TO anon;
GRANT EXECUTE ON FUNCTION upsert_quiz_lead(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_quiz_lead(JSONB) TO anon;
