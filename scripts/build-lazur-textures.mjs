// Generuje tekstury lazurów dla konfiguratora HS z wzornika PPG Wood Finishes.
//
// Wejście: wzornik-lazury/*.jpg (3 strony karty kolorów, 1024×1008; strony
// posortowane nazwą pliku odpowiadają kolejności wybarwień). Każda strona to
// 6 wierszy × 3 kolumny gatunków (SOSNA | MERANTI | DĄB); podpis pod środkową
// próbką należy do wiersza powyżej.
//
// Z każdej próbki wycinany jest wewnętrzny pas deski (z pominięciem pasa
// odblasku flesza przy górnej krawędzi i marginesów), skalowany ×3 (lanczos)
// i lekko wyostrzany → public/models/lazur/{kolor}-{pine|meranti|oak}.jpg.
//
// Tryb kontrolny: `node scripts/build-lazur-textures.mjs --sheet` dodatkowo
// składa wszystkie wycinki w arkusz kontrolny tmp-lazur-sheet.jpg (kolumny =
// gatunki, wiersze = wybarwienia) do wzrokowej weryfikacji kadrów.

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

// Parametry podbicia jakości (źródła to mocno skompresowane JPG ~250×60 px):
// odszumianie usuwa artefakty kompresji zanim powiększenie je wzmocni;
// lustrzane sklejenie ×3 wydłuża słoje, żeby tekstura nie rozciągała się tak
// mocno na długich profilach; po powiększeniu drobne wyostrzenie odzyskuje
// krawędzie słojów, a drugi przebieg z dużą sigmą działa jak lokalny kontrast
// (przywraca rysunek drewna zjedzony przez kompresję i upscale, m.in.
// chropowatość meranti). Saturacja lekko w dół — kumuluje się przy skalowaniu
const QUALITY = {
  medianSize: 3,
  tiles: 3,
  outWidth: 2048,
  sharpenFine: { sigma: 1.2, m1: 0.8, m2: 2.5 },
  sharpenLocalContrast: { sigma: 8, m1: 0.5, m2: 0.5 },
  saturation: 0.9,
  jpegQuality: 88,
};

// Adaptacyjna korekcja tonalna wg średniej jasności próbki. Bardzo ciemne
// lazury (antracyt, palisander…) dostają lift cieni wycelowany w średnią
// ~60 (inaczej w renderze, po przemnożeniu przez oświetlenie, słoje spadają
// poniżej progu percepcji) oraz mocniejszy lokalny kontrast (boost); lift
// MUSI iść przed wyostrzaniem, żeby kontrast nie wzmacniał czerni
const toneFor = (meanLuma) => {
  if (meanLuma < 50) {
    return { a: 1.1, b: Math.min(Math.max(60 - 1.1 * meanLuma, 0), 35), contrastBoost: 1.5 };
  }
  if (meanLuma < 70) return { a: 1, b: 10, contrastBoost: 1.25 };
  if (meanLuma < 170) return { a: 1.04, b: -5, contrastBoost: 1 };
  return { a: 1, b: 0, contrastBoost: 1 };
};

// Rozjazd gatunków: meranti dostaje dodatkowe odszumienie (zostaje sama
// plamista mozaika, bez szumu JPG) i lekki skręt w czerwień; dąb — dodatkowe
// kierunkowe wyostrzenie wydobywające dłuższe pasma słojów
const SPECIES_TWEAKS = {
  pine: {},
  meranti: { extraMedian: 3, hue: 4 },
  oak: { extraSharpen: { sigma: 3.5, m1: 0.7, m2: 1.5 } },
};

// Korekty pojedynczych wybarwień: lazur Sosna ze wzornika jest „marchewkowy" —
// zdejmujemy nasycenie do miodu
const COLOR_TWEAKS = {
  sosna: { saturation: 0.88, lightness: 1.03 },
};

const makeSheet = process.argv.includes('--sheet');

const files = (await readdir(SRC_DIR)).filter((file) => /\.jpe?g$/i.test(file)).sort();
if (files.length !== 3) {
  console.error(`Oczekiwano 3 stron wzornika w ${SRC_DIR}/, znaleziono: ${files.length}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const sheetTiles = [];
let colorIndex = 0;

for (const file of files) {
  const page = sharp(path.join(SRC_DIR, file));
  const pageBuffer = await page.toBuffer();

  for (const row of ROWS) {
    const color = COLORS[colorIndex];
    colorIndex += 1;
    for (const [species, column] of Object.entries(COLUMNS)) {
      const left = Math.round(column.x + column.w * BAND.left);
      const width = Math.round(column.w * (1 - BAND.left - BAND.right));
      const top = Math.round(row.y + row.h * BAND.top);
      const height = Math.round(row.h * (1 - BAND.top - BAND.bottom));

      // 1. Wycinek + odszumienie artefaktów JPG (meranti: drugi przebieg,
      // żeby z plamistej struktury zdjąć resztki blockingu)
      const speciesTweak = SPECIES_TWEAKS[species] ?? {};
      let cleanPipeline = sharp(pageBuffer).extract({ left, top, width, height }).median(QUALITY.medianSize);
      if (speciesTweak.extraMedian) cleanPipeline = cleanPipeline.median(speciesTweak.extraMedian);
      const cleanCrop = await cleanPipeline.png().toBuffer();

      // 2. Lustrzane sklejenie w poziomie (wzdłuż słojów) — szwy lustrzane są
      // mniej widoczne niż twarde cięcia, a tekstura zyskuje długość
      const flipped = await sharp(cleanCrop).flop().png().toBuffer();
      const tiledWidth = width * QUALITY.tiles;
      const tiled = await sharp({
        create: { width: tiledWidth, height, channels: 3, background: { r: 0, g: 0, b: 0 } },
      })
        .composite(
          Array.from({ length: QUALITY.tiles }, (_, i) => ({
            input: i % 2 === 0 ? cleanCrop : flipped,
            left: i * width,
            top: 0,
          }))
        )
        .png()
        .toBuffer();

      // 3. Powiększenie + przywrócenie rysunku słojów: najpierw adaptacyjny
      // lift tonalny, potem wyostrzanie (drobne + lokalny kontrast z boostem
      // dla ciemnych), korekty per gatunek/wybarwienie, desaturacja
      const { channels } = await sharp(cleanCrop).stats();
      const meanLuma = 0.299 * channels[0].mean + 0.587 * channels[1].mean + 0.114 * channels[2].mean;
      const tone = toneFor(meanLuma);
      const colorTweak = COLOR_TWEAKS[color] ?? {};

      let pipeline = sharp(tiled)
        .resize({ width: QUALITY.outWidth, kernel: 'lanczos3' })
        .linear(tone.a, tone.b)
        .sharpen(QUALITY.sharpenFine)
        .sharpen({
          sigma: QUALITY.sharpenLocalContrast.sigma,
          m1: QUALITY.sharpenLocalContrast.m1 * tone.contrastBoost,
          m2: QUALITY.sharpenLocalContrast.m2 * tone.contrastBoost,
        });
      if (speciesTweak.extraSharpen) pipeline = pipeline.sharpen(speciesTweak.extraSharpen);
      const out = path.join(OUT_DIR, `${color}-${species}.jpg`);
      await pipeline
        .modulate({
          saturation: QUALITY.saturation * (colorTweak.saturation ?? 1),
          lightness: colorTweak.lightness ?? 1,
          hue: speciesTweak.hue ?? 0,
        })
        .jpeg({ quality: QUALITY.jpegQuality })
        .toFile(out);

      if (makeSheet) {
        sheetTiles.push({
          color,
          species,
          buffer: await sharp(cleanCrop).resize({ width: 220 }).png().toBuffer(),
        });
      }
    }
  }
}

console.log(`Zapisano ${colorIndex * 3} tekstur do ${OUT_DIR}/`);

if (makeSheet) {
  // Arkusz: 3 kolumny (pine/meranti/oak) × 18 wierszy
  const tileW = 220;
  const tileH = Math.round((ROWS[0].h * (1 - BAND.top - BAND.bottom) * tileW) / (COLUMNS.pine.w * (1 - BAND.left - BAND.right)));
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
