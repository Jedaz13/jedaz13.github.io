/**
 * Gut Healing Academy - Offer 4 Page Script
 * Two-step trial price selection with personalized checkout
 */

(function() {
  'use strict';

  // =====================================================
  // STRIPE PAYMENT LINKS
  // =====================================================
  const STRIPE_LINKS = {
    trial_1: 'https://buy.stripe.com/bJe28seyJaf8d4ch1rgA802',
    trial_5: 'https://buy.stripe.com/7sY4gA62d0Eye8g7qRgA808',
    trial_9: 'https://buy.stripe.com/14A6oI3U5drkaW4aD3gA809'
  };

  // =====================================================
  // APPLICATION STATE
  // =====================================================
  const state = {
    selectedPrice: 1,  // Default to $1
    userData: {
      name: 'Friend',
      email: '',
      protocol: '',
      protocol_name: 'Personalized Gut Healing',
      primary_complaint: '',
      primary_complaint_label: '',
      duration: '',
      treatments_tried_count: 0,
      gut_brain_score: 0,
      vision: '',
      goal_selection: '',
      journey_stage: ''
    }
  };

  // =====================================================
  // COMPLAINT LABELS
  // =====================================================
  const COMPLAINT_LABELS = {
    bloating: 'bloating',
    constipation: 'constipation',
    diarrhea: 'diarrhea',
    mixed: 'mixed symptoms',
    pain: 'abdominal pain',
    gas: 'gas',
    reflux: 'reflux'
  };

  // =====================================================
  // DURATION LABELS
  // =====================================================
  const DURATION_LABELS = {
    'less_than_6_months': 'less than 6 months',
    '6-12_months': '6-12 months',
    '1-3_years': '1-3 years',
    '3-5_years': '3-5 years',
    '5+_years': '5+ years',
    'less_than_6m': 'less than 6 months',
    '6m_1y': '6-12 months',
    '1_3y': '1-3 years',
    '3_5y': '3-5 years',
    '5y_plus': '5+ years'
  };

  // =====================================================
  // URL PARAMETER PARSING
  // =====================================================
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      name: params.get('name') || 'Friend',
      email: params.get('email') || '',
      protocol: params.get('protocol') || '',
      protocol_name: params.get('protocol_name') || 'Personalized Gut Healing Protocol',
      gut_brain: params.get('gut_brain') === 'true',
      primary_complaint: params.get('primary_complaint') || '',
      primary_complaint_label: params.get('primary_complaint_label') || '',
      duration: params.get('duration') || '',
      diagnoses: params.get('diagnoses') || '',
      treatments: params.get('treatments') || '',
      treatments_formatted: params.get('treatments_formatted') || '',
      stress_level: params.get('stress_level') || '',
      life_impact: params.get('life_impact') || '',
      vision: decodeURIComponent(params.get('vision') || ''),
      goal_selection: params.get('goal_selection') || '',
      journey_stage: params.get('journey_stage') || '',
      // Quiz-4 specific params
      treatments_tried_count: params.get('treatments_tried_count') || '',
      gut_brain_score: params.get('gut_brain_score') || ''
    };
  }

  // =====================================================
  // INITIALIZATION
  // =====================================================
  document.addEventListener('DOMContentLoaded', function() {
    const params = getUrlParams();
    console.log('Offer-4 params:', params);

    // Populate state from URL params
    state.userData = {
      name: params.name || 'Friend',
      email: params.email || '',
      protocol: params.protocol || '',
      protocol_name: params.protocol_name || 'Personalized Gut Healing Protocol',
      primary_complaint: params.primary_complaint || '',
      primary_complaint_label: params.primary_complaint_label || COMPLAINT_LABELS[params.primary_complaint] || 'digestive issues',
      duration: params.duration || '',
      treatments_tried_count: countTreatments(params),
      gut_brain_score: parseFloat(params.gut_brain_score) || 0,
      gut_brain: params.gut_brain || (parseFloat(params.gut_brain_score) >= 3.5),
      vision: params.vision || '',
      goal_selection: params.goal_selection || '',
      stress_level: params.stress_level || ''
    };

    // Initialize the page
    populateStep1();
    populateStep2();
    initPriceSelection();
    initNavigation();
    setupStripeLinks();

    // Track page view
    trackPageView();
  });

  // =====================================================
  // COUNT TREATMENTS
  // =====================================================
  function countTreatments(params) {
    // First check if treatments_tried_count is provided directly
    if (params.treatments_tried_count && !isNaN(parseInt(params.treatments_tried_count))) {
      return parseInt(params.treatments_tried_count);
    }

    // Otherwise count from treatments array
    if (params.treatments) {
      const treatmentsArray = params.treatments.split(',').filter(t => t.trim() && t.trim() !== 'nothing');
      return treatmentsArray.length;
    }

    return 0;
  }

  // =====================================================
  // POPULATE STEP 1
  // =====================================================
  function populateStep1() {
    // Greeting name
    const greetingEl = document.getElementById('greeting-name');
    if (greetingEl) {
      greetingEl.textContent = state.userData.name;
    }

    // Protocol name
    const protocolNameEl = document.getElementById('protocol-name-1');
    if (protocolNameEl) {
      protocolNameEl.textContent = state.userData.protocol_name;
    }
  }

  // =====================================================
  // POPULATE STEP 2
  // =====================================================
  function populateStep2() {
    // Complaint text
    const complaintEl = document.getElementById('complaint-text');
    if (complaintEl) {
      complaintEl.textContent = state.userData.primary_complaint_label || 'digestive issues';
    }

    // Duration text
    const durationEl = document.getElementById('duration-text');
    if (durationEl) {
      const durationText = DURATION_LABELS[state.userData.duration] || state.userData.duration || 'a while';
      durationEl.textContent = durationText;
    }

    // Treatments count
    const treatmentsCountEl = document.getElementById('treatments-count');
    if (treatmentsCountEl) {
      const count = state.userData.treatments_tried_count;
      treatmentsCountEl.textContent = count > 0 ? count : 'several';
    }

    // Protocol name in includes section
    const protocolInlineEls = document.querySelectorAll('.protocol-name-inline');
    protocolInlineEls.forEach(function(el) {
      el.textContent = state.userData.protocol_name;
    });

    // Complaint pattern
    const complaintPatternEl = document.getElementById('complaint-pattern');
    if (complaintPatternEl) {
      complaintPatternEl.textContent = state.userData.primary_complaint_label || 'your specific';
    }

    // Gut-brain section (conditional)
    const gutBrainItem = document.getElementById('gut-brain-item');
    if (gutBrainItem) {
      if (state.userData.gut_brain || state.userData.gut_brain_score >= 3.5) {
        gutBrainItem.style.display = 'flex';
        const scoreEl = document.getElementById('gut-brain-score');
        if (scoreEl) {
          scoreEl.textContent = state.userData.gut_brain_score.toFixed(1);
        }
      }
    }

    // Goal section (conditional)
    const goalSection = document.getElementById('goal-section');
    const goalTextEl = document.getElementById('goal-text');
    if (goalSection && goalTextEl && state.userData.vision) {
      goalSection.style.display = 'block';
      goalTextEl.textContent = state.userData.vision;
    }

    // Trial end date
    const trialEndEl = document.getElementById('trial-end-date');
    if (trialEndEl) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      const options = { month: 'long', day: 'numeric' };
      trialEndEl.textContent = endDate.toLocaleDateString('en-US', options);
    }
  }

  // =====================================================
  // PRICE SELECTION
  // =====================================================
  function initPriceSelection() {
    const priceButtons = document.querySelectorAll('.price-btn');

    priceButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Remove selected from all
        priceButtons.forEach(function(btn) {
          btn.classList.remove('selected');
        });

        // Add selected to clicked
        this.classList.add('selected');

        // Update state
        state.selectedPrice = parseInt(this.dataset.price);

        // Track selection
        trackPriceSelection(state.selectedPrice);
      });
    });
  }

  // =====================================================
  // NAVIGATION
  // =====================================================
  function initNavigation() {
    // Continue to Step 2
    const continueBtn = document.getElementById('continueToStep2');
    if (continueBtn) {
      continueBtn.addEventListener('click', function() {
        showStep(2);
        syncDropdownWithSelection();
        trackStepView('step2');
      });
    }

    // Custom price dropdown in Step 2
    initCustomDropdown();
  }

  function initCustomDropdown() {
    const selector = document.getElementById('priceSelector');
    const trigger = document.getElementById('priceTrigger');
    const options = document.querySelectorAll('.price-option');

    if (!selector || !trigger) return;

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      selector.classList.toggle('open');
    });

    // Handle option selection
    options.forEach(function(option) {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const newPrice = parseInt(this.dataset.value);
        state.selectedPrice = newPrice;

        // Update UI
        updateCustomDropdownUI(newPrice);
        syncStep1Buttons(newPrice);

        // Close dropdown
        selector.classList.remove('open');

        trackPriceSelection(newPrice);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!selector.contains(e.target)) {
        selector.classList.remove('open');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        selector.classList.remove('open');
      }
    });
  }

  function updateCustomDropdownUI(price) {
    // Update trigger display
    const priceValue = document.getElementById('priceValue');
    if (priceValue) {
      priceValue.textContent = '$' + price;
    }

    // Update selected state on options
    const options = document.querySelectorAll('.price-option');
    options.forEach(function(option) {
      option.classList.remove('selected');
      if (parseInt(option.dataset.value) === price) {
        option.classList.add('selected');
      }
    });
  }

  function syncDropdownWithSelection() {
    updateCustomDropdownUI(state.selectedPrice);
  }

  function syncStep1Buttons(price) {
    const priceButtons = document.querySelectorAll('.price-btn');
    priceButtons.forEach(function(btn) {
      btn.classList.remove('selected');
      if (parseInt(btn.dataset.price) === price) {
        btn.classList.add('selected');
      }
    });
  }

  function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(function(step) {
      step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.getElementById('step' + stepNumber);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  // =====================================================
  // STRIPE LINKS
  // =====================================================
  function setupStripeLinks() {
    const startBtn = document.getElementById('startProtocolBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Get the appropriate Stripe link based on selected price
        const stripeKey = 'trial_' + state.selectedPrice;
        let stripeUrl = STRIPE_LINKS[stripeKey] || STRIPE_LINKS.trial_1;

        // Append email if available
        if (state.userData.email) {
          stripeUrl += '?prefilled_email=' + encodeURIComponent(state.userData.email);
        }

        // Track checkout
        trackCheckout(state.selectedPrice);

        // Redirect to Stripe
        window.location.href = stripeUrl;
      });
    }
  }

  // =====================================================
  // ANALYTICS TRACKING
  // =====================================================
  function trackPageView() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'offer_page_view',
      'offer_version': 'offer-4',
      'source': state.userData.source || 'direct',
      'protocol': state.userData.protocol
    });
    console.log('Page view tracked');
  }

  function trackStepView(stepId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'offer_step_view',
      'offer_version': 'offer-4',
      'step_id': stepId,
      'selected_price': state.selectedPrice
    });
    console.log('Step view tracked:', stepId);
  }

  function trackPriceSelection(price) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'offer_price_selected',
      'offer_version': 'offer-4',
      'selected_price': price
    });
    console.log('Price selection tracked:', price);
  }

  function trackCheckout(price) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'begin_checkout',
      'ecommerce': {
        'currency': 'USD',
        'value': price,
        'items': [{
          'item_id': 'trial_' + price,
          'item_name': '$' + price + ' Trial',
          'item_category': 'trial',
          'price': price,
          'quantity': 1
        }]
      },
      'checkoutType': 'trial_' + price,
      'protocol': state.userData.protocol,
      'source': 'offer-4'
    });
    console.log('Checkout tracked:', price);
  }

})();
