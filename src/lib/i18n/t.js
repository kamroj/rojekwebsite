// src/lib/i18n/t.js
// Tiny translation helper for Astro/Node usage (no i18next runtime).

/**
 * Safely resolves a nested value from an object using dot notation.
 * Example: getPath(obj, 'a.b.c')
 */
export function getPath(obj, path) {
  if (!obj || !path) return undefined;
  const parts = String(path).split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/**
 * Minimal `t` helper compatible-ish with i18next-style key paths.
 * - If key is missing, returns `defaultValue`.
 * - If resolved value is not a string, returns it as-is.
 */
export function t(translationObj, key, defaultValue = '') {
  const v = getPath(translationObj, key);
  return v === undefined ? defaultValue : v;
}
