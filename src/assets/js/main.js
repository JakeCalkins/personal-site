// Compiled JS (generated from main.ts) — kept checked in for simplicity
(function () {
  'use strict';
  function setYear() {
    try {
      const el = document.getElementById('year');
      if (el)
        el.textContent = String(new Date().getFullYear());
    }
    catch (e) { }
  }
  function pickTheme() {
    try {
      const body = document.body;
      if (!body)
        return;
      if (body.getAttribute('data-theme'))
        return;
      try {
        const saved = localStorage.getItem('theme');
        if (saved) {
          body.setAttribute('data-theme', saved);
          return;
        }
      }
      catch (e) { void 0; }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return;
      }
      const themes = ['t1', 't2', 't3', 't4', 't5'];
      const pick = themes[Math.floor(Math.random() * themes.length)];
      body.setAttribute('data-theme', pick);
    }
    catch (e) { void 0; }
  }
  function initThemeToggle() {
    try {
      const btn = document.getElementById('theme-toggle');
      if (!btn)
        return;
      const body = document.body;
      const reflect = () => {
        const cur = body.getAttribute('data-theme');
        if (cur === 'dark') {
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-dark');
        }
        else {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('is-dark');
        }
      };
      btn.addEventListener('click', () => {
        const cur = body.getAttribute('data-theme');
        if (cur === 'dark') {
          try {
            localStorage.setItem('theme', 'light');
          }
          catch (e) { void 0; }
          body.setAttribute('data-theme', 'light');
        }
        else {
          try {
            localStorage.setItem('theme', 'dark');
          }
          catch (e) { void 0; }
          body.setAttribute('data-theme', 'dark');
        }
        reflect();
      });
      reflect();
    }
    catch (e) { void 0; }
  }
  setYear();
  pickTheme();
  initThemeToggle();
})();
// main.js — small runtime utilities: theme selection and footer year
// Keep this file tiny and deferred for performance.
(function(){
  'use strict';

  function setYear() {
    try {
      var el = document.getElementById('year');
      if (el) el.textContent = new Date().getFullYear();
    } catch (e) { /* ignore */ }
  }

  function pickTheme() {
    try {
      var body = document.body;
      if (!body) return;
      // Respect an explicit theme if set (server or previous choice).
      if (body.getAttribute('data-theme')) return;

      // Respect user's saved preference first
      try {
        var saved = localStorage.getItem('theme');
        if (saved) { body.setAttribute('data-theme', saved); return; }
      } catch (e) { void 0; }

      // If user prefers system dark, don't force a light random theme; allow
      // CSS `prefers-color-scheme` rules to take effect instead.
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return;
      }

      // No saved preference and no system dark: pick a random (light) theme.
      var themes = ['t1','t2','t3','t4','t5'];
      var pick = themes[Math.floor(Math.random()*themes.length)];
      body.setAttribute('data-theme', pick);
    } catch (e) { void 0; }
  }

  function initThemeToggle() {
    try {
      var btn = document.getElementById('theme-toggle');
      if (!btn) return;
      var body = document.body;

      var reflect = function() {
        var cur = body.getAttribute('data-theme');
        if (cur === 'dark') {
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-dark');
        } else {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('is-dark');
        }
      };

      btn.addEventListener('click', function () {
        var cur = body.getAttribute('data-theme');
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
