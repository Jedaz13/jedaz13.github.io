/**
 * Gut Healing Academy - Offer Page Script
 * Handles URL parameters, personalization, Stripe links, and sticky CTA
 */

(function() {
  'use strict';

  // Stripe payment links (with ?prefilled_email= support)
  const STRIPE_LINKS = {
    trial: 'https://buy.stripe.com/cNifZigGRdrkaW45iJgA807',
    fourMonth: 'https://buy.stripe.com/bJe4gAaitaf8aW4dPfgA806',
    annual: 'https://buy.stripe.com/3cIaEY2Q172W3tCfXngA805'
  };

  // Parse URL parameters
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      name: params.get('name') || 'Friend',
      email: params.get('email') || '',
      protocol_name: params.get('protocol_name') || 'Personalized Gut Healing',
      primary_complaint: params.get('primary_complaint') || 'digestive',
      q18_vision: params.get('q18_vision') || '',
      diagnoses: params.get('diagnoses') || '',
      treatments_tried: params.get('treatments_tried') || ''
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
    setupStripeLinks();
    initStickyCTA();
    initTimelineAnimation();
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

    // Show goal section if q18_vision exists
    if (userData.q18_vision && userData.q18_vision.trim() !== '') {
      const goalSection = document.getElementById('goal-section');
      const visionElement = document.querySelector('.user-vision');

      if (goalSection && visionElement) {
        visionElement.textContent = userData.q18_vision;
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
   * Populate the assessment revealed section
   */
  function populateAssessmentSection() {
    // Primary complaint display
    const complaintDisplay = document.querySelector('.primary-complaint-display');
    if (complaintDisplay && userData.primary_complaint) {
      complaintDisplay.textContent = COMPLAINT_LABELS[userData.primary_complaint] || userData.primary_complaint;
    }

    // Diagnoses display
    const diagnosesItem = document.getElementById('diagnoses-item');
    const diagnosesDisplay = document.querySelector('.diagnoses-display');
    if (diagnosesItem && diagnosesDisplay && userData.diagnoses && userData.diagnoses.trim() !== '') {
      diagnosesDisplay.textContent = userData.diagnoses;
      diagnosesItem.style.display = 'flex';
    }

    // Treatments display
    const treatmentsItem = document.getElementById('treatments-item');
    const treatmentsDisplay = document.querySelector('.treatments-display');
    if (treatmentsItem && treatmentsDisplay && userData.treatments_tried && userData.treatments_tried.trim() !== '') {
      treatmentsDisplay.textContent = userData.treatments_tried;
      treatmentsItem.style.display = 'flex';
    }
  }

  /**
   * Initialize the animated timeline
   */
  function initTimelineAnimation() {
    const timeline = document.getElementById('healing-timeline');
    const progressBar = document.getElementById('timeline-progress');
    const timelinePoints = document.querySelectorAll('.timeline-point');

    if (!timeline || !progressBar) return;

    // Use Intersection Observer to trigger animation when timeline comes into view
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Start the animation
          progressBar.classList.add('animated');

          // Animate points sequentially
          timelinePoints.forEach(function(point, index) {
            setTimeout(function() {
              point.classList.add('active');
            }, 300 + (index * 600)); // Stagger by 600ms
          });

          // Unobserve after animation starts
          observer.unobserve(timeline);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(timeline);
  }

  /**
   * Setup Stripe payment links with prefilled email
   */
  function setupStripeLinks() {
    const email = userData.email;
    const emailParam = email ? `?prefilled_email=${encodeURIComponent(email)}` : '';

    // Build URLs
    const urls = {
      trial: STRIPE_LINKS.trial + emailParam,
      fourMonth: STRIPE_LINKS.fourMonth + emailParam,
      annual: STRIPE_LINKS.annual + emailParam
    };

    // Attach to buttons
    const btnTrial = document.getElementById('btn-trial');
    const btn4Month = document.getElementById('btn-4month');
    const btnAnnual = document.getElementById('btn-annual');
    const btnSticky = document.getElementById('btn-sticky');

    if (btnTrial) {
      btnTrial.href = urls.trial;
      btnTrial.addEventListener('click', function() {
        trackCheckout('trial', 1.00);
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

    if (btnSticky) {
      btnSticky.href = urls.trial;
      btnSticky.addEventListener('click', function() {
        trackCheckout('trial_sticky', 1.00);
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
