# personal-site

This repository contains a small, single-page personal landing site for Jake
Calkins. It is intentionally minimal and fast — a typographic landing page with
links to social profiles and a short bio. The site is built and deployed using
GitHub Pages Actions.

## Contents

- `index.html` — main page shell and placeholder for generated content
- `style.css` — site styling and theme variables (dark mode + responsive rules)
- `content/` — markdown files (new) that are converted into HTML
- `scripts/generate-md.js` — build script that converts markdown into HTML
- `package.json` — build dependencies and scripts (`npm run build:md`)
- `.github/workflows/static.yml` — Pages workflow that runs the build and deploys `dist/`

## Content authoring

- Add content as Markdown files into the `content/` directory (create it at the repo root if it doesn't exist).
- Each markdown file may include an optional YAML front-matter block at the top to set metadata for that section. Supported front-matter fields:
	- `title`: string — used as the section title (defaults to the filename)
	- `order`: number — lower values appear earlier in the page (defaults to filename order)

Example:
```md
---
title: About
order: 10
---

Here is the content for the About section.
```

## Build & CI

- The build performs the following during CI (and can be run locally):
	1. Read `content/*.md` and parse optional YAML front-matter.
	2. Convert Markdown to HTML using `marked`.
	3. Inject the generated HTML into `index.html` at the placeholder `<!-- MD_CONTENT -->`.
	4. Write the built site to `dist/index.html` and copy static assets (`style.css`, `favicon.svg`, `CNAME`) into `dist/`.
	5. The Pages workflow uploads the `dist/` artifact and deploys the site.

## Local testing

```bash
# install dependencies
npm ci

# build markdown into dist/
npm run build:md

# preview locally
python3 -m http.server 8000 --directory dist
# then open http://localhost:8000
```

## Notes and next steps

- The generated HTML is injected into the `.content` area of the page so existing styling (dark mode, responsive rules, FAB, etc.) is preserved.
- If you'd like per-markdown-page routes (separate HTML pages per file), RSS, or pagination, I can extend the build to generate multiple files and an index.

License: personal

### Testing & Coverage

- Run the unit and visual checks locally:

```bash
 npm ci
 npm run build:css
 npm run build:md
 npm run test:unit    # runs the generate-md integration test
 npm run test:visual  # runs the Puppeteer visual capture (saves snapshots in `tests/snapshots`)
```

- Visual baseline workflow:
	- The first time you run `npm run test:visual`, the script will save `tests/snapshots/latest-*.png`. If no baselines exist, it will promote those to `baseline-*.png` automatically.
	- Review the generated baseline images in `tests/snapshots`. If they look acceptable, commit them to the repo.
	- To approve a new baseline after intentional design changes: replace `baseline-*.png` with the corresponding `latest-*.png` and commit.

- Coverage reports:

```bash
 npm run coverage
 open coverage/lcov-report/index.html
```

The CI workflow now runs coverage during the `verify` job and uploads the `coverage/` folder as an artifact named `coverage-report`.
# personal-site

This repository contains a small, single-page personal landing site for Jake
Calkins. It is intentionally minimal and fast — a typographic landing page with
links to social profiles and a short bio.

Contents
- `index.html` — main page markup
- `style.css` — site styling and theme variables
- `favicon.svg` / other image assets
- `umass-cics-logo.svg` — UMass placeholder logo (replace with official artwork if available)
- `umass-cics-logo.svg` — UMass placeholder logo (replace with official artwork if available)

Quick development

1. Open `index.html` in your browser for local editing and preview.
2. The repository uses the official GitHub Pages Actions workflow to build and
	deploy the site. The CI workflow performs any necessary minification and
	publishes the site automatically on push to `master` (see `.github/workflows`).

Notes
- The minifier is intentionally lightweight (no third-party packages). For
	production quality minification you can replace it with a build toolchain
	(esbuild, terser, cssnano, html-minifier) if desired.
- Favicons are provided as SVG; generate PNG/ICO fallbacks if you need wider
	compatibility (ImageMagick or similar tools can convert SVG to PNG/ICO).

License: personal
