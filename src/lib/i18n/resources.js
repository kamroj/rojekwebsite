// src/lib/i18n/resources.js
// SSR/SSG helper to load i18n translation resources from /public.
// We keep it framework-agnostic so it can be used in Astro (server) and in Node scripts.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_LANGS = ['pl', 'en', 'de', 'fr'];

export function normalizeLang(lang) {
  if (!lang) return 'pl';
  const l = String(lang).toLowerCase();
  return SUPPORTED_LANGS.includes(l) ? l : 'pl';
}

export async function loadTranslationJson(lang) {
  const safeLang = normalizeLang(lang);

  // Build/SSR safety:
  // During `astro build`, this module is bundled into `dist/chunks/...` and `import.meta.url`
  // points to the output file, not the source tree. Therefore, resolving projectRoot from
  // `import.meta.url` becomes unreliable.
  //
  // We prefer `process.cwd()` (Astro runs with cwd = project root), with a fallback for
  // environments where `process` is not available.
  let projectRoot = null;
  try {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.cwd) {
      // eslint-disable-next-line no-undef
      projectRoot = process.cwd();
    }
  } catch {
    projectRoot = null;
  }

  if (!projectRoot) {
    const here = path.dirname(fileURLToPath(import.meta.url));
    projectRoot = path.resolve(here, '../../../');
  }

  const filePath = path.join(projectRoot, 'public', 'locales', safeLang, 'translation.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Creates an i18next-compatible resources object for a single language.
 *
 * Shape:
 *   { [lang]: { translation: {...} } }
 */
export async function getI18nResources(lang) {
  const safeLang = normalizeLang(lang);
  const translation = await loadTranslationJson(safeLang);
  return {
    [safeLang]: { translation },
  };
}
