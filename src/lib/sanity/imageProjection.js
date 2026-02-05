// Reusable GROQ projection fragments for Sanity images.
//
// IMPORTANT:
// - `asset->metadata` must be explicitly selected to get dimensions/lqip/etc.
// - `crop` + `hotspot` are required so the image-url builder can respect them.

export const SANITY_IMAGE_ASSET_PROJECTION = `asset->{
  url,
  metadata{
    dimensions{width,height,aspectRatio},
    lqip,
    blurHash,
    palette
  }
}`;

// By convention we store alt text under `alt` on the image object.
// (If some schemas do not have alt yet, we will add fallbacks in the renderer.)
export const SANITY_IMAGE_PROJECTION = `{
  // Present when this image is an item in an array (e.g. gallery[])
  _key,
  alt,
  ${SANITY_IMAGE_ASSET_PROJECTION},
  crop,
  hotspot
}`;

// PortableText image blocks are stored inside rich text arrays.
// For them we must keep `_type`, otherwise the PortableText renderer cannot detect the node type.
export const SANITY_PORTABLETEXT_IMAGE_BLOCK_PROJECTION = `{
  _type,
  _key,
  alt,
  ${SANITY_IMAGE_ASSET_PROJECTION},
  crop,
  hotspot
}`;

// Projection for `blockContent` arrays that may contain image blocks.
// Usage example: `longDescription.pl ${SANITY_BLOCK_CONTENT_ARRAY_PROJECTION}`
export const SANITY_BLOCK_CONTENT_ARRAY_PROJECTION = `[]{
  ...,
  _type == "image" => ${SANITY_PORTABLETEXT_IMAGE_BLOCK_PROJECTION}
}`;

// Projection for `localizedBlockContent` objects (PL/EN/DE) with image metadata.
// This keeps the localization object shape, so `pickLocale(value, lang)` continues to work.
export const SANITY_LOCALIZED_BLOCK_CONTENT_PROJECTION = `{
  pl ${SANITY_BLOCK_CONTENT_ARRAY_PROJECTION},
  en ${SANITY_BLOCK_CONTENT_ARRAY_PROJECTION},
  de ${SANITY_BLOCK_CONTENT_ARRAY_PROJECTION}
}`;
