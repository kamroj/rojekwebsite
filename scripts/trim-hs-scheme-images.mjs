// Ujednolicenie PNG schematów HS (kafelki konfiguratora): rysunki w plikach
// źródłowych mają różne ilości pustego tła wokół siebie, przez co w kafelkach
// (object-fit: contain) jedne wyglądały na mniejsze od drugich. Skrypt
// przycina każdy plik do zawartości i dodaje z powrotem jednolity margines
// (procent dłuższego boku), zachowując oryginalne nazwy plików.
//
// Uruchomienie: node scripts/trim-hs-scheme-images.mjs

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = 'public/images/hs'
const MARGIN_RATIO = 0.03 // margines po przycięciu: 3% dłuższego boku

const files = (await fs.readdir(DIR)).filter((name) => /^schemat-.*\.png$/i.test(name))

for (const name of files) {
  const file = path.join(DIR, name)
  const original = await sharp(file).png().toBuffer()
  const { width: ow, height: oh } = await sharp(original).metadata()

  const trimmed = await sharp(original).trim({ threshold: 10 }).toBuffer()
  const { width: tw, height: th, hasAlpha } = await sharp(trimmed).metadata()

  // Margines w kolorze tła pliku: przezroczysty przy PNG z kanałem alpha,
  // biały przy plikach spłaszczonych (np. schemat F)
  const background = hasAlpha ? { r: 255, g: 255, b: 255, alpha: 0 } : { r: 255, g: 255, b: 255 }
  const margin = Math.round(Math.max(tw, th) * MARGIN_RATIO)
  const padded = await sharp(trimmed)
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()

  await fs.writeFile(file, padded)
  console.log(`${name}: ${ow}x${oh} -> ${tw + 2 * margin}x${th + 2 * margin}`)
}
