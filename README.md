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
