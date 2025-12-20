import { promises as fs } from 'fs';
import path from 'path';
import {
  SITE_BASE_URL,
  SITE_CHANGEFREQ,
  HOMEPAGE_PRIORITY,
  PAGE_PRIORITY,
  MINIFY_OPTIONS,
} from './constants';

// Generate robots.txt content
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_BASE_URL}/sitemap.xml
`;
}

// Generate sitemap.xml content
export function generateSitemap(pageSlugs: string[]): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: `${SITE_BASE_URL}/`, priority: HOMEPAGE_PRIORITY },
    ...pageSlugs.map(slug => ({ loc: `${SITE_BASE_URL}/${slug}.html`, priority: PAGE_PRIORITY }))
  ];

  const urlEntries = urls.map(u => 
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${SITE_CHANGEFREQ}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

// Minify HTML content if in production mode
export async function minifyHtml(html: string): Promise<string> {
  if (process.env.NODE_ENV !== 'production') return html;
  
  const { minify } = await import('html-minifier-terser');
  return minify(html, MINIFY_OPTIONS);
}

// Write SEO files to dist directory
export async function writeSeoFiles(distDir: string, pageSlugs: string[]): Promise<void> {
  await fs.writeFile(path.join(distDir, 'robots.txt'), generateRobotsTxt(), 'utf8');
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), generateSitemap(pageSlugs), 'utf8');
}
