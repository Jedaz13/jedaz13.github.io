/* =====================================================
   Quiz v4 Content - Gut Healing Academy
   30 Screens across 7 Blocks
   ===================================================== */

const quizContent = {
  // Member count used throughout
  memberCount: 847,

  // =================================================
  // BLOCK 1: GOALS & CONTEXT (Screens 1-5)
  // =================================================
  block1: {
    id: 'goals_context',
    label: 'Goals & Context',
    screens: [
      // Screen 1: Goal Selection
      {
        id: 'goal_selection',
        screenNumber: 1,
        type: 'single_select',
        question: 'If your gut worked perfectly tomorrow, what would you do first?',
        options: [
          {
            icon: '🍽️',
            text: 'Eat whatever I want without fear or calculation',
            value: 'eat_freely'
          },
          {
            icon: '🗺️',
            text: 'Travel or go somewhere without planning around bathrooms',
            value: 'travel_freedom'
          },
          {
            icon: '👥',
            text: 'Go out to dinner with friends or family, stress-free',
            value: 'social_eating'
          },
          {
            icon: '☕',
            text: 'Just enjoy a normal morning — coffee, breakfast, no symptoms',
            value: 'normal_morning'
          }
        ],
        storeAs: 'user_goal'
      },

      // Screen 2: Timeline Setting
      {
        id: 'timeline_setting',
        screenNumber: 2,
        type: 'single_select',
        question: 'When do you want to feel in control of your gut?',
        options: [
          {
            text: 'As soon as possible — I need relief now',
            value: 'asap'
          },
          {
            text: 'Within the next few weeks',
            value: 'few_weeks'
          },
          {
            text: "I'm ready to do this properly, however long it takes",
            value: 'long_term'
          },
          {
            text: 'I have an important event coming up',
            value: 'event'
          }
        ],
        storeAs: 'user_timeline',
        validationMessages: {
          asap: {
            title: "Let's be real with you.",
            message: "Most members notice improvement within the first 1-2 weeks. But real, lasting change — the kind where you stop thinking about your gut — takes 2-3 months.\n\nThe good news? You won't be doing this alone. Our practitioners review your progress and adjust as you go."
          },
          few_weeks: {
            title: "That's realistic.",
            message: "Most members see noticeable changes in weeks 1-2, and significant improvement by week 4. The key is consistency — and having someone who actually tracks your progress with you."
          },
          long_term: {
            title: "You're thinking about this the right way.",
            message: "Quick fixes are why you're still searching. Real gut healing typically takes 2-3 months, but you'll feel progress along the way. We're with you for the whole journey."
          },
          event: {
            title: "We can work with this.",
            message: "Tell us about your event and we'll prioritize fast-acting changes while building toward lasting improvement."
          }
        },
        showTimeline: true
      },

      // Screen 3: Primary Complaint
      {
        id: 'primary_complaint',
        screenNumber: 3,
        type: 'single_select',
        question: "What's your #1 struggle right now?",
        subtitle: 'Select the one that affects you most',
        options: [
          {
            text: 'Bloating — I wake up flat and look 6 months pregnant by evening',
            value: 'bloating',
            protocol: 'bloat_reset'
          },
          {
            text: 'Constipation — Days without relief, straining, never feeling done',
            value: 'constipation',
            protocol: 'regularity'
          },
          {
            text: "Diarrhea — Urgency, loose stools, can't trust my body",
            value: 'diarrhea',
            protocol: 'calm_gut'
          },
          {
            text: "It changes — I never know which day I'll get",
            value: 'mixed',
            protocol: 'stability'
          },
          {
            text: 'Pain and cramping that stops me in my tracks',
            value: 'pain',
            protocol: 'bloat_reset'
          },
          {
            text: 'Gas that makes me avoid being around people',
            value: 'gas',
            protocol: 'bloat_reset'
          }
        ],
        storeAs: 'primary_complaint'
      },

      // Screen 4: Frequency
      {
        id: 'frequency',
        screenNumber: 4,
        type: 'single_select',
        question: 'How often does this happen?',
        options: [
          {
            text: "Every single day — it's my baseline now",
            value: 'daily'
          },
          {
            text: "Several times a week — I'm always bracing for it",
            value: 'several_weekly'
          },
          {
            text: 'Weekly — bad days are predictable',
            value: 'weekly'
          },
          {
            text: 'A few times a month — flares come and go',
            value: 'monthly'
          }
        ],
        storeAs: 'symptom_frequency'
      },

      // Screen 5: Duration + Validation
      {
        id: 'duration',
        screenNumber: 5,
        type: 'single_select',
        question: 'How long have you been dealing with this?',
        options: [
          {
            text: '3-6 months — this is relatively new',
            value: '3_6_months'
          },
          {
            text: "6-12 months — it's becoming my normal",
            value: '6_12_months'
          },
          {
            text: "1-3 years — I've tried a few things",
            value: '1_3_years'
          },
          {
            text: "3-5 years — I've tried many things",
            value: '3_5_years'
          },
          {
            text: "5+ years — I've tried everything",
            value: '5_plus_years'
          }
        ],
        storeAs: 'symptom_duration',
        validationMessages: {
          '3_6_months': "Six months of unexplained symptoms is exhausting — especially when you don't know what's causing them. You're right to look for answers now.",
          '6_12_months': "A year of fighting your own body takes a toll. The good news? You're catching this before it becomes your whole identity.",
          '1_3_years': "After a few years, it's easy to lose hope. But you're still searching — that tells us something important about you.",
          '3_5_years': "Three to five years is a long time to feel this way. Most of our members came to us at exactly this stage.",
          '5_plus_years': "<strong>5+ years</strong> is a long time to fight your own body. You've likely tried everything. What our members at this stage discover is that the missing piece wasn't more restriction — it was structured support and someone who actually reviews their progress."
        },
        reinforcementMessage: "The difference this time? You won't be figuring it out alone. Our practitioners review your progress and adjust your protocol based on how YOUR gut responds."
      }
    ]
  },

  // =================================================
  // BLOCK 2: SYMPTOM PATTERNS (Screens 6-10)
  // =================================================
  block2: {
    id: 'symptom_patterns',
    label: 'Symptom Patterns',
    screens: [
      // Screen 6: BM Relief
      {
        id: 'bm_relief',
        screenNumber: 6,
        type: 'single_select',
        question: 'When you have a bowel movement, does your discomfort get better?',
        options: [
          {
            text: 'Yes — relief is temporary but real',
            value: 'yes'
          },
          {
            text: "Sometimes — it's unpredictable",
            value: 'sometimes'
          },
          {
            text: "No — going doesn't help",
            value: 'no'
          },
          {
            text: "I don't really have pain, just other symptoms",
            value: 'no_pain'
          }
        ],
        storeAs: 'bm_relief',
        note: 'Rome IV criteria question'
      },

      // Screen 7: Flare Frequency Change
      {
        id: 'flare_frequency',
        screenNumber: 7,
        type: 'single_select',
        question: 'During a flare, what happens to your bathroom frequency?',
        options: [
          {
            text: 'I go MORE often',
            value: 'more'
          },
          {
            text: 'I go LESS often',
            value: 'less'
          },
          {
            text: 'It swings both ways depending on the day',
            value: 'both'
          },
          {
            text: "Frequency doesn't really change",
            value: 'no_change'
          }
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
          {
            text: 'It gets loose, watery, or urgent',
            value: 'loose'
          },
          {
            text: 'It gets hard, lumpy, or difficult to pass',
            value: 'hard'
          },
          {
            text: "It alternates — I never know which it'll be",
            value: 'alternates'
          },
          {
            text: 'It stays about the same',
            value: 'same'
          }
        ],
        storeAs: 'stool_changes'
      },

      // Screen 9: Treatments Tried
      {
        id: 'treatments_tried',
        screenNumber: 9,
        type: 'multi_select',
        question: 'What have you already tried? Select all that apply.',
        options: [
          { text: 'Low FODMAP diet', value: 'low_fodmap' },
          { text: 'Gluten-free', value: 'gluten_free' },
          { text: 'Dairy-free', value: 'dairy_free' },
          { text: 'Probiotics (any brand)', value: 'probiotics' },
          { text: 'Digestive enzymes', value: 'enzymes' },
          { text: 'Prescription medications (PPIs, antispasmodics)', value: 'prescription' },
          { text: 'Antibiotics for SIBO (Rifaximin, etc.)', value: 'sibo_antibiotics' },
          { text: 'Herbal antimicrobials', value: 'herbal' },
          { text: 'Strict elimination diets', value: 'elimination' },
          { text: "Nothing yet — I'm just starting", value: 'nothing' }
        ],
        storeAs: 'treatments_tried',
        validationMessages: {
          range_0_1: "Starting fresh gives us a clear baseline to work from.",
          range_2_3: "You've done your research. Let's build on what you've learned.",
          range_4_5: "You've put in real effort. Most of these work — they just need the right sequence and someone tracking your response.",
          range_6_plus: "You've tried <strong>{count} different approaches</strong>. That's not failure — that's data. Our practitioners use exactly this kind of history to find what your gut actually needs."
        },
        reinforcementMessage: "Most of these CAN work — they just need the right sequence and someone tracking your response. That's what's been missing."
      },

      // Screen 10: Diagnosis History
      {
        id: 'diagnosis_history',
        screenNumber: 10,
        type: 'multi_select',
        question: 'Have you received any diagnosis? Select all that apply.',
        options: [
          { text: 'IBS (Irritable Bowel Syndrome)', value: 'ibs' },
          { text: 'SIBO (Small Intestinal Bacterial Overgrowth)', value: 'sibo' },
          { text: "IBD (Crohn's or Ulcerative Colitis)", value: 'ibd' },
          { text: 'GERD / Acid Reflux', value: 'gerd' },
          { text: 'Food intolerances or sensitivities', value: 'food_intolerance' },
          { text: "No formal diagnosis — doctors say tests look 'normal'", value: 'no_diagnosis' },
          { text: 'Other', value: 'other' }
        ],
        storeAs: 'diagnoses',
        specialValidation: {
          no_diagnosis: "'Normal' tests with real symptoms is incredibly frustrating. It doesn't mean nothing is wrong — it means standard tests aren't designed to catch functional gut issues.\n\nThis is exactly what our protocols are built for."
        }
      }
    ]
  },

  // =================================================
  // GOAL REMINDER #1 (After Screen 10)
  // =================================================
  goalReminder1: {
    id: 'goal_reminder_1',
    type: 'goal_reminder',
    reminderNumber: 1,
    template: "Remember: You said you want to {goal}.\n\nEvery question helps us get you there faster."
  },

  // =================================================
  // BLOCK 3: WHY WE'RE DIFFERENT (Screen 11)
  // =================================================
  block3: {
    id: 'why_different',
    label: 'Why We\'re Different',
    screens: [
      // Screen 11: Info Screen
      {
        id: 'why_programs_fail',
        screenNumber: 11,
        type: 'info',
        headline: 'WHY MOST GUT PROGRAMS FAIL',
        comparison: {
          problem: {
            title: '❌ The Cycle You\'ve Been Stuck In',
            text: "Get protocol → Try alone → Don't know if it's working → Give up too early OR stick with it too long → Back to square one"
          },
          solution: {
            title: '✓ How This Works',
            text: "Get protocol → Track daily (3 min) → Practitioner reviews → Adjustments based on YOUR response → Progress"
          }
        },
        statistic: {
          number: '78%',
          label: 'of members who complete their first month report significant symptom improvement',
          subtext: '— Based on 847 active members'
        },
        buttonText: 'Got it'
      }
    ]
  },

  // =================================================
  // BLOCK 4: GUT-BRAIN CONNECTION (Screens 12-16)
  // =================================================
  block4: {
    id: 'gut_brain',
    label: 'Gut-Brain Connection',
    screens: [
      // Screen 12: Intro
      {
        id: 'gut_brain_intro',
        screenNumber: 12,
        type: 'info',
        headline: 'UNDERSTANDING YOUR GUT-BRAIN CONNECTION',
        body: "Your gut has its own nervous system — 500 million neurons. That's more than your spinal cord.\n\nThe next few questions help us understand how YOUR stress and gut talk to each other.\n\nThere are no right or wrong answers.",
        buttonText: 'Continue'
      },

      // Screen 13: Slider - Stress-Gut
      {
        id: 'slider_stress_gut',
        screenNumber: 13,
        type: 'slider',
        question: 'My gut symptoms and my stress levels are...',
        leftAnchor: 'Completely unrelated',
        rightAnchor: 'Directly connected',
        min: 1,
        max: 5,
        storeAs: 'stress_gut_score',
        conditionalValidation: {
          threshold: 4,
          title: "You're noticing the gut-brain connection — and you're right.",
          message: "Your gut has 500 million neurons (more than your spinal cord). Stress signals travel directly to your digestive system.\n\nYour protocol will include nervous system tools alongside dietary changes."
        }
      },

      // Screen 14: Slider - Food Anxiety
      {
        id: 'slider_food_anxiety',
        screenNumber: 14,
        type: 'slider',
        question: 'Before eating, I worry about how my gut will react...',
        leftAnchor: "Never — I don't think about it",
        rightAnchor: "Always — I'm anxious before every meal",
        min: 1,
        max: 5,
        storeAs: 'food_anxiety_score',
        conditionalValidation: {
          threshold: 4,
          title: "Food anxiety is real, and it actually makes symptoms worse.",
          message: "When you're stressed about eating, your body shifts into 'fight or flight' mode — which shuts down digestion.\n\nWe'll work on breaking this cycle."
        }
      },

      // Screen 15: Slider - Mood Impact
      {
        id: 'slider_mood_impact',
        screenNumber: 15,
        type: 'slider',
        question: 'On bad gut days, my mood is...',
        leftAnchor: 'Completely unaffected',
        rightAnchor: 'Significantly worse',
        min: 1,
        max: 5,
        storeAs: 'mood_impact_score',
        conditionalValidation: {
          threshold: 4,
          title: "You're not imagining it, and you're not alone.",
          message: "Research shows gut issues increase anxiety and depression risk by 3x. It's bidirectional — your gut affects your brain, and your brain affects your gut.\n\nYour protocol addresses both sides of this connection."
        }
      },

      // Screen 16: Slider - Thought Frequency
      {
        id: 'slider_thought_frequency',
        screenNumber: 16,
        type: 'slider',
        question: 'I think about my gut issues...',
        leftAnchor: 'Rarely crosses my mind',
        rightAnchor: 'It dominates my thoughts daily',
        min: 1,
        max: 5,
        storeAs: 'thought_frequency_score',
        isLastSlider: true
      }
    ]
  },

  // =================================================
  // BLOCK 5: KNOWLEDGE QUIZ (Screens 17-20)
  // =================================================
  block5: {
    id: 'knowledge_quiz',
    label: 'Knowledge Quiz',
    screens: [
      // Screen 17: Intro
      {
        id: 'knowledge_intro',
        screenNumber: 17,
        type: 'info',
        headline: 'GUT KNOWLEDGE CHECK',
        body: "Let's see what you already know about how digestion works.\n\nDon't worry — there are no wrong answers. This helps us customize your education.",
        buttonText: 'Start'
      },

      // Screen 18: Knowledge Q1 - Eating Speed
      {
        id: 'knowledge_eating_speed',
        screenNumber: 18,
        type: 'knowledge_quiz',
        question: 'Quick question: When you eat quickly, what happens in your gut?',
        options: [
          { text: 'You swallow more air, causing bloating', value: 'air', correct: true },
          { text: 'Your stomach produces less acid', value: 'acid', correct: false },
          { text: "Nothing — speed doesn't matter", value: 'nothing', correct: false },
          { text: 'Food digests faster', value: 'faster', correct: false }
        ],
        storeAs: 'knowledge_q1',
        correctAnswer: 'air',
        feedback: {
          correct: {
            icon: '🎉',
            title: "You're right!",
            text: "When you eat quickly, you swallow excess air (called aerophagia) which gets trapped in your digestive system.\n\nThis is one of the first things we address in your protocol — most people see bloating reduce by 30-40% just by changing HOW they eat, not WHAT they eat."
          },
          incorrect: {
            icon: '💡',
            title: "Good guess! Here's what's actually happening:",
            text: "When you eat quickly, you swallow excess air (called aerophagia) which gets trapped in your digestive system.\n\nThis is one of the first things we address in your protocol — most people see bloating reduce by 30-40% just by changing HOW they eat, not WHAT they eat.",
            tip: "Don't worry — this is exactly why you'll have access to our practitioner team. When you're unsure about something, you can ask.\n\nNo more Googling at 2am wondering if you're doing it right."
          }
        }
      },

      // Screen 19: Knowledge Q2 - FODMAP Foods
      {
        id: 'knowledge_fodmap',
        screenNumber: 19,
        type: 'knowledge_quiz',
        question: 'Which of these foods is MOST likely to cause bloating for someone with gut issues?',
        options: [
          { text: 'Apple', value: 'apple', icon: '🍎', correct: true },
          { text: 'White rice', value: 'rice', icon: '🍚', correct: false },
          { text: 'Eggs', value: 'eggs', icon: '🥚', correct: false },
          { text: 'Chicken', value: 'chicken', icon: '🍗', correct: false }
        ],
        storeAs: 'knowledge_q2',
        correctAnswer: 'apple',
        feedback: {
          correct: {
            icon: '🎉',
            title: "You know your stuff!",
            text: "Apples ARE a common trigger — they're high in FODMAPs, which feed gut bacteria and produce gas.\n\nMeanwhile, white rice, eggs, and chicken are LOW-FODMAP and usually well-tolerated.\n\nYour protocol will build on what you already know and fill in the gaps.",
            tip: {
              title: 'GUT RESPONSE SYSTEM',
              items: [
                { color: 'green', text: '🟢 GREEN (Usually Safe): Rice, eggs, chicken, fish' },
                { color: 'yellow', text: '🟡 YELLOW (Test Carefully): Oats, sweet potato, some fruits' },
                { color: 'red', text: '🔴 RED (Common Triggers): Apples, onion, garlic, wheat' }
              ]
            }
          },
          incorrect: {
            icon: '🍎',
            title: "Tricky one! Here's why:",
            text: "Apples are HIGH in FODMAPs — fermentable sugars that feed gut bacteria and produce gas. They're one of the most common triggers, even though they're \"healthy.\"\n\nRice, chicken, and eggs are usually well-tolerated because they're low-FODMAP.",
            tip: "Here's the thing: you're not supposed to know this already.\n\nMost people have never been taught how their gut actually works. That's not your fault.\n\nYour protocol includes:\n✓ Your personalized Green/Yellow/Red food list\n✓ Clear explanations of WHY certain foods trigger YOU\n✓ Direct access to practitioners when you're unsure\n\nYou won't be Googling \"is [food] okay for IBS?\" anymore."
          }
        }
      },

      // Screen 20: Knowledge Q3 - Meal Timing
      {
        id: 'knowledge_meal_timing',
        screenNumber: 20,
        type: 'knowledge_quiz',
        question: 'For someone with bloating, which eating pattern typically works BETTER?',
        options: [
          { text: '3 larger meals with no snacking', value: '3_meals', correct: true },
          { text: '5-6 small meals throughout the day', value: 'grazing', correct: false },
          { text: 'Eating whenever hungry', value: 'intuitive', correct: false },
          { text: 'Intermittent fasting (long gaps)', value: 'fasting', correct: false }
        ],
        storeAs: 'knowledge_q3',
        correctAnswer: '3_meals',
        feedback: {
          correct: {
            icon: '🎉',
            title: "Exactly right!",
            text: "Spacing meals 4-5 hours apart allows your gut's \"cleaning wave\" (the MMC) to sweep out bacteria and debris.\n\nConstant snacking keeps your gut in \"digestion mode\" and never lets this cleaning cycle complete.\n\nThis is why our protocols include specific meal timing — not just food choices."
          },
          incorrect: {
            icon: '💡',
            title: "This one surprises most people:",
            text: "Spacing meals 4-5 hours apart allows your gut's \"cleaning wave\" (called the Migrating Motor Complex) to sweep out bacteria and debris between meals.\n\nConstant snacking keeps your gut in \"digestion mode\" and never lets this cleaning cycle complete — which often makes bloating WORSE.",
            tip: "This is the kind of thing that's easy to get wrong on your own.\n\nIn your protocol, you'll have clear meal timing guidelines — and if you're unsure whether something applies to YOUR situation, you can ask our practitioners directly."
          }
        },
        isLastKnowledgeQuiz: true
      }
    ]
  },

  // =================================================
  // GOAL REMINDER #2 (After Screen 20)
  // =================================================
  goalReminder2: {
    id: 'goal_reminder_2',
    type: 'goal_reminder',
    reminderNumber: 2,
    template: "You're almost there, {name}.\n\nYou started this quiz because you want to {goal}.\n\nJust a few more questions and your personalized protocol will be ready."
  },

  // =================================================
  // BLOCK 6: SAFETY SCREENING (Screens 21-24)
  // =================================================
  block6: {
    id: 'safety_screening',
    label: 'Safety Screening',
    screens: [
      // Screen 21: Safety Intro
      {
        id: 'safety_intro',
        screenNumber: 21,
        type: 'info',
        headline: 'SAFETY CHECK',
        body: "Before we finalize your protocol, we need to make sure we're addressing functional gut issues — not something that needs medical attention first.\n\nThese questions take 30 seconds and help us give you responsible recommendations.\n\nOur practitioners review these to ensure your protocol is appropriate for your situation.",
        buttonText: 'Continue'
      },

      // Screen 22: Weight Loss
      {
        id: 'safety_weight_loss',
        screenNumber: 22,
        type: 'single_select',
        question: 'In the past 3 months, have you lost weight without trying to?',
        options: [
          { text: 'Yes, more than 10 lbs (4.5 kg)', value: 'yes_significant', redFlag: true },
          { text: 'Yes, a few pounds', value: 'yes_minor', redFlag: false },
          { text: 'No, my weight has been stable', value: 'no', redFlag: false },
          { text: "No, I've actually gained weight", value: 'gained', redFlag: false }
        ],
        storeAs: 'safety_weight_loss'
      },

      // Screen 23: Blood in Stool
      {
        id: 'safety_blood',
        screenNumber: 23,
        type: 'single_select',
        question: 'Have you noticed any blood in your stool, or stools that are black and tarry?',
        options: [
          { text: 'Yes, recently', value: 'yes_recent', redFlag: true },
          { text: 'Yes, but not in the past 6 months', value: 'yes_past', redFlag: false },
          { text: 'No, never', value: 'no', redFlag: false },
          { text: "I'm not sure", value: 'unsure', redFlag: false }
        ],
        storeAs: 'safety_blood'
      },

      // Screen 24: Family History
      {
        id: 'safety_family',
        screenNumber: 24,
        type: 'single_select',
        question: 'Does anyone in your immediate family have colon cancer or inflammatory bowel disease?',
        options: [
          { text: 'Yes', value: 'yes', redFlag: true },
          { text: 'No', value: 'no', redFlag: false },
          { text: "I'm not sure", value: 'unsure', redFlag: false }
        ],
        storeAs: 'safety_family'
      }
    ]
  },

  // =================================================
  // BLOCK 7: EMAIL & FINAL (Screens 25-28)
  // =================================================
  block7: {
    id: 'email_final',
    label: 'Final Questions',
    screens: [
      // Screen 25: Email Capture
      {
        id: 'email_capture',
        screenNumber: 25,
        type: 'email_input',
        headline: 'Your personalized protocol is ready.',
        subtitle: 'Enter your email to see your results.',
        placeholder: 'your@email.com',
        buttonText: 'See My Results',
        privacyText: 'We respect your privacy. No spam, ever.',
        storeAs: 'user_email'
      },

      // Screen 26: Life Impact
      {
        id: 'life_impact',
        screenNumber: 26,
        type: 'single_select',
        question: 'How much has this taken from your life?',
        options: [
          {
            text: "Everything — I've changed jobs, stopped traveling, missed things I can't get back",
            value: 'severe'
          },
          {
            text: "A lot — I regularly say no to things I want to say yes to",
            value: 'moderate'
          },
          {
            text: "Some — it's frustrating but I manage around it",
            value: 'mild'
          }
        ],
        storeAs: 'life_impact'
      },

      // Screen 27: Vision
      {
        id: 'vision',
        screenNumber: 27,
        type: 'text_input',
        question: 'If your gut worked perfectly tomorrow, what would you do first?',
        placeholder: 'Picture your life without gut issues...',
        hint: 'You said you want to {goal}. What does that look like for you?',
        storeAs: 'user_vision',
        optional: true,
        skipText: 'Skip',
        validationMessage: "Hold onto that image.\n\nThat's not just a dream — it's what we're working toward. Your protocol is designed to get you there step by step."
      },

      // Screen 28: Name Collection
      {
        id: 'name_collection',
        screenNumber: 28,
        type: 'text_input',
        question: "What's your first name?",
        subtitle: 'So we can personalize your results',
        placeholder: 'Your first name',
        storeAs: 'user_name',
        buttonText: 'See My Protocol'
      }
    ]
  },

  // =================================================
  // LOADING SEQUENCE (Screen 29)
  // =================================================
  loadingSequence: {
    id: 'loading_sequence',
    screenNumber: 29,
    type: 'loading',
    headline: 'CREATING YOUR PERSONALIZED PROTOCOL',
    steps: [
      { text: 'Analyzing symptom patterns...', duration: 2000 },
      { text: 'Cross-referencing with 847 member profiles...', duration: 2500 },
      { text: 'Matching gut response patterns...', duration: 2000 },
      { text: 'Identifying your protocol...', duration: 1500 },
      { text: 'Generating recommendations...', duration: 2000 }
    ],
    popupQuestions: [
      {
        id: 'symptom_timing',
        question: 'Do your symptoms tend to be worse in the evening than morning?',
        options: ['Yes', 'No', 'About the same'],
        storeAs: 'symptom_timing',
        triggerAtPercent: 30
      },
      {
        id: 'symptom_trigger_timing',
        question: 'Do you notice symptoms are worse after eating, or on an empty stomach?',
        options: ['After eating', 'Empty stomach', 'Both/Neither'],
        storeAs: 'symptom_trigger_timing',
        triggerAtPercent: 60
      }
    ],
    completionMessage: '✓ Your personalized protocol is ready'
  },

  // =================================================
  // RESULTS PAGE (Screen 30)
  // =================================================
  resultsPage: {
    id: 'results_page',
    screenNumber: 30,
    type: 'results'
  },

  // =================================================
  // PROTOCOLS
  // =================================================
  protocols: {
    bloat_reset: {
      name: 'The Bloat Reset Protocol',
      tagline: 'For women who wake up flat and look pregnant by evening',
      weekOneResult: 'Reduced evening bloating, more predictable days'
    },
    regularity: {
      name: 'The Regularity Protocol',
      tagline: 'For women who go days without relief',
      weekOneResult: 'First signs of regularity, less straining'
    },
    calm_gut: {
      name: 'The Calm Gut Protocol',
      tagline: "For women who can't trust their body",
      weekOneResult: 'Reduced urgency, calmer digestion after meals'
    },
    stability: {
      name: 'The Stability Protocol',
      tagline: "For women who never know which day they'll get",
      weekOneResult: 'Beginning to identify pattern triggers'
    },
    rebuild: {
      name: 'The Rebuild Protocol',
      tagline: 'For women recovering from SIBO treatment',
      weekOneResult: 'Reintroduction framework, early signs of tolerance'
    }
  },

  // Nervous System Support overlay
  nervousSystemOverlay: {
    name: '+ Nervous System Support',
    tagline: 'Stress-gut connection tools integrated'
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
    travel_freedom: 'travel without planning around bathrooms',
    social_eating: 'enjoy meals with friends and family stress-free',
    normal_morning: 'enjoy a normal morning without symptoms'
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
    low_fodmap: 'Low FODMAP',
    gluten_free: 'gluten-free',
    dairy_free: 'dairy-free',
    probiotics: 'probiotics',
    enzymes: 'digestive enzymes',
    prescription: 'prescription medications',
    sibo_antibiotics: 'SIBO antibiotics',
    herbal: 'herbal antimicrobials',
    elimination: 'elimination diets',
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
  // RED FLAG MESSAGES
  // =================================================
  redFlagMessages: {
    safety_weight_loss: 'Unexplained weight loss of more than 10 lbs',
    safety_blood: 'Blood in stool',
    safety_family: 'Family history of colon cancer or IBD'
  }
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quizContent;
}
