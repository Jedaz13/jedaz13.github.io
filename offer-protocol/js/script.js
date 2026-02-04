// =================================================
// PROTOCOL CHECKOUT PAGE — Script
// =================================================

// Stripe Payment Links (protocol-specific)
var STRIPE_LINKS = {
  'regularity': 'https://buy.stripe.com/3cI7sM62d5YS2pyfXngA80g',
  'bloat_reset': 'https://buy.stripe.com/aFacN6aitaf8ggobH7gA80f',
  'calm_gut': 'https://buy.stripe.com/4gMdRacqB870c08bH7gA80e',
  'stability': 'https://buy.stripe.com/aFabJ2ait5YS1lu3aBgA80d',
  'rebuild': 'https://buy.stripe.com/fZucN60HTcng8NW26xgA80c',
  'survival_guide': 'https://buy.stripe.com/9B64gA2Q1af8d4ccLbgA80b',
  'meal_plan': 'https://buy.stripe.com/cNi14o62dgDwc08aD3gA80a'
};

// Checkout API endpoint
var CHECKOUT_API = 'https://app.guthealingacademy.com/api/create-checkout';

// =================================================
// PROTOCOL CONTENT DATA
// =================================================

var PROTOCOL_CONTENT = {
  'Bloating-Dominant': {
    key: 'bloat_reset',
    headline: "You wake up flat. By 2pm your jeans don't button. By dinner you look 6 months pregnant. And the worst part — nobody around you understands why you can't \"just eat normal.\"",
    outcome: [
      "Imagine eating dinner without unbuttoning your jeans by dessert.",
      "Imagine your stomach staying flat past 2pm.",
      "Imagine saying yes to dinner plans without doing mental math about what's \"safe\" to order."
    ],
    cards: [
      { title: "The 20-Minute Meal Rule", desc: "Fast eating causes air swallowing that directly bloats you. This single change often shows results in 2-3 days." },
      { title: "Your Personal FODMAP Triggers", desc: "Not a generic list. The specific fermentable carbs most likely causing YOUR bloating, based on your symptom pattern." },
      { title: "Meal Spacing Protocol", desc: "Your gut has a cleaning wave (MMC) that only works when you stop snacking. We show you exactly how to activate it." },
      { title: "7-Day Tracking System", desc: "See your bloating patterns mapped out. Most women spot their #1 trigger by Day 4." }
    ]
  },
  'Constipation-Dominant': {
    key: 'regularity',
    headline: "You sit there every morning. Phone in hand. Waiting. Straining. Nothing. Then you carry that heaviness with you all day — the brain fog, the low energy, the bloating that isn't even from gas. It's from everything that isn't moving.",
    outcome: [
      "Imagine mornings where you actually go — completely, comfortably, without straining or scrolling your phone for 30 minutes.",
      "Imagine not carrying the heaviness and brain fog that comes from days of nothing moving."
    ],
    cards: [
      { title: "The Hydration Protocol", desc: "Not \"drink more water.\" A specific morning routine that activates motility within the first hour of waking." },
      { title: "Soluble Fiber Stacking", desc: "The right fibers in the right amounts. Too much makes it worse. We give you the exact progression." },
      { title: "Magnesium Support", desc: "The type, dose, and timing that works for IBS-C specifically (not the generic stuff that causes cramping)." },
      { title: "Movement Triggers", desc: "3 specific post-meal movements that stimulate your colon. Takes 5 minutes." }
    ]
  },
  'Diarrhea-Dominant': {
    key: 'calm_gut',
    headline: "You've already mapped the bathrooms. The ones at work, the ones on your commute, the ones at the restaurant you're afraid to say yes to. You eat and within 20 minutes your body decides it's an emergency. Every. Single. Time.",
    outcome: [
      "Imagine leaving the house without mapping every bathroom on your route.",
      "Imagine a road trip without panic.",
      "Imagine eating a meal and trusting — actually trusting — that your body won't betray you 20 minutes later."
    ],
    cards: [
      { title: "Trigger Elimination Map", desc: "The 5 categories making urgency worse (caffeine is obvious, #3 surprises everyone)." },
      { title: "Binding Food Protocol", desc: "BRAT+ foods that slow transit time without making you feel deprived." },
      { title: "S. boulardii Protocol", desc: "The specific probiotic strain studied for IBS-D, with exact dosing." },
      { title: "Vagus Nerve Reset", desc: "5-minute practices that calm the gut-brain panic response driving urgency." }
    ]
  },
  'Mixed-Alternating': {
    key: 'stability',
    headline: "Monday you can't go. Wednesday you can't stop. You never know which version of your gut you're waking up to — so you plan for both, trust neither, and live in this exhausting middle ground where nothing is predictable.",
    outcome: [
      "Imagine your body picking a lane.",
      "Imagine knowing what to expect when you eat instead of this exhausting coin flip between constipation and urgency.",
      "Imagine waking up and not wondering \"which version of my gut am I getting today?\""
    ],
    cards: [
      { title: "Foundation Foods List", desc: "12 \"middle ground\" foods that won't swing you either direction." },
      { title: "State-Based Adjustments", desc: "Trending constipation? Do this. Trending diarrhea? Do that. A decision tree for your daily reality." },
      { title: "Fixed Schedule Protocol", desc: "Same times, same structure. Your unpredictable gut needs predictable inputs." },
      { title: "Pattern Tracking", desc: "C/D/N logging that reveals your triggers within the first week." }
    ]
  },
  'Post-SIBO Recovery': {
    key: 'rebuild',
    headline: "You finished treatment. You were supposed to be better. But every time you eat something new, you're holding your breath — waiting to see if the bloating comes back, if the bacteria are growing again, if the last 6 months of treatment were for nothing.",
    outcome: [
      "Imagine finishing treatment and STAYING better.",
      "Imagine eating without fear that every bite is feeding the bacteria back.",
      "Imagine the relief of knowing you have a relapse prevention plan that actually accounts for how SIBO works."
    ],
    cards: [
      { title: "MMC Activation Protocol", desc: "Meal spacing that keeps the cleaning wave working so bacteria can't re-colonize." },
      { title: "Gentle Reintroduction Plan", desc: "Day-by-day food reintroduction that catches reactions before they become full relapses." },
      { title: "PHGG Protocol", desc: "Partially hydrolyzed guar gum: the specific prebiotic that feeds good bacteria without feeding SIBO." },
      { title: "Relapse Early Warning System", desc: "The 3 symptoms that signal SIBO is coming back, and what to do immediately." }
    ]
  },
  'Gut-Brain': {
    key: 'calm_gut',
    headline: "Your gut doesn't just digest food. It digests your stress, your anxiety, your deadlines, your arguments. A bad email at 10am becomes stomach cramps by noon. And when the cramps start, the anxiety about the cramps makes everything worse.",
    outcome: [
      "Imagine your stomach not clenching every time your boss sends a message.",
      "Imagine stress hitting you without your gut immediately reacting.",
      "Imagine breaking the cycle where anxiety triggers symptoms and symptoms trigger more anxiety."
    ],
    cards: [
      { title: "Vagus Nerve Activation", desc: "4-7-8 breathing, cold exposure, gargling. Specific practices that interrupt the stress\u2192gut loop." },
      { title: "Pre-Meal Calming Ritual", desc: "60-second reset before eating that prevents stress from hijacking your digestion." },
      { title: "Stress Interception Training", desc: "Catch stress BEFORE it reaches your gut. The lag between stress and symptoms is your window." },
      { title: "Gut-Brain Tracking", desc: "Map the connection between your stress levels and gut symptoms. Most women see the pattern within 3 days." }
    ]
  }
};

// Duration display mapping
var DURATION_MAP = {
  'less_than_6_months': 'less than 6 months',
  '6-12_months': '6-12 months',
  '1-3_years': '1-3 years',
  '3-5_years': '3-5 years',
  '5+_years': 'over 5 years'
};

// Complaint display mapping
var COMPLAINT_MAP = {
  'bloating': 'bloating',
  'constipation': 'constipation',
  'diarrhea': 'diarrhea',
  'mixed': 'mixed symptoms',
  'pain': 'gut pain',
  'gas': 'gas and discomfort',
  'reflux': 'reflux'
};

// =================================================
// STATE
// =================================================

var pageParams = {};
var bumpState = { 1: false, 2: false };
var checkoutInProgress = false;

// =================================================
// INITIALIZATION
// =================================================

document.addEventListener('DOMContentLoaded', function() {
  pageParams = loadParams();
  storeData(pageParams);
  restoreBumpState();
  populatePage();
  populateTestimonial();
  initStickyCta();
  trackPageView();
});

// =================================================
// PARAM LOADING: URL → Cookie → localStorage
// =================================================

function loadParams() {
  var urlParams = new URLSearchParams(window.location.search);
  var keys = [
    'source', 'name', 'email', 'protocol', 'protocol_name',
    'gut_brain', 'gut_brain_score', 'gut_type', 'primary_complaint',
    'primary_complaint_label', 'duration', 'diagnoses',
    'treatments', 'treatments_formatted', 'treatments_tried_count',
    'stress_level', 'life_impact', 'vision',
    'goal_selection', 'journey_stage'
  ];

  var data = {};
  var hasUrlParams = urlParams.has('protocol_name') || urlParams.has('name');

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = '';

    // 1. URL params first
    if (urlParams.has(key)) {
      val = urlParams.get(key) || '';
      // Decode vision if it was double-encoded
      if (key === 'vision' && val) {
        try { val = decodeURIComponent(val); } catch (e) {}
      }
    }

    // 2. Cookie fallback (only if no URL params present)
    if (!val && !hasUrlParams) {
      val = getCookie('gha_' + key) || '';
    }

    // 3. localStorage fallback (only if no URL params present)
    if (!val && !hasUrlParams) {
      try { val = localStorage.getItem('gha_' + key) || ''; } catch (e) {}
    }

    data[key] = val;
  }

  // Convert gut_brain to boolean
  data.gut_brain = data.gut_brain === 'true';

  return data;
}

function getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i].trim();
    if (c.indexOf(name + '=') === 0) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return '';
}

// =================================================
// DATA PERSISTENCE
// =================================================

function storeData(data) {
  // LocalStorage
  try {
    for (var key in data) {
      if (data[key] !== '' && data[key] !== false) {
        localStorage.setItem('gha_' + key, typeof data[key] === 'boolean' ? data[key].toString() : data[key]);
      }
    }
  } catch (e) {
    console.log('localStorage not available');
  }

  // 30-day cookie
  try {
    var expires = new Date();
    expires.setDate(expires.getDate() + 30);
    var cookieExpiry = '; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax';
    for (var key in data) {
      if (data[key] !== '' && data[key] !== false) {
        var val = typeof data[key] === 'boolean' ? data[key].toString() : data[key];
        document.cookie = 'gha_' + key + '=' + encodeURIComponent(val) + cookieExpiry;
      }
    }
  } catch (e) {
    console.log('Cookies not available');
  }
}

// =================================================
// BUMP STATE PERSISTENCE
// =================================================

function saveBumpState() {
  try {
    localStorage.setItem('gha_bump1', bumpState[1] ? '1' : '0');
    localStorage.setItem('gha_bump2', bumpState[2] ? '1' : '0');
  } catch (e) {}
}

function restoreBumpState() {
  try {
    var b1 = localStorage.getItem('gha_bump1');
    var b2 = localStorage.getItem('gha_bump2');
    if (b1 === '1') {
      bumpState[1] = true;
      document.getElementById('bump1').classList.add('checked');
    }
    if (b2 === '1') {
      bumpState[2] = true;
      document.getElementById('bump2').classList.add('checked');
    }
  } catch (e) {}
}

// =================================================
// PROTOCOL HERO IMAGES
// =================================================

var PROTOCOL_IMAGES = {
  'bloat_reset': 'assets/Minimalist-Bloating.png',
  'regularity': 'assets/Minimalist-constipation.png',
  'calm_gut': 'assets/Minimalist-Diarrhea.png',
  'stability': 'assets/Minimalist-mixed.png',
  'rebuild': 'assets/Minimalist-Post-SIBO-recovert.png'
};

var COMPLAINT_IMAGES = {
  'bloating': 'assets/Minimalist-Bloating.png',
  'constipation': 'assets/Minimalist-constipation.png',
  'diarrhea': 'assets/Minimalist-Diarrhea.png',
  'mixed': 'assets/Minimalist-mixed.png',
  'pain': 'assets/Minimalist-mixed.png',
  'gas': 'assets/Minimalist-Bloating.png',
  'reflux': 'assets/Minimalist-constipation.png'
};

// =================================================
// PAGE POPULATION
// =================================================

function populatePage() {
  var protocolName = pageParams.protocol_name || 'Personalized';
  var name = pageParams.name || 'Friend';
  var content = PROTOCOL_CONTENT[protocolName];

  // If no exact match, try to find by protocol key
  if (!content) {
    for (var pName in PROTOCOL_CONTENT) {
      if (PROTOCOL_CONTENT[pName].key === pageParams.protocol) {
        content = PROTOCOL_CONTENT[pName];
        protocolName = pName;
        break;
      }
    }
  }

  // Fallback to Bloating-Dominant if no match
  if (!content) {
    content = PROTOCOL_CONTENT['Bloating-Dominant'];
    protocolName = 'Bloating-Dominant';
  }

  // Section 1: Headline
  document.getElementById('userName').textContent = name;
  document.getElementById('protocolNameHeadline').textContent = protocolName;
  document.getElementById('protocolHeadlineCopy').innerHTML = '<p>' + content.headline + '</p>';

  // Hero protocol image
  var heroImg = document.getElementById('heroProtocolImg');
  if (heroImg) {
    var imgSrc;
    if (pageParams.gut_brain === 'true') {
      imgSrc = 'assets/Minimalist-gut-brain.png';
    } else {
      imgSrc = PROTOCOL_IMAGES[content.key] || COMPLAINT_IMAGES[pageParams.primary_complaint] || 'assets/Minimalist-Bloating.png';
    }
    heroImg.src = imgSrc;
    heroImg.alt = protocolName + ' Protocol';
  }

  // Personalized paragraph
  var durationText = DURATION_MAP[pageParams.duration] || pageParams.duration || 'months';
  var complaintText = COMPLAINT_MAP[pageParams.primary_complaint] || pageParams.primary_complaint || 'digestive issues';
  var GOAL_MAP = {
    'comfortable_eating': 'eat comfortably without fear',
    'bathroom_freedom': 'stop mapping every bathroom before leaving the house',
    'energy_focus': 'have energy and mental clarity again',
    'understanding': 'finally understand what\'s going on in your gut'
  };
  var visionText = pageParams.vision || GOAL_MAP[pageParams.goal_selection] || 'eat without fear';

  var personalizedHtml = '<p>After ' + durationText + ' of ' + complaintText + ' — the restrictive diets that stole your social life, the doctors who said it\'s nothing, the supplements sitting half-empty in your cabinet — you deserve something that actually works for YOUR body.</p>';
  personalizedHtml += '<p>You told us you want to <strong>' + visionText + '</strong>. That\'s not too much to ask. And it starts with understanding exactly what\'s happening in YOUR gut — not someone else\'s.</p>';
  document.getElementById('personalizedParagraph').innerHTML = personalizedHtml;

  // Section 2: Outcome painting
  var outcomeHtml = '';
  for (var i = 0; i < content.outcome.length; i++) {
    outcomeHtml += '<p>' + content.outcome[i] + '</p>';
  }
  document.getElementById('outcomeCard').innerHTML = outcomeHtml;

  // Section 3: What's inside
  document.getElementById('protocolNameInside').textContent = protocolName + ' Protocol';

  var cardsHtml = '';
  for (var j = 0; j < content.cards.length; j++) {
    var card = content.cards[j];
    cardsHtml += '<div class="content-card"><h3>' + card.title + '</h3><p>' + card.desc + '</p></div>';
  }
  document.getElementById('contentCards').innerHTML = cardsHtml;

  // Section 4: Treatments count
  var countText = pageParams.treatments_tried_count || 'several';
  document.getElementById('treatmentsCount').textContent = countText;

  // Section 5: Pricing
  document.getElementById('protocolNameOffer').textContent = protocolName + ' Protocol';
  document.getElementById('protocolNameBump').textContent = protocolName;
  document.getElementById('summaryProtocolName').textContent = 'Your ' + protocolName + ' Protocol';

  // FAQ: personalize answers
  document.getElementById('faqMultipleAnswer').innerHTML = 'Your quiz identified <strong>' + protocolName + '</strong> as your PRIMARY pattern. The protocol addresses your dominant symptoms first — because trying to fix everything at once is exactly why generic programs fail.';
  document.getElementById('faqDifferentAnswer').innerHTML = 'Those programs give everyone the same advice. You get a protocol built specifically for <strong>' + protocolName + '</strong> patterns — not bloating advice when your problem is diarrhea, not fiber recommendations when fiber makes you worse. Rebecca and Paulina have built this from clinical practice, not a Google search.';

  updateOrderSummary();
}

// =================================================
// BUMP TOGGLE & ORDER SUMMARY
// =================================================

function toggleBump(num) {
  bumpState[num] = !bumpState[num];
  var card = document.getElementById('bump' + num);
  if (bumpState[num]) {
    card.classList.add('checked');
  } else {
    card.classList.remove('checked');
  }
  saveBumpState();
  updateOrderSummary();
}

function updateOrderSummary() {
  var total = 47;

  var bump1Line = document.getElementById('summaryBump1');
  var bump2Line = document.getElementById('summaryBump2');

  if (bumpState[1]) {
    total += 19;
    bump1Line.classList.add('visible');
  } else {
    bump1Line.classList.remove('visible');
  }

  if (bumpState[2]) {
    total += 37;
    bump2Line.classList.add('visible');
  } else {
    bump2Line.classList.remove('visible');
  }

  document.getElementById('orderTotal').textContent = '$' + total;
  document.getElementById('ctaButton').textContent = 'Get My Protocol \u2014 $' + total;

  // Sync sticky CTA
  var stickyBtn = document.getElementById('stickyCtaButton');
  if (stickyBtn) {
    stickyBtn.textContent = 'Get My Protocol \u2014 $' + total;
  }
}

// =================================================
// CHECKOUT
// =================================================

function handleCheckout() {
  // Prevent double-clicks but allow retries
  if (checkoutInProgress) return;
  checkoutInProgress = true;

  var btn = document.getElementById('ctaButton');
  var originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Processing...';

  // Track checkout click
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'checkout_click',
    'protocol': pageParams.protocol_name,
    'include_survival_guide': bumpState[1],
    'include_meal_plan': bumpState[2],
    'total_value': 47 + (bumpState[1] ? 19 : 0) + (bumpState[2] ? 37 : 0)
  });

  // Store total for thank-you page tracking
  try {
    localStorage.setItem('gha_purchase_total', (47 + (bumpState[1] ? 19 : 0) + (bumpState[2] ? 37 : 0)).toString());
  } catch (e) {}

  var payload = {
    email: pageParams.email,
    name: pageParams.name,
    protocol_name: pageParams.protocol_name,
    protocol: pageParams.protocol,
    primary_complaint: pageParams.primary_complaint,
    duration: pageParams.duration,
    treatments_tried_count: pageParams.treatments_tried_count,
    gut_brain_score: pageParams.gut_brain_score,
    vision: pageParams.vision,
    include_survival_guide: bumpState[1],
    include_meal_plan: bumpState[2]
  };

  fetch(CHECKOUT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (!res.ok) throw new Error('Checkout failed: ' + res.status);
    return res.json();
  })
  .then(function(data) {
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  })
  .catch(function(err) {
    console.error('Checkout error:', err);
    // Fallback: use Stripe Payment Links directly
    fallbackToPaymentLink();
  })
  .finally(function() {
    // Always re-enable the button so they can retry
    checkoutInProgress = false;
    btn.disabled = false;
    btn.textContent = originalText;
  });
}

function fallbackToPaymentLink() {
  var protocolName = pageParams.protocol_name || 'Bloating-Dominant';
  var content = PROTOCOL_CONTENT[protocolName];

  // Try to find content by protocol key if name didn't match
  if (!content) {
    for (var pName in PROTOCOL_CONTENT) {
      if (PROTOCOL_CONTENT[pName].key === pageParams.protocol) {
        content = PROTOCOL_CONTENT[pName];
        break;
      }
    }
  }

  var protocolKey = content ? content.key : 'bloat_reset';
  var link = STRIPE_LINKS[protocolKey];

  if (link && pageParams.email) {
    link += '?prefilled_email=' + encodeURIComponent(pageParams.email);
  }

  if (link) {
    window.location.href = link;
  }
}

// =================================================
// FAQ ACCORDION
// =================================================

function toggleFaq(item) {
  var isOpen = item.classList.contains('open');

  // Close all others
  var allItems = document.querySelectorAll('.faq-item');
  for (var i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove('open');
  }

  // Toggle clicked
  if (!isOpen) {
    item.classList.add('open');
  }
}

// =================================================
// TESTIMONIAL DATA
// =================================================

var TESTIMONIALS = {
  bloating: {
    name: 'Suzy',
    photo: 'assets/suzy.png',
    quote: "I used to look 6 months pregnant by dinner every single night. Within the first week of following the protocol, I could actually button my jeans after eating. By week 3, the daily bloating was gone. I cried the first time I wore a fitted dress to dinner.",
    label: 'Suzy, bloating for 4+ years'
  },
  constipation: {
    name: 'Amanda',
    photo: 'assets/amanda.png',
    quote: "I went from going once every 4-5 days — with straining, pain, and brain fog — to comfortable, regular mornings. The protocol didn't just tell me to 'eat more fiber.' It gave me a system that actually worked for MY body. I wish I'd found this years ago.",
    label: 'Amanda, constipation for 3 years'
  },
  diarrhea: {
    name: 'Cheryl',
    photo: 'assets/cheryl.png',
    quote: "I had every bathroom mapped within a 10-mile radius. I couldn't drive more than 20 minutes without planning stops. After the protocol, I went on a road trip — a ROAD TRIP — without a single emergency. That was the moment I knew my life had actually changed.",
    label: 'Cheryl, urgency and diarrhea for 5+ years'
  },
  mixed: {
    name: 'Cheryl',
    photo: 'assets/cheryl.png',
    quote: "Some days I couldn't go at all. Other days I couldn't stop. The unpredictability was the worst part — I never knew which body I was waking up to. The protocol gave me stability I didn't think was possible. My gut finally picked a lane.",
    label: 'Cheryl, mixed IBS symptoms'
  },
  pain: {
    name: 'Amanda',
    photo: 'assets/amanda.png',
    quote: "The cramping would hit out of nowhere — sometimes so bad I'd have to lie on the floor at work. The protocol helped me identify my exact triggers and gave me a plan. Within two weeks, the cramping episodes dropped from daily to maybe once a week.",
    label: 'Amanda, chronic gut pain'
  },
  gas: {
    name: 'Suzy',
    photo: 'assets/suzy.png',
    quote: "I stopped accepting dinner invitations because of the gas. The embarrassment was constant. The protocol showed me exactly which foods were fermenting and the meal spacing trick alone cut my symptoms in half within days.",
    label: 'Suzy, gas and discomfort'
  },
  reflux: {
    name: 'Amanda',
    photo: 'assets/amanda.png',
    quote: "I was afraid to eat anything because the burning would start within minutes. Sleeping propped up, avoiding everything acidic, living on antacids. The protocol gave me a structured approach and within 3 weeks I was eating meals without fear again.",
    label: 'Amanda, chronic reflux'
  }
};

// =================================================
// TESTIMONIAL POPULATION
// =================================================

function populateTestimonial() {
  var complaint = pageParams.primary_complaint || 'bloating';
  var testimonial = TESTIMONIALS[complaint] || TESTIMONIALS['bloating'];

  var html = '<div class="testimonial-author-row">';
  html += '<img src="' + testimonial.photo + '" alt="' + testimonial.name + '" class="testimonial-photo">';
  html += '<div class="testimonial-stars">';
  for (var i = 0; i < 5; i++) {
    html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#E07A5F" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  }
  html += '</div></div>';
  html += '<blockquote class="testimonial-quote">"' + testimonial.quote + '"</blockquote>';
  html += '<p class="testimonial-label">' + testimonial.label + '</p>';

  document.getElementById('testimonialCard').innerHTML = html;
}

// =================================================
// STICKY CTA
// =================================================

function initStickyCta() {
  var stickyCta = document.getElementById('stickyCta');
  var ctaButton = document.getElementById('ctaButton');
  if (!stickyCta || !ctaButton) return;

  function checkScroll() {
    var ctaRect = ctaButton.getBoundingClientRect();
    var windowHeight = window.innerHeight;

    // Show sticky when main CTA is scrolled out of view (either above or below viewport)
    if (ctaRect.bottom < 0 || ctaRect.top > windowHeight) {
      stickyCta.classList.add('visible');
      document.body.classList.add('has-sticky-cta');
    } else {
      stickyCta.classList.remove('visible');
      document.body.classList.remove('has-sticky-cta');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

// =================================================
// GTM TRACKING
// =================================================

function trackPageView() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'offer_protocol_view',
    'protocol': pageParams.protocol_name,
    'source': pageParams.source,
    'primary_complaint': pageParams.primary_complaint
  });
}
