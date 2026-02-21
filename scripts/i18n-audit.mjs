import fs from 'node:fs/promises';
import path from 'node:path';

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const LANGS = ['pl', 'en', 'de', 'fr'];
const FILE_NAME = 'translation.json';

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function flattenKeys(obj, prefix = '') {
  /** @type {string[]} */
  const out = [];

  if (!isObject(obj)) return out;

  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (isObject(value)) {
      out.push(...flattenKeys(value, next));
    } else {
      // arrays and primitives are treated as leaf values
      out.push(next);
    }
  }

  return out;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const translations = {};
  for (const lang of LANGS) {
    const filePath = path.join(LOCALES_DIR, lang, FILE_NAME);
    translations[lang] = await readJson(filePath);
  }

  const keySets = {};
  for (const lang of LANGS) {
    keySets[lang] = new Set(flattenKeys(translations[lang]));
  }

  const allKeys = new Set();
  for (const lang of LANGS) {
    for (const k of keySets[lang]) allKeys.add(k);
  }

  /** @type {Record<string, string[]>} */
  const missing = {};
  for (const lang of LANGS) missing[lang] = [];

  for (const k of allKeys) {
    for (const lang of LANGS) {
      if (!keySets[lang].has(k)) missing[lang].push(k);
    }
  }

  const summary = LANGS.map((lang) => ({
    lang,
    missing: missing[lang].length,
  }));

  console.log('i18n audit summary:');
  for (const row of summary) {
    console.log(`- ${row.lang}: missing ${row.missing}`);
  }

  const reportPath = path.join(process.cwd(), 'public', 'i18n-audit-report.json');
  await fs.writeFile(reportPath, JSON.stringify({ missing }, null, 2), 'utf8');
  console.log(`\nReport written to: ${path.relative(process.cwd(), reportPath)}`);

  // Exit code 1 if anything is missing (useful for CI)
  const totalMissing = summary.reduce((acc, r) => acc + r.missing, 0);
  if (totalMissing > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 2;
});
