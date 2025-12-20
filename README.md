# personal-site

A minimal, fast, single-page personal landing site for Jake Calkins featuring a typographic design with dark theme support, responsive layout, and markdown-powered content. Built with TypeScript and deployed automatically via GitHub Pages.

## Features

- **Dark/Light Theme Toggle** — Automatic dark mode detection with manual override
- **Responsive Design** — Mobile-first with FAB navigation and desktop icon bar
- **Markdown Content** — Write content in Markdown with YAML front-matter support
- **TypeScript Build System** — Type-safe build scripts and client code
- **Automated CI/CD** — GitHub Actions workflow with linting, testing, and coverage
- **SEO Ready** — Generates `robots.txt` and `sitemap.xml` automatically

## Project Structure

```
├── src/
│   ├── index.html              # Main page template
│   ├── assets/
│   │   ├── scss/               # SCSS source files (variables, themes, components)
│   │   ├── css/                # Generated CSS (gitignored)
│   │   ├── ts/                 # TypeScript source for client-side runtime
│   │   ├── js/                 # Compiled JS (gitignored)
│   │   └── icons/              # SVG icons and images
├── content/                    # Markdown content files
├── scripts/                    # TypeScript build scripts
│   ├── generate-md.ts          # Main build script (markdown → HTML)
│   ├── test/                   # Test scripts (unit + visual regression)
│   └── *.ts                    # Utility scripts (CSS coverage, screenshots, etc.)
├── dist/                       # Generated site output (gitignored)
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript config for scripts
├── tsconfig.client.json        # TypeScript config for client code
└── eslint.config.mjs           # ESLint 9 flat config

```

## Requirements

- **Node.js 22+** (v22 or v24 recommended)
- npm or compatible package manager

## Getting Started

### Install Dependencies

```bash
npm ci
```

### Build the Site

```bash
# Build CSS from SCSS
npm run build:css

# Build HTML from markdown content (also copies assets, generates robots.txt + sitemap.xml)
npm run build:md

# Build client TypeScript (generates src/assets/js/*.js)
npm run build:ts-client
```

### Local Development

```bash
# Quick start: install, build, and serve
npm run start:local

# Or manually:
npm run build:css && npm run build:md
python3 -m http.server 8000 --directory dist
# Open http://localhost:8000
```

## Content Authoring

Add Markdown files to the `content/` directory. Each file can include optional YAML front-matter:

```markdown
---
title: About Me
order: 10
---

# About

This is my story...
```

**Supported front-matter fields:**
- `title`: Section title (defaults to filename)
- `order`: Sort order (lower values appear first; defaults to alphabetical)

The build script processes all `.md` files, converts them to HTML using [unified](https://unifiedjs.com/) + [remark](https://remark.js.org/) + [rehype](https://github.com/rehypejs/rehype), and injects them into `index.html` at the `<!-- MD_CONTENT -->` placeholder.

## Available Scripts

### Build Commands
- `npm run build:css` — Compile SCSS to CSS
- `npm run build:md` — Generate HTML from markdown and copy assets
- `npm run build:ts-client` — Compile client TypeScript to JavaScript
- `npm run check` — Run full build validation (CSS + markdown)

### Testing & Quality
- `npm run test:unit` — Run generator integration test
- `npm run test:visual` — Capture visual screenshots (Puppeteer)
- `npm run test:theme` — Test theme toggle behavior
- `npm run test` — Run all tests (unit + visual)
- `npm run coverage` — Generate code coverage report
- `npm run lint` — Run ESLint + Stylelint
- `npm run lint:js` — Run ESLint on TypeScript files
- `npm run lint:css` — Run Stylelint on SCSS files

### Utility Scripts
- `npm run collect-runtime-classes` — Analyze runtime DOM classes
- `npm run coverage-css` — Generate CSS coverage report
- `npm run screenshot-theme` — Capture theme screenshots

## Testing & Coverage

### Unit Tests

Run the markdown generator integration test:

```bash
npm run test:unit
```

This creates a temporary workspace, runs the generator, and validates the output.

### Visual Regression Tests

Capture screenshots of the site in light and dark themes:

```bash
npm run test:visual
```

**Visual baseline workflow:**
1. First run saves screenshots to `tests/snapshots/latest-light.png` and `latest-dark.png`
2. If no baselines exist, the script promotes them to `baseline-*.png`
3. Review the baseline images and commit them if acceptable
4. Future runs compare against baselines using `pixelmatch` and output diff images
5. To approve new baselines: replace `baseline-*.png` with `latest-*.png` and commit

### Code Coverage

Generate coverage reports with NYC:

```bash
npm run coverage
open coverage/lcov-report/index.html
```

Coverage reports are also generated during CI and uploaded as artifacts.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/static.yml`) runs on every push to `master` and includes:

### Verify Job
- Linting (ESLint + Stylelint)
- Build validation
- Unit tests with coverage
- Visual regression test (Puppeteer)
- Uploads coverage report as artifact

### Deploy Job
- Builds CSS and markdown
- Deploys `dist/` to GitHub Pages

**Node.js version:** 22 (configured in workflow)

## SEO & Metadata

The build automatically generates:
- **`robots.txt`** — Allows all crawlers, references sitemap
- **`sitemap.xml`** — XML sitemap with homepage URL and metadata
- **`CNAME`** — Custom domain configuration (jakecalkins.com)

These files are created in `dist/` during `npm run build:md`.

## Architecture Notes

### TypeScript

- **Scripts** (`scripts/*.ts`) — Build tooling, tests, and utilities
- **Client code** (`src/assets/ts/*.ts`) — Runtime behavior (theme toggle, FAB)
- **Dual tsconfigs** — `tsconfig.json` for scripts, `tsconfig.client.json` for browser code

Compiled JavaScript is gitignored; the build generates it on-demand.

### Styling

- **SCSS** source in `src/assets/scss/` organized by partials:
  - `_variables.scss` — CSS custom properties and design tokens
  - `_theme-dark.scss` — Dark theme overrides
  - `_components.scss`, `_fab.scss`, etc. — Component styles
- Compiled to `src/assets/css/style.css` (gitignored)
- Uses CSS custom properties for theming
- Mobile-first responsive design with FAB for small screens

### Linting

- **ESLint 9** with flat config (`eslint.config.mjs`)
- **Stylelint** with SCSS support
- Enforces TypeScript best practices and SCSS conventions

## Development Tips

- **Add new markdown files:** Drop `.md` files in `content/` and rebuild
- **Update styles:** Edit SCSS in `src/assets/scss/`, then `npm run build:css`
- **Modify client behavior:** Edit TypeScript in `src/assets/ts/`, then `npm run build:ts-client`
- **Run checks before commit:** `npm run lint && npm run check && npm run test:unit`

## License

Personal use
