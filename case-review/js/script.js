// =================================================
// CASE REVIEW UPSELL PAGE — Script
// =================================================

// Stripe Payment Link
var STRIPE_CASE_REVIEW_LINK = 'https://buy.stripe.com/bJe8wQ9ep72WfckbH7gA80h';

// Decline redirect (next upsell or thank-you)
var DECLINE_REDIRECT = '/thank-you-protocol/';

// =================================================
// PROTOCOL FRIENDLY NAMES
// =================================================

var PROTOCOL_FRIENDLY_NAMES = {
  'bloat_reset': 'The Sensitive Responder',
  'regularity': 'The Rhythmic Regulator',
  'calm_gut': 'The Calm Gut Responder',
  'stability': 'The Stability Seeker',
  'rebuild': 'The Gut Restorer'
};

var PROTOCOL_NAME_MAP = {
  'Bloating-Dominant': 'The Sensitive Responder',
  'Constipation-Dominant': 'The Rhythmic Regulator',
  'Diarrhea-Dominant': 'The Calm Gut Responder',
  'Mixed-Alternating': 'The Stability Seeker',
  'Post-SIBO Recovery': 'The Gut Restorer',
  'Gut-Brain': 'The Mind-Body Connector'
};

// Duration display mapping
var DURATION_MAP = {
  'less_than_6_months': 'Less than 6 months',
  '6-12_months': '6-12 months',
  '1-3_years': '1-3 years',
  '3-5_years': '3-5 years',
  '5+_years': 'Over 5 years'
};

// Complaint display mapping
var COMPLAINT_MAP = {
  'bloating': 'Bloating & distension',
  'constipation': 'Constipation',
  'diarrhea': 'Diarrhea & urgency',
  'mixed': 'Mixed / alternating symptoms',
  'pain': 'Abdominal pain',
  'gas': 'Gas & discomfort',
  'reflux': 'Reflux'
};

// Stress level display
var STRESS_MAP = {
  'significant': 'Strong connection',
  'some': 'Moderate connection',
  'none': 'Minimal connection'
};

// Goal display
var GOAL_MAP = {
  'comfortable_eating': 'Eat comfortably without fear',
  'bathroom_freedom': 'Stop mapping every bathroom',
  'energy_focus': 'Have energy and mental clarity again',
  'understanding': 'Understand what\'s going on in my gut'
};

// =================================================
// STATE
// =================================================

var pageParams = {};
var uploadedFiles = [];
var visibleQuestions = 3;
var formSubmitted = false;
var reviewId = '';

// =================================================
// INITIALIZATION
// =================================================

document.addEventListener('DOMContentLoaded', function() {
  pageParams = loadParams();
  populateProfile();
  setupForm();
  setupUpload();
  setupDeclineLink();
  initSpotsCounter();
  initCountdownTimer();
  trackPageView();
});

// =================================================
// PARAM LOADING: URL -> Cookie -> localStorage
// =================================================

function loadParams() {
  var urlParams = new URLSearchParams(window.location.search);
  var keys = [
    'source', 'name', 'email', 'protocol', 'protocol_name',
    'gut_brain', 'primary_complaint', 'primary_complaint_label',
    'duration', 'diagnoses', 'treatments', 'treatments_formatted',
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
      if (key === 'vision' && val) {
        try { val = decodeURIComponent(val); } catch (e) {}
      }
    }

    // 2. Cookie fallback
    if (!val && !hasUrlParams) {
      val = getCookie('gha_' + key) || '';
    }

    // 3. localStorage fallback
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
// PROFILE CARD POPULATION
// =================================================

function populateProfile() {
  // Protocol friendly name
  var protocolDisplay = '--';
  if (pageParams.protocol_name) {
    protocolDisplay = PROTOCOL_NAME_MAP[pageParams.protocol_name] || pageParams.protocol_name;
  } else if (pageParams.protocol) {
    protocolDisplay = PROTOCOL_FRIENDLY_NAMES[pageParams.protocol] || pageParams.protocol;
  }
  // Gut-brain overlay
  if (pageParams.gut_brain) {
    protocolDisplay += ' + Mind-Body Connector';
  }
  setProfileValue('profileProtocolValue', protocolDisplay);

  // Primary symptoms
  var symptoms = '--';
  if (pageParams.primary_complaint_label) {
    symptoms = pageParams.primary_complaint_label;
  } else if (pageParams.primary_complaint) {
    symptoms = COMPLAINT_MAP[pageParams.primary_complaint] || pageParams.primary_complaint;
  }
  setProfileValue('profileSymptomsValue', symptoms);

  // Duration
  var duration = '--';
  if (pageParams.duration) {
    duration = DURATION_MAP[pageParams.duration] || pageParams.duration;
  }
  setProfileValue('profileDurationValue', duration);

  // What they've tried
  var tried = '--';
  if (pageParams.treatments_formatted) {
    tried = pageParams.treatments_formatted;
  } else if (pageParams.diagnoses) {
    tried = pageParams.diagnoses.replace(/,/g, ', ');
  }
  setProfileValue('profileTriedValue', tried);

  // Gut-brain connection
  if (pageParams.gut_brain || pageParams.stress_level) {
    var gutBrainRow = document.getElementById('profileGutBrain');
    if (gutBrainRow) {
      gutBrainRow.style.display = 'flex';
      var stressText = STRESS_MAP[pageParams.stress_level] || pageParams.stress_level || 'Present';
      setProfileValue('profileGutBrainValue', stressText);
    }
  }

  // Goal
  var goal = '--';
  if (pageParams.vision) {
    goal = '"' + pageParams.vision + '"';
  } else if (pageParams.goal_selection) {
    goal = GOAL_MAP[pageParams.goal_selection] || pageParams.goal_selection;
  }
  setProfileValue('profileGoalValue', goal);

  // Hide rows with no data
  hideEmptyRow('profileProtocol', 'profileProtocolValue');
  hideEmptyRow('profileSymptoms', 'profileSymptomsValue');
  hideEmptyRow('profileDuration', 'profileDurationValue');
  hideEmptyRow('profileTried', 'profileTriedValue');
  hideEmptyRow('profileGoal', 'profileGoalValue');
}

function setProfileValue(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function hideEmptyRow(rowId, valueId) {
  var valueEl = document.getElementById(valueId);
  var rowEl = document.getElementById(rowId);
  if (valueEl && rowEl && valueEl.textContent === '--') {
    rowEl.style.display = 'none';
  }
}

// =================================================
// FORM SETUP
// =================================================

function setupForm() {
  var form = document.getElementById('caseReviewForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
  });
}

// Show next question
function showNextQuestion(e) {
  if (e) e.preventDefault();
  if (formSubmitted) return;

  var nextQ = visibleQuestions + 1;
  if (nextQ > 6) return;

  var group = document.getElementById('q' + nextQ + 'Group');
  if (group) {
    group.style.display = 'block';
    visibleQuestions = nextQ;

    // Focus the new textarea
    var textarea = group.querySelector('textarea');
    if (textarea) textarea.focus();
  }

  // Hide "add" link after q6
  if (visibleQuestions >= 6) {
    var link = document.getElementById('addQuestionLink');
    if (link) link.style.display = 'none';
  }
}
// Expose to global scope for onclick
window.showNextQuestion = showNextQuestion;

// =================================================
// ENABLE EDITING (re-edit after submission)
// =================================================

function enableEditing(e) {
  if (e) e.preventDefault();

  formSubmitted = false;

  // Re-enable textareas
  var textareas = document.querySelectorAll('#caseReviewForm textarea');
  for (var j = 0; j < textareas.length; j++) {
    textareas[j].readOnly = false;
  }

  // Show add question link if under 6
  if (visibleQuestions < 6) {
    var addLink = document.getElementById('addQuestionLink');
    if (addLink) addLink.style.display = 'inline-block';
  }

  // Reset submit button
  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.textContent = 'Resubmit My Questions';
    submitBtn.disabled = false;
    submitBtn.classList.remove('submitted');
  }

  // Hide edit note
  var editNote = document.getElementById('submitEditNote');
  if (editNote) editNote.style.display = 'none';

  // Re-enable upload zone
  var uploadZone = document.getElementById('uploadZone');
  if (uploadZone) {
    uploadZone.style.pointerEvents = 'auto';
    uploadZone.style.opacity = '1';
  }

  // Focus first question
  var q1 = document.getElementById('question_1');
  if (q1) q1.focus();
}
window.enableEditing = enableEditing;

// =================================================
// FORM SUBMISSION
// =================================================

function handleFormSubmit() {
  var q1 = document.getElementById('question_1');
  if (!q1 || !q1.value.trim()) {
    var errorEl = document.getElementById('formError');
    if (errorEl) errorEl.style.display = 'block';
    q1.focus();
    return;
  }

  // Hide error
  var errorEl = document.getElementById('formError');
  if (errorEl) errorEl.style.display = 'none';

  formSubmitted = true;

  // Generate review ID (only on first submission)
  if (!reviewId) {
    reviewId = generateUUID();
  }

  // Collect form data
  var formData = {
    review_id: reviewId,
    questions: [],
    current_supplements: document.getElementById('current_supplements').value.trim(),
    additional_notes: document.getElementById('additional_notes').value.trim(),
    uploaded_file_names: uploadedFiles.map(function(f) { return f.name; }),
    quiz_context: {
      email: pageParams.email,
      name: pageParams.name,
      protocol: pageParams.protocol,
      protocol_name: pageParams.protocol_name,
      primary_complaint: pageParams.primary_complaint,
      primary_complaint_label: pageParams.primary_complaint_label,
      duration: pageParams.duration,
      diagnoses: pageParams.diagnoses,
      treatments_formatted: pageParams.treatments_formatted,
      stress_level: pageParams.stress_level,
      life_impact: pageParams.life_impact,
      gut_brain: pageParams.gut_brain,
      vision: pageParams.vision
    },
    submitted_at: new Date().toISOString()
  };

  // Collect questions
  for (var i = 1; i <= 6; i++) {
    var textarea = document.getElementById('question_' + i);
    if (textarea && textarea.value.trim()) {
      formData.questions.push(textarea.value.trim());
    }
  }

  // Save to localStorage as backup
  try {
    localStorage.setItem('gha_case_review', JSON.stringify(formData));
    localStorage.setItem('gha_case_review_id', reviewId);
  } catch (e) {
    console.log('localStorage not available');
  }

  // Gray out form fields
  var textareas = document.querySelectorAll('#caseReviewForm textarea');
  for (var j = 0; j < textareas.length; j++) {
    textareas[j].readOnly = true;
  }

  // Hide add question link
  var addLink = document.getElementById('addQuestionLink');
  if (addLink) addLink.style.display = 'none';

  // Update submit button
  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.textContent = 'Questions submitted';
    submitBtn.disabled = true;
    submitBtn.classList.add('submitted');
  }

  // Show edit note
  var editNote = document.getElementById('submitEditNote');
  if (editNote) editNote.style.display = 'block';

  // Disable upload zone interaction
  var uploadZone = document.getElementById('uploadZone');
  if (uploadZone) {
    uploadZone.style.pointerEvents = 'none';
    uploadZone.style.opacity = '0.6';
  }

  // Reveal price section
  revealPriceSection();

  // Setup checkout button
  setupCheckoutButton(formData);

  // Track submission
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'case_review_questions_submitted',
    'question_count': formData.questions.length,
    'has_supplements': !!formData.current_supplements,
    'has_files': formData.uploaded_file_names.length > 0
  });
}

// =================================================
// PRICE SECTION REVEAL
// =================================================

function revealPriceSection() {
  var priceSection = document.getElementById('priceSection');
  if (!priceSection) return;

  // Only animate on first reveal
  if (priceSection.style.display === 'none') {
    priceSection.style.display = 'block';
    priceSection.classList.add('revealing');

    // Scroll to price section
    setTimeout(function() {
      priceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}

// =================================================
// CHECKOUT
// =================================================

function setupCheckoutButton(formData) {
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;

  // Remove old listeners by cloning
  var newBtn = checkoutBtn.cloneNode(true);
  checkoutBtn.parentNode.replaceChild(newBtn, checkoutBtn);

  newBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Track checkout click
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'case_review_checkout_click',
      'review_id': reviewId,
      'value': 97
    });

    // Build Stripe link with params
    var stripeUrl = STRIPE_CASE_REVIEW_LINK;
    var separator = stripeUrl.indexOf('?') > -1 ? '&' : '?';

    if (pageParams.email) {
      stripeUrl += separator + 'prefilled_email=' + encodeURIComponent(pageParams.email);
      separator = '&';
    }

    // Add client_reference_id for webhook matching
    stripeUrl += separator + 'client_reference_id=' + encodeURIComponent(reviewId);

    window.location.href = stripeUrl;
  });
}

// =================================================
// DECLINE LINK
// =================================================

function setupDeclineLink() {
  var declineLink = document.getElementById('declineLink');
  if (!declineLink) return;

  declineLink.addEventListener('click', function(e) {
    e.preventDefault();

    // Save questions to localStorage even on decline
    try {
      var q1 = document.getElementById('question_1');
      if (q1 && q1.value.trim()) {
        var declinedData = {
          questions: [],
          declined: true,
          declined_at: new Date().toISOString()
        };
        for (var i = 1; i <= 6; i++) {
          var textarea = document.getElementById('question_' + i);
          if (textarea && textarea.value.trim()) {
            declinedData.questions.push(textarea.value.trim());
          }
        }
        localStorage.setItem('gha_case_review_declined', JSON.stringify(declinedData));
      }
    } catch (e) {}

    // Track decline
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'case_review_declined'
    });

    window.location.href = DECLINE_REDIRECT;
  });
}

// =================================================
// FILE UPLOAD (MVP: UI only, instructions after payment)
// =================================================

function setupUpload() {
  var uploadZone = document.getElementById('uploadZone');
  var fileInput = document.getElementById('fileInput');
  if (!uploadZone || !fileInput) return;

  // Drag and drop
  uploadZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });

  // Click to browse
  fileInput.addEventListener('change', function() {
    handleFiles(fileInput.files);
    fileInput.value = '';
  });
}

function handleFiles(files) {
  if (formSubmitted) return;

  var allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  var maxSize = 20 * 1024 * 1024; // 20MB
  var maxFiles = 3;

  for (var i = 0; i < files.length; i++) {
    if (uploadedFiles.length >= maxFiles) break;

    var file = files[i];

    // Validate type
    if (allowed.indexOf(file.type) === -1) {
      continue;
    }

    // Validate size
    if (file.size > maxSize) {
      continue;
    }

    // Check duplicate
    var duplicate = false;
    for (var j = 0; j < uploadedFiles.length; j++) {
      if (uploadedFiles[j].name === file.name && uploadedFiles[j].size === file.size) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) continue;

    uploadedFiles.push({ name: file.name, size: file.size, type: file.type });
  }

  renderFileList();
}

function renderFileList() {
  var listEl = document.getElementById('uploadFileList');
  if (!listEl) return;

  if (uploadedFiles.length === 0) {
    listEl.innerHTML = '';
    return;
  }

  var html = '';
  for (var i = 0; i < uploadedFiles.length; i++) {
    var f = uploadedFiles[i];
    var sizeKB = Math.round(f.size / 1024);
    var sizeDisplay = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';

    html += '<div class="upload-file-item">';
    html += '<span class="file-name">';
    html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> ';
    html += f.name + ' <span style="color:#6B7D6E;font-size:0.8125rem;">(' + sizeDisplay + ')</span>';
    html += '</span>';

    if (!formSubmitted) {
      html += '<span class="file-remove" onclick="removeFile(' + i + ')">Remove</span>';
    }
    html += '</div>';
  }

  listEl.innerHTML = html;
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  renderFileList();
}
window.removeFile = removeFile;

// =================================================
// UUID GENERATION
// =================================================

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// =================================================
// URGENCY: SPOTS COUNTER & COUNTDOWN TIMER
// =================================================

function initSpotsCounter() {
  var el = document.getElementById('spotsLeft');
  if (!el) return;

  var storageKey = 'caseReviewSpots';
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(storageKey)); } catch(e) {}

  var now = new Date();
  var dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...6=Sat
  var todayStr = now.toISOString().slice(0, 10);

  // If we have a stored value from today, use it
  if (stored && stored.date === todayStr) {
    el.textContent = stored.spots;
    return;
  }

  // Calculate spots: 25 max, decrease through the week
  // Mon=25, Tue=21, Wed=17, Thu=13, Fri=9, Sat=6, Sun=4
  var spotsByDay = {
    1: 25, // Monday
    2: 21,
    3: 17,
    4: 13,
    5: 9,
    6: 6,
    0: 4  // Sunday
  };

  var base = spotsByDay[dayOfWeek] !== undefined ? spotsByDay[dayOfWeek] : 12;

  // Add slight randomness (-1 to +1) for natural feel
  var jitter = Math.floor(Math.random() * 3) - 1;
  var spots = Math.max(2, Math.min(25, base + jitter));

  el.textContent = spots;

  // Store so it's consistent for this visitor today
  try {
    localStorage.setItem(storageKey, JSON.stringify({ date: todayStr, spots: spots }));
  } catch(e) {}
}

function initCountdownTimer() {
  var el = document.getElementById('countdownTimer');
  if (!el) return;

  var storageKey = 'caseReviewTimerEnd';
  var endTime = null;

  try {
    var stored = localStorage.getItem(storageKey);
    if (stored) {
      endTime = parseInt(stored, 10);
      // If timer already expired, reset it
      if (endTime <= Date.now()) {
        endTime = null;
      }
    }
  } catch(e) {}

  // Start a fresh 15-minute timer if none stored
  if (!endTime) {
    endTime = Date.now() + 15 * 60 * 1000;
    try { localStorage.setItem(storageKey, endTime.toString()); } catch(e) {}
  }

  function update() {
    var remaining = Math.max(0, endTime - Date.now());
    var mins = Math.floor(remaining / 60000);
    var secs = Math.floor((remaining % 60000) / 1000);
    el.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

    if (remaining <= 0) {
      el.textContent = '0:00';
      return;
    }
    setTimeout(update, 1000);
  }

  update();
}

// =================================================
// GTM TRACKING
// =================================================

function trackPageView() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'case_review_page_view',
    'protocol': pageParams.protocol_name,
    'source': pageParams.source,
    'primary_complaint': pageParams.primary_complaint
  });
}
