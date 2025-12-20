// fab.ts — floating action button behavior
(function () {
  'use strict';

  let open = false;

  function setOpen(val: boolean): void {
    open = val;
    const el = document.querySelector('.fab');
    if (!el) return;
    if (open) el.classList.add('is-open'); else el.classList.remove('is-open');
  }

  function toggleFab(): void {
    setOpen(!open);
  }

  function initFab(): void {
    const btn = document.getElementById('fab-toggle');
    if (!btn) return;
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleFab();
    });
  }

  initFab();

})();
