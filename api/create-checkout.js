// =================================================
// Stripe Checkout Session Creator
// Deploy to: app.guthealingacademy.com/api/create-checkout.js
// =================================================
//
// This file is stored here for reference. Copy it to your
// Vercel project at app.guthealingacademy.com and deploy there.
// GitHub Pages cannot run serverless functions.
//
// Environment variable required: STRIPE_SECRET_KEY
// Install: npm install stripe
// =================================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe Price IDs — replace with actual IDs from Stripe Dashboard
// Protocol price IDs - mapped by protocol key
const STRIPE_PRICE_PROTOCOLS = {
  'bloat_reset': 'price_1SwkoVLZMe5qWSedZMXuSKnF',
  'regularity': 'price_1Swl2jLZMe5qWSedVESlYi1A',
  'calm_gut': 'price_1Swl3RLZMe5qWSedDd40BgDG',
  'stability': 'price_1Swl3gLZMe5qWSed2ZoLaoOd',
  'rebuild': 'price_1Swl3tLZMe5qWSedxrlIAzwG'
};
const STRIPE_PRICE_SURVIVAL = "price_1Swl5GLZMe5qWSedSB44hOjF";   // $19 one-time
const STRIPE_PRICE_MEALPLAN = "price_1Swl6DLZMe5qWSedzUotZrpG";   // $37 one-time

// Allowed origins
const ALLOWED_ORIGINS = [
  'https://www.guthealingacademy.com',
  'https://guthealingacademy.com'
];

function getCorsHeaders(origin) {
  var allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

module.exports = async function handler(req, res) {
  var origin = req.headers.origin || '';
  var corsHeaders = getCorsHeaders(origin);

  // Set CORS headers
  for (var key in corsHeaders) {
    res.setHeader(key, corsHeaders[key]);
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;
    var email = body.email || '';
    var name = body.name || '';
    var protocolName = body.protocol_name || '';
    var protocol = body.protocol || '';
    var primaryComplaint = body.primary_complaint || '';
    var duration = body.duration || '';
    var includeSurvivalGuide = body.include_survival_guide === true;
    var includeMealPlan = body.include_meal_plan === true;

    // Build line items — select protocol-specific price
    var protocolPriceId = STRIPE_PRICE_PROTOCOLS[protocol] || STRIPE_PRICE_PROTOCOLS['bloat_reset'];
    var lineItems = [
      { price: protocolPriceId, quantity: 1 }
    ];

    if (includeSurvivalGuide) {
      lineItems.push({ price: STRIPE_PRICE_SURVIVAL, quantity: 1 });
    }

    if (includeMealPlan) {
      lineItems.push({ price: STRIPE_PRICE_MEALPLAN, quantity: 1 });
    }

    // Build success URL with params for personalization on case-review upsell page
    var successParams = new URLSearchParams();
    if (name) successParams.set('name', name);
    if (email) successParams.set('email', email);
    if (protocolName) successParams.set('protocol_name', protocolName);
    if (protocol) successParams.set('protocol', protocol);
    if (primaryComplaint) successParams.set('primary_complaint', primaryComplaint);
    if (duration) successParams.set('duration', duration);

    // Pass through personalization params
    var successPassthrough = ['primary_complaint_label', 'vision', 'goal_selection',
      'stress_level', 'diagnoses', 'treatments_formatted', 'gut_brain'];
    for (var k = 0; k < successPassthrough.length; k++) {
      if (body[successPassthrough[k]]) {
        successParams.set(successPassthrough[k], body[successPassthrough[k]]);
      }
    }

    // {CHECKOUT_SESSION_ID} is a Stripe template literal — Stripe replaces it with the real ID
    successParams.set('session_id', '{CHECKOUT_SESSION_ID}');
    var successUrl = 'https://www.guthealingacademy.com/case-review/?' + successParams.toString();

    // Build cancel URL — preserve all original params
    var cancelParams = new URLSearchParams();
    if (name) cancelParams.set('name', name);
    if (email) cancelParams.set('email', email);
    if (protocolName) cancelParams.set('protocol_name', protocolName);
    if (protocol) cancelParams.set('protocol', protocol);
    if (primaryComplaint) cancelParams.set('primary_complaint', primaryComplaint);
    if (duration) cancelParams.set('duration', duration);

    // Pass through any additional params from the original request
    var passthroughKeys = ['source', 'gut_brain', 'gut_brain_score', 'primary_complaint_label',
      'diagnoses', 'treatments', 'treatments_formatted', 'treatments_tried_count',
      'stress_level', 'life_impact', 'vision', 'goal_selection', 'journey_stage'];
    for (var i = 0; i < passthroughKeys.length; i++) {
      if (body[passthroughKeys[i]]) {
        cancelParams.set(passthroughKeys[i], body[passthroughKeys[i]]);
      }
    }

    var cancelUrl = 'https://www.guthealingacademy.com/offer-protocol/?' + cancelParams.toString();

    // Create Stripe Checkout Session
    var sessionConfig = {
      mode: 'payment',
      line_items: lineItems,
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        protocol_name: protocolName,
        protocol: protocol,
        name: name,
        primary_complaint: primaryComplaint,
        duration: duration,
        include_survival_guide: includeSurvivalGuide.toString(),
        include_meal_plan: includeMealPlan.toString()
      }
    };

    if (email) {
      sessionConfig.customer_email = email;
    }

    var session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
