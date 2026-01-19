// Quiz Content Data Structure for Survey-Style Quiz 3.0
// All questions, interstitials, and content organized for the goal-first flow

const quizContent = {
  sections: [
    // Section 0: YOUR GOALS (intro screens handled separately in script.js)
    {
      id: 'intro',
      label: 'YOUR GOALS',
      questions: [] // Intro questions are rendered manually, not from this array
    },
    // Section 1: SAFETY SCREENING
    {
      id: 'safety',
      label: 'SAFETY SCREENING',
      questions: [
        {
          id: 'q1_weight_loss',
          text: 'Have you lost more than 10 lbs in the past 3 months without trying to?',
          type: 'single',
          options: [
            { text: 'Yes', value: 'yes', redFlag: true },
            { text: 'No', value: 'no', redFlag: false }
          ]
        },
        {
          id: 'q2_blood',
          text: 'Have you noticed blood in your stool, or stools that are black and tarry?',
          type: 'single',
          options: [
            { text: 'Yes', value: 'yes', redFlag: true },
            { text: 'No', value: 'no', redFlag: false }
          ]
        },
        {
          id: 'q3_family_history',
          text: 'Does anyone in your immediate family have colon cancer or inflammatory bowel disease?',
          type: 'single',
          options: [
            { text: 'Yes', value: 'yes', redFlag: true },
            { text: 'No', value: 'no', redFlag: false },
            { text: "I'm not sure", value: 'unsure', redFlag: false }
          ]
        },
        {
          id: 'q4_colonoscopy',
          text: 'Are you over 50 and have NOT had a colonoscopy in the past 10 years?',
          type: 'single',
          options: [
            { text: 'Yes', value: 'yes', redFlag: true },
            { text: 'No', value: 'no', redFlag: false },
            { text: "I'm under 50", value: 'under50', redFlag: false }
          ]
        }
      ]
    },
    {
      id: 'symptoms',
      label: 'SYMPTOM PATTERN',
      questions: [
        {
          id: 'q5_primary_complaint',
          text: 'What bothers you MOST right now?',
          type: 'single',
          options: [
            { text: 'Bloating — I wake up flat and look pregnant by evening', value: 'bloating' },
            { text: 'Constipation — Not going for days, straining, never feeling done', value: 'constipation' },
            { text: "Diarrhea — Urgency, loose stools, can't trust my body", value: 'diarrhea' },
            { text: 'Unpredictability — I swing between constipation and diarrhea', value: 'mixed' },
            { text: 'Pain and cramping that disrupts my focus', value: 'pain' },
            { text: 'Gas that makes me avoid being around people', value: 'gas' },
            { text: 'Heartburn or reflux that burns no matter what I eat', value: 'reflux' }
          ]
        },
        {
          id: 'q6_frequency',
          text: 'How often does this happen?',
          type: 'single',
          options: [
            { text: "Every single day — it's my baseline now", value: 'daily' },
            { text: "Several times a week — I'm always bracing for it", value: 'several_weekly' },
            { text: 'Weekly — bad days are predictable', value: 'weekly' },
            { text: 'A few times a month — flares come and go', value: 'monthly' }
          ]
        },
        {
          id: 'q7_bm_relief',
          text: 'When you have a bowel movement, does your pain or discomfort get better?',
          type: 'single',
          options: [
            { text: 'Yes — relief is temporary but real', value: 'yes' },
            { text: "Sometimes — it's unpredictable", value: 'sometimes' },
            { text: "No — going doesn't help the pain", value: 'no' },
            { text: "I don't really have pain, just other symptoms", value: 'no_pain' }
          ]
        },
        {
          id: 'q8_frequency_change',
          text: 'During a flare, what happens to your bathroom frequency?',
          type: 'single',
          options: [
            { text: 'I go MORE often', value: 'more' },
            { text: 'I go LESS often', value: 'less' },
            { text: 'It swings both ways depending on the day', value: 'both' },
            { text: "Frequency doesn't really change", value: 'no_change' }
          ]
        },
        {
          id: 'q9_stool_change',
          text: 'What about your stool during flares — what changes?',
          type: 'single',
          options: [
            { text: 'It gets loose, watery, or urgent', value: 'loose' },
            { text: 'It gets hard, lumpy, or difficult to pass', value: 'hard' },
            { text: "It alternates — I never know which it'll be", value: 'alternates' },
            { text: 'It stays about the same', value: 'same' }
          ]
        }
      ]
    },
    {
      id: 'history',
      label: 'YOUR HISTORY',
      questions: [
        {
          id: 'q10_duration',
          text: 'How long have you been dealing with gut issues?',
          type: 'single',
          options: [
            { text: '3-6 months — this is relatively new', value: '3-6_months' },
            { text: "6-12 months — it's becoming my normal", value: '6-12_months' },
            { text: "1-3 years — I've tried a few things", value: '1-3_years' },
            { text: "3-5 years — I've tried many things", value: '3-5_years' },
            { text: "5+ years — I've tried everything", value: '5+_years' }
          ]
        },
        {
          id: 'q11_diagnosis',
          text: 'Have you received any diagnosis? Select all that apply.',
          type: 'multi',
          options: [
            { text: 'IBS (Irritable Bowel Syndrome)', value: 'ibs' },
            { text: 'SIBO (Small Intestinal Bacterial Overgrowth)', value: 'sibo' },
            { text: "IBD (Crohn's or Ulcerative Colitis)", value: 'ibd' },
            { text: 'GERD / Acid Reflux', value: 'gerd' },
            { text: 'Food intolerances or sensitivities', value: 'food_intolerance' },
            { text: 'No formal diagnosis — doctors say tests look "normal"', value: 'no_diagnosis' },
            { text: 'Other', value: 'other' }
          ]
        },
        {
          id: 'q12_tried',
          text: 'What have you already tried? Select all that apply.',
          type: 'multi',
          options: [
            { text: 'Low FODMAP diet', value: 'low_fodmap' },
            { text: 'Gluten-free', value: 'gluten_free' },
            { text: 'Dairy-free', value: 'dairy_free' },
            { text: 'Probiotics (any brand)', value: 'probiotics' },
            { text: 'Digestive enzymes', value: 'enzymes' },
            { text: 'Prescription medications (PPIs, antispasmodics, etc.)', value: 'prescription' },
            { text: 'Antibiotics for SIBO (Rifaximin, etc.)', value: 'sibo_antibiotics' },
            { text: 'Herbal antimicrobials', value: 'herbal' },
            { text: 'Strict elimination diets', value: 'elimination' },
            { text: "Nothing yet — I'm just starting to look for answers", value: 'nothing' }
          ]
        }
      ]
    },
    {
      id: 'gutbrain',
      label: 'GUT-BRAIN CONNECTION',
      questions: [
        {
          id: 'q13_stress',
          text: 'When life gets stressful, what happens to your gut?',
          type: 'single',
          options: [
            { text: 'It gets significantly worse — stress is a clear trigger', value: 'significant' },
            { text: "There's some connection, but it's not the whole picture", value: 'some' },
            { text: "Honestly, I haven't noticed a pattern", value: 'none' }
          ]
        },
        {
          id: 'q14_mental_health',
          text: 'Has dealing with your gut affected your mental health?',
          type: 'single',
          options: [
            { text: 'Yes — I feel anxious, depressed, or hopeless because of this', value: 'yes' },
            { text: 'Sometimes — bad gut days are bad mental health days', value: 'sometimes' },
            { text: 'No — my mood is separate from my gut', value: 'no' }
          ]
        },
        {
          id: 'q15_sleep',
          text: "How's your sleep?",
          type: 'single',
          options: [
            { text: "Poor — I wake up, can't fall asleep, or don't feel rested", value: 'poor' },
            { text: 'Hit or miss — some nights okay, others rough', value: 'mixed' },
            { text: "Generally good — sleep isn't my issue", value: 'good' }
          ]
        }
      ]
    },
    {
      id: 'impact',
      label: 'LIFE IMPACT',
      questions: [
        {
          id: 'q16_life_impact',
          text: 'How much has this taken from your life?',
          type: 'single',
          options: [
            { text: "Everything — I've changed jobs, stopped traveling, missed things I can't get back", value: 'severe' },
            { text: 'A lot — I regularly say no to things I want to say yes to', value: 'moderate' },
            { text: "Some — it's frustrating but I manage around it", value: 'mild' }
          ]
        },
        {
          id: 'q17_hardest_part',
          text: "What's the hardest part about living with gut issues right now?",
          type: 'text',
          placeholder: 'Share what weighs on you most...',
          optional: true
        },
        {
          id: 'q18_vision',
          text: 'If you woke up tomorrow and your gut just worked — what would you do first?',
          type: 'text',
          placeholder: 'Picture your life without gut issues...',
          optional: true
        }
      ]
    }
  ],

  // Practitioner data
  practitioners: {
    rebecca: {
      name: 'Rebecca Taylor',
      credentials: 'BSc, MS, RNutr',
      title: 'Registered Clinical Nutritionist',
      photo: '/about/practitioner-rebecca.png',
      introMessage: `I'm Rebecca Taylor, a Registered Clinical Nutritionist and one of the practitioners at Gut Healing Academy.

Based on your answers, your symptoms fit the profile of functional gut issues — exactly what our protocols are designed to address.

While I always recommend maintaining a relationship with your primary care doctor, what you're describing doesn't require additional medical clearance before we begin.

Let's dig deeper into your symptom pattern so I can match you with the right protocol.`,
      redFlagMessage: `I'm Rebecca Taylor, RNutr. As a clinical nutritionist, I always want to make sure we're addressing functional issues, not masking something that needs medical attention. Once you've been evaluated and cleared, come back — we'll have your protocol ready.`
    },
    paulina: {
      name: 'Paulina Andrzejewska',
      credentials: 'MSc',
      title: 'Clinical Dietitian & Low FODMAP Specialist',
      photo: '/about/practitioner-paulina.png',
      validationQuote: `Most treatment failures happen because there's no feedback loop. You try something, don't know if it's working, give up too early or stick with it too long. We fix that.`
    }
  },

  // Testimonial data
  testimonials: {
    suzy: {
      name: 'Suzy',
      photo: '/assets/testimonial-suzy.png',
      quote: `My symptoms were complex and my gut history was complicated. After following the protocol, I'm seeing significant improvement. I finally know my triggers and how to eat to feel my best.`,
      stars: 5
    },
    amanda: {
      name: 'Amanda',
      photo: '/assets/testimonial-amanda.png',
      quote: `After years of being a yo-yo dieter, I finally found something that works. With Becca's knowledge of nutrition, I know I'm on track to keep the results.`,
      stars: 5,
      contextLine: 'Many of our members discover the gut-brain connection was their missing piece...'
    },
    cheryl: {
      name: 'Cheryl',
      photo: '/assets/testimonial-cheryl.png',
      quote: `For the first time in years, I feel lighter and truly in control.`,
      stars: 5
    }
  },

  // Protocol definitions
  protocols: {
    bloat_reset: {
      name: 'The Bloat Reset Protocol',
      tagline: 'For women who wake up flat and look pregnant by evening'
    },
    regularity: {
      name: 'The Regularity Protocol',
      tagline: 'For women who go days without relief'
    },
    calm_gut: {
      name: 'The Calm Gut Protocol',
      tagline: "For women who can't trust their body"
    },
    stability: {
      name: 'The Stability Protocol',
      tagline: "For women who never know which day they'll get"
    },
    rebuild: {
      name: 'The Rebuild Protocol',
      tagline: 'For women recovering from SIBO treatment'
    }
  },

  gutBrainOverlay: {
    name: '+ Nervous System Support',
    tagline: 'Stress-gut connection tools integrated into your protocol'
  },

  // Duration acknowledgment messages
  durationAcknowledgments: {
    '3-6_months': "Six months of unexplained symptoms is exhausting — especially when you don't know what's causing them.",
    '6-12_months': "A year of fighting your own body takes a toll. You deserve answers.",
    '1-3_years': "After a few years, it's easy to lose hope. But you're still searching — that matters.",
    '3-5_years': "Three to five years is a long time to feel this way. Most of our members come to us at this stage — after trying everything.",
    '5+_years': "<strong>5+ years</strong> is a long time to fight your own body. Most of our members come to us after trying everything. What they find is that the missing piece wasn't more restriction — it was structured support and someone who actually reviews their progress."
  },

  // Treatment labels for validation screen
  treatmentLabels: {
    low_fodmap: 'Low FODMAP diet',
    gluten_free: 'gluten-free',
    dairy_free: 'dairy-free',
    probiotics: 'probiotics',
    enzymes: 'digestive enzymes',
    prescription: 'prescription medications',
    sibo_antibiotics: 'SIBO antibiotics',
    herbal: 'herbal antimicrobials',
    elimination: 'strict elimination diets'
  },

  // Primary complaint labels
  complaintLabels: {
    bloating: 'Bloating',
    constipation: 'Constipation',
    diarrhea: 'Diarrhea',
    mixed: 'Unpredictable bowel patterns',
    pain: 'Pain and cramping',
    gas: 'Gas',
    reflux: 'Heartburn/reflux'
  },

  // Loading screen messages
  loadingMessages: [
    'Analyzing your symptom pattern...',
    'Cross-referencing your history...',
    'Calculating protocol match...',
    'Personalizing your recommendations...'
  ],

  // What's included in results
  whatsIncluded: [
    'Week-by-week protocol matched to your symptoms',
    'Daily tracking to identify YOUR triggers',
    'Practitioner review of your progress'
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quizContent;
}
