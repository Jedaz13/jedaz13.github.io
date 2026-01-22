/**
 * Gut Healing Academy - Offer 3 Page Script
 * Dynamic content based on URL parameters, carousels, and animations
 */

(function() {
  'use strict';

  // Stripe payment links
  const STRIPE_LINKS = {
    monthly: 'https://buy.stripe.com/bJe28seyJaf8d4ch1rgA802',
    annual: 'https://buy.stripe.com/bJe5kEduF1IC1lu26xgA803'
  };

  // =====================================================
  // PROTOCOL CONTENT DATA
  // =====================================================

  const PROTOCOL_CONTENT = {
    bloat_reset: {
      name: "The Bloat Reset Protocol",
      subheadline: "Your bloating isn't about what you're eating. It's about how.",
      discovery: {
        openers: {
          probiotics: "You mentioned trying probiotics. Here's why they didn't fix this:",
          elimination_diets: "You mentioned trying elimination diets. Here's why cutting foods made it worse:",
          low_fodmap: "You mentioned trying low FODMAP. Here's why restriction didn't stop the bloating:",
          enzymes: "You mentioned trying digestive enzymes. Here's why they only helped temporarily:",
          default: "You've probably tried different foods, supplements, maybe even probiotics. Here's why they didn't work:"
        },
        body: `<p>Your gut bacteria aren't the problem. They're starving.</p>
<p>When gut bacteria don't get the right food, they can't break down what you eat. So food sits in your stomach. It ferments. Creates gas.</p>
<p>Probiotics don't fix this. They just add more hungry bacteria.</p>
<p><strong>What actually works:</strong> Feed the bacteria you already have. But there's a catch — if you do it wrong, you'll bloat more.</p>
<p>Your protocol shows you the exact foods to start with, how much, and what order. No guessing.</p>`
      }
    },
    regularity: {
      name: "The Regularity Protocol",
      subheadline: "Your gut has a \"cleaning wave\" — and it's probably turned off.",
      discovery: {
        openers: {
          probiotics: "You mentioned trying probiotics. Here's why they didn't get things moving:",
          low_fodmap: "You mentioned trying low FODMAP. Here's why restriction made things worse:",
          prescription: "You mentioned trying prescription medications. Here's why they only worked temporarily:",
          enzymes: "You mentioned trying digestive enzymes. Here's why they didn't solve the underlying problem:",
          default: "You've probably tried fiber, more water, maybe probiotics. Here's why none of it worked long-term:"
        },
        body: `<p>Your gut has a "cleaning wave" called the MMC. It sweeps waste through your system like a broom. But it only works when you're not eating.</p>
<p>Every snack — even a small one — turns it off for 90+ minutes.</p>
<p>If you're grazing throughout the day, your cleaning wave barely runs. Waste backs up. Things slow down.</p>
<p>Fiber doesn't fix this if you're eating at the wrong times. Laxatives definitely don't.</p>
<p><strong>What actually works:</strong> Specific meal timing that lets your cleaning wave run. Plus the right type of fiber — most people use the wrong kind.</p>`
      }
    },
    calm_gut: {
      name: "The Calm Gut Protocol",
      subheadline: "Even decaf triggers your symptoms. Here's why.",
      discovery: {
        openers: {
          elimination_diets: "You mentioned trying elimination diets. Here's why removing foods didn't stop the urgency:",
          probiotics: "You mentioned trying probiotics. Here's why they might have made things worse:",
          low_fodmap: "You mentioned trying low FODMAP. Here's why it helped some days but not others:",
          dairy_free: "You mentioned going dairy-free. Here's why avoiding dairy wasn't enough:",
          default: "You've probably tried avoiding certain foods or taking supplements. Here's what they missed:"
        },
        body: `<p>Your gut has speed controls. Caffeine hits those controls hard — it directly tells your gut to contract and push things through faster.</p>
<p>Even decaf. Even some herbal teas.</p>
<p>But here's the part that surprised me: meal size matters more than meal content. Large meals overwhelm your system. Small meals don't trigger the same reaction.</p>
<p>That's the opposite of what most IBS advice says (which is designed for bloating, not diarrhea).</p>
<p><strong>What actually works:</strong> Smaller meals, specific "binding" foods that slow things down, and calming your nervous system.</p>`
      }
    },
    stability: {
      name: "The Stability Protocol",
      subheadline: "Your gut has a clock. Yours is confused.",
      discovery: {
        openers: {
          low_fodmap: "You mentioned trying low FODMAP. Here's why it helped sometimes but not others:",
          elimination_diets: "You mentioned trying elimination diets. Here's why what worked one week failed the next:",
          probiotics: "You mentioned trying probiotics. Here's why they seemed to help then stop working:",
          prescription: "You mentioned trying prescription medications. Here's why they couldn't stabilize your symptoms:",
          default: "You've probably noticed that what works one day doesn't work the next. Here's why:"
        },
        body: `<p>Swinging between constipation and diarrhea with no pattern — that's actually the most frustrating version. But there's a reason it happens.</p>
<p>Your gut has its own clock. A circadian rhythm, just like your sleep cycle.</p>
<p>When you eat at random times, wake up at different hours, or skip meals unpredictably, your gut loses its rhythm. It doesn't know whether to speed up or slow down.</p>
<p>So it does both. Randomly.</p>
<p><strong>What actually works:</strong> Predictable timing. Same wake time, same meal times (within 30 minutes), every day. Before worrying about what you eat, we stabilize when you eat.</p>`
      }
    },
    rebuild: {
      name: "The Rebuild Protocol",
      subheadline: "Your SIBO treatment worked. But your gut's defense system didn't restart.",
      discovery: {
        openers: {
          herbal_antimicrobials: "You mentioned trying herbal antimicrobials after antibiotics. Here's why symptoms came back:",
          probiotics: "You mentioned trying probiotics after SIBO treatment. Here's why they weren't enough:",
          low_fodmap: "You mentioned staying on low FODMAP after treatment. Here's why restriction alone doesn't prevent relapse:",
          enzymes: "You mentioned trying digestive enzymes post-treatment. Here's the piece they were missing:",
          default: "You've been through SIBO treatment. Here's what nobody tells you about what comes next:"
        },
        body: `<p>You've been treated for SIBO. Here's what nobody tells you after treatment:</p>
<p>The antibiotics cleared the bacteria. But they didn't restart your gut's defense system.</p>
<p>That defense system is called the MMC — a "cleaning wave" that sweeps bacteria out of your small intestine. In many SIBO cases, this wave stops working properly. That's how bacteria overgrew in the first place.</p>
<p>If you don't restart it, SIBO comes back. Sometimes within weeks.</p>
<p><strong>What actually works:</strong> Strict meal spacing (no snacks — ever), a 12-14 hour overnight fast, and specific prokinetic foods that wake up your cleaning wave.</p>`
      }
    }
  };

  // =====================================================
  // TREATMENT EXPLANATIONS (WHY IT FAILED)
  // =====================================================

  const TREATMENT_EXPLANATIONS = {
    probiotics: {
      title: "Probiotics",
      text: "Probiotics add bacteria. But if your gut can't feed them, they die within days. It's like planting seeds in dead soil."
    },
    elimination_diets: {
      title: "Elimination diets",
      text: "Elimination diets remove foods. But they also remove the fiber your gut bacteria need to survive. So even when you reintroduce foods, your gut is weaker."
    },
    low_fodmap: {
      title: "Low FODMAP",
      text: "Low FODMAP helps identify triggers, but it's not meant to be permanent. Long-term restriction starves beneficial bacteria."
    },
    gluten_free: {
      title: "Gluten-free",
      text: "Going gluten-free helped some symptoms, but unless you have celiac disease, the problem likely isn't gluten itself — it's the overall digestive process."
    },
    dairy_free: {
      title: "Dairy-free",
      text: "Removing dairy might reduce some symptoms, but if the root cause is bacterial imbalance or motility issues, avoidance alone won't fix it."
    },
    enzymes: {
      title: "Digestive enzymes",
      text: "Enzymes help break down food, but if your gut motility is off or bacteria are imbalanced, enzymes only address part of the problem."
    },
    prescription: {
      title: "Prescription medications",
      text: "Medications often mask symptoms without addressing root causes. When you stop, symptoms return — sometimes worse."
    },
    sibo_antibiotics: {
      title: "SIBO antibiotics",
      text: "Antibiotics clear the overgrowth, but they don't restart your gut's defense system. Without that, SIBO often returns."
    },
    herbal_antimicrobials: {
      title: "Herbal antimicrobials",
      text: "Herbals can help clear overgrowth, but like antibiotics, they don't restart your gut's defense system. Without that, symptoms return."
    }
  };

  // =====================================================
  // TESTIMONIALS BY PROTOCOL
  // =====================================================

  const TESTIMONIALS = {
    bloat_reset: [
      {
        name: "Suzy",
        quote: "I used to dread eating. Every meal felt like a gamble — would I be okay, or would I spend the afternoon uncomfortable and bloated? The protocol taught me it wasn't about cutting out more foods. It was about feeding my gut bacteria properly. Within two weeks, I noticed my evening bloating was half what it used to be. Now I actually look forward to meals again.",
        pattern: "Bloating Pattern"
      },
      {
        name: "Amanda",
        quote: "I thought I'd tried everything for my bloating. Low FODMAP, probiotics, even prescription medications. Nothing lasted. What I didn't know was that HOW I ate mattered as much as WHAT I ate. The meal timing changes alone made a noticeable difference in the first week. Finally, something that actually makes sense.",
        pattern: "Bloating Pattern"
      },
      {
        name: "Cheryl",
        quote: "I was constantly battling bloating, low energy, and unpredictable digestion. With the protocol, I uncovered things I never knew were affecting me. For the first time in years, I feel lighter and truly in control.",
        pattern: "Bloating Pattern"
      }
    ],
    regularity: [
      {
        name: "Amanda",
        quote: "I'd tried everything for my constipation. More fiber. More water. Probiotics. Nothing moved the needle — literally. What finally worked? Meal timing. I had no idea that snacking was turning off my gut's natural cleaning system. Once I spaced my meals and let my body do its job, things started moving on their own. For the first time in years, I have a morning routine that actually works.",
        pattern: "Constipation Pattern"
      },
      {
        name: "Suzy",
        quote: "My symptoms were complex and my gut history was complicated. After following the protocol, I'm seeing significant improvement. I finally know my triggers and how to eat to feel my best. The practitioner support made all the difference — I wasn't figuring this out alone.",
        pattern: "Constipation Pattern"
      },
      {
        name: "Cheryl",
        quote: "Years of struggling and I finally found something that works. The focus on my gut's 'cleaning wave' was completely new to me — no doctor had ever explained it. Now I understand WHY things weren't working before. That knowledge is priceless.",
        pattern: "Constipation Pattern"
      }
    ],
    calm_gut: [
      {
        name: "Cheryl",
        quote: "Urgency controlled my life. I knew where every bathroom was. I couldn't travel without anxiety. I'd stopped accepting dinner invitations. The protocol showed me that meal size mattered more than I thought — and that my nervous system was making everything worse. The vagus nerve exercises sounded strange at first, but they actually work. Last month I took a road trip. Didn't think about bathrooms once.",
        pattern: "Diarrhea Pattern"
      },
      {
        name: "Suzy",
        quote: "The urgency and unpredictability were exhausting. I'd tried eliminating so many foods, but nothing helped consistently. Learning that smaller meals could calm my system down was a game-changer. And having a practitioner to message when I had questions? That support made me actually stick with it.",
        pattern: "Diarrhea Pattern"
      },
      {
        name: "Amanda",
        quote: "After years of being a yo-yo dieter trying to fix my gut, I finally found something that works. With Becca's knowledge of nutrition, I know I'm on track to keep the results. The focus on calming my nervous system alongside the diet changes made everything click.",
        pattern: "Diarrhea Pattern"
      }
    ],
    stability: [
      {
        name: "Suzy",
        quote: "The unpredictability was the worst part. One day constipation, next day diarrhea. I never knew which version of my gut I'd get. Turns out my gut needed a schedule more than it needed different foods. Same wake time, same meal times — boring, but it worked. Now my gut is predictable. I can actually plan things without backup plans for the backup plans.",
        pattern: "Mixed/Alternating Pattern"
      },
      {
        name: "Cheryl",
        quote: "I was constantly switching between problems — never the same thing twice. It made it impossible to figure out what was wrong. The timing-focused approach was different from anything I'd tried. Within a few weeks, my symptoms started following a pattern. And patterns you can work with.",
        pattern: "Mixed/Alternating Pattern"
      },
      {
        name: "Amanda",
        quote: "My gut was chaos. Some days fine, some days terrible, no rhyme or reason. The protocol didn't just tell me what to eat — it gave me structure. Regular times, regular habits. My gut finally calmed down enough to figure out what actually triggers me.",
        pattern: "Mixed/Alternating Pattern"
      }
    ],
    rebuild: [
      {
        name: "Amanda",
        quote: "After SIBO treatment, I thought I was finally done. Then symptoms crept back within a month. No one told me the antibiotics were only half the solution. This protocol focused on restarting my gut's defense system — the cleaning wave that keeps bacteria where they belong. The strict meal spacing was hard at first, but it's the only thing that's kept symptoms away long-term. Six months later, still clear.",
        pattern: "Post-SIBO Pattern"
      },
      {
        name: "Cheryl",
        quote: "I'd done two rounds of rifaximin. Both times, SIBO came back within weeks. I was starting to think I'd be on antibiotics forever. The rebuild protocol was different — it focused on preventing relapse, not just treating overgrowth. The overnight fasting and meal spacing took adjustment, but my gut feels more stable than it has in years.",
        pattern: "Post-SIBO Pattern"
      },
      {
        name: "Suzy",
        quote: "Post-SIBO life felt like walking on eggshells. Every meal was a risk. Every bloat made me panic about relapse. Having a practitioner who understood SIBO recovery specifically — and could adjust my protocol as I improved — made all the difference. I finally feel like I have a sustainable path forward.",
        pattern: "Post-SIBO Pattern"
      }
    ]
  };

  // =====================================================
  // COMPLAINT LABELS
  // =====================================================

  const COMPLAINT_LABELS = {
    bloating: 'bloating',
    constipation: 'constipation',
    diarrhea: 'diarrhea',
    mixed: 'mixed symptoms',
    pain: 'pain',
    gas: 'gas',
    reflux: 'reflux'
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
      protocol: params.get('protocol') || 'bloat_reset',
      protocol_name: params.get('protocol_name') || '',
      gut_brain: params.get('gut_brain') === 'true',
      primary_complaint: params.get('primary_complaint') || 'bloating',
      complaint: params.get('complaint') || params.get('primary_complaint') || 'bloating',
      duration: params.get('duration') || '',
      diagnoses: params.get('diagnoses') || '',
      tried: params.get('tried') || params.get('treatments') || '',
      stress_level: params.get('stress_level') || ''
    };
  }

  // Store user data
  let userData = {};

  // =====================================================
  // INITIALIZATION
  // =====================================================

  document.addEventListener('DOMContentLoaded', function() {
    userData = getUrlParams();
    console.log('Offer 3 params:', userData);

    // Initialize all functionality
    populateHeroSection();
    populateDiscoverySection();
    populateWhyFailedSection();
    populateProtocolName();
    populateTestimonials();
    initPractitionersCarousel();
    initExpectationsTimeline();
    initFirstWeekAnimation();
    initTestimonialsCarousel();
    initLightbox();
    setupStripeLinks();
    initStickyCTA();
  });

  // =====================================================
  // HERO SECTION
  // =====================================================

  function populateHeroSection() {
    const protocol = userData.protocol;
    const content = PROTOCOL_CONTENT[protocol] || PROTOCOL_CONTENT.bloat_reset;

    // Update subheadline
    const subheadlineEl = document.getElementById('hero-subheadline');
    if (subheadlineEl) {
      subheadlineEl.textContent = content.subheadline;
    }

    // Show gut-brain note if applicable
    if (userData.gut_brain) {
      const gutBrainNote = document.getElementById('hero-gut-brain-note');
      if (gutBrainNote) {
        gutBrainNote.style.display = 'block';
      }
    }
  }

  // =====================================================
  // DISCOVERY SECTION
  // =====================================================

  function populateDiscoverySection() {
    const protocol = userData.protocol;
    const content = PROTOCOL_CONTENT[protocol] || PROTOCOL_CONTENT.bloat_reset;

    // Update primary complaint text
    const complaintTexts = document.querySelectorAll('.primary-complaint-text');
    const complaintLabel = COMPLAINT_LABELS[userData.complaint] || userData.complaint;
    complaintTexts.forEach(function(el) {
      el.textContent = complaintLabel;
    });

    // Find the appropriate opener based on tried treatments
    const triedArray = userData.tried ? userData.tried.split(',').map(t => t.trim().toLowerCase()) : [];
    let openerText = content.discovery.openers.default;

    // Priority order for openers (first match wins)
    const openerPriority = ['probiotics', 'elimination_diets', 'low_fodmap', 'enzymes', 'prescription', 'dairy_free', 'herbal_antimicrobials'];

    for (const key of openerPriority) {
      if (triedArray.includes(key) && content.discovery.openers[key]) {
        openerText = content.discovery.openers[key];
        break;
      }
    }

    // Update opener
    const openerEl = document.querySelector('.opener-text');
    if (openerEl) {
      openerEl.textContent = openerText;
    }

    // Update discovery content
    const discoveryContent = document.getElementById('discovery-content');
    if (discoveryContent) {
      discoveryContent.innerHTML = content.discovery.body;
    }

    // Show gut-brain overlay if applicable
    if (userData.gut_brain) {
      const gutBrainOverlay = document.getElementById('gut-brain-overlay');
      if (gutBrainOverlay) {
        gutBrainOverlay.style.display = 'block';
      }
    }
  }

  // =====================================================
  // WHY PAST TREATMENTS FAILED SECTION
  // =====================================================

  function populateWhyFailedSection() {
    const triedArray = userData.tried ? userData.tried.split(',').map(t => t.trim().toLowerCase()) : [];

    // If nothing was tried or "nothing" is in the list, hide section
    if (triedArray.length === 0 || triedArray.includes('nothing')) {
      const section = document.getElementById('why-failed-section');
      if (section) {
        section.style.display = 'none';
      }
      return;
    }

    const container = document.getElementById('failed-treatments');
    if (!container) return;

    let html = '';
    const shownTreatments = [];

    triedArray.forEach(function(treatment) {
      const explanation = TREATMENT_EXPLANATIONS[treatment];
      if (explanation && !shownTreatments.includes(treatment)) {
        shownTreatments.push(treatment);
        html += `
          <div class="failed-item">
            <h4>${explanation.title}</h4>
            <p>${explanation.text}</p>
          </div>
        `;
      }
    });

    if (html === '') {
      // No matching treatments, hide section
      const section = document.getElementById('why-failed-section');
      if (section) {
        section.style.display = 'none';
      }
    } else {
      container.innerHTML = html;
    }
  }

  // =====================================================
  // PROTOCOL NAME
  // =====================================================

  function populateProtocolName() {
    const protocol = userData.protocol;
    const content = PROTOCOL_CONTENT[protocol] || PROTOCOL_CONTENT.bloat_reset;
    const protocolName = userData.protocol_name || content.name;

    document.querySelectorAll('.protocol-name-text').forEach(function(el) {
      el.textContent = protocolName;
    });
  }

  // =====================================================
  // TESTIMONIALS
  // =====================================================

  // Testimonial photos mapping
  const TESTIMONIAL_PHOTOS = {
    'Suzy': 'assets/suzy.png',
    'Amanda': 'assets/amanda.png',
    'Cheryl': 'assets/cheryl.png'
  };

  function populateTestimonials() {
    const protocol = userData.protocol;
    const testimonials = TESTIMONIALS[protocol] || TESTIMONIALS.bloat_reset;

    const carousel = document.getElementById('testimonials-carousel');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!carousel || !dotsContainer) return;

    let carouselHtml = '';
    let dotsHtml = '';

    testimonials.forEach(function(testimonial, index) {
      const activeClass = index === 0 ? 'active' : '';
      const photoUrl = TESTIMONIAL_PHOTOS[testimonial.name] || 'assets/suzy.png';

      carouselHtml += `
        <div class="testimonial-card ${activeClass}" data-slide="${index}">
          <div class="testimonial-header">
            <img src="${photoUrl}" alt="${testimonial.name}" class="testimonial-photo" />
            <div class="testimonial-author-info">
              <span class="author-name">— ${testimonial.name} <span class="stars">★★★★★</span></span>
              <span class="author-pattern">${testimonial.pattern}</span>
            </div>
          </div>
          <p class="testimonial-quote">"${testimonial.quote}"</p>
        </div>
      `;

      const dotActiveClass = index === 0 ? 'active' : '';
      dotsHtml += `<button class="dot ${dotActiveClass}" data-slide="${index}" aria-label="Show testimonial ${index + 1}"></button>`;
    });

    carousel.innerHTML = carouselHtml;
    dotsContainer.innerHTML = dotsHtml;
  }

  // =====================================================
  // PRACTITIONERS CAROUSEL
  // =====================================================

  function initPractitionersCarousel() {
    const slides = document.querySelectorAll('.practitioner-slide');
    const dots = document.querySelectorAll('#practitioner-dots .dot');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoAdvanceInterval = null;

    function showSlide(index) {
      slides.forEach(function(slide, i) {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
        }
      });

      dots.forEach(function(dot, i) {
        dot.classList.remove('active');
        if (i === index) {
          dot.classList.add('active');
        }
      });

      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function startAutoAdvance() {
      if (autoAdvanceInterval) return;
      autoAdvanceInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoAdvance() {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    }

    // Dot click handlers
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        showSlide(slideIndex);
        stopAutoAdvance();
        // Resume after 10 seconds
        setTimeout(startAutoAdvance, 10000);
      });
    });

    // Pause on hover
    const carousel = document.getElementById('practitioners-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoAdvance);
      carousel.addEventListener('mouseleave', startAutoAdvance);
    }

    // Start auto-advance
    startAutoAdvance();
  }

  // =====================================================
  // TESTIMONIALS CAROUSEL (Mobile only)
  // =====================================================

  function initTestimonialsCarousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('#testimonial-dots .dot');

    if (cards.length === 0 || window.innerWidth >= 768) return;

    let currentSlide = 0;
    let autoAdvanceInterval = null;

    function showSlide(index) {
      cards.forEach(function(card, i) {
        card.classList.remove('active');
        if (i === index) {
          card.classList.add('active');
        }
      });

      dots.forEach(function(dot, i) {
        dot.classList.remove('active');
        if (i === index) {
          dot.classList.add('active');
        }
      });

      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % cards.length;
      showSlide(next);
    }

    function startAutoAdvance() {
      if (autoAdvanceInterval) return;
      autoAdvanceInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoAdvance() {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    }

    // Dot click handlers
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        showSlide(slideIndex);
        stopAutoAdvance();
        setTimeout(startAutoAdvance, 10000);
      });
    });

    // Start auto-advance on mobile
    startAutoAdvance();
  }

  // =====================================================
  // EXPECTATIONS TIMELINE ANIMATION
  // =====================================================

  function initExpectationsTimeline() {
    const milestones = document.querySelectorAll('.timeline-milestone');

    if (milestones.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Animate milestones sequentially
          const milestoneIndex = parseInt(entry.target.getAttribute('data-milestone')) - 1;

          setTimeout(function() {
            entry.target.classList.add('visible');
          }, milestoneIndex * 200);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    milestones.forEach(function(milestone) {
      observer.observe(milestone);
    });
  }

  // =====================================================
  // FIRST WEEK ANIMATION
  // =====================================================

  function initFirstWeekAnimation() {
    const weekRows = document.querySelectorAll('.week-row');

    if (weekRows.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const dayIndex = parseInt(entry.target.getAttribute('data-day')) - 1;

          setTimeout(function() {
            entry.target.classList.add('visible');
          }, dayIndex * 150);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    weekRows.forEach(function(row) {
      observer.observe(row);
    });
  }

  // =====================================================
  // LIGHTBOX
  // =====================================================

  function initLightbox() {
    const previewItems = document.querySelectorAll('.preview-item[data-lightbox]');
    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!overlay || previewItems.length === 0) return;

    let currentIndex = 0;
    const images = [];

    // Collect all images and captions
    previewItems.forEach(function(item, index) {
      const imgSrc = item.getAttribute('data-lightbox');
      const caption = item.querySelector('p').textContent;
      images.push({ src: imgSrc, caption: caption });

      item.addEventListener('click', function() {
        openLightbox(index);
      });
    });

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxContent() {
      lightboxImage.src = images[currentIndex].src;
      lightboxCaption.textContent = images[currentIndex].caption;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxContent();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxContent();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!overlay.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  // =====================================================
  // STRIPE LINKS
  // =====================================================

  function setupStripeLinks() {
    const email = userData.email;
    const emailParam = email ? `?prefilled_email=${encodeURIComponent(email)}` : '';

    const urls = {
      monthly: STRIPE_LINKS.monthly + emailParam,
      annual: STRIPE_LINKS.annual + emailParam
    };

    // Monthly button
    const btnMonthly = document.getElementById('btn-monthly');
    if (btnMonthly) {
      btnMonthly.href = urls.monthly;
      btnMonthly.addEventListener('click', function() {
        trackCheckout('monthly', 47.00);
      });
    }

    // Annual button
    const btnAnnual = document.getElementById('btn-annual');
    if (btnAnnual) {
      btnAnnual.href = urls.annual;
      btnAnnual.addEventListener('click', function() {
        trackCheckout('annual', 297.00);
      });
    }

    // Final CTA button
    const btnFinal = document.getElementById('btn-final');
    if (btnFinal) {
      btnFinal.href = urls.monthly;
      btnFinal.addEventListener('click', function() {
        trackCheckout('monthly_final', 47.00);
      });
    }

    // Sticky CTA button
    const btnSticky = document.getElementById('btn-sticky');
    if (btnSticky) {
      btnSticky.href = urls.monthly;
      btnSticky.addEventListener('click', function() {
        trackCheckout('monthly_sticky', 47.00);
      });
    }
  }

  // =====================================================
  // ANALYTICS TRACKING
  // =====================================================

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
      'protocol': userData.protocol,
      'source': 'offer-3'
    });
    console.log('Checkout tracking:', planType, value);
  }

  // =====================================================
  // STICKY CTA
  // =====================================================

  function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');

    if (!stickyCTA) return;

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

      if (scrollY > 500) {
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

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateStickyCTA, { passive: true });

    updateStickyCTA();
  }

})();
