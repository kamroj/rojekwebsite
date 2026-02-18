import { promises as fs } from 'node:fs';
import path from 'node:path';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../src/constants/index.js';
import { translatePathname } from '../src/lib/i18n/routing.js';
import { resolveSiteUrl } from './resolve-site-url.js';

const DIST_DIR = path.resolve('dist');
const OUTPUT_PATH = path.join(DIST_DIR, 'sitemap.xml');
const PUBLIC_OUTPUT_PATH = path.resolve('public', 'sitemap.xml');

const EXCLUDED_PREFIXES = ['/404', '/admin', '/preview', '/draft'];
const EXCLUDED_EXACT = new Set(['/sitemap.xml', '/sitemap-index.xml', '/sitemap_index.xml']);

function normalizeUrlPath(urlPath) {
  if (!urlPath) return '/';

  let normalized = urlPath.replace(/\/+/g, '/');
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || '/';
}

async function walkHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await walkHtmlFiles(fullPath);
      files.push(...nested);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function toUrlPath(absoluteFilePath) {
  const relative = path.relative(DIST_DIR, absoluteFilePath).replace(/\\/g, '/');

  if (relative === 'index.html') {
    return '/';
  }

  if (relative.endsWith('/index.html')) {
    return normalizeUrlPath(`/${relative.slice(0, -'index.html'.length)}`);
  }

  return normalizeUrlPath(`/${relative.replace(/\.html$/, '')}`);
}

function shouldExclude(urlPath) {
  if (EXCLUDED_EXACT.has(urlPath)) return true;
  return EXCLUDED_PREFIXES.some((prefix) => urlPath === prefix || urlPath.startsWith(`${prefix}/`));
}

function formatIsoDate(value) {
  return new Date(value).toISOString();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getAlternateEntries(urlPath, availablePaths, siteUrl) {
  const alternates = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    const translatedPath = normalizeUrlPath(translatePathname(urlPath, lang));
    if (!availablePaths.has(translatedPath)) continue;

    const href = new URL(translatedPath, `${siteUrl}/`).toString();
    alternates.push({ hreflang: lang, href });
  }

  const xDefaultPath = normalizeUrlPath(translatePathname(urlPath, DEFAULT_LANGUAGE));
  if (availablePaths.has(xDefaultPath)) {
    const href = new URL(xDefaultPath, `${siteUrl}/`).toString();
    alternates.push({ hreflang: 'x-default', href });
  }

  return alternates;
}

async function generate() {
  const siteUrl = resolveSiteUrl({ command: 'build' });
  const htmlFiles = await walkHtmlFiles(DIST_DIR);

  const records = [];
  const seen = new Set();

  for (const filePath of htmlFiles) {
    const urlPath = toUrlPath(filePath);

    if (shouldExclude(urlPath)) continue;
    if (seen.has(urlPath)) continue;

    seen.add(urlPath);

    const stats = await fs.stat(filePath);
    records.push({
      urlPath,
      lastmod: formatIsoDate(stats.mtime),
    });
  }

  records.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
  const availablePaths = new Set(records.map(({ urlPath }) => urlPath));

  const body = records
    .map(({ urlPath, lastmod }) => {
      const loc = new URL(urlPath, `${siteUrl}/`).toString();
      const alternateEntries = getAlternateEntries(urlPath, availablePaths, siteUrl)
        .map(({ hreflang, href }) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`)
        .join('\n');

      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${alternateEntries ? `\n${alternateEntries}` : ''}\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;

  await Promise.all([
    fs.writeFile(OUTPUT_PATH, xml, 'utf8'),
    fs.writeFile(PUBLIC_OUTPUT_PATH, xml, 'utf8'),
  ]);

  console.log(`[sitemap] Generated ${records.length} URLs in ${OUTPUT_PATH}`);
  console.log(`[sitemap] Synced fallback copy to ${PUBLIC_OUTPUT_PATH}`);
}

generate().catch((error) => {
  console.error('[sitemap] Generation failed:', error);
  process.exit(1);
});
