// src/lib/sanity/sanityImageProps.js
import { urlForImage } from './image.js';

/**
 * @typedef {import('./imageTypes.js').SanityImage} SanityImage
 */

const DEFAULT_WIDTHS = [320, 480, 640, 800, 1024, 1280, 1600];

/**
 * Ensure we don't request widths larger than the original asset.
 * (Sanity will generally serve them, but it's wasteful.)
 */
const capWidthsToAsset = (widths, assetWidth) => {
  const list = (widths || []).filter((n) => Number.isFinite(n) && n > 0);
  if (!assetWidth || !Number.isFinite(assetWidth)) return list;
  return list.filter((w) => w <= assetWidth);
};

/**
 * Convert the image-url builder chain to a srcset string.
 *
 * @param {ReturnType<typeof urlForImage>} builder
 * @param {number[]} widths
 */
const buildSrcSet = (builder, widths) => {
  const list = (widths || []).filter(Boolean);
  if (!builder || list.length === 0) return undefined;

  return list
    .map((w) => {
      const url = builder.width(w).url();
      return url ? `${url} ${w}w` : null;
    })
    .filter(Boolean)
    .join(', ');
};

/**
 * Main helper that generates props for `<img>` from a Sanity image object.
 *
 * Design goals:
 * - Always output width/height (to avoid CLS) when metadata.dimensions exists.
 * - Generate responsive srcset/sizes using Sanity's image pipeline.
 * - Respect crop/hotspot (must be present on the image object, and passed to builder.image()).
 *
 * @param {SanityImage|null|undefined} image
 * @param {{
 *   widths?: number[],
 *   sizes?: string,
 *   quality?: number,
 *   format?: string,
 *   fit?: string,
 *   loading?: 'lazy'|'eager',
 *   decoding?: 'async'|'auto'|'sync',
 *   fetchpriority?: 'high'|'low'|'auto',
 *   altFallback?: string,
 * }=} opts
 */
export const getSanityImageProps = (image, opts = {}) => {
  if (!image) return null;

  const {
    widths = DEFAULT_WIDTHS,
    sizes,
    quality = 75,
    format = 'auto',
    fit,
    loading,
    decoding = 'async',
    fetchpriority,
    altFallback = '',
  } = opts;

  const alt = typeof image.alt === 'string' ? image.alt : altFallback;
  const dimensions = image?.asset?.metadata?.dimensions;

  const baseBuilder = urlForImage(image);
  if (!baseBuilder) {
    // If builder is not available, we can still try to use the raw asset URL.
    const rawUrl = image?.asset?.url;
    if (!rawUrl) return null;
    return {
      src: rawUrl,
      alt,
      width: dimensions?.width,
      height: dimensions?.height,
      loading,
      decoding,
      fetchpriority,
    };
  }

  let builder = baseBuilder.quality(quality);
  // Sanity expects `auto=format` (not `fm=auto`).
  // @sanity/image-url exposes it as `.auto('format')`.
  if (format === 'auto') builder = builder.auto('format');
  else if (format) builder = builder.format(format);
  if (fit) builder = builder.fit(fit);

  const assetWidth = dimensions?.width;
  const safeWidths = capWidthsToAsset(widths, assetWidth);

  // Default src: pick something reasonably sized.
  // Prefer 800 if present; otherwise use the largest available width (best quality).
  const defaultSrcWidth = (safeWidths.includes(800)
    ? 800
    : (safeWidths[safeWidths.length - 1] || 800));
  const src = builder.width(defaultSrcWidth).url();

  const srcset = buildSrcSet(builder, safeWidths);

  // NOTE: sizes is highly layout-dependent; provide a safe default.
  // Consumers should override in hero/grids.
  const resolvedSizes = sizes || '100vw';

  // CLS prevention: if we have dimensions, derive width/height for the chosen src.
  // Use aspectRatio for stability.
  let width;
  let height;
  if (dimensions?.width && dimensions?.height) {
    const ratio = dimensions.aspectRatio || (dimensions.width / dimensions.height);
    width = defaultSrcWidth;
    height = Math.round(defaultSrcWidth / ratio);
  }

  return {
    src,
    srcset,
    sizes: resolvedSizes,
    width,
    height,
    alt,
    loading,
    decoding,
    fetchpriority,
  };
};
