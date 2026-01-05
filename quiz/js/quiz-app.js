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
  DEFAULT_DELAY: 1000
};

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

// Redirect timer reference
let redirectTimer = null;

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

  // Collect quiz data for URL parameters
  const quizData = {
    name: state.userName || '',
    pattern: state.protocol ? state.protocol.name : '',
    goal: state.answers.q18_vision || '',
    tried: formatTreatmentsForUrl(state.answers.q12_tried),
    diagnosis: formatDiagnosesForUrl(state.answers.q11_diagnosis)
  };

  // Build URL with parameters (only include non-empty values)
  const params = new URLSearchParams();
  Object.entries(quizData).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const salesPageURL = params.toString()
    ? `${SALES_PAGE_URL}?${params.toString()}`
    : SALES_PAGE_URL;

  // Redirect to sales page (use window.top for iframe embedding)
  window.top.location.href = salesPageURL;
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

  // Monitor inputContainer for scroll indicator
  const observer = new MutationObserver(() => {
    checkInputContainerScroll();
  });
  observer.observe(inputContainer, { childList: true, subtree: true });

  // Start the quiz automatically
  startQuiz();
});

/**
 * Check if inputContainer needs scroll indicator
 */
function checkInputContainerScroll() {
  if (!inputContainer) return;

  // Check if content overflows
  const hasScroll = inputContainer.scrollHeight > inputContainer.clientHeight;
  inputContainer.classList.toggle('has-scroll', hasScroll);

  // Hide scroll indicator when scrolled to bottom
  inputContainer.addEventListener('scroll', () => {
    const isAtBottom = inputContainer.scrollHeight - inputContainer.scrollTop <= inputContainer.clientHeight + 20;
    if (isAtBottom) {
      inputContainer.classList.remove('has-scroll');
    } else if (inputContainer.scrollHeight > inputContainer.clientHeight) {
      inputContainer.classList.add('has-scroll');
    }
  }, { passive: true });
}

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
 * Process a section of the quiz content
 * @param {string} sectionKey - Key of the section in quizContent
 */
async function processSection(sectionKey) {
  if (state.isProcessing) return;
  state.isProcessing = true;
  state.currentSection = sectionKey;
  state.currentStepIndex = 0;

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
    await processStep(step);
  }

  state.isProcessing = false;
}

/**
 * Process a single step (message, question, or buttons)
 * @param {Object} step - Step object from quizContent
 */
async function processStep(step) {
  const delay = step.delay || CONFIG.DEFAULT_DELAY;

  switch (step.type) {
    case 'message':
      await showTypingIndicator(delay);
      addMessage(replaceVariables(step.content), 'rebecca', step.isWarning);
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
}

/**
 * Render multi-select checkboxes
 * @param {Array} options - Array of option objects
 */
function renderMultiSelect(options) {
  const container = document.createElement('div');
  container.className = 'options-container multi-select';

  options.forEach(option => {
    const label = document.createElement('label');
    label.className = 'checkbox-option';
    label.innerHTML = `
      <input type="checkbox" value="${option.value}">
      <span>${option.text}</span>
    `;

    label.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = label.querySelector('input');
        checkbox.checked = !checkbox.checked;
      }
      label.classList.toggle('checked', label.querySelector('input').checked);
    });

    container.appendChild(label);
  });

  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-button';
  continueBtn.textContent = 'Continue';
  container.appendChild(continueBtn);

  inputContainer.innerHTML = '';
  inputContainer.appendChild(container);
  scrollToBottom();

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

        if (step.next) {
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
        } else if (step.id === 'email' || step.id === 'exit_email') {
          state.userEmail = value;
        }

        // Handle special flow for email capture completion
        if (step.next === 'final_message') {
          // Determine protocol before final message
          state.protocol = determineProtocol(state.answers);
          state.protocol = addStressComponent(state.answers, state.protocol);
        }

        if (step.next) {
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
    .replace(/\{\{q18_vision\}\}/g, state.answers.q18_vision || '');

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
  if (sectionKey === 'results_chunk1') {
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
