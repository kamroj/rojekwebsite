// Generuje zasoby kolorystyki lazurów z wzornika PPG Wood Finishes.
//
// Architektura "słoje × kolor": z wzornika powstaje
// 1) jedna CZYSTA mapa słojów per gatunek drewna (grain-{pine|meranti|oak}.jpg)
//    — z próbki o najlepiej czytelnym rysunku, znormalizowana do jasnej
//    szarości (średnia ~235); służy jako mapa koloru (tintowana) i reliefu;
// 2) tabela KOLORÓW zmierzonych z próbek (średnia RGB wycinka per wybarwienie
//    × gatunek, z kompensacją jasności mapy słojów) emitowana do modułu
//    src/data/products/lazurColors.generated.js. Składanie "słoje × kolor"
//    odbywa się na żywo: w 3D przez material.color × map, w UI przez
//    background-blend-mode: multiply — żadnych wypiekanych tekstur per kolor.
//
// Kompensacja 255/235 działa spójnie w obu przestrzeniach mnożenia (sRGB w
// CSS, liniowa w three.js), bo czyste skalowanie przechodzi przez gammę:
// (k·s)^γ = k^γ · s^γ.
//
// Wejście: wzornik-lazury/*.jpg (3 strony karty kolorów, 1024×1008; strony
// posortowane nazwą pliku odpowiadają kolejności wybarwień). Każda strona to
// 6 wierszy × 3 kolumny gatunków (SOSNA | MERANTI | DĄB); podpis pod środkową
// próbką należy do wiersza powyżej.
//
// Tryb kontrolny: `node scripts/build-lazur-textures.mjs --sheet` dodatkowo
// składa wycinki źródłowe w arkusz tmp-lazur-sheet.jpg do weryfikacji kadrów.

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'wzornik-lazury';
const OUT_DIR = 'public/models/lazur';

// Kolejność wybarwień wg wzornika (strony 1-3, po 6 wierszy)
const COLORS = [
  'sosna', 'cyprys', 'stara-sosna', 'dab', 'teak', 'kasztan',
  'ciemny-dab', 'wisnia', 'orzech', 'palisander', 'siena-noce', 'brazowy-ciemny',
  'biel-skandynawska', 'szary-jasny', 'grafit', 'antracyt', 'mahon', 'zielen-maltanska',
];

// Kolumny gatunków (x lewej krawędzi deski, szerokość) — wspólne dla stron
const COLUMNS = {
  pine: { x: 58, w: 275 },
  meranti: { x: 373, w: 274 },
  oak: { x: 688, w: 275 },
};

// Wiersze (y górnej krawędzi deski, wysokość) — wspólne dla stron i kolumn
const ROWS = [
  { y: 267, h: 85 },
  { y: 388, h: 84 },
  { y: 507, h: 85 },
  { y: 627, h: 85 },
  { y: 747, h: 85 },
  { y: 866, h: 85 },
];

// Wewnętrzny pas deski: odcina pas połysku flesza przy górnej krawędzi oraz
// marginesy; wartości to ułamki wymiarów próbki
const BAND = { top: 0.22, bottom: 0.1, left: 0.04, right: 0.04 };

// Źródło rysunku słojów per gatunek: jasna próbka z czytelnym usłojeniem
// (wiersz "Sosna G:1801" ma najlepszy kontrast rysunku przy małej kompresji)
const GRAIN_SOURCE_COLOR = 'sosna';

const QUALITY = {
  medianSize: 3, // odszumianie artefaktów JPG przed powiększeniem
  tiles: 3, // lustrzane sklejenie wzdłuż słojów — mniejsze rozciągnięcie na profilach
  outWidth: 2048,
  grainMean: 235, // docelowa średnia jasność mapy słojów (rysunek = ciemniejsze smugi)
  sharpenFine: { sigma: 1.2, m1: 0.8, m2: 2.5 },
  sharpenLocalContrast: { sigma: 8, m1: 0.6, m2: 0.6 },
  colorSaturation: 0.9, // delikatna desaturacja zmierzonych kolorów (feedback: "marchewkowa" sosna)
  jpegQuality: 88,
};

// Rozjazd struktury gatunków w mapie słojów: meranti — drobna plamka
// (mocniejsze odszumianie + mocniejszy lokalny kontrast, żeby cętka odróżniała
// się od pasm dębu), dąb — odszumienie przed upscalingiem i agresywniejsze
// drobne wyostrzenie (przeciw "mydlanym" smugom) + kierunkowe pasma
const SPECIES_TWEAKS = {
  pine: {},
  meranti: { extraMedian: 3, localContrastBoost: 1.3 },
  oak: {
    extraMedian: 3,
    fineSharpen: { sigma: 0.8, m1: 1.4, m2: 2.5 },
    extraSharpen: { sigma: 3.5, m1: 0.7, m2: 1.5 },
  },
};

// Korekty pojedynczych wybarwień: lazur Sosna ciągnie w agresywny oranż —
// dodatkowa desaturacja do tonu miodowego
const COLOR_TWEAKS = {
  sosna: { saturation: 0.93 },
};

const makeSheet = process.argv.includes('--sheet');

const files = (await readdir(SRC_DIR)).filter((file) => /\.jpe?g$/i.test(file)).sort();
if (files.length !== 3) {
  console.error(`Oczekiwano 3 stron wzornika w ${SRC_DIR}/, znaleziono: ${files.length}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

// ---------- Etap 1: wycinki źródłowe + zmierzone kolory ----------
const crops = new Map(); // `${color}|${species}` → buffer (odszumiony wycinek)
const sheetTiles = [];
let colorIndex = 0;

for (const file of files) {
  const pageBuffer = await sharp(path.join(SRC_DIR, file)).toBuffer();
  for (const row of ROWS) {
    const color = COLORS[colorIndex];
    colorIndex += 1;
    for (const [species, column] of Object.entries(COLUMNS)) {
      const left = Math.round(column.x + column.w * BAND.left);
      const width = Math.round(column.w * (1 - BAND.left - BAND.right));
      const top = Math.round(row.y + row.h * BAND.top);
      const height = Math.round(row.h * (1 - BAND.top - BAND.bottom));

      const cleanCrop = await sharp(pageBuffer)
        .extract({ left, top, width, height })
        .median(QUALITY.medianSize)
        .png()
        .toBuffer();
      crops.set(`${color}|${species}`, { buffer: cleanCrop, width, height });

      if (makeSheet) {
        sheetTiles.push({ color, species, buffer: await sharp(cleanCrop).resize({ width: 220 }).png().toBuffer() });
      }
    }
  }
}

// ---------- Etap 2: mapy słojów per gatunek ----------
const mirrorTile = async (buffer, width, height) => {
  const flipped = await sharp(buffer).flop().png().toBuffer();
  return sharp({ create: { width: width * QUALITY.tiles, height, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite(
      Array.from({ length: QUALITY.tiles }, (_, i) => ({
        input: i % 2 === 0 ? buffer : flipped,
        left: i * width,
        top: 0,
      }))
    )
    .png()
    .toBuffer();
};

const grains = {}; // species → { buffer, width, height } (finalna mapa słojów)
for (const species of Object.keys(COLUMNS)) {
  const tweak = SPECIES_TWEAKS[species] ?? {};
  const source = crops.get(`${GRAIN_SOURCE_COLOR}|${species}`);

  let grainBase = sharp(source.buffer).grayscale();
  if (tweak.extraMedian) grainBase = grainBase.median(tweak.extraMedian);
  const grainCrop = await grainBase.png().toBuffer();

  const tiled = await mirrorTile(grainCrop, source.width, source.height);
  const boost = tweak.localContrastBoost ?? 1;
  let pipeline = sharp(tiled)
    .resize({ width: QUALITY.outWidth, kernel: 'lanczos3' })
    .sharpen(tweak.fineSharpen ?? QUALITY.sharpenFine)
    .sharpen({
      sigma: QUALITY.sharpenLocalContrast.sigma,
      m1: QUALITY.sharpenLocalContrast.m1 * boost,
      m2: QUALITY.sharpenLocalContrast.m2 * boost,
    });
  if (tweak.extraSharpen) pipeline = pipeline.sharpen(tweak.extraSharpen);
  const contrasted = await pipeline.png().toBuffer();

  // Normalizacja: średnia jasność → grainMean (rysunek słojów jako ciemniejsze
  // smugi na jasnym tle; mnożenie kolorem prawie nie zmienia średniej barwy)
  const { channels } = await sharp(contrasted).stats();
  const mean = channels[0].mean;
  const normalized = await sharp(contrasted)
    .linear(QUALITY.grainMean / mean, 0)
    .png()
    .toBuffer();

  const meta = await sharp(normalized).metadata();
  grains[species] = { buffer: normalized, width: meta.width, height: meta.height };
  await sharp(normalized)
    .jpeg({ quality: QUALITY.jpegQuality })
    .toFile(path.join(OUT_DIR, `grain-${species}.jpg`));
}

// ---------- Etap 3: tabela kolorów zmierzonych z próbek ----------
const clamp255 = (value) => Math.min(Math.round(value), 255);

// Delikatna desaturacja względem luminancji (kolory z aparatu są przesycone)
const desaturate = ({ r, g, b }, factor) => {
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return {
    r: clamp255(luma + (r - luma) * factor),
    g: clamp255(luma + (g - luma) * factor),
    b: clamp255(luma + (b - luma) * factor),
  };
};

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;

const lazurColors = {};
for (const color of COLORS) {
  lazurColors[`lazur-${color}`] = {};
  for (const species of Object.keys(COLUMNS)) {
    const crop = crops.get(`${color}|${species}`);
    const { channels } = await sharp(crop.buffer).stats();
    // Kompensacja jasności mapy słojów (średnia grainMean zamiast bieli), żeby
    // kolor po przemnożeniu przez mapę odpowiadał średniej z próbki wzornika
    const lift = 255 / QUALITY.grainMean;
    const saturation = QUALITY.colorSaturation * (COLOR_TWEAKS[color]?.saturation ?? 1);
    const sampled = desaturate(
      { r: channels[0].mean * lift, g: channels[1].mean * lift, b: channels[2].mean * lift },
      saturation
    );
    lazurColors[`lazur-${color}`][species] = toHex(sampled);
  }
}

const generated = `// Plik generowany przez scripts/build-lazur-textures.mjs — NIE edytować ręcznie.
// Kolory lazurów zmierzone z wzornika PPG, per wybarwienie × gatunek drewna,
// skompensowane pod mnożenie przez mapy słojów /models/lazur/grain-*.jpg.
export const LAZUR_COLORS = ${JSON.stringify(lazurColors, null, 2)};
`;
await writeFile('src/data/products/lazurColors.generated.js', generated);

console.log(`Zapisano 3 mapy słojów do ${OUT_DIR}/ i ${COLORS.length * 3} kolorów do src/data/products/lazurColors.generated.js`);

if (makeSheet) {
  const tileW = 220;
  const tileH = Math.round(
    (ROWS[0].h * (1 - BAND.top - BAND.bottom) * tileW) / (COLUMNS.pine.w * (1 - BAND.left - BAND.right))
  );
  const gap = 6;
  const cols = ['pine', 'meranti', 'oak'];
  const sheetW = cols.length * (tileW + gap) + gap;
  const sheetH = COLORS.length * (tileH + gap) + gap;
  const composites = sheetTiles.map((tile) => ({
    input: tile.buffer,
    left: gap + cols.indexOf(tile.species) * (tileW + gap),
    top: gap + COLORS.indexOf(tile.color) * (tileH + gap),
  }));
  const sheet = await sharp({
    create: { width: sheetW, height: sheetH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toBuffer();
  await writeFile('tmp-lazur-sheet.jpg', sheet);
  console.log('Arkusz kontrolny: tmp-lazur-sheet.jpg');
}
