# Project TODO & Roadmap

Status key
- [ ] not-started
- [-] in-progress
- [x] completed

Current Phase: Phase 3 — Framework evaluation & migration
- Goal: Simplify build + content pipeline, improve maintainability, and prepare for easy componentization.

Phase 3 Tasks
- [ ] Replace the glyph with an inline SVG and style it precisely?
- [ ] Adjust the behavior to append instead of wrap and style the appended link instead?
- [ ] Add a separate dark theme partial (scoped) and a toggle.
- [ ] Wire in eslint + stylelint and run them in the verify job.
- [ ] Adjust specific shadow values (list which elements you want changed) or substitute inline SVG icons for the autolink glyph.
- [ ] Refactor the generate-md.js so it's written in TypeScript
- [ ] Refactor the fab.js so it's written in TypeScript
- [ ] Refactor the main.js so it's written in TypeScript
- [ ] Remove duplicate root files that can be removed. Ensure the webpage does not break after doing this.
- [ ] Add unit tests, functional tests and browser tests.
- [ ] Add code coverage reports
- [ ] Add workflows for running the tests in GHA
- [ ] Update to the latest versions of everything so that vulnerabilities are remediated. Require NodeJS 22 or 24 (if 24 has issues, go to 22)
- [ ] Add logic so anytime a new markdown file is added to the content/ folder, a new page is generated and linked on the index.html homepage. New page links should exist as text links in the title div, right justified directly adjacent to the Jake Calkins title. On small browser views, they should be added as buttons in the FAB menu.
- [ ] Fix alignment issues on FAB, LinkedIn Icon and the Headers


Backlog / Future Ideas
- Add per-markdown pages (permalinks + SEO) and generate a sitemap
- Add search (client-side or serverless) and related metadata generation
- Add unit tests for generator and visual regression checks
- Consider CSS-in-TS or scoped component styles if framework supports it