// main.ts — small runtime utilities: theme selection and footer year
// Keep this file tiny and deferred for performance.
(function () {
    'use strict';
    function setYear() {
        try {
            const el = document.getElementById('year');
            if (el)
                el.textContent = String(new Date().getFullYear());
        }
        catch (e) { /* ignore */ }
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
            catch (e) {
                void 0;
            }
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return;
            }
            const themes = ['t1', 't2', 't3', 't4', 't5'];
            const pick = themes[Math.floor(Math.random() * themes.length)];
            body.setAttribute('data-theme', pick);
        }
        catch (e) {
            void 0;
        }
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
                    catch (e) {
                        void 0;
                    }
                    body.setAttribute('data-theme', 'light');
                }
                else {
                    try {
                        localStorage.setItem('theme', 'dark');
                    }
                    catch (e) {
                        void 0;
                    }
                    body.setAttribute('data-theme', 'dark');
                }
                reflect();
            });
            // initial reflection
            reflect();
        }
        catch (e) {
            void 0;
        }
    }
    // Defer execution until parsing complete — script will be loaded with `defer`.
    setYear();
    pickTheme();
    initThemeToggle();
})();
