#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import path from 'path';
import { MD_EXTENSION, PLACEHOLDER_CONTENT, PLACEHOLDER_PAGE_LINKS, PLACEHOLDER_FAB_LINKS } from './lib/constants';
import { copyRecursive, slugify, sortItems } from './lib/utils';
import { createMarkdownProcessor, markdownToHtml, parseMarkdownFile, wrapInSection, MarkdownItem } from './lib/markdown';
import { minifyHtml, writeSeoFiles } from './lib/seo';

async function main(): Promise<void> {
  const cwd = process.cwd();
  const contentDir = path.join(cwd, 'content');
  const srcDir = path.join(cwd, 'src');
  const distDir = path.join(cwd, 'dist');

  // Read markdown files from content directory
  let files: string[] = [];
  try {
    files = await fs.readdir(contentDir);
  } catch {
    console.log('No content/ directory found — skipping markdown generation.');
    return;
  }

  const mdFiles = files.filter(f => f.toLowerCase().endsWith(MD_EXTENSION));
  if (!mdFiles.length) {
    console.log('No markdown files found in content/ — nothing to inject.');
    return;
  }

  // Parse all markdown files
  const items: MarkdownItem[] = [];
  for (const file of mdFiles) {
    const item = await parseMarkdownFile(path.join(contentDir, file));
    items.push(item);
  }

  sortItems(items);

  // Process markdown to HTML
  const processor = await createMarkdownProcessor();
  const sections: string[] = [];
  
  for (const item of items) {
    const html = await markdownToHtml(processor, item.md);
    const slug = slugify(item.title);
    item.slug = slug;
    sections.push(wrapInSection(html, slug, item.file, item.title));
  }

  // Read index template
  const indexPath = path.join(srcDir, 'index.html');
  let indexTemplate: string;
  try {
    indexTemplate = await fs.readFile(indexPath, 'utf8');
  } catch {
    console.warn('Template src/index.html not found — aborting.');
    return;
  }

  if (!indexTemplate.includes(PLACEHOLDER_CONTENT)) {
    console.warn(`Placeholder ${PLACEHOLDER_CONTENT} not found in index.html — aborting.`);
    return;
  }

  // Generate navigation links
  const pageLinks = items
    .map(it => `<a class="page-link" href="${it.slug}.html" title="${it.title}">${it.title}</a>`)
    .join(' ');
  
  const fabLinks = items
    .map(it => `<a class="item" href="${it.slug}.html" aria-label="${it.title}" title="${it.title}"><span class="label">${it.title}</span></a>`)
    .join('\n');

  await fs.mkdir(distDir, { recursive: true });

  // Build homepage with all sections
  let homepage = indexTemplate
    .replace(PLACEHOLDER_CONTENT, sections.join('\n\n'))
    .replace(PLACEHOLDER_PAGE_LINKS, pageLinks)
    .replace(PLACEHOLDER_FAB_LINKS, fabLinks);

  homepage = await minifyHtml(homepage);
  await fs.writeFile(path.join(distDir, 'index.html'), homepage, 'utf8');

  // Build individual pages
  for (const item of items) {
    const html = await markdownToHtml(processor, item.md);
    const section = wrapInSection(html, item.slug!, item.file, item.title);
    
    let page = indexTemplate
      .replace(PLACEHOLDER_CONTENT, section)
      .replace(PLACEHOLDER_PAGE_LINKS, pageLinks)
      .replace(PLACEHOLDER_FAB_LINKS, fabLinks);

    page = await minifyHtml(page);
    await fs.writeFile(path.join(distDir, `${item.slug}.html`), page, 'utf8');
  }

  // Copy assets
  await copyRecursive(path.join(srcDir, 'assets'), path.join(distDir, 'assets'));

  // Copy CNAME if exists
  try {
    await fs.copyFile(path.join(cwd, 'CNAME'), path.join(distDir, 'CNAME'));
  } catch { /* ignore */ }

  // Generate SEO files
  await writeSeoFiles(distDir, items.map(it => it.slug!));

  console.log('Built site written to ./dist (index.html + per-page HTML + assets + robots.txt + sitemap.xml)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
