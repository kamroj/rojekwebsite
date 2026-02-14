import React from 'react';
import { getSanityImageProps } from '../../lib/sanity/sanityImageProps.js';
import ImageWithSpinner from './ImageWithSpinner.jsx';

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
  fetchPriority,
  // backward compatibility for older call sites
  fetchpriority,
  placeholder = 'lqip',
  wrapperClassName,
  className,
  style,
  showSpinner,
  holdSpinnerMs,
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
    fetchpriority: fetchPriority || fetchpriority,
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
  const shouldShowSpinner = typeof showSpinner === 'boolean'
    ? showSpinner
    : !(imgProps.loading === 'eager' || imgProps.fetchpriority === 'high');

  return (
    <ImageWithSpinner
      {...rest}
      wrapperClassName={wrapperClassName || className}
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
      // React DOM prop casing is `fetchPriority` (but the HTML attribute is `fetchpriority`).
      fetchPriority={imgProps.fetchpriority}
      wrapperStyle={finalStyle}
      showSpinner={shouldShowSpinner}
      holdSpinnerMs={holdSpinnerMs}
      onLoad={onLoad}
    />
  );
}
