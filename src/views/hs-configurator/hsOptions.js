// Wspólne stałe konfiguratora HS — wyniesione z HsConfiguratorView, żeby
// serializacja konfiguracji do URL (lib/hs/configUrl.js) mogła walidować
// wartości bez importowania całego widoku. `urlCode` to krótki identyfikator
// opcji używany w parametrach URL (ścieżki plików nigdy nie trafiają do URL).

import { WINDOW_COLORS_PALETTE, WINDOW_LAZUR_PALETTE } from '../../data/products/windows.js';

// Paleta RAL współdzielona ze stroną produktową (jedno źródło prawdy:
// data/products/windows.js); nazwy lokalizowane w widoku przez
// getLocalizedWindowColorsPalette. Kod URL = sam numer RAL.
export const WOOD_RAL_COLORS = WINDOW_COLORS_PALETTE.map((color) => ({
  value: color.id,
  urlCode: color.id.replace('ral', ''),
  ral: color.ral,
  hex: color.color,
}));

// Lazury z wzornika PPG (źródło prawdy: WINDOW_LAZUR_PALETTE). Każde
// wybarwienie ma tekstury per gatunek drewna (kolumny wzornika SOSNA/MERANTI/
// DĄB ↔ klucze cenowe pine/meranti/oak), generowane przez
// scripts/build-lazur-textures.mjs. Kody URL literowe — nie kolidują z
// cyfrowymi kodami palety RAL
const LAZUR_URL_CODES = {
  'lazur-sosna': 'sn',
  'lazur-cyprys': 'cy',
  'lazur-stara-sosna': 'ss',
  'lazur-dab': 'db',
  'lazur-teak': 'tk',
  'lazur-kasztan': 'ka',
  'lazur-ciemny-dab': 'cd',
  'lazur-wisnia': 'wi',
  'lazur-orzech': 'or',
  'lazur-palisander': 'pa',
  'lazur-siena-noce': 'si',
  'lazur-brazowy-ciemny': 'bc',
  'lazur-biel-skandynawska': 'bs',
  'lazur-szary-jasny': 'sj',
  'lazur-grafit': 'gr',
  'lazur-antracyt': 'an',
  'lazur-mahon': 'ma',
  'lazur-zielen-maltanska': 'zm',
};

export const WOOD_LAZUR_COLORS = WINDOW_LAZUR_PALETTE.map((color) => {
  const key = color.id.replace('lazur-', '');
  return {
    value: color.id,
    urlCode: LAZUR_URL_CODES[color.id],
    name: color.name,
    labelKey: `hsConfigurator.options.lazury.${key}`,
    code: color.ral,
    textures: {
      default: `/models/lazur/${key}-pine.jpg`,
      pine: `/models/lazur/${key}-pine.jpg`,
      meranti: `/models/lazur/${key}-meranti.jpg`,
      oak: `/models/lazur/${key}-oak.jpg`,
    },
  };
});

export const DEFAULT_WOOD_COLOR = { palette: 'lazur', id: 'lazur-sosna' };

// Wybrany kolor drewna → parametry materiału modelu 3D. RAL to farba kryjąca
// (płaski kolor + relief słojów), lazur to mapa ze zdjęcia próbki; gatunek
// drewna może mieć własną teksturę lazuru (fallback: próbka wspólna)
export const resolveWoodFinish = ({ palette, id }, speciesKey) => {
  if (palette === 'ral') {
    const ral = WOOD_RAL_COLORS.find((color) => color.value === id) ?? WOOD_RAL_COLORS[0];
    return { type: 'ral', hex: ral.hex };
  }
  const lazur = WOOD_LAZUR_COLORS.find((color) => color.value === id) ?? WOOD_LAZUR_COLORS[0];
  return { type: 'lazur', texturePath: lazur.textures[speciesKey] ?? lazur.textures.default };
};

export const HANDLE_FINISHES = [
  { value: 'silver', urlCode: 's', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'Srebrna' },
  { value: 'gold', urlCode: 'g', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'Złota' },
];

// Wariant materiałowy stolarki: czyste drewno lub drewno z aluminiowymi
// nakładkami maskującymi od zewnątrz (system nakładkowy typu Aluron Gemini)
export const MATERIAL_TYPES = [
  { value: 'wood', urlCode: 'w', labelKey: 'hsConfigurator.options.materialTypes.wood', fallback: 'Drewno' },
  { value: 'woodAlu', urlCode: 'a', labelKey: 'hsConfigurator.options.materialTypes.woodAlu', fallback: 'Drewno-Aluminium' },
];

// Kolory nakładek aluminiowych (lakier proszkowy): pełna paleta RAL ze strony
// produktowej, bez lazurów; `hex` zasila materiał w modelu 3D
export const ALU_COLORS = WOOD_RAL_COLORS;
export const DEFAULT_ALU_COLOR = 'ral7016';

// Zakresy szerokości zależne od liczby pól schematu
const WIDTH_2_FIELDS = { min: 2000, max: 4000, default: 2320 };
const WIDTH_3_FIELDS = { min: 2500, max: 4500, default: 3000 };
const WIDTH_4_FIELDS = { min: 3000, max: 5000, default: 3750 };

export const TYPES = [
  {
    value: 'a',
    label: 'A',
    image: '/images/hs/schemat-A.png',
    labelKey: 'hsConfigurator.options.schemes.a.label',
    fallback: 'Schemat A',
    descriptionKey: 'hsConfigurator.options.schemes.a.description',
    descriptionFallback: 'Dwa pola z jednym skrzydłem przesuwnym.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'a3',
    label: 'A3',
    image: '/images/hs/schemat-A3.png',
    labelKey: 'hsConfigurator.options.schemes.a3.label',
    fallback: 'Schemat A3',
    descriptionKey: 'hsConfigurator.options.schemes.a3.description',
    descriptionFallback: 'Lustrzane A — skrzydło przesuwne z prawej strony.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'd',
    label: 'D',
    image: '/images/hs/schemat-D.png',
    labelKey: 'hsConfigurator.options.schemes.d.label',
    fallback: 'Schemat D',
    descriptionKey: 'hsConfigurator.options.schemes.d.description',
    descriptionFallback: 'Dwa pola, oba skrzydła przesuwne.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'e',
    label: 'E',
    image: '/images/hs/schemat-E.png',
    labelKey: 'hsConfigurator.options.schemes.e.label',
    fallback: 'Schemat E',
    descriptionKey: 'hsConfigurator.options.schemes.e.description',
    descriptionFallback: 'Trzy pola, dwa skrzydła przesuwne w jedną stronę.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'g2',
    label: 'G2',
    image: '/images/hs/schemat-G2.png',
    labelKey: 'hsConfigurator.options.schemes.g2.label',
    fallback: 'Schemat G2',
    descriptionKey: 'hsConfigurator.options.schemes.g2.description',
    descriptionFallback: 'Trzy pola, środkowe skrzydło przesuwne, słupki statyczne.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'g3',
    label: 'G3',
    image: '/images/hs/schemat-G3.png',
    labelKey: 'hsConfigurator.options.schemes.g3.label',
    fallback: 'Schemat G3',
    descriptionKey: 'hsConfigurator.options.schemes.g3.description',
    descriptionFallback: 'Trzy pola, środkowe skrzydło przesuwne, bez słupków statycznych.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'h',
    label: 'H',
    image: '/images/hs/schemat-H.png',
    labelKey: 'hsConfigurator.options.schemes.h.label',
    fallback: 'Schemat H',
    descriptionKey: 'hsConfigurator.options.schemes.h.description',
    descriptionFallback: 'Trzy pola, wszystkie skrzydła przesuwne.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'k',
    label: 'K',
    image: '/images/hs/schemat-K.png',
    labelKey: 'hsConfigurator.options.schemes.k.label',
    fallback: 'Schemat K',
    descriptionKey: 'hsConfigurator.options.schemes.k.description',
    descriptionFallback: 'Szerokie pole stałe pośrodku, skrzydła przesuwne po bokach.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'c',
    label: 'C',
    image: '/images/hs/schemat-C.png',
    labelKey: 'hsConfigurator.options.schemes.c.label',
    fallback: 'Schemat C',
    descriptionKey: 'hsConfigurator.options.schemes.c.description',
    descriptionFallback: 'Cztery pola z dwoma środkowymi skrzydłami przesuwnymi.',
    widthRange: WIDTH_4_FIELDS,
  },
  {
    value: 'f',
    label: 'F',
    image: '/images/hs/schemat-F.png',
    labelKey: 'hsConfigurator.options.schemes.f.label',
    fallback: 'Schemat F',
    descriptionKey: 'hsConfigurator.options.schemes.f.description',
    descriptionFallback: 'Cztery pola, wszystkie skrzydła przesuwne.',
    widthRange: WIDTH_4_FIELDS,
  },
];

export const THRESHOLDS = [
  { value: 'silver', urlCode: 's', labelKey: 'hsConfigurator.options.thresholds.silver', fallback: 'Srebrny' },
  { value: 'black', urlCode: 'b', labelKey: 'hsConfigurator.options.thresholds.black', fallback: 'Czarny' },
  { value: 'gold', urlCode: 'g', labelKey: 'hsConfigurator.options.thresholds.gold', fallback: 'Złoty' },
];

// Standardowa wysokość okna HS — domyślna i przywracana przy zmianie schematu
export const DEFAULT_HEIGHT = 2040;
export const HEIGHT_RANGE = { min: 2000, max: 3000, default: DEFAULT_HEIGHT };

// Kolejność wyznacza bity maski dodatków w URL (silentClose=1, cylinderLock=2, …)
export const ADDON_OPTIONS = [
  { key: 'silentClose', labelKey: 'hsConfigurator.addons.silentClose', fallback: 'SilentClose / StopUnit' },
  { key: 'cylinderLock', labelKey: 'hsConfigurator.addons.cylinderLock', fallback: 'Wkładka na klucz' },
  { key: 'outerHandle', labelKey: 'hsConfigurator.addons.outerHandle', fallback: 'Klamka zewnętrzna' },
  { key: 'temperedGlass', labelKey: 'hsConfigurator.addons.temperedGlass', fallback: 'Szyba hartowana' },
];

export const getDefaultWoodKey = (woodSpecies) => {
  if (!woodSpecies?.length) return 'pine';
  const baseSpecies = woodSpecies.find((species) => species.surchargePercent === 0) ?? woodSpecies[0];
  return baseSpecies.key;
};
