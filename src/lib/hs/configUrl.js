// Serializacja konfiguracji HS do parametrów URL (kod QR / udostępnianie).
// Format: ?s=d&w=3200&h=2200&p=100&mt=a&ac=7016&wc=l5&hd=g&th=b&wd=oak&mr=1&as=r&a=5&ar=1
// Krótkie kody opcji (`urlCode`) pochodzą z hsOptions.js — ścieżki plików
// nigdy nie trafiają do URL. Kolor drewna `wc`: RAL = kod cyfrowy (numer RAL),
// lazur = `l` + numer wybarwienia w palecie (paletę rozstrzyga wariant `mt`,
// bo wood i woodAlu mają różne wzorniki lazurów). `mr` = odbicie lustrzane
// (tylko schematy mirrorable), `as` = aktywne skrzydło (tylko C/F). Parser
// waliduje każde pole osobno; błędna wartość nie psuje reszty, tylko wraca do
// wartości domyślnej.

import { deriveRanges } from '../pricing/hsPrice.js';
import {
  ACTIVE_SASH_OPTIONS,
  ADDON_OPTIONS,
  ALU_COLORS,
  DEFAULT_ACTIVE_SASH,
  DEFAULT_ALU_COLOR,
  DEFAULT_WOOD_COLOR,
  HANDLE_FINISHES,
  HEIGHT_RANGE,
  MATERIAL_TYPES,
  PLINTH_RANGE,
  THRESHOLDS,
  TYPES,
  WOOD_RAL_COLORS,
  getDefaultWoodKey,
  getLazurPalette,
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
  // Podwalina (mm) — zawsze obecna w modelu, więc zawsze w URL
  if (Number.isFinite(config.plinth)) params.set('p', String(config.plinth));

  // Odbicie lustrzane i aktywne skrzydło tylko tam, gdzie schemat je obsługuje
  const schemeData = TYPES.find((type) => type.value === config.scheme);
  if (schemeData?.mirrorable && config.mirrored) params.set('mr', '1');
  if (schemeData?.activeSashChoice) {
    const activeSash = ACTIVE_SASH_OPTIONS.find((item) => item.value === config.activeSash);
    if (activeSash) params.set('as', activeSash.urlCode);
  }

  const materialType = MATERIAL_TYPES.find((item) => item.value === config.materialType);
  if (materialType) params.set('mt', materialType.urlCode);
  // Kolor nakładek ma sens tylko w wariancie drewno-alu
  if (config.materialType === 'woodAlu') {
    const aluColor = ALU_COLORS.find((item) => item.value === config.aluColor);
    if (aluColor) params.set('ac', aluColor.urlCode);
  }

  // Kolor drewna: RAL → kod cyfrowy; lazur → `l` + numer w palecie wariantu
  if (config.woodColor?.palette === 'ral') {
    const ral = WOOD_RAL_COLORS.find((item) => item.value === config.woodColor.id);
    if (ral) params.set('wc', ral.urlCode);
  } else {
    const lazur = getLazurPalette(config.materialType).find((item) => item.value === config.woodColor?.id);
    if (lazur) params.set('wc', `l${lazur.number}`);
  }

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

  // Najpierw schemat — od niego zależą zakresy wymiarów (jak w handleTypeChange).
  // Wycofany schemat A3 (lustrzane A) mapujemy na A z włączonym odbiciem,
  // żeby stare linki / kody QR nadal odtwarzały ten sam układ.
  const rawScheme = params.get('s');
  const isLegacyA3 = rawScheme === 'a3';
  const typeData = TYPES.find((type) => type.value === rawScheme) ?? TYPES[0];
  const ranges = deriveRanges(pricing?.schemes?.[typeData.value]?.matrix, typeData.widthRange, HEIGHT_RANGE);
  const mirrored = Boolean(typeData.mirrorable) && (params.get('mr') === '1' || (isLegacyA3 && typeData.value === 'a'));
  const activeSash = typeData.activeSashChoice
    ? (findByUrlCode(ACTIVE_SASH_OPTIONS, params.get('as')) ?? ACTIVE_SASH_OPTIONS[0]).value
    : DEFAULT_ACTIVE_SASH;

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

  const materialType = (findByUrlCode(MATERIAL_TYPES, params.get('mt')) ?? MATERIAL_TYPES[0]).value;

  // Kolor drewna: `l<numer>` → lazur z palety wariantu; inaczej kod RAL; fallback default
  const wcRaw = params.get('wc');
  const lazurMatch = /^l(\d+)$/.exec(wcRaw ?? '');
  let woodColor;
  if (lazurMatch) {
    const lazur = getLazurPalette(materialType).find((item) => item.number === Number(lazurMatch[1]));
    woodColor = lazur ? { palette: 'lazur', id: lazur.value } : { ...DEFAULT_WOOD_COLOR };
  } else {
    const woodRal = findByUrlCode(WOOD_RAL_COLORS, wcRaw);
    woodColor = woodRal ? { palette: 'ral', id: woodRal.value } : { ...DEFAULT_WOOD_COLOR };
  }

  return {
    scheme: typeData.value,
    mirrored,
    activeSash,
    width: parseDimension(params.get('w'), ranges.width),
    height: parseDimension(params.get('h'), ranges.height),
    plinth: parseDimension(params.get('p'), PLINTH_RANGE),
    materialType,
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
