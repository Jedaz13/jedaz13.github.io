// CRO Conversion Elements — offer-protocol page
// sessionStorage keys: gha_ prefix | CSS classes: gha-cro- prefix
(function() {
  'use strict';
  function initCRO() {
    if (typeof pageParams === 'undefined') { setTimeout(initCRO, 50); return; }

    var userName = pageParams.name || 'friend';
    var protocolName = 'personalized gut health';
    try {
      if (typeof getFriendlyProtocolName === 'function' && typeof resolveProtocolKey === 'function') {
        var fn = getFriendlyProtocolName(resolveProtocolKey(), pageParams.gut_brain === true);
        if (fn) protocolName = fn;
      }
    } catch(e) {}

    var ss = sessionStorage;
    var state = {
      exitPopupOpen: false,
      toastVisible: false,
      stickyVisible: false,
      toastCount: parseInt(ss.getItem('gha_toast_count')||'0',10),
      toastDismissed: parseInt(ss.getItem('gha_toast_dismissed')||'0',10),
      exitShown: ss.getItem('gha_exit_shown')==='true',
      stickyDismissed: ss.getItem('gha_sticky_dismissed')==='true',
      pageLoad: Date.now(),
      lastInteraction: Date.now(),
      scrolledPast50: false
    };

    // Helper: smooth scroll to checkout
    function scrollToCheckout() {
      var el = document.querySelector('.pricing-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    // ===== Collapsible Protocols Grid =====
    (function() {
      var section = document.querySelector('.protocols-grid-section');
      var toggle = document.getElementById('gha-cro-grid-toggle');
      if (!section || !toggle) return;
      var textEl = toggle.querySelector('.gha-cro-grid-toggle-text');
      var expanded = false;

      toggle.addEventListener('click', function() {
        expanded = !expanded;
        section.classList.toggle('gha-cro-grid-expanded', expanded);
        if (textEl) textEl.textContent = expanded ? 'Show less' : 'See all 6 protocols';
      });
    })();

    // ===== ELEMENT 1: Sticky Mobile CTA =====
    (function() {
      if (state.stickyDismissed) return;
      var bar = document.getElementById('gha-cro-sticky');
      var checkout = document.querySelector('.pricing-section');
      if (!bar || !checkout) return;
      var seen = false;

      bar.querySelector('.gha-cro-sticky-dismiss').addEventListener('click', function(e) {
        e.stopPropagation();
        bar.classList.remove('gha-cro-sticky-visible');
        state.stickyVisible = false; state.stickyDismissed = true;
        ss.setItem('gha_sticky_dismissed','true');
        document.body.classList.remove('gha-cro-has-sticky');
      });
      bar.addEventListener('click', scrollToCheckout);

      var obs = new IntersectionObserver(function(entries) {
        if (state.stickyDismissed) return;
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            seen = true;
            bar.classList.remove('gha-cro-sticky-visible');
            state.stickyVisible = false;
            document.body.classList.remove('gha-cro-has-sticky');
          } else if (seen && entry.boundingClientRect.top > 0) {
            bar.classList.add('gha-cro-sticky-visible');
            state.stickyVisible = true;
            document.body.classList.add('gha-cro-has-sticky');
          } else {
            bar.classList.remove('gha-cro-sticky-visible');
            state.stickyVisible = false;
            document.body.classList.remove('gha-cro-has-sticky');
          }
        });
      }, {threshold:0.1});
      obs.observe(checkout);
    })();

    // ===== ELEMENT 4: Inline CTAs =====
    (function() {
      var btns = document.querySelectorAll('.gha-cro-cta-button');
      for (var i=0;i<btns.length;i++) {
        btns[i].addEventListener('click', function(e) { e.preventDefault(); scrollToCheckout(); });
      }
      var pn = document.querySelectorAll('.gha-cro-cta-protocol-name');
      var short = protocolName.replace(' Protocol','') || 'Personalized';
      for (var j=0;j<pn.length;j++) pn[j].textContent = short;
    })();

    // ===== ELEMENT 5: Toast Notifications =====
    (function() {
      var container = document.getElementById('gha-cro-toast');
      if (!container) return;

      var notifs = [
        {t:'p',n:'Sarah M.',l:'London, UK',p:'Bloating Protocol'},
        {t:'p',n:'Jennifer L.',l:'Austin, TX',p:'IBS-C Protocol'},
        {t:'p',n:'Claire T.',l:'Dublin, IE',p:'Post-SIBO Recovery'},
        {t:'p',n:'Jessica W.',l:'Sydney, AU',p:'Gut-Brain Protocol'},
        {t:'p',n:'Maria K.',l:'Toronto, CA',p:'IBS-D Protocol'},
        {t:'p',n:'Rachel P.',l:'Denver, CO',p:'Bloating Protocol'},
        {t:'p',n:'Anna S.',l:'Auckland, NZ',p:'IBS-M Protocol'},
        {t:'p',n:'Michelle D.',l:'Portland, OR',p:'Gut-Brain Protocol'},
        {t:'p',n:'Emma R.',l:'Manchester, UK',p:'IBS-C Protocol'},
        {t:'p',n:'Lauren H.',l:'Chicago, IL',p:'Post-SIBO Recovery'},
        {t:'q',n:'Someone',l:'Birmingham, UK',p:null},
        {t:'q',n:'Someone',l:'Nashville, TN',p:null},
        {t:'q',n:'Someone',l:'Glasgow, UK',p:null},
        {t:'q',n:'Someone',l:'San Diego, CA',p:null},
        {t:'q',n:'Someone',l:'Leeds, UK',p:null}
      ];
      // Shuffle
      for (var i=notifs.length-1;i>0;i--) {
        var j=Math.floor(Math.random()*(i+1)),tmp=notifs[i];notifs[i]=notifs[j];notifs[j]=tmp;
      }
      var idx = 0;

      function randTime(type) {
        if (type==='p') {
          var r = Math.random();
          if (r<0.5) return (Math.floor(Math.random()*44)+2)+' minutes ago';
          if (r<0.8) { var h=Math.floor(Math.random()*6)+1; return h+(h===1?' hour ago':' hours ago'); }
          var d=Math.floor(Math.random()*2)+1; return d+(d===1?' day ago':' days ago');
        }
        return (Math.floor(Math.random()*34)+2)+' minutes ago';
      }

      function showToast() {
        if (state.exitPopupOpen||state.toastVisible) return;
        if (state.toastCount>=6||state.toastDismissed>=2||idx>=notifs.length) return;
        var n=notifs[idx++], time=randTime(n.t);
        var icon=n.t==='p'?'\uD83D\uDFE2':'\uD83D\uDCCB';
        var txt = n.t==='p'
          ? '<strong>'+n.n+'</strong> from '+n.l+' just got their <span class="gha-cro-toast-protocol">'+n.p+'</span>'
          : '<strong>Someone</strong> from '+n.l+' just completed their gut health assessment';

        container.innerHTML = '<div class="gha-cro-toast-card"><button class="gha-cro-toast-close" aria-label="Dismiss">&times;</button><div class="gha-cro-toast-content"><span class="gha-cro-toast-icon">'+icon+'</span><div class="gha-cro-toast-text">'+txt+'<div class="gha-cro-toast-time">'+time+'</div></div></div></div>';
        container.classList.add('gha-cro-toast-visible');
        state.toastVisible = true;
        state.toastCount++; ss.setItem('gha_toast_count', state.toastCount.toString());

        container.querySelector('.gha-cro-toast-close').addEventListener('click', function(e) {
          e.stopPropagation(); hideToast();
          state.toastDismissed++; ss.setItem('gha_toast_dismissed', state.toastDismissed.toString());
        });
        setTimeout(hideToast, 4000);
      }

      function hideToast() { container.classList.remove('gha-cro-toast-visible'); state.toastVisible = false; }

      function scheduleNext() {
        if (state.toastCount>=6||state.toastDismissed>=2||idx>=notifs.length) return;
        setTimeout(function() {
          if (!state.exitPopupOpen) showToast();
          scheduleNext();
        }, Math.floor(Math.random()*15000)+30000);
      }

      // First toast at 15s
      setTimeout(function() { showToast(); scheduleNext(); }, 15000);
    })();

    // ===== ELEMENT 3: Exit-Intent Popup =====
    (function() {
      if (state.exitShown) return;
      var popup = document.getElementById('gha-cro-exit-popup');
      if (!popup) return;

      var ne = popup.querySelector('.gha-cro-exit-name');
      var pe = popup.querySelector('.gha-cro-exit-protocol');
      if (ne) ne.textContent = userName || 'friend';
      if (pe) pe.textContent = protocolName || 'personalized gut health';

      function show() {
        if (state.exitShown) return;
        if (Date.now()-state.pageLoad < 30000) return;
        if (state.toastVisible) { setTimeout(show, 3000); return; }
        state.exitShown = true; state.exitPopupOpen = true;
        ss.setItem('gha_exit_shown','true');
        popup.classList.add('gha-cro-exit-visible');
        document.body.style.overflow = 'hidden';
      }

      function close() {
        popup.classList.remove('gha-cro-exit-visible');
        document.body.style.overflow = '';
        state.exitPopupOpen = false;
      }

      popup.querySelector('.gha-cro-exit-overlay').addEventListener('click', close);
      popup.querySelector('.gha-cro-exit-close').addEventListener('click', close);
      popup.querySelector('.gha-cro-exit-dismiss').addEventListener('click', close);
      popup.querySelector('.gha-cro-exit-cta').addEventListener('click', function(e) {
        e.preventDefault(); close(); scrollToCheckout();
      });
      document.addEventListener('keydown', function(e) { if (e.key==='Escape'&&state.exitPopupOpen) close(); });

      // Desktop: mouseout near top
      document.addEventListener('mouseout', function(e) {
        if (e.clientY < 5 && !state.exitShown) show();
      });

      // Mobile: 60s on page + 30s idle + 50% scrolled
      var mobileIv = setInterval(function() {
        if (state.exitShown) { clearInterval(mobileIv); return; }
        if (Date.now()-state.pageLoad>=60000 && Date.now()-state.lastInteraction>=30000 && state.scrolledPast50) {
          show(); clearInterval(mobileIv);
        }
      }, 5000);

      ['scroll','touchstart','touchmove'].forEach(function(evt) {
        document.addEventListener(evt, function() { state.lastInteraction = Date.now(); }, {passive:true});
      });
      window.addEventListener('scroll', function() {
        if (window.scrollY/(document.documentElement.scrollHeight-window.innerHeight) >= 0.5) state.scrolledPast50 = true;
      }, {passive:true});
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initCRO, 10); });
  } else { setTimeout(initCRO, 10); }
})();
