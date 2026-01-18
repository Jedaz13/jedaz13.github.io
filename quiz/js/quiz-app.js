// Quiz Application - Main Controller
// Dependencies: quiz-content.js, quiz-logic.js

// Configuration
const CONFIG = {
  // Make.com webhook URL
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',

  // Supabase configuration
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E',

  // Avatar image path (fallback to SVG if PNG not available)
  AVATAR_PATH: 'assets/rebecca-avatar.png',
  AVATAR_FALLBACK: 'assets/rebecca-avatar.svg',
  // Default typing delay in ms
  DEFAULT_DELAY: 1000,
  // Reading speed configuration (words per minute)
  // Using faster speed to keep engagement high
  READING_SPEED_WPM: 300,
  // Minimum reading delay in ms (quick pause between messages)
  MIN_READING_DELAY: 400,
  // Maximum reading delay in ms (cap for long messages)
  MAX_READING_DELAY: 2500
};

/**
 * Calculate reading time for a message based on word count
 * Using 300 wpm for faster pacing to maintain engagement
 * @param {string} text - The message text
 * @returns {number} - Delay in milliseconds
 */
function calculateReadingDelay(text) {
  if (!text) return CONFIG.MIN_READING_DELAY;

  // Strip HTML tags for accurate word count
  const plainText = text.replace(/<[^>]*>/g, '').replace(/\{\{[^}]*\}\}/g, '');
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Calculate delay: (words / wpm) * 60 * 1000 = ms
  const readingTime = (wordCount / CONFIG.READING_SPEED_WPM) * 60 * 1000;

  // Clamp between min and max
  return Math.max(CONFIG.MIN_READING_DELAY, Math.min(CONFIG.MAX_READING_DELAY, readingTime));
}

// Initialize Supabase client (only if credentials are configured)
var supabaseClient = null;
if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
  supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}

/**
 * Submit quiz data to Supabase users table
 * @param {Object} options - Submission options
 * @param {boolean} options.isRedFlagExit - Whether this is a red flag exit submission
 * @returns {Promise<Object|null>} - Supabase response or null if failed/not configured
 */
async function submitToSupabase({ isRedFlagExit = false } = {}) {
  // Skip if Supabase is not configured
  if (!supabaseClient) {
    console.log('Supabase not configured - skipping database submission');
    return null;
  }

  try {
    // Build the user record matching your Supabase table structure
    const userRecord = {
      // Contact info
      name: state.userName || null,
      email: state.userEmail || null,

      // Protocol info (0 for red flag exits)
      protocol: isRedFlagExit ? 0 : (state.protocol?.protocol || null),
      protocol_name: isRedFlagExit ? 'Red Flag Exit' : (state.protocol?.name || null),

      // Stress and red flag status
      has_stress_component: state.protocol?.hasStressComponent || false,
      has_red_flags: isRedFlagExit || state.answers.had_red_flags || false,
      red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,

      // Red flag details (which red flags were triggered)
      red_flag_details: buildRedFlagDetails(),

      // Question answers mapped to your column names (field names match quiz-content.js)
      primary_complaint: state.answers.q5_primary_complaint || null,        // Q5
      symptom_frequency: state.answers.q6_frequency || null,                // Q6
      relief_after_bm: state.answers.q7_bm_relief || null,                  // Q7
      frequency_during_flare: state.answers.q8_frequency_change || null,    // Q8
      stool_during_flare: state.answers.q9_stool_change || null,            // Q9
      duration: state.answers.q10_duration || null,                         // Q10
      diagnoses: state.answers.q11_diagnosis || [],                         // Q11 (array)
      treatments_tried: state.answers.q12_tried || [],                      // Q12 (array)
      stress_connection: state.answers.q13_stress || null,                  // Q13
      mental_health_impact: state.answers.q14_mental_health || null,        // Q14
      sleep_quality: state.answers.q15_sleep || null,                       // Q15
      life_impact_level: state.answers.q16_life_impact || null,             // Q16
      hardest_part: state.answers.q17_hardest_part || null,                 // Q17 (free text)
      dream_outcome: state.answers.q18_vision || null,                      // Q18 (free text)

      // Default values for new users
      role: 'member',
      status: 'lead',
      trial_start_date: null,
      subscription_type: null
    };

    // Insert via RPC function to bypass RLS policies
    const { error } = await supabaseClient.rpc('insert_quiz_lead', {
      user_data: userRecord
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return null;
    }

    console.log('Supabase submission successful');
    return true;

  } catch (error) {
    console.error('Error submitting to Supabase:', error);
    // Don't throw - we want the quiz to continue even if Supabase fails
    return null;
  }
}

/**
 * Build red flag details object from quiz answers
 * @returns {Object} - JSONB object with red flag information
 */
function buildRedFlagDetails() {
  const redFlags = {};

  // Check each red flag question (Q1-Q4)
  if (state.answers.q1_weight_loss === 'yes') {
    redFlags.unexplained_weight_loss = true;
  }
  if (state.answers.q2_blood === 'yes') {
    redFlags.blood_in_stool = true;
  }
  if (state.answers.q3_family_history === 'yes') {
    redFlags.family_history_gi_cancer = true;
  }
  if (state.answers.q4_colonoscopy === 'yes') {
    redFlags.needs_colonoscopy = true;
  }

  // Return null if no red flags, otherwise return the object
  return Object.keys(redFlags).length > 0 ? redFlags : null;
}

// Avatar fallback handler
function getAvatarHTML() {
  return `<img src="${CONFIG.AVATAR_PATH}"
    alt="Rebecca"
    class="message-avatar"
    onerror="this.onerror=null; this.src='${CONFIG.AVATAR_FALLBACK}'; this.classList.add('avatar-fallback');">`;
}

// Sales page redirect URL
const SALES_PAGE_URL = 'https://www.guthealingacademy.com/offer/';

// Quiz progress parts mapping (includes all sections for accurate progress tracking)
const QUIZ_PARTS = {
  1: { name: 'Safety Screening', sections: ['part1_intro', 'q2_blood', 'q3_family_history', 'q4_colonoscopy'] },
  2: { name: 'Symptom Pattern', sections: ['part2_intro', 'q5_validation', 'q6_frequency', 'q7_bm_relief', 'q8_frequency_change', 'q9_stool_change', 'email_capture_early'] },
  3: { name: 'Your History', sections: ['part3_intro', 'q10_validation_long', 'q11_diagnosis', 'q12_tried', 'q12_validation_persistent', 'testimonial_interlude'] },
  4: { name: 'Gut-Brain Connection', sections: ['part4_intro', 'q14_mental_health', 'q15_sleep'] },
  5: { name: 'Life Impact', sections: ['part5_intro', 'q17_hardest_part', 'q17_response', 'email_capture', 'get_email', 'email_already_captured', 'final_message', 'confirmation', 'show_calculating_redirect'] }
};

// Calculating messages for loading screen
const CALCULATING_MESSAGES = [
  "Analyzing your symptom pattern...",
  "Reviewing your health history...",
  "Matching to protocol database...",
  "Finalizing your personalized protocol..."
];

// Redirect timer reference
let redirectTimer = null;

/**
 * Update the progress indicator based on current section
 * @param {string} sectionKey - Current section key
 */
function updateProgress(sectionKey) {
  const progressEl = document.getElementById('quizProgress');
  const currentPartEl = document.getElementById('currentPart');
  const partNameEl = document.getElementById('partName');

  if (!progressEl) return;

  // Only hide progress for intro, more_info, and exit/red flag sections
  const hiddenSections = ['intro', 'more_info', 'red_flag_warning', 'exit_message', 'exit_get_email', 'exit_final'];
  if (hiddenSections.includes(sectionKey)) {
    progressEl.style.display = 'none';
    return;
  }

  // Show progress bar
  progressEl.style.display = 'block';

  // Sections that show completed progress (Part 5 at 100%)
  const completedSections = ['results_chunk1', 'results_chunk2', 'results_chunk3', 'redirect_to_sales'];
  const isCompleted = completedSections.includes(sectionKey);

  // Find current part and section index based on section key
  let currentPart = isCompleted ? 5 : 1;
  let sectionIndex = 0;
  let totalSections = 1;

  if (!isCompleted) {
    for (const [partNum, partData] of Object.entries(QUIZ_PARTS)) {
      const idx = partData.sections.indexOf(sectionKey);
      if (idx !== -1) {
        currentPart = parseInt(partNum);
        sectionIndex = idx;
        totalSections = partData.sections.length;
        break;
      }
    }
  } else {
    // For completed sections, use Part 5's last section
    sectionIndex = QUIZ_PARTS[5].sections.length - 1;
    totalSections = QUIZ_PARTS[5].sections.length;
  }

  // Calculate progress percentage within current part
  // Start at some % after entering the part, reach 100% at last section
  const progressPercent = Math.round(((sectionIndex + 1) / totalSections) * 100);

  // Update text
  if (currentPartEl) currentPartEl.textContent = currentPart;
  if (partNameEl && QUIZ_PARTS[currentPart]) {
    partNameEl.textContent = QUIZ_PARTS[currentPart].name;
  }

  // Update segments with progressive fill
  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach((segment, index) => {
    const partNum = index + 1;
    segment.classList.remove('active', 'completed');
    segment.style.setProperty('--progress', '0%');

    if (partNum < currentPart) {
      segment.classList.add('completed');
      segment.style.setProperty('--progress', '100%');
    } else if (partNum === currentPart) {
      segment.classList.add('active');
      segment.style.setProperty('--progress', `${progressPercent}%`);
    }
  });
}

/**
 * Show enhanced calculating overlay with personalized data
 * @returns {Promise} Resolves after 10 seconds
 */
function showCalculatingScreen() {
  return new Promise((resolve) => {
    // Hide progress bar
    const progressEl = document.getElementById('quizProgress');
    if (progressEl) progressEl.style.display = 'none';

    // Get personalized data
    const primaryComplaint = state.answers.q5_primary_complaint || 'digestive issues';
    const diagnoses = formatDiagnoses(state.answers.q11_diagnosis);
    const protocolName = state.protocol ? state.protocol.name : 'Personalized Gut Healing';

    // Testimonials matched to patterns
    const testimonials = {
      bloating: { name: 'Suzy', quote: 'The bloating that made me look 6 months pregnant? Gone within 3 weeks of following my protocol.' },
      constipation: { name: 'Amanda', quote: 'After years of struggling, I finally have regular, comfortable digestion. It changed everything.' },
      diarrhea: { name: 'Cheryl', quote: 'I can finally leave the house without mapping every bathroom. The urgency is completely manageable now.' },
      mixed: { name: 'Cheryl', quote: 'The unpredictability was the worst part. Now I actually know what to expect from my body.' },
      pain: { name: 'Amanda', quote: 'The cramping that used to double me over? I barely notice it anymore.' },
      gas: { name: 'Suzy', quote: 'I used to avoid social situations. Now I can actually enjoy dinner with friends again.' },
      reflux: { name: 'Amanda', quote: 'No more burning, no more sleeping propped up. I can eat without fear.' }
    };
    const testimonial = testimonials[primaryComplaint] || testimonials.bloating;

    // Generate believable number for social proof
    const baseNumbers = { bloating: 2847, constipation: 1923, diarrhea: 1456, mixed: 987, pain: 1234, gas: 876, reflux: 1567 };
    const reliefNumber = (baseNumbers[primaryComplaint] || 1200) + Math.floor(Math.random() * 200);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'calculating-overlay';
    overlay.innerHTML = `
      <div class="calculating-content">
        <div class="calculating-spinner"></div>
        <div class="calculating-stage" id="calc-stage-1">
          <p class="calculating-message">Analyzing your symptom pattern...</p>
          <div class="calculating-highlight">
            <span class="highlight-label">Primary concern:</span>
            <span class="highlight-value">${formatComplaintLabel(primaryComplaint)}</span>
          </div>
        </div>
        <div class="calculating-stage hidden" id="calc-stage-2">
          <p class="calculating-message">Reviewing your health history...</p>
          ${diagnoses ? `<div class="calculating-highlight"><span class="highlight-label">Conditions:</span><span class="highlight-value">${diagnoses}</span></div>` : ''}
        </div>
        <div class="calculating-stage hidden" id="calc-stage-3">
          <p class="calculating-message">Cross-referencing protocol database...</p>
          <div class="calculating-progress-bar"><div class="calculating-progress-fill"></div></div>
          <p class="calculating-submessage">Matching against 6 specialized protocols...</p>
        </div>
        <div class="calculating-stage hidden" id="calc-stage-4">
          <p class="calculating-message">Finalizing your personalized protocol...</p>
          <div class="protocol-reveal">
            <span class="reveal-label">Best match:</span>
            <span class="reveal-value">${protocolName}</span>
          </div>
        </div>
        <div class="calculating-stage hidden" id="calc-stage-5">
          <div class="calculating-testimonial">
            <p class="testimonial-intro">Women with similar patterns report:</p>
            <div class="testimonial-card-mini">
              <p class="testimonial-quote">"${testimonial.quote}"</p>
              <p class="testimonial-name">— ${testimonial.name}</p>
            </div>
          </div>
        </div>
        <div class="calculating-stage hidden" id="calc-stage-6">
          <div class="social-proof-final">
            <p class="proof-number">${reliefNumber.toLocaleString()}</p>
            <p class="proof-text">women with ${protocolName} pattern have found relief</p>
          </div>
          <p class="calculating-redirect">Redirecting to your protocol...</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    // Stage timing sequence (slowed down for readability)
    const stages = [
      { id: 'calc-stage-1', delay: 0 },      // Symptom pattern - show for 3.5s
      { id: 'calc-stage-2', delay: 3500 },   // Health history - show for 3.5s
      { id: 'calc-stage-3', delay: 7000 },   // Cross-referencing - show for 4s
      { id: 'calc-stage-4', delay: 11000 },  // Protocol reveal - show for 4s
      { id: 'calc-stage-5', delay: 15000 },  // Testimonial - show for 4s
      { id: 'calc-stage-6', delay: 19000 }   // Social proof + redirect - show for 2s
    ];

    stages.forEach(stage => {
      setTimeout(() => {
        // Hide all stages
        overlay.querySelectorAll('.calculating-stage').forEach(el => el.classList.add('hidden'));
        // Show current stage
        const currentStage = overlay.querySelector(`#${stage.id}`);
        if (currentStage) {
          currentStage.classList.remove('hidden');
          currentStage.classList.add('fade-in');
        }
      }, stage.delay);
    });

    // Complete after 21 seconds total
    setTimeout(() => {
      overlay.classList.remove('visible');
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 300);
    }, 21000);
  });
}

/**
 * Format primary complaint to readable label
 */
function formatComplaintLabel(complaint) {
  const labels = {
    bloating: 'Bloating & distension',
    constipation: 'Constipation',
    diarrhea: 'Diarrhea & urgency',
    mixed: 'Alternating patterns',
    pain: 'Pain & cramping',
    gas: 'Gas & discomfort',
    reflux: 'Heartburn & reflux'
  };
  return labels[complaint] || complaint;
}

// Diagnosis value to display text mapping
const DIAGNOSIS_MAP = {
  'ibs': 'IBS',
  'sibo': 'SIBO',
  'ibd': 'IBD',
  'gerd': 'GERD',
  'food_intolerance': 'food intolerances',
  'other': 'other conditions'
};

// Treatment value to display text mapping
const TREATMENT_MAP = {
  'low_fodmap': 'Low FODMAP',
  'gluten_free': 'gluten-free diet',
  'dairy_free': 'dairy-free diet',
  'probiotics': 'probiotics',
  'enzymes': 'digestive enzymes',
  'prescription': 'prescription medications',
  'sibo_antibiotics': 'SIBO antibiotics',
  'herbal': 'herbal antimicrobials',
  'elimination': 'elimination diets'
};

/**
 * Format diagnoses array into readable text
 * @param {Array|string} diagnoses - q11_diagnosis answer(s)
 * @returns {string} - Formatted diagnosis list
 */
function formatDiagnoses(diagnoses) {
  if (!diagnoses) return '';

  const diagArray = Array.isArray(diagnoses) ? diagnoses : [diagnoses];
  const mapped = diagArray
    .filter(d => d !== 'no_diagnosis')
    .map(d => DIAGNOSIS_MAP[d] || d);

  if (mapped.length === 0) return '';
  if (mapped.length === 1) return mapped[0];
  if (mapped.length === 2) return `${mapped[0]} and ${mapped[1]}`;

  const last = mapped.pop();
  return `${mapped.join(', ')}, and ${last}`;
}

/**
 * Format treatments array into readable text (top 2-3 items)
 * @param {Array|string} treatments - q12_tried answer(s)
 * @param {number} limit - Maximum number of treatments to show (default 3)
 * @returns {string} - Formatted treatment list
 */
function formatTreatments(treatments, limit = 3) {
  if (!treatments) return '';

  const treatArray = Array.isArray(treatments) ? treatments : [treatments];
  const mapped = treatArray
    .filter(t => t !== 'nothing')
    .slice(0, limit)
    .map(t => TREATMENT_MAP[t] || t);

  if (mapped.length === 0) return '';
  if (mapped.length === 1) return mapped[0];
  if (mapped.length === 2) return `${mapped[0]} and ${mapped[1]}`;

  const last = mapped.pop();
  return `${mapped.join(', ')}, and ${last}`;
}

/**
 * Determine which Chunk 2 scenario applies and generate message
 * @returns {string} - The appropriate message for the user's situation
 */
function getResultsChunk2Message() {
  const diagnoses = state.answers.q11_diagnosis;
  const treatments = state.answers.q12_tried;

  // Determine if user has a diagnosis (not just "no_diagnosis")
  const diagArray = Array.isArray(diagnoses) ? diagnoses : [diagnoses];
  const hasDiagnosis = diagArray.some(d => d && d !== 'no_diagnosis');

  // Determine if user has tried treatments (not just "nothing")
  const treatArray = Array.isArray(treatments) ? treatments : [treatments];
  const hasTriedThings = treatArray.some(t => t && t !== 'nothing');

  const formattedDiagnoses = formatDiagnoses(diagnoses);
  const formattedTreatments = formatTreatments(treatments);

  // Scenario A: Has diagnosis + has tried things
  if (hasDiagnosis && hasTriedThings) {
    return `You've been diagnosed with <strong>${formattedDiagnoses}</strong> and you've already tried <strong>${formattedTreatments}</strong>. That tells me you're not lacking effort - you're lacking the right guidance for YOUR specific pattern.`;
  }

  // Scenario B: No diagnosis + has tried things
  if (!hasDiagnosis && hasTriedThings) {
    return `Even without a formal diagnosis, you've already tried <strong>${formattedTreatments}</strong>. That tells me you're not lacking effort - the generic approaches just weren't built for YOUR pattern.`;
  }

  // Scenario C: Has diagnosis + hasn't tried anything
  if (hasDiagnosis && !hasTriedThings) {
    return `You've been diagnosed with <strong>${formattedDiagnoses}</strong>, but you're just starting to look for answers. That's actually good news - we can guide you from the start without having to undo approaches that weren't right for you.`;
  }

  // Scenario D: No diagnosis + hasn't tried anything
  return `You're just starting to look for answers. That's actually good news - we can guide you from the start with an approach matched to YOUR specific pattern, not generic advice that might not fit.`;
}

/**
 * Format diagnoses for URL parameter (uses readable text)
 * @param {Array|string} diagnoses - q11_diagnosis answer(s)
 * @returns {string} - Comma-separated diagnosis list
 */
function formatDiagnosesForUrl(diagnoses) {
  if (!diagnoses) return '';

  const diagArray = Array.isArray(diagnoses) ? diagnoses : [diagnoses];
  const mapped = diagArray
    .filter(d => d && d !== 'no_diagnosis')
    .map(d => DIAGNOSIS_MAP[d] || d);

  return mapped.join(', ');
}

/**
 * Format treatments for URL parameter (uses readable text)
 * @param {Array|string} treatments - q12_tried answer(s)
 * @returns {string} - Comma-separated treatment list
 */
function formatTreatmentsForUrl(treatments) {
  if (!treatments) return '';

  const treatArray = Array.isArray(treatments) ? treatments : [treatments];
  const mapped = treatArray
    .filter(t => t && t !== 'nothing')
    .map(t => TREATMENT_MAP[t] || t);

  return mapped.join(', ');
}

/**
 * Redirect to sales page with quiz data as URL parameters
 */
function redirectToSalesPage() {
  // Clear any existing timer
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }

  // Build URL with all the new parameter names as specified
  const offerUrl = new URL(SALES_PAGE_URL);

  // Source tracking for A/B testing
  offerUrl.searchParams.set('source', 'chat-rebecca');

  // Add all parameters (only non-empty values)
  if (state.userName) {
    offerUrl.searchParams.set('name', state.userName);
  }
  if (state.userEmail) {
    offerUrl.searchParams.set('email', state.userEmail);
  }
  if (state.protocol && state.protocol.name) {
    offerUrl.searchParams.set('protocol_name', state.protocol.name);
  }
  if (state.answers.q5_primary_complaint) {
    offerUrl.searchParams.set('primary_complaint', state.answers.q5_primary_complaint);
  }
  if (state.answers.q18_vision) {
    offerUrl.searchParams.set('q18_vision', state.answers.q18_vision);
  }

  // Diagnoses as comma-separated string
  const diagnoses = formatDiagnosesForUrl(state.answers.q11_diagnosis);
  if (diagnoses) {
    offerUrl.searchParams.set('diagnoses', diagnoses);
  }

  // Treatments tried as comma-separated string
  const treatments = formatTreatmentsForUrl(state.answers.q12_tried);
  if (treatments) {
    offerUrl.searchParams.set('treatments_tried', treatments);
  }

  // Redirect to sales page (use window.top for iframe embedding)
  window.top.location.href = offerUrl.toString();
}

/**
 * Start the auto-redirect timer (invisible to user)
 * @param {number} seconds - Seconds until redirect (default 20)
 */
function startRedirectTimer(seconds = 20) {
  // Clear any existing timer first
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }

  redirectTimer = setTimeout(() => {
    redirectToSalesPage();
  }, seconds * 1000);
}

// Application State
const state = {
  currentSection: 'intro',
  currentStepIndex: 0,
  answers: {},
  userName: '',
  userEmail: '',
  protocol: null,
  isProcessing: false,
  hasStarted: false
};

// DOM Elements
let chatPage, chatArea, inputContainer;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  chatPage = document.getElementById('chatPage');
  chatArea = document.getElementById('chatArea');
  inputContainer = document.getElementById('inputContainer');

  // Mobile disclaimer toggle (tap to expand/collapse)
  const disclaimerFooter = document.querySelector('.disclaimer-footer');
  if (disclaimerFooter) {
    disclaimerFooter.addEventListener('click', () => {
      disclaimerFooter.classList.toggle('expanded');
    });
  }

  // Start the quiz automatically
  startQuiz();
});

/**
 * Start the quiz
 */
function startQuiz() {
  state.hasStarted = true;
  processSection('intro');
}

/**
 * Reset the quiz to initial state
 */
function resetQuiz() {
  state.currentSection = 'intro';
  state.currentStepIndex = 0;
  state.answers = {};
  state.userName = '';
  state.userEmail = '';
  state.protocol = null;
  state.isProcessing = false;
  state.hasStarted = false;

  chatArea.innerHTML = '';
  inputContainer.innerHTML = '';

  // Restart the quiz
  startQuiz();
}

/**
 * Map internal section keys to GTM tracking names
 * @param {string} sectionKey - Internal section key
 * @returns {string} - GTM tracking name
 */
function getTrackingSectionName(sectionKey) {
  // Map section keys to tracking names
  const trackingMap = {
    // Intro
    'intro': 'intro',
    'more_info': 'intro_more_info',

    // Part 1: Safety Screening
    'part1_intro': 'part1_intro',
    'q1_weight_loss': 'part1_q1',
    'q2_blood': 'part1_q2',
    'q3_family_history': 'part1_q3',
    'q4_colonoscopy': 'part1_q4',
    'red_flag_warning': 'part1_red_flag_warning',

    // Part 2: Symptom Pattern
    'part2_intro': 'part2_intro',
    'q5_primary_complaint': 'part2_q1',
    'q5_validation': 'part2_q1_validation',
    'q6_frequency': 'part2_q2',
    'q7_bm_relief': 'part2_q3',
    'q8_frequency_change': 'part2_q4',
    'q9_stool_change': 'part2_q5',
    'email_capture_early': 'part2_email_capture',

    // Part 3: History
    'part3_intro': 'part3_intro',
    'q10_duration': 'part3_q1',
    'q10_validation_long': 'part3_q1_validation',
    'q11_diagnosis': 'part3_q2',
    'q12_tried': 'part3_q3',
    'q12_validation_persistent': 'part3_q3_validation',
    'testimonial_interlude': 'part3_testimonial',

    // Part 4: Gut-Brain Connection
    'part4_intro': 'part4_intro',
    'q13_stress': 'part4_q1',
    'q14_mental_health': 'part4_q2',
    'q15_sleep': 'part4_q3',

    // Part 5: Life Impact
    'part5_intro': 'part5_intro',
    'q16_life_impact': 'part5_q1',
    'q17_hardest_part': 'part5_q2',
    'q17_response': 'part5_q2_response',
    'q18_vision': 'part5_q3',
    'email_capture': 'part5_email_capture',
    'get_email': 'part5_get_email',
    'email_already_captured': 'part5_email_already',
    'name_capture': 'part5_name_capture',
    'final_message': 'part5_final',

    // Results & Completion
    'confirmation': 'results',
    'show_calculating_redirect': 'results_calculating',
    'results_chunk1': 'results',
    'results_chunk2': 'results',
    'results_chunk3': 'results',
    'redirect_to_sales': 'offer_redirect',

    // Exit flow
    'exit_message': 'exit_message',
    'exit_get_email': 'exit_email',
    'exit_final': 'exit_final'
  };

  return trackingMap[sectionKey] || sectionKey;
}

/**
 * Push quiz step event to GTM dataLayer
 * @param {string} sectionKey - Internal section key
 */
function trackQuizStep(sectionKey) {
  const trackingName = getTrackingSectionName(sectionKey);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'quiz_step',
    'quiz_section': trackingName,
    'quiz_source': 'chat-rebecca'
  });

  console.log('GTM dataLayer push:', { event: 'quiz_step', quiz_section: trackingName });
}

/**
 * Update URL with current section for tracking
 * @param {string} sectionKey - Current section key
 */
function updateUrlWithSection(sectionKey) {
  // Skip updating for internal/conditional sections
  const skipSections = ['check_', 'show_', 'redirect_', 'exit_', 'email_already'];
  if (skipSections.some(skip => sectionKey.startsWith(skip))) return;

  try {
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionKey);
    history.replaceState({ section: sectionKey }, '', url.toString());
  } catch (e) {
    console.warn('Could not update URL:', e);
  }

  // Track quiz step in GTM dataLayer
  trackQuizStep(sectionKey);
}

/**
 * Process a section of the quiz content
 * @param {string} sectionKey - Key of the section in quizContent
 */
async function processSection(sectionKey) {
  if (state.isProcessing) return;
  state.isProcessing = true;
  state.currentSection = sectionKey;
  state.currentStepIndex = 0;

  // Update URL for tracking (helps identify drop-off points)
  updateUrlWithSection(sectionKey);

  const section = quizContent[sectionKey];
  if (!section) {
    console.error('Section not found:', sectionKey);
    state.isProcessing = false;
    return;
  }

  // Process each step in the section
  for (let i = 0; i < section.length; i++) {
    state.currentStepIndex = i;
    const step = section[i];
    // Check if this is the last message step before a user input step or end of section
    const nextStep = section[i + 1];
    const isLastStep = !nextStep;
    const isBeforeUserInput = nextStep && (nextStep.type === 'question' || nextStep.type === 'buttons');
    const skipReadingDelay = step.type === 'message' && (isLastStep || isBeforeUserInput);
    await processStep(step, skipReadingDelay);
  }

  state.isProcessing = false;
}

/**
 * Process a single step (message, question, or buttons)
 * @param {Object} step - Step object from quizContent
 * @param {boolean} isLastInSection - Whether this is the last step in the section
 */
async function processStep(step, isLastInSection = false) {
  const delay = step.delay || CONFIG.DEFAULT_DELAY;

  switch (step.type) {
    case 'message':
      await showTypingIndicator(delay);
      const messageContent = replaceVariables(step.content);
      addMessage(messageContent, 'rebecca', step.isWarning);

      // Add reading delay for consecutive messages (not for last message before user input)
      if (!isLastInSection) {
        const readingDelay = calculateReadingDelay(messageContent);
        await new Promise(resolve => setTimeout(resolve, readingDelay));
      }
      break;

    case 'question':
      // Only show typing indicator and message if there's content
      if (step.content) {
        await showTypingIndicator(delay);
        addMessage(replaceVariables(step.content), 'rebecca');
      }

      // Wait for user response
      await waitForResponse(step);
      break;

    case 'buttons':
      renderButtons(step.options);
      // Wait for button click
      await waitForButtonClick(step.options);
      break;
  }
}

/**
 * Show typing indicator for specified duration
 * @param {number} duration - Duration in milliseconds
 */
function showTypingIndicator(duration) {
  return new Promise(resolve => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message rebecca typing-message';
    typingDiv.innerHTML = `
      ${getAvatarHTML()}
      <div class="message-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatArea.appendChild(typingDiv);
    scrollToBottom();

    setTimeout(() => {
      typingDiv.remove();
      resolve();
    }, duration);
  });
}

/**
 * Add a message to the chat
 * @param {string} content - Message content
 * @param {string} sender - 'rebecca' or 'user'
 * @param {boolean} isWarning - Whether to style as warning
 */
function addMessage(content, sender, isWarning = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  if (sender === 'rebecca') {
    const bubbleClass = isWarning ? 'message-bubble warning-bubble' : 'message-bubble';
    const warningIcon = isWarning ? '<span class="warning-icon">⚠️</span>' : '';
    messageDiv.innerHTML = `
      ${getAvatarHTML()}
      <div class="${bubbleClass}">${warningIcon}${content}</div>
    `;
  } else {
    messageDiv.innerHTML = `<div class="message-bubble">${content}</div>`;
  }

  chatArea.appendChild(messageDiv);
  scrollToBottom();
}

/**
 * Render option buttons with click handlers
 * @param {Array} options - Array of option objects
 * @param {Function} onClickCallback - Callback when button is clicked
 */
function renderButtons(options, onClickCallback) {
  // Always get fresh reference to inputContainer
  const container = document.createElement('div');
  container.className = 'options-container';

  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option.text;
    button.dataset.value = option.value;
    button.dataset.next = option.next || '';

    // Add direct click handler to each button
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked:', option.text, option.value);
      if (onClickCallback) {
        onClickCallback(option.value, option.next || '', option.text, option);
      }
    });

    container.appendChild(button);
  });

  // Get fresh reference and clear
  const inputEl = document.getElementById('inputContainer');
  inputEl.innerHTML = '';
  inputEl.appendChild(container);
  scrollToBottom();

  // Check for scroll overflow and add gradient indicator
  requestAnimationFrame(() => {
    checkOptionsScroll(container);
    // Listen for scroll to update the gradient overlay
    container.addEventListener('scroll', () => checkOptionsScroll(container), { passive: true });
  });
}

/**
 * Check if options container has scroll and update gradient overlay
 * @param {HTMLElement} container - Options container element
 */
function checkOptionsScroll(container) {
  if (!container) return;
  const hasMoreBelow = container.scrollHeight > container.clientHeight &&
    (container.scrollTop + container.clientHeight) < (container.scrollHeight - 10);
  container.classList.toggle('has-more-below', hasMoreBelow);
}

/**
 * Render multi-select checkboxes
 * @param {Array} options - Array of option objects
 */
function renderMultiSelect(options) {
  const container = document.createElement('div');
  container.className = 'options-container multi-select';

  options.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'checkbox-option';
    optionDiv.innerHTML = `
      <input type="checkbox" value="${option.value}">
      <span>${option.text}</span>
    `;

    const checkbox = optionDiv.querySelector('input');

    // Handle clicks on the entire card (not using label to avoid double-toggle)
    optionDiv.addEventListener('click', (e) => {
      // Toggle checkbox
      checkbox.checked = !checkbox.checked;
      optionDiv.classList.toggle('checked', checkbox.checked);
    });

    // Prevent checkbox click from bubbling (would cause double toggle)
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      optionDiv.classList.toggle('checked', checkbox.checked);
    });

    container.appendChild(optionDiv);
  });

  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.textContent = 'Continue';
  container.appendChild(continueBtn);

  inputContainer.innerHTML = '';
  inputContainer.appendChild(container);
  scrollToBottom();

  // Check for scroll overflow and add gradient indicator
  requestAnimationFrame(() => {
    checkOptionsScroll(container);
    // Listen for scroll to update the gradient overlay
    container.addEventListener('scroll', () => checkOptionsScroll(container), { passive: true });
  });

  return continueBtn;
}

/**
 * Render text input
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type ('text', 'email', 'name')
 */
function renderTextInput(placeholder, type = 'text') {
  const container = document.createElement('div');
  container.className = 'input-container';

  const inputType = type === 'email' ? 'email' : 'text';
  const isTextArea = type === 'text';

  if (isTextArea) {
    container.innerHTML = `
      <textarea placeholder="${placeholder}" rows="3"></textarea>
      <button class="send-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
        </svg>
      </button>
    `;
  } else {
    container.innerHTML = `
      <input type="${inputType}" placeholder="${placeholder}">
      <button class="send-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
        </svg>
      </button>
    `;
  }

  inputContainer.innerHTML = '';
  inputContainer.appendChild(container);

  const input = container.querySelector('textarea, input');
  input.focus();
  scrollToBottom();

  return { container, input, button: container.querySelector('.send-button') };
}

/**
 * Wait for button click and process the response
 * @param {Array} options - Array of option objects
 */
function waitForButtonClick(options) {
  return new Promise(resolve => {
    let clicked = false;

    const handleButtonClick = async (value, next, text, option) => {
      // Prevent double-clicks
      if (clicked) return;
      clicked = true;

      console.log('waitForButtonClick handler:', value, next);

      // Add user message
      addMessage(text, 'user');

      // Clear input
      document.getElementById('inputContainer').innerHTML = '';

      // Process the selection after a short delay
      setTimeout(async () => {
        await handleButtonSelection(value, next, options);
        resolve();
      }, 300);
    };

    // Render buttons with the click callback
    renderButtons(options, handleButtonClick);
  });
}

/**
 * Handle button selection
 * @param {string} value - Selected value
 * @param {string} next - Next section key
 * @param {Array} options - Original options array
 */
async function handleButtonSelection(value, next, options) {
  const selectedOption = options.find(o => o.value === value);

  // Store red flag status if applicable
  if (selectedOption && selectedOption.redFlag !== undefined) {
    const questionId = state.currentSection;
    state.answers[questionId] = value;
    if (selectedOption.redFlag) {
      state.answers.had_red_flags = true;
    }
  }

  // Track if user was already evaluated and cleared (red flag continuation)
  if (selectedOption && selectedOption.setsEvaluatedCleared) {
    state.answers.red_flag_evaluated_cleared = true;
  }

  // Handle special navigation
  if (next) {
    // Reset processing flag to allow next section to run
    state.isProcessing = false;
    await processSection(next);
  }
}

/**
 * Wait for user response to a question
 * @param {Object} step - Question step object
 */
function waitForResponse(step) {
  return new Promise(async (resolve) => {
    if (step.inputType === 'single') {
      // Single select buttons
      let clicked = false;

      const handleButtonClick = async (value, next, text, option) => {
        // Prevent double-clicks
        if (clicked) return;
        clicked = true;

        console.log('waitForResponse single handler:', value, step.next);

        addMessage(text, 'user');
        document.getElementById('inputContainer').innerHTML = '';

        // Store answer
        state.answers[step.id] = value;

        // Check for red flag
        if (option && option.redFlag) {
          state.answers.had_red_flags = true;
        }

        // Handle special navigation
        if (step.next === 'check_red_flags') {
          await handleRedFlagCheck();
        } else if (step.next === 'check_duration') {
          await handleDurationCheck();
        } else if (step.next === 'check_treatments_tried') {
          await handleTreatmentsCheck();
        } else if (step.next === 'check_email_captured') {
          await handleEmailCapturedCheck();
        } else if (step.next) {
          setTimeout(() => {
            processSection(step.next);
          }, 300);
        }

        resolve();
      };

      // Render buttons with callback
      renderButtons(step.options, handleButtonClick);

    } else if (step.inputType === 'multi') {
      // Multi-select checkboxes
      const continueBtn = renderMultiSelect(step.options);

      continueBtn.addEventListener('click', () => {
        const selected = [];
        inputContainer.querySelectorAll('input:checked').forEach(cb => {
          selected.push(cb.value);
        });

        if (selected.length === 0) {
          return; // Require at least one selection
        }

        // Find text labels for selected options
        const selectedTexts = step.options
          .filter(o => selected.includes(o.value))
          .map(o => o.text);

        addMessage(selectedTexts.join(', '), 'user');
        inputContainer.innerHTML = '';

        // Store answer
        state.answers[step.id] = selected;

        // Handle special navigation for multi-select
        if (step.next === 'check_treatments_tried') {
          handleTreatmentsCheck();
        } else if (step.next) {
          setTimeout(() => {
            processSection(step.next);
          }, 300);
        }

        resolve();
      });

    } else if (step.inputType === 'text' || step.inputType === 'name' || step.inputType === 'email') {
      // Text/email input
      const { input, button } = renderTextInput(step.placeholder, step.inputType);

      const handleSubmit = async () => {
        const value = input.value.trim();

        if (!value) return;

        // Validate email if needed
        if (step.inputType === 'email' && !isValidEmail(value)) {
          alert('Please enter a valid email address.');
          return;
        }

        addMessage(value, 'user');
        inputContainer.innerHTML = '';

        // Store answer
        state.answers[step.id] = value;

        // Store name/email in state
        if (step.id === 'name' || step.id === 'exit_name') {
          state.userName = value;
        } else if (step.id === 'email' || step.id === 'exit_email' || step.id === 'email_early') {
          state.userEmail = value;
        }

        // Handle special flow for email capture completion
        if (step.next === 'final_message') {
          // Determine protocol before final message
          state.protocol = determineProtocol(state.answers);
          state.protocol = addStressComponent(state.answers, state.protocol);
        }

        // Handle special navigation for text inputs
        if (step.next === 'check_email_captured') {
          await handleEmailCapturedCheck();
        } else if (step.next) {
          setTimeout(() => {
            processSection(step.next);
          }, 300);
        }

        resolve();
      };

      button.addEventListener('click', handleSubmit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
    }
  });
}

/**
 * Handle red flag check after safety screening
 */
async function handleRedFlagCheck() {
  // Reset processing flag to allow next section to run
  state.isProcessing = false;
  if (state.answers.had_red_flags) {
    await processSection('red_flag_warning');
  } else {
    await processSection('part2_intro');
  }
}

/**
 * Handle duration check - show validation for 3+ years
 */
async function handleDurationCheck() {
  state.isProcessing = false;
  const duration = state.answers.q10_duration;
  const longDurations = ['1-3_years', '3-5_years', '5+_years'];

  if (longDurations.includes(duration)) {
    await processSection('q10_validation_long');
  } else {
    await processSection('q11_diagnosis');
  }
}

/**
 * Handle treatments tried check - show validation for 3+ items
 */
async function handleTreatmentsCheck() {
  state.isProcessing = false;
  const treatments = state.answers.q12_tried;
  const treatmentCount = Array.isArray(treatments) ? treatments.filter(t => t !== 'nothing').length : 0;

  if (treatmentCount >= 3) {
    // Show validation message then continue to testimonial
    await processSection('q12_validation_persistent');
  }
  // Show testimonial interlude before part 4
  state.isProcessing = false;
  await processSection('testimonial_interlude');
}

/**
 * Handle email capture check - skip email if already captured
 */
async function handleEmailCapturedCheck() {
  state.isProcessing = false;

  // Check if email was already captured early
  if (state.userEmail) {
    // Email already captured, show confirmation and continue to final_message
    await processSection('email_already_captured');
    // Determine protocol before final message
    state.protocol = determineProtocol(state.answers);
    state.protocol = addStressComponent(state.answers, state.protocol);
    state.isProcessing = false;
    await processSection('final_message');
  } else {
    // No email yet, ask for it
    await processSection('get_email');
  }
}

/**
 * Convert basic markdown to HTML (bold and italic)
 * @param {string} text - Text with markdown syntax
 * @returns {string} - Text with HTML tags
 */
function convertMarkdown(text) {
  if (!text) return '';
  return text
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* -> <em>text</em> (but not inside bold)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/**
 * Generate dynamic social proof message based on primary complaint
 * @returns {string} - Personalized social proof message
 */
function getSocialProofMessage() {
  const complaint = state.answers.q5_primary_complaint;

  // Complaint-specific empathy messages (no false claims about numbers)
  const empathyMessages = {
    bloating: "bloating and distension is one of the most common patterns we see at Gut Healing Academy",
    constipation: "constipation is one of the most frustrating patterns we work with at Gut Healing Academy",
    diarrhea: "urgency and unpredictable digestion is something our practitioners specialize in",
    mixed: "alternating patterns like yours are actually very common — and often misunderstood",
    pain: "pain-dominant patterns like yours need a careful, personalized approach",
    gas: "gas and discomfort patterns like yours are more common than you'd think",
    reflux: "reflux patterns often have root causes that get overlooked"
  };

  const message = empathyMessages[complaint] || "patterns like yours are something our practitioners work with regularly";

  return `That's really helpful to know. Actually, ${message}.\n\nYou're definitely not alone in this.`;
}

/**
 * Replace template variables in text
 * @param {string} text - Text with {{variable}} placeholders
 * @returns {string} - Text with variables replaced
 */
function replaceVariables(text) {
  if (!text) return '';
  let result = text
    .replace(/\{\{name\}\}/g, state.userName || '')
    .replace(/\{\{email\}\}/g, state.userEmail || '')
    .replace(/\{\{protocol_name\}\}/g, state.protocol ? state.protocol.name : '')
    .replace(/\{\{chunk2_message\}\}/g, getResultsChunk2Message())
    .replace(/\{\{q18_vision\}\}/g, state.answers.q18_vision || '')
    .replace(/\{\{social_proof_message\}\}/g, getSocialProofMessage());

  // Convert markdown to HTML
  return convertMarkdown(result);
}

/**
 * Scroll chat area to bottom with smooth scrolling
 */
function scrollToBottom() {
  // Use requestAnimationFrame to ensure DOM has updated before scrolling
  requestAnimationFrame(() => {
    chatArea.scroll({
      top: chatArea.scrollHeight,
      behavior: 'smooth'
    });
  });
}

/**
 * Submit the quiz data to Make.com webhook
 */
async function submitToWebhook() {
  const submission = formatSubmissionData(
    state.answers,
    state.protocol,
    state.userName,
    state.userEmail
  );

  // Save to localStorage as backup
  saveToLocalStorage(submission);

  // Build payload with all fields separately
  const payload = {
    // Contact info
    name: state.userName,
    email: state.userEmail,

    // Protocol info
    protocol_number: state.protocol.protocol,
    protocol_name: state.protocol.name,
    protocol_description: state.protocol.description,

    // Open-ended responses (Q17 & Q18) - easy access
    q17_hardest_part: state.answers.q17_hardest_part || '',
    q18_vision: state.answers.q18_vision || '',

    // All question answers separately (field names must match quiz-content.js)
    q1_weight_loss: state.answers.q1_weight_loss || '',
    q2_blood: state.answers.q2_blood || '',
    q3_family_history: state.answers.q3_family_history || '',
    q4_colonoscopy: state.answers.q4_colonoscopy || '',
    q5_primary_complaint: state.answers.q5_primary_complaint || '',
    q6_frequency: state.answers.q6_frequency || '',
    q7_bm_relief: state.answers.q7_bm_relief || '',
    q8_frequency_change: state.answers.q8_frequency_change || '',
    q9_stool_change: state.answers.q9_stool_change || '',
    q10_duration: state.answers.q10_duration || '',
    q11_diagnosis: Array.isArray(state.answers.q11_diagnosis)
      ? state.answers.q11_diagnosis.join(', ')
      : (state.answers.q11_diagnosis || ''),
    q12_tried: Array.isArray(state.answers.q12_tried)
      ? state.answers.q12_tried.join(', ')
      : (state.answers.q12_tried || ''),
    q13_stress: state.answers.q13_stress || '',
    q14_mental_health: state.answers.q14_mental_health || '',
    q15_sleep: state.answers.q15_sleep || '',
    q16_life_impact: state.answers.q16_life_impact || '',

    // Red flag status
    had_red_flags: state.answers.had_red_flags || false,
    red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,

    // Timestamp
    submitted_at: new Date().toISOString()
  };

  // Submit to both Make.com webhook AND Supabase in parallel
  // Both are wrapped in try/catch so if one fails, the other still works
  await Promise.all([
    // Make.com webhook submission
    (async () => {
      try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error('Webhook submission failed:', response.statusText);
        } else {
          console.log('Make.com submission successful');
        }
      } catch (error) {
        console.error('Error submitting to webhook:', error);
      }
    })(),

    // Supabase submission (will gracefully skip if not configured)
    submitToSupabase({ isRedFlagExit: false })
  ]);

  return submission;
}

// Override the confirmation section to trigger form submission
const originalProcessSection = processSection;
processSection = async function(sectionKey) {
  // Update progress indicator
  updateProgress(sectionKey);

  if (sectionKey === 'show_calculating_redirect') {
    // New flow: submit data, show calculating screen, then redirect to offer page
    await submitToWebhook();
    await showCalculatingScreen();
    redirectToSalesPage();
    return; // Don't process any section content
  } else if (sectionKey === 'results_chunk1') {
    // Legacy: Show calculating screen first (8 seconds)
    await showCalculatingScreen();
    // Submit data before showing results (when "Get My Protocol" is clicked)
    await submitToWebhook();
  } else if (sectionKey === 'redirect_to_sales') {
    // Direct redirect - don't process as a section
    redirectToSalesPage();
    return;
  } else if (sectionKey === 'confirmation') {
    // Legacy fallback - submit data before showing confirmation
    await submitToWebhook();
  } else if (sectionKey === 'exit_final') {
    // Submit red flag exit data
    await submitRedFlagExit();
  }

  // Process the section content
  await originalProcessSection.call(this, sectionKey);

  // Start the 20-second auto-redirect timer AFTER chunk 3 is fully displayed
  if (sectionKey === 'results_chunk3') {
    startRedirectTimer(20);
  }
};

/**
 * Submit red flag exit data to Make.com webhook
 */
async function submitRedFlagExit() {
  // Build payload with all fields separately
  const payload = {
    // Contact info
    name: state.userName,
    email: state.userEmail,

    // Exit type
    submission_type: 'red_flag_exit',
    red_flag_exit: true,
    had_red_flags: true,

    // Protocol info (not determined for red flag exits)
    protocol_number: 0,
    protocol_name: 'Red Flag Exit',
    protocol_description: 'User exited after red flag warning - requested supportive tips',

    // Open-ended responses (Q17 & Q18) - may not be filled
    q17_hardest_part: state.answers.q17_hardest_part || '',
    q18_vision: state.answers.q18_vision || '',

    // All question answers separately (partial for red flag exits, field names must match quiz-content.js)
    q1_weight_loss: state.answers.q1_weight_loss || '',
    q2_blood: state.answers.q2_blood || '',
    q3_family_history: state.answers.q3_family_history || '',
    q4_colonoscopy: state.answers.q4_colonoscopy || '',
    q5_primary_complaint: state.answers.q5_primary_complaint || '',
    q6_frequency: state.answers.q6_frequency || '',
    q7_bm_relief: state.answers.q7_bm_relief || '',
    q8_frequency_change: state.answers.q8_frequency_change || '',
    q9_stool_change: state.answers.q9_stool_change || '',
    q10_duration: state.answers.q10_duration || '',
    q11_diagnosis: Array.isArray(state.answers.q11_diagnosis)
      ? state.answers.q11_diagnosis.join(', ')
      : (state.answers.q11_diagnosis || ''),
    q12_tried: Array.isArray(state.answers.q12_tried)
      ? state.answers.q12_tried.join(', ')
      : (state.answers.q12_tried || ''),
    q13_stress: state.answers.q13_stress || '',
    q14_mental_health: state.answers.q14_mental_health || '',
    q15_sleep: state.answers.q15_sleep || '',
    q16_life_impact: state.answers.q16_life_impact || '',

    // Timestamp
    submitted_at: new Date().toISOString()
  };

  // Save to localStorage as backup
  try {
    const existingData = localStorage.getItem('gutQuizRedFlagExits') || '[]';
    const submissions = JSON.parse(existingData);
    submissions.push(payload);
    localStorage.setItem('gutQuizRedFlagExits', JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  // Submit to both Make.com webhook AND Supabase in parallel
  // Both are wrapped in try/catch so if one fails, the other still works
  await Promise.all([
    // Make.com webhook submission
    (async () => {
      try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error('Webhook submission failed:', response.statusText);
        } else {
          console.log('Make.com red flag exit submission successful');
        }
      } catch (error) {
        console.error('Error submitting to webhook:', error);
      }
    })(),

    // Supabase submission (with red flag exit flag)
    submitToSupabase({ isRedFlagExit: true })
  ]);
}
