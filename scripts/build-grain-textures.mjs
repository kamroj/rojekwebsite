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
//
// Mapa służy do mnożenia koloru (color × grain), więc balans to: tło wysokie
// (jasne, żeby nie brudzić lazuru), słoje ciemniejsze o tyle, by rysunek był
// WIDOCZNY, ale wciąż „wpadał w kolor" (nie czarne twarde paski — odrzucone
// przy std 37, ale std 14 dawało jednolitą płaszczyznę bez struktury).
// Parametry per gatunek wg charakteru drewna z referencji: sosna = miękkie
// szerokie fale (niski kontrast, bez CLAHE), dąb = najmocniejszy rysunek
// (katedry + krótkie kreski otwartych porów — CLAHE wyciąga lokalny detal),
// meranti = drobne, gęste, równomierne prążki. clahe.width/height to rozmiar
// regionu w px źródła, maxSlope ogranicza agresję lokalnego kontrastu.
const TOP = 70;
const BOTTOM = 950;
const SPECIES = {
  pine: { x: 40, w: 572, mean: 236, std: 17, clahe: { width: 128, height: 128, maxSlope: 2 } }, // Sosna
  oak: { x: 692, w: 573, mean: 232, std: 22, clahe: { width: 96, height: 96, maxSlope: 2 } }, // Dąb
  meranti: { x: 1345, w: 572, mean: 234, std: 18, clahe: { width: 64, height: 64, maxSlope: 2 } }, // Meranti
};
const OUT_WIDTH = 2048;

const preview = process.argv.includes('--preview');
const srcBuf = await sharp(SRC).toBuffer();

for (const [species, col] of Object.entries(SPECIES)) {
  // 1. wycinek kolumny + grayscale, lekkie odszumienie PNG; CLAHE (opcjonalne
  //    per gatunek) wyrównuje lokalny kontrast — wydobywa pory i drobny rysunek
  //    z płaskich partii zdjęcia, zanim globalna normalizacja ustawi poziomy
  let pipeline = sharp(srcBuf)
    .extract({ left: col.x, top: TOP, width: col.w, height: BOTTOM - TOP })
    .grayscale()
    .median(1); // lekko odszum PNG, nie gubiąc drobnego rysunku (pory dębu, wstęgi meranti)
  if (col.clahe) pipeline = pipeline.clahe(col.clahe);
  const gray = await pipeline.toBuffer();

  // 2. normalizacja kontrastu: (v-mean)*gain + targetMean, gain = targetStd/std
  const { channels } = await sharp(gray).stats();
  const mean = channels[0].mean;
  const std = channels[0].stdev || 1;
  const gain = col.std / std;
  const offset = col.mean - mean * gain;

  // 3. obrót 90° (słoje pionowe w referencji → poziome w źródle) + skala.
  //    Bez wyostrzania po upscale — sharpen wzmacniał wierszowy szum JPEG
  //    w widoczne poziome prążki; miękkość po 2,3x jest akceptowalna
  const map = await sharp(gray)
    .linear(gain, offset)
    .rotate(90)
    .resize({ width: OUT_WIDTH })
    .toColourspace('b-w') // CLAHE po drodze konwertuje do sRGB — wracamy do 1 kanału
    .jpeg({ quality: 90 })
    .toBuffer();
  await sharp(map).toFile(`${OUT_DIR}/grain-${species}.jpg`);

  const outStat = await sharp(map).stats();
  console.log(`${species}: mean ${Math.round(outStat.channels[0].mean)} std ${Math.round(outStat.channels[0].stdev)} (src mean ${Math.round(mean)} std ${Math.round(std)})`);

  if (preview) {
    const meta = await sharp(map).metadata();
    const tints = { light: [0xdf, 0xdb, 0xcf], dark: [0x40, 0x46, 0x55] };
    const { data: grayPx, info } = await sharp(map).raw().toBuffer({ resolveWithObject: true });
    const stride = info.channels; // odporność na mapy 1- i 3-kanałowe
    const pixels = info.width * info.height;
    for (const [name, [r, g, b]] of Object.entries(tints)) {
      const tinted = Buffer.alloc(pixels * 3);
      for (let i = 0; i < pixels; i++) {
        const k = grayPx[i * stride] / 255;
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
