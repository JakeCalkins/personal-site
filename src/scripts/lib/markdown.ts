import { promises as fs } from 'fs';
import path from 'path';
import { loadEsmModule } from './utils';
import { HEADING_PATTERN } from './constants';

// Markdown processor interface
export interface MarkdownItem {
  file: string;
  title: string;
  order: number | null;
  meta: Record<string, any>;
  md: string;
  slug?: string;
}

// Load and configure unified markdown processor
export async function createMarkdownProcessor() {
  const unifiedMod: any = await import('unified');
  const unified = unifiedMod.unified || unifiedMod.default || unifiedMod;
  
  const remarkParse = await loadEsmModule('remark-parse');
  const remarkGfm = await loadEsmModule('remark-gfm');
  const remarkFrontmatter = await loadEsmModule('remark-frontmatter');
  const remarkRehype = await loadEsmModule('remark-rehype');
  const rehypeSlug = await loadEsmModule('rehype-slug');
  const rehypeStringify = await loadEsmModule('rehype-stringify');

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify);
}

// Convert markdown to HTML
export async function markdownToHtml(processor: any, markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

// Parse markdown file and extract frontmatter
export async function parseMarkdownFile(filePath: string): Promise<MarkdownItem> {
  const matter = await loadEsmModule('gray-matter');
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw);
  const meta = parsed.data || {};
  const content = parsed.content || '';
  
  const file = path.basename(filePath);
  const title = meta.title || file.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
  const order = typeof meta.order === 'number' ? meta.order : (meta.order ? Number(meta.order) : null);

  return { file, title, order, meta, md: content };
}

// Wrap HTML content in section with optional header
export function wrapInSection(
  html: string,
  slug: string,
  filename: string,
  title: string
): string {
  const trimmed = html.trim();
  const hasHeading = HEADING_PATTERN.test(trimmed);
  const header = hasHeading ? '' : `<header class="md-section-header"><h2>${title}</h2></header>\n`;
  
  return `<!-- from: ${filename} -->\n<section class="md-section" id="${slug}" data-source="${filename}">\n${header}${html}\n</section>`;
}
