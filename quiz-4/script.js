/* =====================================================
   Quiz v4 Script - Gut Healing Academy
   Psychological Commitment-Building Quiz
   ===================================================== */

// =================================================
// CONFIGURATION
// =================================================
const CONFIG = {
  OFFER_URL: '/offer/',
  SOURCE_TRACKING: 'quiz-4',
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzQ1NzIsImV4cCI6MjA2MjY1MDU3Mn0.nFiAK8bLfNB0lG6SbDa6ReJjr1K1468g_uZfvmh_h1w',
  AUTO_ADVANCE_DELAY: 400,
  TOTAL_SCREENS: 30,
  TOTAL_BLOCKS: 7
};

// =================================================
// APPLICATION STATE
// =================================================
const state = {
  // Navigation
  currentScreenIndex: 0,
  currentBlockIndex: 0,
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

  // UI state
  showingFeedback: false,
  currentFeedbackCorrect: null
};

// Initialize Supabase client
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log('Supabase not available');
}

// Screen order mapping
const screenOrder = [
  // Block 1: Goals & Context (1-5)
  { block: 0, screenKey: 'goal_selection' },
  { block: 0, screenKey: 'timeline_setting' },
  { block: 0, screenKey: 'primary_complaint' },
  { block: 0, screenKey: 'frequency' },
  { block: 0, screenKey: 'duration' },
  // Block 2: Symptom Patterns (6-10)
  { block: 1, screenKey: 'bm_relief' },
  { block: 1, screenKey: 'flare_frequency' },
  { block: 1, screenKey: 'stool_changes' },
  { block: 1, screenKey: 'treatments_tried' },
  { block: 1, screenKey: 'diagnosis_history' },
  // Goal Reminder 1
  { block: 1, screenKey: 'goal_reminder_1', type: 'goal_reminder' },
  // Block 3: Why Different (11)
  { block: 2, screenKey: 'why_programs_fail' },
  // Block 4: Gut-Brain (12-16)
  { block: 3, screenKey: 'gut_brain_intro' },
  { block: 3, screenKey: 'slider_stress_gut' },
  { block: 3, screenKey: 'slider_food_anxiety' },
  { block: 3, screenKey: 'slider_mood_impact' },
  { block: 3, screenKey: 'slider_thought_frequency' },
  // Block 5: Knowledge Quiz (17-20)
  { block: 4, screenKey: 'knowledge_intro' },
  { block: 4, screenKey: 'knowledge_eating_speed' },
  { block: 4, screenKey: 'knowledge_fodmap' },
  { block: 4, screenKey: 'knowledge_meal_timing' },
  // Goal Reminder 2
  { block: 4, screenKey: 'goal_reminder_2', type: 'goal_reminder' },
  // Block 6: Safety (21-24)
  { block: 5, screenKey: 'safety_intro' },
  { block: 5, screenKey: 'safety_weight_loss' },
  { block: 5, screenKey: 'safety_blood' },
  { block: 5, screenKey: 'safety_family' },
  // Block 7: Email & Final (25-28)
  { block: 6, screenKey: 'email_capture' },
  { block: 6, screenKey: 'life_impact' },
  { block: 6, screenKey: 'vision' },
  { block: 6, screenKey: 'name_collection' },
  // Loading & Results (29-30)
  { block: 6, screenKey: 'loading_sequence', type: 'loading' },
  { block: 6, screenKey: 'results_page', type: 'results' }
];

// Block mapping
const blocks = [
  quizContent.block1,
  quizContent.block2,
  quizContent.block3,
  quizContent.block4,
  quizContent.block5,
  quizContent.block6,
  quizContent.block7
];

// Section labels for each block
const SECTION_LABELS = [
  'YOUR GOALS',
  'SYMPTOMS',
  'WHY THIS WORKS',
  'GUT-BRAIN',
  'KNOWLEDGE',
  'SAFETY CHECK',
  'FINAL STEPS'
];

// Questions per section for progress calculation
const QUESTIONS_PER_SECTION = [5, 6, 1, 5, 5, 4, 5];

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

  // Track quiz start
  trackEvent('quiz_start', {
    quiz_version: 'v4',
    timestamp: state.quizStartTime.toISOString()
  });

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

  // Update block index
  state.currentBlockIndex = screenInfo.block;

  // Update section label
  updateSectionLabel();

  // Update back button
  updateBackButton();

  // Special screen types
  if (screenInfo.type === 'goal_reminder') {
    renderGoalReminder(contentEl, screenInfo.screenKey);
    return;
  }

  if (screenInfo.type === 'loading') {
    renderLoadingScreen(contentEl);
    return;
  }

  if (screenInfo.type === 'results') {
    renderResultsScreen(contentEl);
    return;
  }

  // Get screen content from blocks
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
    case 'slider':
      renderSlider(contentEl, screen);
      break;
    case 'info':
      renderInfoScreen(contentEl, screen);
      break;
    case 'knowledge_quiz':
      renderKnowledgeQuiz(contentEl, screen);
      break;
    case 'email_input':
      renderEmailInput(contentEl, screen);
      break;
    case 'text_input':
      renderTextInput(contentEl, screen);
      break;
    default:
      console.error('Unknown screen type:', screen.type);
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function updateSectionLabel() {
  if (sectionLabelEl) {
    sectionLabelEl.textContent = SECTION_LABELS[state.currentBlockIndex] || 'QUIZ';
  }
}

function updateBackButton() {
  if (backButtonEl) {
    backButtonEl.disabled = state.currentScreenIndex === 0;
  }
}

function getScreenContent(screenKey) {
  for (const block of blocks) {
    const screen = block.screens.find(s => s.id === screenKey);
    if (screen) return screen;
  }
  return null;
}

// =================================================
// SINGLE SELECT RENDERER
// =================================================
function renderSingleSelect(container, screen) {
  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      ${screen.subtitle ? `<p class="question-subtitle" style="text-align: center; color: var(--text-muted); margin-bottom: 16px;">${screen.subtitle}</p>` : ''}
      <div class="options-container">
  `;

  screen.options.forEach((option, index) => {
    html += `
      <button class="option-button" data-value="${option.value}" data-index="${index}">
        ${option.text}
      </button>
    `;
  });

  html += `
      </div>
      <div id="validationContainer"></div>
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

  // Visual feedback
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`[data-value="${value}"]`).classList.add('selected');

  // Check for validation message
  if (screen.validationMessages && screen.validationMessages[value]) {
    showValidation(screen.validationMessages[value], screen.reinforcementMessage);
  } else if (screen.reinforcementMessage && !screen.validationMessages) {
    showValidation(null, screen.reinforcementMessage);
  } else {
    // Auto-advance after delay
    setTimeout(() => advanceToNextScreen(), CONFIG.AUTO_ADVANCE_DELAY);
  }
}

function showValidation(message, reinforcement) {
  const validationContainer = document.getElementById('validationContainer');

  let html = '<div class="validation-card">';

  if (typeof message === 'object' && message.title) {
    html += `<h3 class="validation-title">${message.title}</h3>`;
    html += `<p class="validation-text">${message.message.replace(/\n/g, '<br>')}</p>`;
  } else if (message) {
    html += `<p class="validation-text">${message}</p>`;
  }

  if (reinforcement) {
    html += `<p class="validation-text mt-md"><em>${reinforcement}</em></p>`;
  }

  html += '</div>';

  // Show timeline if configured
  const screen = getScreenContent(screenOrder[state.currentScreenIndex].screenKey);
  if (screen && screen.showTimeline) {
    html += renderTimelineGraphic();
  }

  html += `
    <button class="btn btn-primary mt-lg" id="continueBtn">Continue</button>
  `;

  validationContainer.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

function renderTimelineGraphic() {
  return `
    <div class="timeline-graphic">
      <div class="timeline-bar">
        <div class="timeline-segment"></div>
        <div class="timeline-segment"></div>
        <div class="timeline-segment"></div>
      </div>
      <div class="timeline-labels">
        <div class="timeline-label">
          <div class="timeline-label-week">Week 1-2</div>
          <div class="timeline-label-text">First improvements<br>(bloating reduces, more predictable)</div>
        </div>
        <div class="timeline-label">
          <div class="timeline-label-week">Week 3-4</div>
          <div class="timeline-label-text">Patterns emerge<br>(you know your triggers)</div>
        </div>
        <div class="timeline-label">
          <div class="timeline-label-week">Month 2-3</div>
          <div class="timeline-label-text">Real control<br>(symptoms are the exception)</div>
        </div>
      </div>
    </div>
  `;
}

// =================================================
// MULTI SELECT RENDERER
// =================================================
function renderMultiSelect(container, screen) {
  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      <div class="options-container">
  `;

  screen.options.forEach((option, index) => {
    html += `
      <button class="option-button multi-select" data-value="${option.value}" data-index="${index}">
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

      // Handle "nothing" option
      if (value === 'nothing') {
        // Deselect all others
        selectedValues.length = 0;
        container.querySelectorAll('.option-button.multi-select').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedValues.push(value);
      } else {
        // Remove "nothing" if selecting something else
        const nothingIndex = selectedValues.indexOf('nothing');
        if (nothingIndex > -1) {
          selectedValues.splice(nothingIndex, 1);
          container.querySelector('[data-value="nothing"]')?.classList.remove('selected');
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

  // Continue button - show validation modal then advance
  document.getElementById('continueBtn').addEventListener('click', () => {
    state.answers[screen.storeAs] = selectedValues;

    // Store treatments count
    if (screen.storeAs === 'treatments_tried') {
      state.treatmentsTried = selectedValues;
    }

    // Track answer
    trackAnswer(screen, selectedValues, selectedValues.join(', '));

    // Check for SIBO in diagnoses
    if (screen.storeAs === 'diagnoses' && selectedValues.includes('sibo')) {
      // May influence protocol
    }

    // Show validation modal for multi-select
    const validationMessage = getMultiSelectValidation(screen, selectedValues);
    if (validationMessage) {
      showValidationModal(validationMessage, screen.reinforcementMessage, advanceToNextScreen);
    } else {
      advanceToNextScreen();
    }
  });
}

function getMultiSelectValidation(screen, selectedValues) {
  const count = selectedValues.length;

  if (!screen.validationMessages) return null;

  let message = '';

  if (count <= 1) {
    message = screen.validationMessages.range_0_1;
  } else if (count <= 3) {
    message = screen.validationMessages.range_2_3;
  } else if (count <= 5) {
    message = screen.validationMessages.range_4_5;
  } else {
    message = screen.validationMessages.range_6_plus?.replace('{count}', count);
  }

  // Special validation for specific selections
  if (screen.specialValidation) {
    for (const [key, msg] of Object.entries(screen.specialValidation)) {
      if (selectedValues.includes(key)) {
        message = msg;
        break;
      }
    }
  }

  return message || null;
}

function showValidationModal(message, reinforcement, onContinue) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'validation-modal-overlay';
  modal.innerHTML = `
    <div class="validation-modal">
      <div class="validation-modal-content">
        <p class="validation-text">${message}</p>
        ${reinforcement ? `<p class="validation-text reinforcement"><em>${reinforcement}</em></p>` : ''}
      </div>
      <button class="btn-primary" id="modalContinueBtn">Continue</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });

  // Continue button closes modal and advances
  modal.querySelector('#modalContinueBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      onContinue();
    }, 200);
  });
}

// =================================================
// SLIDER RENDERER
// =================================================
function renderSlider(container, screen) {
  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      <div class="slider-container">
        <div class="slider-labels">
          <span class="slider-label">${screen.leftAnchor}</span>
          <span class="slider-label">${screen.rightAnchor}</span>
        </div>
        <div class="slider-track-container">
          <input type="range" class="slider-input" id="sliderInput"
            min="${screen.min}" max="${screen.max}" value="3" step="1">
          <div class="slider-track">
            <div class="slider-fill" id="sliderFill"></div>
            <div class="slider-thumb" id="sliderThumb"></div>
          </div>
        </div>
        <div class="slider-points">
          ${[1,2,3,4,5].map(n => `<div class="slider-point" data-value="${n}">${n}</div>`).join('')}
        </div>
      </div>
      <div id="validationContainer"></div>
      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  const slider = document.getElementById('sliderInput');
  const fill = document.getElementById('sliderFill');
  const thumb = document.getElementById('sliderThumb');
  const points = document.querySelectorAll('.slider-point');

  function updateSlider(value) {
    const percent = ((value - screen.min) / (screen.max - screen.min)) * 100;
    fill.style.width = percent + '%';
    thumb.style.left = percent + '%';

    points.forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.value) === parseInt(value));
    });

    // Show conditional validation for high scores
    if (screen.conditionalValidation && parseInt(value) >= screen.conditionalValidation.threshold) {
      showSliderValidation(screen.conditionalValidation);
    } else {
      document.getElementById('validationContainer').innerHTML = '';
    }
  }

  slider.addEventListener('input', (e) => updateSlider(e.target.value));

  points.forEach(point => {
    point.addEventListener('click', () => {
      slider.value = point.dataset.value;
      updateSlider(point.dataset.value);
    });
  });

  // Initialize
  updateSlider(3);

  // Continue button
  document.getElementById('continueBtn').addEventListener('click', () => {
    const value = parseInt(slider.value);
    state.answers[screen.storeAs] = value;

    // Track answer
    trackAnswer(screen, value, value.toString());

    // Calculate gut-brain score after last slider
    if (screen.isLastSlider) {
      calculateGutBrainScore();
    }

    advanceToNextScreen();
  });
}

function showSliderValidation(validation) {
  const validationContainer = document.getElementById('validationContainer');
  validationContainer.innerHTML = `
    <div class="validation-card">
      <h3 class="validation-title">${validation.title}</h3>
      <p class="validation-text">${validation.message.replace(/\n/g, '<br>')}</p>
    </div>
  `;
}

function calculateGutBrainScore() {
  const scores = [
    state.answers.stress_gut_score || 3,
    state.answers.food_anxiety_score || 3,
    state.answers.mood_impact_score || 3,
    state.answers.thought_frequency_score || 3
  ];

  state.gutBrainScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  state.hasGutBrainOverlay = state.gutBrainScore >= 3.5;
}

// =================================================
// INFO SCREEN RENDERER
// =================================================
function renderInfoScreen(container, screen) {
  let html = `
    <div class="question-container info-screen">
      <h2 class="question-text">${screen.headline}</h2>
  `;

  // Add image if specified
  if (screen.image) {
    html += `
      <div class="info-image-container">
        <img src="${screen.image}" alt="${screen.imageAlt || ''}" class="info-image" onerror="this.style.display='none'">
      </div>
    `;
  }

  if (screen.body) {
    html += `<p class="info-body">${screen.body.replace(/\n/g, '<br>')}</p>`;
  }

  if (screen.comparison) {
    html += `
      <div class="comparison-container">
        <div class="comparison-card problem">
          <div class="comparison-title">${screen.comparison.problem.title}</div>
          <div class="comparison-text">${screen.comparison.problem.text}</div>
        </div>
        <div class="comparison-card solution">
          <div class="comparison-title">${screen.comparison.solution.title}</div>
          <div class="comparison-text">${screen.comparison.solution.text}</div>
        </div>
      </div>
    `;
  }

  if (screen.statistic) {
    html += `
      <div class="stat-box">
        <div class="stat-number">${screen.statistic.number}</div>
        <div class="stat-label">${screen.statistic.label}</div>
        <div class="stat-label">${screen.statistic.subtext}</div>
      </div>
    `;
  }

  html += `
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
    </div>
  `;

  container.innerHTML = html;

  // Track info screen view
  trackEvent('quiz_info_screen', {
    quiz_version: 'v4',
    screen_id: screen.id,
    screen_type: 'info'
  });

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// KNOWLEDGE QUIZ RENDERER
// =================================================
function renderKnowledgeQuiz(container, screen) {
  if (state.showingFeedback) {
    renderKnowledgeFeedback(container, screen);
    return;
  }

  const hasIcons = screen.options.some(opt => opt.icon);

  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      <div class="options-container">
  `;

  screen.options.forEach((option, index) => {
    if (hasIcons) {
      html += `
        <button class="option-button" data-value="${option.value}" data-correct="${option.correct}" data-index="${index}">
          <div class="option-icon">${option.icon}</div>
          <span>${option.text}</span>
        </button>
      `;
    } else {
      html += `
        <button class="option-button" data-value="${option.value}" data-correct="${option.correct}" data-index="${index}">
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

  // Update knowledge score
  if (isCorrect) {
    state.knowledgeScore++;
  }

  // Track answer
  trackAnswer(screen, value, value, isCorrect);

  // Show feedback
  state.showingFeedback = true;
  state.currentFeedbackCorrect = isCorrect;
  renderKnowledgeFeedback(contentEl, screen);
}

function renderKnowledgeFeedback(container, screen) {
  const isCorrect = state.currentFeedbackCorrect;
  const feedback = isCorrect ? screen.feedback.correct : screen.feedback.incorrect;

  let html = `
    <div class="question-container feedback-screen">
      <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-icon">${feedback.icon}</div>
        <h2 class="feedback-title">${feedback.title}</h2>
        <p class="feedback-text">${feedback.text.replace(/\n/g, '<br>')}</p>
  `;

  if (feedback.tip) {
    if (typeof feedback.tip === 'object' && feedback.tip.items) {
      html += `
        <div class="feedback-tip">
          <div class="feedback-tip-title">${feedback.tip.title}</div>
          <ul class="gut-response-list">
            ${feedback.tip.items.map(item => `<li class="${item.color}">${item.text}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      html += `
        <div class="feedback-tip">
          <p class="validation-text">${feedback.tip.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }
  }

  html += `
      </div>
      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  document.getElementById('continueBtn').addEventListener('click', () => {
    state.showingFeedback = false;
    state.currentFeedbackCorrect = null;
    advanceToNextScreen();
  });
}

// =================================================
// EMAIL INPUT RENDERER
// =================================================
function renderEmailInput(container, screen) {
  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.headline}</h2>
      ${screen.subtitle ? `<p class="question-subtitle">${screen.subtitle}</p>` : ''}
      <div class="input-container">
        <input type="email" class="email-input" id="emailInput"
          placeholder="${screen.placeholder}" autocomplete="email">
        <p class="input-error hidden" id="emailError">Please enter a valid email address</p>
      </div>
      <button class="btn-primary" id="continueBtn">${screen.buttonText}</button>
      <p class="privacy-text">${screen.privacyText}</p>
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

    // Track email capture
    trackEvent('quiz_email_submit', {
      quiz_version: 'v4',
      screen_number: screen.screenNumber
    });

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
// TEXT INPUT RENDERER
// =================================================
function renderTextInput(container, screen) {
  const goalText = quizContent.goalTexts[state.answers.user_goal] || '';
  const hint = screen.hint ? screen.hint.replace('{goal}', goalText) : '';

  let html = `
    <div class="question-container">
      <h2 class="question-text">${screen.question}</h2>
      ${screen.subtitle ? `<p class="question-subtitle">${screen.subtitle}</p>` : ''}
      <div class="input-container">
  `;

  if (screen.storeAs === 'user_vision') {
    html += `
      <textarea class="textarea-input" id="textInput"
        placeholder="${screen.placeholder}" rows="4"></textarea>
      ${hint ? `<p class="input-hint">${hint}</p>` : ''}
    `;
  } else {
    html += `
      <input type="text" class="text-input" id="textInput"
        placeholder="${screen.placeholder}" autocomplete="given-name">
    `;
  }

  html += `
      </div>
      <div id="validationContainer"></div>
      <button class="btn-primary" id="continueBtn">${screen.buttonText || 'Continue'}</button>
  `;

  if (screen.optional) {
    html += `<button class="btn-skip" id="skipBtn">${screen.skipText}</button>`;
  }

  html += `</div>`;

  container.innerHTML = html;

  const textInput = document.getElementById('textInput');
  const continueBtn = document.getElementById('continueBtn');

  continueBtn.addEventListener('click', () => {
    const value = textInput.value.trim();

    if (!screen.optional && !value) {
      textInput.focus();
      return;
    }

    // Store value
    if (screen.storeAs === 'user_name') {
      state.userData.name = value || 'Friend';
      state.answers.user_name = value;
    } else {
      state.answers[screen.storeAs] = value;
    }

    // Track answer
    trackAnswer(screen, value, value);

    // Show validation message if exists
    if (value && screen.validationMessage) {
      const validationContainer = document.getElementById('validationContainer');
      validationContainer.innerHTML = `
        <div class="validation-card">
          <p class="validation-text">${screen.validationMessage.replace(/\n/g, '<br>')}</p>
        </div>
      `;

      continueBtn.textContent = 'Continue';
      continueBtn.removeEventListener('click', arguments.callee);
      continueBtn.addEventListener('click', advanceToNextScreen);
    } else {
      advanceToNextScreen();
    }
  });

  // Skip button
  if (screen.optional) {
    document.getElementById('skipBtn').addEventListener('click', () => {
      state.answers[screen.storeAs] = '';
      advanceToNextScreen();
    });
  }

  // Allow enter key for name field
  if (screen.storeAs === 'user_name') {
    textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        continueBtn.click();
      }
    });
  }
}

// =================================================
// GOAL REMINDER / JOURNEY MAP RENDERER
// =================================================
function renderGoalReminder(container, reminderKey) {
  const reminder = reminderKey === 'goal_reminder_1' ? quizContent.goalReminder1 : quizContent.goalReminder2;
  const goalText = quizContent.goalTexts[state.answers.user_goal] || 'feel better';
  const name = state.userData.name || 'friend';

  // Check if this is a journey map type (first reminder)
  if (reminder.type === 'journey_map') {
    renderJourneyMap(container, reminder, goalText);
    return;
  }

  let message = reminder.template
    .replace('{goal}', goalText)
    .replace('{name}', name);

  const html = `
    <div class="question-container">
      <div class="goal-reminder">
        <div class="goal-reminder-icon">🎯</div>
        <h2 class="goal-reminder-title">Remember your goal</h2>
        <p class="goal-reminder-text">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  // Track goal reminder
  trackEvent('quiz_goal_reminder', {
    quiz_version: 'v4',
    reminder_number: reminder.reminderNumber,
    user_goal: state.answers.user_goal
  });

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// JOURNEY MAP RENDERER - "Your Path Forward"
// =================================================
function renderJourneyMap(container, reminder, goalText) {
  const treatments = state.treatmentsTried || [];
  const treatmentLabels = treatments
    .filter(t => t !== 'nothing')
    .slice(0, 4) // Show max 4 treatments
    .map(t => quizContent.treatmentLabels[t] || t);

  const hasTriedThings = treatmentLabels.length > 0;

  let html = `
    <div class="question-container journey-map-screen">
      <h2 class="question-text">${reminder.headline}</h2>

      <!-- Goal Statement -->
      <div class="journey-goal-statement">
        <span class="journey-goal-icon">🎯</span>
        <span>${reminder.template.replace('{goal}', goalText)}</span>
      </div>

      <!-- Journey Timeline -->
      <div class="journey-timeline">
        <!-- PAST -->
        <div class="journey-phase past">
          <div class="journey-phase-label">WHAT YOU'VE TRIED</div>
          <div class="journey-phase-content">
            ${hasTriedThings ? `
              <div class="journey-tried-items">
                ${treatmentLabels.map(t => `<span class="journey-tried-item">${t}</span>`).join('')}
                ${treatments.length > 4 ? `<span class="journey-tried-more">+${treatments.length - 4} more</span>` : ''}
              </div>
              <p class="journey-phase-note">These can work — they just needed the right sequence.</p>
            ` : `
              <p class="journey-phase-note">Starting fresh gives us a clear baseline.</p>
            `}
          </div>
        </div>

        <!-- Arrow -->
        <div class="journey-arrow">→</div>

        <!-- NOW -->
        <div class="journey-phase now">
          <div class="journey-phase-label">THE MISSING PIECE</div>
          <div class="journey-phase-content">
            <div class="journey-missing-piece">
              <span class="journey-piece-icon">📊</span>
              <span>Tracking + Practitioner Reviews</span>
            </div>
            <p class="journey-phase-note">Someone who adjusts based on YOUR response.</p>
          </div>
        </div>

        <!-- Arrow -->
        <div class="journey-arrow">→</div>

        <!-- FUTURE -->
        <div class="journey-phase future">
          <div class="journey-phase-label">YOUR GOAL</div>
          <div class="journey-phase-content">
            <div class="journey-goal-destination">
              <span class="journey-goal-icon-large">✨</span>
              <span>${goalText}</span>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary" id="continueBtn">Continue</button>
    </div>
  `;

  container.innerHTML = html;

  // Track journey map view
  trackEvent('quiz_journey_map', {
    quiz_version: 'v4',
    treatments_tried_count: treatments.length,
    user_goal: state.answers.user_goal
  });

  document.getElementById('continueBtn').addEventListener('click', advanceToNextScreen);
}

// =================================================
// LOADING SCREEN RENDERER
// =================================================
function renderLoadingScreen(container) {
  const loading = quizContent.loadingSequence;

  let html = `
    <div class="question-container loading-screen">
      <h2 class="question-text">${loading.headline}</h2>
      <div class="loading-progress-list">
  `;

  loading.steps.forEach((step, index) => {
    html += `
      <div class="loading-item" id="loadingItem${index}">
        <span class="loading-item-text">${step.text}</span>
        <div class="loading-bar">
          <div class="loading-bar-fill" id="loadingFill${index}"></div>
        </div>
        <div class="loading-item-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <div id="loadingPopupContainer"></div>
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
  startLoadingAnimation();
}

async function startLoadingAnimation() {
  const loading = quizContent.loadingSequence;
  const totalDuration = loading.steps.reduce((sum, step) => sum + step.duration, 0);
  let elapsedDuration = 0;

  for (let i = 0; i < loading.steps.length; i++) {
    const step = loading.steps[i];
    const item = document.getElementById(`loadingItem${i}`);
    const fill = document.getElementById(`loadingFill${i}`);

    if (!item || !fill) continue;

    item.classList.add('active');

    // Check for popup questions
    const currentPercent = (elapsedDuration / totalDuration) * 100;
    const popupQuestion = loading.popupQuestions.find(q =>
      q.triggerAtPercent <= currentPercent + 10 &&
      state.loadingPopupIndex <= loading.popupQuestions.indexOf(q)
    );

    if (popupQuestion && !state.answers[popupQuestion.storeAs]) {
      await showLoadingPopup(popupQuestion);
    }

    // Animate progress bar
    await animateProgressBar(fill, step.duration);

    item.classList.remove('active');
    item.classList.add('completed');

    elapsedDuration += step.duration;
  }

  // Show completion message
  setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      const completionDiv = document.createElement('div');
      completionDiv.className = 'validation-card';
      completionDiv.innerHTML = `<p class="validation-text">${quizContent.loadingSequence.completionMessage}</p>`;
      loadingScreen.appendChild(completionDiv);
    }

    // Submit final data
    submitFinalData();

    // Auto-advance after brief delay
    setTimeout(advanceToNextScreen, 1500);
  }, 500);
}

function animateProgressBar(fill, duration) {
  return new Promise(resolve => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: fast start, slow middle, fast end
      let easedProgress;
      if (progress < 0.2) {
        easedProgress = progress * 3; // Fast 0-60%
      } else if (progress < 0.8) {
        easedProgress = 0.6 + (progress - 0.2) * 0.5; // Slow 60-90%
      } else {
        easedProgress = 0.9 + (progress - 0.8) * 0.5; // Fast finish 90-100%
      }

      fill.style.width = Math.min(easedProgress * 100, 100) + '%';

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
      <div class="loading-popup">
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
  if (state.hasRedFlags) {
    renderRedFlagResults(container);
    return;
  }

  renderNormalResults(container);
}

function renderNormalResults(container) {
  const protocol = quizContent.protocols[state.calculatedProtocol];
  const practitioner = quizContent.practitioners.rebecca;
  const goalText = quizContent.goalTexts[state.answers.user_goal] || 'feel better';
  const name = state.userData.name || 'Friend';

  // Determine gut-brain level
  let gutBrainLevel = 'minor';
  if (state.gutBrainScore >= 4) gutBrainLevel = 'significant';
  else if (state.gutBrainScore >= 3) gutBrainLevel = 'moderate';

  // Build frequency insight
  const frequencyInsights = {
    daily: "That level of consistency actually helps us - it means patterns should be visible quickly.",
    several_weekly: "We'll identify your specific triggers.",
    weekly: "Your patterns may be tied to weekly habits - diet, stress cycles, or routines.",
    monthly: "Monthly patterns often point to hormonal or longer-term dietary triggers."
  };

  const frequencyInsight = frequencyInsights[state.answers.symptom_frequency] || '';

  let html = `
    <div class="question-container results-screen">
      <!-- Header -->
      <div class="results-header">
        <p class="results-greeting">${name}, your protocol is ready.</p>
      </div>

      <!-- Protocol Card -->
      <div class="protocol-card">
        <div class="protocol-label">YOUR RECOMMENDED PROTOCOL</div>
        <h2 class="protocol-name">${protocol.name}</h2>
        ${state.hasGutBrainOverlay ? `<span class="protocol-overlay">${quizContent.nervousSystemOverlay.name}</span>` : ''}
        <p class="protocol-description">Based on your symptom pattern, gut history, and the ${state.treatmentsTried.length} approaches you've already tried, this is your highest-probability path to relief.</p>
      </div>

      <!-- Analysis Card -->
      <div class="analysis-card">
        <h3 class="analysis-title">Here's what stood out in your responses:</h3>
        <ul class="analysis-list">
          <li class="analysis-item">You've been dealing with ${quizContent.complaintLabels[state.answers.primary_complaint] || 'gut issues'} for ${quizContent.durationLabels[state.answers.symptom_duration] || 'some time'}</li>
          <li class="analysis-item">Your symptoms are ${state.answers.symptom_frequency} — ${frequencyInsight}</li>
          <li class="analysis-item">You've tried ${state.treatmentsTried.length} different approaches — which tells us what hasn't worked</li>
          <li class="analysis-item">Your gut-brain score of ${state.gutBrainScore.toFixed(1)}/5 suggests stress is a ${gutBrainLevel} factor${state.hasGutBrainOverlay ? " — that's why we're adding Nervous System Support" : ''}</li>
        </ul>

        <!-- Practitioner Quote -->
        <div class="practitioner-quote">
          <img src="${practitioner.photo}" alt="${practitioner.name}" class="practitioner-photo">
          <div class="practitioner-content">
            <p class="practitioner-text">"${practitioner.quote}"</p>
            <p class="practitioner-name">— ${practitioner.name}, ${practitioner.credentials}</p>
            <p class="practitioner-title">${practitioner.title}</p>
          </div>
        </div>
      </div>

      <!-- Why Different Section -->
      <div class="difference-section">
        <h3 class="difference-title">WHY THIS TIME IS DIFFERENT</h3>
        <div class="difference-comparison">
          <div class="difference-item before">
            <span class="difference-icon">❌</span>
            <span class="difference-text">Before: Try diet → No feedback → Give up or plateau</span>
          </div>
          <div class="difference-item after">
            <span class="difference-icon">✓</span>
            <span class="difference-text">Now: Personalized protocol → Daily tracking → Practitioner reviews → Adjustments → Progress</span>
          </div>
        </div>

        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">📋</span>
            <div class="feature-content">
              <div class="feature-title">Your Protocol</div>
              <div class="feature-desc">${protocol.name}, customized to your symptom pattern</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div class="feature-content">
              <div class="feature-title">Daily Tracking</div>
              <div class="feature-desc">3 minutes/day to log symptoms (this is how we spot what's working)</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👩‍⚕️</span>
            <div class="feature-content">
              <div class="feature-title">Practitioner Access</div>
              <div class="feature-desc">Ask questions, get protocol adjustments, never feel stuck</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📈</span>
            <div class="feature-content">
              <div class="feature-title">Progress Reviews</div>
              <div class="feature-desc">We look at your data and tell you what to change</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="timeline-section">
        <h3 class="timeline-header">YOUR PATH TO ${goalText.toUpperCase()}</h3>
        <p class="timeline-expectation">Here's what to expect:</p>

        <div class="timeline-steps">
          <div class="timeline-step">
            <div class="timeline-step-marker">
              <div class="timeline-step-dot"></div>
              <div class="timeline-step-line"></div>
            </div>
            <div class="timeline-step-content">
              <div class="timeline-step-week">Week 1-2</div>
              <div class="timeline-step-desc">${protocol.weekOneResult}</div>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-step-marker">
              <div class="timeline-step-dot"></div>
              <div class="timeline-step-line"></div>
            </div>
            <div class="timeline-step-content">
              <div class="timeline-step-week">Week 3-4</div>
              <div class="timeline-step-desc">You'll know your triggers — your personal Green/Yellow/Red food list takes shape</div>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-step-marker">
              <div class="timeline-step-dot"></div>
            </div>
            <div class="timeline-step-content">
              <div class="timeline-step-week">Month 2-3</div>
              <div class="timeline-step-desc">Real, lasting control — symptoms become the exception, not the rule</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <p class="cta-message">${name}, you've already taken the hardest step — getting clear on what you're dealing with.</p>
        <button class="btn btn-coral" id="ctaBtn">START MY $1 TRIAL</button>
        <div class="member-count">
          <span class="member-count-dot"></span>
          <span>Join ${quizContent.memberCount} women who are finally getting answers</span>
        </div>
        <p class="cta-subtext">Questions? Message our team anytime.</p>
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

function renderRedFlagResults(container) {
  const practitioner = quizContent.practitioners.rebecca;
  const name = state.userData.name || 'Friend';

  // Get red flag messages
  const flagMessages = state.redFlags.map(flag =>
    quizContent.redFlagMessages[flag.field] || flag.field
  );

  let html = `
    <div class="question-container red-flag-screen">
      <img src="${practitioner.photo}" alt="${practitioner.name}" class="red-flag-photo">

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

      <div class="red-flag-followup mt-xl">
        <div class="red-flag-followup-title">Want us to follow up?</div>
        <p class="validation-text">Enter your email and we'll send you a checklist of questions to ask your doctor, plus follow up in 30 days to see if you're ready to start.</p>
        ${!state.emailCaptured ? `
          <div class="input-container mt-md">
            <input type="email" class="email-input" id="followupEmail" placeholder="your@email.com">
          </div>
          <button class="btn btn-primary mt-md" id="sendChecklistBtn">Send Me the Checklist</button>
        ` : `
          <p class="validation-text mt-md">We'll follow up at ${state.userData.email}</p>
        `}
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Track red flag results
  state.quizCompleted = true;
  trackQuizComplete();

  // Handle follow-up email
  if (!state.emailCaptured) {
    document.getElementById('sendChecklistBtn')?.addEventListener('click', () => {
      const email = document.getElementById('followupEmail').value.trim();
      if (isValidEmail(email)) {
        state.userData.email = email;
        state.emailCaptured = true;
        submitFinalData();

        document.querySelector('.red-flag-followup').innerHTML = `
          <p class="validation-text">✓ We'll send your checklist and follow up at ${email}</p>
        `;
      }
    });
  }
}

// =================================================
// PROTOCOL CALCULATION
// =================================================
function calculateProtocol() {
  const answers = state.answers;
  const diagnoses = answers.diagnoses || [];
  const treatments = state.treatmentsTried || [];

  // Priority 1: Post-SIBO (requires both diagnosis AND treatment)
  if (diagnoses.includes('sibo') && treatments.includes('sibo_antibiotics')) {
    state.calculatedProtocol = 'rebuild';
    return;
  }

  // Priority 2: Primary complaint mapping
  const complaint = answers.primary_complaint;

  const protocolMap = {
    'bloating': 'bloat_reset',
    'gas': 'bloat_reset',
    'pain': 'bloat_reset',
    'constipation': 'regularity',
    'diarrhea': 'calm_gut',
    'mixed': 'stability'
  };

  // Check for alternating stool pattern
  if (answers.stool_changes === 'alternates') {
    state.calculatedProtocol = 'stability';
    return;
  }

  // Handle pain with sub-logic
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
  state.history.push({
    screenIndex: state.currentScreenIndex,
    blockIndex: state.currentBlockIndex
  });

  // Move to next screen
  state.currentScreenIndex++;

  // Update block index
  if (state.currentScreenIndex < screenOrder.length) {
    state.currentBlockIndex = screenOrder[state.currentScreenIndex].block;
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

  // Reset feedback state
  state.showingFeedback = false;
  state.currentFeedbackCorrect = null;

  const prev = state.history.pop();
  state.currentScreenIndex = prev.screenIndex;
  state.currentBlockIndex = prev.blockIndex;

  renderCurrentScreen();
  updateProgressBar();
}

// =================================================
// PROGRESS BAR
// =================================================
function updateProgressBar() {
  const segments = document.querySelectorAll('.progress-segment');
  const dots = document.querySelectorAll('.progress-dot');

  // Calculate progress within current section
  let questionsBeforeCurrentSection = 0;
  for (let i = 0; i < state.currentBlockIndex; i++) {
    questionsBeforeCurrentSection += QUESTIONS_PER_SECTION[i];
  }
  const currentQuestionInSection = state.currentScreenIndex - questionsBeforeCurrentSection;
  const questionsInCurrentSection = QUESTIONS_PER_SECTION[state.currentBlockIndex] || 1;
  const progressInSection = Math.min(currentQuestionInSection / questionsInCurrentSection, 1);

  segments.forEach((segment, index) => {
    const fill = segment.querySelector('.segment-fill');
    segment.classList.remove('completed', 'current');

    if (index < state.currentBlockIndex) {
      // Completed sections
      segment.classList.add('completed');
      if (fill) fill.style.width = '100%';
    } else if (index === state.currentBlockIndex) {
      // Current section - show partial fill
      segment.classList.add('current');
      if (fill) fill.style.width = (progressInSection * 100) + '%';
    } else {
      // Future sections
      if (fill) fill.style.width = '0%';
    }
  });

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    if (index < state.currentBlockIndex) {
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

    // Goal info
    goal_selection: state.answers.user_goal || null,
    journey_stage: null, // Not in v4

    // Protocol
    protocol: state.calculatedProtocol ? protocolNumbers[state.calculatedProtocol] : null,
    protocol_name: state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : null,
    has_stress_component: state.hasGutBrainOverlay || false,

    // Red flags
    has_red_flags: state.hasRedFlags || false,
    red_flag_evaluated_cleared: false,
    red_flag_details: state.hasRedFlags ? { flags: state.redFlags } : null,

    // Questions
    primary_complaint: state.answers.primary_complaint || null,
    symptom_frequency: state.answers.symptom_frequency || null,
    relief_after_bm: state.answers.bm_relief || null,
    frequency_during_flare: state.answers.flare_frequency || null,
    stool_during_flare: state.answers.stool_changes || null,
    duration: state.answers.symptom_duration || null,
    diagnoses: state.answers.diagnoses || [],
    treatments_tried: state.treatmentsTried || [],
    stress_connection: state.gutBrainScore >= 4 ? 'significant' : (state.gutBrainScore >= 3 ? 'some' : 'none'),
    mental_health_impact: state.answers.mood_impact_score >= 4 ? 'yes' : (state.answers.mood_impact_score >= 3 ? 'sometimes' : 'no'),
    sleep_quality: null,
    life_impact_level: state.answers.life_impact || null,
    hardest_part: null,
    dream_outcome: state.answers.user_vision || null,

    // Quiz-4 specific fields (new)
    user_timeline: state.answers.user_timeline || null,
    knowledge_score: state.knowledgeScore || 0,
    gut_brain_score: state.gutBrainScore || null,
    slider_stress_gut: state.answers.stress_gut_score || null,
    slider_food_anxiety: state.answers.food_anxiety_score || null,
    slider_mood_impact: state.answers.mood_impact_score || null,
    slider_thought_frequency: state.answers.thought_frequency_score || null,
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

    goal_selection: state.answers.user_goal || '',
    journey_stage: '',

    // Safety questions
    q1_weight_loss: state.answers.safety_weight_loss || '',
    q2_blood: state.answers.safety_blood || '',
    q3_family_history: state.answers.safety_family || '',
    q4_colonoscopy: '',

    // Quiz questions
    q5_primary_complaint: state.answers.primary_complaint || '',
    q6_frequency: state.answers.symptom_frequency || '',
    q7_bm_relief: state.answers.bm_relief || '',
    q8_frequency_change: state.answers.flare_frequency || '',
    q9_stool_change: state.answers.stool_changes || '',
    q10_duration: state.answers.symptom_duration || '',
    q11_diagnosis: (state.answers.diagnoses || []).join(','),
    q12_tried: (state.treatmentsTried || []).join(','),
    q13_stress: state.gutBrainScore >= 4 ? 'significant' : (state.gutBrainScore >= 3 ? 'some' : 'none'),
    q14_mental_health: state.answers.mood_impact_score >= 4 ? 'yes' : 'no',
    q15_sleep: '',
    q16_life_impact: state.answers.life_impact || '',
    q17_hardest_part: '',
    q18_vision: state.answers.user_vision || '',

    // Red flags
    had_red_flags: state.hasRedFlags || false,
    red_flag_evaluated_cleared: false,

    // Quiz-4 specific fields (new)
    user_timeline: state.answers.user_timeline || '',
    knowledge_score: state.knowledgeScore || 0,
    gut_brain_score: state.gutBrainScore ? state.gutBrainScore.toFixed(2) : '',
    slider_stress_gut: state.answers.stress_gut_score || '',
    slider_food_anxiety: state.answers.food_anxiety_score || '',
    slider_mood_impact: state.answers.mood_impact_score || '',
    slider_thought_frequency: state.answers.thought_frequency_score || '',
    symptom_timing: state.answers.symptom_timing || '',
    symptom_trigger_timing: state.answers.symptom_trigger_timing || '',
    knowledge_q1_correct: state.answers.knowledge_q1_correct ? 'true' : 'false',
    knowledge_q2_correct: state.answers.knowledge_q2_correct ? 'true' : 'false',
    knowledge_q3_correct: state.answers.knowledge_q3_correct ? 'true' : 'false',

    // Tracking
    source: CONFIG.SOURCE_TRACKING,
    submission_type: eventType,
    submitted_at: new Date().toISOString()
  };

  try {
    // Send as form-encoded data
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
  const params = new URLSearchParams();

  // Standard params
  params.set('source', CONFIG.SOURCE_TRACKING);
  params.set('name', state.userData.name || '');
  params.set('email', state.userData.email || '');

  // Protocol info
  params.set('protocol', state.calculatedProtocol || '');
  params.set('protocol_name', state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : '');
  params.set('gut_brain', state.hasGutBrainOverlay ? 'true' : 'false');

  // Goal
  if (state.answers.user_goal) {
    params.set('goal_selection', state.answers.user_goal);
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
  }

  // Stress level
  params.set('stress_level', state.gutBrainScore >= 4 ? 'significant' : (state.gutBrainScore >= 3 ? 'some' : 'none'));

  // Life impact
  if (state.answers.life_impact) {
    params.set('life_impact', state.answers.life_impact);
  }

  // Vision
  if (state.answers.user_vision) {
    params.set('vision', encodeURIComponent(state.answers.user_vision.substring(0, 200)));
  }

  window.location.href = `${CONFIG.OFFER_URL}?${params.toString()}`;
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

function trackScreenView(screen) {
  const timeOnPrevious = state.screenStartTime ?
    Math.round((new Date() - state.screenStartTime) / 1000) : 0;

  trackEvent('quiz_screen_view', {
    quiz_version: 'v4',
    screen_number: screen.screenNumber || state.currentScreenIndex + 1,
    screen_id: screen.id,
    screen_name: screen.question || screen.headline || screen.id,
    block_id: screenOrder[state.currentScreenIndex]?.block || 0,
    block_number: state.currentBlockIndex + 1,
    time_on_previous_screen_seconds: timeOnPrevious
  });
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
}

function trackQuizComplete() {
  const totalTime = state.quizStartTime ?
    Math.round((new Date() - state.quizStartTime) / 1000) : 0;

  trackEvent('quiz_complete', {
    quiz_version: 'v4',
    total_time_seconds: totalTime,
    total_screens_viewed: state.totalScreensViewed,
    protocol_assigned: state.calculatedProtocol,
    has_red_flags: state.hasRedFlags,
    user_goal: state.answers.user_goal,
    user_timeline: state.answers.user_timeline,
    primary_complaint: state.answers.primary_complaint,
    duration: state.answers.symptom_duration,
    treatments_tried_count: state.treatmentsTried.length,
    knowledge_score: state.knowledgeScore,
    gut_brain_score: state.gutBrainScore
  });

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
  }
}
