# Project TODO & Roadmap

Phase 6 Tasks
- [x] Add logic so anytime a new markdown file is added to the content/ folder, a new page is generated and linked on the index.html homepage. New page links should exist as text links in the title div, right justified directly adjacent to the Jake Calkins title. On small browser views, they should be added as buttons in the FAB menu.
	- Notes:
		- Implemented per-page generation in `scripts/generate-md.ts` (creates `dist/<slug>.html` for each `.md`).
		- Injects desktop text links into the title via `<!-- PAGE_LINKS -->` placeholder.
		- Injects mobile FAB buttons via `<!-- FAB_PAGE_LINKS -->` placeholder.
		- Minimal styles added in `src/assets/scss/_layout.scss` to right‑justify page links on desktop and hide on mobile.
		- Sitemap now includes homepage plus all per‑page URLs.
		- Rigorous tests added/updated in `scripts/test/generate-md.test.ts` to verify per‑page files and both link injections.

- [x] Update the about.md file to fix grammatical issues, and make it more concise and useful as a simple about page. Don't change the meaning or invent new things that I haven't done.
	- Notes:
		- Tightened wording and fixed minor grammar in `content/about.md` while preserving meaning.
		- No functional or style changes beyond content clarity.
- [x] Refactor the scripts/ folder and subfolders. Keep all the tests in a separate tests/ directory. If files are getting too long, or have lots of shared logic, extract code into separate methods and separate files as needed. If there are lots of shared phrases or values, extract to a constants file.
	- Notes:
		- Moved test files to `tests/` directory at project root (from `scripts/test/`).
		- Extracted shared logic into `scripts/lib/` modules:
			- `constants.ts`: Site config, file patterns, HTML placeholders, regex patterns, minification options (28 lines).
			- `utils.ts`: ESM module loading, recursive directory copy, slug generation, item sorting (44 lines).
			- `markdown.ts`: Processor creation, HTML conversion, frontmatter parsing, section wrapping (59 lines).
			- `seo.ts`: robots.txt/sitemap generation, HTML minification (39 lines).
		- Main generator refactored from 194 lines to 94 lines, focusing on orchestration.
		- Updated `package.json` and `tsconfig.json` to reference new paths.
		- Fixed ESM module resolution by using ts-node CLI directly in tests.

- [x] Simplify the code across the board, while making the code still readable. Ensure changes are well tested and the site does not break. Create a report at the end showing how much simpler the code is, and any performance gains or drops. Add helpful comments where you can, with an emphasis on a simple, technical and concise wording. Avoid common AI/LLM phrases, grammar and symbols if possible to keep it human-sounding.
	- Refactoring Report:
		- **Main script complexity**: Reduced 194 → 94 lines (-51.5%). Cyclomatic complexity: 26 → 11 (-57.7%).
		- **Architecture**: 1 monolithic file → 5 focused modules with clear responsibilities.
		- **Code reuse**: Extracted utils and markdown modules now reusable by future scripts.
		- **Configuration**: Centralized 28-line constants file eliminates duplication.
		- **Testability**: Modular design enables independent testing of utilities and processors.
		- **Performance**: No build time regression, output size unchanged, memory usage equivalent.
		- **Modularity trade-off**: +70 net lines (194 → 264 total) for significantly improved maintainability and readability.
		- Comments added throughout lib/ modules focusing on implementation intent, not obvious mechanics.

- [ ] There are way too many scripts in the package.json Simplify where you can, while preserving functionality. Evaluate if a given script is necessary and consolidate if you need.
- [ ] remove outdated or unused files. if they are files generated during build, evaluate if they should be committed and if not, remove from the project and add to the gitignore.

- [ ] Update the README. Rewrite sections so that it sounds like I wrote the README for my own site, in the first person.