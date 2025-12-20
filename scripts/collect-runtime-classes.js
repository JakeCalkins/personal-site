#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

(async function(){
  try {
    const puppeteer = require('puppeteer');
    const cwd = process.cwd();
    const distIndex = 'file://' + path.join(cwd, 'dist', 'index.html');
    const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(distIndex, { waitUntil: 'networkidle0' });

    // collect classes and ids present initially
    const initial = await page.evaluate(() => {
      const classes = new Set();
      const ids = new Set();
      document.querySelectorAll('*').forEach(el => {
        if (el.id) ids.add(el.id);
        (el.classList || []).forEach(c => classes.add(c));
      });
      return { classes: Array.from(classes), ids: Array.from(ids) };
    });

    // Open the FAB menu to surface dynamic classes
    try {
      await page.click('#fab-button');
      await page.waitForTimeout(250);
    } catch (e) { /* ignore if not present */ }

    const afterOpen = await page.evaluate(() => {
      const classes = new Set();
      const ids = new Set();
      document.querySelectorAll('*').forEach(el => {
        if (el.id) ids.add(el.id);
        (el.classList || []).forEach(c => classes.add(c));
      });
      return { classes: Array.from(classes), ids: Array.from(ids) };
    });

    await browser.close();

    const combined = {
      classes: Array.from(new Set([...(initial.classes||[]), ...(afterOpen.classes||[])])),
      ids: Array.from(new Set([...(initial.ids||[]), ...(afterOpen.ids||[])]))
    };

    const outDir = path.join(cwd, 'dist', 'coverage');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'runtime-selectors.json'), JSON.stringify(combined, null, 2), 'utf8');
    console.log('Wrote runtime selectors to', path.join(outDir, 'runtime-selectors.json'));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
