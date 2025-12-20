# Project TODO & Roadmap

Status key
- [ ] not-started
- [-] in-progress
- [x] completed

Current Phase: Phase 3 — Framework evaluation & migration
- Goal: Simplify build + content pipeline, improve maintainability, and prepare for easy componentization.

Phase 3 Tasks
- [-] Reduce the amount of CSS code we have by using either LESS or SASS
    - [x] Evaluate pros and cons of LESS and SASS
    - [x] Evaluate if there are newer, better frameworks
    - [x] Select a framework (Sass)
    - [-] Migrate the style.css to the framework we select (sass) — in progress
- The glyph uses a Unicode anchor (⚓). If you prefer a different icon or an inline SVG for pixel-perfect visuals, I can replace it.
- I used the .rehype-autolink class because rehype-autolink-headings can wrap headings with a classed anchor — confirm your generated HTML uses this class. If your pipeline produces a different class or attribute, I can adapt the selector (for example, a[href^="#"] within headings).
- [ ] Replace the glyph with an inline SVG and style it precisely?
- [ ] Adjust the behavior to append instead of wrap and style the appended link instead?
- [ ] Add a separate dark theme partial (scoped) and a toggle.
- [ ] Wire in eslint + stylelint and run them in the verify job.
- [ ] Adjust specific shadow values (list which elements you want changed) or substitute inline SVG icons for the autolink glyph.


Backlog / Future Ideas
- Add per-markdown pages (permalinks + SEO) and generate a sitemap
- Add search (client-side or serverless) and related metadata generation
- Add unit tests for generator and visual regression checks
- Consider CSS-in-TS or scoped component styles if framework supports it