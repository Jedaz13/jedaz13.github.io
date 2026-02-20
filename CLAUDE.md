# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MVP Builder Instructions

### Who I Am
I'm a coding beginner. My goal is to test product ideas as fast as possible by building working MVPs. Optimize for speed to a working prototype, not perfect code.

### Workflow Orchestration

#### 1. Plan Before Building
* Enter plan mode for ANY non-trivial task (3+ steps or decisions)
* If something goes sideways, STOP and re-plan immediately — don't keep pushing
* Write a short spec before coding: what does the MVP need to do?
* Always suggest the fastest path to a working prototype

#### 2. Explain As You Go
* Explain what you're doing and why in plain, beginner-friendly language
* Don't silently make changes — walk me through the reasoning
* When there are multiple approaches, explain the trade-offs simply
* If I need to understand a concept to make a decision, teach me briefly

#### 3. Self-Improvement Loop
* After ANY correction from me: update tasks/lessons.md with the pattern
* Write rules for yourself that prevent the same mistake
* Review lessons at session start for the relevant project
* Track what tech/tools I'm comfortable with so you don't over-complicate things

#### 4. Verify It Works
* Never mark a task complete without proving it works
* Show me how to test it myself (give me the URL, the command, or the steps)
* If something looks broken, just fix it — don't ask me to debug
* Ask yourself: "Can Gedas see this working in his browser right now?"

### Task Management
1. **Plan First**: Write plan to tasks/todo.md with checkable items
2. **Check In**: Confirm the plan with me before building
3. **Track Progress**: Mark items complete as you go
4. **Summarize Changes**: Give me a plain-English summary at each step
5. **Document Results**: Add a review section to tasks/todo.md
6. **Capture Lessons**: Update tasks/lessons.md after any corrections

### Core Principles
* **Ship Fast, Iterate Later**: The goal is a testable MVP, not production-grade code. Get it working first.
* **Simplicity First**: Use the simplest tech stack possible. Default to basic, well-known tools. Don't add complexity unless absolutely needed.
* **Working Beats Perfect**: A hacky prototype that works is better than elegant code that's half-finished. Save refactoring for ideas that are validated.
* **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
* **No Rabbit Holes**: If a feature is taking too long, suggest a simpler alternative. Flag scope creep early.
* **Ask Before Assuming**: If a decision could go multiple ways, ask me rather than guessing. I'd rather answer a quick question than undo wrong work.

### Tech Stack Preferences
* Keep it simple: HTML, CSS, JavaScript, or whatever gets to a working demo fastest
* Prefer no-code/low-code solutions when they're faster than custom code
* Avoid complex architectures, build systems, or frameworks unless the project demands it
* If you need a backend, use the simplest option (serverless functions, simple APIs)
* Default to free/cheap hosting and tools for testing phase

---

## Project Overview

A landing page for the Gut Healing Academy gut health quiz. The page promotes the quiz and directs users to take the full assessment on the main site.

## Tech Stack

- **HTML/CSS**: Vanilla implementation, no frameworks or build tools
- **Styling**: Mobile-first responsive design
- **Hosting**: Static files - can be hosted on any web server, GitHub Pages, Netlify, etc.

## Development Commands

This is a static site with no build process. To develop:

```bash
# Simply open index.html in a browser
# Or use a local server (recommended for testing):
python -m http.server 8000
# Then visit http://localhost:8000
```

For production, upload all files and directories to any web host.

## Architecture

### File Structure
```
/
├── index.html              # Landing page HTML
├── css/
│   └── styles.css          # Landing page styling
├── assets/
│   ├── hero-woman.jpg      # Hero section image
│   ├── testimonial-suzy.png
│   ├── testimonial-amanda.png
│   └── testimonial-cheryl.png
├── CLAUDE.md               # This file
└── README.md               # Project readme
```

### Page Sections

1. **Credential Bar**: Displays team credentials
2. **Hero Section**: Main headline, subheadline, and primary CTA
3. **Validation Section**: Before/after transformation messaging
4. **Testimonials Section**: Social proof with customer testimonials
5. **Credibility Section**: Value proposition and secondary CTA
6. **Footer**: Final CTA and medical disclaimer
7. **Sticky CTA**: Mobile-only sticky button (appears when hero CTA scrolls out of view)

### CTA Links

All CTA buttons link to the external quiz:
```
https://www.guthealingacademy.com/gut-quiz
```

## Styling Notes (css/styles.css)

### Color Palette
```css
--primary-teal: #6B9080;      /* Accent color, trust signal */
--secondary-sage: #A4C3B2;    /* Validation card border */
--bg-cream: #FDF8F5;          /* Page background */
--cta-coral: #E07A5F;         /* CTA buttons */
--text-charcoal: #2D3436;     /* Primary text */
--navy-blue: #264653;         /* Credential bar, footer */
--white: #FFFFFF;             /* Cards, backgrounds */
```

### Key Features
- Mobile-first responsive design
- Horizontal scroll testimonials on mobile, grid on desktop
- Sticky mobile CTA with smooth show/hide animation
- Fade-in page animation

## Testing Checklist

When making changes, test:
- [ ] Landing page displays correctly with all sections
- [ ] All CTA buttons link to the external quiz URL
- [ ] Hero image loads correctly
- [ ] Testimonial images load correctly
- [ ] Testimonials scroll horizontally on mobile
- [ ] Testimonials display as grid on desktop
- [ ] Sticky CTA appears/disappears correctly on mobile
- [ ] Sticky CTA is hidden on desktop
- [ ] Mobile responsive design works
- [ ] Footer disclaimer is readable

## Modifications

### Creating New Pages

**IMPORTANT: All new HTML pages MUST include Google Tag Manager AND the favicon.**

GTM Container ID: `GTM-KQ3LKTBL`

#### Favicon

Add this in `<head>` (after meta viewport):
```html
<link rel="icon" type="image/png" href="/assets/favicon.png">
```

#### Google Tag Manager

Add this in `<head>` (right after opening `<head>` tag):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KQ3LKTBL');</script>
<!-- End Google Tag Manager -->
```

Add this immediately after opening `<body>` tag:
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQ3LKTBL"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Updating CTA Link

To change the quiz URL, update all CTA links in `index.html`:
- Primary CTA in hero section
- Secondary CTA in credibility section
- Footer CTA
- Sticky CTA

### Customizing Styling

- **Colors**: Update CSS variables in `:root` in `css/styles.css`
- **Layout**: Modify section padding and max-widths in CSS
- **Typography**: Adjust font sizes in the responsive media queries

---

## Quiz System Documentation

This section documents the quiz infrastructure for building aligned quiz variants.

### Quiz Variants Overview

| Quiz | Path | Source ID | Style | Unique Features |
|------|------|-----------|-------|-----------------|
| Quiz-1 | `/quiz/` | `quiz-1` (Supabase) / `chat-rebecca` (URL) | Chat-based with Rebecca | Conversational flow, typing indicators |
| Quiz-2 | `/quiz-2/` | `quiz-2` | Survey-style | Interstitials, practitioner intros, testimonials |
| Quiz-3 | `/quiz-3/` | `quiz-3` | Survey-style | Goal-first intro (goal_selection, journey_stage) |

### Configuration Constants

Every quiz MUST define these in its `CONFIG` object:

```javascript
const CONFIG = {
  OFFER_URL: '/offer/',
  SOURCE_TRACKING: 'quiz-X',  // Used for GTM, Supabase, and URL params
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  // IMPORTANT: Always use this exact anon key for all quizzes
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E'
};
```

### URL Parameters for Offer Page

All quizzes redirect to `/offer/` with URL parameters. **New quizzes MUST include all standard parameters.**

#### Standard Parameters (ALL quizzes)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `source` | string | Quiz source identifier | `quiz-2`, `quiz-3` |
| `name` | string | User's first name | `Sarah` |
| `email` | string | User's email | `sarah@example.com` |
| `protocol` | string | Protocol key | `bloat_reset`, `regularity`, `calm_gut`, `stability`, `rebuild` |
| `protocol_name` | string | Display name | `Bloat Reset Protocol` |
| `gut_brain` | boolean | Has gut-brain overlay | `true` / `false` |
| `primary_complaint` | string | Main symptom | `bloating`, `constipation`, `diarrhea`, `mixed`, `pain`, `gas`, `reflux` |
| `primary_complaint_label` | string | Display text | `Bloating & distension` |
| `duration` | string | How long symptoms | `less_than_6_months`, `6-12_months`, `1-3_years`, `3-5_years`, `5+_years` |
| `diagnoses` | string | Comma-separated | `ibs,sibo,food_intolerance` |
| `treatments` | string | Comma-separated keys | `low_fodmap,probiotics,gluten_free` |
| `treatments_formatted` | string | Display text | `Low FODMAP, probiotics, and gluten-free diet` |
| `stress_level` | string | Stress connection | `significant`, `some`, `none` |
| `life_impact` | string | Impact level | `severe`, `moderate`, `mild` |
| `vision` | string | Dream outcome (max 200 chars, URL encoded) | User's free text response |

#### Quiz-3 Specific Parameters

| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `goal_selection` | string | What would change their life | `comfortable_eating`, `bathroom_freedom`, `energy_focus`, `understanding` |
| `journey_stage` | string | Where in gut health journey | `just_starting`, `tried_few`, `tried_everything`, `returned` |

### Supabase Data Structure

All quizzes submit to Supabase via the `insert_quiz_lead` RPC function. **New quizzes MUST include all fields.**

#### Required Fields

```javascript
const userRecord = {
  // Contact info
  name: string | null,
  email: string | null,

  // Source tracking (REQUIRED)
  quiz_source: 'quiz-1' | 'quiz-2' | 'quiz-3' | 'quiz-X',
  lead_source: string | null,  // First entry point, never overwritten (e.g., 'food-list', 'quiz-4')

  // Quiz-3+ specific (include even if null)
  goal_selection: string | null,
  journey_stage: string | null,

  // Protocol info
  protocol: number,           // 1-5 (see protocol mapping below)
  protocol_name: string,
  has_stress_component: boolean,

  // Red flag info
  has_red_flags: boolean,
  red_flag_evaluated_cleared: boolean,
  red_flag_details: object | null,  // JSONB

  // Question answers (Q5-Q18)
  primary_complaint: string,      // Q5
  symptom_frequency: string,      // Q6
  relief_after_bm: string,        // Q7
  frequency_during_flare: string, // Q8
  stool_during_flare: string,     // Q9
  duration: string,               // Q10
  diagnoses: array,               // Q11 (JSONB array)
  treatments_tried: array,        // Q12 (JSONB array)
  stress_connection: string,      // Q13
  mental_health_impact: string,   // Q14
  sleep_quality: string,          // Q15
  life_impact_level: string,      // Q16
  hardest_part: string,           // Q17 (free text)
  dream_outcome: string,          // Q18 (free text)

  // User status
  role: 'member',
  status: 'lead'
};
```

#### Protocol Number Mapping

```javascript
const PROTOCOL_NUMBERS = {
  bloat_reset: 1,
  regularity: 2,
  calm_gut: 3,
  stability: 4,
  rebuild: 5
};
```

### GTM Tracking

All quizzes push events to `dataLayer` for Google Tag Manager.

```javascript
window.dataLayer.push({
  'event': 'quiz_step',
  'quiz_section': 'part1_q1',  // Section name
  'quiz_source': CONFIG.SOURCE_TRACKING
});
```

#### Standard Section Names

- `intro`, `intro_goal`, `intro_journey`, `intro_validation`
- `part1_intro`, `part1_q1` through `part1_q4`, `part1_red_flag_warning`, `part1_practitioner_intro`
- `part2_intro`, `part2_q1` through `part2_q5`, `part2_protocol_preview`
- `email_capture`
- `part3_intro`, `part3_q1` through `part3_q3`, `part3_validation`
- `testimonial_suzy`, `testimonial_amanda`, `testimonial_cheryl`
- `part4_intro`, `part4_q1` through `part4_q3`
- `part5_intro`, `part5_q1` through `part5_q3`
- `results_calculating`, `results_shown`, `offer_redirect`

### Webhook Payload (Make.com)

All quizzes send data to Make.com webhook with this structure:

```javascript
const payload = {
  // Contact
  name: string,
  email: string,

  // Protocol
  protocol_number: number,
  protocol_name: string,
  protocol_description: string,
  has_stress_component: boolean,

  // Quiz-specific
  goal_selection: string,      // Quiz-3+
  journey_stage: string,       // Quiz-3+

  // All question answers (q1-q18)
  q1_weight_loss: string,
  q2_blood: string,
  q3_family_history: string,
  q4_colonoscopy: string,
  q5_primary_complaint: string,
  q6_frequency: string,
  q7_bm_relief: string,
  q8_frequency_change: string,
  q9_stool_change: string,
  q10_duration: string,
  q11_diagnosis: string,       // Comma-separated
  q12_tried: string,           // Comma-separated
  q13_stress: string,
  q14_mental_health: string,
  q15_sleep: string,
  q16_life_impact: string,
  q17_hardest_part: string,
  q18_vision: string,

  // Red flags
  had_red_flags: boolean,
  red_flag_evaluated_cleared: boolean,

  // Tracking
  source: string,              // CONFIG.SOURCE_TRACKING
  submitted_at: string         // ISO timestamp
};
```

### Building a New Quiz Version

1. **Copy quiz-3 as template** (most complete version)
2. **Update CONFIG.SOURCE_TRACKING** to `quiz-X`
3. **Include ALL standard URL parameters** in `redirectToOffer()`
4. **Include ALL Supabase fields** in `submitToSupabase()`
5. **Include ALL webhook fields** in `sendWebhook()`
6. **Add GTM tracking** for all steps
7. **Update Supabase RPC** if adding new fields (run SQL in Supabase)
8. **Test data flow**: Quiz → Supabase, Quiz → Make.com, Quiz → Offer URL

### Question ID Reference

| ID | Question | Section |
|----|----------|---------|
| `q1_weight_loss` | Unexplained weight loss? | Safety |
| `q2_blood` | Blood in stool? | Safety |
| `q3_family_history` | Family history GI cancer? | Safety |
| `q4_colonoscopy` | Need colonoscopy? | Safety |
| `q5_primary_complaint` | Primary symptom | Symptoms |
| `q6_frequency` | How often symptoms? | Symptoms |
| `q7_bm_relief` | Relief after BM? | Symptoms |
| `q8_frequency_change` | Frequency during flare? | Symptoms |
| `q9_stool_change` | Stool changes during flare? | Symptoms |
| `q10_duration` | How long dealing with this? | History |
| `q11_diagnosis` | Diagnoses received | History |
| `q12_tried` | Treatments tried | History |
| `q13_stress` | Stress connection | Gut-Brain |
| `q14_mental_health` | Mental health impact | Gut-Brain |
| `q15_sleep` | Sleep quality | Gut-Brain |
| `q16_life_impact` | Life impact level | Impact |
| `q17_hardest_part` | Hardest part (free text) | Impact |
| `q18_vision` | Dream outcome (free text) | Impact |

### Files to Update When Adding New Quiz Fields

1. **Quiz JavaScript** (`quiz-X/script.js`)
   - `submitToSupabase()` function
   - `sendWebhook()` function
   - `redirectToOffer()` function

2. **Supabase RPC** (`supabase-update.sql`)
   - Add column to INSERT INTO
   - Add value extraction in VALUES

3. **Offer Page** (`offer/script.js` or `offer/index.html`)
   - Parse new URL parameters
   - Display personalized content

4. **This Documentation** (CLAUDE.md)
   - Update parameter tables
   - Update field references

---

## Landing Page Lead Capture (Supabase)

All landing pages with email capture forms MUST submit leads to Supabase using the `upsert_quiz_lead` RPC. This ensures leads are stored in the same users table as quiz leads, allowing email-based matching when a lead later takes a quiz.

### Required Setup

1. **Load Supabase JS client** (before your script):
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

2. **Initialize Supabase client**:
```javascript
var SUPABASE_URL = 'https://mwabljnngygkmahjgvps.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E';
var LEAD_SOURCE = 'food-list'; // Change per landing page

var supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log('Supabase not available');
}
```

3. **Submit lead function** (reuse across all landing pages, only change `LEAD_SOURCE`):
```javascript
async function submitToSupabase(name, email) {
  if (!supabaseClient || !email) return;

  try {
    var userRecord = {
      name: name || null,
      email: email,
      quiz_source: LEAD_SOURCE,
      lead_source: LEAD_SOURCE,

      // All RPC fields - null for landing page leads
      goal_selection: null,
      journey_stage: null,
      protocol: null,
      protocol_name: null,
      has_stress_component: false,
      has_red_flags: false,
      red_flag_evaluated_cleared: false,
      red_flag_details: null,
      primary_complaint: null,
      symptom_frequency: null,
      relief_after_bm: null,
      frequency_during_flare: null,
      stool_during_flare: null,
      duration: null,
      diagnoses: [],
      treatments_tried: [],
      stress_connection: null,
      mental_health_impact: null,
      sleep_quality: null,
      life_impact_level: null,
      hardest_part: null,
      dream_outcome: null,

      role: 'member',
      status: 'lead'
    };

    var result = await supabaseClient.rpc('upsert_quiz_lead', {
      user_data: userRecord
    });

    if (result.error) {
      console.error('Supabase insert error:', result.error);
    }
  } catch (e) {
    console.error('Error submitting to Supabase:', e);
  }
}
```

4. **Call in form handler** (before webhook/redirect):
```javascript
await submitToSupabase(data.first_name, data.email);
```

### How Email Matching Works

- Landing page creates a minimal record with `quiz_source: 'food-list'`, `lead_source: 'food-list'`, and `status: 'lead'`
- When the same email later takes a quiz, `upsert_quiz_lead` matches on email and updates the record with full quiz data
- `quiz_source` is updated to the quiz value (e.g., `'quiz-4'`) — tracks most recent quiz completed
- `lead_source` is **never overwritten** — always keeps the original entry point (e.g., `'food-list'`)

### Landing Page Source IDs

| Landing Page | Source ID |
|-------------|-----------|
| `/food-list/` | `food-list` |
| `/toolkit/` | `toolkit` |
| `/webinar/` | `webinar` |

**When creating a new landing page**, add its source ID to this table.

---

## Offer Page Documentation

This section documents the offer page infrastructure for creating variants and A/B testing.

### Offer Page Overview

| Page | Path | Purpose |
|------|------|---------|
| Offer (Original) | `/offer/` | Main offer page, receives traffic from all quizzes |

### File Structure

```
/offer/
├── index.html          # Main offer page HTML
├── index-old.html      # Previous version (backup)
├── css/
│   └── styles.css      # Offer page styling
├── js/
│   ├── script.js       # Main functionality (URL params, Stripe, personalization)
│   └── main.js         # Additional scripts (if any)
├── assets/
│   ├── favicon.png
│   ├── Logo.png
│   ├── landscape-logo.png
│   ├── square-logo.png
│   ├── tracking-mockup.png
│   ├── Gut-healing-academy-hero-image.png
│   ├── Minimalist-Bloating.png
│   ├── Minimalist-constipation.png
│   ├── Minimalist-Diarrhea.png
│   ├── Minimalist-mixed.png
│   ├── Minimalist-gut-brain.png
│   ├── Minimalist-Post-SIBO-recovert.png
│   ├── suzy.png         # Testimonial photo
│   ├── amanda.png       # Testimonial photo
│   ├── cheryl.png       # Testimonial photo
│   ├── paulina.png      # Practitioner photo
│   └── rebecca.png      # Practitioner photo
└── README.md
```

### URL Parameters (Received from Quiz)

The offer page reads these parameters from the URL and uses them for personalization:

| Parameter | Used For | Default Value |
|-----------|----------|---------------|
| `source` | Analytics tracking | `''` |
| `name` | Personalized greeting | `'Friend'` |
| `email` | Stripe prefill | `''` |
| `protocol` | Protocol key | `''` |
| `protocol_name` | Display in header | `'Personalized Gut Healing'` |
| `gut_brain` | Show nervous system badge | `false` |
| `primary_complaint` | Testimonial matching | `'digestive'` |
| `primary_complaint_label` | Assessment display | `''` |
| `duration` | Assessment display | `''` |
| `diagnoses` | Assessment display | `''` |
| `treatments` | Assessment display | `''` |
| `treatments_formatted` | Assessment display (preferred) | `''` |
| `stress_level` | Assessment display | `''` |
| `life_impact` | Analytics | `''` |
| `vision` | Goal callback section | `''` |
| `goal_selection` | Quiz-3 specific | `''` |
| `journey_stage` | Quiz-3 specific | `''` |

### Key JavaScript Functions (js/script.js)

```javascript
// URL parameter parsing
getUrlParams()           // Returns object with all URL parameters

// Personalization
populatePersonalizedContent()  // Updates name, protocol, complaint throughout page
populateAssessmentSection()    // Fills "Your Assessment Revealed" card
populateSocialProof()          // Selects testimonial based on primary_complaint

// Stripe integration
setupStripeLinks()       // Attaches payment links with prefilled email
trackCheckout()          // GTM tracking for checkout clicks

// UI
initStickyCTA()          // Mobile sticky button behavior
initTimelineAnimation()  // Animated healing timeline
```

### Stripe Payment Links

Located at the top of `js/script.js`:

```javascript
const STRIPE_LINKS = {
  monthly: 'https://buy.stripe.com/bJe28seyJaf8d4ch1rgA802',    // $47/month
  fourMonth: 'https://buy.stripe.com/cNfZigGRdrkaW45iJgA807',   // $149/4mo
  annual: 'https://buy.stripe.com/bJe5kEduF1IC1lu26xgA803'      // $297/year
};
```

### Testimonial Matching Logic

Testimonials are matched to `primary_complaint` parameter:

| Complaint | Testimonial | Quote Focus |
|-----------|-------------|-------------|
| `bloating` | Suzy | "6 months pregnant" bloating gone |
| `constipation` | Amanda | Regular, comfortable digestion |
| `diarrhea` | Cheryl | Bathroom mapping, urgency |
| `mixed` | Cheryl | Unpredictability resolved |
| `pain` | Amanda | Cramping relief |
| `gas` | Suzy | Social situations |
| `reflux` | Amanda | Burning, eating without fear |

### Duplicating the Offer Page

#### Step 1: Copy the Directory

```bash
cp -r /offer /offer-2
```

#### Step 2: Update Stripe Links (if different pricing/plans)

In `offer-2/js/script.js`, update the `STRIPE_LINKS` object if you want different payment links:

```javascript
const STRIPE_LINKS = {
  monthly: 'https://buy.stripe.com/YOUR_NEW_MONTHLY_LINK',
  fourMonth: 'https://buy.stripe.com/YOUR_NEW_4MONTH_LINK',
  annual: 'https://buy.stripe.com/YOUR_NEW_ANNUAL_LINK'
};
```

#### Step 3: Update Quiz to Redirect to New Offer

In the quiz's `script.js`, update `CONFIG.OFFER_URL`:

```javascript
const CONFIG = {
  OFFER_URL: '/offer-2/',  // Changed from '/offer/'
  // ... rest of config
};
```

#### Step 4: (Optional) Add Redirect from Original Offer

If you want ALL traffic to go to the new offer, create a redirect in `offer/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- GTM code here -->
  <meta http-equiv="refresh" content="0;url=/offer-2/">
  <script>
    // Preserve URL parameters in redirect
    window.location.replace('/offer-2/' + window.location.search);
  </script>
</head>
<body>
  <p>Redirecting...</p>
  <a href="/offer-2/">Click here if not redirected</a>
</body>
</html>
```

**IMPORTANT:** The redirect MUST preserve `window.location.search` to pass URL parameters!

### Testing Checklist for Offer Page Variants

- [ ] URL parameters pass through correctly (check browser console: `Offer page params:`)
- [ ] User name displays correctly in header
- [ ] Protocol name displays correctly
- [ ] Primary complaint label shows in assessment card
- [ ] Correct testimonial displays based on complaint
- [ ] Gut-brain badge shows when `gut_brain=true`
- [ ] Goal section shows when `vision` parameter exists
- [ ] Stripe links work and prefill email
- [ ] GTM tracking fires on page load
- [ ] GTM tracking fires on checkout button clicks
- [ ] Sticky CTA works on mobile
- [ ] Timeline animation triggers on scroll

### Files to Update When Creating Offer Variants

1. **Copy entire `/offer/` directory** to `/offer-X/`
2. **Update Stripe links** in `offer-X/js/script.js` (if different pricing)
3. **Update quiz CONFIG** to point to new offer URL
4. **Update CLAUDE.md** to document the new variant

### Offer Page Sections Reference

| Section | Purpose | Personalization |
|---------|---------|-----------------|
| Header | Protocol name, greeting | `name`, `protocol_name`, `gut_brain` |
| Assessment Card | Shows quiz answers | `primary_complaint_label`, `duration`, `diagnoses`, `treatments_formatted`, `stress_level` |
| Timeline | Healing journey animation | None (static) |
| Goal Callback | User's vision | `vision` (only shows if exists) |
| What's Included | Protocol features | `protocol_name`, `primary_complaint` |
| Social Proof | Testimonial | `primary_complaint` (selects testimonial) |
| Pricing | Three plan options | `email` (prefills Stripe) |
| Guarantee | 60-day guarantee | None (static) |
| Trust Footer | Credentials, payment icons | None (static) |
