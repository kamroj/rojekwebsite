const CONSENT_EVENT = 'rojek:consent-changed';

function getApi() {
  if (typeof window === 'undefined') return null;
  const win = /** @type {any} */ (window);
  return win.ROJEK_CONSENT || null;
}

export function hasConsent(serviceName) {
  const api = getApi();
  if (!api || typeof api.hasConsent !== 'function') return false;
  return !!api.hasConsent(serviceName);
}

export function openConsentSettings() {
  const api = getApi();
  if (!api || typeof api.openManager !== 'function') return;
  api.openManager();
}

export function onConsentChange(callback) {
  if (typeof window === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  const handler = (event) => callback(event?.detail || {});
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

export { CONSENT_EVENT };
