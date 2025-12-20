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
    (item as any).slug = slug;
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

  // Prepare page links for desktop title area and mobile FAB menu
  const pageLinksHtml = items
    .map((it: any) => `<a class="page-link" href="${it.slug}.html" title="${it.title}">${it.title}</a>`)
    .join(' ');
  const fabPageLinksHtml = items
    .map((it: any) => `<a class="item" href="${it.slug}.html" aria-label="${it.title}" title="${it.title}"><span class="label">${it.title}</span></a>`)
    .join('\n');

  index = index.replace('<!-- MD_CONTENT -->', injected)
               .replace('<!-- PAGE_LINKS -->', pageLinksHtml)
               .replace('<!-- FAB_PAGE_LINKS -->', fabPageLinksHtml);

  const distDir = path.join(cwd, 'dist');
  await fs.mkdir(distDir, { recursive: true });

  const outIndex = path.join(distDir, 'index.html');
  
  // Minify HTML if in production mode
  if (process.env.NODE_ENV === 'production') {
    const { minify } = await import('html-minifier-terser');
    index = await minify(index, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: false, // CSS already minified
      minifyJS: false,  // JS already minified
    });
  }
  
  await fs.writeFile(outIndex, index, 'utf8');

  // Generate per-page HTML files (one page per markdown file)
  const indexTemplate = await fs.readFile(indexPath, 'utf8');
  for (const item of items as any[]) {
    const singleSection = String(
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkFrontmatter)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(item.md)
    );
    const trimmed = singleSection.trim();
    const hasLeadingHeading = /^<h[12][\s>]/i.test(trimmed);
    const headerHtml = hasLeadingHeading ? '' : `<header class="md-section-header"><h2>${item.title}</h2></header>\n`;
    const section = `<!-- from: ${item.file} -->\n<section class="md-section" id="${item.slug}" data-source="${item.file}">\n${headerHtml}${singleSection}\n</section>`;

    let pageHtml = indexTemplate
      .replace('<!-- MD_CONTENT -->', section)
      .replace('<!-- PAGE_LINKS -->', pageLinksHtml)
      .replace('<!-- FAB_PAGE_LINKS -->', fabPageLinksHtml);

    if (process.env.NODE_ENV === 'production') {
      const { minify } = await import('html-minifier-terser');
      pageHtml = await minify(pageHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: false,
        minifyJS: false,
      });
    }

    await fs.writeFile(path.join(distDir, `${item.slug}.html`), pageHtml, 'utf8');
  }

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

  // Generate sitemap.xml (homepage + per-page URLs)
  const baseUrl = 'https://www.jakecalkins.com';
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0' },
    ...((items as any[]).map(it => ({ loc: `${baseUrl}/${it.slug}.html`, priority: '0.8' })))
  ];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log('Built site written to ./dist (index.html + per-page HTML + assets + robots.txt + sitemap.xml)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
