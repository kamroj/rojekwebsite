/**
 * Shared Sanity image types used across the app.
 *
 * We keep it as JSDoc (not TS) because the project is JS/JSX.
 */

/**
 * @typedef {Object} SanityImageDimensions
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 */

/**
 * @typedef {Object} SanityImageMetadata
 * @property {SanityImageDimensions} dimensions
 * @property {string=} lqip
 * @property {string=} blurHash
 * @property {any=} palette
 */

/**
 * @typedef {Object} SanityImageAsset
 * @property {string} url
 * @property {SanityImageMetadata=} metadata
 */

/**
 * @typedef {Object} SanityImageCrop
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 */

/**
 * @typedef {Object} SanityImageHotspot
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 */

/**
 * SanityImage
 *
 * Canonical shape we expect from GROQ.
 *
 * - `alt` should come from Studio.
 * - If `alt` is missing, we will fallback in rendering helpers.
 *
 * @typedef {Object} SanityImage
 * @property {string=} alt
 * @property {SanityImageAsset=} asset
 * @property {SanityImageCrop=} crop
 * @property {string=} _key
 * @property {SanityImageHotspot=} hotspot
 */

export {}; // ensure this file is treated as a module

/** @typedef {SanityImage} _SanityImageExportHack */



