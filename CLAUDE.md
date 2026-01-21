# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**IMPORTANT: All new HTML pages MUST include Google Tag Manager.**

GTM Container ID: `GTM-KQ3LKTBL`

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
  SUPABASE_ANON_KEY: '...'
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
