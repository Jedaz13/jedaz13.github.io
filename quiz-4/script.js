/* =====================================================
   Quiz v4 Script - Gut Healing Academy
   28 Screens - Updated Structure
   ===================================================== */

// =================================================
// CONFIGURATION
// =================================================
const CONFIG = {
  OFFER_URL: '/offer-protocol/',
  SOURCE_TRACKING: 'quiz-4',
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E',
  AUTO_ADVANCE_DELAY: 400,
  TOTAL_SCREENS: 28,
  TOTAL_PHASES: 7
};

// =================================================
// APPLICATION STATE
// =================================================
const state = {
  // Navigation
  currentScreenIndex: 0,
  currentPhaseIndex: 0,
  history: [],

  // User data
  answers: {},
  userData: {
    name: '',
    email: ''
  },

  // Calculated values
  calculatedProtocol: null,
  hasGutBrainOverlay: false,
  gutBrainScore: 0,
  knowledgeScore: 0,
  treatmentsTried: [],
  treatmentsCount: 0,

  // Red flags
  hasRedFlags: false,
  redFlags: [],

  // Tracking
  quizStartTime: null,
  screenStartTime: null,
  screensViewed: [],
  totalScreensViewed: 0,
  emailCaptured: false,
  quizCompleted: false,

  // Loading screen state
  loadingPopupIndex: 0,
  loadingPaused: false,

  // Knowledge quiz state
  lastKnowledgeAnswer: null,
  lastKnowledgeCorrect: null,

  // Session tracking (for Supabase events)
  sessionId: null
};

// =================================================
// SESSION ID GENERATOR
// =================================================
function generateSessionId() {
  return 'q4_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
}

// Initialize Supabase client
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log('Supabase not available');
}

// Screen order mapping (28 screens)
const screenOrder = [
  // Phase 1: Emotional Hook (Screens 1-5)
  { phase: 0, screenKey: 'future_vision' },
  { phase: 0, screenKey: 'timeline' },
  { phase: 0, screenKey: 'primary_complaint' },
  { phase: 0, screenKey: 'duration' },
  { phase: 0, screenKey: 'validation_duration' },
  // Phase 2: Clinical Assessment (Screens 6-12)
  { phase: 1, screenKey: 'bm_relief' },
  { phase: 1, screenKey: 'flare_frequency' },
  { phase: 1, screenKey: 'stool_changes' },
  { phase: 1, screenKey: 'progress_validation' },
  { phase: 1, screenKey: 'treatments_tried' },
  { phase: 1, screenKey: 'diagnosis_history' },
  { phase: 1, screenKey: 'name_capture' },
  // Phase 3: The Bridge (Screens 13-14)
  { phase: 2, screenKey: 'why_different' },
  { phase: 2, screenKey: 'testimonial' },
  // Phase 4: Knowledge Quiz (Screens 15-19)
  { phase: 3, screenKey: 'knowledge_intro' },
  { phase: 3, screenKey: 'knowledge_eating_speed' },
  { phase: 3, screenKey: 'knowledge_eating_response' },
  { phase: 3, screenKey: 'knowledge_fodmap' },
  { phase: 3, screenKey: 'knowledge_fodmap_response' },
  // Phase 5: Gut-Brain (Screens 20-21)
  { phase: 4, screenKey: 'stress_connection' },
  { phase: 4, screenKey: 'stress_validation' },
  // Phase 6: Safety (Screens 22-23, 23b conditional)
  { phase: 5, screenKey: 'safety_blood' },
  { phase: 5, screenKey: 'safety_weight' },
  // Phase 7: Email Capture (Screens 24-26)
  { phase: 6, screenKey: 'life_impact' },
  { phase: 6, screenKey: 'email_capture' },
  { phase: 6, screenKey: 'vision_optional' },
  // Loading & Results (Screens 27-28)
  { phase: 6, screenKey: 'loading_sequence', type: 'loading' },
  { phase: 6, screenKey: 'results_page', type: 'results' }
];

// Phase mapping (phases array from content)
const phases = [
  quizContent.phase1,
  quizContent.phase2,
  quizContent.phase3,
  quizContent.phase4,
  quizContent.phase5,
  quizContent.phase6,
  quizContent.phase7
];

// Section labels for each phase (7 phases now)
const SECTION_LABELS = [
  'YOUR GOALS',
  'YOUR SYMPTOMS',
  'WHY THIS WORKS',
  'QUICK GUT CHECK',
  'YOUR PROFILE',
  'FINAL QUESTIONS',
  'YOUR RESULTS'
];

// Questions per section for progress calculation (7 phases)
const QUESTIONS_PER_PHASE = [5, 7, 2, 5, 2, 2, 5];

// DOM Elements
let contentEl;
let sectionLabelEl;
let backButtonEl;

// =================================================
// INITIALIZATION
// =================================================
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
});

function initQuiz() {
  // Cache DOM elements
  contentEl = document.getElementById('contentArea');
  sectionLabelEl = document.getElementById('sectionLabel');
  backButtonEl = document.getElementById('backButton');

  state.quizStartTime = new Date();
  state.screenStartTime = new Date();

  // Generate unique session ID for tracking
  state.sessionId = generateSessionId();

  // Track quiz start (GTM, step tracking, and Supabase)
  trackEvent('quiz_start', {
    quiz_version: 'v4',
    timestamp: state.quizStartTime.toISOString()
  });
  trackQuizStep('quiz_start');
  trackQuizEvent('quiz_start');

  // Track page view
  trackPixelEvent('PageView');

  // Set up back button
  backButtonEl.addEventListener('click', handleBack);

  // Set up page unload tracking
  window.addEventListener('beforeunload', handlePageUnload);

  // Render first screen
  renderCurrentScreen();
  updateProgressBar();
}

// =================================================
// SCREEN RENDERING
// =================================================
function renderCurrentScreen() {
  const screenInfo = screenOrder[state.currentScreenIndex];

  state.screenStartTime = new Date();
  state.totalScreensViewed++;
  state.screensViewed.push(screenInfo.screenKey);

  // Update phase index
  state.currentPhaseIndex = screenInfo.phase;

  // Track quiz step for GTM
  trackQuizStep(getTrackingSectionName());

  // Update section label
  updateSectionLabel();

  // Update back button
  updateBackButton();

  // Special screen types
  if (screenInfo.type === 'loading') {
    renderLoadingScreen(contentEl);
    return;
  }

  if (screenInfo.type === 'results') {
    renderResultsScreen(contentEl);
    return;
  }

  // Get screen content from phases
  const screen = getScreenContent(screenInfo.screenKey);
  if (!screen) {
    console.error('Screen not found:', screenInfo.screenKey);
    return;
  }

  // Track screen view
  trackScreenView(screen);

  // Render based on screen type
  switch (screen.type) {
    case 'single_select':
      renderSingleSelect(contentEl, screen);
      break;
    case 'multi_select':
      renderMultiSelect(contentEl, screen);
      break;
    case 'info':
      renderInfoScreen(contentEl, screen);
      break;
    case 'info_dynamic':
      renderInfoDynamic(contentEl, screen);
      break;
    case 'info_animated':
      renderInfoAnimated(contentEl, screen);
      break;
    case 'info_conditional':
      renderInfoConditional(contentEl, screen);
      break;
    case 'testimonial':
      renderTestimonial(contentEl, screen);
      break;
    case 'knowledge_quiz':
      renderKnowledgeQuiz(contentEl, screen);
      break;
    case 'knowledge_response':
      renderKnowledgeResponse(contentEl, screen);
      break;
    case 'email_input':
      renderEmailInput(contentEl, screen);
      break;
    case 'text_input_with_validation':
      renderTextInputWithValidation(contentEl, screen);
      break;
    case 'text_input_optional':
      renderTextInputOptional(contentEl, screen);
      break;
    case 'warning':
      renderWarningScreen(contentEl, screen);
      break;
    default:
      console.error('Unknown screen type:', screen.type);
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function updateSectionLabel() {
  if (sectionLabelEl) {
    sectionLabelEl.textContent = SECTION_LABELS[state.currentPhaseIndex] || 'QUIZ';
  }
}

function updateBackButton() {
  if (backButtonEl) {
    backButtonEl.disabled = state.currentScreenIndex === 0;
  }
}

function getScreenContent(screenKey) {
  // Check special screens first
  if (screenKey === 'safety_warning') {
    return quizContent.safetyWarning;
  }

  // Search through all phases
  for (const phase of phases) {
    if (phase && phase.screens) {
      const screen = phase.screens.find(s => s.id === screenKey);
      if (screen) return screen;
    }
  }
  return null;
}

// =================================================
// SINGLE SELECT RENDERER
// =================================================
function renderSingleSelect(container, screen) {
  const name = state.userData.name || 'Friend';
  const question = screen.questionTemplate
    ? screen.questionTemplate.replace('{firstName}', name)
    : screen.question;

  const hasIcons = screen.options.some(opt => opt.icon);

  let html = `
    <div class="question-container">
      <h2 class="question-text">${question}</h2>
      ${screen.subtitle ? `<p class="question-subtitle">${screen.subtitle}</p>` : ''}
      <div class="options-container ${hasIcons ? 'with-icons' : ''}">
  `;

  screen.options.forEach((option, index) => {
    if (hasIcons && option.icon) {
      html += `
        <button class="option-button" data-value="${option.value}" data-index="${index}">
          <span class="option-icon">${option.icon}</span>
          <span class="option-text">${option.text}</span>
        </button>
      `;
    } else {
      html += `
        <button class="option-button" data-value="${option.value}" data-index="${index}">
          ${option.text}
        </button>
      `;
    }
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', () => {
      handleSingleSelectAnswer(screen, button.dataset.value, screen.options[button.dataset.index]);
    });
  });
}

function handleSingleSelectAnswer(screen, value, option) {
  // Store answer
  state.answers[screen.storeAs] = value;

  // Track answer
  trackAnswer(screen, value, option.text);

  // Check for red flags
  if (option.redFlag) {
    state.hasRedFlags = true;
    state.redFlags.push({
      field: screen.storeAs,
      value: value
    });
    trackEvent('quiz_red_flag', {
      quiz_version: 'v4',
      red_flag_type: screen.storeAs,
      screen_number: screen.screenNumber
    });
  }

  // Handle gut-brain score
  if (option.gutBrainScore !== undefined) {
    state.gutBrainScore = option.gutBrainScore;
    // Determine if gut-brain overlay should be added
    if (value === 'yes_definitely' || value === 'sometimes') {
      state.hasGutBrainOverlay = true;
    }
  }

  // Visual feedback
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`[data-value="${value}"]`).classList.add('selected');

  // Auto-advance after delay
  setTimeout(() => advanceToNextScreen(), CONFIG.AUTO_ADVANCE_DELAY);
}

// =================================================
// MULTI SELECT RENDERER
// =================================================
function renderMultiSelect(container, screen) {
  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      ${screen.subtitle ? `<p class="question-subtitle">${screen.subtitle}</p>` : ''}
      <div class="options-container">
  `;

  screen.options.forEach((option, index) => {
    html += `
      <button class="option-button multi-select" data-value="${option.value}" data-index="${index}" ${option.exclusive ? 'data-exclusive="true"' : ''}>
        ${option.text}
      </button>
    `;
  });

  html += `
      </div>
      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  const selectedValues = [];

  // Add click handlers
  container.querySelectorAll('.option-button.multi-select').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      const isExclusive = option.dataset.exclusive === 'true';

      if (isExclusive) {
        // Deselect all others
        selectedValues.length = 0;
        container.querySelectorAll('.option-button.multi-select').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedValues.push(value);
      } else {
        // Remove exclusive options if selecting something else
        const exclusiveIndex = selectedValues.findIndex(v => {
          const opt = screen.options.find(o => o.value === v);
          return opt && opt.exclusive;
        });
        if (exclusiveIndex > -1) {
          const exclusiveValue = selectedValues[exclusiveIndex];
          selectedValues.splice(exclusiveIndex, 1);
          container.querySelector(`[data-value="${exclusiveValue}"]`)?.classList.remove('selected');
        }

        // Toggle selection
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
          const index = selectedValues.indexOf(value);
          if (index > -1) selectedValues.splice(index, 1);
        } else {
          option.classList.add('selected');
          selectedValues.push(value);
        }
      }
    });
  });

  // Continue button
  document.getElementById('continueBtn').addEventListener('click', () => {
    state.answers[screen.storeAs] = selectedValues;

    // Store treatments count
    if (screen.countTreatments) {
      state.treatmentsTried = selectedValues;
      state.treatmentsCount = selectedValues.filter(t => t !== 'nothing').length;
    }

    // Track answer
    trackAnswer(screen, selectedValues, selectedValues.join(', '));

    advanceToNextScreen();
  });
}

// =================================================
// INFO SCREEN RENDERER
// =================================================
function renderInfoScreen(container, screen) {
  let html = `
    <div class="question-container info-screen" ${screen.backgroundColor ? `style="background-color: ${screen.backgroundColor}"` : ''}>
  `;

  if (screen.icon) {
    html += `<div class="info-icon">${screen.icon}</div>`;
  }

  html += `<h2 class="question-text">${screen.headline}</h2>`;

  if (screen.body) {
    html += `<p class="info-body">${screen.body.replace(/\n/g, '<br>')}</p>`;
  }

  if (screen.statHighlight) {
    html += `
      <div class="stat-highlight">
        <span class="stat-number">${screen.statHighlight}</span>
      </div>
    `;
  }

  html += `
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// INFO DYNAMIC RENDERER (based on previous answer)
// =================================================
function renderInfoDynamic(container, screen) {
  const answerValue = state.answers[screen.basedOn];
  const content = screen.dynamicContent[answerValue] || screen.dynamicContent.default;

  let html = `
    <div class="question-container info-screen">
      ${content.icon ? `<div class="info-icon">${content.icon}</div>` : ''}
      <h2 class="question-text">${content.headline}</h2>
      <p class="info-body">${content.body.replace(/\n/g, '<br>')}</p>
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// INFO ANIMATED RENDERER (with cycle comparison)
// =================================================
function renderInfoAnimated(container, screen) {
  let html = `
    <div class="question-container info-screen info-animated">
      <h2 class="question-text">${screen.headline}</h2>

      <div class="cycle-comparison-container">
        <!-- The Stuck Loop -->
        <div class="cycle-card cycle-stuck animate-phase" style="animation-delay: 0.1s">
          <div class="cycle-header stuck">
            <span class="cycle-icon">🔄</span>
            <span class="cycle-title">The Stuck Loop</span>
          </div>
          <div class="cycle-flow stuck">
            <div class="cycle-step">Generic advice</div>
            <div class="cycle-arrow">→</div>
            <div class="cycle-step">Temporary relief</div>
            <div class="cycle-arrow">→</div>
            <div class="cycle-step">Symptoms return</div>
            <div class="cycle-arrow">→</div>
            <div class="cycle-step">Try again</div>
            <div class="cycle-arrow cycle-loop">↻</div>
          </div>
        </div>

        <!-- The Escape Path -->
        <div class="cycle-card cycle-escape animate-phase" style="animation-delay: 0.4s">
          <div class="cycle-header escape">
            <span class="cycle-icon">✨</span>
            <span class="cycle-title">The Escape Path</span>
          </div>
          <div class="cycle-flow escape">
            <div class="cycle-step highlight">Personalized protocol</div>
            <div class="cycle-arrow">→</div>
            <div class="cycle-step highlight">Root cause</div>
            <div class="cycle-arrow">→</div>
            <div class="cycle-step highlight success">Lasting control</div>
          </div>
        </div>
      </div>

      <p class="info-body">${screen.body}</p>
      <button class="btn-primary animate-phase" style="animation-delay: 0.7s" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// INFO CONDITIONAL RENDERER (based on stress answer)
// =================================================
function renderInfoConditional(container, screen) {
  const answerValue = state.answers[screen.basedOn];
  let contentKey = 'not_connected';

  // Determine which content to show based on stress connection answer
  if (answerValue === 'yes_definitely' || answerValue === 'sometimes') {
    contentKey = 'stress_connected';
  }

  const content = screen.content[contentKey];

  // Set gut-brain overlay if indicated
  if (content.addOverlay) {
    state.hasGutBrainOverlay = true;
  }

  let html = `
    <div class="question-container info-screen">
      ${content.icon ? `<div class="info-icon">${content.icon}</div>` : ''}
      <h2 class="question-text">${content.headline}</h2>
      <p class="info-body">${content.body.replace(/\n/g, '<br>')}</p>
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// TESTIMONIAL RENDERER
// =================================================
function renderTestimonial(container, screen) {
  const name = state.userData.name || 'Friend';
  const headline = screen.headlineTemplate.replace('{firstName}', name);

  let html = `
    <div class="question-container testimonial-screen">
      <h2 class="question-text">${headline}</h2>

      <div class="testimonial-card">
        <div class="testimonial-image-container">
          <img src="${screen.authorImage}" alt="${screen.author}" class="testimonial-image" onerror="this.style.display='none'">
        </div>
        <blockquote class="testimonial-quote">
          "${screen.quote}"
        </blockquote>
        <div class="testimonial-author">
          <strong>${screen.author}</strong>
          <span class="testimonial-detail">${screen.authorDetail}</span>
        </div>
      </div>

      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// KNOWLEDGE QUIZ RENDERER
// =================================================
function renderKnowledgeQuiz(container, screen) {
  const hasIcons = screen.options.some(opt => opt.icon);

  let html = `
    <div class="question-container knowledge-quiz" ${screen.backgroundColor ? `style="background-color: ${screen.backgroundColor}"` : ''}>
      <h2 class="question-text">${screen.question}</h2>
      <div class="options-container ${hasIcons ? 'with-icons knowledge-options' : ''}">
  `;

  screen.options.forEach((option, index) => {
    if (hasIcons && option.icon) {
      html += `
        <button class="option-button knowledge-option" data-value="${option.value}" data-correct="${option.correct}" data-index="${index}">
          <span class="option-icon">${option.icon}</span>
          <span class="option-text">${option.text}</span>
        </button>
      `;
    } else {
      html += `
        <button class="option-button knowledge-option" data-value="${option.value}" data-correct="${option.correct}" data-index="${index}">
          ${option.text}
        </button>
      `;
    }
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', () => {
      handleKnowledgeAnswer(screen, button.dataset.value, button.dataset.correct === 'true');
    });
  });
}

function handleKnowledgeAnswer(screen, value, isCorrect) {
  // Store answer
  state.answers[screen.storeAs] = value;
  state.answers[screen.storeAs + '_correct'] = isCorrect;

  // Store for the response screen
  state.lastKnowledgeAnswer = value;
  state.lastKnowledgeCorrect = isCorrect;

  // Update knowledge score
  if (isCorrect) {
    state.knowledgeScore++;
  }

  // Track answer
  trackAnswer(screen, value, value, isCorrect);

  // Visual feedback
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`[data-value="${value}"]`).classList.add('selected');

  // Auto-advance to response screen
  setTimeout(() => advanceToNextScreen(), CONFIG.AUTO_ADVANCE_DELAY);
}

// =================================================
// KNOWLEDGE RESPONSE RENDERER
// =================================================
function renderKnowledgeResponse(container, screen) {
  const isCorrect = state.lastKnowledgeCorrect;
  const content = isCorrect ? screen.content.correct : screen.content.incorrect;

  let html = `
    <div class="question-container knowledge-response" ${screen.backgroundColor ? `style="background-color: ${screen.backgroundColor}"` : ''}>
      <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-icon">${content.icon}</div>
        <h2 class="feedback-title">${content.headline}</h2>
        <p class="feedback-text">${content.body.replace(/\n/g, '<br>')}</p>
      </div>
      <button class="btn-primary" id="continueBtn">${content.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// EMAIL INPUT RENDERER
// =================================================
function renderEmailInput(container, screen) {
  const name = state.userData.name || 'Friend';
  const headline = screen.headlineTemplate
    ? screen.headlineTemplate.replace('{firstName}', name)
    : screen.headline;

  let html = `
    <div class="question-container email-capture">
      <h2 class="question-text">${headline}</h2>
  `;

  if (screen.valueList) {
    html += `
      <ul class="value-list">
        ${screen.valueList.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }

  html += `
      ${screen.inputLabel ? `<label class="input-label">${screen.inputLabel}</label>` : ''}
      <div class="input-container">
        <input type="email" class="email-input" id="emailInput"
          placeholder="${screen.placeholder}" autocomplete="email">
        <p class="input-error hidden" id="emailError">Please enter a valid email address</p>
      </div>
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
      ${screen.gdprText ? `<p class="privacy-text">${screen.gdprText}</p>` : ''}
    </div>
  `;

  container.innerHTML = html;

  const emailInput = document.getElementById('emailInput');
  const errorEl = document.getElementById('emailError');
  const continueBtn = document.getElementById('continueBtn');

  continueBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      errorEl.classList.remove('hidden');
      emailInput.focus();
      return;
    }

    errorEl.classList.add('hidden');
    state.userData.email = email;
    state.answers.user_email = email;
    state.emailCaptured = true;

    // Track email capture (both step and detailed)
    trackQuizStep('email_captured');
    trackEvent('quiz_email_submit', {
      quiz_version: 'v4',
      screen_number: screen.screenNumber
    });

    // Track email capture to Supabase
    trackQuizEvent('email_capture');

    // Track pixel lead event
    trackPixelEvent('Lead', {
      content_name: CONFIG.SOURCE_TRACKING,
      content_category: 'quiz'
    });

    // Submit partial data
    submitPartialData();

    advanceToNextScreen();
  });

  // Allow enter key
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      continueBtn.click();
    }
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// =================================================
// TEXT INPUT WITH VALIDATION RENDERER
// =================================================
function renderTextInputWithValidation(container, screen) {
  // Determine which content to show based on treatments count
  let contentKey = 'low_count';
  if (state.treatmentsCount >= 5) {
    contentKey = 'high_count';
  } else if (state.treatmentsCount >= 2) {
    contentKey = 'medium_count';
  }

  const content = screen.dynamicContent[contentKey];
  const bodyText = content.body.replace('{count}', state.treatmentsCount);

  // Convert markdown bold to HTML
  const formattedBody = bodyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  let html = `
    <div class="question-container text-input-validation">
      <h2 class="question-text">${content.headline}</h2>
      <p class="info-body">${formattedBody}</p>

      <label class="input-label">${screen.inputLabel}</label>
      <div class="input-container">
        <input type="text" class="name-input" id="nameInput"
          placeholder="${screen.placeholder}" autocomplete="given-name">
      </div>

      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  const nameInput = document.getElementById('nameInput');
  const continueBtn = document.getElementById('continueBtn');

  continueBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();

    if (screen.required && !name) {
      nameInput.focus();
      return;
    }

    state.userData.name = name || 'Friend';
    state.answers.user_name = name;

    // Track answer
    trackAnswer(screen, name, name);

    advanceToNextScreen();
  });

  // Allow enter key
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      continueBtn.click();
    }
  });
}

// =================================================
// TEXT INPUT OPTIONAL RENDERER
// =================================================
function renderTextInputOptional(container, screen) {
  let html = `
    <div class="question-container text-input-optional">
      <h2 class="question-text">${screen.question}</h2>
      ${screen.subtitle ? `<p class="question-subtitle">${screen.subtitle}</p>` : ''}

      <div class="input-container">
        <textarea class="textarea-input" id="textInput"
          placeholder="${screen.placeholder}" rows="3"></textarea>
      </div>

      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
      <button class="btn-skip" id="skipBtn">${screen.skipText || 'Skip'}</button>
    </div>
  `;

  container.innerHTML = html;

  const textInput = document.getElementById('textInput');
  const continueBtn = document.getElementById('continueBtn');
  const skipBtn = document.getElementById('skipBtn');

  continueBtn.addEventListener('click', () => {
    const value = textInput.value.trim();
    state.answers[screen.storeAs] = value;

    // Track answer
    if (value) {
      trackAnswer(screen, value, value);
    }

    advanceToNextScreen();
  });

  skipBtn.addEventListener('click', () => {
    state.answers[screen.storeAs] = '';
    advanceToNextScreen();
  });
}

// =================================================
// WARNING SCREEN RENDERER (Red flags)
// =================================================
function renderWarningScreen(container, screen) {
  let html = `
    <div class="question-container warning-screen">
      ${screen.icon ? `<div class="warning-icon">${screen.icon}</div>` : ''}
      <h2 class="question-text">${screen.headline}</h2>
      <p class="info-body">${screen.body.replace(/\n/g, '<br>')}</p>

      <div class="warning-options">
  `;

  screen.options.forEach(option => {
    html += `
      <button class="btn-secondary warning-option" data-value="${option.value}">
        ${option.text}
      </button>
    `;
  });

  html += `
      </div>
      ${screen.note ? `<p class="warning-note">${screen.note}</p>` : ''}
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.warning-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.answers.red_flag_response = btn.dataset.value;

      if (btn.dataset.value === 'already_cleared') {
        state.answers.red_flag_evaluated_cleared = true;
      }

      advanceToNextScreen();
    });
  });
}

// =================================================
// LOADING SCREEN RENDERER
// =================================================
function renderLoadingScreen(container) {
  const loading = quizContent.loadingSequence;
  const name = state.userData.name || 'Friend';
  const headline = loading.headlineTemplate.replace('{firstName}', name);

  let html = `
    <div class="comparison-popup-overlay">
      <div class="comparison-popup comparison-popup-large">
        <h2 class="comparison-popup-title-large">${headline}</h2>
        <p class="comparison-popup-subtitle">${loading.subtext}</p>

        <div class="comparison-progress-list">
  `;

  // Progress bar colors
  const colors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#2ECC71'];

  loading.progressBars.forEach((bar, index) => {
    html += `
      <div class="comparison-item" id="comparisonItem${index}" data-color="${colors[index]}">
        <div class="comparison-item-header">
          <span class="comparison-item-text">${bar.label}</span>
          <span class="comparison-item-percent" id="comparisonPercent${index}">0%</span>
        </div>
        <div class="comparison-bar">
          <div class="comparison-bar-fill" id="comparisonFill${index}" style="background: ${colors[index]}"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
        <div id="loadingPopupContainer"></div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Calculate protocol before loading animation
  calculateProtocol();

  // Track loading screen
  trackEvent('quiz_screen_view', {
    quiz_version: 'v4',
    screen_number: loading.screenNumber,
    screen_id: loading.id,
    screen_name: 'Loading Sequence',
    block_id: 'final',
    block_number: 7
  });

  // Start loading animation
  startComparisonAnimation(loading.progressBars, colors);
}

async function startComparisonAnimation(bars, colors) {
  const loading = quizContent.loadingSequence;
  state.loadingPopupIndex = 0;

  for (let i = 0; i < bars.length; i++) {
    const item = document.getElementById(`comparisonItem${i}`);
    const fill = document.getElementById(`comparisonFill${i}`);
    const percentEl = document.getElementById(`comparisonPercent${i}`);

    if (!item || !fill || !percentEl) continue;

    item.classList.add('active');

    // Check for popup questions (only 2 popups now)
    const popup = loading.popups.find(p => p.triggerAtStep === i);
    if (popup && !state.answers[popup.storeAs]) {
      // Show popup at specified percent
      await animateComparisonBar(fill, percentEl, bars[i].duration * (popup.triggerAtPercent / 100), popup.triggerAtPercent);
      await showLoadingPopup(popup);
      await animateComparisonBar(fill, percentEl, bars[i].duration * ((100 - popup.triggerAtPercent) / 100), 100, popup.triggerAtPercent);
    } else {
      await animateComparisonBar(fill, percentEl, bars[i].duration, 100);
    }

    item.classList.remove('active');
    item.classList.add('completed');
  }

  // Show completion message
  setTimeout(() => {
    const popup = document.querySelector('.comparison-popup');
    if (popup) {
      const completionDiv = document.createElement('div');
      completionDiv.className = 'comparison-complete';
      completionDiv.innerHTML = `
        <div class="comparison-complete-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span>${quizContent.loadingSequence.completionMessage}</span>
      `;
      popup.appendChild(completionDiv);
    }

    // Submit final data
    submitFinalData();

    // Start animated reveal sequence after brief delay
    setTimeout(() => {
      startAnimatedReveal();
    }, 1200);
  }, 500);
}

// =================================================
// ANIMATED REVEAL SEQUENCE
// =================================================
function startAnimatedReveal() {
  // Track animated reveal start
  trackQuizStep('animated_reveal');

  const container = contentEl;
  const name = state.userData.name || 'Friend';
  const goalText = quizContent.goalTexts[state.answers.future_vision] || 'feel better';
  const timelineText = getTimelinePrediction().replace(/\*\*(.*?)\*\*/g, '$1');

  // Hide quiz header during reveal
  const quizHeader = document.getElementById('quizHeader');
  const progressContainer = document.getElementById('progressContainer');
  if (quizHeader) quizHeader.style.display = 'none';
  if (progressContainer) progressContainer.style.display = 'none';

  container.innerHTML = `
    <div class="animated-reveal">
      <!-- Step 1: Logo -->
      <div class="reveal-step reveal-logo" id="revealStep1">
        <img src="/assets/Logo.png" alt="Gut Healing Academy" class="reveal-logo-img" onerror="this.style.display='none'">
      </div>

      <!-- Step 2: Protocol Ready -->
      <div class="reveal-step reveal-ready" id="revealStep2">
        <div class="reveal-icon">✨</div>
        <h2 class="reveal-headline">${name}, your personalized protocol is ready.</h2>
      </div>

      <!-- Step 3: Goal Connection -->
      <div class="reveal-step reveal-goal" id="revealStep3">
        <p class="reveal-goal-text">Built to help you <strong>${goalText}</strong></p>
      </div>

      <!-- Step 4: Timeline -->
      <div class="reveal-step reveal-timeline" id="revealStep4">
        <div class="reveal-timeline-card">
          <div class="reveal-timeline-icon">📅</div>
          <p class="reveal-timeline-text">${timelineText}</p>
        </div>
      </div>

      <!-- Step 5: Let's Begin -->
      <div class="reveal-step reveal-begin" id="revealStep5">
        <p class="reveal-begin-text">Let's see what we built for you.</p>
        <button class="btn-primary reveal-cta" id="revealContinueBtn">Show My Results</button>
      </div>
    </div>
  `;

  // Timing sequence (in ms)
  const timings = [0, 1500, 3000, 4500, 7000];

  // Animate each step
  timings.forEach((delay, index) => {
    setTimeout(() => {
      const step = document.getElementById(`revealStep${index + 1}`);
      if (step) {
        step.classList.add('visible');
      }
    }, delay);
  });

  // Add click handler to continue button
  setTimeout(() => {
    const continueBtn = document.getElementById('revealContinueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        // Show header again
        if (quizHeader) quizHeader.style.display = '';
        if (progressContainer) progressContainer.style.display = '';

        advanceToNextScreen();
      });
    }
  }, 7000);
}

function animateComparisonBar(fill, percentEl, duration, targetPercent, startPercent = 0) {
  return new Promise(resolve => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentPercent = Math.round(startPercent + easedProgress * (targetPercent - startPercent));

      fill.style.width = currentPercent + '%';
      percentEl.textContent = currentPercent + '%';

      if (progress < 1 && !state.loadingPaused) {
        requestAnimationFrame(animate);
      } else if (!state.loadingPaused) {
        resolve();
      }
    };
    animate();
  });
}

function showLoadingPopup(question) {
  return new Promise(resolve => {
    state.loadingPaused = true;

    const popupContainer = document.getElementById('loadingPopupContainer');

    let html = `
      <div class="loading-popup-center">
        <div class="loading-popup-card">
          <p class="loading-popup-question">${question.question}</p>
          <div class="loading-popup-options">
    `;

    question.options.forEach(option => {
      html += `
        <button class="loading-popup-option" data-value="${option}">${option}</button>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    popupContainer.innerHTML = html;

    popupContainer.querySelectorAll('.loading-popup-option').forEach(btn => {
      btn.addEventListener('click', () => {
        state.answers[question.storeAs] = btn.dataset.value;
        state.loadingPopupIndex++;
        popupContainer.innerHTML = '';
        state.loadingPaused = false;
        resolve();
      });
    });
  });
}

// =================================================
// RESULTS SCREEN RENDERER
// =================================================
function renderResultsScreen(container) {
  // Check for red flags first
  if (state.hasRedFlags && !state.answers.red_flag_evaluated_cleared) {
    renderRedFlagResults(container);
    return;
  }

  renderNormalResults(container);
}

function renderNormalResults(container) {
  const protocol = quizContent.protocols[state.calculatedProtocol];
  const gutType = quizContent.gutTypes[state.calculatedProtocol];
  const goalText = quizContent.goalTexts[state.answers.future_vision] || 'feel better';
  const name = state.userData.name || 'Friend';
  const scarcityPercent = quizContent.scarcityPercentages[state.calculatedProtocol] || 20;

  // Get contextual Rebecca quote
  const rebeccaQuote = getContextualRebeccaQuote();

  // Get timeline prediction
  const timelinePrediction = getTimelinePrediction();

  // Format timeline prediction (convert markdown bold to HTML)
  const formattedTimeline = timelinePrediction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  let html = `
    <div class="question-container results-screen">
      <!-- Header - Outcome Focused -->
      <div class="results-header">
        <p class="results-label">YOUR GUT TYPE</p>
        <h1 class="gut-type-name" style="border-color: ${gutType.color}">${gutType.name}</h1>
      </div>

      <!-- How This Protocol Is Built Section -->
      <div class="protocol-explanation">
        <h2 class="protocol-explanation-title">How this protocol is built for your gut:</h2>
        <p class="protocol-explanation-text">${gutType.description}</p>
      </div>

      <!-- Protocol Card -->
      <div class="protocol-card" style="border-color: ${gutType.color}">
        <div class="protocol-label">YOUR MATCHED PROTOCOL</div>
        <h2 class="protocol-name">${protocol.name}</h2>
        ${state.hasGutBrainOverlay ? `<span class="protocol-overlay">${quizContent.nervousSystemOverlay.name}</span>` : ''}

        <ul class="protocol-includes">
          ${protocol.includes.map(item => `<li><span class="include-check">✓</span> ${item}</li>`).join('')}
        </ul>
      </div>

      <!-- What Changes Section -->
      <div class="what-changes-section">
        <h3 class="what-changes-title">What this means for you:</h3>
        <div class="outcome-card">
          <div class="outcome-icon">🎯</div>
          <p class="outcome-text">A clear path to <strong>${goalText}</strong></p>
        </div>
        <div class="outcome-card">
          <div class="outcome-icon">📅</div>
          <p class="outcome-text">${formattedTimeline}</p>
        </div>
        <div class="outcome-card">
          <div class="outcome-icon">👩‍⚕️</div>
          <p class="outcome-text">Real practitioner support — not another app to use alone</p>
        </div>
      </div>

      <!-- Personalization Summary -->
      <div class="personalization-summary">
        <h3 class="personalization-title">We built this protocol around:</h3>
        <ul class="personalization-list">
          <li><span class="pers-bullet">•</span> Your primary concern: <strong>${quizContent.complaintLabels[state.answers.primary_complaint] || 'gut issues'}</strong></li>
          <li><span class="pers-bullet">•</span> ${quizContent.durationLabels[state.answers.symptom_duration] || 'Your history'} of dealing with this</li>
          <li><span class="pers-bullet">•</span> The <strong>${state.treatmentsCount}</strong> approaches you've already tried</li>
          ${state.hasGutBrainOverlay ? `<li><span class="pers-bullet">•</span> Your gut-brain connection (nervous system support included)</li>` : ''}
        </ul>
      </div>

      <!-- Scarcity Message -->
      <div class="scarcity-message">
        <p>Only <strong>${scarcityPercent}%</strong> of women match your exact profile.</p>
        <p class="scarcity-subtext">You've qualified for personalized practitioner support.</p>
      </div>

      <!-- Practitioner Quote - Contextual -->
      <div class="practitioner-quote">
        <img src="/about/practitioner-rebecca.png" alt="Rebecca Taylor" class="practitioner-photo" onerror="this.style.display='none'">
        <div class="practitioner-content">
          <p class="practitioner-text">"${rebeccaQuote}"</p>
          <p class="practitioner-name">— Rebecca Taylor, BSc, MS, RNutr</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <button class="btn btn-coral" id="ctaBtn">Continue</button>
        <p class="cta-guarantee">See your protocol details →</p>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Track results shown
  state.quizCompleted = true;
  trackQuizComplete();

  // Track CTA
  document.getElementById('ctaBtn').addEventListener('click', () => {
    trackEvent('quiz_cta_click', {
      quiz_version: 'v4',
      cta_type: 'start_trial',
      location: 'results_page'
    });

    redirectToOffer();
  });
}

function getTimelinePrediction() {
  const lifeImpact = state.answers.life_impact;
  const duration = state.answers.symptom_duration;

  if (lifeImpact === 'severe') {
    return quizContent.timelinePredictions.high_impact;
  }

  if (duration === '5_plus_years' || duration === '3_5_years') {
    const durationText = quizContent.durationText[duration] || 'years';
    return quizContent.timelinePredictions.long_duration.replace('{duration}', durationText);
  }

  return quizContent.timelinePredictions.default;
}

// Get contextual Rebecca quote based on user's answers
function getContextualRebeccaQuote() {
  const complaint = state.answers.primary_complaint;
  const duration = state.answers.symptom_duration;
  const treatmentsCount = state.treatmentsCount || 0;
  const hasStress = state.hasGutBrainOverlay;

  // Priority 1: Long duration (5+ years) with many treatments tried
  if ((duration === '5_plus_years' || duration === '3_5_years') && treatmentsCount >= 4) {
    return "After years of trial and error, your gut needs a different approach — one that adapts to your specific response patterns. That's exactly what this protocol does.";
  }

  // Priority 2: Stress connection
  if (hasStress) {
    return "Your gut-brain connection is significant. Most programs ignore this completely — but yours includes specific nervous system support because your gut won't heal without it.";
  }

  // Priority 3: Primary complaint specific
  const complaintQuotes = {
    bloating: "Bloating that won't quit usually signals something specific about how your gut processes certain foods. Your protocol targets exactly that mechanism.",
    constipation: "Slow transit isn't just about fiber — it's about gut motility patterns. Your protocol addresses the underlying rhythm, not just the symptoms.",
    diarrhea: "Urgency and loose stools often mean your gut is overreacting to triggers. Your protocol helps calm that response while supporting your microbiome.",
    mixed: "Alternating patterns are actually the trickiest to solve with generic advice. That's why your protocol adapts based on what phase you're in.",
    pain: "Gut pain that comes and goes usually has specific triggers. Your protocol helps identify and address those patterns systematically.",
    gas: "Excessive gas is often about fermentation patterns — not just what you eat, but how your gut breaks it down. Your protocol addresses both."
  };

  if (complaintQuotes[complaint]) {
    return complaintQuotes[complaint];
  }

  // Priority 4: Many treatments tried
  if (treatmentsCount >= 5) {
    return `You've tried ${treatmentsCount} different approaches. That persistence matters — it means you know what doesn't work. Now let's find what does.`;
  }

  // Default
  return "I've reviewed profiles like yours many times. The pattern is clear — you need someone tracking your response and adjusting as you go, not another diet to try alone.";
}

function renderRedFlagResults(container) {
  // Track red flag results
  trackQuizStep('red_flag_results');

  const practitioner = quizContent.practitioners.rebecca;
  const name = state.userData.name || 'Friend';

  // Get red flag messages
  const flagMessages = state.redFlags.map(flag =>
    quizContent.redFlagMessages[flag.field] || flag.field
  );

  let html = `
    <div class="question-container red-flag-screen">
      <img src="${practitioner.photo}" alt="${practitioner.name}" class="red-flag-photo" onerror="this.style.display='none'">

      <h1 class="red-flag-title">"${name}, I need to be direct with you."</h1>

      <p class="red-flag-message">
        Based on your responses, I noticed some symptoms that should be evaluated by a gastroenterologist before starting any gut protocol.
        <br><br>
        This isn't about being overly cautious — it's about making sure we're addressing functional issues, not masking something that needs medical attention.
      </p>

      <div class="red-flag-list">
        <div class="red-flag-list-title">Please see your doctor about:</div>
        <ul>
          ${flagMessages.map(msg => `<li>${msg}</li>`).join('')}
        </ul>
      </div>

      <p class="red-flag-message">
        Once you've been evaluated and cleared, come back. We'll have your protocol ready.
        <br><br>
        This is exactly what a responsible practitioner would tell you — and it's why we ask these questions.
      </p>

      <p style="font-style: italic; color: var(--text-muted);">
        — ${practitioner.name}, ${practitioner.credentials}
      </p>

      <div class="red-flag-actions mt-xl">
        <button class="btn-secondary" id="exitBtn">I'll return after seeing my doctor</button>
        <button class="btn-primary mt-md" id="continueAnywayBtn">I've already been evaluated and cleared</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Track red flag results
  state.quizCompleted = true;
  trackQuizComplete();

  // Handle exit button
  document.getElementById('exitBtn').addEventListener('click', () => {
    window.location.href = '/';
  });

  // Handle "already cleared" button - continue to normal results
  document.getElementById('continueAnywayBtn').addEventListener('click', () => {
    state.answers.red_flag_evaluated_cleared = true;
    // Re-render as normal results
    renderNormalResults(container);
  });
}

// =================================================
// PROTOCOL CALCULATION
// =================================================
function calculateProtocol() {
  const answers = state.answers;
  const diagnoses = answers.diagnoses || [];
  const treatments = state.treatmentsTried || [];

  // Priority 1: Post-SIBO (requires both diagnosis AND treatment)
  if (diagnoses.includes('sibo') && treatments.includes('prescription')) {
    state.calculatedProtocol = 'rebuild';
    return;
  }

  // Priority 2: Alternating stool pattern -> stability
  if (answers.stool_changes === 'alternates') {
    state.calculatedProtocol = 'stability';
    return;
  }

  // Priority 3: Primary complaint mapping
  const complaint = answers.primary_complaint;

  const protocolMap = {
    'bloating': 'bloat_reset',
    'gas': 'bloat_reset',
    'pain': 'bloat_reset',
    'constipation': 'regularity',
    'diarrhea': 'calm_gut',
    'mixed': 'stability'
  };

  // Handle pain with sub-logic based on flare frequency
  if (complaint === 'pain') {
    if (answers.flare_frequency === 'more') {
      state.calculatedProtocol = 'calm_gut';
    } else if (answers.flare_frequency === 'less') {
      state.calculatedProtocol = 'regularity';
    } else if (answers.flare_frequency === 'both') {
      state.calculatedProtocol = 'stability';
    } else {
      state.calculatedProtocol = 'bloat_reset';
    }
    return;
  }

  state.calculatedProtocol = protocolMap[complaint] || 'bloat_reset';
}

// =================================================
// NAVIGATION
// =================================================
function advanceToNextScreen() {
  // Save to history
  const lastHistoryEntry = state.history[state.history.length - 1];
  const shouldPushHistory = !lastHistoryEntry ||
    lastHistoryEntry.screenIndex !== state.currentScreenIndex;

  if (shouldPushHistory) {
    state.history.push({
      screenIndex: state.currentScreenIndex,
      phaseIndex: state.currentPhaseIndex
    });
  }

  // Check if we need to show safety warning (after safety_weight)
  const currentScreen = screenOrder[state.currentScreenIndex];
  if (currentScreen.screenKey === 'safety_weight' && state.hasRedFlags) {
    // Insert safety warning screen
    state.currentScreenIndex++;
    renderWarningScreen(contentEl, quizContent.safetyWarning);
    return;
  }

  // Move to next screen
  state.currentScreenIndex++;

  // Update phase index
  if (state.currentScreenIndex < screenOrder.length) {
    state.currentPhaseIndex = screenOrder[state.currentScreenIndex].phase;
  }

  // Check if quiz is complete
  if (state.currentScreenIndex >= screenOrder.length) {
    console.log('Quiz complete');
    return;
  }

  renderCurrentScreen();
  updateProgressBar();
}

function handleBack() {
  if (state.history.length === 0) return;

  // Pop from history
  let prev = state.history.pop();

  // Skip any duplicate entries
  while (state.history.length > 0 && prev.screenIndex === state.currentScreenIndex) {
    prev = state.history.pop();
  }

  state.currentScreenIndex = prev.screenIndex;
  state.currentPhaseIndex = prev.phaseIndex;

  renderCurrentScreen();
  updateProgressBar();
}

// =================================================
// PROGRESS BAR
// =================================================
function updateProgressBar() {
  const segments = document.querySelectorAll('.progress-segment');
  const dots = document.querySelectorAll('.progress-dot');

  // Calculate progress within current phase
  let questionsBeforeCurrentPhase = 0;
  for (let i = 0; i < state.currentPhaseIndex; i++) {
    questionsBeforeCurrentPhase += QUESTIONS_PER_PHASE[i];
  }
  const currentQuestionInPhase = state.currentScreenIndex - questionsBeforeCurrentPhase;
  const questionsInCurrentPhase = QUESTIONS_PER_PHASE[state.currentPhaseIndex] || 1;
  const progressInPhase = Math.min(currentQuestionInPhase / questionsInCurrentPhase, 1);

  segments.forEach((segment, index) => {
    const fill = segment.querySelector('.segment-fill');
    segment.classList.remove('completed', 'current');

    if (index < state.currentPhaseIndex) {
      // Completed phases
      segment.classList.add('completed');
      if (fill) fill.style.width = '100%';
    } else if (index === state.currentPhaseIndex) {
      // Current phase - show partial fill
      segment.classList.add('current');
      if (fill) fill.style.width = (progressInPhase * 100) + '%';
    } else {
      // Future phases
      if (fill) fill.style.width = '0%';
    }
  });

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    if (index < state.currentPhaseIndex) {
      dot.classList.add('active');
    }
  });
}

// =================================================
// DATA SUBMISSION
// =================================================
async function submitPartialData() {
  // Send to webhook
  sendWebhook('quiz_email_captured');

  // Submit to Supabase
  if (supabaseClient) {
    try {
      const userRecord = buildUserRecord(true);
      const { error } = await supabaseClient.rpc('upsert_quiz_lead', {
        user_data: userRecord
      });

      if (error) {
        console.error('Supabase partial insert error:', error);
      } else {
        console.log('Supabase partial submission successful');
      }
    } catch (e) {
      console.error('Error submitting to Supabase:', e);
    }
  }
}

async function submitFinalData() {
  // Send to webhook
  sendWebhook('quiz_completed');

  // Submit to Supabase
  if (supabaseClient) {
    try {
      const userRecord = buildUserRecord(false);
      const { error } = await supabaseClient.rpc('upsert_quiz_lead', {
        user_data: userRecord
      });

      if (error) {
        console.error('Supabase final insert error:', error);
      } else {
        console.log('Supabase final submission successful');
      }
    } catch (e) {
      console.error('Error submitting to Supabase:', e);
    }

    // Track referral quiz completion
    await trackReferralQuizCompletion();
  }
}

async function trackReferralQuizCompletion() {
  // Get ref code from GHA_Referral, cookie, or localStorage
  var refCode = null;
  if (typeof GHA_Referral !== 'undefined' && GHA_Referral.getRefCode) {
    refCode = GHA_Referral.getRefCode();
  }
  if (!refCode) {
    var match = document.cookie.match(/(?:^|;\s*)ref_code=([^;]*)/);
    if (match) refCode = decodeURIComponent(match[1]);
  }
  if (!refCode) {
    try { refCode = localStorage.getItem('referral_code') || null; } catch(e) {}
  }

  if (!refCode || !supabaseClient) return;

  var referredEmail = state.userData.email || null;

  try {
    const { error } = await supabaseClient
      .from('referrals')
      .insert({
        referrer_code: refCode,
        referred_email: referredEmail,
        quiz_completed: true,
        trial_started: false,
        account_activated: false
      });

    if (error) {
      console.error('Referral tracking error:', error);
    } else {
      console.log('Referral quiz completion tracked for code:', refCode);
    }
  } catch (e) {
    console.error('Error tracking referral:', e);
  }
}

function buildUserRecord(isPartial) {
  const protocolNumbers = {
    bloat_reset: 1,
    regularity: 2,
    calm_gut: 3,
    stability: 4,
    rebuild: 5
  };

  return {
    name: state.userData.name || null,
    email: state.userData.email || null,
    quiz_source: CONFIG.SOURCE_TRACKING,
    lead_source: CONFIG.SOURCE_TRACKING,

    // Goal info
    goal_selection: state.answers.future_vision || null,
    journey_stage: null,

    // Protocol
    protocol: state.calculatedProtocol ? protocolNumbers[state.calculatedProtocol] : null,
    protocol_name: state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : null,
    has_stress_component: state.hasGutBrainOverlay || false,

    // Red flags
    has_red_flags: state.hasRedFlags || false,
    red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,
    red_flag_details: state.hasRedFlags ? { flags: state.redFlags } : null,

    // Questions
    primary_complaint: state.answers.primary_complaint || null,
    symptom_frequency: null,
    relief_after_bm: state.answers.bm_relief || null,
    frequency_during_flare: state.answers.flare_frequency || null,
    stool_during_flare: state.answers.stool_changes || null,
    duration: state.answers.symptom_duration || null,
    diagnoses: state.answers.diagnoses || [],
    treatments_tried: state.treatmentsTried || [],
    stress_connection: state.answers.stress_connection || null,
    mental_health_impact: null,
    sleep_quality: null,
    life_impact_level: state.answers.life_impact || null,
    hardest_part: null,
    dream_outcome: state.answers.user_vision || null,

    // Quiz-4 specific fields
    user_timeline: state.answers.user_timeline || null,
    knowledge_score: state.knowledgeScore || 0,
    gut_brain_score: state.gutBrainScore || null,
    symptom_timing: state.answers.symptom_timing || null,
    symptom_trigger_timing: state.answers.symptom_trigger_timing || null,

    // Status
    role: 'member',
    status: 'lead'
  };
}

async function sendWebhook(eventType) {
  const protocol = state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol] : null;
  const protocolNumbers = {
    bloat_reset: 1,
    regularity: 2,
    calm_gut: 3,
    stability: 4,
    rebuild: 5
  };

  const payload = {
    name: state.userData.name || '',
    email: state.userData.email || '',

    protocol_number: state.calculatedProtocol ? protocolNumbers[state.calculatedProtocol] : 0,
    protocol_name: protocol ? protocol.name : '',
    protocol_description: protocol ? protocol.tagline : '',
    has_stress_component: state.hasGutBrainOverlay || false,

    goal_selection: state.answers.future_vision || '',
    journey_stage: '',

    // Safety questions
    q1_weight_loss: state.answers.safety_weight || '',
    q2_blood: state.answers.safety_blood || '',
    q3_family_history: '',
    q4_colonoscopy: '',

    // Quiz questions
    q5_primary_complaint: state.answers.primary_complaint || '',
    q6_frequency: '',
    q7_bm_relief: state.answers.bm_relief || '',
    q8_frequency_change: state.answers.flare_frequency || '',
    q9_stool_change: state.answers.stool_changes || '',
    q10_duration: state.answers.symptom_duration || '',
    q11_diagnosis: (state.answers.diagnoses || []).join(','),
    q12_tried: (state.treatmentsTried || []).join(','),
    q13_stress: state.answers.stress_connection || '',
    q14_mental_health: '',
    q15_sleep: '',
    q16_life_impact: state.answers.life_impact || '',
    q17_hardest_part: '',
    q18_vision: state.answers.user_vision || '',

    // Red flags
    had_red_flags: state.hasRedFlags || false,
    red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,

    // Quiz-4 specific fields
    user_timeline: state.answers.user_timeline || '',
    knowledge_score: state.knowledgeScore || 0,
    gut_brain_score: state.gutBrainScore || '',
    symptom_timing: state.answers.symptom_timing || '',
    symptom_trigger_timing: state.answers.symptom_trigger_timing || '',
    knowledge_eating_speed_correct: state.answers.knowledge_eating_speed_correct ? 'true' : 'false',
    knowledge_fodmap_correct: state.answers.knowledge_fodmap_correct ? 'true' : 'false',

    // Tracking
    source: CONFIG.SOURCE_TRACKING,
    submission_type: eventType,
    submitted_at: new Date().toISOString()
  };

  try {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value));
    }

    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (response.ok) {
      console.log('Webhook submission successful');
    } else {
      console.error('Webhook submission failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error submitting to webhook:', error);
  }
}

// =================================================
// REDIRECT TO OFFER
// =================================================
function redirectToOffer() {
  // Track offer redirect
  trackQuizStep('offer_redirect');

  const params = new URLSearchParams();

  // Standard params
  params.set('source', CONFIG.SOURCE_TRACKING);
  params.set('name', state.userData.name || '');
  params.set('email', state.userData.email || '');

  // Protocol info
  params.set('protocol', state.calculatedProtocol || '');
  params.set('protocol_name', state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : '');
  params.set('gut_brain', state.hasGutBrainOverlay ? 'true' : 'false');

  // Gut type
  if (state.calculatedProtocol && quizContent.gutTypes[state.calculatedProtocol]) {
    params.set('gut_type', quizContent.gutTypes[state.calculatedProtocol].name);
  }

  // Goal
  if (state.answers.future_vision) {
    params.set('goal_selection', state.answers.future_vision);
  }

  // Complaint info
  if (state.answers.primary_complaint) {
    params.set('primary_complaint', state.answers.primary_complaint);
    params.set('primary_complaint_label', quizContent.complaintLabels[state.answers.primary_complaint] || '');
  }

  // Duration
  if (state.answers.symptom_duration) {
    params.set('duration', state.answers.symptom_duration);
  }

  // Diagnoses
  if (state.answers.diagnoses) {
    params.set('diagnoses', state.answers.diagnoses.join(','));
  }

  // Treatments
  if (state.treatmentsTried.length > 0) {
    params.set('treatments', state.treatmentsTried.join(','));
    params.set('treatments_formatted', formatTreatmentsList(state.treatmentsTried));
    params.set('treatments_tried_count', state.treatmentsCount.toString());
  }

  // Stress level
  params.set('stress_level', state.hasGutBrainOverlay ? 'significant' : 'none');

  // Life impact
  if (state.answers.life_impact) {
    params.set('life_impact', state.answers.life_impact);
  }

  // Vision
  if (state.answers.user_vision) {
    params.set('vision', encodeURIComponent(state.answers.user_vision.substring(0, 200)));
  }

  // Referral tracking - pass ref code through to offer page
  var offerUrl = `${CONFIG.OFFER_URL}?${params.toString()}`;
  window.location.href = typeof GHA_Referral !== 'undefined' ? GHA_Referral.buildUrl(offerUrl) : offerUrl;
}

function formatTreatmentsList(treatments) {
  if (!treatments || treatments.length === 0) return '';

  const labels = treatments
    .filter(t => t !== 'nothing')
    .map(t => quizContent.treatmentLabels[t] || t);

  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;

  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

// =================================================
// TRACKING
// =================================================
function trackEvent(eventName, data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...data
  });
  console.log('DataLayer push:', eventName, data);
}

// =================================================
// GTM QUIZ STEP TRACKING (Quiz-4 specific)
// =================================================
function trackQuizStep(sectionName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'quiz_step',
    'quiz_section': sectionName,
    'quiz_source': CONFIG.SOURCE_TRACKING
  });
  console.log('GTM quiz_step:', { quiz_section: sectionName, quiz_source: CONFIG.SOURCE_TRACKING });
}

// Get tracking section name based on current screen
function getTrackingSectionName() {
  const screenInfo = screenOrder[state.currentScreenIndex];
  const screenKey = screenInfo?.screenKey || 'unknown';

  // Map screen keys to tracking section names
  const sectionMap = {
    // Phase 1: Emotional Hook (YOUR GOALS)
    'future_vision': 'phase1_q1_future_vision',
    'timeline': 'phase1_q2_timeline',
    'primary_complaint': 'phase1_q3_complaint',
    'duration': 'phase1_q4_duration',
    'validation_duration': 'phase1_validation',

    // Phase 2: Clinical Assessment (YOUR SYMPTOMS)
    'bm_relief': 'phase2_q1_bm_relief',
    'flare_frequency': 'phase2_q2_flare_frequency',
    'stool_changes': 'phase2_q3_stool_changes',
    'progress_validation': 'phase2_validation',
    'treatments_tried': 'phase2_q4_treatments',
    'diagnosis_history': 'phase2_q5_diagnosis',
    'name_capture': 'phase2_name_capture',

    // Phase 3: The Bridge (WHY THIS WORKS)
    'why_different': 'phase3_why_different',
    'testimonial': 'phase3_testimonial',

    // Phase 4: Knowledge Quiz (QUICK GUT CHECK)
    'knowledge_intro': 'phase4_intro',
    'knowledge_eating_speed': 'phase4_q1_eating_speed',
    'knowledge_eating_response': 'phase4_q1_response',
    'knowledge_fodmap': 'phase4_q2_fodmap',
    'knowledge_fodmap_response': 'phase4_q2_response',

    // Phase 5: Gut-Brain (YOUR PROFILE)
    'stress_connection': 'phase5_q1_stress',
    'stress_validation': 'phase5_validation',

    // Phase 6: Safety (FINAL QUESTIONS)
    'safety_blood': 'phase6_q1_safety_blood',
    'safety_weight': 'phase6_q2_safety_weight',

    // Phase 7: Email Capture & Results (YOUR RESULTS)
    'life_impact': 'phase7_q1_life_impact',
    'email_capture': 'phase7_email_capture',
    'vision_optional': 'phase7_vision_optional',
    'loading_sequence': 'phase7_loading',
    'results_page': 'phase7_results'
  };

  return sectionMap[screenKey] || `unknown_${screenKey}`;
}

// =================================================
// SUPABASE EVENT TRACKING
// =================================================
async function trackQuizEvent(eventType, additionalData = {}) {
  if (!supabaseClient) {
    console.log('Supabase not available for event tracking');
    return;
  }

  const screenInfo = screenOrder[state.currentScreenIndex] || {};
  const screen = getScreenContent(screenInfo.screenKey);

  const eventData = {
    session_id: state.sessionId,
    quiz_source: CONFIG.SOURCE_TRACKING,
    event_type: eventType,
    screen_index: state.currentScreenIndex,
    screen_id: screenInfo.screenKey || null,
    screen_name: screen?.question || screen?.headline || screenInfo.screenKey || null,
    phase_index: state.currentPhaseIndex,
    phase_name: SECTION_LABELS[state.currentPhaseIndex] || null,
    time_on_screen_seconds: state.screenStartTime
      ? Math.round((new Date() - state.screenStartTime) / 1000)
      : 0,
    time_since_start_seconds: state.quizStartTime
      ? Math.round((new Date() - state.quizStartTime) / 1000)
      : 0,
    user_name: state.userData.name || null,
    user_email: state.userData.email || null,
    protocol_key: state.calculatedProtocol || null,
    protocol_name: state.calculatedProtocol
      ? quizContent.protocols[state.calculatedProtocol]?.name
      : null,
    has_gut_brain: state.hasGutBrainOverlay || false,
    primary_complaint: state.answers.primary_complaint || null,
    treatments_count: state.treatmentsCount || 0,
    has_red_flags: state.hasRedFlags || false,
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
    ...additionalData
  };

  try {
    const { error } = await supabaseClient.rpc('insert_quiz_event', {
      event_data: eventData
    });

    if (error) {
      console.error('Supabase event tracking error:', error);
    } else {
      console.log('Quiz event tracked:', eventType, eventData.screen_id);
    }
  } catch (e) {
    console.error('Error tracking quiz event:', e);
  }
}

function trackScreenView(screen) {
  const timeOnPrevious = state.screenStartTime ?
    Math.round((new Date() - state.screenStartTime) / 1000) : 0;

  trackEvent('quiz_screen_view', {
    quiz_version: 'v4',
    screen_number: screen.screenNumber || state.currentScreenIndex + 1,
    screen_id: screen.id,
    screen_name: screen.question || screen.headline || screen.id,
    phase_id: screenOrder[state.currentScreenIndex]?.phase || 0,
    phase_number: state.currentPhaseIndex + 1,
    time_on_previous_screen_seconds: timeOnPrevious
  });

  // Track to Supabase
  trackQuizEvent('screen_view');
}

function trackAnswer(screen, value, answerText, isCorrect = null) {
  const timeToAnswer = state.screenStartTime ?
    Math.round((new Date() - state.screenStartTime) / 1000) : 0;

  trackEvent('quiz_answer', {
    quiz_version: 'v4',
    screen_number: screen.screenNumber || state.currentScreenIndex + 1,
    screen_id: screen.id,
    question_type: screen.type,
    answer_value: Array.isArray(value) ? value.join(',') : value,
    answer_text: answerText,
    is_correct: isCorrect,
    time_to_answer_seconds: timeToAnswer
  });

  // Track to Supabase
  trackQuizEvent('answer', {
    answer_value: Array.isArray(value) ? value.join(',') : value,
    answer_text: answerText,
    is_correct: isCorrect
  });
}

function trackQuizComplete() {
  const totalTime = state.quizStartTime ?
    Math.round((new Date() - state.quizStartTime) / 1000) : 0;

  trackEvent('quiz_complete', {
    quiz_version: 'v4',
    total_time_seconds: totalTime,
    total_screens_viewed: state.totalScreensViewed,
    protocol_assigned: state.calculatedProtocol,
    gut_type: state.calculatedProtocol ? quizContent.gutTypes[state.calculatedProtocol].name : null,
    has_red_flags: state.hasRedFlags,
    user_goal: state.answers.future_vision,
    user_timeline: state.answers.user_timeline,
    primary_complaint: state.answers.primary_complaint,
    duration: state.answers.symptom_duration,
    treatments_tried_count: state.treatmentsCount,
    knowledge_score: state.knowledgeScore,
    gut_brain_overlay: state.hasGutBrainOverlay
  });

  // Track to Supabase
  trackQuizEvent('quiz_complete');

  // Track pixel complete registration
  trackPixelEvent('CompleteRegistration', {
    content_name: CONFIG.SOURCE_TRACKING,
    status: state.calculatedProtocol
  });
}

function trackPixelEvent(event, params = {}) {
  if (typeof fbq === 'function') {
    fbq('track', event, params);
  }
}

function handlePageUnload() {
  if (!state.quizCompleted) {
    const totalTime = state.quizStartTime ?
      Math.round((new Date() - state.quizStartTime) / 1000) : 0;

    // Use sendBeacon for reliability
    const data = {
      event: 'quiz_abandon',
      quiz_version: 'v4',
      last_screen_number: state.currentScreenIndex + 1,
      last_screen_id: screenOrder[state.currentScreenIndex]?.screenKey || '',
      email_captured: state.emailCaptured,
      total_time_seconds: totalTime
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        'https://www.google-analytics.com/collect',
        JSON.stringify(data)
      );
    }

    // Also push to dataLayer
    trackEvent('quiz_abandon', data);

    // Track abandonment to Supabase via sendBeacon
    if (navigator.sendBeacon && supabaseClient) {
      const eventData = {
        session_id: state.sessionId,
        quiz_source: CONFIG.SOURCE_TRACKING,
        event_type: 'quiz_abandon',
        screen_index: state.currentScreenIndex,
        screen_id: screenOrder[state.currentScreenIndex]?.screenKey || null,
        phase_index: state.currentPhaseIndex,
        phase_name: SECTION_LABELS[state.currentPhaseIndex] || null,
        time_since_start_seconds: totalTime,
        user_name: state.userData.name || null,
        user_email: state.userData.email || null,
        primary_complaint: state.answers.primary_complaint || null,
        treatments_count: state.treatmentsCount || 0,
        has_red_flags: state.hasRedFlags || false
      };

      // Use fetch with keepalive for better reliability on page unload
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/insert_quiz_event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ event_data: eventData }),
        keepalive: true
      }).catch(() => {});
    }
  }
}
