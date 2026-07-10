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
 * @param {object} params.settings Shared unit prices: { fixed: { silentClose, cylinderLock, outerHandle }, temperedGlassPerM2, woodSpecies: [{ key, surchargePercent }], aluminiumSurchargePercent }.
 * @param {number} params.widthMm
 * @param {number} params.heightMm
 * @param {object} params.options Selected add-ons: { woodKey, materialType, silentClose, cylinderLock, outerHandle, temperedGlass }.
 * @returns {{ status: 'ok', total: number, base: number, breakdown: Array<{key: string, amount: number, percent?: number, quantity?: number}> } | { status: 'unavailable' | 'noPricing' }}
 */
export const calculateHsPrice = ({ matrix, addonQuantities, settings, widthMm, heightMm, options }) => {
  if (!matrix) return { status: PRICE_STATUS.NO_PRICING };

  const baseResult = getBasePrice(matrix, widthMm, heightMm);
  if (baseResult.status !== PRICE_STATUS.OK) return baseResult;

  const base = baseResult.price;
  const breakdown = [{ key: 'base', amount: base }];

  const woodPercent =
    settings?.woodSpecies?.find((species) => species.key === options?.woodKey)?.surchargePercent ?? 0;
  const woodSurcharge = (base * woodPercent) / 100;
  if (woodSurcharge > 0) {
    breakdown.push({ key: 'wood', amount: woodSurcharge, percent: woodPercent });
  }

  // Wariant drewno-aluminium: dopłata procentowa od ceny bazowej, jak za gatunek
  const aluPercent = options?.materialType === 'woodAlu' ? (settings?.aluminiumSurchargePercent ?? 0) : 0;
  const aluSurcharge = (base * aluPercent) / 100;
  if (aluSurcharge > 0) {
    breakdown.push({ key: 'aluminium', amount: aluSurcharge, percent: aluPercent });
  }

  const fixedSurcharge = ['silentClose', 'cylinderLock', 'outerHandle'].reduce((sum, key) => {
    if (!options?.[key]) return sum;
    const unitPrice = settings?.fixed?.[key] ?? 0;
    const quantity = addonQuantities?.[key] ?? 1;
    const amount = unitPrice * quantity;
    if (amount > 0) {
      breakdown.push({ key, amount, quantity });
    }
    return sum + amount;
  }, 0);

  const glassSurcharge = options?.temperedGlass
    ? (settings?.temperedGlassPerM2 ?? 0) * (widthMm / 1000) * (heightMm / 1000)
    : 0;
  if (glassSurcharge > 0) {
    breakdown.push({ key: 'temperedGlass', amount: glassSurcharge });
  }

  const total = base + woodSurcharge + aluSurcharge + fixedSurcharge + glassSurcharge;

  // Round only the final value, to the nearest 10 PLN — the price is an estimate anyway.
  return { status: PRICE_STATUS.OK, total: Math.round(total / 10) * 10, base, breakdown };
};

const plnFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
});

export const formatPln = (value) => plnFormatter.format(value);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hasRealPrice = (price) => typeof price === 'number' && price > 0;

/**
 * Derive slider ranges from the pricing matrix — the price table is the source
 * of truth for available dimensions. Falls back to the hardcoded design ranges
 * only when there is no matrix or no band has a real price.
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
    matrix.rows.some((row) => hasRealPrice(row.prices?.[index]))
  );
  // Usable height rows, symmetrically: at least one real price in the row.
  const usableRows = matrix.rows.filter((row) => row.prices?.some(hasRealPrice));
  if (!usableBands.length || !usableRows.length) return fallback;

  const width = { min: usableBands[0].min, max: usableBands[usableBands.length - 1].max };
  const height = {
    min: usableRows[0].heightMin,
    max: usableRows[usableRows.length - 1].heightMax,
  };

  return {
    width: { ...width, default: clamp(hardWidthRange.default, width.min, width.max) },
    height: { ...height, default: clamp(hardHeightRange.default, height.min, height.max) },
  };
};
