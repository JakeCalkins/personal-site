#!/usr/bin/env ts-node
import path from 'path';
import fs from 'fs/promises';

(async function(){
  try {
    const puppeteerMod = await import('puppeteer');
    const puppeteer: any = (puppeteerMod as any).default || puppeteerMod;
    const cwd = process.cwd();
    const url = 'file://' + path.join(cwd, 'dist', 'index.html');
    const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const outDir = path.join(cwd, 'dist', 'coverage');
    await fs.mkdir(outDir, { recursive: true });

    const beforePath = path.join(outDir, 'ci-theme-before.png');
    await page.screenshot({ path: beforePath, fullPage: true });

    await page.click('#theme-toggle');
    await new Promise(r => setTimeout(r, 300));
    const after1 = await page.evaluate(() => document.body.getAttribute('data-theme'));
    const after1Path = path.join(outDir, 'ci-theme-after1.png');
    await page.screenshot({ path: after1Path, fullPage: true });

    if (after1 !== 'dark') {
      console.error('Expected data-theme to be "dark" after first click, got:', after1);
      await browser.close();
      process.exit(2);
    }

    await page.click('#theme-toggle');
    await new Promise(r => setTimeout(r, 300));
    const after2 = await page.evaluate(() => document.body.getAttribute('data-theme'));
    const after2Path = path.join(outDir, 'ci-theme-after2.png');
    await page.screenshot({ path: after2Path, fullPage: true });

    if (after2 !== 'light') {
      console.error('Expected data-theme to be "light" after second click, got:', after2);
      await browser.close();
      process.exit(3);
    }

    for (const p of [beforePath, after1Path, after2Path]) {
      try { await fs.access(p); } catch (e) { throw new Error('Missing screenshot: ' + p); }
    }

    await browser.close();
    console.log('Theme toggle test passed; screenshots written to', outDir);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
