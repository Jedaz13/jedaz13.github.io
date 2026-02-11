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

// Map primary_complaint to PROTOCOL_CONTENT key
var COMPLAINT_TO_PROTOCOL = {
  'bloating': 'Bloating-Dominant',
  'constipation': 'Constipation-Dominant',
  'diarrhea': 'Diarrhea-Dominant',
  'mixed': 'Mixed-Alternating',
  'pain': 'Mixed-Alternating',
  'gas': 'Bloating-Dominant',
  'reflux': 'Constipation-Dominant'
};

// Map keywords found in protocol_name to PROTOCOL_CONTENT key
var PROTOCOL_NAME_KEYWORDS = {
  'bloat': 'Bloating-Dominant',
  'regularity': 'Constipation-Dominant',
  'calm': 'Diarrhea-Dominant',
  'stability': 'Mixed-Alternating',
  'rebuild': 'Post-SIBO Recovery',
  'sibo': 'Post-SIBO Recovery',
  'brain': 'Gut-Brain'
};

// Duration display mapping
var DURATION_MAP = {
  'less_than_6_months': 'less than 6 months',
  '6-12_months': '6-12 months',
  '6_12_months': '6-12 months',
  '1-3_years': '1-3 years',
  '1_3_years': '1-3 years',
  '3-5_years': '3-5 years',
  '3_5_years': '3-5 years',
  '5+_years': 'over 5 years',
  '5_years': 'over 5 years'
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

// Friendly protocol display names (no "Diarrhea-Dominant" etc.)
var FRIENDLY_PROTOCOL_NAMES = {
  'bloat_reset': 'Bloat Reset Protocol',
  'regularity': 'Constipation Relief Protocol',
  'calm_gut': 'Calm Gut Protocol',
  'stability': 'Gut Balance Protocol',
  'rebuild': 'Post-SIBO Recovery Protocol'
};

function getFriendlyProtocolName(protocolKey, isGutBrain) {
  if (isGutBrain) return 'Gut-Brain Reset Protocol';
  return FRIENDLY_PROTOCOL_NAMES[protocolKey] || 'Personalized Gut Healing Protocol';
}

function processDreamOutcome(vision) {
  if (!vision || vision.length < 4) return null;
  var throwaway = ['idk', 'yes', 'no', 'na', 'n/a', 'none', 'nothing', 'dunno', 'not sure', 'dont know', "don't know", 'no idea', 'idc', 'ok', 'okay'];
  var trimmed = vision.trim().toLowerCase();
  if (throwaway.indexOf(trimmed) !== -1) return null;
  var text = vision.replace(/<[^>]*>/g, '').trim();
  text = text.replace(/\.+$/, '');
  if (text.length > 0) {
    text = text.charAt(0).toLowerCase() + text.substring(1);
  }
  if (text.length > 80) {
    var cut = text.substring(0, 80);
    var lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 40) cut = cut.substring(0, lastSpace);
    text = cut + '...';
  }
  if (text.length < 4) return null;
  return text;
}

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
  clearBumpState();
  updateOrderSummary();
  populatePage();
  populateTestimonial();
  populateSecondarySymptoms();
  populateDayComparison();
  populateDreamOutcome();
  populateTreatmentsValidation();
  populateStressAcknowledgment();
  populateLifeImpact();
  initStickyCta();
  trackPageView();
});

// Reset state when page is restored from bfcache (browser back/forward)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Page was restored from bfcache — reset checkout state
    checkoutInProgress = false;
    var btn = document.getElementById('ctaButton');
    var stickyBtn = document.getElementById('stickyCtaButton');
    if (btn) {
      btn.disabled = false;
    }
    if (stickyBtn) {
      stickyBtn.disabled = false;
    }
    // Re-sync bump state from DOM and update summary
    bumpState[1] = document.getElementById('bump1').classList.contains('checked');
    bumpState[2] = document.getElementById('bump2').classList.contains('checked');
    updateOrderSummary();
  }
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
    'stress_level', 'stress_connection', 'life_impact', 'vision',
    'goal_selection', 'journey_stage', 'secondary_symptoms'
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
  var urlParams = new URLSearchParams(window.location.search);
  var hasUrlParams = urlParams.has('protocol_name') || urlParams.has('name');

  // LocalStorage
  try {
    for (var key in data) {
      if (data[key] !== '' && data[key] !== false) {
        localStorage.setItem('gha_' + key, typeof data[key] === 'boolean' ? data[key].toString() : data[key]);
      } else if (hasUrlParams) {
        // Clear stale values when fresh URL params are present
        localStorage.removeItem('gha_' + key);
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
    var pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
    for (var key in data) {
      if (data[key] !== '' && data[key] !== false) {
        var val = typeof data[key] === 'boolean' ? data[key].toString() : data[key];
        document.cookie = 'gha_' + key + '=' + encodeURIComponent(val) + cookieExpiry;
      } else if (hasUrlParams) {
        // Clear stale cookies when fresh URL params are present
        document.cookie = 'gha_' + key + '=; expires=' + pastDate + '; path=/; SameSite=Lax';
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

function clearBumpState() {
  // Bumps should NOT be pre-selected by default
  bumpState[1] = false;
  bumpState[2] = false;
  document.getElementById('bump1').classList.remove('checked');
  document.getElementById('bump2').classList.remove('checked');
  try {
    localStorage.removeItem('gha_bump1');
    localStorage.removeItem('gha_bump2');
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
// RESOLVE PROTOCOL KEY HELPER
// =================================================

function resolveProtocolKey() {
  // 1. Explicit protocol param from URL
  if (pageParams.protocol) {
    return pageParams.protocol;
  }

  // 2. Exact protocol_name match in PROTOCOL_CONTENT
  if (pageParams.protocol_name && PROTOCOL_CONTENT[pageParams.protocol_name]) {
    return PROTOCOL_CONTENT[pageParams.protocol_name].key;
  }

  // 3. Keyword match in protocol_name
  if (pageParams.protocol_name) {
    var lowerName = pageParams.protocol_name.toLowerCase();
    for (var keyword in PROTOCOL_NAME_KEYWORDS) {
      if (lowerName.indexOf(keyword) !== -1) {
        var mappedProtocol = PROTOCOL_NAME_KEYWORDS[keyword];
        return PROTOCOL_CONTENT[mappedProtocol].key;
      }
    }
  }

  // 4. Match by primary_complaint
  if (pageParams.primary_complaint && COMPLAINT_TO_PROTOCOL[pageParams.primary_complaint]) {
    var complaintProtocol = COMPLAINT_TO_PROTOCOL[pageParams.primary_complaint];
    return PROTOCOL_CONTENT[complaintProtocol].key;
  }

  // 5. Fallback
  return 'bloat_reset';
}

// =================================================
// SECONDARY SYMPTOMS COPY DATA
// =================================================

var SECONDARY_SYMPTOM_LABELS = {
  'bloating': 'Bloating & distension',
  'constipation': 'Constipation',
  'diarrhea': 'Diarrhea or urgency',
  'alternating': 'Alternating patterns',
  'pain': 'Abdominal pain or cramping',
  'gas': 'Excessive gas',
  'brain_fog': 'Brain fog or fatigue',
  'anxiety_food': 'Anxiety around food or eating out'
};

var SECONDARY_SYMPTOM_COPY = {
  'bloat_reset': {
    'constipation': "Bloating and constipation share the same gut motility triggers. When we fix your meal timing and FODMAP triggers, bowel regularity typically improves within the first 2 weeks.",
    'diarrhea': "Reactive bloating and loose stools often come from the same FODMAP triggers. Your protocol identifies which specific carbs are causing both responses.",
    'alternating': "The alternating pattern means your gut motility is dysregulated. The meal spacing protocol directly targets this by activating your MMC (migrating motor complex).",
    'pain': "Abdominal cramping with bloating usually signals fermentation from specific trigger foods. Your FODMAP identification process targets exactly this.",
    'gas': "Excessive gas and bloating are two sides of the same coin \u2014 both caused by fermentation of undigested carbs. Your trigger identification resolves both simultaneously.",
    'brain_fog': "Gut-brain axis disruption from bloating directly causes brain fog. Women on this protocol typically report clearer thinking within the first week of reducing their triggers.",
    'anxiety_food': "Food anxiety is a natural response to unpredictable symptoms. As you identify your specific triggers, you\u2019ll rebuild confidence because you\u2019ll know exactly what\u2019s safe for YOUR gut."
  },
  'regularity': {
    'bloating': "Constipation-related bloating happens because food sits too long in your gut and ferments. As your motility improves, the bloating resolves naturally.",
    'diarrhea': "Overflow diarrhea after constipation is more common than you\u2019d think. Regulating your motility stabilizes both ends of the spectrum.",
    'alternating': "Your gut is swinging between extremes because motility is dysregulated. The hydration and fiber protocol stabilizes this pattern.",
    'pain': "Cramping with constipation is your gut trying to move things that aren\u2019t moving. Improving motility reduces the cramping within days.",
    'gas': "Gas buildup from slow transit is common with constipation. As things start moving, gas reduces significantly.",
    'brain_fog': "Slow gut transit means toxins stay in your system longer, directly causing brain fog. Most women report mental clarity improving alongside regularity.",
    'anxiety_food': "When you can\u2019t predict how your body will respond, eating becomes stressful. Your protocol gives you a clear framework so you know what to expect."
  },
  'calm_gut': {
    'bloating': "Diarrhea-related bloating comes from gut inflammation and malabsorption. Your binding food protocol addresses both the urgency and the bloating.",
    'constipation': "Swinging from diarrhea to constipation means your gut motility needs stabilizing, not just slowing down. Your protocol addresses the underlying pattern.",
    'alternating': "The alternating pattern responds well to the binding foods and probiotic approach in your protocol \u2014 it regulates in both directions.",
    'pain': "Urgency-related cramping reduces as your gut lining calms down. S. boulardii in your protocol specifically targets this inflammation.",
    'gas': "Diarrhea and excessive gas both signal malabsorption. As your gut heals and absorption improves, gas reduces naturally.",
    'brain_fog': "Nutrient malabsorption from frequent diarrhea directly causes brain fog and fatigue. As absorption improves, energy and clarity follow.",
    'anxiety_food': "The fear of urgency after eating is one of the most isolating parts of this condition. Your protocol\u2019s trigger elimination map gives you back control over meals."
  },
  'stability': {
    'bloating': "Alternating patterns almost always come with bloating because your gut motility is unpredictable. Stabilizing the pattern resolves the bloating.",
    'constipation': "The constipation phases of your pattern respond to the middle-ground foods in your protocol \u2014 not too stimulating, not too binding.",
    'diarrhea': "The diarrhea phases are addressed through the same motility regulation \u2014 your protocol targets the underlying instability, not just one direction.",
    'pain': "Cramping happens when your gut rapidly switches between modes. The middle-foods approach reduces these transitions.",
    'gas': "Gas fluctuations match your alternating pattern. As motility stabilizes, gas normalizes too.",
    'brain_fog': "The unpredictability of alternating symptoms creates chronic stress on your gut-brain axis. Stabilizing your pattern directly improves mental clarity.",
    'anxiety_food': "Not knowing which version of your gut will show up today is exhausting. Your protocol creates predictability so you can plan meals with confidence."
  },
  'rebuild': {
    'bloating': "Post-treatment bloating usually means your gut flora hasn\u2019t fully stabilized. The PHGG protocol specifically rebuilds the balance that prevents fermentation-driven bloating.",
    'constipation': "After SIBO treatment, motility often slows as your gut recalibrates. The MMC activation protocol directly addresses this.",
    'diarrhea': "Post-treatment loose stools signal your gut is still healing. The gentle reintroduction plan avoids overwhelming your recovering system.",
    'alternating': "Instability after treatment is common. Your protocol\u2019s structured reintroduction creates the predictability your gut needs to stabilize.",
    'pain': "Post-treatment sensitivity means your gut is still inflamed. The gentle food reintroduction protocol minimizes irritation while healing continues.",
    'gas': "Residual gas after treatment often means bacterial balance isn\u2019t fully restored. PHGG feeds the right bacteria to crowd out the gas-producers.",
    'brain_fog': "Post-treatment brain fog is usually from incomplete gut flora restoration. As your microbiome rebuilds, mental clarity returns.",
    'anxiety_food': "Fear of relapse makes every meal stressful. Your relapse early warning system removes the guesswork so you can eat with confidence."
  }
};

// =================================================
// PAGE POPULATION
// =================================================

function populatePage() {
  var protocolName = pageParams.protocol_name || 'Personalized';
  var name = pageParams.name || 'Friend';
  var content = PROTOCOL_CONTENT[protocolName];

  // If no exact match, try to find by protocol key
  if (!content && pageParams.protocol) {
    for (var pName in PROTOCOL_CONTENT) {
      if (PROTOCOL_CONTENT[pName].key === pageParams.protocol) {
        content = PROTOCOL_CONTENT[pName];
        protocolName = pName;
        break;
      }
    }
  }

  // Try matching by keywords in the protocol_name URL param
  if (!content && pageParams.protocol_name) {
    var lowerName = pageParams.protocol_name.toLowerCase();
    for (var keyword in PROTOCOL_NAME_KEYWORDS) {
      if (lowerName.indexOf(keyword) !== -1) {
        protocolName = PROTOCOL_NAME_KEYWORDS[keyword];
        content = PROTOCOL_CONTENT[protocolName];
        break;
      }
    }
  }

  // Try matching by primary_complaint
  if (!content && pageParams.primary_complaint) {
    var mappedName = COMPLAINT_TO_PROTOCOL[pageParams.primary_complaint];
    if (mappedName && PROTOCOL_CONTENT[mappedName]) {
      protocolName = mappedName;
      content = PROTOCOL_CONTENT[protocolName];
    }
  }

  // Fallback to Bloating-Dominant if no match
  if (!content) {
    content = PROTOCOL_CONTENT['Bloating-Dominant'];
    protocolName = 'Bloating-Dominant';
  }

  // Section 1: Headline
  document.getElementById('userName').textContent = name;

  // Friendly protocol display name (no "Diarrhea-Dominant" etc.)
  var friendlyName = getFriendlyProtocolName(content.key, pageParams.gut_brain);
  var friendlyShort = friendlyName.replace(' Protocol', '');

  // Subtitle with friendly protocol name
  var subtitleEl = document.getElementById('heroSubtitle');
  if (subtitleEl) {
    subtitleEl.innerHTML = 'Your <strong>' + friendlyName + '</strong> is ready \u2014 built by registered practitioners for your specific symptom pattern.';
  }

  // Protocol headline copy — just the visceral pain paragraph, clean and punchy
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

  // Bridge section — duration empathy, personalized content, dream callback
  // These elements sit just below the fold, bridging into the Imagine block
  var durationText = DURATION_MAP[pageParams.duration] || pageParams.duration || 'months';
  var complaintText = COMPLAINT_MAP[pageParams.primary_complaint] || pageParams.primary_complaint || 'digestive issues';
  var GOAL_MAP = {
    'comfortable_eating': 'eat comfortably without fear',
    'bathroom_freedom': 'stop mapping every bathroom before leaving the house',
    'energy_focus': 'have energy and mental clarity again',
    'understanding': 'finally understand what\'s going on in your gut'
  };
  var visionText = pageParams.vision || GOAL_MAP[pageParams.goal_selection] || 'eat without fear';
  var hasDreamCallback = pageParams.vision && pageParams.vision.length >= 5;

  // Duration empathy line leads this section
  var durationEmpathy = DURATION_EMPATHY[pageParams.duration];
  var bridgeHtml = '';
  if (durationEmpathy) {
    bridgeHtml += '<p class="duration-empathy">' + durationEmpathy + '</p>';
  }
  bridgeHtml += '<p>After ' + durationText + ' of ' + complaintText + ' \u2014 the restrictive diets that stole your social life, the doctors who said it\'s nothing, the supplements sitting half-empty in your cabinet \u2014 you deserve something that actually works for YOUR body.</p>';
  if (!hasDreamCallback) {
    bridgeHtml += '<p>You told us you want to <strong>' + visionText + '</strong>. That\'s not too much to ask. And it starts with understanding exactly what\'s happening in YOUR gut \u2014 not someone else\'s.</p>';
  } else {
    bridgeHtml += '<p>It starts with understanding exactly what\'s happening in YOUR gut \u2014 not someone else\'s.</p>';
  }
  document.getElementById('personalizedParagraph').innerHTML = bridgeHtml;

  // Section 2: Outcome painting
  var outcomeHtml = '';
  for (var i = 0; i < content.outcome.length; i++) {
    outcomeHtml += '<p>' + content.outcome[i] + '</p>';
  }
  document.getElementById('outcomeCard').innerHTML = outcomeHtml;

  // Section 3: What's inside
  document.getElementById('protocolNameInside').textContent = friendlyName;

  var cardsHtml = '';
  for (var j = 0; j < content.cards.length; j++) {
    var card = content.cards[j];
    cardsHtml += '<div class="content-card"><h3>' + card.title + '</h3><p>' + card.desc + '</p></div>';
  }
  document.getElementById('contentCards').innerHTML = cardsHtml;

  // Section 4: Treatments count — hide entire first paragraph if count is 0 or missing
  var countRaw = pageParams.treatments_tried_count;
  var countNum = parseInt(countRaw, 10);
  var stakesFirstP = document.getElementById('treatmentsCount')?.closest('p');
  if (!countRaw || countRaw === '0' || countNum === 0 || isNaN(countNum)) {
    // Hide the paragraph that mentions "0 approaches"
    if (stakesFirstP) stakesFirstP.style.display = 'none';
  } else {
    var treatmentsCountEl = document.getElementById('treatmentsCount');
    if (treatmentsCountEl) treatmentsCountEl.textContent = countRaw;
  }

  // Section 5: Pricing
  document.getElementById('protocolNameOffer').textContent = friendlyName;
  document.getElementById('protocolNameBump').textContent = friendlyShort;
  document.getElementById('summaryProtocolName').textContent = 'Your ' + friendlyName;

  // FAQ: personalize answers
  document.getElementById('faqMultipleAnswer').innerHTML = 'Your quiz identified your primary pattern and built the <strong>' + friendlyName + '</strong> around it. The protocol addresses your dominant symptoms first \u2014 because trying to fix everything at once is exactly why generic programs fail.';
  document.getElementById('faqDifferentAnswer').innerHTML = 'Those programs give everyone the same advice. Your <strong>' + friendlyName + '</strong> is built specifically for your symptom pattern \u2014 not bloating advice when your problem is diarrhea, not fiber recommendations when fiber makes you worse. Rebecca and Paulina have built this from clinical practice, not a Google search.';

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
  var stickyBtn = document.getElementById('stickyCtaButton');
  var originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Processing...';
  if (stickyBtn) {
    stickyBtn.disabled = true;
    stickyBtn.textContent = 'Processing...';
  }

  // Read bump state fresh from DOM to avoid stale state
  var bump1Active = document.getElementById('bump1').classList.contains('checked');
  var bump2Active = document.getElementById('bump2').classList.contains('checked');

  // Sync bumpState with DOM
  bumpState[1] = bump1Active;
  bumpState[2] = bump2Active;

  var totalValue = 47 + (bump1Active ? 19 : 0) + (bump2Active ? 37 : 0);

  // Track checkout click
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'checkout_click',
    'protocol': pageParams.protocol_name,
    'include_survival_guide': bump1Active,
    'include_meal_plan': bump2Active,
    'total_value': totalValue
  });

  // Store total for thank-you page tracking
  try {
    localStorage.setItem('gha_purchase_total', totalValue.toString());
  } catch (e) {}

  // Derive protocol key using shared resolver
  var protocolKey = resolveProtocolKey();

  var payload = {
    email: pageParams.email,
    name: pageParams.name,
    protocol_name: pageParams.protocol_name,
    protocol: protocolKey,
    primary_complaint: pageParams.primary_complaint,
    primary_complaint_label: pageParams.primary_complaint_label,
    duration: pageParams.duration,
    treatments_tried_count: pageParams.treatments_tried_count,
    gut_brain: pageParams.gut_brain,
    gut_brain_score: pageParams.gut_brain_score,
    vision: pageParams.vision,
    goal_selection: pageParams.goal_selection,
    stress_level: pageParams.stress_level,
    diagnoses: pageParams.diagnoses,
    treatments_formatted: pageParams.treatments_formatted,
    include_survival_guide: bump1Active,
    include_meal_plan: bump2Active
  };

  console.log('Checkout payload:', JSON.stringify(payload));

  fetch(CHECKOUT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
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
    fallbackToPaymentLink(bump1Active, bump2Active);
  })
  .finally(function() {
    // Always re-enable the button so they can retry
    checkoutInProgress = false;
    btn.disabled = false;
    btn.textContent = originalText;
    if (stickyBtn) {
      stickyBtn.disabled = false;
      stickyBtn.textContent = originalText;
    }
  });
}

function fallbackToPaymentLink(bump1Active, bump2Active) {
  // Fallback opens multiple payment links if bumps are selected.
  // Since payment links can't be combined, we open the protocol link
  // and alert about bumps if selected.
  var protocolKey = resolveProtocolKey();
  var link = STRIPE_LINKS[protocolKey];

  if (link && pageParams.email) {
    link += '?prefilled_email=' + encodeURIComponent(pageParams.email);
  }

  // Bumps are not supported in fallback mode — Payment Links can't combine products
  if (bump1Active || bump2Active) {
    console.warn('Fallback mode: bump add-ons (survival guide / meal plan) cannot be included via Payment Links. Only the protocol will be purchased.');
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
// SECONDARY SYMPTOMS SECTION
// =================================================

function populateSecondarySymptoms() {
  var container = document.getElementById('secondarySymptomsSection');
  if (!container) return;

  var raw = pageParams.secondary_symptoms || '';
  if (!raw || raw === 'none') {
    container.style.display = 'none';
    return;
  }

  var symptoms = raw.split(',').filter(function(s) { return s && s !== 'none'; });
  if (symptoms.length === 0) {
    container.style.display = 'none';
    return;
  }

  // Get the protocol key
  var protocolKey = resolveProtocolKey();
  var copySet = SECONDARY_SYMPTOM_COPY[protocolKey];

  if (!copySet) {
    container.style.display = 'none';
    return;
  }

  var itemsHtml = '';
  var validCount = 0;

  for (var i = 0; i < symptoms.length; i++) {
    var symptom = symptoms[i].trim();
    var label = SECONDARY_SYMPTOM_LABELS[symptom];
    var copy = copySet[symptom];

    if (label && copy) {
      itemsHtml += '<div class="symptom-addressed">';
      itemsHtml += '<span class="symptom-check">&#10003;</span>';
      itemsHtml += '<div class="symptom-detail">';
      itemsHtml += '<strong>' + label + '</strong>';
      itemsHtml += '<p>' + copy + '</p>';
      itemsHtml += '</div></div>';
      validCount++;
    }
  }

  if (validCount === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '<div class="container"><h2>Your protocol also addresses:</h2><div class="secondary-symptoms-list">' + itemsHtml + '</div></div>';
  container.style.display = '';
}

// =================================================
// DAY COMPARISON DATA
// =================================================

var DAY_COMPARISON_POOLS = {
  bloating: [
    { before: "You wake up flat but dread what happens after lunch", after: "You eat lunch and your jeans still fit by dinner" },
    { before: "You cancel plans because \u2018today is a bad belly day\u2019", after: "You say yes to dinner without checking how your stomach looks first" },
    { before: "You carry a loose top in your bag \u2014 just in case", after: "Your wardrobe isn\u2019t dictated by your bloating schedule" },
    { before: "You mentally calculate every bite at restaurants", after: "You order what sounds good and enjoy the meal" }
  ],
  constipation: [
    { before: "Your mornings start with anxiety about whether today will \u2018work\u2019", after: "Your body has a predictable routine you can count on" },
    { before: "You feel heavy and sluggish by mid-afternoon", after: "Afternoons feel lighter because your system is actually moving" },
    { before: "You avoid travel because it makes everything worse", after: "You have a travel protocol that keeps things consistent" }
  ],
  diarrhea: [
    { before: "You map every bathroom before leaving the house", after: "You leave home without a backup plan because you don\u2019t need one" },
    { before: "You skip meals before important events \u2018just in case\u2019", after: "You eat before going out because you trust your body\u2019s response" },
    { before: "Morning coffee is a gamble you lose more than you win", after: "You know exactly what your gut can handle first thing" }
  ],
  alternating: [
    { before: "You never know which version of your gut will show up today", after: "Your gut has settled into a predictable pattern" },
    { before: "No advice works because your symptoms keep changing", after: "You have one approach that works for both directions" },
    { before: "Every meal feels like a coin flip", after: "Meals are calmer because you know what your gut needs right now" }
  ],
  pain: [
    { before: "You tense up before every meal, waiting for the cramping to start", after: "You sit down to eat without bracing yourself" },
    { before: "Pain after eating makes you want to skip meals entirely", after: "You know which foods your gut handles comfortably" },
    { before: "You can\u2019t focus at work because your stomach won\u2019t settle", after: "Your afternoons are productive instead of painful" }
  ],
  gas: [
    { before: "You avoid close spaces because you can\u2019t control the gas", after: "You\u2019ve identified the 2-3 foods causing it and cut the problem at the source" },
    { before: "Meetings, flights, and dates come with background anxiety", after: "You\u2019re focused on the moment, not your stomach" },
    { before: "You\u2019ve stopped eating certain food groups \u2018just to be safe\u2019", after: "You know exactly what triggers it \u2014 and everything else is back on the menu" }
  ],
  brain_fog: [
    { before: "By 2pm your brain feels like it\u2019s wading through fog", after: "Your thinking stays clear because your gut isn\u2019t hijacking your energy" },
    { before: "You blamed aging, stress, or sleep \u2014 but it\u2019s worse after eating", after: "You\u2019ve connected the dots between food and focus" },
    { before: "You can\u2019t remember the last time you felt mentally sharp all day", after: "Mental clarity improves as gut inflammation goes down" }
  ],
  anxiety_food: [
    { before: "You dread the question \u2018where should we eat tonight?\u2019", after: "You suggest restaurants because you know what\u2019s safe for you" },
    { before: "Every meal is a risk calculation, not an enjoyment", after: "You eat with confidence because you know your triggers" },
    { before: "You\u2019ve turned down invitations because you can\u2019t control the menu", after: "You go out and navigate any menu with your personal safe-food framework" }
  ]
};

var PROTOCOL_PRIMARY_SYMPTOM = {
  'bloat_reset': 'bloating',
  'regularity': 'constipation',
  'calm_gut': 'diarrhea',
  'stability': 'alternating',
  'rebuild': 'bloating'
};

// =================================================
// DAY COMPARISON RENDERER
// =================================================

function populateDayComparison() {
  var container = document.getElementById('dayComparison');
  if (!container) return;

  var protocolKey = resolveProtocolKey();
  var primarySymptom = PROTOCOL_PRIMARY_SYMPTOM[protocolKey];
  if (!primarySymptom || !DAY_COMPARISON_POOLS[primarySymptom]) {
    container.style.display = 'none';
    return;
  }

  // Get secondary symptoms
  var raw = pageParams.secondary_symptoms || '';
  var secondaries = (raw && raw !== 'none') ? raw.split(',').filter(function(s) { return s && s !== 'none' && DAY_COMPARISON_POOLS[s]; }) : [];

  // Build item list: interleave primary and secondary, max 4
  var items = [];
  var primaryPool = DAY_COMPARISON_POOLS[primarySymptom].slice();
  var primaryIdx = 0;

  if (secondaries.length === 0) {
    // All 4 from primary
    for (var i = 0; i < 4 && i < primaryPool.length; i++) {
      items.push(primaryPool[i]);
    }
  } else if (secondaries.length === 1) {
    // 2 primary, 1 secondary, 1 primary (interleaved)
    items.push(primaryPool[0]);
    var sec1Pool = DAY_COMPARISON_POOLS[secondaries[0]];
    if (sec1Pool && sec1Pool[0]) items.push(sec1Pool[0]); else items.push(primaryPool[2]);
    if (primaryPool[1]) items.push(primaryPool[1]);
    if (primaryPool[2] && items.length < 4) items.push(primaryPool[2]);
  } else if (secondaries.length === 2) {
    // 2 primary, 1 each secondary
    items.push(primaryPool[0]);
    var s1Pool = DAY_COMPARISON_POOLS[secondaries[0]];
    if (s1Pool && s1Pool[0]) items.push(s1Pool[0]); else items.push(primaryPool[2]);
    var s2Pool = DAY_COMPARISON_POOLS[secondaries[1]];
    if (s2Pool && s2Pool[0]) items.push(s2Pool[0]); else items.push(primaryPool[2]);
    if (primaryPool[1]) items.push(primaryPool[1]);
  } else {
    // 3+ secondaries: 1 primary, first 3 secondaries
    items.push(primaryPool[0]);
    for (var j = 0; j < 3 && j < secondaries.length; j++) {
      var sPool = DAY_COMPARISON_POOLS[secondaries[j]];
      if (sPool && sPool[0]) items.push(sPool[0]); else if (primaryPool[j + 1]) items.push(primaryPool[j + 1]);
    }
  }

  // Cap at 4
  items = items.slice(0, 4);
  if (items.length === 0) {
    container.style.display = 'none';
    return;
  }

  // Render
  var beforeHtml = '';
  var afterHtml = '';
  for (var k = 0; k < items.length; k++) {
    beforeHtml += '<div class="dc-item"><span class="dc-icon dc-icon-x"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span><p>' + items[k].before + '</p></div>';
    afterHtml += '<div class="dc-item"><span class="dc-icon dc-icon-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><p>' + items[k].after + '</p></div>';
  }

  // Dream outcome capstone row (Task 4)
  var dreamText = processDreamOutcome(pageParams.vision);
  if (dreamText) {
    beforeHtml += '<div class="dc-item dc-dream-spacer"></div>';
    afterHtml += '<div class="dc-item dc-dream-capstone"><span class="dc-icon dc-icon-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span><p><em>You ' + dreamText + ' \u2014 and you mean it.</em></p></div>';
  }

  container.innerHTML = '<div class="container"><h2>Your day now vs. your day on protocol</h2><div class="dc-columns"><div class="dc-column dc-before"><div class="dc-label">Right now</div>' + beforeHtml + '</div><div class="dc-column dc-after"><div class="dc-label">4 weeks from now</div>' + afterHtml + '</div></div></div>';
  container.style.display = '';
}

// =================================================
// DURATION EMPATHY DATA
// =================================================

var DURATION_EMPATHY = {
  '3_6_months': "Your symptoms are relatively new \u2014 and that\u2019s actually good news. The sooner you address the right triggers, the faster your gut responds. Most women wish they\u2019d found this earlier.",
  '6_12_months': "You\u2019ve been dealing with this for over six months now. Long enough to know it\u2019s not going away on its own \u2014 but early enough that your gut can still reset quickly once you target the right triggers.",
  '1_3_years': "After years of dealing with this, you\u2019ve probably started to accept it as \u2018just how your body is.\u2019 It\u2019s not. Your gut adapted to the wrong patterns \u2014 and it can adapt back.",
  '3_5_years': "You\u2019ve been living with this for years. Not weeks, not months \u2014 years of planning around your symptoms, years of trying things that didn\u2019t stick, years of wondering if this is just your life now. It doesn\u2019t have to be.",
  '5_plus_years': "You\u2019ve been living with this for years. Not weeks, not months \u2014 years of planning around your symptoms, years of trying things that didn\u2019t stick, years of wondering if this is just your life now. It doesn\u2019t have to be."
};

// =================================================
// DREAM OUTCOME CALLBACK
// =================================================

function populateDreamOutcome() {
  var container = document.getElementById('dreamCallback');
  if (!container) return;

  var vision = pageParams.vision || '';
  if (vision.length < 5) {
    container.style.display = 'none';
    return;
  }

  // Truncate if too long
  var displayText = vision;
  if (displayText.length > 100) {
    displayText = displayText.substring(0, 97) + '...';
  }

  container.innerHTML = '<p>You told us the first thing you\u2019d do is <span class="dream-text">' + displayText + '</span>. Let\u2019s make that happen.</p>';
  container.style.display = '';
}

// =================================================
// TREATMENTS VALIDATION DATA
// =================================================

var TREATMENT_LABELS = {
  'elimination': 'Elimination diets',
  'low_fodmap': 'Low FODMAP diet',
  'probiotics': 'Probiotics',
  'otc_meds': 'Over-the-counter medications',
  'prescription': 'Prescription medications',
  'fiber': 'Fiber supplements',
  'testing': 'Doctor visits & testing',
  'practitioner': 'Working with a practitioner'
};

var TREATMENT_DISPLAY_ORDER = ['elimination', 'low_fodmap', 'probiotics', 'otc_meds', 'prescription', 'fiber', 'testing', 'practitioner'];

var TREATMENT_EXPLANATIONS = {
  elimination: {
    bloat_reset: "Elimination diets cast too wide a net. You removed 50 foods when only 3-4 were causing your bloating. Your protocol identifies your specific FODMAP triggers \u2014 so you ADD foods back instead of removing everything.",
    regularity: "Most elimination diets accidentally remove the fiber and fermentable carbs your gut needs to stay regular. You were solving one problem by creating another.",
    calm_gut: "Elimination diets often work temporarily for diarrhea \u2014 then fail when you try to reintroduce. Your protocol gives you a systematic reintroduction timeline so you don\u2019t yo-yo.",
    stability: "With alternating symptoms, elimination diets are especially frustrating \u2014 what helps on a constipation day makes a diarrhea day worse. Your protocol adapts to whichever pattern shows up.",
    rebuild: "Post-SIBO, your gut needs strategic reintroduction, not continued restriction. Staying on a restricted diet too long can actually slow recovery by starving beneficial bacteria.",
    gut_brain: "Elimination diets added food anxiety on top of your existing stress-gut connection. Your protocol focuses on the nervous system trigger first \u2014 because when stress is driving symptoms, food isn\u2019t the primary problem."
  },
  low_fodmap: {
    bloat_reset: "Low FODMAP is a useful diagnostic tool, but it\u2019s not meant to be a permanent diet. Your protocol uses the trigger data to build a sustainable plan \u2014 not just another restriction list.",
    regularity: "Low FODMAP often worsens constipation by removing the fermentable fibers your gut needs. Your protocol re-introduces the right fibers in the right amounts.",
    calm_gut: "Low FODMAP may have helped temporarily, but without structured reintroduction you\u2019re stuck avoiding foods forever. Your protocol builds you back to eating normally.",
    stability: "Low FODMAP assumes your symptoms are consistent \u2014 yours aren\u2019t. Your protocol adjusts daily based on which direction your gut is trending.",
    rebuild: "Post-SIBO, staying on low FODMAP too long starves the good bacteria trying to recolonize. Your protocol uses strategic reintroduction to rebuild your microbiome.",
    gut_brain: "Low FODMAP added more food rules to an already anxious relationship with eating. Your protocol addresses the nervous system trigger driving your symptoms \u2014 not just the foods."
  },
  probiotics: {
    bloat_reset: "Most probiotics are generic \u2014 random strains at random doses. For your bloating pattern, the issue isn\u2019t \u2018more bacteria.\u2019 It\u2019s identifying which specific triggers are causing fermentation. Probiotics can\u2019t fix that.",
    regularity: "Most probiotics are generic \u2014 random strains at random doses. For your constipation, the issue isn\u2019t bacteria \u2014 it\u2019s motility and fiber balance. Probiotics can\u2019t fix that.",
    calm_gut: "Most probiotics are generic \u2014 random strains at random doses. For your diarrhea pattern, the issue isn\u2019t \u2018more bacteria.\u2019 It\u2019s calming the gut-transit speed and identifying triggers. Probiotics alone can\u2019t fix that.",
    stability: "Most probiotics are generic \u2014 random strains at random doses. For alternating symptoms, the issue isn\u2019t bacteria balance \u2014 it\u2019s motility regulation. Probiotics can\u2019t fix that.",
    rebuild: "Most probiotics are generic \u2014 random strains at random doses. Post-SIBO, your gut needs specific prebiotic support (like PHGG) to rebuild \u2014 not random bacteria that may re-trigger overgrowth.",
    gut_brain: "Most probiotics are generic \u2014 random strains at random doses. For your stress-gut pattern, the issue isn\u2019t bacteria \u2014 it\u2019s your nervous system driving the symptoms. Probiotics can\u2019t calm your vagus nerve."
  },
  otc_meds: {
    _default: "Medications manage symptoms \u2014 they don\u2019t address what\u2019s driving them. Your protocol targets the underlying pattern so you\u2019re not dependent on daily pills to feel normal."
  },
  prescription: {
    _default: "Prescription medications manage symptoms \u2014 they don\u2019t address what\u2019s driving them. Your protocol targets the underlying pattern so you\u2019re not dependent on medication to feel normal."
  },
  fiber: {
    bloat_reset: "The wrong type of fiber actually makes bloating worse. Your protocol specifies exactly which fiber sources work for your pattern and which ones to avoid.",
    regularity: "The wrong type of fiber actually makes bloating worse. Your protocol specifies exactly which fiber sources help motility without causing more discomfort.",
    calm_gut: "Fiber supplements are tricky with diarrhea \u2014 some bulk up stool (helpful), others ferment and make things worse. Your protocol uses the right type at the right time.",
    stability: "Fiber is a double-edged sword with alternating symptoms. Your protocol tells you exactly which type to use based on which direction your gut is trending.",
    rebuild: "Post-SIBO, the wrong fiber feeds the bacteria you\u2019re trying to control. Your protocol uses PHGG specifically because it feeds good bacteria without feeding SIBO.",
    gut_brain: "Fiber supplements don\u2019t address the nervous system component driving your symptoms. Your protocol targets the stress-gut connection that fiber can\u2019t touch."
  },
  testing: {
    _default: "Your doctor likely ran tests, found nothing \u2018wrong,\u2019 and said \u2018it\u2019s IBS, manage your stress.\u2019 That\u2019s not wrong \u2014 but it\u2019s not a solution. Your protocol gives you the specific daily actions your doctor didn\u2019t have time to build for you."
  },
  practitioner: {
    _default: "Working with a practitioner gave you information \u2014 but not a daily system. Your protocol translates clinical knowledge into a step-by-step plan you can follow every day."
  }
};

function populateTreatmentsValidation() {
  var container = document.getElementById('treatmentsValidation');
  if (!container) return;

  var raw = pageParams.treatments || '';
  if (!raw || raw === 'nothing') {
    container.style.display = 'none';
    return;
  }

  var treatments = raw.split(',').filter(function(t) { return t && t !== 'nothing'; });
  if (treatments.length === 0) {
    container.style.display = 'none';
    return;
  }

  var protocolKey = resolveProtocolKey();

  // Use gut-brain specific copy when applicable
  if (pageParams.gut_brain === true) {
    protocolKey = 'gut_brain';
  }

  // Sort by display order, max 3
  var ordered = [];
  for (var i = 0; i < TREATMENT_DISPLAY_ORDER.length && ordered.length < 3; i++) {
    var key = TREATMENT_DISPLAY_ORDER[i];
    if (treatments.indexOf(key) !== -1 && TREATMENT_LABELS[key]) {
      ordered.push(key);
    }
  }

  if (ordered.length === 0) {
    container.style.display = 'none';
    return;
  }

  var html = '<div class="treatments-validation"><h3>What you\u2019ve already tried \u2014 and why it didn\u2019t stick</h3>';
  for (var j = 0; j < ordered.length; j++) {
    var tKey = ordered[j];
    var explanations = TREATMENT_EXPLANATIONS[tKey];
    var copy = '';
    if (explanations) {
      copy = explanations[protocolKey] || explanations['_default'] || '';
    }
    if (copy) {
      html += '<div class="treatment-item"><span class="treatment-name">' + TREATMENT_LABELS[tKey] + '</span><p>' + copy + '</p></div>';
    }
  }
  html += '</div>';

  container.innerHTML = html;
  container.style.display = '';
}

// =================================================
// STRESS-GUT ACKNOWLEDGMENT
// =================================================

function populateStressAcknowledgment() {
  var container = document.getElementById('stressAcknowledgment');
  if (!container) return;

  var stressLevel = pageParams.stress_level || '';
  var stressRaw = pageParams.stress_connection || '';

  // Determine if we should show this
  var copy = '';
  if (stressLevel === 'significant' || stressRaw === 'yes_definitely') {
    copy = 'Your quiz showed a clear stress-gut pattern. Your protocol includes daily vagus nerve techniques that interrupt this cycle \u2014 most women notice the connection weakening within the first week.';
  } else if (stressRaw === 'sometimes') {
    copy = 'Your quiz suggests stress plays a role in your symptoms. Your protocol includes simple nervous system techniques alongside the food-based approach \u2014 addressing both sides of the equation.';
  }

  if (!copy) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '<div class="stress-acknowledgment-card"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><p>' + copy + '</p></div>';
  container.style.display = '';
}

// =================================================
// LIFE IMPACT URGENCY
// =================================================

function populateLifeImpact() {
  var container = document.getElementById('lifeImpactUrgency');
  if (!container) return;

  var impact = pageParams.life_impact || '';
  var copy = '';

  if (impact === 'severe' || impact === 'high') {
    copy = "This isn\u2019t a minor inconvenience. It\u2019s shaping what you eat, where you go, and how you live. That\u2019s not something to manage \u2014 it\u2019s something to fix.";
  } else if (impact === 'moderate' || impact === 'medium') {
    copy = "Your symptoms are already shaping your daily decisions \u2014 what to eat, whether to go out, how to plan your week. It doesn\u2019t have to stay that way.";
  }

  if (!copy) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '<div class="life-impact-card"><p>' + copy + '</p></div>';
  container.style.display = '';
}

// =================================================
// STICKY CTA
// =================================================

function initStickyCta() {
  var stickyCta = document.getElementById('stickyCta');
  var ctaButton = document.getElementById('ctaButton');
  if (!stickyCta || !ctaButton) return;

  var stickyUnlocked = false;
  var pageLoadTime = Date.now();

  function unlockSticky() {
    if (stickyUnlocked) return;
    stickyUnlocked = true;
    checkScroll();
  }

  // Unlock after 30 seconds
  setTimeout(unlockSticky, 30000);

  function checkScroll() {
    // Check 40% scroll threshold to unlock
    if (!stickyUnlocked) {
      var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.4) {
        stickyUnlocked = true;
      }
      // Also unlock after 30s even if scroll check fires first
      if (Date.now() - pageLoadTime >= 30000) {
        stickyUnlocked = true;
      }
    }

    if (!stickyUnlocked) {
      stickyCta.classList.remove('visible');
      document.body.classList.remove('has-sticky-cta');
      return;
    }

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

  // Track as quiz funnel step so admin dashboard can see offer page arrivals
  window.dataLayer.push({
    'event': 'quiz_step',
    'quiz_section': 'offer_page_view',
    'quiz_source': pageParams.source || ''
  });
}
