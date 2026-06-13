// Buduje mapy słojów drewna dla konfiguratora HS z realnej referencji
// (wzornik-lazury/wzor-sloi-drewno.png — 3 kolumny: Sosna | Dąb | Meranti).
//
// Każda kolumna → grayscale → znormalizowany kontrast (widoczny na jasnych
// i ciemnych wybarwieniach) → obrót 90° (w referencji słoje biegną pionowo;
// konwencja tekstur w canvasie zakłada słoje poziome w źródle, woodV obraca je
// dla stojaków) → 2048 px szer. Mapa pokazywana raz na lico (bez tilingu, więc
// brak sekwencyjnego powtarzania). Służy jako mnożnik koloru (color × grain)
// i jako bump w 3D.
//
// `--preview` zapisuje podglądy zabarwione (jasny/ciemny) per gatunek.

import sharp from 'sharp';

const SRC = 'wzornik-lazury/wzor-sloi-drewno.png';
const OUT_DIR = 'public/models/lazur';

// Kolumny w referencji (x lewej krawędzi, szerokość). Inset pionowy omija
// etykiety na dole i zielony narożnik u góry.
const TOP = 70;
const BOTTOM = 950;
const COLUMNS = {
  pine: { x: 40, w: 572 }, // Sosna
  oak: { x: 692, w: 573 }, // Dąb
  meranti: { x: 1345, w: 572 }, // Meranti
};

// Mapa służy do mnożenia koloru (color × grain). Aby linie słojów były
// DELIKATNE i „wpadały w kolor lazura" (lekko ciemniejszy odcień bejcy, nie
// czarne twarde paski), trzymamy wysoką średnią i NISKI kontrast — tło prawie
// białe, słoje tylko nieznacznie ciemniejsze. Głębia (relief) jest osobną
// dźwignią: bumpScale w canvasie, nie kontrast tej mapy.
const TARGET_MEAN = 234;
const TARGET_STD = 14;
const OUT_WIDTH = 2048;

const preview = process.argv.includes('--preview');
const srcBuf = await sharp(SRC).toBuffer();

for (const [species, col] of Object.entries(COLUMNS)) {
  // 1. wycinek kolumny + grayscale, lekkie odszumienie PNG
  const gray = await sharp(srcBuf)
    .extract({ left: col.x, top: TOP, width: col.w, height: BOTTOM - TOP })
    .grayscale()
    .median(1) // lekko odszum PNG, nie gubiąc drobnego rysunku (pory dębu, wstęgi meranti)
    .toBuffer();

  // 2. normalizacja kontrastu: (v-mean)*gain + targetMean, gain = targetStd/std
  const { channels } = await sharp(gray).stats();
  const mean = channels[0].mean;
  const std = channels[0].stdev || 1;
  const gain = TARGET_STD / std;
  const offset = TARGET_MEAN - mean * gain;

  // 3. obrót 90° (słoje pionowe w referencji → poziome w źródle) + skala
  const map = await sharp(gray)
    .linear(gain, offset)
    .rotate(90)
    .resize({ width: OUT_WIDTH })
    .jpeg({ quality: 90 })
    .toBuffer();
  await sharp(map).toFile(`${OUT_DIR}/grain-${species}.jpg`);

  const outStat = await sharp(map).stats();
  console.log(`${species}: mean ${Math.round(outStat.channels[0].mean)} std ${Math.round(outStat.channels[0].stdev)} (src mean ${Math.round(mean)} std ${Math.round(std)})`);

  if (preview) {
    const meta = await sharp(map).metadata();
    const tints = { light: [0xdf, 0xdb, 0xcf], dark: [0x40, 0x46, 0x55] };
    const grayPx = await sharp(map).raw().toBuffer();
    for (const [name, [r, g, b]] of Object.entries(tints)) {
      const tinted = Buffer.alloc(grayPx.length * 3);
      for (let i = 0; i < grayPx.length; i++) {
        const k = grayPx[i] / 255;
        tinted[i * 3] = Math.round(r * k);
        tinted[i * 3 + 1] = Math.round(g * k);
        tinted[i * 3 + 2] = Math.round(b * k);
      }
      await sharp(tinted, { raw: { width: meta.width, height: meta.height, channels: 3 } })
        .extract({ left: 0, top: 0, width: Math.min(900, meta.width), height: meta.height })
        .jpeg({ quality: 90 })
        .toFile(`tmp-grain-${species}-${name}.jpg`);
    }
  }
}
console.log('grain done');
