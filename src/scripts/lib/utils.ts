import { promises as fs } from 'fs';
import path from 'path';
import { EXCLUDED_DIRS, EXCLUDED_EXTENSIONS } from './constants';

// Dynamic ESM module loading with fallback for default export
export async function loadEsmModule<T = any>(moduleName: string): Promise<T> {
  const mod = await import(moduleName);
  return (mod.default || mod) as T;
}

// Copy directory recursively, excluding specified files
export async function copyRecursive(srcRoot: string, destRoot: string): Promise<void> {
  try {
    const entries = await fs.readdir(srcRoot, { withFileTypes: true });
    await fs.mkdir(destRoot, { recursive: true });
    
    for (const entry of entries) {
      const src = path.join(srcRoot, entry.name);
      const dest = path.join(destRoot, entry.name);
      
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.includes(entry.name)) continue;
        await copyRecursive(src, dest);
      } else if (entry.isFile()) {
        if (EXCLUDED_EXTENSIONS.some(ext => src.endsWith(ext))) continue;
        await fs.copyFile(src, dest);
      }
    }
  } catch {
    // Silently ignore missing directories
  }
}

// Generate slug from title string
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Sort items by order field, then alphabetically
export function sortItems<T extends { order?: number | null; file: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return a.file.localeCompare(b.file);
  });
}
