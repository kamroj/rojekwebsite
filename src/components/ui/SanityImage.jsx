import React from 'react';
import { getSanityImageProps } from '../../lib/sanity/sanityImageProps.js';

/**
 * @typedef {import('../../lib/sanity/imageTypes.js').SanityImage} SanityImageType
 */

/**
 * SanityImage (React)
 *
 * Renders an `<img>` with proper src/srcset/sizes and explicit width/height.
 * Optionally uses `asset.metadata.lqip` as a lightweight blur placeholder.
 */
export default function SanityImage({
  image,
  alt,
  altFallback,
  widths,
  sizes,
  quality,
  fit,
  format,
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
  placeholder = 'lqip',
  className,
  style,
  onLoad,
  ...rest
}) {
  /** @type {SanityImageType|null} */
  const sanityImage = image || null;

  const imgProps = getSanityImageProps(sanityImage, {
    widths,
    sizes,
    quality,
    fit,
    format,
    loading,
    decoding,
    fetchpriority,
    altFallback: altFallback ?? alt ?? '',
  });

  const lqip = sanityImage?.asset?.metadata?.lqip;
  const shouldUsePlaceholder = placeholder === 'lqip' && Boolean(lqip);

  if (!imgProps) return null;

  const resolvedAlt = typeof alt === 'string' ? alt : imgProps.alt;
  const mergedStyle = {
    ...(style || null),
    ...(shouldUsePlaceholder
      ? {
        backgroundImage: `url(${lqip})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      : null),
  };

  // IMPORTANT (Astro Islands / hydration):
  // In SSG/SSR the browser may load the image before React hydrates.
  // If we hide the image until `onLoad`, the `onLoad` event can be missed,
  // leaving the image invisible forever.
  // Therefore we keep the real image visible at all times.
  const finalStyle = mergedStyle;

  return (
    <img
      {...rest}
      className={className}
      src={imgProps.src}
      data-sanity-placeholder={shouldUsePlaceholder ? 'lqip' : undefined}
      srcSet={imgProps.srcset}
      sizes={imgProps.sizes}
      width={imgProps.width}
      height={imgProps.height}
      alt={resolvedAlt}
      loading={imgProps.loading}
      decoding={imgProps.decoding}
      fetchpriority={imgProps.fetchpriority}
      style={finalStyle}
      onLoad={onLoad}
    />
  );
}
