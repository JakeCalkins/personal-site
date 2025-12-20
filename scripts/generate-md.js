#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

async function main() {
  const cwd = process.cwd();
  const contentDir = path.join(cwd, 'content');
  let files = [];
  try {
    files = await fs.readdir(contentDir);
  } catch (e) {
    console.log('No content/ directory found — skipping markdown generation.');
    return;
  }

  const mdFiles = files.filter(f => f.toLowerCase().endsWith('.md'));
  if (!mdFiles.length) {
    console.log('No markdown files found in content/ — nothing to inject.');
    return;
  }

  // Read files, parse optional YAML front-matter, and collect metadata
  const items = [];
  for (const file of mdFiles) {
    const src = path.join(contentDir, file);
    const raw = await fs.readFile(src, 'utf8');
    let content = raw;
    let meta = {};
    if (raw.trim().startsWith('---')) {
      // find closing `---`
      const end = raw.indexOf('\n---', 3);
      const altEnd = raw.indexOf('\n...', 3);
      const fmEnd = end !== -1 ? end : (altEnd !== -1 ? altEnd : -1);
      if (fmEnd !== -1) {
        const fmRaw = raw.slice(0, fmEnd + 4);
        try {
          // strip leading/trailing --- markers
          const yamlText = fmRaw.replace(/^---\s*\n/, '').replace(/\n---\s*$/, '');
          meta = yaml.load(yamlText) || {};
          content = raw.slice(fmEnd + 4);
        } catch (e) {
          console.warn('Failed parsing YAML front-matter for', file, e.message);
        }
      }
    }

    // fallback title and order
    const title = meta.title || file.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
    const order = (typeof meta.order === 'number') ? meta.order : (meta.order ? Number(meta.order) : null);

    items.push({ file, title, order, meta, md: content });
  }

  // Sort by order (if provided) then filename
  items.sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return a.file.localeCompare(b.file);
  });

  const parts = items.map(item => {
    const html = marked.parse(item.md);
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<!-- from: ${item.file} -->\n<section class="md-section" id="${slug}" data-source="${item.file}">\n<header class=\"md-section-header\"><h2>${item.title}</h2></header>\n${html}\n</section>`;
  });

  const injected = parts.join('\n\n');

  const indexPath = path.join(cwd, 'index.html');
  let index = await fs.readFile(indexPath, 'utf8');

  if (!index.includes('<!-- MD_CONTENT -->')) {
    console.warn('Placeholder <!-- MD_CONTENT --> not found in index.html — aborting injection.');
    return;
  }

  index = index.replace('<!-- MD_CONTENT -->', injected);

  // Ensure dist directory exists
  const distDir = path.join(cwd, 'dist');
  await fs.mkdir(distDir, { recursive: true });

  // Write built index.html to dist (do not overwrite source index.html)
  const outIndex = path.join(distDir, 'index.html');
  await fs.writeFile(outIndex, index, 'utf8');

  // Copy static assets that the site depends on into dist
  const staticFiles = ['style.css', 'favicon.svg', 'CNAME'];
  for (const f of staticFiles) {
    const src = path.join(cwd, f);
    try {
      const dest = path.join(distDir, f);
      await fs.copyFile(src, dest);
    } catch (e) {
      // ignore missing files
    }
  }

  console.log('Built site written to ./dist (index.html + assets)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
