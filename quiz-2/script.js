// Survey-Style Quiz Application
// Clean, minimal quiz for A/B testing

// Configuration
const CONFIG = {
  OFFER_URL: '/offer/',
  SOURCE_TRACKING: 'survey-clean',
  LOADING_DURATION: 4000, // 4 seconds
  AUTO_ADVANCE_DELAY: 400 // ms after single-select
};

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
  history: [] // For back navigation
};

// DOM Elements
let quizContainer;
let headerEl;
let progressEl;
let contentEl;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  quizContainer = document.getElementById('quizContainer');
  headerEl = document.getElementById('quizHeader');
  progressEl = document.getElementById('progressContainer');
  contentEl = document.getElementById('contentArea');

  // Track Meta Pixel PageView
  trackPixelEvent('PageView');

  // Start quiz
  renderQuestion();
});

/**
 * Get current section and question
 */
function getCurrentPosition() {
  const section = quizContent.sections[state.currentSectionIndex];
  const question = section ? section.questions[state.currentQuestionIndex] : null;
  return { section, question };
}

/**
 * Update progress bar
 */
function updateProgress() {
  const totalSections = quizContent.sections.length;
  const segments = progressEl.querySelectorAll('.progress-segment');
  const dots = progressEl.querySelectorAll('.progress-dot');

  segments.forEach((segment, index) => {
    segment.classList.remove('completed', 'current');
    if (index < state.currentSectionIndex) {
      segment.classList.add('completed');
    } else if (index === state.currentSectionIndex) {
      segment.classList.add('current');
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.remove('completed', 'current');
    if (index < state.currentSectionIndex) {
      dot.classList.add('completed');
    } else if (index === state.currentSectionIndex) {
      dot.classList.add('current');
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
  state.currentSectionIndex = prev.sectionIndex;
  state.currentQuestionIndex = prev.questionIndex;

  renderQuestion();
}

/**
 * Save current position to history
 */
function saveToHistory() {
  state.history.push({
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

  // Update UI elements
  updateProgress();
  updateSectionLabel();
  updateBackButton();

  // Clear content area
  contentEl.innerHTML = '';

  // Create question container
  const container = document.createElement('div');
  container.className = 'question-container';

  // Add question text
  const questionText = document.createElement('h2');
  questionText.className = 'question-text';
  questionText.textContent = question.text;
  container.appendChild(questionText);

  // Render input based on type
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

    // Check if already selected
    if (state.answers[question.id] === option.value) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      handleSingleSelect(question, option, optionsDiv);
    });

    optionsDiv.appendChild(button);
  });

  container.appendChild(optionsDiv);
}

/**
 * Handle single-select option click
 */
function handleSingleSelect(question, option, optionsDiv) {
  // Update visual selection
  optionsDiv.querySelectorAll('.option-button').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.classList.add('selected');

  // Store answer
  state.answers[question.id] = option.value;

  // Check for red flags
  if (option.redFlag) {
    state.hasRedFlags = true;
  }

  // Auto-advance after delay
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

  // Continue button
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

  const charCount = document.createElement('div');
  charCount.className = 'char-count';
  charCount.textContent = `${textarea.value.length} characters`;

  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length} characters`;
    updateTextContinueButton(question.id, textarea.value.trim());
  });

  inputDiv.appendChild(textarea);
  inputDiv.appendChild(charCount);

  // Continue button
  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.textContent = 'Continue';
  continueBtn.disabled = (state.answers[question.id] || '').length < 10;
  continueBtn.id = 'textContinueBtn';

  continueBtn.addEventListener('click', () => {
    const value = textarea.value.trim();
    if (value.length >= 10) {
      state.answers[question.id] = value;
      advanceQuestion();
    }
  });

  container.appendChild(inputDiv);
  container.appendChild(continueBtn);

  // Focus textarea
  setTimeout(() => textarea.focus(), 100);
}

/**
 * Update text input continue button state
 */
function updateTextContinueButton(questionId, value) {
  const continueBtn = document.getElementById('textContinueBtn');
  if (continueBtn) {
    continueBtn.disabled = value.length < 10;
  }
}

/**
 * Advance to next question
 */
function advanceQuestion() {
  saveToHistory();

  const { section } = getCurrentPosition();

  // Check if we need to show red flag warning after section 1
  if (section.id === 'safety' && state.currentQuestionIndex === section.questions.length - 1) {
    if (state.hasRedFlags) {
      showRedFlagWarning();
      return;
    }
  }

  // Check if we need to capture email after section 2
  if (section.id === 'symptoms' && state.currentQuestionIndex === section.questions.length - 1) {
    showEmailCapture();
    return;
  }

  // Check if we need to capture name after section 5
  if (section.id === 'impact' && state.currentQuestionIndex === section.questions.length - 1) {
    showNameCapture();
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
  showLoadingScreen();
}

/**
 * Show red flag warning screen
 */
function showRedFlagWarning() {
  // Hide progress
  progressEl.classList.add('hidden');
  headerEl.querySelector('.section-label').textContent = '';

  contentEl.innerHTML = `
    <div class="warning-screen">
      <div class="warning-icon">&#9888;</div>
      <h2>Before we continue</h2>
      <p>Based on your answers, we recommend speaking with a doctor before starting any gut protocol.</p>
      <p>This doesn't mean something is wrong - it just means your symptoms deserve professional evaluation first.</p>
      <div class="warning-actions">
        <button class="btn-secondary" id="exitBtn">I'll return after seeing my doctor</button>
        <button class="btn-primary" id="continueBtn">I've already been evaluated and cleared</button>
      </div>
    </div>
  `;

  document.getElementById('exitBtn').addEventListener('click', () => {
    // Could redirect to a thank you page or show exit message
    window.location.href = '/';
  });

  document.getElementById('continueBtn').addEventListener('click', () => {
    state.answers.red_flag_evaluated_cleared = true;
    progressEl.classList.remove('hidden');
    state.currentSectionIndex++;
    state.currentQuestionIndex = 0;
    renderQuestion();
  });
}

/**
 * Show email capture screen
 */
function showEmailCapture() {
  const { section } = getCurrentPosition();

  // Update header
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="capture-container">
      <p class="capture-label">Save your progress</p>
      <h2 class="capture-title">Where should we send your results?</h2>
      <input type="email" class="capture-input" id="emailInput" placeholder="your@email.com" />
      <div class="error-message hidden" id="emailError">Please enter a valid email address</div>
      <button class="continue-button" id="emailContinueBtn" disabled>Continue</button>
    </div>
  `;

  const emailInput = document.getElementById('emailInput');
  const continueBtn = document.getElementById('emailContinueBtn');
  const errorEl = document.getElementById('emailError');

  emailInput.addEventListener('input', () => {
    const isValid = isValidEmail(emailInput.value);
    continueBtn.disabled = !isValid;
    errorEl.classList.toggle('hidden', isValid || emailInput.value.length === 0);
  });

  continueBtn.addEventListener('click', () => {
    if (isValidEmail(emailInput.value)) {
      state.userData.email = emailInput.value.trim();

      // Track Lead event
      trackPixelEvent('Lead', {
        content_name: CONFIG.SOURCE_TRACKING,
        content_category: 'quiz'
      });

      // Move to next section
      state.currentSectionIndex++;
      state.currentQuestionIndex = 0;
      renderQuestion();
    }
  });

  // Allow Enter key
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !continueBtn.disabled) {
      continueBtn.click();
    }
  });

  setTimeout(() => emailInput.focus(), 100);
}

/**
 * Show name capture screen
 */
function showNameCapture() {
  // Update header
  document.getElementById('sectionLabel').textContent = '';

  contentEl.innerHTML = `
    <div class="capture-container">
      <h2 class="capture-title">What should we call you?</h2>
      <input type="text" class="capture-input" id="nameInput" placeholder="Your first name" />
      <button class="continue-button" id="nameContinueBtn" disabled>Continue</button>
    </div>
  `;

  const nameInput = document.getElementById('nameInput');
  const continueBtn = document.getElementById('nameContinueBtn');

  nameInput.addEventListener('input', () => {
    continueBtn.disabled = nameInput.value.trim().length < 1;
  });

  continueBtn.addEventListener('click', () => {
    if (nameInput.value.trim().length >= 1) {
      state.userData.name = nameInput.value.trim();
      showLoadingScreen();
    }
  });

  // Allow Enter key
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !continueBtn.disabled) {
      continueBtn.click();
    }
  });

  setTimeout(() => nameInput.focus(), 100);
}

/**
 * Show loading/calculating screen
 */
function showLoadingScreen() {
  // Hide header and progress
  headerEl.classList.add('hidden');
  progressEl.classList.add('hidden');

  contentEl.innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p class="loading-text">Analyzing your responses...</p>
    </div>
  `;

  // Track CompleteRegistration
  const protocol = calculateProtocol();
  trackPixelEvent('CompleteRegistration', {
    content_name: CONFIG.SOURCE_TRACKING,
    status: protocol
  });

  // Redirect after delay
  setTimeout(() => {
    redirectToOffer();
  }, CONFIG.LOADING_DURATION);
}

/**
 * Calculate protocol based on answers
 */
function calculateProtocol() {
  const data = state.answers;
  const diagnoses = data.q11_diagnosis || [];
  const tried = data.q12_tried || [];

  // SIBO history takes priority
  if (diagnoses.includes('sibo') || tried.includes('sibo_antibiotics')) {
    if (data.q13_stress === 'significant') {
      return 'Post-SIBO Recovery (with Gut-Brain support)';
    }
    return 'Post-SIBO Recovery';
  }

  // Gut-brain dominant
  if (data.q13_stress === 'significant' && data.q14_mental_health === 'yes') {
    return 'Gut-Brain Dominant';
  }

  // Primary symptom based
  switch (data.q5_primary_complaint) {
    case 'bloating':
    case 'gas':
      return 'Bloating-Dominant';
    case 'constipation':
      return 'IBS-C (Constipation-Dominant)';
    case 'diarrhea':
      return 'IBS-D (Diarrhea-Dominant)';
    case 'mixed':
      return 'IBS-M (Mixed Pattern)';
    case 'reflux':
      return 'GERD / Reflux Pattern';
    case 'pain':
      if (data.q9_stool_change === 'hard') return 'IBS-C (Constipation-Dominant)';
      if (data.q9_stool_change === 'loose') return 'IBS-D (Diarrhea-Dominant)';
      return 'IBS-M (Mixed Pattern)';
    default:
      return 'Personalized Gut Healing';
  }
}

/**
 * Redirect to offer page with tracking params
 */
function redirectToOffer() {
  const params = new URLSearchParams();

  // Source tracking - THIS IS IMPORTANT
  params.set('source', CONFIG.SOURCE_TRACKING);

  // User data
  if (state.userData.name) {
    params.set('name', state.userData.name);
  }
  if (state.userData.email) {
    params.set('email', state.userData.email);
  }

  // Protocol
  params.set('protocol_name', calculateProtocol());

  // Key answers
  if (state.answers.q5_primary_complaint) {
    params.set('primary_complaint', state.answers.q5_primary_complaint);
  }
  if (state.answers.q18_vision) {
    params.set('q18_vision', state.answers.q18_vision);
  }
  if (state.answers.q11_diagnosis) {
    params.set('diagnoses', state.answers.q11_diagnosis.join(','));
  }
  if (state.answers.q12_tried) {
    params.set('treatments', state.answers.q12_tried.join(','));
  }
  if (state.answers.q10_duration) {
    params.set('duration', state.answers.q10_duration);
  }

  window.location.href = `${CONFIG.OFFER_URL}?${params.toString()}`;
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
