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
- [ ] Refactor the scripts/ folder and subfolders. Keep all the tests in a separate tests/ directory. If files are getting too long, or have lots of shared logic, extract code into separate methods and separate files as needed. If there are lots of shared phrases or values, extract to a constants file.
- [ ] Simplify the code across the board, while making the code still readable. Ensure changes are well tested and the site does not break. Create a report at the end showing how much simpler the code is, and any performance gains or drops. Add helpful comments where you can, with an emphasis on a simple, technical and concise wording. Avoid common AI/LLM phrases, grammar and symbols if possible to keep it human-sounding.