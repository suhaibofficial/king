document.addEventListener('DOMContentLoaded', () => {

  // --- SB hero video: attempt play() explicitly too — a safety net for any
  //     browser that doesn't honor the autoplay attribute alone ---
  (function playHeroVideo() {
    const v = document.querySelector('.hero-bg-video');
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener('loadeddata', tryPlay, { once: true });
    v.addEventListener('canplay', tryPlay, { once: true });
  })();

  // --- SB image protection: hero photo, hero2 (not foolproof) ---
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
  //     Ctrl/Cmd+Shift+I/J/C, F12). Like all client-side measures, not foolproof. ---
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

  // --- SB's hero heading: letters start scattered and settle into their correct
  //     place on load, staggered ---
  (function initHeroHeadingScramble() {
    const heading = document.getElementById('hero-heading');
    if (!heading) return;
    const lines = Array.from(heading.querySelectorAll('.hero-heading-line'));
    let letterIndex = 0;
    lines.forEach(line => {
      const signature = line.querySelector('.hero-signature');
      const text = signature
        ? line.textContent.slice(0, line.textContent.length - signature.textContent.length)
        : line.textContent;
      line.innerHTML = '';
      Array.from(text).forEach(ch => {
        const span = document.createElement('span');
        span.className = 'hl-letter';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        const sx = Math.round(Math.random() * 90 - 45) + 'px';
        const sy = Math.round(Math.random() * 70 - 35) + 'px';
        const sr = Math.round(Math.random() * 50 - 25) + 'deg';
        span.style.setProperty('--sx', sx);
        span.style.setProperty('--sy', sy);
        span.style.setProperty('--sr', sr);
        span.style.transitionDelay = (letterIndex * 0.018) + 's';
        line.appendChild(span);
        letterIndex++;
      });
      if (signature) line.appendChild(signature);
    });
    const desc = document.querySelector('.hero-heading-desc');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heading.classList.add('hl-settled');
        if (desc) desc.classList.add('hl-desc-in');
      });
    });
  })();

});
