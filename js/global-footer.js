// Global Footer - injected on every page
// Edit this file to update the footer across the entire site
(function() {
  const year = new Date().getFullYear();

  const footerHTML = `
    <div class="container">
      <div class="footer-disclaimer">
        <p>This program is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. It is not a substitute for professional medical consultation. If you are experiencing severe symptoms, unexplained weight loss, blood in stool, or any symptoms that concern you, please consult a qualified healthcare provider immediately. The Gut Healing Academy does not provide medical diagnoses or treatment recommendations. Results vary based on individual factors and adherence to the program.</p>
      </div>
      <div class="footer-links">
        <a href="/legal/index.html">Privacy Policy</a>
        <span class="divider">|</span>
        <a href="/legal/terms.html">Terms of Service</a>
        <span class="divider">|</span>
        <a href="/legal/disclaimer.html">Medical Disclaimer</a>
        <span class="divider">|</span>
        <a href="/legal/contact.html">Contact Us</a>
        <span class="divider">|</span>
        <a href="/about/">About Us</a>
        <span class="divider">|</span>
        <a href="/foods/">Food Guides</a>
      </div>
      <p class="footer-copyright">&copy; ${year} Gut Healing Academy. All rights reserved.</p>
    </div>
  `;

  // Find existing footer and replace its contents, or create one
  let footer = document.querySelector('footer.site-footer');
  if (footer) {
    footer.innerHTML = footerHTML;
  } else {
    footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = footerHTML;
    // Insert before closing </body> but after main content
    const supportWidget = document.querySelector('script[src*="support-widget"]');
    if (supportWidget) {
      supportWidget.parentNode.insertBefore(footer, supportWidget);
    } else {
      document.body.appendChild(footer);
    }
  }
})();
