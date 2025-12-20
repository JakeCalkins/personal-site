#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';

function execPromise(cmd: string, opts: any = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout: String(stdout), stderr: String(stderr) });
      resolve({ stdout: String(stdout), stderr: String(stderr) });
    });
  });
}

async function run() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ps-test-'));
  const cwd = tmp;

  // prepare minimal src/index.html
  const repoRoot = process.cwd();
  const srcIndex = path.join(repoRoot, 'src', 'index.html');
  const srcIndexContent = await fs.readFile(srcIndex, 'utf8');

  await fs.mkdir(path.join(cwd, 'src'), { recursive: true });
  await fs.mkdir(path.join(cwd, 'content'), { recursive: true });
  await fs.mkdir(path.join(cwd, 'scripts'), { recursive: true });

  await fs.writeFile(path.join(cwd, 'src', 'index.html'), srcIndexContent, 'utf8');

  const md = `---\ntitle: Test Page\n---\n\n# Heading\n\nThis is a test.`;
  await fs.writeFile(path.join(cwd, 'content', 'test.md'), md, 'utf8');

  // run generator using the repository's dependencies but with cwd set to the tmp dir
  const genSrc = path.join(repoRoot, 'scripts', 'generate-md.ts');
  try {
    const tsNodeRegister = path.join(repoRoot, 'node_modules', 'ts-node', 'register');
    await execPromise(`node -r ${JSON.stringify(tsNodeRegister)} ${JSON.stringify(genSrc)}`, { cwd });
  } catch (err: any) {
    console.error('Generator failed', err.stderr || err);
    throw new Error('generate-md execution failed');
  }

  const outIndex = path.join(cwd, 'dist', 'index.html');
  const exists = await fs.stat(outIndex).then(() => true).catch(() => false);
  if (!exists) throw new Error('dist/index.html was not created by generator');

  const outHtml = await fs.readFile(outIndex, 'utf8');
  if (!outHtml.includes('This is a test.')) throw new Error('Generated HTML does not include markdown content');

  // Verify per-page HTML was generated
  const perPage = path.join(cwd, 'dist', 'test-page.html');
  const perPageExists = await fs.stat(perPage).then(() => true).catch(() => false);
  // slug derived from title "Test Page" => "test-page"
  if (!perPageExists) throw new Error('Per-page HTML was not generated for markdown file');
  const perPageHtml = await fs.readFile(perPage, 'utf8');
  if (!perPageHtml.includes('This is a test.')) throw new Error('Per-page HTML does not include markdown content');

  // Verify page links were injected into desktop title area
  if (!outHtml.includes('href="test-page.html"')) throw new Error('Index does not include link to per-page HTML');

  // Verify page buttons were injected into mobile FAB menu
  if (!outHtml.includes('class="item" href="test-page.html"')) throw new Error('FAB menu does not include per-page button link');

  console.log('generate-md test: OK');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
