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
      } catch (e) { /* ignore storage errors */ }

      // If user prefers system dark, don't force a light random theme; allow
      // CSS `prefers-color-scheme` rules to take effect instead.
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return;
      }

      // No saved preference and no system dark: pick a random (light) theme.
      var themes = ['t1','t2','t3','t4','t5'];
      var pick = themes[Math.floor(Math.random()*themes.length)];
      body.setAttribute('data-theme', pick);
    } catch (e) { /* fail silently */ }
  }

  // Defer execution until parsing complete — script will be loaded with `defer`.
  setYear();
  pickTheme();

})();
