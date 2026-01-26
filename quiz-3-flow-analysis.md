# Quiz-3 Flow Analysis

## Overview
Quiz-3 is a survey-style gut health assessment with a "goal-first" intro variant. It features interstitials, practitioner intros, and testimonials throughout the flow.

**Source ID:** `quiz-3`
**Offer URL:** `/offer-3/`

---

## Complete Flow Structure

### Section 0: YOUR GOALS (Intro)
*3 screens before main quiz begins*

#### Screen 1: Goal Selection
**Question:** "What would change your life most right now?"

| Option | Value |
|--------|-------|
| Finally feeling comfortable after eating | `comfortable_eating` |
| Eating without mapping every bathroom | `bathroom_freedom` |
| Getting my energy and focus back | `energy_focus` |
| Understanding why nothing has worked | `understanding` |

#### Screen 2: Journey Stage
**Question:** "Where are you in your gut health journey?"

| Option | Value |
|--------|-------|
| Just starting to figure this out | `just_starting` |
| Tried a few things, still struggling | `tried_few` |
| Tried everything, nothing works | `tried_everything` |
| Had some success but symptoms returned | `returned` |

#### Screen 3: Validation Interstitial
**Heading:** "You're in the right place."
**Subtext:** "Most of our members started exactly where you are. Let's build something that actually works for your situation."
**CTA:** Continue →

---

### Section 1: SAFETY SCREENING
*4 questions with red flag detection*

#### Intro Screen
**Heading:** "First, a few quick health questions"
**Subtext:** "These help us make sure this assessment is right for you — and that you don't need to see a doctor first."
**Reassurance:** "Most people breeze through these in under a minute."

#### Q1: Weight Loss (q1_weight_loss)
**Question:** "Have you lost more than 10 lbs in the past 3 months without trying to?"

| Option | Value | Red Flag |
|--------|-------|----------|
| Yes | `yes` | **YES** |
| No | `no` | No |

#### Q2: Blood in Stool (q2_blood)
**Question:** "Have you noticed blood in your stool, or stools that are black and tarry?"

| Option | Value | Red Flag |
|--------|-------|----------|
| Yes | `yes` | **YES** |
| No | `no` | No |

#### Q3: Family History (q3_family_history)
**Question:** "Does anyone in your immediate family have colon cancer or inflammatory bowel disease?"

| Option | Value | Red Flag |
|--------|-------|----------|
| Yes | `yes` | **YES** |
| No | `no` | No |
| I'm not sure | `unsure` | No |

#### Q4: Colonoscopy (q4_colonoscopy)
**Question:** "Are you over 50 and have NOT had a colonoscopy in the past 10 years?"

| Option | Value | Red Flag |
|--------|-------|----------|
| Yes | `yes` | **YES** |
| No | `no` | No |
| I'm under 50 | `under50` | No |

#### Post-Safety Branch:
- **If RED FLAGS detected:** Show Red Flag Warning screen
- **If NO red flags:** Show Practitioner Intro (Rebecca)

---

### Interstitial: Practitioner Intro (Rebecca)
*Shown if no red flags*

**Practitioner:** Rebecca Taylor, BSc, MS, RNutr - Registered Clinical Nutritionist

**Message:**
> I'm Rebecca Taylor, a Registered Clinical Nutritionist and one of the practitioners at Gut Healing Academy.
>
> Based on your answers, your symptoms fit the profile of functional gut issues — exactly what our protocols are designed to address.
>
> While I always recommend maintaining a relationship with your primary care doctor, what you're describing doesn't require additional medical clearance before we begin.
>
> Let's dig deeper into your symptom pattern so I can match you with the right protocol.

**CTA:** Continue to Symptom Assessment →

---

### Interstitial: Red Flag Warning
*Shown if red flags detected*

**Heading:** "Before we continue"

**Message:**
> Based on your answers, I recommend speaking with a gastroenterologist before starting any gut protocol. This doesn't mean something is wrong — it just means your symptoms deserve proper evaluation first.

**Rebecca's Message:**
> I'm Rebecca Taylor, RNutr. As a clinical nutritionist, I always want to make sure we're addressing functional issues, not masking something that needs medical attention. Once you've been evaluated and cleared, come back — we'll have your protocol ready.

**Actions:**
- "I'll return after seeing my doctor" → Exit to homepage
- "I've already been evaluated and cleared" → Continue (sets `red_flag_evaluated_cleared: true`)

---

### Section 2: SYMPTOM PATTERN
*5 questions*

#### Q5: Primary Complaint (q5_primary_complaint)
**Question:** "What bothers you MOST right now?"

| Option | Value | Label |
|--------|-------|-------|
| Bloating — I wake up flat and look pregnant by evening | `bloating` | Bloating |
| Constipation — Not going for days, straining, never feeling done | `constipation` | Constipation |
| Diarrhea — Urgency, loose stools, can't trust my body | `diarrhea` | Diarrhea |
| Unpredictability — I swing between constipation and diarrhea | `mixed` | Unpredictable bowel patterns |
| Pain and cramping that disrupts my focus | `pain` | Pain and cramping |
| Gas that makes me avoid being around people | `gas` | Gas |
| Heartburn or reflux that burns no matter what I eat | `reflux` | Heartburn/reflux |

#### Q6: Frequency (q6_frequency)
**Question:** "How often does this happen?"

| Option | Value |
|--------|-------|
| Every single day — it's my baseline now | `daily` |
| Several times a week — I'm always bracing for it | `several_weekly` |
| Weekly — bad days are predictable | `weekly` |
| A few times a month — flares come and go | `monthly` |

#### Q7: BM Relief (q7_bm_relief)
**Question:** "When you have a bowel movement, does your pain or discomfort get better?"

| Option | Value |
|--------|-------|
| Yes — relief is temporary but real | `yes` |
| Sometimes — it's unpredictable | `sometimes` |
| No — going doesn't help the pain | `no` |
| I don't really have pain, just other symptoms | `no_pain` |

#### Q8: Frequency Change (q8_frequency_change)
**Question:** "During a flare, what happens to your bathroom frequency?"

| Option | Value |
|--------|-------|
| I go MORE often | `more` |
| I go LESS often | `less` |
| It swings both ways depending on the day | `both` |
| Frequency doesn't really change | `no_change` |

#### Q9: Stool Change (q9_stool_change)
**Question:** "What about your stool during flares — what changes?"

| Option | Value |
|--------|-------|
| It gets loose, watery, or urgent | `loose` |
| It gets hard, lumpy, or difficult to pass | `hard` |
| It alternates — I never know which it'll be | `alternates` |
| It stays about the same | `same` |

---

### Interstitial: Protocol Preview
*Shown after symptoms section*

**Flow:**
1. Loading screen: "Analyzing your symptom pattern..." (2 seconds)
2. Display preliminary protocol match

**Heading:** "Based on your symptoms, you're likely a match for:"

**Protocol Card:** Shows calculated protocol name and tagline

**Explanation:**
> But identifying a protocol is just the first step. To customize this for YOUR body — and skip what hasn't worked for you before — we need to understand your history.
>
> The next few questions help us personalize your protocol so you're not starting from scratch.

**CTA:** Continue →

---

### Interstitial: Email Capture
*Saves progress and captures lead*

**Label:** SAVE YOUR PROGRESS
**Heading:** "Where should we send your personalized results?"

**Fields:**
- First name (required, min 2 chars)
- Email (required, validated)

**Privacy text:** "We'll send your protocol results and keep you updated on your gut healing journey. Unsubscribe anytime."

**CTA:** Send My Results →

**Actions on submit:**
- Tracks Meta Pixel "Lead" event
- Sends webhook with `submission_type: email_capture`
- Submits partial data to Supabase

---

### Section 3: YOUR HISTORY
*3 questions*

#### Q10: Duration (q10_duration)
**Question:** "How long have you been dealing with gut issues?"

| Option | Value |
|--------|-------|
| 3-6 months — this is relatively new | `3-6_months` |
| 6-12 months — it's becoming my normal | `6-12_months` |
| 1-3 years — I've tried a few things | `1-3_years` |
| 3-5 years — I've tried many things | `3-5_years` |
| 5+ years — I've tried everything | `5+_years` |

#### Q11: Diagnosis (q11_diagnosis)
**Question:** "Have you received any diagnosis? Select all that apply."
**Type:** Multi-select

| Option | Value |
|--------|-------|
| IBS (Irritable Bowel Syndrome) | `ibs` |
| SIBO (Small Intestinal Bacterial Overgrowth) | `sibo` |
| IBD (Crohn's or Ulcerative Colitis) | `ibd` |
| GERD / Acid Reflux | `gerd` |
| Food intolerances or sensitivities | `food_intolerance` |
| No formal diagnosis — doctors say tests look "normal" | `no_diagnosis` |
| Other | `other` |

#### Q12: Treatments Tried (q12_tried)
**Question:** "What have you already tried? Select all that apply."
**Type:** Multi-select

| Option | Value |
|--------|-------|
| Low FODMAP diet | `low_fodmap` |
| Gluten-free | `gluten_free` |
| Dairy-free | `dairy_free` |
| Probiotics (any brand) | `probiotics` |
| Digestive enzymes | `enzymes` |
| Prescription medications (PPIs, antispasmodics, etc.) | `prescription` |
| Antibiotics for SIBO (Rifaximin, etc.) | `sibo_antibiotics` |
| Herbal antimicrobials | `herbal` |
| Strict elimination diets | `elimination` |
| Nothing yet — I'm just starting to look for answers | `nothing` |

---

### Interstitial: Validation Screen
*Personalized based on answers - shown after history section*

**Practitioner:** Paulina Andrzejewska, MSc - Clinical Dietitian & Low FODMAP Specialist

**Dynamic Sections Based on Answers:**

1. **Duration Acknowledgment** (always shown):
   - 3-6 months: "Six months of unexplained symptoms is exhausting — especially when you don't know what's causing them."
   - 6-12 months: "A year of fighting your own body takes a toll. You deserve answers."
   - 1-3 years: "After a few years, it's easy to lose hope. But you're still searching — that matters."
   - 3-5 years: "Three to five years is a long time to feel this way. Most of our members come to us at this stage — after trying everything."
   - 5+ years: "**5+ years** is a long time to fight your own body. Most of our members come to us after trying everything..."

2. **Diagnosis Validation** (conditional):
   - If `no_diagnosis`: "**'Normal' test results** don't mean your symptoms aren't real. Standard blood work and imaging often miss functional gut issues entirely..."
   - If has diagnoses: "You've been diagnosed with [diagnoses]. Having a name for what you're experiencing is a start — but a diagnosis alone doesn't give you a day-by-day plan for feeling better."

3. **Treatments Tried** (if not "nothing"):
   > You've already put in serious work. **[formatted treatment list]** — you weren't doing it wrong. These approaches help some people, but without tracking your individual response and having someone adjust based on YOUR data, it's like navigating without a map.

4. **How GHA is Different** (always shown):
   > At Gut Healing Academy, our practitioners review your weekly tracking and adapt your protocol based on how YOUR body responds. No more guessing if something is working.

**Paulina's Quote:**
> "Most treatment failures happen because there's no feedback loop. You try something, don't know if it's working, give up too early or stick with it too long. We fix that."

**CTA:** Continue →

---

### Section 4: GUT-BRAIN CONNECTION
*3 questions with conditional testimonial*

#### Q13: Stress Connection (q13_stress)
**Question:** "When life gets stressful, what happens to your gut?"

| Option | Value |
|--------|-------|
| It gets significantly worse — stress is a clear trigger | `significant` |
| There's some connection, but it's not the whole picture | `some` |
| Honestly, I haven't noticed a pattern | `none` |

**Post-Q13 Branch:**
- If `none` selected: Skip testimonial, go directly to Q14
- If `significant` or `some`: Show Amanda Testimonial

---

### Interstitial: Amanda Testimonial
*Shown if stress affects gut (Q13 ≠ "none")*

**Context Line:** "Many of our members discover the gut-brain connection was their missing piece..."

**Testimonial:**
> "After years of being a yo-yo dieter, I finally found something that works. With Becca's knowledge of nutrition, I know I'm on track to keep the results."
> — Amanda ★★★★★

**Disclaimer:** "Individual results may vary based on adherence and personal factors."

**CTA:** Continue →

---

#### Q14: Mental Health Impact (q14_mental_health)
**Question:** "Has dealing with your gut affected your mental health?"

| Option | Value |
|--------|-------|
| Yes — I feel anxious, depressed, or hopeless because of this | `yes` |
| Sometimes — bad gut days are bad mental health days | `sometimes` |
| No — my mood is separate from my gut | `no` |

#### Q15: Sleep Quality (q15_sleep)
**Question:** "How's your sleep?"

| Option | Value |
|--------|-------|
| Poor — I wake up, can't fall asleep, or don't feel rested | `poor` |
| Hit or miss — some nights okay, others rough | `mixed` |
| Generally good — sleep isn't my issue | `good` |

---

### Section 5: LIFE IMPACT
*3 questions (2 text fields are optional)*

#### Q16: Life Impact Level (q16_life_impact)
**Question:** "How much has this taken from your life?"

| Option | Value |
|--------|-------|
| Everything — I've changed jobs, stopped traveling, missed things I can't get back | `severe` |
| A lot — I regularly say no to things I want to say yes to | `moderate` |
| Some — it's frustrating but I manage around it | `mild` |

#### Q17: Hardest Part (q17_hardest_part)
**Question:** "What's the hardest part about living with gut issues right now?"
**Type:** Text input (optional)
**Placeholder:** "Share what weighs on you most..."
**Character limit:** 500

#### Q18: Dream Outcome (q18_vision)
**Question:** "If you woke up tomorrow and your gut just worked — what would you do first?"
**Type:** Text input (optional)
**Placeholder:** "Picture your life without gut issues..."
**Character limit:** 500

---

### Final Calculation & Results

#### Loading Screen
**Duration:** 5.5 seconds
**Messages (rotating every 1.5s):**
1. "Analyzing your symptom pattern..."
2. "Cross-referencing your history..."
3. "Calculating protocol match..."
4. "Personalizing your recommendations..."

**Actions:**
- Final protocol calculation
- Gut-brain overlay check
- Meta Pixel "CompleteRegistration" event
- Webhook with `submission_type: quiz_completed`
- Supabase upsert with complete data

---

### Results Screen

**Heading:** "Your Personalized Protocol is Ready"

**Protocol Card:**
- Protocol name
- Gut-brain badge (if applicable): "+ Nervous System Support"
- Protocol tagline

**Personalization Factors:**
- Primary symptom
- Duration
- What you've tried (if applicable)
- Stress connection (if significant)

**What's Included:**
- Week-by-week protocol matched to your symptoms
- Daily tracking to identify YOUR triggers
- Practitioner review of your progress

**Cheryl Testimonial:**
> "For the first time in years, I feel lighter and truly in control." — Cheryl ★★★★★

**CTA:** "See My Complete Plan →"
**Note:** "See pricing and what's included"

---

## Protocol Assignment Logic

### Priority 1: Post-SIBO Recovery
**Condition:** Has SIBO diagnosis (`q11_diagnosis` includes `sibo`) AND has tried SIBO antibiotics (`q12_tried` includes `sibo_antibiotics`)
**Protocol:** `rebuild` - "The Rebuild Protocol"

### Priority 2: Primary Complaint Mapping

| Primary Complaint | Protocol |
|-------------------|----------|
| `bloating` | `bloat_reset` - "The Bloat Reset Protocol" |
| `gas` | `bloat_reset` - "The Bloat Reset Protocol" |
| `constipation` | `regularity` - "The Regularity Protocol" |
| `diarrhea` | `calm_gut` - "The Calm Gut Protocol" |
| `mixed` | `stability` - "The Stability Protocol" |
| `pain` | Varies based on Q8 frequency change |
| `reflux` | `bloat_reset` - "The Bloat Reset Protocol" |

### Pain Sublogic (q5 = "pain"):
- If frequency goes up (`more`): `calm_gut`
- If frequency goes down (`less`): `regularity`
- If frequency swings both ways (`both`): `stability`
- Default: `bloat_reset`

### Stool Pattern Override:
If Q9 stool change = `alternates`: `stability`

### Default Fallback:
`bloat_reset`

---

## Gut-Brain Overlay Logic

**Overlay Added When:**
- Q13 stress = `significant`, OR
- Q14 mental health = `yes`, OR
- (Q13 stress = `some` AND Q14 mental health = `sometimes`)

**Overlay Display:** "+ Nervous System Support"

---

## Protocol Definitions

| Key | Name | Tagline | Number |
|-----|------|---------|--------|
| `bloat_reset` | The Bloat Reset Protocol | For women who wake up flat and look pregnant by evening | 1 |
| `regularity` | The Regularity Protocol | For women who go days without relief | 2 |
| `calm_gut` | The Calm Gut Protocol | For women who can't trust their body | 3 |
| `stability` | The Stability Protocol | For women who never know which day they'll get | 4 |
| `rebuild` | The Rebuild Protocol | For women recovering from SIBO treatment | 5 |

---

## URL Parameters Sent to Offer Page

| Parameter | Source | Example |
|-----------|--------|---------|
| `source` | CONFIG | `quiz-3` |
| `name` | User input | `Sarah` |
| `email` | User input | `sarah@example.com` |
| `protocol` | Calculated | `bloat_reset` |
| `protocol_name` | Calculated | `The Bloat Reset Protocol` |
| `gut_brain` | Calculated | `true` / `false` |
| `goal_selection` | Q: Goal | `comfortable_eating` |
| `journey_stage` | Q: Journey | `tried_everything` |
| `primary_complaint` | Q5 | `bloating` |
| `primary_complaint_label` | Q5 mapped | `Bloating` |
| `duration` | Q10 | `5+_years` |
| `diagnoses` | Q11 | `ibs,sibo` |
| `treatments` | Q12 | `low_fodmap,probiotics` |
| `treatments_formatted` | Q12 formatted | `Low FODMAP diet and probiotics` |
| `stress_level` | Q13 | `significant` |
| `life_impact` | Q16 | `severe` |
| `vision` | Q18 (truncated to 200 chars, URL encoded) | User's dream |

---

## Tracking Events

### GTM DataLayer Events
All push `event: 'quiz_step'` with `quiz_source: 'quiz-3'`

| Section Name | When Fired |
|--------------|------------|
| `intro` | Quiz start |
| `intro_goal` | Goal selection screen |
| `intro_journey` | Journey stage screen |
| `intro_validation` | Validation interstitial |
| `part1_intro` | Safety section intro |
| `part1_q1` - `part1_q4` | Safety questions |
| `part1_red_flag_warning` | Red flag warning |
| `part1_practitioner_intro` | Rebecca intro |
| `part2_q1` - `part2_q5` | Symptom questions |
| `part2_protocol_preview` | Protocol preview |
| `email_capture` | Email capture screen |
| `part3_q1` - `part3_q3` | History questions |
| `part3_validation` | Validation screen |
| `part4_q1` - `part4_q3` | Gut-brain questions |
| `testimonial_amanda` | Amanda testimonial |
| `part5_q1` - `part5_q3` | Impact questions |
| `results_calculating` | Loading screen |
| `results_shown` | Results display |
| `offer_redirect` | Redirect to offer |

### Meta Pixel Events
- `PageView` - On page load
- `Lead` - On email capture
- `CompleteRegistration` - On quiz completion

---

## Webhook Payload Structure

```json
{
  "name": "Sarah",
  "email": "sarah@example.com",
  "protocol_number": 1,
  "protocol_name": "The Bloat Reset Protocol",
  "protocol_description": "For women who wake up flat and look pregnant by evening",
  "has_stress_component": true,
  "goal_selection": "comfortable_eating",
  "journey_stage": "tried_everything",
  "q1_weight_loss": "no",
  "q2_blood": "no",
  "q3_family_history": "no",
  "q4_colonoscopy": "under50",
  "q5_primary_complaint": "bloating",
  "q6_frequency": "daily",
  "q7_bm_relief": "yes",
  "q8_frequency_change": "more",
  "q9_stool_change": "loose",
  "q10_duration": "5+_years",
  "q11_diagnosis": "ibs, sibo",
  "q12_tried": "low_fodmap, probiotics, elimination",
  "q13_stress": "significant",
  "q14_mental_health": "yes",
  "q15_sleep": "poor",
  "q16_life_impact": "severe",
  "q17_hardest_part": "Not being able to eat out with friends...",
  "q18_vision": "I would go on that trip I've been postponing...",
  "had_red_flags": false,
  "red_flag_evaluated_cleared": false,
  "source": "quiz-3",
  "submission_type": "quiz_completed",
  "submitted_at": "2026-01-26T12:00:00.000Z"
}
```

---

## Flow Diagram (Text)

```
START
  ↓
[Goal Selection] → [Journey Stage] → [Validation Interstitial]
  ↓
[Safety Intro]
  ↓
[Q1-Q4: Safety Questions]
  ↓
  ├── RED FLAGS → [Red Flag Warning] → EXIT or CONTINUE (bypassed)
  └── NO FLAGS → [Rebecca Practitioner Intro]
  ↓
[Q5-Q9: Symptom Questions]
  ↓
[Protocol Preview] → [Email Capture] ← Lead captured here
  ↓
[Q10-Q12: History Questions]
  ↓
[Validation Screen (Paulina)]
  ↓
[Q13: Stress Connection]
  ├── stress ≠ "none" → [Amanda Testimonial] → [Q14-Q15]
  └── stress = "none" → [Q14-Q15]
  ↓
[Q16-Q18: Impact Questions]
  ↓
[Loading Animation]
  ↓
[Results Screen]
  ↓
[REDIRECT TO /offer-3/]
```

---

## Total Question Count

- **Intro Questions:** 2 (goal + journey)
- **Safety Questions:** 4
- **Symptom Questions:** 5
- **History Questions:** 3
- **Gut-Brain Questions:** 3
- **Impact Questions:** 3

**Total:** 20 questions + interstitials/testimonials
