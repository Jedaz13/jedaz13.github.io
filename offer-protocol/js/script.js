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
  trackPageView();
});

// =================================================
// PARAM LOADING: URL → Cookie → localStorage
// =================================================

function loadParams() {
  var urlParams = new URLSearchParams(window.location.search);
  var keys = [
    'source', 'name', 'email', 'protocol', 'protocol_name',
    'gut_brain', 'gut_brain_score', 'primary_complaint',
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

  // Personalized paragraph
  var durationText = DURATION_MAP[pageParams.duration] || pageParams.duration || 'months';
  var complaintText = COMPLAINT_MAP[pageParams.primary_complaint] || pageParams.primary_complaint || 'digestive issues';
  var visionText = pageParams.vision || 'eat without fear';

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
