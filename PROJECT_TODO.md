# Project TODO & Roadmap

Phase 4 Tasks
- [ ] Add a separate dark theme partial (scoped) and a toggle.
- [ ] Wire in eslint + stylelint and run them in the verify job.
- [ ] Refactor the generate-md.js so it's written in TypeScript
- [ ] Refactor the fab.js so it's written in TypeScript
- [ ] Refactor the main.js so it's written in TypeScript
- [ ] Remove duplicate root files that can be removed. Ensure the webpage does not break after doing this.
- [ ] Add unit tests for generator and visual regression checks
- [ ] Add code coverage reports
- [ ] Add workflows for running the tests in GHA
- [ ] Update to the latest versions of everything so that vulnerabilities are remediated. Require NodeJS 22 or 24 (if 24 has issues, go to 22)
- [ ] Add logic so anytime a new markdown file is added to the content/ folder, a new page is generated and linked on the index.html homepage. New page links should exist as text links in the title div, right justified directly adjacent to the Jake Calkins title. On small browser views, they should be added as buttons in the FAB menu.
- [ ] Fix alignment issues on FAB, LinkedIn Icon and the Headers
- [ ] Remove .DS_Store from the repository, add to .gitignore
- [ ] Improve performance and page load speed across the board. Improve build times.
- [ ] Reduce generated filesize in dist/ and generated directory size.
- [ ] Generate a robots.txt and sitemap.
- [ ] Consider CSS-in-TS or scoped component styles if framework supports it --> what is this?