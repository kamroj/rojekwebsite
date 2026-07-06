import { getSanityClient } from './client';
import { isSanityConfigured } from './config';

// Matches CNZ_SENTINEL written by the Studio matrix input (sanity/components/HsPriceMatrixInput.jsx).
const CNZ_SENTINEL = -1;

const DEFAULT_WOOD_SPECIES = [
  { key: 'pine', surchargePercent: 0 },
  { key: 'meranti', surchargePercent: 10 },
  { key: 'oak', surchargePercent: 20 },
];

const mapMatrix = (matrix) => {
  const widthBands = (matrix?.widthBands ?? [])
    .filter((band) => typeof band?.min === 'number' && typeof band?.max === 'number')
    .map((band) => ({ min: band.min, max: band.max }));

  const rows = (matrix?.rows ?? [])
    .filter(
      (row) =>
        typeof row?.heightMin === 'number' &&
        typeof row?.heightMax === 'number' &&
        Array.isArray(row?.prices) &&
        row.prices.length === widthBands.length
    )
    .map((row) => ({
      heightMin: row.heightMin,
      heightMax: row.heightMax,
      prices: row.prices.map((price) => (price === CNZ_SENTINEL ? null : price)),
    }));

  if (!widthBands.length || !rows.length) return null;
  return { widthBands, rows };
};

const mapSettings = (settings) => {
  if (!settings) return null;

  const woodSpecies = (settings.woodSpecies ?? [])
    .filter((species) => species?.key && typeof species?.surchargePercent === 'number')
    .map((species) => ({
      key: species.key,
      // Localized object {pl,en,de,fr}; legacy documents may still carry a plain titlePl.
      title: species.title ?? (species.titlePl ? { pl: species.titlePl } : null),
      surchargePercent: species.surchargePercent,
    }));

  return {
    fixed: {
      silentClose: settings.silentClosePrice ?? 0,
      cylinderLock: settings.cylinderLockPrice ?? 0,
      outerHandle: settings.outerHandlePrice ?? 0,
    },
    temperedGlassPerM2: settings.temperedGlassPricePerM2 ?? 0,
    woodSpecies: woodSpecies.length ? woodSpecies : DEFAULT_WOOD_SPECIES,
    aluminiumSurchargePercent: settings.aluminiumSurchargePercent ?? 0,
  };
};

/**
 * Fetch HS configurator pricing (shared settings + per-scheme matrices).
 * Returns a plain JSON-serializable object (passed as Astro island props), or
 * null when Sanity is unconfigured, the fetch fails, or settings are missing —
 * the configurator then renders without the price UI.
 */
export const fetchHsPricing = async ({ signal } = {}) => {
  if (!isSanityConfigured()) return null;

  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `{
    "settings": coalesce(
      *[_type == "hsPricingSettings" && _id == "drafts.hsPricingSettings"][0],
      *[_type == "hsPricingSettings" && _id == "hsPricingSettings"][0]
    ){
      silentClosePrice,
      cylinderLockPrice,
      outerHandlePrice,
      temperedGlassPricePerM2,
      aluminiumSurchargePercent,
      woodSpecies[]{ key, title, titlePl, surchargePercent }
    },
    "schemes": *[_type == "hsPricingScheme" && defined(scheme) && defined(matrix.rows)]{
      scheme,
      addonQuantities{ silentClose, cylinderLock, outerHandle },
      matrix{ widthBands[]{ min, max }, rows[]{ heightMin, heightMax, prices } }
    }
  }`;

  let res;
  try {
    res = await sanityClient.fetch(query, {}, { signal });
  } catch (error) {
    // Pricing is an enhancement — never let it break the configurator pages' build.
    console.warn('[hsPricing] Failed to fetch pricing from Sanity:', error?.message || error);
    return null;
  }

  const settings = mapSettings(res?.settings);
  if (!settings) return null;

  const schemes = {};
  for (const item of res?.schemes ?? []) {
    if (!item?.scheme || schemes[item.scheme]) continue;
    const matrix = mapMatrix(item.matrix);
    if (!matrix) continue;
    schemes[item.scheme] = {
      matrix,
      addonQuantities: item.addonQuantities ?? null,
    };
  }

  return { settings, schemes };
};
