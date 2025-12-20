#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

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

  const mdFiles = files.filter(f => f.toLowerCase().endsWith('.md')).sort();
  if (!mdFiles.length) {
    console.log('No markdown files found in content/ — nothing to inject.');
    return;
  }

  const parts = [];
  for (const file of mdFiles) {
    const src = path.join(contentDir, file);
    const md = await fs.readFile(src, 'utf8');
    // Convert markdown to HTML. Keep the raw markdown structure — headings, lists, links.
    const html = marked.parse(md);
    // Wrap each file in a section so styles (margins) remain predictable
    parts.push(`<!-- from: ${file} -->\n<section class="md-section" data-source="${file}">\n${html}\n</section>`);
  }

  const injected = parts.join('\n\n');

  const indexPath = path.join(cwd, 'index.html');
  let index = await fs.readFile(indexPath, 'utf8');

  if (!index.includes('<!-- MD_CONTENT -->')) {
    console.warn('Placeholder <!-- MD_CONTENT --> not found in index.html — aborting injection.');
    return;
  }

  index = index.replace('<!-- MD_CONTENT -->', injected);
  await fs.writeFile(indexPath, index, 'utf8');
  console.log('Injected markdown content into index.html');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
