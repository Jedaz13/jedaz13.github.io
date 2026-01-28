/* =====================================================
   Quiz v4 Content - Gut Healing Academy
   28 Screens - Updated Structure
   ===================================================== */

const quizContent = {
  // Member count - placeholder for future use
  memberCount: null,

  // =================================================
  // PHASE 1: EMOTIONAL HOOK (Screens 1-5)
  // =================================================
  phase1: {
    id: 'emotional_hook',
    label: 'Your Goals',
    screens: [
      // Screen 1: Future Vision
      {
        id: 'future_vision',
        screenNumber: 1,
        type: 'single_select',
        question: 'If your gut worked perfectly tomorrow, what would you do first?',
        options: [
          { text: 'Eat whatever I want without fear', value: 'eat_freely' },
          { text: 'Travel without bathroom anxiety', value: 'travel' },
          { text: 'Enjoy meals with friends & family', value: 'social' },
          { text: 'Have a normal, predictable morning', value: 'morning' }
        ],
        storeAs: 'future_vision'
      },

      // Screen 2: Timeline
      {
        id: 'timeline',
        screenNumber: 2,
        type: 'single_select',
        question: 'When do you want to feel in control of your gut?',
        options: [
          { text: "As soon as possible — I'm ready now", value: 'asap' },
          { text: 'Within the next few weeks', value: 'few_weeks' },
          { text: "I'm focused on long-term change", value: 'long_term' },
          { text: 'Before a specific event or date', value: 'event' }
        ],
        storeAs: 'user_timeline'
      },

      // Screen 3: Primary Complaint
      {
        id: 'primary_complaint',
        screenNumber: 3,
        type: 'single_select',
        question: "What's your #1 struggle right now?",
        subtitle: 'Choose the one that bothers you most',
        options: [
          { text: 'Bloating & distension', value: 'bloating', protocol: 'bloat_reset' },
          { text: 'Constipation', value: 'constipation', protocol: 'regularity' },
          { text: 'Diarrhea or urgency', value: 'diarrhea', protocol: 'calm_gut' },
          { text: 'It alternates (sometimes both)', value: 'mixed', protocol: 'stability' },
          { text: 'Abdominal pain or cramping', value: 'pain', protocol: 'bloat_reset' },
          { text: 'Excessive gas', value: 'gas', protocol: 'bloat_reset' }
        ],
        storeAs: 'primary_complaint'
      },

      // Screen 4: Duration
      {
        id: 'duration',
        screenNumber: 4,
        type: 'single_select',
        question: 'How long have you been dealing with this?',
        options: [
          { text: '3-6 months', value: '3_6_months', durationValue: 0.5 },
          { text: '6-12 months', value: '6_12_months', durationValue: 1 },
          { text: '1-3 years', value: '1_3_years', durationValue: 2 },
          { text: '3-5 years', value: '3_5_years', durationValue: 4 },
          { text: '5+ years', value: '5_plus_years', durationValue: 6 }
        ],
        storeAs: 'symptom_duration'
      },

      // Screen 5: Validation Duration (INFO SCREEN)
      {
        id: 'validation_duration',
        screenNumber: 5,
        type: 'info_dynamic',
        dynamicContent: {
          '5_plus_years': {
            icon: '💪',
            headline: "That's a long time to struggle alone.",
            body: "Most women we help have been dealing with this for years. You're not starting from scratch — you're finally getting the right support."
          },
          '3_5_years': {
            icon: '💪',
            headline: "Years of dealing with this takes its toll.",
            body: "You've been patient. You've tried things. Now it's time for answers that actually work for YOUR gut."
          },
          '1_3_years': {
            icon: '✨',
            headline: "You've been at this for a while.",
            body: "Long enough to know that generic advice doesn't cut it. Let's find what works for you specifically."
          },
          default: {
            icon: '✨',
            headline: "Good — you're catching this early.",
            body: "The sooner you address gut issues, the faster you can get back to normal. Let's figure out your pattern."
          }
        },
        basedOn: 'symptom_duration',
        buttonText: 'Continue'
      }
    ]
  },

  // =================================================
  // PHASE 2: CLINICAL ASSESSMENT (Screens 6-12)
  // =================================================
  phase2: {
    id: 'clinical_assessment',
    label: 'Your Symptoms',
    screens: [
      // Screen 6: BM Relief
      {
        id: 'bm_relief',
        screenNumber: 6,
        type: 'single_select',
        question: 'When you have a bowel movement, does your discomfort get better?',
        subtitle: 'This helps us understand your symptom pattern',
        options: [
          { text: 'Yes, I usually feel relief', value: 'yes', romeIV: true },
          { text: 'Sometimes, but not always', value: 'sometimes', romeIV: true },
          { text: 'No, it stays the same or gets worse', value: 'no', romeIV: false },
          { text: "I don't really have pain or discomfort", value: 'no_pain', romeIV: false }
        ],
        storeAs: 'bm_relief'
      },

      // Screen 7: Flare Frequency
      {
        id: 'flare_frequency',
        screenNumber: 7,
        type: 'single_select',
        question: 'During a flare, what happens to your bathroom frequency?',
        options: [
          { text: 'I go more often than usual', value: 'more', pattern: 'diarrhea' },
          { text: 'I go less often than usual', value: 'less', pattern: 'constipation' },
          { text: 'It varies — sometimes more, sometimes less', value: 'both', pattern: 'mixed' },
          { text: 'About the same as normal', value: 'same', pattern: 'neutral' }
        ],
        storeAs: 'flare_frequency'
      },

      // Screen 8: Stool Changes
      {
        id: 'stool_changes',
        screenNumber: 8,
        type: 'single_select',
        question: 'What about your stool during flares — what changes?',
        options: [
          { text: 'Looser or more watery', value: 'loose', pattern: 'diarrhea' },
          { text: 'Harder or more difficult to pass', value: 'hard', pattern: 'constipation' },
          { text: 'It alternates between both', value: 'alternates', pattern: 'mixed' },
          { text: 'Stays about the same', value: 'same', pattern: 'neutral' }
        ],
        storeAs: 'stool_changes'
      },

      // Screen 9: Progress Validation (INFO SCREEN)
      {
        id: 'progress_validation',
        screenNumber: 9,
        type: 'info',
        icon: '📊',
        headline: "We're building your profile.",
        body: "These questions help us match you with the right protocol. Most women with your symptom pattern start noticing changes within the first month.",
        statHighlight: null,
        buttonText: 'Continue'
      },

      // Screen 10: Treatments Tried
      {
        id: 'treatments_tried',
        screenNumber: 10,
        type: 'multi_select',
        question: 'What have you already tried?',
        subtitle: 'Select all that apply',
        options: [
          { text: 'Probiotics', value: 'probiotics' },
          { text: 'Elimination diets', value: 'elimination' },
          { text: 'Low FODMAP diet', value: 'low_fodmap' },
          { text: 'Fiber supplements', value: 'fiber' },
          { text: 'Over-the-counter medications', value: 'otc_meds' },
          { text: 'Prescription medications', value: 'prescription' },
          { text: 'Functional testing (SIBO, stool tests)', value: 'testing' },
          { text: 'Worked with a practitioner', value: 'practitioner' },
          { text: "I haven't tried much yet", value: 'nothing', exclusive: true }
        ],
        storeAs: 'treatments_tried',
        countTreatments: true
      },

      // Screen 11: Diagnosis History
      {
        id: 'diagnosis_history',
        screenNumber: 11,
        type: 'multi_select',
        question: 'Have you received any of these diagnoses?',
        subtitle: 'Select all that apply',
        options: [
          { text: 'IBS (Irritable Bowel Syndrome)', value: 'ibs' },
          { text: 'SIBO (Small Intestinal Bacterial Overgrowth)', value: 'sibo', protocolModifier: 'rebuild' },
          { text: "IBD (Crohn's or Ulcerative Colitis)", value: 'ibd', redFlag: true },
          { text: 'GERD / Acid reflux', value: 'gerd' },
          { text: 'Food intolerances', value: 'food_intolerance' },
          { text: 'Celiac disease', value: 'celiac', redFlag: true },
          { text: 'No official diagnosis yet', value: 'no_diagnosis', exclusive: true },
          { text: 'Other', value: 'other' }
        ],
        storeAs: 'diagnoses'
      },

      // Screen 12: Name Capture (WITH VALIDATION)
      {
        id: 'name_capture',
        screenNumber: 12,
        type: 'text_input_with_validation',
        dynamicContent: {
          high_count: {
            headline: "You've tried a lot.",
            body: "**{count} different approaches** — that takes real persistence. Most women give up long before this. Let's find what actually works for YOUR gut."
          },
          medium_count: {
            headline: "You've been looking for answers.",
            body: "And you haven't given up. That persistence is going to pay off. Let's personalize this for you."
          },
          low_count: {
            headline: "Let's get you on the right track from the start.",
            body: "Before we continue, we want to personalize your results."
          }
        },
        inputLabel: "What's your first name?",
        placeholder: 'Enter your first name',
        storeAs: 'user_name',
        required: true
      }
    ]
  },

  // =================================================
  // PHASE 3: THE BRIDGE (Screens 13-14)
  // =================================================
  phase3: {
    id: 'the_bridge',
    label: 'Why This Works',
    screens: [
      // Screen 13: Why Different (INFO ANIMATED)
      {
        id: 'why_different',
        screenNumber: 13,
        type: 'info_animated',
        headline: "HERE'S WHY NOTHING HAS WORKED",
        animation: 'stuck_loop_vs_escape',
        body: "Most programs treat symptoms. We match you to a protocol based on YOUR pattern — so you can finally break the cycle.",
        buttonText: 'Show me how'
      },

      // Screen 14: Testimonial
      {
        id: 'testimonial',
        screenNumber: 14,
        type: 'testimonial',
        headlineTemplate: "{firstName}, meet Sarah.",
        quote: "I tried low FODMAP for 6 months. Probiotics. Expensive tests. Nothing worked until I found my actual gut type. A few months later, I ate at a restaurant without panic for the first time in 3 years.",
        author: "Sarah, 47",
        authorDetail: "Bloat-Dominant Responder",
        authorImage: '/quiz-4/assets/testimonial-sarah.png',
        buttonText: 'Find my gut type'
      }
    ]
  },

  // =================================================
  // PHASE 4: KNOWLEDGE QUIZ (Screens 15-19)
  // =================================================
  phase4: {
    id: 'knowledge_quiz',
    label: 'Quick Gut Check',
    screens: [
      // Screen 15: Knowledge Intro
      {
        id: 'knowledge_intro',
        screenNumber: 15,
        type: 'info',
        icon: '🧠',
        headline: 'QUICK GUT CHECK',
        body: "These 2 questions help us personalize your protocol. Don't worry — there are no wrong answers.",
        backgroundColor: '#f0f9f4',
        buttonText: "Let's go"
      },

      // Screen 16: Knowledge - Eating Speed
      {
        id: 'knowledge_eating_speed',
        screenNumber: 16,
        type: 'knowledge_quiz',
        question: 'When you eat quickly, what happens in your gut?',
        backgroundColor: '#f0f9f4',
        options: [
          { text: 'Nothing different', value: 'nothing', correct: false },
          { text: 'You swallow more air → more bloating', value: 'air', correct: true },
          { text: 'You digest faster', value: 'faster', correct: false }
        ],
        storeAs: 'knowledge_eating_speed',
        correctAnswer: 'air'
      },

      // Screen 17: Knowledge Eating Response (CONDITIONAL INFO)
      {
        id: 'knowledge_eating_response',
        screenNumber: 17,
        type: 'knowledge_response',
        backgroundColor: '#f0f9f4',
        content: {
          correct: {
            icon: '👍',
            headline: "You're right!",
            body: "Eating speed directly impacts bloating. Your protocol will include specific timing strategies to reduce air swallowing.",
            buttonText: 'Next question'
          },
          incorrect: {
            icon: '💡',
            headline: 'Good guess!',
            body: "Actually, fast eating = more air swallowed = more bloating. Your protocol will address this with specific timing strategies.",
            buttonText: 'Next question'
          }
        },
        basedOn: 'knowledge_eating_speed'
      },

      // Screen 18: Knowledge - FODMAP
      {
        id: 'knowledge_fodmap',
        screenNumber: 18,
        type: 'knowledge_quiz',
        question: 'Which food is MOST likely to cause bloating?',
        backgroundColor: '#f0f9f4',
        options: [
          { icon: '🍌', text: 'Banana', value: 'banana', correct: false },
          { icon: '🍎', text: 'Apple', value: 'apple', correct: true },
          { icon: '🍇', text: 'Grapes', value: 'grapes', correct: false }
        ],
        storeAs: 'knowledge_fodmap',
        correctAnswer: 'apple'
      },

      // Screen 19: Knowledge FODMAP Response (CONDITIONAL INFO)
      {
        id: 'knowledge_fodmap_response',
        screenNumber: 19,
        type: 'knowledge_response',
        backgroundColor: '#f0f9f4',
        content: {
          correct: {
            icon: '🎯',
            headline: 'Exactly right!',
            body: "Apples are high-FODMAP — one of the most common bloating triggers. Your protocol includes a complete guide to swaps like this.",
            buttonText: 'Continue'
          },
          incorrect: {
            icon: '💡',
            headline: 'Tricky one!',
            body: "Apples are actually high-FODMAP — one of the most common bloating triggers, even though they're 'healthy.' Your protocol will show you exactly which foods to swap.",
            buttonText: 'Continue'
          }
        },
        basedOn: 'knowledge_fodmap'
      }
    ]
  },

  // =================================================
  // PHASE 5: GUT-BRAIN CONNECTION (Screens 20-21)
  // =================================================
  phase5: {
    id: 'gut_brain',
    label: 'Your Profile',
    screens: [
      // Screen 20: Stress Connection
      {
        id: 'stress_connection',
        screenNumber: 20,
        type: 'single_select',
        questionTemplate: "{firstName}, do you notice your symptoms get worse when you're stressed or anxious?",
        options: [
          { text: 'Yes, definitely', value: 'yes_definitely', gutBrainScore: 3 },
          { text: 'Sometimes', value: 'sometimes', gutBrainScore: 2 },
          { text: 'Not really', value: 'not_really', gutBrainScore: 1 },
          { text: "I've never thought about it", value: 'never_thought', gutBrainScore: 1 }
        ],
        storeAs: 'stress_connection'
      },

      // Screen 21: Stress Validation (CONDITIONAL INFO)
      {
        id: 'stress_validation',
        screenNumber: 21,
        type: 'info_conditional',
        content: {
          stress_connected: {
            icon: '🧠',
            headline: "You're not imagining it.",
            body: "The gut-brain connection is real — stress directly affects digestion through the vagus nerve. Your protocol includes nervous system support strategies.",
            addOverlay: 'gut_brain'
          },
          not_connected: {
            icon: '✓',
            headline: 'Good to know.',
            body: "We'll focus your protocol on the physical triggers. Everyone's gut responds differently.",
            addOverlay: null
          }
        },
        basedOn: 'stress_connection',
        buttonText: 'Continue'
      }
    ]
  },

  // =================================================
  // PHASE 6: SAFETY CHECK (Screens 22-23)
  // =================================================
  phase6: {
    id: 'safety_check',
    label: 'Final Questions',
    screens: [
      // Screen 22: Safety - Blood
      {
        id: 'safety_blood',
        screenNumber: 22,
        type: 'single_select',
        question: 'Have you noticed any blood in your stool recently?',
        subtitle: 'This helps us ensure you\'re getting the right support',
        options: [
          { text: 'Yes, in the past month', value: 'yes_recent', redFlag: true },
          { text: 'Yes, but it was months ago', value: 'yes_past', redFlag: false },
          { text: 'No', value: 'no', redFlag: false }
        ],
        storeAs: 'safety_blood'
      },

      // Screen 23: Safety - Weight
      {
        id: 'safety_weight',
        screenNumber: 23,
        type: 'single_select',
        question: 'Have you lost weight without trying in the past few months?',
        options: [
          { text: 'Yes, more than 10 lbs', value: 'yes_significant', redFlag: true },
          { text: 'Yes, a few pounds', value: 'yes_few', redFlag: false },
          { text: 'No', value: 'no', redFlag: false }
        ],
        storeAs: 'safety_weight'
      }
    ]
  },

  // Safety Warning Screen (CONDITIONAL - Only if red flags)
  safetyWarning: {
    id: 'safety_warning',
    type: 'warning',
    icon: '⚕️',
    headline: 'Before we continue...',
    body: "Based on your answers, we recommend checking in with a healthcare provider to rule out anything that needs medical attention. Our protocols are designed to complement — not replace — medical care.",
    options: [
      { text: "I've already been cleared by a doctor", value: 'already_cleared', continueFlow: true },
      { text: "I'll schedule an appointment", value: 'will_check', continueFlow: true }
    ],
    note: 'You can still see your results and access educational content.'
  },

  // =================================================
  // PHASE 7: EMAIL CAPTURE (Screens 24-26)
  // =================================================
  phase7: {
    id: 'email_capture_phase',
    label: 'Your Results',
    screens: [
      // Screen 24: Life Impact
      {
        id: 'life_impact',
        screenNumber: 24,
        type: 'single_select',
        questionTemplate: "{firstName}, how much has this taken from your life?",
        options: [
          { text: "Severely — I plan my life around it", value: 'severe', impact: 'high' },
          { text: "Moderately — it affects most days", value: 'moderate', impact: 'medium' },
          { text: "Mildly — it's annoying but manageable", value: 'mild', impact: 'low' }
        ],
        storeAs: 'life_impact'
      },

      // Screen 25: Email Capture
      {
        id: 'email_capture',
        screenNumber: 25,
        type: 'email_input',
        headlineTemplate: 'Your personalized protocol is ready, {firstName}.',
        valueList: [
          '✓ Your Gut Type',
          '✓ Your matched protocol',
          '✓ When you can expect to feel better'
        ],
        inputLabel: 'Enter your email to see your results',
        placeholder: 'your@email.com',
        storeAs: 'user_email',
        required: true,
        gdprText: "We'll send your results and helpful tips. Unsubscribe anytime.",
        buttonText: 'See My Results'
      },

      // Screen 26: Vision Optional
      {
        id: 'vision_optional',
        screenNumber: 26,
        type: 'text_input_optional',
        question: "One last thing — if your gut worked perfectly, what's the FIRST thing you'd do?",
        subtitle: null,
        placeholder: "e.g., Eat pizza without worry, Travel to Italy...",
        storeAs: 'user_vision',
        required: false,
        skipText: 'Skip and see my results',
        buttonText: 'See My Results'
      }
    ]
  },

  // =================================================
  // LOADING SEQUENCE (Screen 27)
  // =================================================
  loadingSequence: {
    id: 'loading_sequence',
    screenNumber: 27,
    type: 'loading',
    headlineTemplate: 'Analyzing your profile, {firstName}...',
    subtext: 'Please wait while we create your personalized protocol',
    progressBars: [
      { id: 'symptoms', label: 'Analyzing symptom pattern...', duration: 2000 },
      { id: 'matching', label: 'Matching with protocol database...', duration: 2000 },
      { id: 'profiles', label: 'Cross-referencing similar profiles...', duration: 1500 },
      { id: 'timeline', label: 'Calculating improvement timeline...', duration: 1500 },
      { id: 'recommendations', label: 'Generating personalized recommendations...', duration: 1500 }
    ],
    totalDuration: 10000,
    popups: [
      {
        id: 'symptom_timing',
        triggerAtStep: 0,
        triggerAtPercent: 50,
        question: 'Are your symptoms worse in the evening than morning?',
        options: ['Yes', 'No'],
        storeAs: 'symptom_timing'
      },
      {
        id: 'symptom_trigger_timing',
        triggerAtStep: 1,
        triggerAtPercent: 75,
        question: 'Do symptoms get worse after eating, or on an empty stomach?',
        options: ['After eating', 'Empty stomach', 'Both'],
        storeAs: 'symptom_trigger_timing'
      }
    ],
    completionMessage: '✓ Your personalized protocol is ready'
  },

  // =================================================
  // RESULTS PAGE (Screen 28)
  // =================================================
  resultsPage: {
    id: 'results_page',
    screenNumber: 28,
    type: 'results'
  },

  // =================================================
  // GUT TYPES
  // =================================================
  gutTypes: {
    bloat_reset: {
      name: 'Bloat-Dominant Responder',
      description: 'Your gut is highly reactive to certain triggers, causing bloating and distension as its primary response.',
      color: '#E07A5F'
    },
    regularity: {
      name: 'Slow-Transit Responder',
      description: 'Your gut moves slower than optimal, leading to constipation and incomplete elimination.',
      color: '#6B9080'
    },
    calm_gut: {
      name: 'Rapid-Transit Responder',
      description: 'Your gut moves too quickly, often triggered by specific foods or stress.',
      color: '#81B29A'
    },
    stability: {
      name: 'Mixed-Pattern Responder',
      description: 'Your gut alternates between patterns, requiring a balanced approach.',
      color: '#F2CC8F'
    },
    rebuild: {
      name: 'Post-Treatment Rebuilder',
      description: 'Your gut is recovering and needs specific support to rebuild optimal function.',
      color: '#3D405B'
    }
  },

  // =================================================
  // PROTOCOLS
  // =================================================
  protocols: {
    bloat_reset: {
      name: 'The Bloat Reset Protocol',
      displayName: 'The Bloat Reset Protocol',
      tagline: 'For women who wake up flat and look pregnant by evening',
      weekOneResult: 'Reduced evening bloating, more predictable days',
      includes: [
        '20-minute meal timing strategies',
        'Top FODMAP trigger identification',
        'Daily tracking for pattern recognition'
      ]
    },
    regularity: {
      name: 'The Regularity Protocol',
      displayName: 'The Regularity Protocol',
      tagline: 'For women who go days without relief',
      weekOneResult: 'First signs of regularity, less straining',
      includes: [
        'Optimal hydration timing',
        'Fiber optimization without bloating',
        'Motility-supporting routines'
      ]
    },
    calm_gut: {
      name: 'The Calm Gut Protocol',
      displayName: 'The Calm Gut Protocol',
      tagline: "For women who can't trust their body",
      weekOneResult: 'Reduced urgency, calmer digestion after meals',
      includes: [
        'Trigger identification system',
        'Gut-soothing food combinations',
        'Urgency management strategies'
      ]
    },
    stability: {
      name: 'The Stability Protocol',
      displayName: 'The Stability Protocol',
      tagline: "For women who never know which day they'll get",
      weekOneResult: 'Beginning to identify pattern triggers',
      includes: [
        'Pattern tracking for both states',
        'Flexible food guidelines',
        'Transition management'
      ]
    },
    rebuild: {
      name: 'The Rebuild Protocol',
      displayName: 'The Rebuild Protocol',
      tagline: 'For women recovering from SIBO treatment',
      weekOneResult: 'Reintroduction framework, early signs of tolerance',
      includes: [
        'Post-treatment gut restoration',
        'PHGG prebiotic introduction',
        'MMC (migrating motor complex) support'
      ]
    }
  },

  // Nervous System Support overlay
  nervousSystemOverlay: {
    name: '+ Nervous System Support',
    tagline: 'Stress-gut connection tools integrated'
  },

  // =================================================
  // SCARCITY PERCENTAGES BY PROTOCOL
  // =================================================
  scarcityPercentages: {
    bloat_reset: 23,
    regularity: 18,
    calm_gut: 15,
    stability: 12,
    rebuild: 8
  },

  // =================================================
  // TIMELINE PREDICTIONS
  // =================================================
  timelinePredictions: {
    default: "Women with your profile typically start noticing changes within the **first month**.",
    high_impact: "Given how much this has affected your life, having a clear protocol can make a real difference. Most women start seeing progress within the **first 4-6 weeks**.",
    long_duration: "After {duration} of symptoms, your gut is ready for the right approach. Most women with similar timelines start noticing changes within **4-8 weeks**."
  },

  // =================================================
  // PRACTITIONERS
  // =================================================
  practitioners: {
    rebecca: {
      name: 'Rebecca Taylor',
      credentials: 'BSc, MS, RNutr',
      title: 'Registered Clinical Nutritionist',
      photo: '/about/practitioner-rebecca.png',
      quote: "I've reviewed profiles like yours many times. The pattern is clear — you need someone tracking your response and adjusting as you go, not another diet to try alone."
    },
    paulina: {
      name: 'Paulina Andrzejewska',
      credentials: 'MSc',
      title: 'Clinical Dietitian',
      photo: '/about/practitioner-paulina.png'
    }
  },

  // =================================================
  // GOAL TEXT MAPPINGS
  // =================================================
  goalTexts: {
    eat_freely: 'eat whatever you want without fear',
    travel: 'travel without bathroom anxiety',
    social: 'enjoy meals with friends and family',
    morning: 'have a normal, predictable morning'
  },

  // =================================================
  // COMPLAINT LABELS
  // =================================================
  complaintLabels: {
    bloating: 'Bloating & distension',
    constipation: 'Constipation',
    diarrhea: 'Diarrhea & urgency',
    mixed: 'Mixed/alternating symptoms',
    pain: 'Abdominal pain & cramping',
    gas: 'Excessive gas'
  },

  // =================================================
  // TREATMENT LABELS
  // =================================================
  treatmentLabels: {
    probiotics: 'probiotics',
    elimination: 'elimination diets',
    low_fodmap: 'Low FODMAP',
    fiber: 'fiber supplements',
    otc_meds: 'OTC medications',
    prescription: 'prescription medications',
    testing: 'functional testing',
    practitioner: 'practitioner guidance',
    nothing: 'none'
  },

  // =================================================
  // DURATION LABELS
  // =================================================
  durationLabels: {
    '3_6_months': '3-6 months',
    '6_12_months': '6-12 months',
    '1_3_years': '1-3 years',
    '3_5_years': '3-5 years',
    '5_plus_years': '5+ years'
  },

  // =================================================
  // DURATION TEXT (for timeline predictions)
  // =================================================
  durationText: {
    '5_plus_years': 'over 5 years',
    '3_5_years': '3-5 years',
    '1_3_years': '1-3 years',
    '6_12_months': '6-12 months',
    '3_6_months': '3-6 months'
  },

  // =================================================
  // RED FLAG MESSAGES
  // =================================================
  redFlagMessages: {
    safety_blood: 'Blood in stool',
    safety_weight: 'Unexplained weight loss of more than 10 lbs'
  },

  // =================================================
  // PHASES FOR PROGRESS BAR
  // =================================================
  phases: [
    { id: 1, label: 'Your Goals', screens: ['future_vision', 'timeline', 'primary_complaint', 'duration', 'validation_duration'] },
    { id: 2, label: 'Your Symptoms', screens: ['bm_relief', 'flare_frequency', 'stool_changes', 'progress_validation', 'treatments_tried', 'diagnosis_history', 'name_capture'] },
    { id: 3, label: 'Why This Works', screens: ['why_different', 'testimonial'] },
    { id: 4, label: 'Quick Gut Check', screens: ['knowledge_intro', 'knowledge_eating_speed', 'knowledge_eating_response', 'knowledge_fodmap', 'knowledge_fodmap_response'] },
    { id: 5, label: 'Your Profile', screens: ['stress_connection', 'stress_validation'] },
    { id: 6, label: 'Final Questions', screens: ['safety_blood', 'safety_weight', 'safety_warning'] },
    { id: 7, label: 'Your Results', screens: ['life_impact', 'email_capture', 'vision_optional'] }
  ]
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quizContent;
}
