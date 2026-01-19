// Survey-Style Quiz Application 2.0
// Complete quiz funnel with interstitials, practitioner intros, and testimonials

// Configuration
const CONFIG = {
  OFFER_URL: '/offer/',
  SOURCE_TRACKING: 'quiz-2',
  LOADING_DURATION: 5500, // 5.5 seconds for loading animation
  AUTO_ADVANCE_DELAY: 400, // ms after single-select
  LOADING_MESSAGE_INTERVAL: 1500, // ms between loading messages
  TEXT_MIN_CHARS: 10, // Minimum characters for text input
  // Make.com webhook URL
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
  // Supabase configuration
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E'
};

// Encouragement messages for text input
const ENCOURAGEMENT = {
  keepGoing: [
    { emoji: '✍️', text: 'Keep going...' },
    { emoji: '💭', text: 'Keep going...' },
    { emoji: '📝', text: 'Keep going...' },
    { emoji: '💬', text: 'Keep going...' },
    { emoji: '✨', text: 'Keep going...' }
  ],
  success: [
    { emoji: '💚', text: 'Perfect! Thank you for sharing' },
    { emoji: '🌟', text: 'Great insight!' },
    { emoji: '✅', text: 'That helps us understand you better' },
    { emoji: '💪', text: 'Wonderful, keep going if you\'d like' },
    { emoji: '🙌', text: 'Thanks for being open with us' }
  ]
};

// Initialize Supabase client
var supabaseClient = null;
if (typeof window.supabase !== 'undefined' && CONFIG.SUPABASE_URL) {
  supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}

// Questions per section for progress calculation
const QUESTIONS_PER_SECTION = [4, 5, 3, 3, 3]; // Safety, Symptoms, History, GutBrain, Impact

// Application State
const state = {
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  userData: {
    name: '',
    email: ''
  },
  hasRedFlags: false,
  redFlagsBypassed: false,
  calculatedProtocol: null,
  hasGutBrainOverlay: false,
  history: [], // For back navigation
  currentInterstitial: null, // Track which interstitial is showing
  quizStartedAt: null,
  quizCompletedAt: null,
  encouragementIndex: 0, // Track current encouragement message
  stickyButtonObserver: null // IntersectionObserver for sticky button
};

// DOM Elements
let quizContainer;
let welcomeScreen;
let quizUI;
let headerEl;
let progressEl;
let contentEl;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  quizContainer = document.getElementById('quizContainer');
  welcomeScreen = document.getElementById('welcomeScreen');
  quizUI = document.getElementById('quizUI');
  headerEl = document.getElementById('quizHeader');
  progressEl = document.getElementById('progressContainer');
  contentEl = document.getElementById('contentArea');

  // Track Meta Pixel PageView
  trackPixelEvent('PageView');

  // Set up start button
  const startBtn = document.getElementById('startQuizBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
});

/**
 * Push quiz step event to GTM dataLayer
 */
function trackQuizStep(sectionName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'quiz_step',
    'quiz_section': sectionName,
    'quiz_source': CONFIG.SOURCE_TRACKING
  });
  console.log('GTM dataLayer push:', { event: 'quiz_step', quiz_section: sectionName });
}

/**
 * Get tracking section name based on current position
 */
function getTrackingSectionName() {
  const sectionPrefix = ['part1', 'part2', 'part3', 'part4', 'part5'];
  const prefix = sectionPrefix[state.currentSectionIndex] || `part${state.currentSectionIndex + 1}`;
  return `${prefix}_q${state.currentQuestionIndex + 1}`;
}

/**
 * Start the quiz
 */
function startQuiz() {
  state.quizStartedAt = new Date().toISOString();
  trackQuizStep('intro');

  welcomeScreen.classList.add('hidden');
  quizUI.classList.remove('hidden');

  showSafetyIntro();
}

/**
 * Show the safety section intro screen
 */
function showSafetyIntro() {
  trackQuizStep('part1_intro');
  document.getElementById('sectionLabel').textContent = 'SAFETY SCREENING';
  updateProgressBar();

  contentEl.innerHTML = `
    <div class="section-intro">
      <div class="section-intro-content">
        <h2>First, a few quick health questions</h2>
        <p>These help us make sure this assessment is right for you — and that you don't need to see a doctor first.</p>
        <p class="reassurance">Most people breeze through these in under a minute.</p>
        <button class="btn-primary" id="startSafetyBtn">Continue &rarr;</button>
      </div>
    </div>
  `;

  document.getElementById('startSafetyBtn').addEventListener('click', () => {
    renderQuestion();
  });
}

/**
 * Get current section and question
 */
function getCurrentPosition() {
  const section = quizContent.sections[state.currentSectionIndex];
  const question = section ? section.questions[state.currentQuestionIndex] : null;
  return { section, question };
}

/**
 * Update progress bar with gradual fill
 */
function updateProgressBar() {
  const segments = progressEl.querySelectorAll('.progress-segment');
  const dots = progressEl.querySelectorAll('.progress-dot');

  const questionsInSection = QUESTIONS_PER_SECTION[state.currentSectionIndex] || 1;
  const sectionProgress = state.currentQuestionIndex / questionsInSection;

  segments.forEach((segment, index) => {
    const fill = segment.querySelector('.segment-fill');
    segment.classList.remove('completed', 'current');

    if (index < state.currentSectionIndex) {
      segment.classList.add('completed');
      if (fill) fill.style.width = '100%';
    } else if (index === state.currentSectionIndex) {
      segment.classList.add('current');
      if (fill) fill.style.width = `${sectionProgress * 100}%`;
    } else {
      if (fill) fill.style.width = '0%';
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    if (index < state.currentSectionIndex) {
      dot.classList.add('active');
    }
  });
}

/**
 * Update section label
 */
function updateSectionLabel() {
  const { section } = getCurrentPosition();
  const labelEl = document.getElementById('sectionLabel');
  if (labelEl && section) {
    labelEl.textContent = section.label;
  }
}

/**
 * Update back button state
 */
function updateBackButton() {
  const backBtn = document.getElementById('backButton');
  if (backBtn) {
    backBtn.disabled = state.history.length === 0;
  }
}

/**
 * Handle back button click
 */
function handleBack() {
  if (state.history.length === 0) return;

  // Cleanup sticky button before navigating
  cleanupStickyButton();

  const prev = state.history.pop();

  if (prev.type === 'interstitial') {
    // Skip interstitials on back navigation
    if (state.history.length > 0) {
      const prevPrev = state.history.pop();
      state.currentSectionIndex = prevPrev.sectionIndex;
      state.currentQuestionIndex = prevPrev.questionIndex;
    }
  } else {
    state.currentSectionIndex = prev.sectionIndex;
    state.currentQuestionIndex = prev.questionIndex;
  }

  renderQuestion();
}

/**
 * Save current position to history
 */
function saveToHistory(type = 'question') {
  state.history.push({
    type,
    sectionIndex: state.currentSectionIndex,
    questionIndex: state.currentQuestionIndex
  });
}

/**
 * Render the current question
 */
function renderQuestion() {
  // Cleanup any existing sticky button
  cleanupStickyButton();

  const { section, question } = getCurrentPosition();

  if (!section || !question) {
    console.error('Invalid position:', state.currentSectionIndex, state.currentQuestionIndex);
    return;
  }

  // Show header and progress
  headerEl.classList.remove('hidden');
  progressEl.classList.remove('hidden');

  trackQuizStep(getTrackingSectionName());
  updateProgressBar();
  updateSectionLabel();
  updateBackButton();

  contentEl.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'question-container';

  const questionText = document.createElement('h2');
  questionText.className = 'question-text';
  questionText.textContent = question.text;
  container.appendChild(questionText);

  switch (question.type) {
    case 'single':
      renderSingleSelect(container, question);
      break;
    case 'multi':
      renderMultiSelect(container, question);
      break;
    case 'text':
      renderTextInput(container, question);
      break;
  }

  contentEl.appendChild(container);
}

/**
 * Render single-select options
 */
function renderSingleSelect(container, question) {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'options-container';

  question.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option.text;

    if (state.answers[question.id] === option.value) {
      button.classList.add('selected');
    }

    button.addEventListener('click', (e) => {
      handleSingleSelect(question, option, optionsDiv, e.target);
    });

    optionsDiv.appendChild(button);
  });

  container.appendChild(optionsDiv);
}

/**
 * Handle single-select option click
 */
function handleSingleSelect(question, option, optionsDiv, clickedBtn) {
  optionsDiv.querySelectorAll('.option-button').forEach(btn => {
    btn.classList.remove('selected');
  });
  clickedBtn.classList.add('selected');

  state.answers[question.id] = option.value;

  if (option.redFlag) {
    state.hasRedFlags = true;
  }

  setTimeout(() => {
    advanceQuestion();
  }, CONFIG.AUTO_ADVANCE_DELAY);
}

/**
 * Render multi-select options
 */
function renderMultiSelect(container, question) {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'options-container';

  const selected = state.answers[question.id] || [];

  question.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-button multi-select';
    button.textContent = option.text;
    button.dataset.value = option.value;

    if (selected.includes(option.value)) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      updateMultiSelectState(question.id, optionsDiv);
      updateContinueButtonState(question.id, optionsDiv);
    });

    optionsDiv.appendChild(button);
  });

  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.textContent = 'Continue';
  continueBtn.disabled = selected.length === 0;

  continueBtn.addEventListener('click', () => {
    if (state.answers[question.id] && state.answers[question.id].length > 0) {
      advanceQuestion();
    }
  });

  container.appendChild(optionsDiv);
  container.appendChild(continueBtn);
}

/**
 * Update multi-select state
 */
function updateMultiSelectState(questionId, optionsDiv) {
  const selected = [];
  optionsDiv.querySelectorAll('.option-button.selected').forEach(btn => {
    selected.push(btn.dataset.value);
  });
  state.answers[questionId] = selected;
}

/**
 * Update continue button state for multi-select
 */
function updateContinueButtonState(questionId, optionsDiv) {
  const continueBtn = optionsDiv.parentElement.querySelector('.continue-button');
  if (continueBtn) {
    const selected = state.answers[questionId] || [];
    continueBtn.disabled = selected.length === 0;
  }
}

/**
 * Render text input with encouragement and sticky button
 */
function renderTextInput(container, question) {
  // Reset encouragement index for fresh question
  state.encouragementIndex = Math.floor(Math.random() * ENCOURAGEMENT.keepGoing.length);

  const inputDiv = document.createElement('div');
  inputDiv.className = 'text-input-container';

  const textarea = document.createElement('textarea');
  textarea.className = 'text-input';
  textarea.placeholder = question.placeholder || 'Type your response...';
  textarea.value = state.answers[question.id] || '';
  textarea.maxLength = 500;

  const charCount = document.createElement('div');
  charCount.className = 'char-count';
  charCount.textContent = `${textarea.value.length}/500 characters`;

  // Encouragement element
  const encouragement = document.createElement('div');
  encouragement.className = 'text-encouragement';
  encouragement.id = 'textEncouragement';
  updateEncouragementDisplay(encouragement, textarea.value.length, question.optional);

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = `${len}/500 characters`;
    updateEncouragementDisplay(encouragement, len, question.optional);
    updateTextContinueButtons(question.id, textarea.value.trim(), question.optional);
  });

  inputDiv.appendChild(textarea);
  inputDiv.appendChild(charCount);
  inputDiv.appendChild(encouragement);

  // Button container
  const btnContainer = document.createElement('div');
  btnContainer.className = 'button-container';
  btnContainer.style.display = 'flex';
  btnContainer.style.flexDirection = 'column';
  btnContainer.style.gap = '12px';

  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.id = 'textContinueBtn';

  const currentValue = state.answers[question.id] || '';
  if (question.optional) {
    continueBtn.textContent = currentValue.length >= CONFIG.TEXT_MIN_CHARS ? 'Continue' : 'Skip';
    continueBtn.disabled = false;
  } else {
    continueBtn.textContent = 'Continue';
    continueBtn.disabled = currentValue.length < CONFIG.TEXT_MIN_CHARS;
  }

  const handleContinue = () => {
    const value = textarea.value.trim();
    if (value.length >= CONFIG.TEXT_MIN_CHARS || question.optional) {
      state.answers[question.id] = value;
      cleanupStickyButton();
      advanceQuestion();
    }
  };

  continueBtn.addEventListener('click', handleContinue);

  btnContainer.appendChild(continueBtn);
  container.appendChild(inputDiv);
  container.appendChild(btnContainer);

  // Setup sticky button for mobile
  setupStickyButton(continueBtn, handleContinue, question.optional, currentValue.length);

  setTimeout(() => textarea.focus(), 100);
}

/**
 * Update encouragement display based on character count
 */
function updateEncouragementDisplay(element, charCount, isOptional) {
  if (charCount === 0) {
    element.innerHTML = '';
    element.classList.remove('success');
    return;
  }

  if (charCount < CONFIG.TEXT_MIN_CHARS) {
    // Show "keep going" with rotating emojis
    const msg = ENCOURAGEMENT.keepGoing[state.encouragementIndex % ENCOURAGEMENT.keepGoing.length];
    element.innerHTML = `<span class="emoji">${msg.emoji}</span> <span>${msg.text}</span>`;
    element.classList.remove('success');

    // Change emoji every few characters
    if (charCount % 3 === 0) {
      state.encouragementIndex++;
    }
  } else {
    // Show success message
    const successIndex = Math.floor(Math.random() * ENCOURAGEMENT.success.length);
    const msg = ENCOURAGEMENT.success[successIndex];
    element.innerHTML = `<span class="emoji">${msg.emoji}</span> <span>${msg.text}</span>`;
    element.classList.add('success');
  }
}

/**
 * Setup sticky continue button for mobile
 */
function setupStickyButton(originalBtn, clickHandler, isOptional, currentLength) {
  // Only on mobile
  if (window.innerWidth >= 768) return;

  // Clean up any existing observer
  cleanupStickyButton();

  // Create sticky wrapper
  const stickyWrapper = document.createElement('div');
  stickyWrapper.className = 'sticky-continue-wrapper';
  stickyWrapper.id = 'stickyButtonWrapper';

  const stickyBtn = document.createElement('button');
  stickyBtn.className = 'continue-button';
  stickyBtn.id = 'stickyTextContinueBtn';

  if (isOptional) {
    stickyBtn.textContent = currentLength >= CONFIG.TEXT_MIN_CHARS ? 'Continue' : 'Skip';
    stickyBtn.disabled = false;
  } else {
    stickyBtn.textContent = 'Continue';
    stickyBtn.disabled = currentLength < CONFIG.TEXT_MIN_CHARS;
  }

  stickyBtn.addEventListener('click', clickHandler);
  stickyWrapper.appendChild(stickyBtn);
  document.body.appendChild(stickyWrapper);

  // Add padding class to container
  const questionContainer = document.querySelector('.question-container');
  if (questionContainer) {
    questionContainer.classList.add('has-sticky-btn');
  }

  // Observe original button visibility
  state.stickyButtonObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyWrapper.classList.add('visible');
      } else {
        stickyWrapper.classList.remove('visible');
      }
    });
  }, {
    threshold: 0,
    rootMargin: '-50px 0px 0px 0px'
  });

  state.stickyButtonObserver.observe(originalBtn);
}

/**
 * Cleanup sticky button
 */
function cleanupStickyButton() {
  if (state.stickyButtonObserver) {
    state.stickyButtonObserver.disconnect();
    state.stickyButtonObserver = null;
  }

  const existingSticky = document.getElementById('stickyButtonWrapper');
  if (existingSticky) {
    existingSticky.remove();
  }

  const questionContainer = document.querySelector('.question-container');
  if (questionContainer) {
    questionContainer.classList.remove('has-sticky-btn');
  }

  // Also remove from validation/interstitial screens
  const contentArea = document.querySelector('.validation-screen, .practitioner-intro, .testimonial-container');
  if (contentArea) {
    contentArea.classList.remove('has-sticky-btn');
  }
}

/**
 * Setup sticky button for interstitial screens (simpler version for Continue buttons)
 */
function setupInterstitialStickyButton(buttonId, containerId) {
  // Only on mobile
  if (window.innerWidth >= 768) return;

  // Delay to allow DOM to render
  setTimeout(() => {
    const originalBtn = document.getElementById(buttonId);
    if (!originalBtn) return;

    // Clean up any existing
    cleanupStickyButton();

    // Create sticky wrapper
    const stickyWrapper = document.createElement('div');
    stickyWrapper.className = 'sticky-continue-wrapper';
    stickyWrapper.id = 'stickyButtonWrapper';

    const stickyBtn = document.createElement('button');
    stickyBtn.className = 'btn-primary';
    stickyBtn.textContent = originalBtn.textContent;
    stickyBtn.addEventListener('click', () => originalBtn.click());

    stickyWrapper.appendChild(stickyBtn);
    document.body.appendChild(stickyWrapper);

    // Add padding to container
    const container = document.getElementById(containerId) || document.querySelector('.validation-screen, .practitioner-intro, .testimonial-container');
    if (container) {
      container.style.paddingBottom = '100px';
    }

    // Observe original button
    state.stickyButtonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyWrapper.classList.add('visible');
        } else {
          stickyWrapper.classList.remove('visible');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-50px 0px 0px 0px'
    });

    state.stickyButtonObserver.observe(originalBtn);
  }, 100);
}

/**
 * Update text input continue button state (both regular and sticky)
 */
function updateTextContinueButtons(questionId, value, isOptional) {
  const continueBtn = document.getElementById('textContinueBtn');
  const stickyBtn = document.getElementById('stickyTextContinueBtn');

  const updateBtn = (btn) => {
    if (!btn) return;
    if (isOptional) {
      btn.textContent = value.length >= CONFIG.TEXT_MIN_CHARS ? 'Continue' : 'Skip';
      btn.disabled = false;
    } else {
      btn.disabled = value.length < CONFIG.TEXT_MIN_CHARS;
    }
  };

  updateBtn(continueBtn);
  updateBtn(stickyBtn);
}

/**
 * Advance to next question or show interstitial
 */
function advanceQuestion() {
  saveToHistory();

  const { section } = getCurrentPosition();

  // After safety section (Q4) - show practitioner intro or red flag warning
  if (section.id === 'safety' && state.currentQuestionIndex === section.questions.length - 1) {
    if (state.hasRedFlags) {
      showRedFlagWarning();
    } else {
      showPractitionerIntro();
    }
    return;
  }

  // After symptoms section (Q9) - show protocol preview
  if (section.id === 'symptoms' && state.currentQuestionIndex === section.questions.length - 1) {
    showProtocolPreview();
    return;
  }

  // After history section (Q12) - show validation screen
  if (section.id === 'history' && state.currentQuestionIndex === section.questions.length - 1) {
    showValidationScreen();
    return;
  }

  // After gut-brain Q13 - show Amanda testimonial only if stress affects gut
  // Skip testimonial if user selected "Honestly, I haven't noticed a pattern" (none)
  if (section.id === 'gutbrain' && state.currentQuestionIndex === 0) {
    if (state.answers.q13_stress === 'none') {
      // Skip Amanda testimonial, go directly to Q14
      state.currentQuestionIndex = 1;
      renderQuestion();
      return;
    }
    showTestimonialAmanda();
    return;
  }

  // After impact section - show loading and results
  if (section.id === 'impact' && state.currentQuestionIndex === section.questions.length - 1) {
    showFinalCalculation();
    return;
  }

  // Move to next question in section
  if (state.currentQuestionIndex < section.questions.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion();
    return;
  }

  // Move to next section
  if (state.currentSectionIndex < quizContent.sections.length - 1) {
    state.currentSectionIndex++;
    state.currentQuestionIndex = 0;
    renderQuestion();
    return;
  }

  // Quiz complete
  showFinalCalculation();
}

/**
 * Show practitioner intro (Rebecca) - no red flags
 */
function showPractitionerIntro() {
  saveToHistory('interstitial');
  trackQuizStep('part1_practitioner_intro');

  const rebecca = quizContent.practitioners.rebecca;

  // Hide progress temporarily for cleaner look
  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="practitioner-intro">
      <img src="${rebecca.photo}" alt="${rebecca.name}" class="practitioner-photo" onerror="this.style.display='none'" />
      <h2>Great news — you're a good fit for our protocols</h2>
      ${rebecca.introMessage.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      <div class="practitioner-credentials">${rebecca.credentials} — ${rebecca.title}</div>
      <button class="btn-primary" id="continueFromIntroBtn">Continue to Symptom Assessment &rarr;</button>
    </div>
  `;

  document.getElementById('continueFromIntroBtn').addEventListener('click', () => {
    progressEl.classList.remove('hidden');
    state.currentSectionIndex = 1; // Move to symptoms section
    state.currentQuestionIndex = 0;
    renderQuestion();
  });
}

/**
 * Show red flag warning screen
 */
function showRedFlagWarning() {
  saveToHistory('interstitial');
  trackQuizStep('part1_red_flag_warning');

  const rebecca = quizContent.practitioners.rebecca;

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="warning-screen">
      <div class="warning-icon">&#9888;</div>
      <h2>Before we continue</h2>
      <p>Based on your answers, I recommend speaking with a gastroenterologist before starting any gut protocol.</p>
      <p>This doesn't mean something is wrong — it just means your symptoms deserve proper evaluation first.</p>

      <div class="warning-practitioner-card">
        <img src="${rebecca.photo}" alt="${rebecca.name}" onerror="this.style.display='none'" />
        <p>${rebecca.redFlagMessage}</p>
      </div>

      <div class="warning-actions">
        <button class="btn-secondary" id="exitBtn">I'll return after seeing my doctor</button>
        <button class="btn-primary" id="continueAnywayBtn">I've already been evaluated and cleared</button>
      </div>
    </div>
  `;

  document.getElementById('exitBtn').addEventListener('click', () => {
    window.location.href = '/';
  });

  document.getElementById('continueAnywayBtn').addEventListener('click', () => {
    state.redFlagsBypassed = true;
    state.answers.red_flag_evaluated_cleared = true;
    progressEl.classList.remove('hidden');
    state.currentSectionIndex = 1;
    state.currentQuestionIndex = 0;
    renderQuestion();
  });
}

/**
 * Calculate protocol based on answers
 */
function calculateProtocol() {
  const data = state.answers;
  const diagnoses = data.q11_diagnosis || [];
  const tried = data.q12_tried || [];

  // Priority 1: Post-SIBO (requires both diagnosis AND treatment history)
  if (diagnoses.includes('sibo') && tried.includes('sibo_antibiotics')) {
    return 'rebuild';
  }

  // Priority 2: Primary complaint mapping
  const complaint = data.q5_primary_complaint;

  if (complaint === 'bloating' || complaint === 'gas') {
    return 'bloat_reset';
  }

  if (complaint === 'constipation') {
    return 'regularity';
  }

  if (complaint === 'diarrhea') {
    return 'calm_gut';
  }

  if (complaint === 'mixed' || data.q9_stool_change === 'alternates') {
    return 'stability';
  }

  if (complaint === 'pain') {
    if (data.q8_frequency_change === 'more') return 'calm_gut';
    if (data.q8_frequency_change === 'less') return 'regularity';
    if (data.q8_frequency_change === 'both') return 'stability';
    return 'bloat_reset';
  }

  if (complaint === 'reflux') {
    return 'bloat_reset';
  }

  return 'bloat_reset';
}

/**
 * Check if gut-brain overlay applies
 */
function checkGutBrainOverlay() {
  const data = state.answers;
  return (
    data.q13_stress === 'significant' ||
    data.q14_mental_health === 'yes' ||
    (data.q13_stress === 'some' && data.q14_mental_health === 'sometimes')
  );
}

/**
 * Show protocol preview after symptoms section
 */
function showProtocolPreview() {
  saveToHistory('interstitial');
  trackQuizStep('part2_protocol_preview');

  // Calculate preliminary protocol
  state.calculatedProtocol = calculateProtocol();
  const protocol = quizContent.protocols[state.calculatedProtocol];

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  // Show loading first
  contentEl.innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p class="loading-text">Analyzing your symptom pattern...</p>
    </div>
  `;

  setTimeout(() => {
    contentEl.innerHTML = `
      <div class="protocol-preview">
        <div class="check-icon">&#10003;</div>
        <h2>Based on your symptoms, you're likely a match for:</h2>

        <div class="protocol-card">
          <div class="protocol-name">${protocol.name}</div>
          <div class="protocol-tagline">${protocol.tagline}</div>
        </div>

        <p class="explanation">
          But identifying a protocol is just the first step. To customize this for YOUR body — and skip what hasn't worked for you before — we need to understand your history.
        </p>
        <p class="explanation">
          The next few questions help us personalize your protocol so you're not starting from scratch.
        </p>

        <button class="btn-primary" id="continueFromPreviewBtn">Continue &rarr;</button>
      </div>
    `;

    document.getElementById('continueFromPreviewBtn').addEventListener('click', () => {
      showEmailCapture();
    });
  }, 2000);
}

/**
 * Show email capture screen (with name)
 */
function showEmailCapture() {
  saveToHistory('interstitial');
  trackQuizStep('email_capture');

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="capture-container">
      <p class="capture-label">SAVE YOUR PROGRESS</p>
      <h2 class="capture-title">Where should we send your personalized results?</h2>
      <input type="text" class="capture-input" id="nameInput" placeholder="Your first name" style="margin-bottom: 12px;" />
      <input type="email" class="capture-input" id="emailInput" placeholder="your@email.com" />
      <div class="error-message hidden" id="emailError">Please enter a valid email address</div>
      <p class="privacy-text">We'll send your protocol results and keep you updated on your gut healing journey. Unsubscribe anytime.</p>
      <button class="continue-button" id="emailContinueBtn" disabled>Send My Results &rarr;</button>
    </div>
  `;

  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const continueBtn = document.getElementById('emailContinueBtn');
  const errorEl = document.getElementById('emailError');

  function validateForm() {
    const nameValid = nameInput.value.trim().length >= 2;
    const emailValid = isValidEmail(emailInput.value);
    continueBtn.disabled = !(nameValid && emailValid);
    errorEl.classList.toggle('hidden', emailValid || emailInput.value.length === 0);
  }

  nameInput.addEventListener('input', validateForm);
  emailInput.addEventListener('input', validateForm);

  continueBtn.addEventListener('click', () => {
    if (nameInput.value.trim().length >= 2 && isValidEmail(emailInput.value)) {
      state.userData.name = nameInput.value.trim();
      state.userData.email = emailInput.value.trim();

      trackPixelEvent('Lead', {
        content_name: CONFIG.SOURCE_TRACKING,
        content_category: 'quiz'
      });

      // Fire webhook for email capture
      sendWebhook('quiz_email_captured');

      // Move to history section
      progressEl.classList.remove('hidden');
      state.currentSectionIndex = 2; // History section
      state.currentQuestionIndex = 0;
      renderQuestion();
    }
  });

  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !continueBtn.disabled) {
      continueBtn.click();
    }
  });

  setTimeout(() => nameInput.focus(), 100);
}

/**
 * Format treatment list for validation screen
 */
function formatTriedList(tried) {
  const labels = quizContent.treatmentLabels;
  const items = tried
    .filter(t => t !== 'nothing')
    .map(t => labels[t])
    .filter(Boolean);

  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  const last = items.pop();
  return `${items.join(', ')}, and ${last}`;
}

/**
 * Show validation screen after history section
 */
function showValidationScreen() {
  saveToHistory('interstitial');
  trackQuizStep('part3_validation');

  const paulina = quizContent.practitioners.paulina;
  const duration = state.answers.q10_duration;
  const diagnoses = state.answers.q11_diagnosis || [];
  const tried = state.answers.q12_tried || [];

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  // Build dynamic content sections
  let validationSections = [];

  // Duration acknowledgment
  const durationText = quizContent.durationAcknowledgments[duration] || quizContent.durationAcknowledgments['1-3_years'];
  validationSections.push(`<div class="validation-section">${durationText}</div>`);

  // Diagnosis validation
  if (diagnoses.includes('no_diagnosis')) {
    validationSections.push(`
      <div class="validation-section">
        <strong>"Normal" test results</strong> don't mean your symptoms aren't real. Standard blood work and imaging often miss functional gut issues entirely. You're not imagining this — your body is telling you something, even if tests don't show it.
      </div>
    `);
  } else if (diagnoses.length > 0 && !diagnoses.includes('other')) {
    const diagLabels = diagnoses.map(d => {
      const labels = { ibs: 'IBS', sibo: 'SIBO', ibd: 'IBD', gerd: 'GERD', food_intolerance: 'food intolerances' };
      return labels[d] || d;
    }).join(', ');
    validationSections.push(`
      <div class="validation-section">
        You've been diagnosed with ${diagLabels}. Having a name for what you're experiencing is a start — but a diagnosis alone doesn't give you a day-by-day plan for feeling better.
      </div>
    `);
  }

  // What they've tried
  if (!tried.includes('nothing') && tried.length > 0) {
    const triedList = formatTriedList(tried);
    validationSections.push(`
      <div class="validation-section">
        You've already put in serious work. <strong>${triedList}</strong> — you weren't doing it wrong. These approaches help some people, but without tracking your individual response and having someone adjust based on YOUR data, it's like navigating without a map.
      </div>
    `);
  }

  // How GHA is different
  validationSections.push(`
    <div class="validation-section">
      At Gut Healing Academy, our practitioners review your weekly tracking and adapt your protocol based on how YOUR body responds. No more guessing if something is working.
    </div>
  `);

  contentEl.innerHTML = `
    <div class="validation-screen">
      <h2>Here's what I'm seeing...</h2>

      ${validationSections.join('')}

      <div class="practitioner-mini-card">
        <img src="${paulina.photo}" alt="${paulina.name}" onerror="this.style.display='none'" />
        <div class="practitioner-info">
          <div class="practitioner-name">${paulina.name}, ${paulina.credentials}</div>
          <div class="practitioner-title">${paulina.title}</div>
          <div class="practitioner-quote">"${paulina.validationQuote}"</div>
        </div>
      </div>

      <button class="btn-primary" id="continueFromValidationBtn">Continue &rarr;</button>
    </div>
  `;

  document.getElementById('continueFromValidationBtn').addEventListener('click', () => {
    // Go directly to gut-brain questions (no testimonial between text blocks)
    cleanupStickyButton();
    progressEl.classList.remove('hidden');
    state.currentSectionIndex = 3; // Gut-brain section
    state.currentQuestionIndex = 0;
    renderQuestion();
  });

  // Setup sticky button for mobile
  setupInterstitialStickyButton('continueFromValidationBtn');
}

/**
 * Show Suzy testimonial
 */
function showTestimonialSuzy() {
  saveToHistory('interstitial');
  trackQuizStep('testimonial_suzy');

  const suzy = quizContent.testimonials.suzy;

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="testimonial-container">
      <p class="testimonial-label">FROM OUR COMMUNITY</p>

      <div class="testimonial-card">
        <img src="${suzy.photo}" alt="${suzy.name}" class="testimonial-photo" onerror="this.style.display='none'" />
        <p class="testimonial-quote">"${suzy.quote}"</p>
        <p class="testimonial-name">${suzy.name}</p>
        <div class="star-rating">${'★'.repeat(suzy.stars)}</div>
      </div>

      <p class="testimonial-disclaimer">Individual results may vary based on adherence and personal factors.</p>

      <button class="btn-primary" id="continueFromSuzyBtn">Continue &rarr;</button>
    </div>
  `;

  document.getElementById('continueFromSuzyBtn').addEventListener('click', () => {
    progressEl.classList.remove('hidden');
    state.currentSectionIndex = 3; // Gut-brain section
    state.currentQuestionIndex = 0;
    renderQuestion();
  });
}

/**
 * Show Amanda testimonial (after Q13)
 */
function showTestimonialAmanda() {
  saveToHistory('interstitial');
  trackQuizStep('testimonial_amanda');

  const amanda = quizContent.testimonials.amanda;

  progressEl.classList.add('hidden');
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="testimonial-container">
      <p class="testimonial-context">${amanda.contextLine}</p>

      <div class="testimonial-card">
        <img src="${amanda.photo}" alt="${amanda.name}" class="testimonial-photo" onerror="this.style.display='none'" />
        <p class="testimonial-quote">"${amanda.quote}"</p>
        <p class="testimonial-name">${amanda.name}</p>
        <div class="star-rating">${'★'.repeat(amanda.stars)}</div>
      </div>

      <p class="testimonial-disclaimer">Individual results may vary based on adherence and personal factors.</p>

      <button class="btn-primary" id="continueFromAmandaBtn">Continue &rarr;</button>
    </div>
  `;

  document.getElementById('continueFromAmandaBtn').addEventListener('click', () => {
    progressEl.classList.remove('hidden');
    state.currentQuestionIndex = 1; // Move to Q14
    renderQuestion();
  });
}

/**
 * Show final calculation animation
 */
function showFinalCalculation() {
  state.quizCompletedAt = new Date().toISOString();
  saveToHistory('interstitial');
  trackQuizStep('results_calculating');

  // Final protocol calculation
  state.calculatedProtocol = calculateProtocol();
  state.hasGutBrainOverlay = checkGutBrainOverlay();

  // Hide header and progress
  headerEl.classList.add('hidden');
  progressEl.classList.add('hidden');

  const messages = quizContent.loadingMessages;
  let messageIndex = 0;

  contentEl.innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p class="loading-text">${messages[0]}</p>
    </div>
  `;

  const loadingText = contentEl.querySelector('.loading-text');

  // Rotate messages
  const messageInterval = setInterval(() => {
    messageIndex++;
    if (messageIndex < messages.length) {
      loadingText.style.opacity = '0';
      setTimeout(() => {
        loadingText.textContent = messages[messageIndex];
        loadingText.style.opacity = '1';
      }, 300);
    }
  }, CONFIG.LOADING_MESSAGE_INTERVAL);

  // Track completion
  trackPixelEvent('CompleteRegistration', {
    content_name: CONFIG.SOURCE_TRACKING,
    status: state.calculatedProtocol
  });

  // Send completion webhook
  sendWebhook('quiz_completed');

  // Show results after loading
  setTimeout(() => {
    clearInterval(messageInterval);
    showResults();
  }, CONFIG.LOADING_DURATION);
}

/**
 * Show results screen
 */
function showResults() {
  trackQuizStep('results_shown');

  const protocol = quizContent.protocols[state.calculatedProtocol];
  const cheryl = quizContent.testimonials.cheryl;

  // Build personalization factors
  const complaint = quizContent.complaintLabels[state.answers.q5_primary_complaint] || 'Gut symptoms';
  const duration = state.answers.q10_duration ? state.answers.q10_duration.replace(/_/g, ' ').replace('-', '-') : 'ongoing';
  const tried = state.answers.q12_tried || [];
  const triedList = tried.includes('nothing') ? 'Just starting' : formatTriedList(tried);

  let personalizationHtml = `
    <ul>
      <li>Your primary symptom: <strong>${complaint}</strong></li>
      <li>Duration: <strong>${duration}</strong> of gut issues</li>
  `;
  if (triedList && triedList !== 'Just starting') {
    personalizationHtml += `<li>What you've tried: <strong>${triedList}</strong></li>`;
  }
  if (state.hasGutBrainOverlay) {
    personalizationHtml += `<li>Stress connection: <strong>Significant impact identified</strong></li>`;
  }
  personalizationHtml += '</ul>';

  contentEl.innerHTML = `
    <div class="results-screen">
      <div class="check-icon">&#10003;</div>

      <h1>Your Personalized Protocol is Ready</h1>

      <div class="results-protocol-card">
        <div class="protocol-name">${protocol.name}</div>
        ${state.hasGutBrainOverlay ? `<div class="gut-brain-badge">${quizContent.gutBrainOverlay.name}</div>` : ''}
        <div class="protocol-tagline">${protocol.tagline}</div>
      </div>

      <div class="personalization-factors">
        <h3>Your protocol has been customized based on:</h3>
        ${personalizationHtml}
      </div>

      <div class="whats-included">
        ${quizContent.whatsIncluded.map(item => `
          <div class="included-item">
            <span class="check-mark">&#10003;</span>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>

      <div class="testimonial-compact">
        <img src="${cheryl.photo}" alt="${cheryl.name}" onerror="this.style.display='none'" />
        <div class="testimonial-text">
          <p class="testimonial-quote">"${cheryl.quote}" — ${cheryl.name}</p>
          <div class="star-rating">${'★'.repeat(cheryl.stars)}</div>
        </div>
      </div>

      <button class="btn-primary btn-large" id="seeMyPlanBtn">See My Complete Plan &rarr;</button>
      <p class="results-cta-note">See pricing and what's included</p>
    </div>
  `;

  document.getElementById('seeMyPlanBtn').addEventListener('click', () => {
    redirectToOffer();
  });
}

/**
 * Redirect to offer page with tracking params
 */
function redirectToOffer() {
  trackQuizStep('offer_redirect');

  const params = new URLSearchParams();

  params.set('source', CONFIG.SOURCE_TRACKING);

  if (state.userData.name) {
    params.set('name', state.userData.name);
  }
  if (state.userData.email) {
    params.set('email', state.userData.email);
  }

  params.set('protocol', state.calculatedProtocol);
  params.set('protocol_name', quizContent.protocols[state.calculatedProtocol].name);
  params.set('gut_brain', state.hasGutBrainOverlay ? 'true' : 'false');

  if (state.answers.q5_primary_complaint) {
    params.set('primary_complaint', state.answers.q5_primary_complaint);
    params.set('primary_complaint_label', quizContent.complaintLabels[state.answers.q5_primary_complaint] || '');
  }
  if (state.answers.q10_duration) {
    params.set('duration', state.answers.q10_duration);
  }
  if (state.answers.q11_diagnosis) {
    params.set('diagnoses', state.answers.q11_diagnosis.join(','));
  }
  if (state.answers.q12_tried) {
    params.set('treatments', state.answers.q12_tried.join(','));
    // Add formatted version for display
    const triedFormatted = formatTriedList(state.answers.q12_tried);
    if (triedFormatted) {
      params.set('treatments_formatted', triedFormatted);
    }
  }
  if (state.answers.q13_stress) {
    params.set('stress_level', state.answers.q13_stress);
  }
  if (state.answers.q16_life_impact) {
    params.set('life_impact', state.answers.q16_life_impact);
  }
  if (state.answers.q18_vision) {
    params.set('vision', encodeURIComponent(state.answers.q18_vision.substring(0, 200)));
  }

  window.location.href = `${CONFIG.OFFER_URL}?${params.toString()}`;
}

/**
 * Submit quiz data to Supabase users table
 */
async function submitToSupabase() {
  if (!supabaseClient) {
    console.log('Supabase not configured - skipping database submission');
    return null;
  }

  try {
    const userRecord = {
      name: state.userData.name || null,
      email: state.userData.email || null,
      quiz_source: CONFIG.SOURCE_TRACKING,
      protocol: state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : null,
      has_stress_component: state.hasGutBrainOverlay || false,
      has_red_flags: state.hasRedFlags || false,
      red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,
      primary_complaint: state.answers.q5_primary_complaint || null,
      symptom_frequency: state.answers.q6_frequency || null,
      relief_after_bm: state.answers.q7_bm_relief || null,
      frequency_during_flare: state.answers.q8_frequency_change || null,
      stool_during_flare: state.answers.q9_stool_change || null,
      duration: state.answers.q10_duration || null,
      diagnoses: state.answers.q11_diagnosis || [],
      treatments_tried: state.answers.q12_tried || [],
      stress_connection: state.answers.q13_stress || null,
      mental_health_impact: state.answers.q14_mental_health || null,
      sleep_quality: state.answers.q15_sleep || null,
      life_impact_level: state.answers.q16_life_impact || null,
      hardest_part: state.answers.q17_hardest_part || null,
      dream_outcome: state.answers.q18_vision || null,
      role: 'member',
      status: 'lead'
    };

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
    return null;
  }
}

/**
 * Send webhook to Make.com and submit to Supabase
 */
async function sendWebhook(eventType) {
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    name: state.userData.name,
    email: state.userData.email,
    source: CONFIG.SOURCE_TRACKING
  };

  if (eventType === 'quiz_email_captured') {
    payload.partial_data = {
      has_red_flags: state.hasRedFlags,
      primary_complaint: state.answers.q5_primary_complaint,
      primary_complaint_label: quizContent.complaintLabels[state.answers.q5_primary_complaint] || '',
      frequency: state.answers.q6_frequency,
      preliminary_protocol: state.calculatedProtocol,
      preliminary_protocol_name: state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol].name : ''
    };
  }

  if (eventType === 'quiz_completed') {
    const tried = state.answers.q12_tried || [];
    const triedFormatted = formatTriedList(tried);

    payload.results = {
      protocol: state.calculatedProtocol,
      protocol_name: quizContent.protocols[state.calculatedProtocol].name,
      protocol_tagline: quizContent.protocols[state.calculatedProtocol].tagline,
      has_gut_brain_overlay: state.hasGutBrainOverlay,
      primary_complaint: state.answers.q5_primary_complaint,
      primary_complaint_label: quizContent.complaintLabels[state.answers.q5_primary_complaint] || '',
      duration: state.answers.q10_duration,
      diagnoses: state.answers.q11_diagnosis || [],
      tried_treatments: tried,
      tried_treatments_formatted: triedFormatted,
      stress_level: state.answers.q13_stress,
      mental_health_impact: state.answers.q14_mental_health,
      life_impact: state.answers.q16_life_impact,
      hardest_part: state.answers.q17_hardest_part || '',
      vision: state.answers.q18_vision || ''
    };
    payload.metadata = {
      quiz_duration_seconds: Math.round((new Date(state.quizCompletedAt) - new Date(state.quizStartedAt)) / 1000),
      red_flags_bypassed: state.redFlagsBypassed
    };

    // Submit to Supabase on quiz completion
    submitToSupabase();
  }

  console.log('Webhook payload:', payload);

  // Send to Make.com webhook
  try {
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      console.log('Make.com submission successful');
    } else {
      console.error('Webhook submission failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error submitting to webhook:', error);
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Track Meta Pixel events
 */
function trackPixelEvent(event, params = {}) {
  if (typeof fbq === 'function') {
    fbq('track', event, params);
  }
}

// Expose handleBack for back button
window.handleBack = handleBack;
