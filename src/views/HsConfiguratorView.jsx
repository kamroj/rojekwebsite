import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/ui/Page';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import styles from './HsConfiguratorView.module.css';

// Lazy-load the heavy 3D stack (three + react-three/*) into a separate chunk.
// This keeps the HS page shell lighter and improves caching/chunking.
const HsConfiguratorCanvas = React.lazy(() => import('./hs-configurator/HsConfiguratorCanvas.jsx'));

const TEXTURES = [
  { value: '/models/remmers-natur.jpg', labelKey: 'hsConfigurator.options.textures.natur', fallback: 'Natur' },
  { value: '/models/remmers-miodowa-sosna.jpg', labelKey: 'hsConfigurator.options.textures.honeyPine', fallback: 'Miodowa Sosna' },
];

const HANDLE_TEXTURES = [
  { value: '/models/textures/handle/hang-silver.jpg', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'Srebrna' },
  { value: '/models/textures/handle/hang-gold.jpg', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'Złota' },
];

const TYPES = [
  { value: 'a', label: 'A' },
];

const THRESHOLDS = [
  { value: 'silver', labelKey: 'hsConfigurator.options.thresholds.silver', fallback: 'Srebrny' },
  { value: 'black', labelKey: 'hsConfigurator.options.thresholds.black', fallback: 'Czarny' },
  { value: 'gold', labelKey: 'hsConfigurator.options.thresholds.gold', fallback: 'Złoty' },
];

// Bazowe wymiary okna
const BASE_WIDTH = 2320; // mm
const BASE_HEIGHT = 2040; // mm;

const HsConfiguratorPage = () => {
  const { t } = useTranslation();
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0].value);
  const [selectedHandleTexture, setSelectedHandleTexture] = useState(HANDLE_TEXTURES[0].value);
  const [selectedType, setSelectedType] = useState(TYPES[0].value);
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].value);
  const [width, setWidth] = useState(BASE_WIDTH);
  const [height, setHeight] = useState(BASE_HEIGHT);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(null);
  const [forceCloseAnimation, setForceCloseAnimation] = useState(false);

  const [modelResetKey, setModelResetKey] = useState(0); // NEW – klucz do remountu HsModel

  // Sprawdź czy wymiary są domyślne
  const hasDefaultDimensions = width === BASE_WIDTH && height === BASE_HEIGHT;

  const handleAnimationToggle = () => {
    // Jeśli wymiary nie są domyślne – reset do bazowych i pełny reset modelu
    if (!hasDefaultDimensions) {
      setWidth(BASE_WIDTH);
      setHeight(BASE_HEIGHT);

      // pełny reset stanu animacji po stronie konfiguratora
      setIsOpen(false);
      setIsAnimating(false);
      setAnimationState(null);
      setForceCloseAnimation(false);

      // wymuś pełny remount HsModel, żeby wyczyścić lastAnimationState / mixer itd.
      setModelResetKey((k) => k + 1); // NEW

      return;
    }

    // Normalna obsługa animacji tylko przy domyślnych wymiarach
    if (isAnimating) return;
    setIsAnimating(true);
    if (!isOpen) setAnimationState('opening');
    else setAnimationState('closing');
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setIsOpen(!isOpen);
    setAnimationState(null);
  };

  // Obsługa zmiany wymiarów – gdy w trakcie animacji zmienisz wymiary, wymuś zamknięcie
  useEffect(() => {
    if (!hasDefaultDimensions) {
      if (isOpen || isAnimating) {
        setForceCloseAnimation(true);
        setIsOpen(false);
        setIsAnimating(false);
        setAnimationState(null);

        setTimeout(() => setForceCloseAnimation(false), 100);
      }
    }
  }, [width, height, hasDefaultDimensions, isOpen, isAnimating]);

  return (
    <Page
      imageSrc="/images/hs/top.jpg"
      title={t('hsConfigurator.title', 'Konfigurator HS')}
    >
      <HeaderWrap>
        <ProductHeader>
          {t('hsConfigurator.header', 'Konfigurator HS')}
        </ProductHeader>
        <ProductHeaderSubtitle>
          {t('hsConfigurator.subtitle', 'Stwórz swoje wymarzone okno przesuwne')}
        </ProductHeaderSubtitle>
      </HeaderWrap>
      <div className={styles.configuratorContainer}>
        <div className={styles.controlPanel}>
          <div className={`${styles.controlSection} ${styles.controlSectionFirst}`}>
            <h3 className={styles.sectionHeader}>{t('hsConfigurator.sections.elements', 'Elementy')}</h3>
            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.frameMaterial', 'Materiał ramy:')}</label>
              <select
                className={styles.select}
                value={selectedTexture}
                onChange={(e) => setSelectedTexture(e.target.value)}
              >
                {TEXTURES.map((tex) => (
                  <option key={tex.value} value={tex.value}>
                    {t(tex.labelKey, tex.fallback)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.handleColor', 'Kolor klamki:')}</label>
              <select
                className={styles.select}
                value={selectedHandleTexture}
                onChange={(e) => setSelectedHandleTexture(e.target.value)}
              >
                {HANDLE_TEXTURES.map((tex) => (
                  <option key={tex.value} value={tex.value}>
                    {t(tex.labelKey, tex.fallback)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.type', 'Typ:')}</label>
              <select
                className={styles.select}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.thresholdColor', 'Kolor progu:')}</label>
              <select
                className={styles.select}
                value={selectedThreshold}
                onChange={(e) => setSelectedThreshold(e.target.value)}
              >
                {THRESHOLDS.map((threshold) => (
                  <option key={threshold.value} value={threshold.value}>
                    {t(threshold.labelKey, threshold.fallback)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.controlSection}>
            <h3 className={styles.sectionHeader}>{t('hsConfigurator.sections.dimensions', 'Wymiary')}</h3>
            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.width', 'Szerokość okna:')}</label>
              <div className={styles.rangeContainer}>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min="2000"
                  max="4000"
                  step="10"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
                <span className={styles.rangeValue}>{width} mm</span>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>{t('hsConfigurator.labels.height', 'Wysokość okna:')}</label>
              <div className={styles.rangeContainer}>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min="2000"
                  max="3000"
                  step="10"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
                <span className={styles.rangeValue}>{height} mm</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.viewerWrap}>
          <div className={styles.previewLabel}>{t('hsConfigurator.sections.preview', 'PODGLĄD')}</div>
          {!hasDefaultDimensions && (
            <div className={styles.dimensionWarning}>
              {t('hsConfigurator.warnings.animationOnlyDefault', 'Animacja dostępna tylko przy domyślnych wymiarach')}
            </div>
          )}
          <button
            className={styles.animationButton}
            onClick={handleAnimationToggle}
            disabled={isAnimating}
            style={{
              '--button-bg': isAnimating ? '#ccccccab' : (!hasDefaultDimensions ? '#362f9ebb' : '#013a06bd'),
              '--button-color': isAnimating ? '#000000a8' : '#f8f9fa',
              '--button-border': isAnimating ? '#909090' : (!hasDefaultDimensions ? '#0c065cba' : '#01790bb2'),
              '--button-hover-bg': isAnimating ? '#ccccccab' : (!hasDefaultDimensions ? '#d47300' : '#013a06'),
              '--button-outline': !hasDefaultDimensions ? '#ff8c00' : '#01790b',
              '--button-cursor': isAnimating ? 'not-allowed' : 'pointer'
            }}
          >
            {!hasDefaultDimensions
              ? t('hsConfigurator.buttons.resetDimensions', 'RESETUJ WYMIARY')
              : (isOpen ? t('hsConfigurator.buttons.close', 'ZAMKNIJ') : t('hsConfigurator.buttons.open', 'OTWÓRZ'))}
          </button>
          <Suspense fallback={
            <div className={styles.canvasFallback} aria-live="polite">
              {t('hsConfigurator.loading', 'Ładowanie konfiguratora…')}
            </div>
          }>
            <HsConfiguratorCanvas
              selectedTexture={selectedTexture}
              selectedHandleTexture={selectedHandleTexture}
              selectedThreshold={selectedThreshold}
              width={width}
              height={height}
              animationState={animationState}
              onAnimationComplete={handleAnimationComplete}
              forceCloseAnimation={forceCloseAnimation}
              modelResetKey={modelResetKey}
            />
          </Suspense>
        </div>
      </div>
    </Page>
  );
};

export default HsConfiguratorPage;
