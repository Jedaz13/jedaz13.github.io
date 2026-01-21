/**
 * Gut Healing Academy - Offer Page Script
 * Handles URL parameters, personalization, Stripe links, and sticky CTA
 */

(function() {
  'use strict';

  // Stripe payment links (with ?prefilled_email= support)
  // All plans include $1 7-day trial
  const STRIPE_LINKS = {
    monthly: 'https://buy.stripe.com/bJe28seyJaf8d4ch1rgA802',    // $1 trial then $47/month
    fourMonth: 'https://buy.stripe.com/cNifZigGRdrkaW45iJgA807',  // $1 trial then $149/4mo
    annual: 'https://buy.stripe.com/bJe5kEduF1IC1lu26xgA803'      // $1 trial then $297/year
  };

  // Parse URL parameters
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      name: params.get('name') || 'Friend',
      email: params.get('email') || '',
      protocol: params.get('protocol') || '',
      protocol_name: params.get('protocol_name') || 'Personalized Gut Healing',
      gut_brain: params.get('gut_brain') === 'true',
      primary_complaint: params.get('primary_complaint') || 'digestive',
      primary_complaint_label: params.get('primary_complaint_label') || '',
      duration: params.get('duration') || '',
      diagnoses: params.get('diagnoses') || '',
      treatments: params.get('treatments') || '',
      treatments_formatted: params.get('treatments_formatted') || '',
      stress_level: params.get('stress_level') || '',
      life_impact: params.get('life_impact') || '',
      vision: params.get('vision') ? decodeURIComponent(params.get('vision')) : '',
      // Legacy support
      q18_vision: params.get('q18_vision') || '',
      treatments_tried: params.get('treatments_tried') || '',
      // Quiz-3 specific
      goal_selection: params.get('goal_selection') || '',
      journey_stage: params.get('journey_stage') || ''
    };
  }

  // Store user data
  let userData = {};

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    userData = getUrlParams();

    // Store in localStorage as backup
    try {
      localStorage.setItem('gutHealingUserData', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Debug log
    console.log('Offer page params:', userData);

    // Initialize all functionality
    populatePersonalizedContent();
    populateAssessmentSection();
    populateWhyWorksSection();
    populateSocialProof();
    setupStripeLinks();
    initStickyCTA();
    initFirstWeekTimeline();
  });

  /**
   * Populate personalized content in the page
   */
  function populatePersonalizedContent() {
    // Update user name
    document.querySelectorAll('.user-name').forEach(function(el) {
      el.textContent = userData.name;
    });

    // Update protocol name
    document.querySelectorAll('.protocol-name').forEach(function(el) {
      el.textContent = userData.protocol_name;
    });

    // Update primary complaint
    document.querySelectorAll('.primary-complaint').forEach(function(el) {
      el.textContent = userData.primary_complaint;
    });

    // Show gut-brain badge if applicable
    if (userData.gut_brain) {
      const gutBrainBadge = document.getElementById('gut-brain-badge');
      if (gutBrainBadge) {
        gutBrainBadge.style.display = 'inline-block';
      }
    }

    // Show goal section if vision exists (check both new and legacy param names)
    const visionText = userData.vision || userData.q18_vision;
    if (visionText && visionText.trim() !== '') {
      const goalSection = document.getElementById('goal-section');
      const visionElement = document.querySelector('.user-vision');

      if (goalSection && visionElement) {
        visionElement.textContent = visionText;
        goalSection.style.display = 'block';
      }
    }
  }

  /**
   * Complaint labels for display
   */
  const COMPLAINT_LABELS = {
    bloating: 'Bloating & distension',
    constipation: 'Constipation',
    diarrhea: 'Diarrhea & urgency',
    mixed: 'Alternating patterns',
    pain: 'Pain & cramping',
    gas: 'Gas & discomfort',
    reflux: 'Heartburn & reflux'
  };

  /**
   * Testimonials matched to complaint patterns
   */
  const TESTIMONIALS = {
    bloating: { name: 'Suzy', photo: 'assets/suzy.png', quote: 'The bloating that made me look 6 months pregnant? Gone within 3 weeks of following my protocol.', pattern: 'Bloating Pattern' },
    constipation: { name: 'Amanda', photo: 'assets/amanda.png', quote: 'After years of struggling, I finally have regular, comfortable digestion. It changed everything.', pattern: 'Constipation Pattern' },
    diarrhea: { name: 'Cheryl', photo: 'assets/cheryl.png', quote: 'I can finally leave the house without mapping every bathroom. The urgency is completely manageable now.', pattern: 'Urgency Pattern' },
    mixed: { name: 'Cheryl', photo: 'assets/cheryl.png', quote: 'The unpredictability was the worst part. Now I actually know what to expect from my body.', pattern: 'Mixed Pattern' },
    pain: { name: 'Amanda', photo: 'assets/amanda.png', quote: 'The cramping that used to double me over? I barely notice it anymore.', pattern: 'Pain Pattern' },
    gas: { name: 'Suzy', photo: 'assets/suzy.png', quote: 'I used to avoid social situations. Now I can actually enjoy dinner with friends again.', pattern: 'Gas Pattern' },
    reflux: { name: 'Amanda', photo: 'assets/amanda.png', quote: 'No more burning, no more sleeping propped up. I can eat without fear.', pattern: 'Reflux Pattern' }
  };

  /**
   * Populate social proof section with matched testimonial
   */
  function populateSocialProof() {
    const complaint = userData.primary_complaint || 'bloating';
    const testimonial = TESTIMONIALS[complaint] || TESTIMONIALS.bloating;

    // Update testimonial
    const photoEl = document.querySelector('.social-proof-section .testimonial-photo');
    const quoteEl = document.querySelector('.social-proof-section .testimonial-quote');
    const nameEl = document.querySelector('.social-proof-section .author-name');
    const patternEl = document.querySelector('.social-proof-section .author-pattern');

    if (photoEl) photoEl.src = testimonial.photo;
    if (photoEl) photoEl.alt = testimonial.name;
    if (quoteEl) quoteEl.textContent = '"' + testimonial.quote + '"';
    if (nameEl) nameEl.textContent = '— ' + testimonial.name;
    if (patternEl) patternEl.textContent = testimonial.pattern;
  }

  /**
   * Duration labels for display
   */
  const DURATION_LABELS = {
    'less_than_6_months': 'Less than 6 months',
    '6-12_months': '6-12 months',
    '1-3_years': '1-3 years',
    '3-5_years': '3-5 years',
    '5+_years': '5+ years'
  };

  /**
   * Stress level labels for display
   */
  const STRESS_LABELS = {
    'significant': 'Significant impact identified',
    'some': 'Some connection noted',
    'none': 'Minimal connection'
  };

  /**
   * Populate the assessment revealed section
   */
  function populateAssessmentSection() {
    // Primary complaint display
    const complaintDisplay = document.querySelector('.primary-complaint-display');
    if (complaintDisplay && userData.primary_complaint) {
      // Use label from URL if available, otherwise map from key
      const label = userData.primary_complaint_label || COMPLAINT_LABELS[userData.primary_complaint] || userData.primary_complaint;
      complaintDisplay.textContent = label;
    }

    // Duration display
    const durationItem = document.getElementById('duration-item');
    const durationDisplay = document.querySelector('.duration-display');
    if (durationItem && durationDisplay && userData.duration && userData.duration.trim() !== '') {
      durationDisplay.textContent = DURATION_LABELS[userData.duration] || userData.duration.replace(/_/g, ' ');
      durationItem.style.display = 'flex';
    }

    // Diagnoses display
    const diagnosesItem = document.getElementById('diagnoses-item');
    const diagnosesDisplay = document.querySelector('.diagnoses-display');
    if (diagnosesItem && diagnosesDisplay && userData.diagnoses && userData.diagnoses.trim() !== '') {
      diagnosesDisplay.textContent = userData.diagnoses;
      diagnosesItem.style.display = 'flex';
    }

    // Treatments display (prefer formatted version)
    const treatmentsItem = document.getElementById('treatments-item');
    const treatmentsDisplay = document.querySelector('.treatments-display');
    const treatmentsText = userData.treatments_formatted || userData.treatments_tried || userData.treatments;
    if (treatmentsItem && treatmentsDisplay && treatmentsText && treatmentsText.trim() !== '') {
      treatmentsDisplay.textContent = treatmentsText;
      treatmentsItem.style.display = 'flex';
    }

    // Stress connection display (only show if significant or some)
    const stressItem = document.getElementById('stress-item');
    const stressDisplay = document.querySelector('.stress-display');
    if (stressItem && stressDisplay && userData.stress_level && userData.stress_level !== 'none') {
      stressDisplay.textContent = STRESS_LABELS[userData.stress_level] || userData.stress_level;
      stressItem.style.display = 'flex';
    }
  }

  /**
   * Treatment-specific messaging for Why This Works section
   */
  const TREATMENT_MESSAGES = {
    probiotics: {
      title: 'Probiotics alone',
      message: 'Probiotics alone can\'t work without addressing your underlying digestive patterns. We focus on creating the right environment first.'
    },
    low_fodmap: {
      title: 'Elimination diets',
      message: 'Elimination diets often fail without practitioner guidance to identify YOUR specific triggers and a clear reintroduction plan.'
    },
    gluten_free: {
      title: 'Going gluten-free',
      message: 'Going gluten-free addresses one piece of the puzzle, but your symptoms suggest a more personalized approach is needed.'
    },
    prescription: {
      title: 'Medications',
      message: 'Medications can mask symptoms temporarily — this protocol addresses the root causes so you can find lasting relief.'
    },
    fiber_supplements: {
      title: 'Fiber supplements',
      message: 'Fiber supplements help some people, but without understanding your specific patterns, they can actually make things worse.'
    },
    digestive_enzymes: {
      title: 'Digestive enzymes',
      message: 'Digestive enzymes support digestion, but they don\'t address why your system is struggling in the first place.'
    },
    herbal_remedies: {
      title: 'Herbal remedies',
      message: 'Herbal remedies can provide relief, but without a comprehensive protocol, you\'re only addressing part of the picture.'
    },
    stress_management: {
      title: 'Stress management alone',
      message: 'Stress management is crucial — and it\'s built into your protocol alongside the dietary and lifestyle changes you need.'
    }
  };

  /**
   * Populate the Why This Works section based on treatments tried
   */
  function populateWhyWorksSection() {
    const whyWorksContent = document.getElementById('why-works-content');
    if (!whyWorksContent) return;

    // Get treatments from URL params (comma-separated string)
    const treatmentsText = userData.treatments_formatted || userData.treatments_tried || userData.treatments || '';
    const treatmentsRaw = treatmentsText.toLowerCase();

    // Build dynamic content based on treatments tried
    const matchedMessages = [];

    // Check each treatment keyword
    if (treatmentsRaw.includes('probiotic')) {
      matchedMessages.push(TREATMENT_MESSAGES.probiotics);
    }
    if (treatmentsRaw.includes('fodmap') || treatmentsRaw.includes('elimination')) {
      matchedMessages.push(TREATMENT_MESSAGES.low_fodmap);
    }
    if (treatmentsRaw.includes('gluten')) {
      matchedMessages.push(TREATMENT_MESSAGES.gluten_free);
    }
    if (treatmentsRaw.includes('prescription') || treatmentsRaw.includes('medication')) {
      matchedMessages.push(TREATMENT_MESSAGES.prescription);
    }
    if (treatmentsRaw.includes('fiber')) {
      matchedMessages.push(TREATMENT_MESSAGES.fiber_supplements);
    }
    if (treatmentsRaw.includes('enzyme')) {
      matchedMessages.push(TREATMENT_MESSAGES.digestive_enzymes);
    }
    if (treatmentsRaw.includes('herbal') || treatmentsRaw.includes('natural')) {
      matchedMessages.push(TREATMENT_MESSAGES.herbal_remedies);
    }

    // If we found matching treatments, display personalized content
    if (matchedMessages.length > 0) {
      // Take up to 2 messages for readability
      const messagesToShow = matchedMessages.slice(0, 2);

      let html = '';
      messagesToShow.forEach(function(msg) {
        html += '<p><strong class="why-works-highlight">' + msg.title + ':</strong> ' + msg.message + '</p>';
      });

      // Add closing statement
      html += '<p>Your protocol is different because it\'s built specifically for <em>your</em> patterns — not generic advice that treats everyone the same.</p>';

      whyWorksContent.innerHTML = html;
    }
    // If no matches, the default content in HTML will be shown
  }

  /**
   * Initialize the First Week timeline with auto-rotate animation
   */
  function initFirstWeekTimeline() {
    const timeline = document.getElementById('first-week-timeline');
    const weekSteps = document.querySelectorAll('.week-step');

    if (!timeline || weekSteps.length === 0) return;

    let currentStep = 0;
    let autoRotateInterval = null;
    let hasBeenViewed = false;

    // Activate a specific step
    function activateStep(index) {
      weekSteps.forEach(function(step, i) {
        if (i <= index) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }

    // Auto-rotate through steps
    function startAutoRotate() {
      if (autoRotateInterval) return;

      autoRotateInterval = setInterval(function() {
        currentStep = (currentStep + 1) % weekSteps.length;

        // When cycling back to 0, briefly show all as inactive for effect
        if (currentStep === 0) {
          weekSteps.forEach(function(step) {
            step.classList.remove('active');
          });
          setTimeout(function() {
            activateStep(currentStep);
          }, 200);
        } else {
          activateStep(currentStep);
        }
      }, 3000); // Rotate every 3 seconds
    }

    // Stop auto-rotate
    function stopAutoRotate() {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    }

    // Use Intersection Observer to trigger animation when timeline comes into view
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !hasBeenViewed) {
          hasBeenViewed = true;

          // Animate steps sequentially on first view
          weekSteps.forEach(function(step, index) {
            setTimeout(function() {
              step.classList.add('active');
              currentStep = index;
            }, 300 + (index * 400));
          });

          // Start auto-rotate after initial animation completes
          setTimeout(function() {
            startAutoRotate();
          }, 300 + (weekSteps.length * 400) + 2000);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(timeline);

    // Stop auto-rotate when user hovers (desktop) or taps (mobile)
    timeline.addEventListener('mouseenter', stopAutoRotate);
    timeline.addEventListener('mouseleave', function() {
      if (hasBeenViewed) startAutoRotate();
    });

    // On mobile, stop on touch
    timeline.addEventListener('touchstart', function() {
      stopAutoRotate();
      // Resume after 5 seconds of no interaction
      setTimeout(function() {
        if (hasBeenViewed) startAutoRotate();
      }, 5000);
    }, { passive: true });
  }

  /**
   * Setup Stripe payment links with prefilled email
   */
  function setupStripeLinks() {
    const email = userData.email;
    const emailParam = email ? `?prefilled_email=${encodeURIComponent(email)}` : '';

    // Build URLs - all plans have $1 7-day trial
    const urls = {
      monthly: STRIPE_LINKS.monthly + emailParam,
      fourMonth: STRIPE_LINKS.fourMonth + emailParam,
      annual: STRIPE_LINKS.annual + emailParam
    };

    // Attach to buttons
    const btnMonthly = document.getElementById('btn-monthly');
    const btn4Month = document.getElementById('btn-4month');
    const btnAnnual = document.getElementById('btn-annual');
    const btnSticky = document.getElementById('btn-sticky');

    if (btnMonthly) {
      btnMonthly.href = urls.monthly;
      btnMonthly.addEventListener('click', function() {
        trackCheckout('monthly', 47.00);
      });
    }

    if (btn4Month) {
      btn4Month.href = urls.fourMonth;
      btn4Month.addEventListener('click', function() {
        trackCheckout('4month', 149.00);
      });
    }

    if (btnAnnual) {
      btnAnnual.href = urls.annual;
      btnAnnual.addEventListener('click', function() {
        trackCheckout('annual', 297.00);
      });
    }

    // Sticky CTA defaults to 4-month (most popular)
    if (btnSticky) {
      btnSticky.href = urls.fourMonth;
      btnSticky.addEventListener('click', function() {
        trackCheckout('4month_sticky', 149.00);
      });
    }
  }

  /**
   * Track checkout events for analytics
   */
  function trackCheckout(planType, value) {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      'event': 'begin_checkout',
      'ecommerce': {
        'currency': 'USD',
        'value': value,
        'items': [{
          'item_id': planType + '_membership',
          'item_name': planType.charAt(0).toUpperCase() + planType.slice(1) + ' Membership',
          'item_category': 'subscription',
          'price': value,
          'quantity': 1
        }]
      },
      'checkoutType': planType,
      'protocolName': userData.protocol_name,
      'primaryComplaint': userData.primary_complaint
    });
    console.log('Checkout tracking:', planType, value);
  }

  /**
   * Initialize sticky mobile CTA
   * Shows after scrolling 400px, hides when back at top
   */
  function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');
    const pricingSection = document.getElementById('pricing');

    if (!stickyCTA) return;

    // Only show on mobile (under 768px)
    function isMobile() {
      return window.innerWidth < 768;
    }

    let ticking = false;

    function updateStickyCTA() {
      if (!isMobile()) {
        stickyCTA.classList.remove('visible');
        document.body.classList.remove('has-sticky-cta');
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const pricingTop = pricingSection ? pricingSection.getBoundingClientRect().top + scrollY : 400;

      // Show after scrolling past 400px or when pricing section is in view
      if (scrollY > 400) {
        stickyCTA.classList.add('visible');
        document.body.classList.add('has-sticky-cta');
      } else {
        stickyCTA.classList.remove('visible');
        document.body.classList.remove('has-sticky-cta');
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateStickyCTA();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Listen for resize to handle orientation changes
    window.addEventListener('resize', updateStickyCTA, { passive: true });

    // Initial check
    updateStickyCTA();
  }

})();
