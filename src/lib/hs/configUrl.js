// Serializacja konfiguracji HS do parametrów URL (kod QR / udostępnianie).
// Format: ?s=d&w=3200&h=2200&mt=a&ac=7016&wc=er&hd=g&th=b&wd=oak&a=5&ar=1
// Krótkie kody opcji (`urlCode`) pochodzą z hsOptions.js — ścieżki plików
// nigdy nie trafiają do URL. Kolor drewna `wc` rozróżnia palety po formacie
// kodu (cyfry = RAL, litery = lazur). Parser waliduje każde pole osobno;
// błędna wartość nie psuje reszty, tylko wraca do wartości domyślnej.

import { deriveRanges } from '../pricing/hsPrice.js';
import {
  ADDON_OPTIONS,
  ALU_COLORS,
  DEFAULT_ALU_COLOR,
  DEFAULT_WOOD_COLOR,
  HANDLE_FINISHES,
  HEIGHT_RANGE,
  MATERIAL_TYPES,
  THRESHOLDS,
  TYPES,
  WOOD_LAZUR_COLORS,
  WOOD_RAL_COLORS,
  getDefaultWoodKey,
} from '../../views/hs-configurator/hsOptions.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Wymiar z URL: liczba całkowita zaokrąglona do kroku suwaka (10 mm),
// przycięta do zakresu wyliczonego dla schematu; nie-liczba → default
const parseDimension = (raw, range) => {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return range.default;
  return clamp(Math.round(value / 10) * 10, range.min, range.max);
};

const findByUrlCode = (options, code) => options.find((option) => option.urlCode === code) ?? null;

export const serializeHsConfig = (config) => {
  const params = new URLSearchParams();
  params.set('s', config.scheme);
  params.set('w', String(config.width));
  params.set('h', String(config.height));

  const materialType = MATERIAL_TYPES.find((item) => item.value === config.materialType);
  if (materialType) params.set('mt', materialType.urlCode);
  // Kolor nakładek ma sens tylko w wariancie drewno-alu
  if (config.materialType === 'woodAlu') {
    const aluColor = ALU_COLORS.find((item) => item.value === config.aluColor);
    if (aluColor) params.set('ac', aluColor.urlCode);
  }

  const woodPalette = config.woodColor?.palette === 'ral' ? WOOD_RAL_COLORS : WOOD_LAZUR_COLORS;
  const woodColor = woodPalette.find((item) => item.value === config.woodColor?.id);
  if (woodColor) params.set('wc', woodColor.urlCode);

  const handleFinish = HANDLE_FINISHES.find((item) => item.value === config.handleFinish);
  if (handleFinish) params.set('hd', handleFinish.urlCode);
  const threshold = THRESHOLDS.find((item) => item.value === config.threshold);
  if (threshold) params.set('th', threshold.urlCode);
  if (config.wood) params.set('wd', config.wood);

  const addonsMask = ADDON_OPTIONS.reduce(
    (mask, addon, index) => (config.addons?.[addon.key] ? mask | (1 << index) : mask),
    0
  );
  if (addonsMask) params.set('a', String(addonsMask));

  return params.toString();
};

export const parseHsConfig = (search, { pricing = null } = {}) => {
  const params = new URLSearchParams(search ?? '');
  if ([...params.keys()].length === 0) return null;

  // Najpierw schemat — od niego zależą zakresy wymiarów (jak w handleTypeChange)
  const typeData = TYPES.find((type) => type.value === params.get('s')) ?? TYPES[0];
  const ranges = deriveRanges(pricing?.schemes?.[typeData.value]?.matrix, typeData.widthRange, HEIGHT_RANGE);

  const woodSpecies = pricing?.settings?.woodSpecies ?? [];
  const requestedWood = params.get('wd');
  const wood = woodSpecies.some((species) => species.key === requestedWood)
    ? requestedWood
    : getDefaultWoodKey(woodSpecies);

  const addonsMask = Number.parseInt(params.get('a'), 10);
  const addons = ADDON_OPTIONS.reduce((acc, addon, index) => {
    acc[addon.key] = Number.isFinite(addonsMask) && Boolean(addonsMask & (1 << index));
    return acc;
  }, {});

  // Kolor drewna: kod szukany w obu paletach (formaty kodów się nie nakładają)
  const woodRal = findByUrlCode(WOOD_RAL_COLORS, params.get('wc'));
  const woodLazur = findByUrlCode(WOOD_LAZUR_COLORS, params.get('wc'));
  const woodColor = woodRal
    ? { palette: 'ral', id: woodRal.value }
    : woodLazur
      ? { palette: 'lazur', id: woodLazur.value }
      : { ...DEFAULT_WOOD_COLOR };

  return {
    scheme: typeData.value,
    width: parseDimension(params.get('w'), ranges.width),
    height: parseDimension(params.get('h'), ranges.height),
    materialType: (findByUrlCode(MATERIAL_TYPES, params.get('mt')) ?? MATERIAL_TYPES[0]).value,
    aluColor: (findByUrlCode(ALU_COLORS, params.get('ac')) ?? ALU_COLORS.find((color) => color.value === DEFAULT_ALU_COLOR)).value,
    woodColor,
    handleFinish: (findByUrlCode(HANDLE_FINISHES, params.get('hd')) ?? HANDLE_FINISHES[0]).value,
    threshold: (findByUrlCode(THRESHOLDS, params.get('th')) ?? THRESHOLDS[0]).value,
    wood,
    addons,
    ar: params.get('ar') === '1',
  };
};

// Pełny URL do QR — bieżący pathname zachowuje zlokalizowaną ścieżkę
// (/konfigurator-hs, /en/hs-configurator, …)
export const buildShareUrl = (config) => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}?${serializeHsConfig(config)}`;
};
