import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import { TbAugmentedReality, TbQrcode } from 'react-icons/tb';
import { useResponsive } from '../../../hooks/useResponsive.js';
import { buildShareUrl } from '../../../lib/hs/configUrl.js';
import { detectArSupport } from './arSupport.js';
import styles from './ArLauncher.module.css';

// Punkt wejścia AR w konfiguratorze HS:
// - urządzenie z AR (iOS Quick Look / Android WebXR) → przycisk "Zobacz w AR",
//   który eksportuje żywy model do GLB/USDZ i uruchamia natywne AR w skali 1:1
//   przez <model-viewer> (lazy-load przy pierwszym tapnięciu);
// - desktop bez AR → przycisk z kodem QR przenoszącym konfigurację na telefon.

// Sygnatura części konfiguracji wpływającej na geometrię/materiały modelu —
// dodatki nie zmieniają eksportu, więc nie unieważniają cache'u. Gatunek
// (wood) jest w sygnaturze, bo lazur może mieć teksturę per gatunek.
// Aktywnego skrzydła tu nie ma: plakietki (aktywne skrzydło, szyba hartowana)
// są usuwane z eksportu AR, więc modelu nie zmieniają
const exportSignature = (config) =>
  [
    config.scheme,
    config.mirrored ? 'm' : 'b',
    config.width,
    config.height,
    config.woodColor?.palette,
    config.woodColor?.id,
    config.wood,
    config.handleFinish,
    config.threshold,
    config.materialType,
    config.aluColor,
  ].join('|');

const MODEL_LOAD_TIMEOUT_MS = 10000;
const QR_TITLE_ID = 'hs-configurator-ar-qr-title';

// activateAR działa dopiero, gdy model-viewer wczyta GLB — czekamy na `load`
const waitForModelLoad = (element) =>
  new Promise((resolve, reject) => {
    if (element.loaded) {
      resolve();
      return;
    }
    let timeoutId;
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = (event) => {
      cleanup();
      reject(event?.detail?.sourceError ?? new Error('model-viewer: błąd wczytywania modelu'));
    };
    const cleanup = () => {
      clearTimeout(timeoutId);
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onError);
    };
    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('model-viewer: przekroczono czas wczytywania modelu'));
    }, MODEL_LOAD_TIMEOUT_MS);
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onError);
  });

const ArLauncher = ({ modelRootRef, isModelReady = false, config, autoPrepare = false }) => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  // support: 'unknown' | 'quick-look' | 'webxr' | 'none'
  // phase:   'idle' | 'preparing' | 'ready' | 'error'
  const [support, setSupport] = useState('unknown');
  const [phase, setPhase] = useState('idle');
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const blobUrlsRef = useRef({ glb: null, usdz: null });
  const exportedSignatureRef = useRef(null);
  const preparingRef = useRef(false);
  const autoPreparedRef = useRef(false);

  const signature = exportSignature(config);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    detectArSupport().then((mode) => {
      if (!cancelled) setSupport(mode);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sprzątanie przy odmontowaniu — bloby żyją przez cały cykl komponentu,
  // bo Quick Look może doczytywać URL już po uruchomieniu AR
  useEffect(
    () => () => {
      const { glb, usdz } = blobUrlsRef.current;
      if (glb) URL.revokeObjectURL(glb);
      if (usdz) URL.revokeObjectURL(usdz);
      viewerRef.current?.remove();
      viewerRef.current = null;
    },
    []
  );

  // Zmiana geometrii/materiałów unieważnia przygotowany model
  useEffect(() => {
    if (exportedSignatureRef.current && exportedSignatureRef.current !== signature) {
      setPhase((current) => (current === 'preparing' ? current : 'idle'));
    }
  }, [signature]);

  const ensureViewerElement = useCallback(() => {
    if (viewerRef.current) return viewerRef.current;
    const element = document.createElement('model-viewer');
    element.setAttribute('ar', '');
    // Bez scene-viewera: Scene Viewer pobiera model z URL poza stroną,
    // więc nie odczyta naszych blob: URL-i
    element.setAttribute('ar-modes', 'webxr quick-look');
    // Stała skala = wymiary 1:1 (na iOS model-viewer dokleja allowsContentScaling=0)
    element.setAttribute('ar-scale', 'fixed');
    element.setAttribute('ar-placement', 'floor');
    element.setAttribute('loading', 'eager');
    element.addEventListener('ar-status', (event) => {
      if (event.detail?.status === 'failed') setPhase('error');
    });
    hostRef.current?.appendChild(element);
    viewerRef.current = element;
    return element;
  }, []);

  const prepare = useCallback(async () => {
    if (preparingRef.current) return false;
    const sourceGroup = modelRootRef?.current;
    if (!sourceGroup) return false;

    // Konfiguracja wróciła do już wyeksportowanej postaci — bez ponownego eksportu
    if (exportedSignatureRef.current === signature && viewerRef.current?.loaded) {
      setPhase('ready');
      return true;
    }

    preparingRef.current = true;
    setPhase('preparing');
    try {
      const [exportModule] = await Promise.all([
        import('./exportHsModel.js'),
        import('@google/model-viewer/dist/model-viewer.min.js'),
      ]);

      const root = exportModule.prepareModelForExport(sourceGroup);
      const glbBlob = await exportModule.exportGlb(root);
      const usdzBlob = support === 'quick-look' ? await exportModule.exportUsdz(root) : null;

      const previous = blobUrlsRef.current;
      blobUrlsRef.current = {
        glb: URL.createObjectURL(glbBlob),
        usdz: usdzBlob ? URL.createObjectURL(usdzBlob) : null,
      };
      if (previous.glb) URL.revokeObjectURL(previous.glb);
      if (previous.usdz) URL.revokeObjectURL(previous.usdz);

      const viewer = ensureViewerElement();
      viewer.setAttribute('src', blobUrlsRef.current.glb);
      if (blobUrlsRef.current.usdz) viewer.setAttribute('ios-src', blobUrlsRef.current.usdz);
      await waitForModelLoad(viewer);

      exportedSignatureRef.current = signature;
      setPhase('ready');
      return true;
    } catch (error) {
      console.error('[hs-ar] Przygotowanie modelu AR nie powiodło się:', error);
      setPhase('error');
      return false;
    } finally {
      preparingRef.current = false;
    }
  }, [modelRootRef, signature, support, ensureViewerElement]);

  const launchAr = useCallback(() => {
    viewerRef.current?.activateAR();
  }, []);

  const handleArButtonClick = useCallback(async () => {
    if (phase === 'preparing') return;
    if (phase === 'ready' && exportedSignatureRef.current === signature) {
      launchAr();
      return;
    }
    const prepared = await prepare();
    // Eksport bywa szybszy niż okno aktywacji użytkownika — wtedy AR rusza
    // bez drugiego tapnięcia; w przeciwnym razie zostaje arkusz "Uruchom AR"
    if (prepared && navigator.userActivation?.isActive) launchAr();
  }, [phase, signature, prepare, launchAr]);

  // Wejście z kodu QR (?ar=1): przygotuj model bez czekania na gest —
  // jedyne tapnięcie użytkownika to "Uruchom AR"
  useEffect(() => {
    if (!autoPrepare || autoPreparedRef.current || !isModelReady) return;
    if (support !== 'quick-look' && support !== 'webxr') return;
    autoPreparedRef.current = true;
    prepare();
  }, [autoPrepare, isModelReady, support, prepare]);

  useEffect(() => {
    if (!qrOpen) return undefined;
    let cancelled = false;
    setQrDataUrl(null);
    (async () => {
      try {
        const qrModule = await import('qrcode');
        const qrcode = qrModule.default ?? qrModule;
        const url = `${buildShareUrl(config)}&ar=1`;
        const dataUrl = await qrcode.toDataURL(url, { width: 640, margin: 1 });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('[hs-ar] Nie udało się wygenerować kodu QR:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qrOpen, config]);

  useEffect(() => {
    if (!qrOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setQrOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [qrOpen]);

  const arCapable = support === 'quick-look' || support === 'webxr';
  if (support === 'unknown') return null;
  if (!arCapable && !isDesktop) return null;

  const qrDialog = qrOpen ? (
    <div className={styles.qrBackdrop} role="presentation" onClick={() => setQrOpen(false)}>
      <div
        className={styles.qrModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={QR_TITLE_ID}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.qrHeader}>
          <div className={styles.qrHeading}>
            <h3 id={QR_TITLE_ID} className={styles.qrTitle}>
              {t('hsConfigurator.ar.qrTitle', 'Zeskanuj kod telefonem')}
            </h3>
            <p className={styles.qrDescription}>
              {t(
                'hsConfigurator.ar.qrDescription',
                'Otworzy się konfigurator z Twoją konfiguracją, gotowy do uruchomienia AR.'
              )}
            </p>
          </div>
          <button
            type="button"
            className={styles.qrClose}
            onClick={() => setQrOpen(false)}
            aria-label={t('hsConfigurator.ar.close', 'Zamknij')}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className={styles.qrCodeFrame} aria-busy={!qrDataUrl}>
          {qrDataUrl ? (
            <img className={styles.qrImage} src={qrDataUrl} alt="" width="640" height="640" />
          ) : (
            <div className={styles.qrPlaceholder} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.arCorner}>
        {arCapable ? (
          phase === 'ready' ? (
            <div className={styles.readySheet}>
              <p className={styles.readyHint}>
                {t('hsConfigurator.ar.readyHint', 'Model w skali 1:1 — skieruj telefon na podłogę.')}
              </p>
              <button type="button" className={styles.launchButton} onClick={launchAr}>
                <TbAugmentedReality aria-hidden="true" />
                {t('hsConfigurator.ar.launch', 'Uruchom AR')}
              </button>
            </div>
          ) : (
            <>
              {phase === 'error' && (
                <p className={styles.errorNote}>
                  {t('hsConfigurator.ar.error', 'Nie udało się przygotować modelu AR.')}
                </p>
              )}
              <button
                type="button"
                className={styles.arButton}
                onClick={handleArButtonClick}
                disabled={phase === 'preparing' || !isModelReady}
              >
                {phase === 'preparing' ? (
                  <>
                    <span className={styles.buttonSpinner} aria-hidden="true" />
                    {t('hsConfigurator.ar.preparing', 'Przygotowywanie modelu…')}
                  </>
                ) : (
                  <>
                    <TbAugmentedReality aria-hidden="true" />
                    {phase === 'error'
                      ? t('hsConfigurator.ar.retry', 'Spróbuj ponownie')
                      : t('hsConfigurator.ar.button', 'Zobacz w AR')}
                  </>
                )}
              </button>
            </>
          )
        ) : (
          <button type="button" className={styles.arButton} onClick={() => setQrOpen(true)}>
            <TbQrcode aria-hidden="true" />
            {t('hsConfigurator.ar.qrButton', 'AR na telefonie')}
          </button>
        )}
      </div>

      {/* Niewidoczny host <model-viewer> — potrzebuje layout boxu (nie display:none),
          inaczej element nie zainicjalizuje się i nie wczyta modelu */}
      <div ref={hostRef} className={styles.viewerHost} aria-hidden="true" />

      {isMounted && qrDialog ? createPortal(qrDialog, document.body) : null}
    </>
  );
};

export default ArLauncher;
