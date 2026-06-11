// Pure HS pricing calculations — no I/O, safe to run on server and client.
//
// Matrix shape (mapped from Sanity, CNZ cells already converted to null):
//   { widthBands: [{ min, max }], rows: [{ heightMin, heightMax, prices: (number|null)[] }] }
// Band boundary rule everywhere: value > min && value <= max (price-list "do X mm" semantics).

export const PRICE_STATUS = {
  OK: 'ok',
  UNAVAILABLE: 'unavailable',
  NO_PRICING: 'noPricing',
};

export const findBandIndex = (bands, value) => {
  // The very first band is inclusive of its lower edge, so the table's global
  // minimum (where sliders clamp to) still resolves to a price.
  if (bands.length && value === bands[0].min) return 0;
  return bands.findIndex((band) => value > band.min && value <= band.max);
};

export const getBasePrice = (matrix, widthMm, heightMm) => {
  if (!matrix?.widthBands?.length || !matrix?.rows?.length) {
    return { status: PRICE_STATUS.NO_PRICING };
  }

  const columnIndex = findBandIndex(matrix.widthBands, widthMm);
  const rowIndex = findBandIndex(
    matrix.rows.map((item) => ({ min: item.heightMin, max: item.heightMax })),
    heightMm
  );
  const price = columnIndex >= 0 && rowIndex >= 0 ? matrix.rows[rowIndex]?.prices?.[columnIndex] : null;

  if (typeof price !== 'number' || price <= 0) {
    return { status: PRICE_STATUS.UNAVAILABLE };
  }
  return { status: PRICE_STATUS.OK, price };
};

/**
 * Calculate the estimated total price for a configuration.
 *
 * @param {object} params
 * @param {object|null} params.matrix Scheme price matrix (null when the scheme has no pricing).
 * @param {object|null} params.addonQuantities Per-scheme add-on counts, e.g. { outerHandle: 2 }.
 * @param {object} params.settings Shared unit prices: { fixed: { silentClose, cylinderLock, outerHandle }, temperedGlassPerM2, woodSpecies: [{ key, surchargePercent }] }.
 * @param {number} params.widthMm
 * @param {number} params.heightMm
 * @param {object} params.options Selected add-ons: { woodKey, silentClose, cylinderLock, outerHandle, temperedGlass }.
 * @returns {{ status: 'ok', total: number, base: number } | { status: 'unavailable' | 'noPricing' }}
 */
export const calculateHsPrice = ({ matrix, addonQuantities, settings, widthMm, heightMm, options }) => {
  if (!matrix) return { status: PRICE_STATUS.NO_PRICING };

  const baseResult = getBasePrice(matrix, widthMm, heightMm);
  if (baseResult.status !== PRICE_STATUS.OK) return baseResult;

  const base = baseResult.price;

  const woodPercent =
    settings?.woodSpecies?.find((species) => species.key === options?.woodKey)?.surchargePercent ?? 0;
  const woodSurcharge = (base * woodPercent) / 100;

  const fixedSurcharge = ['silentClose', 'cylinderLock', 'outerHandle'].reduce((sum, key) => {
    if (!options?.[key]) return sum;
    const unitPrice = settings?.fixed?.[key] ?? 0;
    const quantity = addonQuantities?.[key] ?? 1;
    return sum + unitPrice * quantity;
  }, 0);

  const glassSurcharge = options?.temperedGlass
    ? (settings?.temperedGlassPerM2 ?? 0) * (widthMm / 1000) * (heightMm / 1000)
    : 0;

  const total = base + woodSurcharge + fixedSurcharge + glassSurcharge;

  // Round only the final value, to the nearest 10 PLN — the price is an estimate anyway.
  return { status: PRICE_STATUS.OK, total: Math.round(total / 10) * 10, base };
};

const plnFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
});

export const formatPln = (value) => plnFormatter.format(value);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const intersectRange = (a, b) => {
  const min = Math.max(a.min, b.min);
  const max = Math.min(a.max, b.max);
  return min < max ? { min, max } : null;
};

/**
 * Derive slider ranges from the pricing matrix, intersected with the hardcoded
 * design ranges. Falls back to the hardcoded ranges when there is no matrix or
 * the intersection is empty.
 *
 * @param {object|null} matrix
 * @param {{min: number, max: number, default: number}} hardWidthRange
 * @param {{min: number, max: number, default: number}} hardHeightRange
 */
export const deriveRanges = (matrix, hardWidthRange, hardHeightRange) => {
  const fallback = {
    width: { ...hardWidthRange },
    height: { ...hardHeightRange },
  };

  if (!matrix?.widthBands?.length || !matrix?.rows?.length) return fallback;

  // Usable width columns: at least one row has a real price (excludes all-CNZ columns).
  const usableBands = matrix.widthBands.filter((band, index) =>
    matrix.rows.some((row) => typeof row.prices?.[index] === 'number' && row.prices[index] > 0)
  );
  if (!usableBands.length) return fallback;

  const matrixWidth = { min: usableBands[0].min, max: usableBands[usableBands.length - 1].max };
  const matrixHeight = {
    min: matrix.rows[0].heightMin,
    max: matrix.rows[matrix.rows.length - 1].heightMax,
  };

  const width = intersectRange(matrixWidth, hardWidthRange) ?? { min: hardWidthRange.min, max: hardWidthRange.max };
  const height = intersectRange(matrixHeight, hardHeightRange) ?? { min: hardHeightRange.min, max: hardHeightRange.max };

  return {
    width: { ...width, default: clamp(hardWidthRange.default, width.min, width.max) },
    height: { ...height, default: clamp(hardHeightRange.default, height.min, height.max) },
  };
};
