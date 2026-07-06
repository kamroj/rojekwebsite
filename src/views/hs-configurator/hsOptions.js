// Wspólne stałe konfiguratora HS — wyniesione z HsConfiguratorView, żeby
// serializacja konfiguracji do URL (lib/hs/configUrl.js) mogła walidować
// wartości bez importowania całego widoku. `urlCode` to krótki identyfikator
// opcji używany w parametrach URL (ścieżki plików nigdy nie trafiają do URL).

import {
  WINDOW_COLORS_PALETTE,
  WINDOW_LAZUR_PALETTE_DREWNO,
  WINDOW_LAZUR_PALETTE_DREWNO_ALU,
} from '../../data/products/windows.js';

// Paleta RAL współdzielona ze stroną produktową (jedno źródło prawdy:
// data/products/windows.js); nazwy lokalizowane w widoku przez
// getLocalizedWindowColorsPalette. Kod URL = sam numer RAL.
export const WOOD_RAL_COLORS = WINDOW_COLORS_PALETTE.map((color) => ({
  value: color.id,
  urlCode: color.id.replace('ral', ''),
  ral: color.ral,
  hex: color.color,
}));

// Lazury z dwóch wzorników (drewno / drewno-aluminium). Wybór koloru drewna
// pokazuje paletę zależną od wariantu materiału. Składanie "słoje × kolor"
// (mapa słojów gatunku × zmierzony hex) odbywa się na żywo w UI i w 3D.
const toLazurOption = (color) => ({
  value: color.id,
  number: color.number,
  name: color.name,
  nameOrig: color.nameOrig,
  hex: color.hex,
  grainImages: color.grainImages,
});

export const WOOD_LAZUR_PALETTES = {
  wood: WINDOW_LAZUR_PALETTE_DREWNO.map(toLazurOption),
  woodAlu: WINDOW_LAZUR_PALETTE_DREWNO_ALU.map(toLazurOption),
};

// Paleta lazurów aktywna dla danego wariantu materiału
export const getLazurPalette = (materialType) =>
  materialType === 'woodAlu' ? WOOD_LAZUR_PALETTES.woodAlu : WOOD_LAZUR_PALETTES.wood;

export const DEFAULT_WOOD_COLOR = { palette: 'lazur', id: WOOD_LAZUR_PALETTES.wood[0].value };

// Czysta mapa słojów gatunku (grayscale) — wspólna dla wszystkich wybarwień,
// służy jako mapa reliefu (bump) niezależna od jasności koloru
const grainForSpecies = (speciesKey) =>
  `/models/lazur/grain-${['pine', 'meranti', 'oak'].includes(speciesKey) ? speciesKey : 'pine'}.jpg`;

// Luminancja (sRGB approx) — ciemne wybarwienia dostają mocniejszy relief w 3D,
// bo ciemny kolor sam nie niesie rysunku słojów
const hexLuminance = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
};

// Wybrany kolor drewna → parametry materiału modelu 3D. RAL to farba kryjąca
// (płaski kolor + relief słojów gatunku), lazur to tint mapy słojów gatunku
// zmierzonym kolorem (material.color × map) + ta sama mapa jako relief. Paleta
// lazurów zależy od wariantu materiału (drewno / drewno-aluminium).
export const resolveWoodFinish = ({ palette, id }, speciesKey, materialType = 'wood') => {
  const species = ['pine', 'meranti', 'oak'].includes(speciesKey) ? speciesKey : 'pine';
  const grainPath = grainForSpecies(species);
  if (palette === 'ral') {
    const ral = WOOD_RAL_COLORS.find((color) => color.value === id) ?? WOOD_RAL_COLORS[0];
    return { type: 'ral', hex: ral.hex, grainPath, species };
  }
  const lazurPalette = getLazurPalette(materialType);
  const lazur = lazurPalette.find((color) => color.value === id) ?? lazurPalette[0];
  return { type: 'lazur', hex: lazur.hex, grainPath, species, dark: hexLuminance(lazur.hex) < 80 };
};

// Kolory klamek wg oferty okuć: anodowane F1/F4, lakierowane (biały, czarny,
// antracyt) i stal nierdzewna. Wartości `silver`/`gold` zostają dla zgodności
// ze starymi URL-ami (kody `s`/`g`)
export const HANDLE_FINISHES = [
  { value: 'silver', urlCode: 's', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'F1 srebrny' },
  { value: 'gold', urlCode: 'g', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'F4 stare złoto' },
  { value: 'white', urlCode: 'w', labelKey: 'hsConfigurator.options.handleTextures.white', fallback: 'Biały' },
  { value: 'black', urlCode: 'b', labelKey: 'hsConfigurator.options.handleTextures.black', fallback: 'Czarny' },
  { value: 'anthracite', urlCode: 'a', labelKey: 'hsConfigurator.options.handleTextures.anthracite', fallback: 'Antracyt' },
  { value: 'inox', urlCode: 'i', labelKey: 'hsConfigurator.options.handleTextures.inox', fallback: 'Inox' },
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
];

// Standardowa wysokość okna HS — domyślna i przywracana przy zmianie schematu
export const DEFAULT_HEIGHT = 2040;
export const HEIGHT_RANGE = { min: 2000, max: 3000, default: DEFAULT_HEIGHT };

// Podwalina — belka montażowa pod progiem (mm); wysokość konfigurowalna suwakiem
export const PLINTH_RANGE = { min: 50, max: 150, default: 100 };

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
