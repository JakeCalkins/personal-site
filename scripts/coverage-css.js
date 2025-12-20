#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

async function collectHtmlClassesIds(distDir) {
  const usedClasses = new Set();
  const usedIds = new Set();

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) await walk(p);
      else if (ent.isFile() && p.endsWith('.html')) {
        const txt = await fs.readFile(p, 'utf8');
        for (const m of txt.matchAll(/class\s*=\s*["']([^"']+)["']/g)) {
          const cls = m[1].split(/\s+/).filter(Boolean);
          cls.forEach(c => usedClasses.add(c));
        }
        for (const m of txt.matchAll(/id\s*=\s*["']([^"']+)["']/g)) {
          usedIds.add(m[1]);
        }
      }
    }
  }

  await walk(distDir);
  return { usedClasses, usedIds };
}

async function extractCssSelectors(cssPath) {
  const txt = await fs.readFile(cssPath, 'utf8');
  const selectors = new Set();
  // Use postcss to parse only rule selectors (avoids picking up declaration values)
  const postcss = require('postcss');
  const root = postcss.parse(txt);
  root.walkRules(rule => {
    // rule.selectors is an array of selector strings
    const sels = rule.selectors || [rule.selector];
    for (const s of sels) {
      for (const m of s.matchAll(/\.([A-Za-z0-9_-]+)/g)) selectors.add('.' + m[1]);
      for (const m of s.matchAll(/#([A-Za-z0-9_-]+)/g)) selectors.add('#' + m[1]);
    }
  });
  return selectors;
}

async function run() {
  const cwd = process.cwd();
  const dist = path.join(cwd, 'dist');
  const cssPath = path.join(dist, 'assets', 'css', 'style.css');

  try {
    await fs.access(cssPath);
  } catch (e) {
    console.error('CSS file not found at', cssPath);
    process.exit(2);
  }

  const { usedClasses, usedIds } = await collectHtmlClassesIds(dist);
  const selectors = await extractCssSelectors(cssPath);
  // If runtime selectors were captured by Puppeteer, include them as used.
  try {
    const runtimePath = path.join(dist, 'coverage', 'runtime-selectors.json');
    const rt = JSON.parse(await fs.readFile(runtimePath, 'utf8'));
    (rt.classes || []).forEach(c => usedClasses.add(c));
    (rt.ids || []).forEach(i => usedIds.add(i));
  } catch (e) {
    // no runtime selectors captured; that's fine
  }

  const unused = [];
  for (const sel of selectors) {
    if (sel.startsWith('.')) {
      const name = sel.slice(1);
      if (!usedClasses.has(name)) unused.push(sel);
    } else if (sel.startsWith('#')) {
      const name = sel.slice(1);
      if (!usedIds.has(name)) unused.push(sel);
    }
  }

  const outDir = path.join(dist, 'coverage');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'unused-selectors.txt');
  const content = unused.length ? unused.join('\n') : 'No unused class/id selectors detected by heuristic scan.';
  await fs.writeFile(outFile, content, 'utf8');
  console.log('Wrote CSS coverage report to', outFile);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
