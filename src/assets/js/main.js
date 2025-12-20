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
      // If theme already set (e.g. by server/other script), don't override.
      if (body.getAttribute('data-theme')) return;
      var themes = ['t1','t2','t3','t4','t5'];
      var pick = themes[Math.floor(Math.random()*themes.length)];
      body.setAttribute('data-theme', pick);
    } catch (e) { /* fail silently */ }
  }

  // Defer execution until parsing complete — script will be loaded with `defer`.
  setYear();
  pickTheme();

})();
