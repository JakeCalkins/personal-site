#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';

function execPromise(cmd: string, opts: any = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr });
      resolve({ stdout, stderr });
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

  // copy generator script into tmp/scripts
  const genSrc = path.join(repoRoot, 'scripts', 'generate-md.ts');
  const genDst = path.join(cwd, 'scripts', 'generate-md.ts');
  await fs.copyFile(genSrc, genDst);

  // run generator using ts-node (assumes dev deps installed)
  try {
    await execPromise(`npx ts-node ./scripts/generate-md.ts`, { cwd });
  } catch (err: any) {
    console.error('Generator failed', err.stderr || err);
    throw new Error('generate-md execution failed');
  }

  const outIndex = path.join(cwd, 'dist', 'index.html');
  const exists = await fs.stat(outIndex).then(() => true).catch(() => false);
  if (!exists) throw new Error('dist/index.html was not created by generator');

  const outHtml = await fs.readFile(outIndex, 'utf8');
  if (!outHtml.includes('This is a test.')) throw new Error('Generated HTML does not include markdown content');

  console.log('generate-md test: OK');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
