# Admin Panel Quiz Tracking Implementation Prompt

Copy and paste this prompt into Claude Code in your admin panel repository (app.guthealingacademy.com) to implement the quiz tracking dashboard.

---

## PROMPT TO COPY:

```
I need you to build a Quiz Tracking dashboard in my admin panel. This dashboard will display real-time quiz analytics from Supabase.

## Supabase Connection Details

The data is stored in Supabase at:
- URL: https://mwabljnngygkmahjgvps.supabase.co
- The admin panel should already have Supabase configured

## Database Schema

There's a `quiz_events` table with this structure:

```sql
quiz_events (
  id UUID PRIMARY KEY,
  session_id TEXT,              -- Unique quiz session
  quiz_source TEXT,             -- 'quiz-4'
  event_type TEXT,              -- 'quiz_start', 'screen_view', 'answer', 'email_capture', 'quiz_complete', 'quiz_abandon'
  screen_index INTEGER,         -- 0-27 for quiz-4
  screen_id TEXT,               -- e.g., 'future_vision', 'primary_complaint'
  screen_name TEXT,             -- Human readable
  phase_index INTEGER,          -- 0-6 (7 phases)
  phase_name TEXT,              -- e.g., 'YOUR GOALS', 'YOUR SYMPTOMS'
  answer_value TEXT,            -- For answer events
  answer_text TEXT,             -- Human readable answer
  is_correct BOOLEAN,           -- For knowledge quiz
  time_on_screen_seconds INTEGER,
  time_since_start_seconds INTEGER,
  user_name TEXT,
  user_email TEXT,
  protocol_key TEXT,            -- bloat_reset, regularity, etc.
  protocol_name TEXT,
  has_gut_brain BOOLEAN,
  primary_complaint TEXT,
  treatments_count INTEGER,
  has_red_flags BOOLEAN,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ
)
```

## Pre-built Views Available

These views are already created in Supabase:

1. `quiz_funnel_stats` - Aggregated screen-by-screen data
2. `quiz_daily_stats` - Daily conversion rates
3. `quiz_dropoff_analysis` - Where users drop off
4. `quiz_active_sessions` - Real-time sessions (last 30 min)

## Required Dashboard Sections

### 1. Overview Cards (Top Row)
Show these metrics for selected date range:
- Total Quiz Starts
- Email Captures (with % rate)
- Quiz Completions (with % rate)
- Average Completion Time

### 2. Funnel Visualization
A visual funnel showing progression through quiz screens:
- Screen 0: future_vision (100%)
- Screen 1: timeline (X%)
- ...
- Screen 24: email_capture (X%)
- Screen 27: results_page (X%)

Show:
- Bar chart with session count per screen
- Drop-off percentage between each screen
- Highlight the biggest drop-off points in red

### 3. Screen-by-Screen Table
Table with columns:
- Screen # (0-27)
- Screen ID
- Screen Name
- Phase
- Sessions Reached
- % of Starts
- Drop-off %
- Avg Time on Screen

Sortable by any column.

### 4. Real-Time Active Sessions
Show users currently taking the quiz (from quiz_active_sessions view):
- Session ID (truncated)
- Current Screen
- Current Phase
- Time in Quiz
- Has Email? (green/red indicator)

Auto-refresh every 30 seconds.

### 5. Daily Trends Chart
Line chart showing over time:
- Quiz starts (blue line)
- Email captures (green line)
- Completions (purple line)

Date range selector: Today, Last 7 Days, Last 30 Days, Custom

### 6. Answer Distribution (Optional)
For key questions, show pie charts of answer distribution:
- primary_complaint breakdown
- stress_connection breakdown
- life_impact breakdown

## Sample Queries

### Get funnel data:
```javascript
const { data } = await supabase
  .from('quiz_dropoff_analysis')
  .select('*')
  .eq('quiz_source', 'quiz-4')
  .order('screen_index');
```

### Get daily stats:
```javascript
const { data } = await supabase
  .from('quiz_daily_stats')
  .select('*')
  .eq('quiz_source', 'quiz-4')
  .gte('date', startDate)
  .lte('date', endDate)
  .order('date', { ascending: false });
```

### Get active sessions:
```javascript
const { data } = await supabase
  .from('quiz_active_sessions')
  .select('*')
  .eq('quiz_source', 'quiz-4')
  .order('last_activity', { ascending: false });
```

### Get raw events for date range:
```javascript
const { data } = await supabase
  .from('quiz_events')
  .select('*')
  .eq('quiz_source', 'quiz-4')
  .gte('created_at', startDate)
  .lte('created_at', endDate)
  .order('created_at', { ascending: false });
```

### Get answer distribution:
```javascript
const { data } = await supabase
  .from('quiz_events')
  .select('answer_value, answer_text')
  .eq('quiz_source', 'quiz-4')
  .eq('event_type', 'answer')
  .eq('screen_id', 'primary_complaint');
```

## UI/UX Guidelines

1. Match the existing admin panel design (based on screenshot, it uses:)
   - Clean white cards with subtle shadows
   - Teal/green accent color (#6B9080)
   - Clear section headers
   - Consistent padding and spacing

2. Add this as a new tab called "Quiz Analytics" or "Quiz Tracking"

3. Include date range filters at the top

4. Make tables sortable and searchable

5. Add loading states while data fetches

6. Handle empty states gracefully

## Screen Reference (Quiz-4 has 28 screens)

| Index | Screen ID | Phase |
|-------|-----------|-------|
| 0 | future_vision | YOUR GOALS |
| 1 | timeline | YOUR GOALS |
| 2 | primary_complaint | YOUR GOALS |
| 3 | duration | YOUR GOALS |
| 4 | validation_duration | YOUR GOALS |
| 5 | bm_relief | YOUR SYMPTOMS |
| 6 | flare_frequency | YOUR SYMPTOMS |
| 7 | stool_changes | YOUR SYMPTOMS |
| 8 | progress_validation | YOUR SYMPTOMS |
| 9 | treatments_tried | YOUR SYMPTOMS |
| 10 | diagnosis_history | YOUR SYMPTOMS |
| 11 | name_capture | YOUR SYMPTOMS |
| 12 | why_different | WHY THIS WORKS |
| 13 | testimonial | WHY THIS WORKS |
| 14 | knowledge_intro | QUICK GUT CHECK |
| 15 | knowledge_eating_speed | QUICK GUT CHECK |
| 16 | knowledge_eating_response | QUICK GUT CHECK |
| 17 | knowledge_fodmap | QUICK GUT CHECK |
| 18 | knowledge_fodmap_response | QUICK GUT CHECK |
| 19 | stress_connection | YOUR PROFILE |
| 20 | stress_validation | YOUR PROFILE |
| 21 | safety_blood | FINAL QUESTIONS |
| 22 | safety_weight | FINAL QUESTIONS |
| 23 | life_impact | YOUR RESULTS |
| 24 | email_capture | YOUR RESULTS |
| 25 | vision_optional | YOUR RESULTS |
| 26 | loading_sequence | YOUR RESULTS |
| 27 | results_page | YOUR RESULTS |

Please implement this dashboard. Start by examining my existing admin panel code structure, then create the Quiz Tracking tab with all the sections described above.
```

---

## SETUP INSTRUCTIONS

Before using the prompt above, make sure you've run the SQL schema in Supabase:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-quiz-tracking.sql` from this repository
4. This creates the `quiz_events` table and all the views

The quiz is already sending events to this table. You should start seeing data immediately once the SQL is run.

## What Gets Tracked

Every quiz session now tracks:
- **quiz_start** - When someone begins the quiz
- **screen_view** - Every screen they see (with timing)
- **answer** - Every answer they give (with value and timing)
- **email_capture** - When they submit their email
- **quiz_complete** - When they reach results
- **quiz_abandon** - When they leave without completing

## Testing

To verify tracking is working:
1. Open Quiz-4: https://your-domain.com/quiz-4/
2. Open browser DevTools → Console
3. Look for "Quiz event tracked:" log messages
4. In Supabase, query: `SELECT * FROM quiz_events ORDER BY created_at DESC LIMIT 10;`
