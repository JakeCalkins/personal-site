#!/usr/bin/env node
// Basic static site minifier for HTML/CSS/JS - writes to ./dist
// No external dependencies. Use for GitHub Pages pre-deploy step.
const fs = require('fs');
const path = require('path');

const inputDir = process.cwd();
const outDir = path.join(process.cwd(), 'dist');

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function minifyHtml(str){
  // remove comments
  str = str.replace(/<!--([\s\S]*?)-->/g, '');
  // collapse whitespace between tags
  str = str.replace(/>\s+</g, '><');
  // trim
  return str.trim();
}

function minifyCss(str){
  // remove comments
  str = str.replace(/\/\*([\s\S]*?)\*\//g, '');
  // collapse whitespace
  str = str.replace(/\s+/g, ' ');
  // remove space around symbols
  str = str.replace(/\s*([{:;,}])\s*/g, '$1');
  return str.trim();
}

function minifyJs(str){
  // very basic: remove comments and collapse whitespace
  str = str.replace(/\/\*([\s\S]*?)\*\//g, '');
  str = str.replace(/\/\/.*$/gm, '');
  str = str.replace(/\s+/g, ' ');
  return str.trim();
}

function copyAndMinify(filePath, rel){
  const ext = path.extname(filePath).toLowerCase();
  const dest = path.join(outDir, rel);
  ensureDir(path.dirname(dest));
  const content = fs.readFileSync(filePath, 'utf8');
  let out = content;
  if(ext === '.html' || ext === '.htm') out = minifyHtml(content);
  else if(ext === '.css') out = minifyCss(content);
  else if(ext === '.js') out = minifyJs(content);
  fs.writeFileSync(dest, out, 'utf8');
}

function walk(dir, base=''){
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for(const it of items){
    const full = path.join(dir, it.name);
    const rel = path.join(base, it.name);
    if(it.isDirectory()){
      if(it.name === 'dist' || it.name === '.git') continue;
      walk(full, rel);
    } else {
      const ext = path.extname(it.name).toLowerCase();
      if(['.html','.htm','.css','.js','.svg','.png','.jpg','.jpeg','.ico','json','txt'].includes(ext)){
        // copy and minify as appropriate
        copyAndMinify(full, rel);
      } else {
        // copy other files as-is
        const dest = path.join(outDir, rel);
        ensureDir(path.dirname(dest));
        fs.copyFileSync(full, dest);
      }
    }
  }
}

// run
ensureDir(outDir);
walk(inputDir, '');
console.log('Wrote minified site to', outDir);
