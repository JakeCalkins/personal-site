// fab.ts — floating action button behavior
(function () {
  'use strict';

  function initFab(): void {
    try {
      const fabButton = document.getElementById('fab-button');
      const fabMenu = document.getElementById('fab-menu');
      const fabBackdrop = document.getElementById('fab-backdrop');

      if (!fabButton || !fabMenu || !fabBackdrop) return;

      const setOpen = (open: boolean) => {
        if (open) {
          fabButton.classList.add('open');
          fabMenu.classList.add('open');
          fabBackdrop.classList.add('visible');
          fabButton.setAttribute('aria-expanded', 'true');
          fabMenu.setAttribute('aria-hidden', 'false');
          fabBackdrop.setAttribute('aria-hidden', 'false');
        } else {
          fabButton.classList.remove('open');
          fabMenu.classList.remove('open');
          fabBackdrop.classList.remove('visible');
          fabButton.setAttribute('aria-expanded', 'false');
          fabMenu.setAttribute('aria-hidden', 'true');
          fabBackdrop.setAttribute('aria-hidden', 'true');
        }
      };

      const toggleFab = () => setOpen(!fabButton.classList.contains('open'));

      fabButton.addEventListener('click', (e: MouseEvent) => { e.preventDefault(); toggleFab(); });
      fabBackdrop.addEventListener('click', () => { setOpen(false); });
      document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); });

      const links = fabMenu.querySelectorAll('a');
      links.forEach((a) => a.addEventListener('click', () => { setOpen(false); }));

    } catch (e) {
      // ignore initialization errors
    }
  }

  // Initialize when DOM is parsed. Scripts are loaded with `defer` so DOM is ready.
  initFab();

})();
