// Wspólne stałe konfiguratora HS — wyniesione z HsConfiguratorView, żeby
// serializacja konfiguracji do URL (lib/hs/configUrl.js) mogła walidować
// wartości bez importowania całego widoku. `urlCode` to krótki identyfikator
// opcji używany w parametrach URL (ścieżki plików nigdy nie trafiają do URL).

export const TEXTURES = [
  {
    value: '/models/remmers-natur.jpg',
    urlCode: 'n',
    labelKey: 'hsConfigurator.options.textures.natur',
    fallback: 'Natur',
  },
  {
    value: '/models/remmers-miodowa-sosna.jpg',
    urlCode: 'm',
    labelKey: 'hsConfigurator.options.textures.honeyPine',
    fallback: 'Miodowa Sosna',
  },
];

export const HANDLE_FINISHES = [
  { value: 'silver', urlCode: 's', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'Srebrna' },
  { value: 'gold', urlCode: 'g', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'Złota' },
];

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
