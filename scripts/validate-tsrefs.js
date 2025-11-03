#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

function walkDir(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, filelist);
    } else if (stat.isFile() && full.endsWith('.ts')) {
      filelist.push(full);
    }
  }
  return filelist;
}

const repoRoot = process.cwd();
const packagesDir = path.join(repoRoot, 'packages');
if (!fs.existsSync(packagesDir)) {
  console.error('No packages/ directory found.');
  process.exit(0);
}

const packageDirs = fs.readdirSync(packagesDir).filter(d => fs.statSync(path.join(packagesDir, d)).isDirectory());

let hadError = false;

for (const pkg of packageDirs) {
  const pkgPath = path.join(packagesDir, pkg);
  const srcPath = path.join(pkgPath, 'src');
  if (!fs.existsSync(srcPath)) continue;

  const tsFiles = walkDir(srcPath);
  const imports = new Set();

  const importRegex = /from\s+['\"](@acme\/[a-zA-Z0-9_\-]+)['\"]/g;
  const requireRegex = /require\(['\"](@acme\/[a-zA-Z0-9_\-]+)['\"]\)/g;

  for (const file of tsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = importRegex.exec(src)) !== null) {
      imports.add(m[1]);
    }
    while ((m = requireRegex.exec(src)) !== null) {
      imports.add(m[1]);
    }
  }

  if (imports.size === 0) continue;

  const tsconfigPath = path.join(pkgPath, 'tsconfig.json');
  const tsconfig = readJSON(tsconfigPath) || {};
  const refs = (tsconfig.references || []).map(r => {
    if (!r || !r.path) return null;
    const p = r.path.replace(/\\/g, '/');
    const base = path.basename(p);
    return base;
  }).filter(Boolean);

  const missing = [];
  for (const imp of imports) {
    const name = imp.replace('@acme/', '');
    if (!refs.includes(name)) missing.push(name);
  }

  if (missing.length > 0) {
    hadError = true;
    console.error(`Package '${pkg}' is missing tsconfig "references" for: ${missing.join(', ')}`);
    console.error(`  Add entries like { "path": "../<package>" } to ${path.relative(repoRoot, tsconfigPath)}\n`);
  }
}

if (hadError) {
  console.error('tsconfig references validation failed.');
  process.exit(1);
} else {
  console.log('tsconfig references validation passed.');
  process.exit(0);
}
