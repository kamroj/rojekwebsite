// Mierzy kolory dwóch palet lazurów z fizycznych wzorników (zdjęcia w
// wzornik-lazury/) i emituje tabelę hexów do src/data/products/lazurColors.generated.js.
//
// Architektura "słoje × kolor": wygląd próbki powstaje na żywo z mapy słojów
// gatunku (public/models/lazur/grain-{pine|meranti|oak}.jpg — zasoby STATYCZNE,
// NIE generowane tutaj, decyzja: usłojenie zostaje) tintowanej kolorem
// zmierzonym z wzornika: w 3D przez material.color × map, w UI przez
// background-blend-mode: multiply.
//
// Dwie palety (każda 20 kolorów) — wood-only HS używa palety "drewno",
// wood-aluminium HS palety "drewnoAlu" (lekko inne wybarwienia drewna):
//   - drewno-kolor.jpg / drewno-nazewnictwo.jpg
//   - drewno-alu-kolor.jpg / drewno-alu-nazewnictwo.jpg
// "kolor" = lica próbek (źródło barwy), "nazewnictwo" = tylne lica z numerem i
// nazwą (źródło mapowania numer→nazwa; tylne lica są mniej wybarwione, więc
// koloru z nich NIE bierzemy). Mapowanie numer→pozycja-na-zdjęciu (idx w
// kolejności czytania) ustalone i zweryfikowane wzrokowo na kotwicach
// (RAL 9016=biały, RAL 7016=antracyt, Olive Green=zielony, Indigo=granat…).
//
// Kompensacja jasności mapy słojów (255/GRAIN_MEAN) działa spójnie w sRGB (CSS)
// i przestrzeni liniowej (three.js), bo skalowanie przechodzi przez gammę:
// (k·s)^γ = k^γ · s^γ. Tryb `--sheet` zapisuje arkusze kontrolne wycinków.

import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SRC_DIR = 'wzornik-lazury';
const GRAIN_MEAN = 235; // średnia jasność statycznych map słojów grain-*.jpg

// Siatki lic próbek (środki + box cropu) — skalibrowane wzrokowo (overlay).
function centers(colsX, rowsY) {
  const out = [];
  for (const y of rowsY) for (const x of colsX) out.push({ x, y });
  return out;
}

// Definicje palet. `byNumber` to nazwy 1..20 (kolejność z wzornika). `idxOf`
// mapuje numer wybarwienia → indeks próbki w kolejności czytania zdjęcia kolor.
const PALETTES = [
  {
    key: 'drewno',
    file: 'drewno-kolor.jpg',
    cells: centers([312, 720, 1320, 1716], [294, 524, 756, 986, 1226]),
    cw: 200,
    ch: 110,
    // numer → nazwa (oryginalna z wzornika)
    names: [
      'Pine', 'Old Pine', 'Teak', 'Bilinga', 'Light Oak', 'Walnut', 'Dark Oak', 'Douka',
      'Mahagoni', 'Braun', 'Sandbraun', 'Palisander', 'Rich Mahagoni', 'Ipe', 'Erdbraun',
      'Nuttree', 'Olive Green', 'Rojwin', 'RAL 7016', 'RAL 9016',
    ],
    slugs: [
      'pine', 'old-pine', 'teak', 'bilinga', 'light-oak', 'walnut', 'dark-oak', 'douka',
      'mahagoni', 'braun', 'sandbraun', 'palisander', 'rich-mahagoni', 'ipe', 'erdbraun',
      'nuttree', 'olive-green', 'rojwin', 'ral-7016', 'ral-9016',
    ],
    // numer(1-based) → idx w kolejności czytania (4 kol × 5 rz: lewa strona kol0/1, prawa kol2/3)
    idxOf: [19, 15, 11, 7, 3, 18, 14, 10, 6, 2, 17, 13, 9, 5, 1, 16, 12, 8, 4, 0],
  },
  {
    key: 'drewnoAlu',
    file: 'drewno-alu-kolor.jpg',
    cells: centers([225, 475, 725, 978, 1225], [290, 655, 1395, 1755]),
    cw: 120,
    ch: 95,
    names: [
      'Cream', 'Ivory', 'Oyster', 'Mineral Grey', 'Concrete Grey', 'Pure Taupe', 'Straw',
      'Vanilla', 'Savanna', 'Ginger', 'Gold Satin', 'Ochre', 'Natural Wool', 'Khaki',
      'Sandstone', 'Graphite', 'Chestnut', 'Sepia', 'Charcoal', 'Indigo',
    ],
    slugs: [
      'cream', 'ivory', 'oyster', 'mineral-grey', 'concrete-grey', 'pure-taupe', 'straw',
      'vanilla', 'savanna', 'ginger', 'gold-satin', 'ochre', 'natural-wool', 'khaki',
      'sandstone', 'graphite', 'chestnut', 'sepia', 'charcoal', 'indigo',
    ],
    // 2 rz × 5 kol na stronę, dwie strony (góra/dół) w kolejności czytania.
    // Uwaga: próbki 13 (Natural Wool) i 14 (Khaki) leżą we wzorniku w zamienionych
    // gniazdach (kolejność w rzędzie: 15, 13, 14, 12, 11) — stąd idx 11 i 12 nie
    // malejąco; zweryfikowane etykietami na tylnych licach.
    idxOf: [4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 14, 13, 11, 12, 10, 19, 18, 17, 16, 15],
  },
];

const makeSheet = process.argv.includes('--sheet');
const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));
const lift = (mean) => clamp(mean * (255 / GRAIN_MEAN)); // kompensacja mnożenia przez mapę słojów
const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

const generated = {};

for (const pal of PALETTES) {
  const src = await sharp(`${SRC_DIR}/${pal.file}`).toBuffer();
  // Zmierz średni kolor każdej próbki w kolejności czytania
  const measured = [];
  for (const { x, y } of pal.cells) {
    const crop = await sharp(src)
      .extract({ left: Math.round(x - pal.cw / 2), top: Math.round(y - pal.ch / 2), width: pal.cw, height: pal.ch })
      .toBuffer();
    const { channels } = await sharp(crop).stats();
    measured.push([channels[0].mean, channels[1].mean, channels[2].mean]);
  }

  const colors = {};
  const sheetTiles = [];
  for (let n = 0; n < 20; n++) {
    const idx = pal.idxOf[n];
    const id = `${pal.key === 'drewno' ? 'drewno' : 'alu'}-${pal.slugs[n]}`;
    const hex = toHex(measured[idx].map(lift));
    colors[id] = hex;

    if (makeSheet) {
      const tile = await sharp({ create: { width: 220, height: 96, channels: 3, background: hex } })
        .composite([
          {
            input: Buffer.from(
              `<svg width="220" height="96"><rect x="0" y="64" width="220" height="32" fill="white"/><text x="5" y="86" font-size="15" font-family="monospace">${n + 1} ${pal.names[n]} ${hex}</text></svg>`
            ),
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();
      sheetTiles.push(tile);
    }
  }
  generated[pal.key] = colors;

  if (makeSheet) {
    const perRow = 4;
    const rows = Math.ceil(sheetTiles.length / perRow);
    const sheet = await sharp({ create: { width: perRow * 226 + 6, height: rows * 102 + 6, channels: 3, background: '#ccc' } })
      .composite(sheetTiles.map((t, i) => ({ input: t, left: 6 + (i % perRow) * 226, top: 6 + Math.floor(i / perRow) * 102 })))
      .jpeg({ quality: 92 })
      .toBuffer();
    await writeFile(`tmp-proof-${pal.key}.jpg`, sheet);
  }
}

const banner = `// Plik generowany przez scripts/build-lazur-textures.mjs — NIE edytować ręcznie.
// Kolory dwóch palet lazurów zmierzone z fizycznych wzorników (wzornik-lazury/),
// skompensowane pod mnożenie przez mapy słojów public/models/lazur/grain-*.jpg.
// Klucz = id koloru, wartość = hex (sRGB).\n`;
await writeFile(
  'src/data/products/lazurColors.generated.js',
  `${banner}export const LAZUR_COLORS = ${JSON.stringify(generated, null, 2)};\n`
);

console.log('Zapisano kolory dwóch palet do src/data/products/lazurColors.generated.js');
if (makeSheet) console.log('Arkusze kontrolne: tmp-proof-drewno.jpg, tmp-proof-drewnoAlu.jpg');
