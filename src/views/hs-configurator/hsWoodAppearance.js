// Skala wizualna referencyjnych zdjęć, w metrach na pełny wycinek tekstury.
// Gatunki mają różny rysunek i proporcje zdjęć (meranti: 1600 × 576).
// Parametry opisują drewno wykończone lakierem, nie surową deskę.
const WOOD_APPEARANCES = {
  pine: {
    grainScale: { along: 0.48, across: 0.24 },
    roughness: 0.4,
    bump: 0.0002,
    clearcoat: 0.16,
  },
  meranti: {
    grainScale: { along: 0.6, across: 0.216 },
    roughness: 0.48,
    bump: 0.00045,
    clearcoat: 0.1,
  },
  oak: {
    grainScale: { along: 0.68, across: 0.28, drift: 0.16 },
    roughness: 0.44,
    bump: 0.00055,
    clearcoat: 0.12,
  },
};

export const getWoodAppearance = (species) => WOOD_APPEARANCES[species] ?? WOOD_APPEARANCES.pine;

// Kolejne odcinki dębowego profilu próbkują inne pasmo zdjęcia. Niewielki
// skos włókien rozbija lustrzane powtórzenia; kierunek i siła są stałe dla
// konkretnej belki. Zapis w UV działa również na mobile i w eksporcie AR.
export const getWoodGrainDrift = (grainScale, seed) =>
  (grainScale.drift ?? 0) * (0.75 + seed * 0.5) * (seed < 0.5 ? -1 : 1);
