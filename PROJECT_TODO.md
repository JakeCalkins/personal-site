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

Backlog / Future Ideas
- Add per-markdown pages (permalinks + SEO) and generate a sitemap
- Add search (client-side or serverless) and related metadata generation
- Add unit tests for generator and visual regression checks
- Consider CSS-in-TS or scoped component styles if framework supports it