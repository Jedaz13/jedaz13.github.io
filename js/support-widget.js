/**
 * Gut Healing Academy - Support Widget
 * Self-contained, IIFE pattern for floating support chat
 *
 * Usage:
 * <link rel="stylesheet" href="/css/support-widget.css">
 * <script src="/js/support-widget.js"></script>
 */

(function() {
  'use strict';

  // =====================================================
  // Configuration - Edit these values
  // =====================================================
  const CONFIG = {
    webhookUrl: 'https://hook.eu1.make.com/5uubblyocz70syh9xptkg248ycauy5pd',
    calendlyUrl: 'https://calendly.com/gedas-guthealingacademy/gut-healing-academy-intro-meet',
    position: 'bottom-right',
    ownerName: 'Gedas',
    ownerRole: 'Founder',
    ownerAvatar: '/about/founder-gedas.png',
    bubbleDelay: 30000, // 30 seconds
    bubbleMessage: "What held you back from starting the gut health protocol today?",
    promptMessage: "What held you back from starting the gut health protocol today?"
  };

  // =====================================================
  // URL Parameter Parsing
  // =====================================================
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      name: params.get('name') || '',
      email: params.get('email') || '',
      protocol: params.get('protocol') || '',
      protocol_name: params.get('protocol_name') || '',
      gut_brain: params.get('gut_brain') === 'true',
      primary_complaint: params.get('primary_complaint') || '',
      primary_complaint_label: params.get('primary_complaint_label') || '',
      duration: params.get('duration') || '',
      diagnoses: params.get('diagnoses') || '',
      treatments: params.get('treatments') || '',
      treatments_formatted: params.get('treatments_formatted') || '',
      stress_level: params.get('stress_level') || '',
      life_impact: params.get('life_impact') || '',
      vision: params.get('vision') || '',
      goal_selection: params.get('goal_selection') || '',
      journey_stage: params.get('journey_stage') || '',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || ''
    };
  }

  // =====================================================
  // Prompt Message
  // =====================================================
  function generatePrompt() {
    return CONFIG.promptMessage;
  }

  // =====================================================
  // Widget HTML Template
  // =====================================================
  function createWidgetHTML(params, promptMessage) {
    return `
      <div class="gha-backdrop" id="gha-backdrop"></div>
      <div class="gha-support-widget" id="gha-support-widget">
        <button class="gha-widget-toggle" id="gha-toggle" aria-label="Open support chat">
          <svg class="gha-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="gha-toggle-text">Questions?</span>
        </button>

        <div class="gha-chat-bubble" id="gha-bubble">
          <button class="gha-bubble-close" id="gha-bubble-close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="gha-bubble-header">
            <img src="${CONFIG.ownerAvatar}" alt="${CONFIG.ownerName}" class="gha-bubble-avatar">
            <div>
              <div class="gha-bubble-name">${CONFIG.ownerName}</div>
              <div class="gha-bubble-role">${CONFIG.ownerRole}</div>
            </div>
          </div>
          <p class="gha-bubble-message">${CONFIG.bubbleMessage}</p>
        </div>

        <div class="gha-widget-panel" id="gha-panel">
          <div class="gha-panel-header">
            <button class="gha-close-btn" id="gha-close" aria-label="Close panel">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src="${CONFIG.ownerAvatar}" alt="${CONFIG.ownerName}" class="gha-owner-avatar">
            <div class="gha-header-info">
              <h3 class="gha-panel-title">Chat with <span class="gha-owner-name">${CONFIG.ownerName}</span></h3>
              <p class="gha-panel-subtitle">I'll personally respond via email</p>
              <div class="gha-online-badge">
                <span class="gha-online-dot"></span>
                <span>Usually replies within a few hours</span>
              </div>
            </div>
          </div>

          <div class="gha-panel-body" id="gha-panel-body">
            <div class="gha-prompt-message">
              <p>${promptMessage}</p>
            </div>

            <form class="gha-form" id="gha-form">
              <div class="gha-form-group">
                <label class="gha-form-label" for="gha-email">Your email</label>
                <input
                  type="email"
                  id="gha-email"
                  class="gha-form-input"
                  placeholder="you@example.com"
                  value="${escapeHtml(params.email)}"
                  required
                />
                <span class="gha-error-message" id="gha-email-error" style="display: none;">Please enter a valid email address</span>
              </div>

              <div class="gha-form-group">
                <label class="gha-form-label" for="gha-message">Your question</label>
                <textarea
                  id="gha-message"
                  class="gha-form-textarea"
                  placeholder="What would you like to know?"
                  required
                ></textarea>
                <span class="gha-error-message" id="gha-message-error" style="display: none;">Please enter your question</span>
              </div>

              <button type="submit" class="gha-submit-btn" id="gha-submit">
                <span id="gha-submit-text">Send Question</span>
                <span class="gha-btn-spinner" id="gha-spinner" style="display: none;"></span>
              </button>
            </form>

            <div class="gha-calendly-link">
              <a href="${CONFIG.calendlyUrl}" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Or book a call instead
              </a>
            </div>

            <div class="gha-success-state" id="gha-success">
              <div class="gha-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h4 class="gha-success-title">Question received!</h4>
              <p class="gha-success-message">I'll get back to you within 24 hours. Check your inbox for a response from ${CONFIG.ownerName}.</p>
              <a href="${CONFIG.calendlyUrl}" target="_blank" rel="noopener noreferrer" class="gha-success-cta">
                Want faster? Book a call
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =====================================================
  // Utility Functions
  // =====================================================
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // =====================================================
  // Webhook Submission
  // =====================================================
  async function submitToWebhook(email, message, params) {
    const payload = {
      email: email,
      name: params.name || '',
      message: message,
      protocol: params.protocol,
      protocol_name: params.protocol_name,
      primary_complaint: params.primary_complaint,
      primary_complaint_label: params.primary_complaint_label,
      duration: params.duration,
      diagnoses: params.diagnoses,
      treatments_formatted: params.treatments_formatted,
      stress_level: params.stress_level,
      life_impact: params.life_impact,
      gut_brain: params.gut_brain,
      goal_selection: params.goal_selection,
      journey_stage: params.journey_stage,
      page_url: window.location.href,
      source: params.source,
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      submitted_at: new Date().toISOString()
    };

    const response = await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Webhook submission failed');
    }

    return response;
  }

  // =====================================================
  // Widget Controller
  // =====================================================
  function initWidget() {
    const params = getUrlParams();
    const promptMessage = generatePrompt(params);

    // Inject widget HTML into page
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = createWidgetHTML(params, promptMessage);
    document.body.appendChild(widgetContainer);

    // Get DOM references
    const widget = document.getElementById('gha-support-widget');
    const toggle = document.getElementById('gha-toggle');
    const panel = document.getElementById('gha-panel');
    const closeBtn = document.getElementById('gha-close');
    const backdrop = document.getElementById('gha-backdrop');
    const form = document.getElementById('gha-form');
    const emailInput = document.getElementById('gha-email');
    const messageInput = document.getElementById('gha-message');
    const emailError = document.getElementById('gha-email-error');
    const messageError = document.getElementById('gha-message-error');
    const submitBtn = document.getElementById('gha-submit');
    const submitText = document.getElementById('gha-submit-text');
    const spinner = document.getElementById('gha-spinner');
    const panelBody = document.getElementById('gha-panel-body');
    const successState = document.getElementById('gha-success');
    const bubble = document.getElementById('gha-bubble');
    const bubbleClose = document.getElementById('gha-bubble-close');

    let isOpen = false;
    let bubbleDismissed = false;
    let bubbleTimeout = null;

    // Toggle panel open/close
    function openPanel() {
      isOpen = true;
      toggle.classList.add('gha-active');
      panel.classList.add('gha-open');
      widget.classList.add('gha-panel-open');
      backdrop.classList.add('gha-visible');
      hideBubble();
      messageInput.focus();
    }

    function closePanel() {
      isOpen = false;
      toggle.classList.remove('gha-active');
      panel.classList.remove('gha-open');
      widget.classList.remove('gha-panel-open');
      backdrop.classList.remove('gha-visible');
    }

    function togglePanel() {
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }

    // Bubble functions
    function showBubble() {
      if (!bubbleDismissed && !isOpen) {
        bubble.classList.add('gha-visible');
      }
    }

    function hideBubble() {
      bubble.classList.remove('gha-visible');
      bubbleDismissed = true;
      if (bubbleTimeout) {
        clearTimeout(bubbleTimeout);
        bubbleTimeout = null;
      }
    }

    // Start bubble timer
    bubbleTimeout = setTimeout(showBubble, CONFIG.bubbleDelay);

    // Event listeners
    toggle.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    // Bubble event listeners
    bubble.addEventListener('click', function(e) {
      if (e.target !== bubbleClose && !bubbleClose.contains(e.target)) {
        hideBubble();
        openPanel();
      }
    });

    bubbleClose.addEventListener('click', function(e) {
      e.stopPropagation();
      hideBubble();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    });

    // Form validation and submission
    function clearErrors() {
      emailInput.classList.remove('gha-error');
      messageInput.classList.remove('gha-error');
      emailError.style.display = 'none';
      messageError.style.display = 'none';
    }

    function validateForm() {
      clearErrors();
      let isValid = true;

      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        emailInput.classList.add('gha-error');
        emailError.style.display = 'block';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageInput.classList.add('gha-error');
        messageError.style.display = 'block';
        isValid = false;
      }

      return isValid;
    }

    function setLoading(loading) {
      submitBtn.disabled = loading;
      submitText.style.display = loading ? 'none' : 'inline';
      spinner.style.display = loading ? 'inline-block' : 'none';
    }

    function showSuccess() {
      panelBody.classList.add('gha-form-hidden');
      successState.classList.add('gha-visible');
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);

      try {
        await submitToWebhook(
          emailInput.value.trim(),
          messageInput.value.trim(),
          params
        );
        showSuccess();

        // Track in GTM if available
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'support_widget_submit',
            widget_source: params.source
          });
        }
      } catch (error) {
        console.error('Support widget submission error:', error);
        // Show a simple error state
        alert('Something went wrong. Please try again or book a call instead.');
      } finally {
        setLoading(false);
      }
    });

    // Clear errors on input
    emailInput.addEventListener('input', function() {
      if (emailInput.classList.contains('gha-error')) {
        emailInput.classList.remove('gha-error');
        emailError.style.display = 'none';
      }
    });

    messageInput.addEventListener('input', function() {
      if (messageInput.classList.contains('gha-error')) {
        messageInput.classList.remove('gha-error');
        messageError.style.display = 'none';
      }
    });

    // Track widget open in GTM
    toggle.addEventListener('click', function() {
      if (!isOpen && window.dataLayer) {
        window.dataLayer.push({
          event: 'support_widget_open',
          widget_source: params.source
        });
      }
    });
  }

  // =====================================================
  // Initialize when DOM is ready
  // =====================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
