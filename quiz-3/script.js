// Survey-Style Quiz Application 3.0
// Goal-first intro variant with interstitials, practitioner intros, and testimonials

// Configuration
const CONFIG = {
  OFFER_URL: '/offer/',
  SOURCE_TRACKING: 'quiz-3',
  LOADING_DURATION: 5500, // 5.5 seconds for loading animation
  AUTO_ADVANCE_DELAY: 400, // ms after single-select
  LOADING_MESSAGE_INTERVAL: 1500, // ms between loading messages
  // Make.com webhook URL
  WEBHOOK_URL: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
  // Supabase configuration
  SUPABASE_URL: 'https://mwabljnngygkmahjgvps.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWJsam5uZ3lna21haGpndnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjQ3MzgsImV4cCI6MjA4MTEwMDczOH0.rbZYj1aXui_xZ0qkg7QONdHppnJghT2r0ycZwtr3a-E'
};

// Initialize Supabase client
var supabaseClient = null;
if (typeof window.supabase !== 'undefined' && CONFIG.SUPABASE_URL) {
  supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}

// Questions per section for progress calculation
// YOUR GOALS (3 intro screens), Safety, Symptoms, History, GutBrain, Impact
const QUESTIONS_PER_SECTION = [3, 4, 5, 3, 3, 3];

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
  // Quiz-3 specific: Goal-first intro screens
  introScreenIndex: 0, // 0: goal, 1: journey, 2: validation
  goalSelection: null,
  journeyStage: null
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

  // Quiz-3: Auto-start - skip welcome screen and go directly to first question
  startQuiz();
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

  // Quiz-3: Start with goal-first intro screens
  showIntroGoalScreen();
}

/**
 * Show intro screen 1 - Goal Selection
 */
function showIntroGoalScreen() {
  trackQuizStep('intro_goal');
  state.currentSectionIndex = 0;
  state.currentQuestionIndex = 0;
  state.introScreenIndex = 0;

  document.getElementById('sectionLabel').textContent = 'YOUR GOALS';
  updateProgressBar();
  updateBackButton();

  const htmlContent = `
    <div class="question-container">
      <h2 class="question-text">What would change your life most right now?</h2>
      <div class="options-container">
        <button class="option-button intro-option" data-value="comfortable_eating">Finally feeling comfortable after eating</button>
        <button class="option-button intro-option" data-value="bathroom_freedom">Eating without mapping every bathroom</button>
        <button class="option-button intro-option" data-value="energy_focus">Getting my energy and focus back</button>
        <button class="option-button intro-option" data-value="understanding">Understanding why nothing has worked</button>
      </div>
    </div>
  `;

  contentEl.innerHTML = htmlContent;

  // Add click handlers for options
  contentEl.querySelectorAll('.intro-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Visual selection
      contentEl.querySelectorAll('.intro-option').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');

      // Store value
      state.goalSelection = e.target.dataset.value;
      state.answers.goal_selection = e.target.dataset.value;

      // Auto-advance after short delay
      setTimeout(() => {
        saveToHistory('intro');
        showIntroJourneyScreen();
      }, CONFIG.AUTO_ADVANCE_DELAY);
    });
  });
}

/**
 * Show intro screen 2 - Journey Stage
 */
function showIntroJourneyScreen() {
  trackQuizStep('intro_journey');
  state.currentQuestionIndex = 1;
  state.introScreenIndex = 1;

  document.getElementById('sectionLabel').textContent = 'YOUR GOALS';
  updateProgressBar();
  updateBackButton();

  contentEl.innerHTML = `
    <div class="question-container">
      <h2 class="question-text">Where are you in your gut health journey?</h2>
      <div class="options-container">
        <button class="option-button intro-option" data-value="just_starting">Just starting to figure this out</button>
        <button class="option-button intro-option" data-value="tried_few">Tried a few things, still struggling</button>
        <button class="option-button intro-option" data-value="tried_everything">Tried everything, nothing works</button>
        <button class="option-button intro-option" data-value="returned">Had some success but symptoms returned</button>
      </div>
    </div>
  `;

  // Add click handlers for options
  contentEl.querySelectorAll('.intro-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Visual selection
      contentEl.querySelectorAll('.intro-option').forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');

      // Store value
      state.journeyStage = e.target.dataset.value;
      state.answers.journey_stage = e.target.dataset.value;

      // Auto-advance after short delay
      setTimeout(() => {
        saveToHistory('intro');
        showIntroValidationScreen();
      }, CONFIG.AUTO_ADVANCE_DELAY);
    });
  });
}

/**
 * Show intro screen 3 - Validation Interstitial
 */
function showIntroValidationScreen() {
  trackQuizStep('intro_validation');
  state.currentQuestionIndex = 2;
  state.introScreenIndex = 2;

  document.getElementById('sectionLabel').textContent = 'YOUR GOALS';
  updateProgressBar();
  updateBackButton();

  contentEl.innerHTML = `
    <div class="intro-validation-screen">
      <div class="validation-icon">&#10084;</div>
      <h2>You're in the right place.</h2>
      <p class="validation-subtext">Most of our members started exactly where you are. Let's build something that actually works for your situation.</p>
      <button class="btn-primary" id="continueFromIntroValidation">Continue &rarr;</button>
    </div>
  `;

  document.getElementById('continueFromIntroValidation').addEventListener('click', () => {
    saveToHistory('intro');
    // Move to Safety Screening (section index 1)
    state.currentSectionIndex = 1;
    state.currentQuestionIndex = 0;
    showSafetyIntro();
  });
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

  const prev = state.history.pop();

  // Handle intro screens back navigation
  if (prev.type === 'intro') {
    state.currentSectionIndex = prev.sectionIndex;
    state.currentQuestionIndex = prev.questionIndex;
    state.introScreenIndex = prev.questionIndex;

    if (prev.questionIndex === 0) {
      showIntroGoalScreen();
    } else if (prev.questionIndex === 1) {
      showIntroJourneyScreen();
    } else if (prev.questionIndex === 2) {
      showIntroValidationScreen();
    }
    return;
  }

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
 * Render text input
 */
function renderTextInput(container, question) {
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

  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length}/500 characters`;
    updateTextContinueButtons(question.id, textarea.value.trim(), question.optional);
  });

  inputDiv.appendChild(textarea);
  inputDiv.appendChild(charCount);

  // Button container
  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.flexDirection = 'column';
  btnContainer.style.gap = '12px';

  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.id = 'textContinueBtn';

  const currentValue = state.answers[question.id] || '';
  if (question.optional) {
    continueBtn.textContent = currentValue.length >= 10 ? 'Continue' : 'Skip';
    continueBtn.disabled = false;
  } else {
    continueBtn.textContent = 'Continue';
    continueBtn.disabled = currentValue.length < 10;
  }

  continueBtn.addEventListener('click', () => {
    const value = textarea.value.trim();
    if (value.length >= 10 || question.optional) {
      state.answers[question.id] = value;
      advanceQuestion();
    }
  });

  btnContainer.appendChild(continueBtn);
  container.appendChild(inputDiv);
  container.appendChild(btnContainer);

  setTimeout(() => textarea.focus(), 100);
}

/**
 * Update text input continue button state
 */
function updateTextContinueButtons(questionId, value, isOptional) {
  const continueBtn = document.getElementById('textContinueBtn');
  if (continueBtn) {
    if (isOptional) {
      continueBtn.textContent = value.length >= 10 ? 'Continue' : 'Skip';
      continueBtn.disabled = false;
    } else {
      continueBtn.disabled = value.length < 10;
    }
  }
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
    state.currentSectionIndex = 2; // Move to symptoms section (index 2 in quiz-3)
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
    state.currentSectionIndex = 2; // Move to symptoms section (index 2 in quiz-3)
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
      state.currentSectionIndex = 3; // History section (index 3 in quiz-3)
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
    progressEl.classList.remove('hidden');
    state.currentSectionIndex = 4; // Gut-brain section (index 4 in quiz-3)
    state.currentQuestionIndex = 0;
    renderQuestion();
  });
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
    state.currentSectionIndex = 4; // Gut-brain section (index 4 in quiz-3)
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

  // Quiz-3 specific: Goal-first intro data
  if (state.answers.goal_selection) {
    params.set('goal_selection', state.answers.goal_selection);
  }
  if (state.answers.journey_stage) {
    params.set('journey_stage', state.answers.journey_stage);
  }

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
      // Quiz-3 specific fields
      goal_selection: state.answers.goal_selection || null,
      journey_stage: state.answers.journey_stage || null,
      // Standard quiz fields
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
 * Get protocol number from protocol key
 */
function getProtocolNumber(protocolKey) {
  const protocolNumbers = {
    bloat_reset: 1,
    regularity: 2,
    calm_gut: 3,
    stability: 4,
    rebuild: 5
  };
  return protocolNumbers[protocolKey] || 1;
}

/**
 * Send webhook to Make.com and submit to Supabase
 * Format matches original quiz for Make.com compatibility
 */
async function sendWebhook(eventType) {
  const protocol = state.calculatedProtocol ? quizContent.protocols[state.calculatedProtocol] : null;
  const protocolNumber = state.calculatedProtocol ? getProtocolNumber(state.calculatedProtocol) : 0;

  // Build payload matching original quiz format (flat structure)
  const payload = {
    // Contact info
    name: state.userData.name || '',
    email: state.userData.email || '',

    // Protocol info
    protocol_number: protocolNumber,
    protocol_name: protocol ? protocol.name : '',
    protocol_description: protocol ? protocol.tagline : '',

    // Stress/gut-brain component
    has_stress_component: state.hasGutBrainOverlay || false,

    // Quiz-3 specific fields
    goal_selection: state.answers.goal_selection || '',
    journey_stage: state.answers.journey_stage || '',

    // Open-ended responses (Q17 & Q18)
    q17_hardest_part: state.answers.q17_hardest_part || '',
    q18_vision: state.answers.q18_vision || '',

    // Safety screening (Q1-Q4)
    q1_weight_loss: state.answers.q1_weight_loss || '',
    q2_blood: state.answers.q2_blood || '',
    q3_family_history: state.answers.q3_family_history || '',
    q4_colonoscopy: state.answers.q4_colonoscopy || '',

    // Symptom questions (Q5-Q9)
    q5_primary_complaint: state.answers.q5_primary_complaint || '',
    q6_frequency: state.answers.q6_frequency || '',
    q7_bm_relief: state.answers.q7_bm_relief || '',
    q8_frequency_change: state.answers.q8_frequency_change || '',
    q9_stool_change: state.answers.q9_stool_change || '',

    // History (Q10-Q12)
    q10_duration: state.answers.q10_duration || '',
    q11_diagnosis: Array.isArray(state.answers.q11_diagnosis)
      ? state.answers.q11_diagnosis.join(', ')
      : (state.answers.q11_diagnosis || ''),
    q12_tried: Array.isArray(state.answers.q12_tried)
      ? state.answers.q12_tried.join(', ')
      : (state.answers.q12_tried || ''),

    // Gut-brain & lifestyle (Q13-Q16)
    q13_stress: state.answers.q13_stress || '',
    q14_mental_health: state.answers.q14_mental_health || '',
    q15_sleep: state.answers.q15_sleep || '',
    q16_life_impact: state.answers.q16_life_impact || '',

    // Red flag status
    had_red_flags: state.hasRedFlags || false,
    red_flag_evaluated_cleared: state.answers.red_flag_evaluated_cleared || false,

    // Source tracking
    source: CONFIG.SOURCE_TRACKING,

    // Timestamp
    submitted_at: new Date().toISOString()
  };

  // Add event-specific data
  if (eventType === 'quiz_email_captured') {
    payload.submission_type = 'email_capture';
  }

  if (eventType === 'quiz_completed') {
    payload.submission_type = 'quiz_completed';

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
