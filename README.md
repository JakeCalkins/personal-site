# My Personal Site

This is my minimal, fast, single-page personal landing site. I built it with TypeScript and a focus on clean design, performance, and maintainability. It features a typographic layout with dark/light theme support, responsive mobile design, and markdown-powered content that I can easily update.

## What This Site Does

- **Shows my work** — A simple landing page with sections for projects and info
- **Respects your preference** — Automatically detects dark mode, with manual override
- **Works on all devices** — Optimized for mobile (FAB navigation) and desktop
- **Easy to update** — I just drop markdown files in a folder and rebuild
- **Fast to load** — Heavily minified (44KB total), deployed on GitHub Pages

## How I Built It

I chose to build this myself because I wanted:
- **Full control** over the design and code
- **TypeScript** throughout for type safety
- **No frameworks** — just vanilla HTML, CSS, and minimal JavaScript
- **Automated deployment** — push to GitHub, site updates automatically

## Project Structure

```
├── src/
│   ├── index.html              # My page template
│   ├── assets/
│   │   ├── scss/               # Styles (variables, themes, components)
│   │   ├── css/                # Generated CSS (not committed)
│   │   ├── ts/                 # Runtime JavaScript (theme toggle, mobile nav)
│   │   ├── js/                 # Compiled JS (not committed)
│   │   └── icons/              # SVG icons and images
├── content/                    # My markdown content files
├── src/scripts/                # Build scripts and utilities
│   ├── generate-md.ts          # Main build tool
│   ├── lib/                    # Reusable modules
│   └── tests/                  # Test suite and snapshots
├── dist/                       # Generated site (not committed)
└── package.json, tsconfig.json, etc.
```

## What You Need

- **Node.js 22+** (that's it!)

## How I Build and Deploy

### Install

```bash
npm ci
```

### Build Everything

```bash
npm run build
```

This compiles TypeScript, processes SCSS, minifies CSS and JS, generates HTML from my markdown, and outputs to `dist/`.

### Local Development

```bash
npm run dev
```

This installs deps, builds, then serves the site locally at http://localhost:8000.

## Adding Content

I add markdown files to the `content/` directory. Each one can have YAML frontmatter:

```markdown
---
title: My Latest Project
order: 10
---

# Details

Here's what I built...
```

The build processes these automatically and injects them into my page. I can add as many as I want, and they'll automatically be linked in the navigation.

## My Scripts

```bash
# Main commands
npm run build      # Full optimized build
npm run dev        # Local dev server
npm run test       # Run tests (markdown generation + visual regression)
npm run lint       # Check code quality

# Testing (if needed)
npx ts-node ./src/tests/utilities/collect-runtime-classes.ts
npx ts-node ./src/tests/utilities/coverage-css.ts
npx ts-node ./src/tests/utilities/test-theme-toggle.ts
npx ts-node ./src/tests/utilities/screenshot-theme.ts
```

## Testing My Site

I have automated tests that run before deployment:

### Build Test
Validates that markdown generation works and creates proper HTML output.

### Visual Tests
Captures screenshots in light and dark themes using Puppeteer, compares against baselines to catch visual regressions.

Screenshots are stored in `src/tests/output/snapshots/` for comparison.

## Performance

I optimized everything:
- **CSS** — Minified with cssnano (33% smaller)
- **JavaScript** — Minified with terser (46% smaller)
- **HTML** — Minified with html-minifier (42% smaller)

Total dist: **44KB** of final assets.

## Deployment

GitHub Actions automatically:
1. Lints my code
2. Runs tests
3. Builds the optimized site
4. Deploys to GitHub Pages

No manual steps needed — I just push to the `updates` branch, tests run, and the site updates.

## How I Structure the Code

### Styling
- SCSS organized in `src/assets/scss/`
- Uses CSS custom properties for theming
- Separate theme files for dark mode
- Mobile-first responsive design

### Client Code
- Minimal JavaScript in `src/assets/ts/`
- Theme toggle and FAB navigation
- Vanilla JavaScript, no frameworks

### Build Scripts
- `src/scripts/generate-md.ts` — Main build tool
- `src/scripts/lib/` — Reusable modules for shared logic
- Clean separation: constants, utilities, markdown processing, SEO

## Tips for Maintaining This

- **Add content** — Drop a `.md` file in `content/` and rebuild
- **Update styles** — Edit SCSS, rebuild, done
- **Check everything** — Run `npm run lint && npm run test && npm run build` before committing
- **Local testing** — Use `npm run dev` to test changes locally

## Technical Details

- **TypeScript** for both scripts and client code
- **ESLint 9** flat config for linting
- **Stylelint** for SCSS
- **Puppeteer** for visual regression testing
- **NYC** code coverage (though I don't track formally)
- **GitHub Pages** for free hosting
- **GitHub Actions** for CI/CD

## License

Personal use
