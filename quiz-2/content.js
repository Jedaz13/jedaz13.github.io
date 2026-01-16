// Quiz Content Data Structure for Survey-Style Quiz
// All questions organized by section

const quizContent = {
  sections: [
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
            { text: 'Bloating - I wake up flat and look pregnant by evening', value: 'bloating' },
            { text: 'Constipation - Not going for days, straining, never feeling done', value: 'constipation' },
            { text: "Diarrhea - Urgency, loose stools, can't trust my body", value: 'diarrhea' },
            { text: 'Unpredictability - I swing between constipation and diarrhea', value: 'mixed' },
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
            { text: "Every single day - it's my baseline now", value: 'daily' },
            { text: "Several times a week - I'm always bracing for it", value: 'several_weekly' },
            { text: 'Weekly - bad days are predictable', value: 'weekly' },
            { text: 'A few times a month - flares come and go', value: 'monthly' }
          ]
        },
        {
          id: 'q7_bm_relief',
          text: 'When you have a bowel movement, does your pain or discomfort get better?',
          type: 'single',
          options: [
            { text: 'Yes - relief is temporary but real', value: 'yes' },
            { text: "Sometimes - it's unpredictable", value: 'sometimes' },
            { text: "No - going doesn't help the pain", value: 'no' },
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
          text: 'What about your stool during flares - what changes?',
          type: 'single',
          options: [
            { text: 'It gets loose, watery, or urgent', value: 'loose' },
            { text: 'It gets hard, lumpy, or difficult to pass', value: 'hard' },
            { text: "It alternates - I never know which it'll be", value: 'alternates' },
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
            { text: '3-6 months - this is relatively new', value: '3-6_months' },
            { text: "6-12 months - it's becoming my normal", value: '6-12_months' },
            { text: "1-3 years - I've tried a few things", value: '1-3_years' },
            { text: "3-5 years - I've tried many things", value: '3-5_years' },
            { text: "5+ years - I've tried everything", value: '5+_years' }
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
            { text: 'No formal diagnosis - doctors say tests look "normal"', value: 'no_diagnosis' },
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
            { text: "Nothing yet - I'm just starting to look for answers", value: 'nothing' }
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
            { text: 'It gets significantly worse - stress is a clear trigger', value: 'significant' },
            { text: "There's some connection, but it's not the whole picture", value: 'some' },
            { text: "Honestly, I haven't noticed a pattern", value: 'none' }
          ]
        },
        {
          id: 'q14_mental_health',
          text: 'Has dealing with your gut affected your mental health?',
          type: 'single',
          options: [
            { text: 'Yes - I feel anxious, depressed, or hopeless because of this', value: 'yes' },
            { text: 'Sometimes - bad gut days are bad mental health days', value: 'sometimes' },
            { text: 'No - my mood is separate from my gut', value: 'no' }
          ]
        },
        {
          id: 'q15_sleep',
          text: "How's your sleep?",
          type: 'single',
          options: [
            { text: "Poor - I wake up, can't fall asleep, or don't feel rested", value: 'poor' },
            { text: 'Hit or miss - some nights okay, others rough', value: 'mixed' },
            { text: "Generally good - sleep isn't my issue", value: 'good' }
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
            { text: "Everything - I've changed jobs, stopped traveling, missed things I can't get back", value: 'severe' },
            { text: 'A lot - I regularly say no to things I want to say yes to', value: 'moderate' },
            { text: "Some - it's frustrating but I manage around it", value: 'mild' }
          ]
        },
        {
          id: 'q17_hardest_part',
          text: "What's the hardest part about living with gut issues right now?",
          type: 'text',
          placeholder: 'Share what weighs on you most...'
        },
        {
          id: 'q18_vision',
          text: 'If you woke up tomorrow and your gut just worked - what would you do first?',
          type: 'text',
          placeholder: 'Picture your life without gut issues...'
        }
      ]
    }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quizContent;
}
