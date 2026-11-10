#!/usr/bin/env node
// Copia para dist/ somente os arquivos que o app publica. Documentos internos,
// testes, migrações, schema e relatórios de auditoria ficam fora do deploy.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'dist');
const PUBLIC_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.svg', '.webmanifest']);
const PRIVATE_ROOT_FILES = new Set(['vercel.json', 'package.json', 'package-lock.json', 'schema.sql']);
const PUBLIC_DIRS = ['assets', 'media', 'vendor', 'docs/compatibility'];
const PUBLIC_EXTRA = ['THIRD_PARTY_NOTICES.md'];

function publicRootFiles() {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => PUBLIC_EXTENSIONS.has(path.extname(name)) && !PRIVATE_ROOT_FILES.has(name) && !name.startsWith('.'))
    .concat(PUBLIC_EXTRA.filter((name) => fs.existsSync(path.join(root, name))));
}

function build() {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const files = publicRootFiles();
  for (const name of files) fs.copyFileSync(path.join(root, name), path.join(out, name));
  for (const dir of PUBLIC_DIRS) {
    const from = path.join(root, dir);
    if (fs.existsSync(from)) fs.cpSync(from, path.join(out, dir), { recursive: true });
  }
  return { files, dirs: PUBLIC_DIRS };
}

module.exports = { build, publicRootFiles, PUBLIC_DIRS };
if (require.main === module) {
  const result = build();
  console.log(`dist/: ${result.files.length} arquivos na raiz + ${result.dirs.join(', ')}`);
}
