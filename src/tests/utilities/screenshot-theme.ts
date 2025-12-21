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
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    const outDir = path.join(cwd, 'src', 'tests', 'output');
    await fs.mkdir(outDir, { recursive: true });
    const before = path.join(outDir, 'theme-before.png');
    await page.screenshot({ path: before, fullPage: true });

    try {
      await page.click('#theme-toggle');
      await page.waitForTimeout(300);
      const after = path.join(outDir, 'theme-after.png');
      await page.screenshot({ path: after, fullPage: true });
    } catch (e) { /* no toggle found */ }

    await browser.close();
    console.log('Wrote screenshots to', outDir);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
