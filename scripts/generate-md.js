#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { unified } = await import('unified');
const remarkParse = (require('remark-parse') && (require('remark-parse').default || require('remark-parse')));
const remarkGfm = (require('remark-gfm') && (require('remark-gfm').default || require('remark-gfm')));
const remarkRehype = (require('remark-rehype') && (require('remark-rehype').default || require('remark-rehype')));
const rehypeStringify = (require('rehype-stringify') && (require('rehype-stringify').default || require('rehype-stringify')));
const rehypeSlug = (require('rehype-slug') && (require('rehype-slug').default || require('rehype-slug')));
const rehypeAutolink = (require('rehype-autolink-headings') && (require('rehype-autolink-headings').default || require('rehype-autolink-headings')));
const remarkFrontmatter = (require('remark-frontmatter') && (require('remark-frontmatter').default || require('remark-frontmatter')));
const matter = (require('gray-matter') && (require('gray-matter').default || require('gray-matter')));

async function main() {
  const cwd = process.cwd();
  const contentDir = path.join(cwd, 'content');
  const srcDir = path.join(cwd, 'src');
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

  // Read files, extract YAML front-matter using `gray-matter`, and collect metadata
  // We still include `remark-frontmatter` in the pipeline for completeness.
  const items = [];
  for (const file of mdFiles) {
    const src = path.join(contentDir, file);
    const raw = await fs.readFile(src, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const content = parsed.content || '';

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

  // Use remark + rehype to convert markdown -> HTML. This is modern, extensible,
  // and avoids the deprecation warnings from `marked` defaults.
  const partsArr = [];
  for (const item of items) {
    const fileHtml = String(
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeAutolink, { behavior: 'wrap' })
        .use(rehypeStringify)
        .process(item.md)
    );

    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // If the rendered HTML already starts with an H1/H2, don't prepend a duplicate header.
    const trimmed = fileHtml.trim();
    const hasLeadingHeading = /^<h[12][\s>]/i.test(trimmed);
    const headerHtml = hasLeadingHeading ? '' : `<header class="md-section-header"><h2>${item.title}</h2></header>\n`;
    partsArr.push(`<!-- from: ${item.file} -->\n<section class="md-section" id="${slug}" data-source="${item.file}">\n${headerHtml}${fileHtml}\n</section>`);
  }

  const parts = partsArr;

  const injected = parts.join('\n\n');

  const indexPath = path.join(srcDir, 'index.html');
  let index;
  try {
    index = await fs.readFile(indexPath, 'utf8');
  } catch (e) {
    console.warn('Template src/index.html not found — aborting.');
    return;
  }

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
  // Keep the same relative paths as in src/index.html, so copy entire assets/ tree if present.
  const assetsSrc = path.join(srcDir, 'assets');
  async function copyRecursive(srcRoot, destRoot) {
    try {
      const entries = await fs.readdir(srcRoot, { withFileTypes: true });
      await fs.mkdir(destRoot, { recursive: true });
      for (const ent of entries) {
        const s = path.join(srcRoot, ent.name);
        const d = path.join(destRoot, ent.name);
        if (ent.isDirectory()) {
          await copyRecursive(s, d);
        } else if (ent.isFile()) {
          await fs.copyFile(s, d);
        }
      }
    } catch (e) {
      // swallow missing assets folder
    }
  }

  await copyRecursive(assetsSrc, path.join(distDir, 'assets'));

  // Also copy CNAME if present at repo root
  try {
    await fs.copyFile(path.join(cwd, 'CNAME'), path.join(distDir, 'CNAME'));
  } catch (e) { /* ignore */ }

  console.log('Built site written to ./dist (index.html + assets)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
