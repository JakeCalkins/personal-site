#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import path from 'path';

async function main(): Promise<void> {
  // Dynamic import remark/rehype + unified to support ESM-only packages.
  const unifiedMod: any = await import('unified');
  const unified = unifiedMod.unified || unifiedMod.default || unifiedMod;

  const remarkParseMod = await import('remark-parse');
  const remarkParse = remarkParseMod.default || remarkParseMod;
  const remarkGfmMod = await import('remark-gfm');
  const remarkGfm = remarkGfmMod.default || remarkGfmMod;
  const remarkRehypeMod = await import('remark-rehype');
  const remarkRehype = remarkRehypeMod.default || remarkRehypeMod;
  const rehypeStringifyMod = await import('rehype-stringify');
  const rehypeStringify = rehypeStringifyMod.default || rehypeStringifyMod;
  const rehypeSlugMod = await import('rehype-slug');
  const rehypeSlug = rehypeSlugMod.default || rehypeSlugMod;
  const remarkFrontmatterMod = await import('remark-frontmatter');
  const remarkFrontmatter = remarkFrontmatterMod.default || remarkFrontmatterMod;
  const matterMod = await import('gray-matter');
  const matter = matterMod.default || matterMod;

  const cwd = process.cwd();
  const contentDir = path.join(cwd, 'content');
  const srcDir = path.join(cwd, 'src');

  let files: string[] = [];
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

  const items: Array<any> = [];
  for (const file of mdFiles) {
    const src = path.join(contentDir, file);
    const raw = await fs.readFile(src, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const content = parsed.content || '';

    const title = meta.title || file.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
    const order = (typeof meta.order === 'number') ? meta.order : (meta.order ? Number(meta.order) : null);

    items.push({ file, title, order, meta, md: content });
  }

  items.sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return a.file.localeCompare(b.file);
  });

  const partsArr: string[] = [];
  for (const item of items) {
    const fileHtml = String(
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(item.md)
    );

    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const trimmed = fileHtml.trim();
    const hasLeadingHeading = /^<h[12][\s>]/i.test(trimmed);
    const headerHtml = hasLeadingHeading ? '' : `<header class="md-section-header"><h2>${item.title}</h2></header>\n`;
    partsArr.push(`<!-- from: ${item.file} -->\n<section class="md-section" id="${slug}" data-source="${item.file}">\n${headerHtml}${fileHtml}\n</section>`);
  }

  const injected = partsArr.join('\n\n');

  const indexPath = path.join(srcDir, 'index.html');
  let index: string;
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

  const distDir = path.join(cwd, 'dist');
  await fs.mkdir(distDir, { recursive: true });

  const outIndex = path.join(distDir, 'index.html');
  await fs.writeFile(outIndex, index, 'utf8');

  const assetsSrc = path.join(srcDir, 'assets');
  async function copyRecursive(srcRoot: string, destRoot: string) {
    try {
      const entries = await fs.readdir(srcRoot, { withFileTypes: true });
      await fs.mkdir(destRoot, { recursive: true });
      for (const ent of entries) {
        const s = path.join(srcRoot, ent.name);
        const d = path.join(destRoot, ent.name);
        if (ent.name === 'scss' && ent.isDirectory()) continue;
        if (ent.isDirectory()) {
          await copyRecursive(s, d);
        } else if (ent.isFile()) {
          if (s.endsWith('.scss') || s.endsWith('.ts')) continue;
          await fs.copyFile(s, d);
        }
      }
    } catch (e) {
      // ignore missing assets
    }
  }

  await copyRecursive(assetsSrc, path.join(distDir, 'assets'));

  try {
    await fs.copyFile(path.join(cwd, 'CNAME'), path.join(distDir, 'CNAME'));
  } catch (e) { /* ignore */ }

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.jakecalkins.com/sitemap.xml
`;
  await fs.writeFile(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

  // Generate sitemap.xml
  const sitemapUrl = 'https://www.jakecalkins.com/';
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${sitemapUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log('Built site written to ./dist (index.html + assets + robots.txt + sitemap.xml)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
