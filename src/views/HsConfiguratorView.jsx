import React, { Suspense, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/ui/Page';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import styles from './HsConfiguratorView.module.css';

const HsConfiguratorCanvas = React.lazy(() => import('./hs-configurator/HsConfiguratorCanvas.jsx'));

const TEXTURES = [
  { value: '/models/remmers-natur.jpg', labelKey: 'hsConfigurator.options.textures.natur', fallback: 'Natur' },
  { value: '/models/remmers-miodowa-sosna.jpg', labelKey: 'hsConfigurator.options.textures.honeyPine', fallback: 'Miodowa Sosna' },
];

const HANDLE_TEXTURES = [
  { value: '/models/textures/handle/hang-silver.jpg', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'Srebrna' },
  { value: '/models/textures/handle/hang-gold.jpg', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'Złota' },
];

const TYPES = [{ value: 'a', label: 'A' }];

const THRESHOLDS = [
  { value: 'silver', labelKey: 'hsConfigurator.options.thresholds.silver', fallback: 'Srebrny' },
  { value: 'black', labelKey: 'hsConfigurator.options.thresholds.black', fallback: 'Czarny' },
  { value: 'gold', labelKey: 'hsConfigurator.options.thresholds.gold', fallback: 'Złoty' },
];

const BASE_WIDTH = 2320;
const BASE_HEIGHT = 2040;

const HsConfiguratorPage = () => {
  const { t } = useTranslation();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0].value);
  const [selectedHandleTexture, setSelectedHandleTexture] = useState(HANDLE_TEXTURES[0].value);
  const [selectedType, setSelectedType] = useState(TYPES[0].value);
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].value);
  const [width, setWidth] = useState(BASE_WIDTH);
  const [height, setHeight] = useState(BASE_HEIGHT);

  const handleCanvasReady = useCallback(() => {
    setIsCanvasReady(true);
  }, []);

  const handleTextureChange = useCallback((setter) => (event) => {
    setIsCanvasReady(false);
    setter(event.target.value);
  }, []);

  const handleDimensionChange = useCallback((setter) => (event) => {
    setIsCanvasReady(false);
    setter(Number(event.target.value));
  }, []);

  return (
    <Page imageSrc="/images/hs/top.jpg" title={t('hsConfigurator.title', 'Konfigurator HS')}>
      <HeaderWrap>
        <ProductHeader>{t('hsConfigurator.header', 'Konfigurator HS')}</ProductHeader>
        <ProductHeaderSubtitle>
          {t('hsConfigurator.subtitle', 'Stwórz swoje wymarzone okno przesuwne')}
        </ProductHeaderSubtitle>
      </HeaderWrap>

      <div className={styles.configuratorContainer}>
        <div className={styles.configuratorGrid}>
          <aside className={styles.controlColumn}>
            <div className={styles.controlPanel}>
              <div className={`${styles.controlSection} ${styles.controlSectionFirst}`}>
                <div className={styles.sectionHeaderWrap}>
                  <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.materials', 'Wykończenie')}</span>
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>{t('hsConfigurator.labels.frameMaterial', 'Materiał ramy')}</label>
                  <select className={styles.select} value={selectedTexture} onChange={handleTextureChange(setSelectedTexture)}>
                    {TEXTURES.map((tex) => (
                      <option key={tex.value} value={tex.value}>
                        {t(tex.labelKey, tex.fallback)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>{t('hsConfigurator.labels.handleColor', 'Kolor klamki')}</label>
                  <select className={styles.select} value={selectedHandleTexture} onChange={handleTextureChange(setSelectedHandleTexture)}>
                    {HANDLE_TEXTURES.map((tex) => (
                      <option key={tex.value} value={tex.value}>
                        {t(tex.labelKey, tex.fallback)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>{t('hsConfigurator.labels.type', 'Typ')}</label>
                  <select className={styles.select} value={selectedType} onChange={handleTextureChange(setSelectedType)}>
                    {TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>{t('hsConfigurator.labels.thresholdColor', 'Kolor progu')}</label>
                  <select className={styles.select} value={selectedThreshold} onChange={handleTextureChange(setSelectedThreshold)}>
                    {THRESHOLDS.map((threshold) => (
                      <option key={threshold.value} value={threshold.value}>
                        {t(threshold.labelKey, threshold.fallback)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.controlSection}>
                <div className={styles.sectionHeaderWrap}>
                  <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.dimensions', 'Proporcje')}</span>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>{t('hsConfigurator.labels.width', 'Szerokość okna')}</label>
                    <span className={styles.rangeBadge}>{width} mm</span>
                  </div>
                  <div className={styles.rangeContainer}>
                    <input className={styles.rangeInput} type="range" min="2000" max="4000" step="10" value={width} onChange={handleDimensionChange(setWidth)} />
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>{t('hsConfigurator.labels.height', 'Wysokość okna')}</label>
                    <span className={styles.rangeBadge}>{height} mm</span>
                  </div>
                  <div className={styles.rangeContainer}>
                    <input className={styles.rangeInput} type="range" min="2000" max="3000" step="10" value={height} onChange={handleDimensionChange(setHeight)} />
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.infoCardTitle}>{t('hsConfigurator.info.title', 'Wizualizacja w czasie rzeczywistym')}</span>
                  <p className={styles.infoCardText}>
                    {t(
                      'hsConfigurator.info.description',
                      'Model aktualizuje materiały i proporcje na bieżąco, dzięki czemu łatwiej porównasz warianty przed rozmową handlową.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className={styles.viewerColumn}>
            <div className={styles.viewerWrap}>
              <div className={styles.previewLabel}>{t('hsConfigurator.sections.previewTag', 'PODGLĄD')}</div>
              {!isCanvasReady && (
                <div className={styles.viewerLoadingOverlay} aria-live="polite" aria-busy="true">
                  <div className={styles.viewerSpinner} />
                  <p className={styles.viewerLoadingText}>{t('hsConfigurator.loading', 'Ładowanie konfiguratora…')}</p>
                </div>
              )}
              <Suspense fallback={<div className={styles.canvasFallback} />}>
                <HsConfiguratorCanvas
                  selectedTexture={selectedTexture}
                  selectedHandleTexture={selectedHandleTexture}
                  selectedThreshold={selectedThreshold}
                  width={width}
                  height={height}
                  onReady={handleCanvasReady}
                />
              </Suspense>
            </div>

            <div className={styles.viewerFooter}>
              <div className={styles.viewerNote}>
                {t(
                  'hsConfigurator.viewer.note',
                  'Prezentacja ma charakter poglądowy i pokazuje proporcje, kolorystykę oraz ogólny charakter systemu.'
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
};

export default HsConfiguratorPage;
