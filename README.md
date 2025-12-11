# Gut Health Quiz Landing Page

A landing page for the Gut Healing Academy gut health quiz. This page promotes the quiz and directs users to the full assessment.

## Features

- **Professional Landing Page**: Clean, conversion-focused design with trust indicators
- **Mobile-First Design**: Responsive layout that works beautifully on all devices
- **Testimonials Section**: Social proof with horizontal scroll on mobile
- **Sticky CTA**: Mobile-only sticky button for improved conversions
- **No Build Tools**: Pure HTML/CSS with minimal JavaScript

## Quick Start

### 1. Test Locally

Simply open `index.html` in your browser, or use a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

### 2. Deploy

Upload all files to any web host:
- `index.html`
- `css/styles.css`
- `assets/` folder

Works with: GitHub Pages, Netlify, Vercel, traditional web hosting, or any CDN.

## Page Sections

1. **Credential Bar** - Professional credibility at the top
2. **Hero Section** - Main headline, subheadline, hero image, and CTA
3. **Validation Section** - Before/after transformation messaging
4. **Testimonials** - Customer success stories with photos
5. **Credibility Section** - Value proposition details
6. **Footer** - Final CTA and medical disclaimer

## CTA Link

All CTA buttons link to:
```
https://www.guthealingacademy.com/gut-quiz
```

To change this, update the `href` attributes in `index.html`.

## Customization

### Change Colors

Edit `css/styles.css` - modify the CSS variables in `:root`:

```css
:root {
  --primary-teal: #6B9080;
  --secondary-sage: #A4C3B2;
  --bg-cream: #FDF8F5;
  --cta-coral: #E07A5F;
  --text-charcoal: #2D3436;
  --navy-blue: #264653;
}
```

### Update Images

Replace files in the `assets/` folder:
- `hero-woman.jpg` - Hero section image
- `testimonial-*.png` - Testimonial photos

## File Structure

```
/
├── index.html          # Landing page HTML
├── css/
│   └── styles.css      # All styling
├── assets/
│   ├── hero-woman.jpg
│   └── testimonial-*.png
├── README.md           # This file
└── CLAUDE.md           # Developer documentation
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is provided as-is for use in your gut health protocol business.

## Support

For modifications or questions, refer to `CLAUDE.md` for detailed technical documentation.
