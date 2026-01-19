-- Supabase RPC Function Update
-- Run this in Supabase SQL Editor to add quiz_source, goal_selection, and journey_stage support
--
-- This replaces the existing insert_quiz_lead function

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

    -- Source tracking (NEW)
    quiz_source,

    -- Quiz-3 specific fields (NEW)
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

    -- Source tracking (NEW)
    user_data->>'quiz_source',

    -- Quiz-3 specific fields (NEW)
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
    user_data->'diagnoses',
    user_data->'treatments_tried',
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

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION insert_quiz_lead(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_quiz_lead(JSONB) TO anon;
