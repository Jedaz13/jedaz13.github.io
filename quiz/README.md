# Gut Health Quiz

A WhatsApp-style conversational gut health assessment that guides users through a health quiz and routes them to personalized protocols. Built with vanilla JavaScript for easy deployment anywhere.

## Features

- **iMessage-style Chat Interface**: Engaging conversational UI with typing indicators and smooth animations
- **Medical Screening**: Rome IV criteria screening for red flags that require medical attention
- **Smart Protocol Routing**: Automatically routes users to 1 of 6 protocols based on their symptoms:
  - The Bloat Reset Protocol (bloating/gas)
  - The Regularity Protocol (constipation)
  - The Calm Gut Protocol (diarrhea)
  - The Stability Protocol (mixed/alternating)
  - The Rebuild Protocol (post-SIBO)
  - The Gut-Brain Protocol (stress-triggered)
- **Data Collection**: Captures all responses and sends to webhook for processing
- **Mobile-First Design**: Responsive design that works beautifully on all devices

## Quick Start

### 1. Configure the Webhook

Open `js/quiz-app.js` and update the webhook URL:

```javascript
const CONFIG = {
  WEBHOOK_URL: 'YOUR_WEBHOOK_URL_HERE',
  // ...
};
```

Replace with your Make.com or Zapier webhook URL.

### 2. Test Locally

Simply open `index.html` in your browser, or use a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

### 3. Deploy

Upload all files and folders to any web host:
- `index.html`
- `css/styles.css`
- `js/quiz-app.js`
- `js/quiz-content.js`
- `js/quiz-logic.js`
- `assets/` (avatar images)

Works with: GitHub Pages, Netlify, Vercel, traditional web hosting, or any CDN.

## Quiz Flow

1. **Welcome** - Story-driven introduction from Rebecca Taylor
2. **Red Flag Screening** - Rome IV criteria questions (warns user but allows continuation)
3. **Symptom Assessment** - Questions about symptoms and patterns
4. **History** - Previous diagnoses and treatments
5. **Gut-Brain Connection** - Stress and mental health impact
6. **Open-Ended Questions** - Current situation and goals
7. **Contact Info** - Name and email capture
8. **Results** - Protocol assignment and next steps

## File Structure

```
/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css          # Chat UI styling
├── js/
│   ├── quiz-content.js     # Quiz questions and flow
│   ├── quiz-logic.js       # Protocol routing logic
│   └── quiz-app.js         # Main application controller
├── assets/
│   ├── rebecca-avatar.png  # Guide avatar
│   └── rebecca-avatar.svg  # SVG fallback
├── README.md               # This file
└── CLAUDE.md               # Developer documentation
```

## Customization

### Change Colors

Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary-green: #25D366;  /* Buttons, indicators */
  --chat-bg: #ECE5DD;        /* Background */
  --header-bg: #075E54;      /* Header */
  /* ... */
}
```

### Add/Modify Questions

Edit the `quizContent` object in `js/quiz-content.js`.

### Modify Protocol Logic

Edit the `determineProtocol()` function in `js/quiz-logic.js`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For detailed technical documentation, see `CLAUDE.md`.
