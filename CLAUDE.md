# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A landing page for the Gut Healing Academy gut health quiz. The page promotes the quiz and directs users to take the full assessment on the main site.

## Tech Stack

- **HTML/CSS**: Vanilla implementation, no frameworks or build tools
- **Styling**: Mobile-first responsive design
- **Hosting**: Static files - can be hosted on any web server, GitHub Pages, Netlify, etc.

## Development Commands

This is a static site with no build process. To develop:

```bash
# Simply open index.html in a browser
# Or use a local server (recommended for testing):
python -m http.server 8000
# Then visit http://localhost:8000
```

For production, upload all files and directories to any web host.

## Architecture

### File Structure
```
/
├── index.html              # Landing page HTML
├── css/
│   └── styles.css          # Landing page styling
├── assets/
│   ├── hero-woman.jpg      # Hero section image
│   ├── testimonial-suzy.png
│   ├── testimonial-amanda.png
│   └── testimonial-cheryl.png
├── CLAUDE.md               # This file
└── README.md               # Project readme
```

### Page Sections

1. **Credential Bar**: Displays team credentials
2. **Hero Section**: Main headline, subheadline, and primary CTA
3. **Validation Section**: Before/after transformation messaging
4. **Testimonials Section**: Social proof with customer testimonials
5. **Credibility Section**: Value proposition and secondary CTA
6. **Footer**: Final CTA and medical disclaimer
7. **Sticky CTA**: Mobile-only sticky button (appears when hero CTA scrolls out of view)

### CTA Links

All CTA buttons link to the external quiz:
```
https://www.guthealingacademy.com/gut-quiz
```

## Styling Notes (css/styles.css)

### Color Palette
```css
--primary-teal: #6B9080;      /* Accent color, trust signal */
--secondary-sage: #A4C3B2;    /* Validation card border */
--bg-cream: #FDF8F5;          /* Page background */
--cta-coral: #E07A5F;         /* CTA buttons */
--text-charcoal: #2D3436;     /* Primary text */
--navy-blue: #264653;         /* Credential bar, footer */
--white: #FFFFFF;             /* Cards, backgrounds */
```

### Key Features
- Mobile-first responsive design
- Horizontal scroll testimonials on mobile, grid on desktop
- Sticky mobile CTA with smooth show/hide animation
- Fade-in page animation

## Testing Checklist

When making changes, test:
- [ ] Landing page displays correctly with all sections
- [ ] All CTA buttons link to the external quiz URL
- [ ] Hero image loads correctly
- [ ] Testimonial images load correctly
- [ ] Testimonials scroll horizontally on mobile
- [ ] Testimonials display as grid on desktop
- [ ] Sticky CTA appears/disappears correctly on mobile
- [ ] Sticky CTA is hidden on desktop
- [ ] Mobile responsive design works
- [ ] Footer disclaimer is readable

## Modifications

### Updating CTA Link

To change the quiz URL, update all CTA links in `index.html`:
- Primary CTA in hero section
- Secondary CTA in credibility section
- Footer CTA
- Sticky CTA

### Customizing Styling

- **Colors**: Update CSS variables in `:root` in `css/styles.css`
- **Layout**: Modify section padding and max-widths in CSS
- **Typography**: Adjust font sizes in the responsive media queries
