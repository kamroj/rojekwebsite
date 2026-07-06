// Buduje mapy słojów public/models/lazur/grain-{pine|meranti|oak}.jpg z
// referencyjnych zdjęć drewna w wzornik-lazury/ (sosna2/meranti/dab —
// wyselekcjonowane pod opisy usłojenia: sosna = miękkie miodowe pasma,
// meranti = drobne spokojne włókna, dąb = katedry + pory + promienie).
//
// Kontrakt z pipeline'em "słoje × kolor": mapa jest mnożona przez kolor lazuru
// (material.color × map w 3D, background-blend-mode: multiply w UI), a kolory
// w lazurColors.generated.js są podniesione o 255/GRAIN_MEAN — więc KAŻDY
// kanał mapy musi mieć średnią = GRAIN_MEAN (235). Rysunek słojów niesie
// odchyłka od średniej: pole jasne, linie ciemniejsze, plus częściowo
// zachowana chrominancja referencji (cieplejsze smugi bez zmiany średniej).
//
// Uruchomienie: node scripts/build-grain-maps.mjs

import sharp from 'sharp'

const GRAIN_MEAN = 235
const OUT_DIR = 'public/models/lazur'

// satKeep — ile chrominancji referencji zostaje (0 = czysta skala szarości);
// targetStd — docelowe odchylenie standardowe luminancji (siła rysunku);
// rotate — obrót do słojów POZIOMYCH (konwencja map: rail bez rotacji,
// stojaki dostają rotację 90° w materiale)
const SPECIES = [
  { key: 'pine', src: 'wzornik-lazury/sosna2.png', rotate: 0, satKeep: 0.55, targetStd: 11 },
  { key: 'meranti', src: 'wzornik-lazury/meranti.png', rotate: 0, satKeep: 0.5, targetStd: 10.5 },
  { key: 'oak', src: 'wzornik-lazury/dab.png', rotate: 90, satKeep: 0.55, targetStd: 19 },
]

const clamp = (v) => Math.min(255, Math.max(0, v))

for (const { key, src, rotate, satKeep, targetStd } of SPECIES) {
  const base = sharp(src).rotate(rotate).resize({ width: 2048, withoutEnlargement: true })
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
  // Wyrównanie oświetlenia: dzielenie przez mocno rozmytą kopię usuwa gradienty
  // ekspozycji, zostawiając rysunek (sigma duża, żeby katedry dębu przetrwały)
  const { data: blurData } = await base
    .clone()
    .blur(Math.round(info.width * 0.08))
    .raw()
    .toBuffer({ resolveWithObject: true })

  const n = info.width * info.height
  const channels = info.channels
  const flat = new Float64Array(n * 3)
  const blurMean = [0, 0, 0]
  for (let c = 0; c < 3; c += 1) {
    let sum = 0
    for (let i = 0; i < n; i += 1) sum += blurData[i * channels + c]
    blurMean[c] = sum / n
  }
  for (let i = 0; i < n; i += 1) {
    for (let c = 0; c < 3; c += 1) {
      const b = Math.max(blurData[i * channels + c], 1)
      flat[i * 3 + c] = data[i * channels + c] * (blurMean[c] / b)
    }
  }

  // Luminancja + wycentrowana chrominancja (średnia chrominancji = 0, więc
  // średnia kanałów wyjścia = średnia luminancji)
  const luma = new Float64Array(n)
  let meanL = 0
  for (let i = 0; i < n; i += 1) {
    const L = 0.299 * flat[i * 3] + 0.587 * flat[i * 3 + 1] + 0.114 * flat[i * 3 + 2]
    luma[i] = L
    meanL += L
  }
  meanL /= n
  let varL = 0
  for (let i = 0; i < n; i += 1) varL += (luma[i] - meanL) ** 2
  const stdL = Math.sqrt(varL / n)
  const gain = targetStd / stdL

  const chromaMean = [0, 0, 0]
  for (let i = 0; i < n; i += 1) {
    for (let c = 0; c < 3; c += 1) chromaMean[c] += flat[i * 3 + c] - luma[i]
  }
  for (let c = 0; c < 3; c += 1) chromaMean[c] /= n

  // Dwa przebiegi: po pierwszym korygujemy offset, żeby średnia PO clampingu
  // trafiła dokładnie w GRAIN_MEAN (clamp przy 255 ścina górę rozkładu)
  const out = Buffer.alloc(n * 3)
  let offset = 0
  for (let pass = 0; pass < 2; pass += 1) {
    let sum = 0
    for (let i = 0; i < n; i += 1) {
      const L = GRAIN_MEAN + offset + (luma[i] - meanL) * gain
      for (let c = 0; c < 3; c += 1) {
        const chroma = (flat[i * 3 + c] - luma[i] - chromaMean[c]) * satKeep
        const v = clamp(Math.round(L + chroma))
        out[i * 3 + c] = v
        sum += v
      }
    }
    const mean = sum / (n * 3)
    if (pass === 0) offset = GRAIN_MEAN - mean
    else console.log(`${key}: ${info.width}x${info.height} mean=${mean.toFixed(1)} (target ${GRAIN_MEAN}) stdSrc=${stdL.toFixed(1)} gain=${gain.toFixed(2)}`)
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(`${OUT_DIR}/grain-${key}.jpg`)
}
