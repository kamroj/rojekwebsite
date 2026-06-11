// Detekcja natywnego AR na urządzeniu:
// - 'quick-look' — iOS/iPadOS Safari z AR Quick Look (kotwica <a rel="ar">),
//   sprawdzane najpierw, bo łapie też iPady udające desktop;
// - 'webxr' — Chrome/Android z ARCore (sesja immersive-ar);
// - 'none' — pokaż zamiast tego QR (desktop) albo nic.

export async function detectArSupport() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'none';

  try {
    if (document.createElement('a').relList?.supports?.('ar')) return 'quick-look';
  } catch {
    // relList.supports może rzucić na starych przeglądarkach — traktuj jak brak wsparcia
  }

  try {
    if (await navigator.xr?.isSessionSupported?.('immersive-ar')) return 'webxr';
  } catch {
    // np. odmowa uprawnień / feature policy — traktuj jak brak wsparcia
  }

  return 'none';
}
