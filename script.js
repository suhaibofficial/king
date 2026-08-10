document.addEventListener('DOMContentLoaded', () => {

  // --- SB image protection: logo, main image, hero2 (not foolproof) ---
  (function initImageProtection() {
    const shields = document.querySelectorAll('.protected-shield');
    shields.forEach(shield => {
      shield.addEventListener('contextmenu', (e) => e.preventDefault());
      shield.addEventListener('dragstart', (e) => e.preventDefault());
      shield.addEventListener('selectstart', (e) => e.preventDefault());
    });
    document.querySelectorAll('.protected-img').forEach(img => {
      img.addEventListener('contextmenu', (e) => e.preventDefault());
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  })();

  // --- SB blocks common save/inspect shortcuts site-wide (Ctrl/Cmd+S, Ctrl/Cmd+U,
  //     Ctrl/Cmd+Shift+I/J/C, F12). Page-level by nature, not foolproof. ---
  document.addEventListener('keydown', (e) => {
    const k = e.key ? e.key.toLowerCase() : '';
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const blocksSaveOrSource = isCtrlOrCmd && (k === 's' || k === 'u');
    const blocksDevtoolsCombo = isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(k);
    if (blocksSaveOrSource || blocksDevtoolsCombo || e.key === 'F12') {
      e.preventDefault();
    }
  });

  // --- SB navbar: glass is already visible on load; scrolled just deepens it slightly ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function updateNavbar() { navbar.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // --- SB desktop nav: Process / About / Contact are always visible; "Home"
  //     alone fades in once the main hero image has fully scrolled past. ---
  (function initHomeLinkReveal() {
    const heroImageSection = document.querySelector('.hero-image-section');
    const navHomeLink = document.getElementById('nav-home-link');
    if (!heroImageSection || !navHomeLink) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const scrolledPast = entry.boundingClientRect.bottom < 0;
        navHomeLink.classList.toggle('nav-home-visible', scrolledPast);
      });
    }, { threshold: 0 });
    io.observe(heroImageSection);
  })();

  // --- SB mobile full-page menu ---
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  function toggleMenu(open) {
    if (!menuOverlay) return;
    menuOverlay.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => toggleMenu(!menuOverlay.classList.contains('active')));
    menuOverlay.querySelectorAll('.menu-links-full > li > a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
  window.addEventListener('pageshow', () => toggleMenu(false));

  // --- SB nav "clicked" highlight — the tapped/clicked link stays visibly
  //     brighter than its siblings within the same nav group. Holding shows
  //     the same highlight via the :active rules in CSS. ---
  function bindActiveHighlight(selector) {
    const links = document.querySelectorAll(selector);
    links.forEach(link => {
      link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('nav-link-active'));
        link.classList.add('nav-link-active');
      });
    });
  }
  bindActiveHighlight('.nav-desktop-link');
  bindActiveHighlight('.menu-nav-link');

  // --- SB's "Home" links: on the home page itself, scroll smoothly back to
  //     the top instead of reloading; elsewhere, let the link go to "/" as usual. ---
  ['nav-home-link', 'menu-home-link'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      const path = window.location.pathname;
      const isHome = path === '/' || path === '' || path.endsWith('/index.html');
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // --- SB's word-by-word meta highlight: each word toggles independently on
  //     click; holding (press) highlights it too, via the :active rule in CSS. ---
  document.querySelectorAll('.hero-meta-word').forEach(word => {
    word.addEventListener('click', () => word.classList.toggle('is-active'));
  });

  // --- SB's "about us" link: click toggles a lasting highlight; holding
  //     highlights it too, via the :active rule in CSS. ---
  const aboutLink = document.getElementById('hero-about-link');
  if (aboutLink) {
    aboutLink.addEventListener('click', () => aboutLink.classList.add('is-active'));
  }

  // --- SB's round CTA + email/telegram pills: press-and-hold gets the same
  //     colour shift as a click, on both mouse and touch. A quick tap still
  //     gets a brief, visible flash even if the press was instant. ---
  document.querySelectorAll('.round-btn, .connect-pill').forEach(el => {
    let releaseTimer = null;
    const press = () => { clearTimeout(releaseTimer); el.classList.add('is-pressed'); };
    const release = () => { releaseTimer = setTimeout(() => el.classList.remove('is-pressed'), 260); };
    const releaseNow = () => { clearTimeout(releaseTimer); el.classList.remove('is-pressed'); };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointerleave', releaseNow);
    el.addEventListener('pointercancel', releaseNow);
  });

  // --- SB hero: fades in smoothly on load (badge, heading, sub-head, meta, links) ---
  (function initHeroReveal() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add('hero-loaded'));
    });
  })();

  // --- SB capability cards: tapping a card briefly intensifies its dynamic
  //     visual (no light/press feedback on the card itself). Card 04's bars
  //     also each rise individually when clicked directly. ---
  (function initCapabilityCards() {
    document.querySelectorAll('.capability-card').forEach(card => {
      const visual = card.querySelector('.capability-visual');
      if (!visual) return;
      card.addEventListener('click', () => {
        visual.classList.add('cv-boost');
        setTimeout(() => visual.classList.remove('cv-boost'), 900);
      });
    });
    document.querySelectorAll('.cv-stack-bar').forEach(bar => {
      bar.addEventListener('click', (e) => {
        e.stopPropagation();
        const siblings = bar.parentElement.querySelectorAll('.cv-stack-bar');
        siblings.forEach(b => b.classList.remove('cv-stack-active'));
        bar.classList.add('cv-stack-active');
      });
    });
  })();

  // --- SB's smooth fade-in once media actually has data, instead of a hard pop-in ---
  function fadeInMediaOnReady(selector) {
    document.querySelectorAll(selector).forEach(el => {
      if (el.tagName === 'IMG') {
        if (el.complete && el.naturalWidth) el.classList.add('media-ready');
        else el.addEventListener('load', () => el.classList.add('media-ready'), { once: true });
      }
    });
  }
  fadeInMediaOnReady('.feature-banner-img, .hero-main-img');

  // --- SB's reveal-on-scroll (buffered a little early so content never feels late) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '120px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});
