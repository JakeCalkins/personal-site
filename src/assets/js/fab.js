// Compiled JS (generated from fab.ts) — kept checked in to avoid adding a full toolchain
(function () {
  'use strict';
  function initFab() {
    try {
      const fabButton = document.getElementById('fab-button');
      const fabMenu = document.getElementById('fab-menu');
      const fabBackdrop = document.getElementById('fab-backdrop');
      if (!fabButton || !fabMenu || !fabBackdrop)
        return;
      const setOpen = (open) => {
        if (open) {
          fabButton.classList.add('open');
          fabMenu.classList.add('open');
          fabBackdrop.classList.add('visible');
          fabButton.setAttribute('aria-expanded', 'true');
          fabMenu.setAttribute('aria-hidden', 'false');
          fabBackdrop.setAttribute('aria-hidden', 'false');
        }
        else {
          fabButton.classList.remove('open');
          fabMenu.classList.remove('open');
          fabBackdrop.classList.remove('visible');
          fabButton.setAttribute('aria-expanded', 'false');
          fabMenu.setAttribute('aria-hidden', 'true');
          fabBackdrop.setAttribute('aria-hidden', 'true');
        }
      };
      const toggleFab = () => setOpen(!fabButton.classList.contains('open'));
      fabButton.addEventListener('click', (e) => { e.preventDefault(); toggleFab(); });
      fabBackdrop.addEventListener('click', () => { setOpen(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
      const links = fabMenu.querySelectorAll('a');
      links.forEach((a) => a.addEventListener('click', () => { setOpen(false); }));
    }
    catch (e) { }
  }
  initFab();
})();
// fab.js — handles the mobile FAB open/close behavior
// Deferred and tiny to avoid blocking render.
(function(){
  'use strict';

  function initFab() {
    try {
      var fabButton = document.getElementById('fab-button');
      var fabMenu = document.getElementById('fab-menu');
      var fabBackdrop = document.getElementById('fab-backdrop');

      if (!fabButton || !fabMenu || !fabBackdrop) return;

      var setOpen = function(open) {
        if (open) {
          fabButton.classList.add('open');
          fabMenu.classList.add('open');
          fabBackdrop.classList.add('visible');
          fabButton.setAttribute('aria-expanded','true');
          fabMenu.setAttribute('aria-hidden','false');
          fabBackdrop.setAttribute('aria-hidden','false');
        } else {
          fabButton.classList.remove('open');
          fabMenu.classList.remove('open');
          fabBackdrop.classList.remove('visible');
          fabButton.setAttribute('aria-expanded','false');
          fabMenu.setAttribute('aria-hidden','true');
          fabBackdrop.setAttribute('aria-hidden','true');
        }
      }

      var toggleFab = function() { setOpen(!fabButton.classList.contains('open')); };

      fabButton.addEventListener('click', function(e){ e.preventDefault(); toggleFab(); });
      fabBackdrop.addEventListener('click', function(){ setOpen(false); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setOpen(false); });
      Array.prototype.slice.call(fabMenu.querySelectorAll('a')).forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });

    } catch (e) { /* ignore initialization errors */ }
  }

  // Initialize when DOM is parsed. Scripts are loaded with `defer` so DOM is ready.
  initFab();

})();
