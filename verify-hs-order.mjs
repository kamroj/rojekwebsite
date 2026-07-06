// Weryfikacja: kolejność otwierania pary środkowej C/F (bierne ryglowane przez
// aktywne), skrzydła tylne F bez nowej blokady, ponowny klik w wybrany schemat
// nie zawiesza podglądu.
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = process.argv[2] ?? '.';
const BASE = 'http://localhost:4322';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--window-size=1700,1100'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1700, height: 1100 });

const ready = async () => {
  await page.waitForSelector('canvas', { timeout: 30000 });
  await sleep(5000);
  await page.evaluate(() => {
    document.getElementById('klaro')?.remove();
    document.querySelector('astro-dev-toolbar')?.remove();
  });
};

const shoot = async (name) => {
  const canvas = await page.$('canvas');
  await canvas.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
};

const clickCanvasAt = (fx, fy) =>
  page.evaluate(
    ({ fx, fy }) => {
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = rect.left + rect.width * fx;
      const y = rect.top + rect.height * fy;
      const opts = { bubbles: true, composed: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, button: 0 };
      canvas.dispatchEvent(new PointerEvent('pointermove', opts));
      canvas.dispatchEvent(new PointerEvent('pointerdown', opts));
      canvas.dispatchEvent(new PointerEvent('pointerup', opts));
      canvas.dispatchEvent(new MouseEvent('click', opts));
    },
    { fx, fy }
  );

// ── 1. Schemat C: bierne skrzydło nie otwiera się przed aktywnym ──
await page.goto(`${BASE}/konfigurator-hs?s=c`, { waitUntil: 'networkidle2', timeout: 90000 });
await ready();
// aktywne = Lewe (panel 1, drugie pole), bierne = panel 2 (trzecie pole)
await clickCanvasAt(0.60, 0.5); // klik w BIERNE — ma zostać zamknięte
await sleep(3200);
await shoot('30-c-passive-blocked');
await clickCanvasAt(0.40, 0.5); // klik w AKTYWNE — otwiera się
await sleep(3400);
await shoot('31-c-active-open');
await clickCanvasAt(0.60, 0.5); // teraz bierne może się otworzyć
await sleep(3400);
await shoot('32-c-both-open');

// ── 2. C: przełącz na Prawe → reset; bierne (teraz lewe środkowe) blokowane ──
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Prawe')?.click();
});
await sleep(3500);
await clickCanvasAt(0.40, 0.5); // bierne przy aktywnym Prawym — blokada
await sleep(3200);
await shoot('33-c-right-passive-blocked');

// ── 3. Schemat F: bierne środkowe blokowane, tylne wolne ──
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((el) => el.textContent.trim().startsWith('Schemat F'))?.click();
});
await sleep(4500);
await clickCanvasAt(0.60, 0.5); // bierne środkowe (panel 2) — blokada
await sleep(3200);
await shoot('34-f-passive-blocked');
await clickCanvasAt(0.81, 0.5); // tylne skrajne (panel 3) — otwiera się swobodnie
await sleep(3400);
await shoot('35-f-rear-open');

// ── 4. Podwójny klik w wybrany schemat nie zawiesza podglądu ──
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((el) => el.textContent.trim().startsWith('Schemat F'))?.click();
});
await sleep(1200);
const overlayStuck = await page.evaluate(() => Boolean(document.querySelector('[class*="viewerLoadingOverlay"]')));
console.log('overlay po ponownym kliku F (ma być false):', overlayStuck);
await shoot('36-f-reclick');

await browser.close();
console.log('DONE');
