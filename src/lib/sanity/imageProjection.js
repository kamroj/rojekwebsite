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
