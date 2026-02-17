# Landing Page Template Reference

Everything needed to build a new landing page for the Gut Healing Academy site. Copy the code snippets, fill in the placeholders, and you'll have a page with all tracking, lead capture, and integrations working.

---

## Quick Start Checklist

- [ ] Create directory: `/your-page-name/`
- [ ] Create `index.html` with the HTML boilerplate below
- [ ] Add GTM (head script + body noscript)
- [ ] Add DataLayer initialization (before GTM)
- [ ] Add favicon, meta tags, Open Graph tags
- [ ] Add Google Fonts (DM Serif Display + Source Sans 3)
- [ ] Add global CSS/JS includes (header, footer, support widget)
- [ ] Add `<footer class="site-footer"></footer>` element (auto-injected by JS)
- [ ] Add lead capture form with Supabase + Make.com webhook
- [ ] Add GTM tracking events for form submission
- [ ] Choose a unique `LEAD_SOURCE` identifier
- [ ] Create a Make.com webhook scenario and get the URL
- [ ] Create a thank-you page at `/your-page-name-thanks/`
- [ ] Update `CLAUDE.md` Landing Page Source IDs table
- [ ] Test everything (form, Supabase, webhook, GTM, redirect)

---

## 1. HTML Head Boilerplate

Copy this entire `<head>` block. Replace lines marked with `CUSTOMIZE`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Data Layer Initialization (MUST be before GTM) -->
    <script>
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        'pageType': 'landing',
        'pageName': document.title,
        'pageUrl': window.location.href,
        'pagePath': window.location.pathname,
        'userId': '',
        'userEmail': '',
        'userStatus': 'anonymous',
        'trialDaysRemaining': null,
        'gutPattern': '',
        'hasStressComponent': null,
        'symptomDuration': '',
        'previousTreatments': [],
        'previousDiagnoses': []
      });
    </script>

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KQ3LKTBL');</script>
    <!-- End Google Tag Manager -->

    <!-- Referral Tracking -->
    <script src="https://app.guthealingacademy.com/referral-tracker.js"></script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- CUSTOMIZE: Page title -->
    <title>Your Page Title | Gut Healing Academy</title>

    <!-- CUSTOMIZE: Meta description -->
    <meta name="description" content="Your page description here.">

    <!-- CUSTOMIZE: Canonical URL -->
    <link rel="canonical" href="https://guthealingacademy.com/your-page-name/">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/favicon.png">

    <!-- CUSTOMIZE: Open Graph tags -->
    <meta property="og:title" content="Your OG Title">
    <meta property="og:description" content="Your OG description.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/assets/og-image.jpg">

    <!-- Google Fonts - Citrus Energy Theme -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- CUSTOMIZE: Your page CSS (inline or external file) -->
    <link rel="stylesheet" href="css/styles.css">

    <!-- Global CSS -->
    <link rel="stylesheet" href="/css/global-header.css">
    <link rel="stylesheet" href="/css/global-footer.css">
    <link rel="stylesheet" href="/css/support-widget.css">
</head>
```

### Head element order matters:

1. DataLayer init (before GTM)
2. GTM script
3. Referral tracker
4. Meta charset + viewport
5. Title + description + canonical
6. Favicon
7. Open Graph
8. Google Fonts (with preconnect)
9. CSS files (page-specific first, then globals)

---

## 2. HTML Body Boilerplate

```html
<body>
    <!-- Google Tag Manager (noscript) - MUST be immediately after <body> -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQ3LKTBL"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- Site Header -->
    <header class="site-header">
        <div class="header-container">
            <a href="/" class="header-logo"><img src="/assets/Logo.png" alt="Gut Healing Academy"></a>
            <nav class="header-nav">
                <a href="/about/">About</a>
                <a href="/foods/">Food Guides</a>
                <a href="/tools/">Tools</a>
                <a href="/legal/contact.html">Contact</a>
                <div class="nav-divider"></div>
                <a href="https://app.guthealingacademy.com/" class="nav-login">Members Area</a>
            </nav>
            <button class="mobile-menu-btn" aria-label="Toggle menu" onclick="document.querySelector('.mobile-menu').classList.toggle('active')">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="mobile-menu">
            <a href="/about/">About</a>
            <a href="/foods/">Food Guides</a>
            <a href="/tools/">Tools</a>
            <a href="/legal/contact.html">Contact</a>
            <a href="https://app.guthealingacademy.com/" class="nav-login">Members Area</a>
        </div>
    </header>

    <!-- CUSTOMIZE: Your page content goes here -->
    <div class="landing-page">

        <!-- Your sections... -->

    </div>

    <!-- Footer (auto-injected by global-footer.js) -->
    <footer class="site-footer"></footer>

    <!-- Sticky CTA (Mobile Only) - Optional -->
    <div class="sticky-cta" id="stickyCta">
        <!-- CUSTOMIZE: Your sticky CTA link -->
        <a href="/quiz-4/" class="cta-button sticky-cta-button">Take the Quiz &rarr;</a>
    </div>

    <!-- Supabase JS Client (required for lead capture) -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <!-- CUSTOMIZE: Your page JavaScript (inline or external) -->
    <script>
      // Your page scripts here...
    </script>

    <!-- Global scripts (MUST be at end of body) -->
    <script src="/js/global-footer.js"></script>
    <script src="/js/support-widget.js"></script>
</body>
</html>
```

### Body element order matters:

1. GTM noscript (immediately after `<body>`)
2. Site header
3. Page content
4. `<footer class="site-footer"></footer>` (empty - filled by JS)
5. Sticky CTA div (if needed)
6. Supabase CDN script
7. Page-specific JavaScript
8. `global-footer.js` (injects footer HTML)
9. `support-widget.js` (floating support chat)

---

## 3. CSS Variables (Citrus Energy Theme)

The standard color system used across the site. Include in your page CSS.

```css
:root {
  /* Background Colors */
  --bg-warm-white: #FFFDF7;
  --bg-cream: #FBF9F3;
  --bg-sage-subtle: #F7FAF7;
  --white: #FFFFFF;

  /* Text Colors */
  --text-forest: #1B3329;
  --text-olive: #3D5245;
  --text-muted: #6B7D6E;
  --text-light: #8A9A8E;

  /* Primary - Citrus Accent */
  --citrus: #F9C74F;
  --citrus-bright: #FFDA6A;
  --citrus-light: #FFF3CD;
  --citrus-pale: #FFFBEB;

  /* Secondary - Greens */
  --forest: #1B3329;
  --forest-light: #2A4A3A;
  --leaf: #4A7C59;
  --spring: #7FB069;
  --sage: #A8C5A8;

  /* Utility Colors */
  --success: #52B788;
  --success-light: #E8F5EE;
  --divider: #E8EBE8;
  --divider-dark: #D4DAD5;
}
```

---

## 4. CSS Patterns

### Reset + Base Typography

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg-warm-white);
  min-height: 100vh;
  color: var(--text-olive);
  line-height: 1.6;
}
```

**Font usage:**
- **Headers:** `font-family: 'DM Serif Display', serif; font-weight: 400;`
- **Body text:** `font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;`

### CTA Button

```css
.cta-button {
  display: block;
  width: 100%;
  padding: 18px 36px;
  background: var(--forest);
  color: var(--white);
  font-size: 1.05rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(27, 51, 41, 0.2);
  min-height: 56px;
  text-decoration: none;
  text-align: center;
}

.cta-button:hover {
  background: var(--citrus);
  color: var(--forest);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(249, 199, 79, 0.4);
}

.cta-button:active {
  transform: translateY(0);
}

/* Desktop: auto-width instead of full-width */
@media (min-width: 1024px) {
  .cta-button {
    width: auto;
    max-width: 320px;
  }
}
```

### Text Highlight (Gradient Underline)

```css
.text-highlight {
  background: linear-gradient(to bottom, transparent 60%, var(--citrus-light) 60%);
  padding: 0 4px;
}
```

Usage: `<span class="text-highlight">highlighted words</span>`

### Validation Card (Citrus Left Border)

```css
.validation-card {
  background: var(--citrus-pale);
  border-left: 4px solid var(--citrus);
  border-radius: 0 16px 16px 0;
  padding: 28px 32px;
  max-width: 600px;
  margin: 0 auto;
}
```

### Testimonials (Scroll on Mobile, Grid on Desktop)

```css
/* Mobile: horizontal scroll */
.testimonials-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 20px 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.testimonials-container::-webkit-scrollbar {
  display: none;
}

.testimonial-card {
  flex: 0 0 280px;
  background: var(--white);
  border-radius: 14px;
  border: 1px solid var(--divider);
  padding: 24px;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.testimonial-photo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--citrus-light);
  object-fit: cover;
  margin-bottom: 16px;
}

.testimonial-stars {
  color: var(--citrus);
  font-size: 14px;
  letter-spacing: 2px;
}

/* Desktop: 3-column grid */
@media (min-width: 1024px) {
  .testimonials-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    overflow-x: visible;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0;
  }

  .testimonial-card {
    flex: none;
  }
}
```

### Sticky CTA (Mobile Only)

CSS:
```css
.sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--white);
  padding: 12px 16px;
  box-shadow: 0 -4px 20px rgba(27, 51, 41, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.2s, transform 0.2s;
}

.sticky-cta.visible {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* Add footer padding on mobile so content isn't hidden behind sticky CTA */
@media (max-width: 1023px) {
  .site-footer {
    padding-bottom: 100px;
  }
}

/* Hide on desktop */
@media (min-width: 1024px) {
  .sticky-cta {
    display: none !important;
  }
}
```

JavaScript (Intersection Observer):
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const stickyCta = document.getElementById('stickyCta');
  const primaryCta = document.querySelector('.primary-cta');

  if (stickyCta && primaryCta && window.innerWidth < 1024) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCta.classList.add('visible');
        } else {
          stickyCta.classList.remove('visible');
        }
      });
    }, { threshold: 0, rootMargin: '0px' });

    observer.observe(primaryCta);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && stickyCta) {
      stickyCta.classList.remove('visible');
    }
  });
});
```

### Lead Capture Form Styling

```css
.lead-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.lead-form input {
  width: 100%;
  padding: 16px;
  font-size: 16px;   /* 16px prevents iOS zoom on focus */
  font-family: inherit;
  border: 1px solid var(--divider);
  border-radius: 8px;
  background: var(--white);
  color: var(--text-forest);
}

.lead-form input:focus {
  outline: none;
  border-color: var(--forest);
  box-shadow: 0 0 0 3px rgba(27, 51, 41, 0.1);
}

.lead-form input::placeholder {
  color: var(--text-light);
}

.privacy-text {
  font-size: 13px;
  color: var(--text-light);
  text-align: center;
}

/* Desktop: constrain form width */
@media (min-width: 768px) {
  .lead-form {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

### Page Fade-In Animation

```css
.landing-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Responsive Breakpoints

```css
/* Mobile first (default) — 0 to 767px */

/* Tablet — 768px+ */
@media (min-width: 768px) { }

/* Desktop — 1024px+ */
@media (min-width: 1024px) { }
```

**Padding strategy:**
- Mobile: `20px` horizontal
- Tablet/Desktop: `24px` horizontal
- Max container width: `1200px` (hero), `600px` (text content), `1000px` (testimonials grid)

---

## 5. Lead Capture Form (Full Implementation)

### Form HTML

```html
<form id="lead-form" class="lead-form">
  <input type="email" name="email" placeholder="Your email address" required>
  <input type="text" name="first_name" placeholder="First name (optional)">
  <button type="submit" class="cta-button">Send Me Access</button>
</form>
<p class="privacy-text">No spam. Unsubscribe anytime.</p>
```

### Supabase Initialization

```html
<!-- Load BEFORE your script -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
var SUPABASE_URL = 'https://mwabljnngygkmahjgvps.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E';

// CUSTOMIZE: Your unique lead source identifier
var LEAD_SOURCE = 'your-page-name';

var supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log('Supabase not available');
}
</script>
```

### submitToSupabase Function

Copy exactly as-is. ALL fields are required by the RPC even though they're null for landing pages.

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
    } else {
      console.log('Supabase lead submitted:', LEAD_SOURCE);
    }
  } catch (e) {
    console.error('Error submitting to Supabase:', e);
  }
}
```

### Form Submission Handler

```javascript
document.getElementById('lead-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  var form = e.target;
  var submitBtn = form.querySelector('button[type="submit"]');
  var originalText = submitBtn.textContent;

  // Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  var formData = new FormData(form);
  var data = Object.fromEntries(formData);

  // Collect UTM parameters from URL
  var urlParams = new URLSearchParams(window.location.search);
  data.utm_source = urlParams.get('utm_source') || '';
  data.utm_medium = urlParams.get('utm_medium') || '';
  data.utm_campaign = urlParams.get('utm_campaign') || '';
  data.source = LEAD_SOURCE;

  try {
    // 1. Send to Supabase
    await submitToSupabase(data.first_name, data.email);

    // 2. Send to Make.com webhook
    // CUSTOMIZE: Your Make.com webhook URL
    try {
      await fetch('https://hook.eu1.make.com/YOUR_WEBHOOK_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('Webhook send failed (non-critical):', err);
    }

    // 3. Fire GTM tracking events
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'generate_lead',
      'source': LEAD_SOURCE
    });
    // CUSTOMIZE: Page-specific event name
    window.dataLayer.push({
      'event': 'your_page_signup',
      'source': LEAD_SOURCE
    });

    // 4. Redirect to thank-you page (preserve UTM params)
    // CUSTOMIZE: Your thank-you page path
    window.location.href = '/your-page-name-thanks/' + window.location.search;

  } catch (error) {
    console.error('Form submission error:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    alert('Something went wrong. Please try again.');
  }
});
```

### Multiple Forms (Same Page)

If you have a hero form and a footer form (like the toolkit page), use a shared handler:

```javascript
async function handleFormSubmit(e) {
  // ... same logic as above ...
}

document.getElementById('hero-form').addEventListener('submit', handleFormSubmit);
document.getElementById('footer-form').addEventListener('submit', handleFormSubmit);
```

---

## 6. Tracking Reference

### GTM Container ID

```
GTM-KQ3LKTBL
```

### DataLayer on Page Load

Already included in the head boilerplate above. Pushes: `pageType`, `pageName`, `pageUrl`, `pagePath`, user data placeholders, quiz/protocol data placeholders.

### GTM Events on Form Submission

Every landing page fires TWO events on successful form submit:

```javascript
// Generic lead event (all pages fire this)
window.dataLayer.push({
  'event': 'generate_lead',
  'source': LEAD_SOURCE
});

// Page-specific event
window.dataLayer.push({
  'event': 'your_page_signup',   // CUSTOMIZE
  'source': LEAD_SOURCE
});
```

**Existing event names for reference:**

| Page | Event Name |
|------|-----------|
| `/food-list/` | `food_list_signup` |
| `/toolkit/` | `toolkit_signup` |
| `/webinar/` | `webinar_registration` |

### UTM Parameter Collection

Always collect UTMs from the URL and include in webhook payload:

```javascript
var urlParams = new URLSearchParams(window.location.search);
data.utm_source = urlParams.get('utm_source') || '';
data.utm_medium = urlParams.get('utm_medium') || '';
data.utm_campaign = urlParams.get('utm_campaign') || '';
```

### Preserving UTM Params on Redirect

Always append `window.location.search` when redirecting:

```javascript
window.location.href = '/your-page-thanks/' + window.location.search;
```

### Preserving UTM Params on Internal CTA Links

If your page has CTA links to other pages (like `/quiz-4/`), pass UTMs through:

```javascript
(function() {
  var cta = document.getElementById('my-cta');
  var currentParams = window.location.search;
  if (currentParams && cta) {
    cta.href = '/quiz-4/' + currentParams;
  }
})();
```

---

## 7. Constants Reference

### Supabase

| Key | Value |
|-----|-------|
| URL | `https://mwabljnngygkmahjgvps.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E` |
| RPC Function | `upsert_quiz_lead` |
| CDN | `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` |

### GTM

| Key | Value |
|-----|-------|
| Container ID | `GTM-KQ3LKTBL` |

### Existing Landing Page Source IDs

| Landing Page | Source ID | Make.com Webhook |
|-------------|-----------|-----------------|
| `/food-list/` | `food-list` | `https://hook.eu1.make.com/3diaa7auhk4z66olqy4c3m1cqusa5dvf` |
| `/toolkit/` | `toolkit` | `https://hook.eu1.make.com/lav7ba2xroxgt30w2qchqcxocsurggt2` |
| `/webinar/` | `webinar` | `https://hook.eu1.make.com/51fdn4b4bv6v2t1figmea6q2dlycogtd` |

### Global Scripts (Must Include)

| Script | Path | Purpose |
|--------|------|---------|
| Global Footer | `/js/global-footer.js` | Injects footer into `<footer class="site-footer">` |
| Support Widget | `/js/support-widget.js` | Floating support chat (bottom-right) |
| Referral Tracker | `https://app.guthealingacademy.com/referral-tracker.js` | Referral attribution |

### Global CSS

| File | Purpose |
|------|---------|
| `/css/global-header.css` | Site header + mobile menu |
| `/css/global-footer.css` | Footer styling (dark bg, links, copyright) |
| `/css/support-widget.css` | Support widget styling |

---

## 8. How Email Matching Works (Supabase)

Understanding this is important for choosing the right `LEAD_SOURCE`:

1. Landing page creates a record with `quiz_source: 'your-page'` and `lead_source: 'your-page'`
2. When the same email later takes a quiz, `upsert_quiz_lead` matches on email
3. `quiz_source` gets updated to the quiz value (e.g., `quiz-4`) — tracks most recent interaction
4. `lead_source` is **never overwritten** — always keeps the original entry point

This means you can track which landing page originally captured a lead, even after they take a quiz.

---

## 9. Go-Live Checklist

### Before launch:

- [ ] **LEAD_SOURCE**: Choose a unique identifier (e.g., `your-page-name`)
- [ ] **Make.com webhook**: Create a new scenario, get the webhook URL
- [ ] **Thank-you page**: Create `/your-page-name-thanks/index.html`
- [ ] **CLAUDE.md**: Add your source ID to the "Landing Page Source IDs" table

### Testing:

- [ ] Form submits without errors (check browser console)
- [ ] Supabase record created (check Supabase dashboard, `users` table)
- [ ] Make.com webhook receives data (check Make.com scenario history)
- [ ] GTM events fire (check browser console: `dataLayer` or use GTM Preview mode)
- [ ] Redirect goes to thank-you page with UTM params preserved
- [ ] Page renders correctly on mobile (320px width)
- [ ] Page renders correctly on desktop (1440px width)
- [ ] All links work (CTA buttons, header nav, footer links)
- [ ] Favicon shows in browser tab
- [ ] Footer auto-injected with disclaimer and links
- [ ] Support widget appears (bottom-right corner)
- [ ] If using sticky CTA: appears on mobile scroll, hidden on desktop

### After launch:

- [ ] Test a real form submission end-to-end
- [ ] Verify email arrives via Make.com automation
- [ ] Check Supabase record has correct `lead_source`
- [ ] Verify GTM events in Google Tag Manager / GA4
