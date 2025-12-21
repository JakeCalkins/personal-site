#!/usr/bin/env ts-node
import fs from 'fs/promises';
import path from 'path';

(async function(){
  try {
    const puppeteerMod = await import('puppeteer');
    // puppeteer default export may be under .default
    const puppeteer: any = (puppeteerMod as any).default || puppeteerMod;
    const cwd = process.cwd();
    const distIndex = 'file://' + path.join(cwd, 'dist', 'index.html');
    const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(distIndex, { waitUntil: 'networkidle0' });

    const initial = await page.evaluate(() => {
      const classes = new Set<string>();
      const ids = new Set<string>();
      document.querySelectorAll('*').forEach((el) => {
        if ((el as Element).id) ids.add((el as Element).id);
        ((el as Element).classList || []).forEach((c: string) => classes.add(c));
      });
      return { classes: Array.from(classes), ids: Array.from(ids) };
    });

    try {
      await page.click('#fab-button');
      await new Promise(resolve => setTimeout(resolve, 250));
    } catch (e) { /* ignore if not present */ }

    const afterOpen = await page.evaluate(() => {
      const classes = new Set<string>();
      const ids = new Set<string>();
      document.querySelectorAll('*').forEach((el) => {
        if ((el as Element).id) ids.add((el as Element).id);
        ((el as Element).classList || []).forEach((c: string) => classes.add(c));
      });
      return { classes: Array.from(classes), ids: Array.from(ids) };
    });

    await browser.close();

    const combined = {
      classes: Array.from(new Set([...(initial.classes||[]), ...(afterOpen.classes||[])])),
      ids: Array.from(new Set([...(initial.ids||[]), ...(afterOpen.ids||[])]))
    };

    const outDir = path.join(cwd, 'src', 'tests', 'output');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'runtime-selectors.json'), JSON.stringify(combined, null, 2), 'utf8');
    console.log('Wrote runtime selectors to', path.join(outDir, 'runtime-selectors.json'));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
