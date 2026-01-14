/**
 * Gut Healing Academy - Sales Page JavaScript
 * Features: URL params, Personalization, Smooth scroll, Sticky CTA, FAQ accordion, Lazy loading
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    populatePersonalizedContent();
    initProtocolHeroImage();
    initStickyHeader();
    initStickyCTA();
    initSmoothScroll();
    initFaqAccordion();
    initLazyLoading();
    initCheckoutTracking();
  }

  /**
   * Populate Personalized Content
   * Updates page elements with quiz data from URL parameters
   * Reading params inside this function ensures URL is fully loaded
   */
  function populatePersonalizedContent() {
    // Read URL parameters from quiz redirect (inside DOMContentLoaded for reliability)
    var urlParams = new URLSearchParams(window.location.search);
    var userName = urlParams.get('name') || 'Friend';
    var gutPattern = urlParams.get('pattern') || 'your identified pattern';
    var userGoal = urlParams.get('goal') || 'digestive freedom';
    var triedBefore = urlParams.get('tried') || 'various approaches';
    var diagnosis = urlParams.get('diagnosis') || '';

    // Auto-update month for cohort
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    var currentMonth = months[new Date().getMonth()];

    // Calculate trial end date (7 days from now)
    var trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    var trialEndFormatted = trialEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    // Debug: Log values to console (remove in production if needed)
    console.log('Personalization params:', {
      name: userName,
      pattern: gutPattern,
      goal: userGoal,
      tried: triedBefore,
      diagnosis: diagnosis,
      rawSearch: window.location.search
    });

    // Update all personalized elements
    document.querySelectorAll('.user-name').forEach(function(el) {
      el.textContent = userName;
    });

    document.querySelectorAll('.gut-pattern').forEach(function(el) {
      el.textContent = gutPattern;
    });

    document.querySelectorAll('.user-goal').forEach(function(el) {
      el.textContent = userGoal;
    });

    document.querySelectorAll('.tried-before').forEach(function(el) {
      el.textContent = triedBefore;
    });

    document.querySelectorAll('.cohort-month').forEach(function(el) {
      el.textContent = currentMonth;
    });

    document.querySelectorAll('.trial-end-date').forEach(function(el) {
      el.textContent = trialEndFormatted;
    });

    // Show diagnosis section only if diagnosis exists
    if (diagnosis) {
      document.querySelectorAll('.diagnosis-text').forEach(function(el) {
        el.textContent = diagnosis;
      });
      document.querySelectorAll('.diagnosis-section').forEach(function(el) {
        el.style.display = 'block';
      });
    }

    // Check if user is coming from members area (in-trial variant)
    var source = urlParams.get('source');
    var referrer = document.referrer;
    var isInTrial = source === 'members' || referrer.includes('app.guthealingacademy.com');

    if (isInTrial) {
      // Update pricing section header for in-trial users
      var pricingHeader = document.getElementById('pricing-header');
      if (pricingHeader) {
        pricingHeader.textContent = "Don't Lose Your Access";
      }

      var pricingIntro1 = document.getElementById('pricing-intro-1');
      if (pricingIntro1) {
        pricingIntro1.textContent = "Your trial is ending soon. Lock in your founding member rate now — and keep your personal practitioner, protocols, and progress.";
      }

      var pricingIntro2 = document.getElementById('pricing-intro-2');
      if (pricingIntro2) {
        pricingIntro2.textContent = "Cancel anytime, get your money back. We believe in our program that much.";
      }
    }
  }

  /**
   * Dynamic Protocol Hero Image
   * Displays the appropriate hero image based on URL "pattern" parameter
   * Matches gut pattern names from quiz to corresponding images
   * Defaults to bloating image if no parameter or invalid value
   */
  function initProtocolHeroImage() {
    var urlParams = new URLSearchParams(window.location.search);
    var pattern = urlParams.get('pattern') || '';

    // Normalize pattern for matching (lowercase, remove special chars)
    var normalizedPattern = pattern.toLowerCase();

    // Pattern images with corresponding alt text
    var patternImages = {
      'diarrhea': {
        src: 'assets/Minimalist-Diarrhea.png',
        alt: 'Minimalist illustration showing digestive calm - Diarrhea-Dominant Pattern'
      },
      'constipation': {
        src: 'assets/Minimalist-constipation.png',
        alt: 'Minimalist illustration showing gentle digestive awakening - Constipation-Dominant Pattern'
      },
      'mixed': {
        src: 'assets/Minimalist-mixed.png',
        alt: 'Minimalist illustration showing digestive balance - Mixed Pattern'
      },
      'bloating': {
        src: 'assets/Minimalist-Bloating.png',
        alt: 'Minimalist illustration showing digestive relief - Bloating Pattern'
      },
      'post-sibo': {
        src: 'assets/Minimalist-Post-SIBO-recovert.png',
        alt: 'Minimalist illustration showing digestive renewal - Post-SIBO Recovery Pattern'
      },
      'gut-brain': {
        src: 'assets/Minimalist-gut-brain.png',
        alt: 'Minimalist illustration showing gut-brain connection - Gut-Brain Pattern'
      }
    };

    // Get the hero image element
    var heroImage = document.getElementById('protocol-image');
    if (!heroImage) return;

    // Determine which image to display based on pattern keywords
    var imageData = null;

    // Check pattern for keywords to determine correct image
    if (normalizedPattern.includes('diarrhea')) {
      imageData = patternImages['diarrhea'];
    } else if (normalizedPattern.includes('constipation')) {
      imageData = patternImages['constipation'];
    } else if (normalizedPattern.includes('mixed')) {
      imageData = patternImages['mixed'];
    } else if (normalizedPattern.includes('bloating')) {
      imageData = patternImages['bloating'];
    } else if (normalizedPattern.includes('post-sibo') || normalizedPattern.includes('sibo')) {
      imageData = patternImages['post-sibo'];
    } else if (normalizedPattern.includes('gut-brain') || normalizedPattern.includes('gut brain')) {
      imageData = patternImages['gut-brain'];
    } else {
      // Default to bloating if no match
      imageData = patternImages['bloating'];
    }

    // Update the image src and alt attributes
    heroImage.src = imageData.src;
    heroImage.alt = imageData.alt;

    // Debug: Log the selected pattern image
    console.log('Pattern image:', {
      pattern: pattern || 'default (bloating)',
      normalizedPattern: normalizedPattern,
      src: imageData.src,
      alt: imageData.alt
    });
  }

  /**
   * Sticky Header
   * Adds 'scrolled' class when page is scrolled past threshold
   */
  function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const scrollThreshold = 50;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  /**
   * Sticky CTA
   * Shows sticky CTA after scrolling past hero section
   * Uses scroll events for better compatibility with embedded contexts (iframes)
   */
  function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero-section');

    if (!stickyCTA || !heroSection) return;

    // Use scroll-based approach for better iframe/embed compatibility
    let ticking = false;

    function updateStickyCTA() {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        // Hero is out of view - show sticky CTA
        stickyCTA.classList.add('visible');
        document.body.classList.add('has-sticky-cta');
      } else {
        // Hero is in view - hide sticky CTA
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

    // Listen for scroll events on window
    window.addEventListener('scroll', onScroll, { passive: true });

    // Also listen for scroll on document for embedded contexts
    document.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    updateStickyCTA();

    // Re-check periodically for embedded contexts where scroll events might not fire properly
    // This ensures the sticky bar shows up even in problematic iframe scenarios
    setInterval(updateStickyCTA, 500);
  }

  /**
   * Smooth Scroll
   * Handles anchor links with smooth scrolling behavior
   */
  function initSmoothScroll() {
    // Get all anchor links that point to sections on this page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || href === '') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          // Get header height for offset (if header exists)
          const header = document.getElementById('header');
          const headerHeight = header ? header.offsetHeight : 0;

          // Calculate target position with offset
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  /**
   * FAQ Accordion
   * Toggle FAQ items open/closed on click
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');

      if (question) {
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');

          // Close all other items (optional: remove these lines for multi-open behavior)
          faqItems.forEach(function(otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherQuestion = otherItem.querySelector('.faq-question');
              if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
              }
            }
          });

          // Toggle current item
          item.classList.toggle('active');
          question.setAttribute('aria-expanded', !isActive);
        });

        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
          }
        });
      }
    });
  }

  /**
   * Lazy Loading
   * Uses native lazy loading with Intersection Observer fallback
   */
  function initLazyLoading() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported - images with loading="lazy" will work automatically
      return;
    }

    // Fallback for browsers without native lazy loading support
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (lazyImages.length === 0) return;

    // Check for Intersection Observer support
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;

            // If there's a data-src, use it; otherwise the src is already set
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }

            img.removeAttribute('loading');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Very old browser fallback - just load all images
      lazyImages.forEach(function(img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }

  /**
   * Checkout Tracking
   * Tracks begin_checkout events when users click pricing CTAs
   */
  function initCheckoutTracking() {
    // Get URL params for user data
    var urlParams = new URLSearchParams(window.location.search);
    var gutPattern = urlParams.get('pattern') || '';
    var source = urlParams.get('source') || '';
    var referrer = document.referrer;
    var isInTrial = source === 'members' || referrer.includes('app.guthealingacademy.com');

    // Monthly pricing button ($1 trial → $47/month)
    var monthlyBtn = document.querySelector('a[href*="bJe28seyJaf8d4ch1rgA802"]');
    if (monthlyBtn) {
      monthlyBtn.addEventListener('click', function() {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'begin_checkout',
          'ecommerce': {
            'currency': 'USD',
            'value': 1.00,
            'items': [{
              'item_id': 'monthly_membership_trial',
              'item_name': 'Monthly Membership ($1 Trial)',
              'item_category': 'subscription',
              'price': 47.00,
              'trial_price': 1.00,
              'quantity': 1
            }]
          },
          'checkoutType': 'monthly',
          'userStatus': isInTrial ? 'trial' : 'anonymous',
          'gutPattern': gutPattern,
          'trialDaysRemaining': null
        });
        console.log('Checkout tracking: Monthly membership trial');
      });
    }

    // Annual pricing button ($1 trial → $297/year)
    var annualBtn = document.querySelector('a[href*="bJe5kEduF1IC1lu26xgA803"]');
    if (annualBtn) {
      annualBtn.addEventListener('click', function() {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'begin_checkout',
          'ecommerce': {
            'currency': 'USD',
            'value': 1.00,
            'items': [{
              'item_id': 'annual_membership_trial',
              'item_name': 'Annual Membership ($1 Trial)',
              'item_category': 'subscription',
              'price': 297.00,
              'trial_price': 1.00,
              'quantity': 1
            }]
          },
          'checkoutType': 'annual',
          'userStatus': isInTrial ? 'trial' : 'anonymous',
          'gutPattern': gutPattern,
          'trialDaysRemaining': null
        });
        console.log('Checkout tracking: Annual membership trial');
      });
    }
  }

})();
