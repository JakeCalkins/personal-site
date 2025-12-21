// main.ts — small runtime utilities: theme selection and footer year
// Keep this file tiny and deferred for performance.
(function () {
  'use strict';

  function setYear(): void {
    try {
      const el = document.getElementById('year');
      if (el) el.textContent = String(new Date().getFullYear());
    } catch (e) { /* ignore */ }
  }

  function pickTheme(): void {
    try {
      const body = document.body;
      if (!body) return;

      // Check for saved user preference first
      try {
        const saved = localStorage.getItem('theme');
        if (saved && (saved === 'light' || saved === 'dark')) {
          body.setAttribute('data-theme', saved);
          return;
        }
      } catch (e) { void 0; }

      // Respect system preference; if dark, the data-theme attribute is not needed
      // since :root dark mode styles handle it. For light mode, explicitly set it.
      if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'light');
      }
    } catch (e) { void 0; }
  }

  function initThemeToggle(): void {
    try {
      const btn = document.getElementById('theme-toggle');
      if (!btn) return;
      const body = document.body;

      const reflect = () => {
        const cur = body.getAttribute('data-theme');
        if (cur === 'dark') {
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-dark');
        } else {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('is-dark');
        }
      };

      btn.addEventListener('click', () => {
        const cur = body.getAttribute('data-theme');
        if (cur === 'dark') {
          try { localStorage.setItem('theme', 'light'); } catch (e) { void 0; }
          body.setAttribute('data-theme', 'light');
        } else {
          try { localStorage.setItem('theme', 'dark'); } catch (e) { void 0; }
          body.setAttribute('data-theme', 'dark');
        }
        reflect();
      });

      // initial reflection
      reflect();
    } catch (e) { void 0; }
  }

  // Defer execution until parsing complete — script will be loaded with `defer`.
  setYear();
  pickTheme();
  initThemeToggle();

})();
