---
title: How This Site Works
order: 20
---

# How This Site Works

This page explains the technical architecture of my personal site — how it's built, why I made certain choices, and how you can modify it.

## Why I Built This

I wanted a personal site that was:
- **Fast** — No frameworks, minimal JavaScript, optimized assets
- **Easy to maintain** — Update content by dropping markdown files in a folder
- **Type-safe** — TypeScript throughout for fewer bugs
- **Automatable** — Deploy with a single git push
- **Personal** — Fully owned code I understand completely

Most site builders add bloat. I decided to write my own, and it's only 44KB total.

## The Build Pipeline

When I run `npm run build`, here's what happens:

```
TypeScript Compilation
  ↓
SCSS → CSS Compilation
  ↓
CSS Minification (cssnano, -33%)
  ↓
JavaScript Minification (terser, -46%)
  ↓
Markdown Processing
  ↓
HTML Generation & Minification
  ↓
SEO Files (sitemap.xml, robots.txt)
  ↓
Optimized dist/ folder
```

Each step is intentional. The final output is **44KB** of pure optimized HTML/CSS/JS.

## Content System

I write content in Markdown. Each file can include optional metadata:

```markdown
---
title: My Project Title
order: 10
---

# The actual content

Goes here...
```

The `order` field controls navigation order (lower numbers first). The `title` field becomes the page heading and navigation label.

All markdown files automatically become sections in my site navigation. No database, no complex setup — just files in a folder.

## Theme System

Originally, this site picked a random color theme on every page load (dark blue, teal, orange, etc.). That felt chaotic.

I redesigned the theme system to be **intentional**:
- **Dark mode** — Black (#0a0a0a) background, cream text (#fffaf0)
- **Light mode** — Cream (#fffaf0) background, black text (#0a0a0a)
- **System detection** — Respects your OS dark mode preference
- **Manual override** — Toggle button in the header lets you choose

The theme is controlled by CSS custom properties in `src/assets/scss/_variables.scss`. Changing the theme is one line of code.

## Mobile Experience

Screens under 600px get a different layout:
- Top header collapses to an icon bar
- Navigation moves to a **Floating Action Button** (FAB) — that round button in the bottom-right
- Tap it to see all navigation links
- All interaction is vanilla JavaScript, no libraries

## Code Organization

```
src/
├── assets/
│   ├── ts/
│   │   └── main.ts           # Runtime code (theme toggle, FAB)
│   ├── scss/
│   │   ├── _variables.scss   # CSS variables & themes
│   │   ├── _theme-dark.scss  # Dark mode overrides
│   │   └── _components.scss  # Component styles
│   └── icons/                # SVG assets
├── scripts/
│   ├── generate-md.ts        # Main build tool
│   ├── lib/                  # Shared modules
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   ├── markdown.ts
│   │   └── seo.ts
│   └── tests/                # Test suite
└── index.html                # Page template
```

### Build Scripts

The main build script is `generate-md.ts` (94 lines, down from 194 before refactoring). It:
1. Finds all `.md` files in `content/`
2. Parses YAML front-matter
3. Converts markdown to HTML
4. Injects into the template
5. Minifies output
6. Generates `robots.txt` and `sitemap.xml`

Shared logic lives in `src/scripts/lib/` — constants, utilities, markdown processing, and SEO generation. This keeps the main script clean and reusable code out of the way.

### Client Code

`src/assets/ts/main.ts` handles runtime behavior:
- Detects system dark mode preference
- Stores your manual theme choice in localStorage
- Toggles theme when you click the header button
- Controls the mobile FAB menu visibility

Total: ~60 lines of vanilla JavaScript. No frameworks needed.

## Testing Approach

I have two types of tests:

### Integration Tests
Run the markdown generator and verify it produces correct HTML. Catches regressions if I break the build pipeline.

### Visual Regression Tests
Uses Puppeteer to screenshot the site in light and dark modes. Compares against baseline images to catch unintended visual changes.

Screenshots are stored in `src/tests/output/snapshots/` for comparison and debugging.

Run both with `npm run test`.

## Deployment

GitHub Actions handles everything:

1. **Linting** — ESLint checks TypeScript, Stylelint checks SCSS
2. **Testing** — Builds, runs tests, verifies no regressions
3. **Minification** — CSS (-33%), JS (-46%), HTML (-42%)
4. **Deploy** — Uploads `dist/` to GitHub Pages

Workflow file: `.github/workflows/static.yml`

Everything is automated. I just push code, GitHub Actions runs checks, and if tests pass, the site deploys automatically.

## Performance Details

Final asset sizes after optimization:
- **CSS:** 17KB → 11KB (cssnano, -33%)
- **JavaScript:** 3.7KB → 2KB (terser, -46%)
- **HTML:** 12KB → 7KB (html-minifier, -42%)

**Total:** 44KB of final assets. Fast load times on all devices.

## Data & Telemetry

Zero tracking. I don't run analytics, use cookies, or collect data. Just a fast, simple site.

## How to Extend This

Want to modify it?

- **Add a new page:** Drop a `.md` file in `content/` and rebuild
- **Change colors:** Edit `src/assets/scss/_variables.scss`
- **Modify mobile layout:** Edit `src/assets/scss/_fab.scss`
- **Add functionality:** Write TypeScript in `src/assets/ts/main.ts`

All changes feed through the build pipeline automatically.

## Technical Stack

- **TypeScript** — Type-safe scripts and client code
- **SCSS** — Organized stylesheets with variables and themes
- **Remark/Rehype** — Markdown-to-HTML processing
- **Puppeteer** — Visual regression testing
- **PostCSS** — CSS minification
- **Terser** — JavaScript minification
- **ESLint 9** — Code linting with flat config
- **GitHub Actions** — CI/CD automation

No frameworks. No build tools beyond npm scripts. Everything is explicit and understandable.

## Last Updated

December 20, 2025 — [Commit 7ece2a5](https://github.com/timthecomputer/personal-site/commit/7ece2a5)
