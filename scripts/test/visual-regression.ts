#!/usr/bin/env ts-node
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

async function run() {
  const repoRoot = process.cwd();
  const indexPath = path.join(repoRoot, 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found — run build:md first');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + indexPath, { waitUntil: 'networkidle0' });

  const snapsDir = path.join(repoRoot, 'tests', 'snapshots');
  fs.mkdirSync(snapsDir, { recursive: true });

  // Light screenshot
  const lightPath = path.join(snapsDir, 'latest-light.png');
  await page.screenshot({ path: lightPath, fullPage: true });

  // Try to toggle theme button (if present) for dark screenshot
  const toggler = await page.$('#theme-toggle');
  if (toggler) {
    await toggler.click();
    // wait a short time for theme transition — use a safe fallback if typing differs
    try {
      // some puppeteer versions provide waitForTimeout
      // @ts-ignore
      if (typeof page.waitForTimeout === 'function') await (page as any).waitForTimeout(250);
      else await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  const darkPath = path.join(snapsDir, 'latest-dark.png');
  await page.screenshot({ path: darkPath, fullPage: true });

  await browser.close();

  // If baseline exists, compare
  const baseLight = path.join(snapsDir, 'baseline-light.png');
  const baseDark = path.join(snapsDir, 'baseline-dark.png');

  function compare(a: string, b: string, label: string) {
    if (!fs.existsSync(a) || !fs.existsSync(b)) {
      console.log(`${label}: baseline or latest missing — saving latest as baseline`);
      if (fs.existsSync(b) && !fs.existsSync(a)) fs.copyFileSync(b, a);
      return;
    }
    const imgA = PNG.sync.read(fs.readFileSync(a));
    const imgB = PNG.sync.read(fs.readFileSync(b));
    const { width, height } = imgA;
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, width, height, { threshold: 0.1 });
    const diffPath = path.join(snapsDir, `diff-${label}.png`);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    console.log(`${label}: ${mismatched} pixels differ — diff written to ${diffPath}`);
    if (mismatched > 0) process.exitCode = 2;
  }

  compare(baseLight, lightPath, 'light');
  compare(baseDark, darkPath, 'dark');

  console.log('visual regression: done');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
