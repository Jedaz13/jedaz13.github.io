# Gut Healing Academy - Sales Page

A conversion-focused sales page for the Gut Healing Academy, designed for users arriving from the gut health quiz with an active 7-day trial.

## Quick Start

1. Add your images to the `assets/` folder:
   - `landscape-logo.png` - Header logo
   - `square-logo.png` - Footer logo
   - `paulina.png` - Practitioner photo
   - `rebecca.jpg` - Practitioner photo

2. Deploy to GitHub Pages or any static hosting

3. That's it! No build process required.

## File Structure

```
├── index.html          # Main sales page
├── css/
│   └── styles.css      # All styles (mobile-first)
├── js/
│   └── main.js         # Smooth scroll, sticky header, FAQ accordion
├── assets/
│   ├── landscape-logo.png
│   ├── square-logo.png
│   ├── paulina.png
│   └── rebecca.jpg
└── README.md
```

## Features

- **Mobile-first responsive design** - Optimized for 70%+ mobile traffic
- **Sticky header** - Logo stays visible on scroll
- **Smooth scroll** - Anchor links scroll smoothly with header offset
- **FAQ accordion** - Click-to-expand answers
- **Lazy loading** - Images below fold load on demand
- **No dependencies** - Pure HTML, CSS, and vanilla JavaScript

## Design System

### Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-header` | `#1a5a4a` | Header, accents |
| `--color-cta` | `#2eb086` | Buttons, highlights |
| `--color-bg` | `#f5f5f5` | Page background |
| `--color-white` | `#ffffff` | Cards, content areas |
| `--color-text` | `#333333` | Body text |

### Breakpoints
- Mobile: < 768px (default styles)
- Tablet/Desktop: >= 768px
- Large Desktop: >= 1024px

## Customization

### Updating Prices
Edit the pricing section in `index.html`:
- Find `<section class="pricing" id="pricing">`
- Update `.price-current` and `.price-original` values
- Update checkout URLs in the button `href` attributes

### Changing Colors
Edit CSS custom properties at the top of `css/styles.css`:
```css
:root {
  --color-header: #1a5a4a;
  --color-cta: #2eb086;
  /* etc */
}
```

### Adding/Editing FAQ
Each FAQ item follows this structure in `index.html`:
```html
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span>Question text here</span>
    <span class="faq-icon">...</span>
  </button>
  <div class="faq-answer">
    <p>Answer text here</p>
  </div>
</div>
```

## Deployment

### GitHub Pages
1. Push to your repository
2. Go to Settings > Pages
3. Select branch and save
4. Site will be live at `https://username.github.io/repo-name/`

### Other Hosting
Upload all files to any static hosting (Netlify, Vercel, S3, etc.)

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- iOS Safari, Chrome for Android
- Graceful degradation for older browsers

## Compliance Notes

This page uses careful language for advertising compliance:
- No claims about "healing," "curing," or "treating" conditions
- Uses "support," "guidance," "approach" language
- Positioned as educational/nutritional, not medical
- Medical disclaimer included in footer

## License

Proprietary - Gut Healing Academy
