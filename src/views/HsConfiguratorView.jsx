import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import Page from '../components/ui/Page';
import { PRICE_STATUS, calculateHsPrice, deriveRanges, formatPln } from '../lib/pricing/hsPrice.js';
import { pickLocale } from '../lib/sanity/i18n.js';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import styles from './HsConfiguratorView.module.css';

const HsConfiguratorCanvas = React.lazy(() => import('./hs-configurator/HsConfiguratorCanvas.jsx'));

const TEXTURES = [
  { value: '/models/remmers-natur.jpg', labelKey: 'hsConfigurator.options.textures.natur', fallback: 'Natur' },
  { value: '/models/remmers-miodowa-sosna.jpg', labelKey: 'hsConfigurator.options.textures.honeyPine', fallback: 'Miodowa Sosna' },
];

const HANDLE_FINISHES = [
  { value: 'silver', labelKey: 'hsConfigurator.options.handleTextures.silver', fallback: 'Srebrna' },
  { value: 'gold', labelKey: 'hsConfigurator.options.handleTextures.gold', fallback: 'Złota' },
];

// Zakresy szerokości zależne od liczby pól schematu
const WIDTH_2_FIELDS = { min: 2000, max: 4000, default: 2320 };
const WIDTH_3_FIELDS = { min: 2500, max: 4500, default: 3000 };
const WIDTH_4_FIELDS = { min: 3000, max: 5000, default: 3750 };

const TYPES = [
  {
    value: 'a',
    label: 'A',
    image: '/images/hs/schemat-A.png',
    labelKey: 'hsConfigurator.options.schemes.a.label',
    fallback: 'Schemat A',
    descriptionKey: 'hsConfigurator.options.schemes.a.description',
    descriptionFallback: 'Dwa pola z jednym skrzydłem przesuwnym.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'a3',
    label: 'A3',
    image: '/images/hs/schemat-A3.png',
    labelKey: 'hsConfigurator.options.schemes.a3.label',
    fallback: 'Schemat A3',
    descriptionKey: 'hsConfigurator.options.schemes.a3.description',
    descriptionFallback: 'Lustrzane A — skrzydło przesuwne z prawej strony.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'd',
    label: 'D',
    image: '/images/hs/schemat-D.png',
    labelKey: 'hsConfigurator.options.schemes.d.label',
    fallback: 'Schemat D',
    descriptionKey: 'hsConfigurator.options.schemes.d.description',
    descriptionFallback: 'Dwa pola, oba skrzydła przesuwne.',
    widthRange: WIDTH_2_FIELDS,
  },
  {
    value: 'e',
    label: 'E',
    image: '/images/hs/schemat-E.png',
    labelKey: 'hsConfigurator.options.schemes.e.label',
    fallback: 'Schemat E',
    descriptionKey: 'hsConfigurator.options.schemes.e.description',
    descriptionFallback: 'Trzy pola, dwa skrzydła przesuwne w jedną stronę.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'g2',
    label: 'G2',
    image: '/images/hs/schemat-G2.png',
    labelKey: 'hsConfigurator.options.schemes.g2.label',
    fallback: 'Schemat G2',
    descriptionKey: 'hsConfigurator.options.schemes.g2.description',
    descriptionFallback: 'Trzy pola, środkowe skrzydło przesuwne, słupki statyczne.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'g3',
    label: 'G3',
    image: '/images/hs/schemat-G3.png',
    labelKey: 'hsConfigurator.options.schemes.g3.label',
    fallback: 'Schemat G3',
    descriptionKey: 'hsConfigurator.options.schemes.g3.description',
    descriptionFallback: 'Trzy pola, środkowe skrzydło przesuwne, bez słupków statycznych.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'h',
    label: 'H',
    image: '/images/hs/schemat-H.png',
    labelKey: 'hsConfigurator.options.schemes.h.label',
    fallback: 'Schemat H',
    descriptionKey: 'hsConfigurator.options.schemes.h.description',
    descriptionFallback: 'Trzy pola, wszystkie skrzydła przesuwne.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'k',
    label: 'K',
    image: '/images/hs/schemat-K.png',
    labelKey: 'hsConfigurator.options.schemes.k.label',
    fallback: 'Schemat K',
    descriptionKey: 'hsConfigurator.options.schemes.k.description',
    descriptionFallback: 'Szerokie pole stałe pośrodku, skrzydła przesuwne po bokach.',
    widthRange: WIDTH_3_FIELDS,
  },
  {
    value: 'c',
    label: 'C',
    image: '/images/hs/schemat-C.png',
    labelKey: 'hsConfigurator.options.schemes.c.label',
    fallback: 'Schemat C',
    descriptionKey: 'hsConfigurator.options.schemes.c.description',
    descriptionFallback: 'Cztery pola z dwoma środkowymi skrzydłami przesuwnymi.',
    widthRange: WIDTH_4_FIELDS,
  },
  {
    value: 'f',
    label: 'F',
    image: '/images/hs/schemat-F.png',
    labelKey: 'hsConfigurator.options.schemes.f.label',
    fallback: 'Schemat F',
    descriptionKey: 'hsConfigurator.options.schemes.f.description',
    descriptionFallback: 'Cztery pola, wszystkie skrzydła przesuwne.',
    widthRange: WIDTH_4_FIELDS,
  },
];

const THRESHOLDS = [
  { value: 'silver', labelKey: 'hsConfigurator.options.thresholds.silver', fallback: 'Srebrny' },
  { value: 'black', labelKey: 'hsConfigurator.options.thresholds.black', fallback: 'Czarny' },
  { value: 'gold', labelKey: 'hsConfigurator.options.thresholds.gold', fallback: 'Złoty' },
];

// Standardowa wysokość okna HS — domyślna i przywracana przy zmianie schematu
const DEFAULT_HEIGHT = 2040;
const HEIGHT_RANGE = { min: 2000, max: 3000, default: DEFAULT_HEIGHT };

const ADDON_OPTIONS = [
  { key: 'silentClose', labelKey: 'hsConfigurator.addons.silentClose', fallback: 'SilentClose / StopUnit' },
  { key: 'cylinderLock', labelKey: 'hsConfigurator.addons.cylinderLock', fallback: 'Wkładka na klucz' },
  { key: 'outerHandle', labelKey: 'hsConfigurator.addons.outerHandle', fallback: 'Klamka zewnętrzna' },
  { key: 'temperedGlass', labelKey: 'hsConfigurator.addons.temperedGlass', fallback: 'Szyba hartowana' },
];

const WOOD_LABEL_FALLBACKS = { pine: 'Sosna', meranti: 'Meranti', oak: 'Dąb' };

const CONTACT_PATHS = { pl: '/kontakt', en: '/en/contact', de: '/de/kontakt', fr: '/fr/contact' };

const getDefaultWoodKey = (woodSpecies) => {
  if (!woodSpecies?.length) return 'pine';
  const baseSpecies = woodSpecies.find((species) => species.surchargePercent === 0) ?? woodSpecies[0];
  return baseSpecies.key;
};

const HsConfiguratorPage = ({ pricing = null }) => {
  const { t, i18n } = useTranslation();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0].value);
  const [selectedHandleFinish, setSelectedHandleFinish] = useState(HANDLE_FINISHES[0].value);
  const [selectedType, setSelectedType] = useState(TYPES[0].value);
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].value);
  const [width, setWidth] = useState(
    () => deriveRanges(pricing?.schemes?.[TYPES[0].value]?.matrix, TYPES[0].widthRange, HEIGHT_RANGE).width.default
  );
  const [height, setHeight] = useState(
    () => deriveRanges(pricing?.schemes?.[TYPES[0].value]?.matrix, TYPES[0].widthRange, HEIGHT_RANGE).height.default
  );
  const [selectedWood, setSelectedWood] = useState(() => getDefaultWoodKey(pricing?.settings?.woodSpecies));
  const [addons, setAddons] = useState({
    silentClose: false,
    cylinderLock: false,
    outerHandle: false,
    temperedGlass: false,
  });

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

  const handleTypeChange = useCallback(
    (type) => {
      setIsCanvasReady(false);
      setSelectedType(type);
      const typeData = TYPES.find((item) => item.value === type);
      if (!typeData?.widthRange) return;
      const nextRanges = deriveRanges(pricing?.schemes?.[type]?.matrix, typeData.widthRange, HEIGHT_RANGE);
      setWidth(nextRanges.width.default);
      setHeight(nextRanges.height.default);
    },
    [pricing]
  );

  const handleWoodChange = useCallback((event) => {
    setSelectedWood(event.target.value);
  }, []);

  const handleAddonToggle = useCallback((key) => (event) => {
    const { checked } = event.target;
    setAddons((prev) => ({ ...prev, [key]: checked }));
  }, []);

  const selectedTypeData = TYPES.find((type) => type.value === selectedType) ?? TYPES[0];
  const schemePricing = pricing?.schemes?.[selectedType] ?? null;

  const ranges = useMemo(
    () => deriveRanges(schemePricing?.matrix, selectedTypeData.widthRange, HEIGHT_RANGE),
    [schemePricing, selectedTypeData]
  );

  const priceResult = useMemo(() => {
    if (!pricing) return null;
    return calculateHsPrice({
      matrix: schemePricing?.matrix ?? null,
      addonQuantities: schemePricing?.addonQuantities ?? null,
      settings: pricing.settings,
      widthMm: width,
      heightMm: height,
      options: { woodKey: selectedWood, ...addons },
    });
  }, [pricing, schemePricing, width, height, selectedWood, addons]);

  const languageKey = (i18n.language || 'pl').split('-')[0];
  const contactPath = CONTACT_PATHS[languageKey] ?? CONTACT_PATHS.pl;

  // Exact-language Sanity title wins; otherwise the site translation;
  // as a last resort any language from Sanity or the hardcoded fallback.
  const woodLabels = useMemo(() => {
    const labels = {};
    for (const species of pricing?.settings?.woodSpecies ?? []) {
      labels[species.key] =
        species.title?.[languageKey] ||
        t(
          `hsConfigurator.addons.wood.${species.key}`,
          pickLocale(species.title, languageKey) || WOOD_LABEL_FALLBACKS[species.key] || species.key
        );
    }
    return labels;
  }, [pricing, languageKey, t]);

  const getBreakdownLabel = (item) => {
    if (item.key === 'base') return t('hsConfigurator.price.baseLabel', 'Cena bazowa');
    if (item.key === 'wood') return `${woodLabels[selectedWood] ?? selectedWood} (+${item.percent}%)`;
    const addon = ADDON_OPTIONS.find((option) => option.key === item.key);
    const label = addon ? t(addon.labelKey, addon.fallback) : item.key;
    return item.quantity > 1 ? `${label} ×${item.quantity}` : label;
  };

  // Contact link with the current configuration prefilled into the form's message field.
  const quoteHref = useMemo(() => {
    const stripColon = (label) => label.replace(/:\s*$/, '');
    const lines = [
      t('hsConfigurator.price.messageIntro', 'Dzień dobry, proszę o wycenę poniższej konfiguracji HS:'),
      `- ${stripColon(t('hsConfigurator.sectionsLabel.scheme', 'Schemat'))}: ${selectedTypeData.label}`,
      `- ${stripColon(t('hsConfigurator.sections.dimensions', 'Wymiary'))}: ${width} × ${height} mm`,
    ];

    const texture = TEXTURES.find((item) => item.value === selectedTexture);
    if (texture) {
      lines.push(`- ${stripColon(t('hsConfigurator.labels.frameMaterial', 'Materiał ramy'))}: ${t(texture.labelKey, texture.fallback)}`);
    }
    const handleFinish = HANDLE_FINISHES.find((item) => item.value === selectedHandleFinish);
    if (handleFinish) {
      lines.push(`- ${stripColon(t('hsConfigurator.labels.handleColor', 'Kolor klamki'))}: ${t(handleFinish.labelKey, handleFinish.fallback)}`);
    }
    const threshold = THRESHOLDS.find((item) => item.value === selectedThreshold);
    if (threshold) {
      lines.push(`- ${stripColon(t('hsConfigurator.labels.thresholdColor', 'Kolor progu'))}: ${t(threshold.labelKey, threshold.fallback)}`);
    }

    if (pricing) {
      lines.push(`- ${stripColon(t('hsConfigurator.labels.woodSpecies', 'Gatunek drewna'))}: ${woodLabels[selectedWood] ?? selectedWood}`);
      const selectedAddons = ADDON_OPTIONS.filter((addon) => addons[addon.key]).map((addon) =>
        t(addon.labelKey, addon.fallback)
      );
      if (selectedAddons.length) {
        lines.push(`- ${stripColon(t('hsConfigurator.sectionsLabel.addons', 'Dodatki'))}: ${selectedAddons.join(', ')}`);
      }
    }

    if (priceResult?.status === PRICE_STATUS.OK) {
      lines.push(`- ${stripColon(t('hsConfigurator.price.estimatedLabel', 'Szacunkowa cena'))}: ≈ ${formatPln(priceResult.total)}`);
    }

    return `${contactPath}?message=${encodeURIComponent(lines.join('\n'))}`;
  }, [
    t,
    selectedTypeData,
    width,
    height,
    selectedTexture,
    selectedHandleFinish,
    selectedThreshold,
    pricing,
    woodLabels,
    selectedWood,
    addons,
    priceResult,
    contactPath,
  ]);

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
                  <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.scheme', 'Schemat')}</span>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.schemeScrollWrap}>
                    <div
                      className={styles.schemeGrid}
                      role="radiogroup"
                      aria-label={t('hsConfigurator.sectionsLabel.scheme', 'Schemat')}
                    >
                      {TYPES.map((type) => {
                        const isSelected = selectedType === type.value;

                        return (
                          <button
                            key={type.value}
                            type="button"
                            className={`${styles.schemeCard} ${isSelected ? styles.schemeCardActive : ''}`}
                            onClick={() => handleTypeChange(type.value)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <span className={styles.schemeImageWrap}>
                              <img src={type.image} alt="" className={styles.schemeImage} loading="lazy" />
                            </span>
                            <span className={styles.schemeTextWrap}>
                              <span className={styles.schemeTitle}>{t(type.labelKey, type.fallback)}</span>
                              <span className={styles.schemeDescription}>{t(type.descriptionKey, type.descriptionFallback)}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.controlSection} ${styles.controlSectionDivided}`}>
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
                  <select className={styles.select} value={selectedHandleFinish} onChange={handleTextureChange(setSelectedHandleFinish)}>
                    {HANDLE_FINISHES.map((finish) => (
                      <option key={finish.value} value={finish.value}>
                        {t(finish.labelKey, finish.fallback)}
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

              <div className={`${styles.controlSection} ${pricing ? styles.controlSectionDivided : ''}`}>
                <div className={styles.sectionHeaderWrap}>
                  <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.dimensions', 'Proporcje')}</span>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>{t('hsConfigurator.labels.width', 'Szerokość okna')}</label>
                    <span className={styles.rangeBadge}>{width} mm</span>
                  </div>
                  <div className={styles.rangeContainer}>
                    <input
                      className={styles.rangeInput}
                      type="range"
                      min={ranges.width.min}
                      max={ranges.width.max}
                      step="10"
                      value={width}
                      onChange={handleDimensionChange(setWidth)}
                    />
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>{t('hsConfigurator.labels.height', 'Wysokość okna')}</label>
                    <span className={styles.rangeBadge}>{height} mm</span>
                  </div>
                  <div className={styles.rangeContainer}>
                    <input
                      className={styles.rangeInput}
                      type="range"
                      min={ranges.height.min}
                      max={ranges.height.max}
                      step="10"
                      value={height}
                      onChange={handleDimensionChange(setHeight)}
                    />
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

              {pricing ? (
                <div className={styles.controlSection}>
                  <div className={styles.sectionHeaderWrap}>
                    <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.addons', 'Dodatki')}</span>
                  </div>

                  <div className={styles.controlGroup}>
                    <label className={styles.label}>{t('hsConfigurator.labels.woodSpecies', 'Gatunek drewna')}</label>
                    <select className={styles.select} value={selectedWood} onChange={handleWoodChange}>
                      {pricing.settings.woodSpecies.map((species) => {
                        const label = woodLabels[species.key] ?? species.key;
                        return (
                          <option key={species.key} value={species.key}>
                            {species.surchargePercent > 0 ? `${label} (+${species.surchargePercent}%)` : label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className={styles.controlGroup}>
                    {ADDON_OPTIONS.map((addon) => (
                      <label key={addon.key} className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={addons[addon.key]}
                          onChange={handleAddonToggle(addon.key)}
                        />
                        <span className={styles.checkboxLabel}>{t(addon.labelKey, addon.fallback)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <section className={styles.viewerColumn}>
            <div className={styles.viewerWrap}>
              <div className={styles.previewLabel}>{t('hsConfigurator.sections.previewTag', 'PODGLĄD')}</div>
              <div className={styles.activeSchemeBadge}>
                {t('hsConfigurator.activeScheme', 'Aktywny wariant')}: {t(selectedTypeData.labelKey, selectedTypeData.fallback)}
              </div>
              <div className={styles.viewerHint}>
                {t('hsConfigurator.clickHint', 'Kliknij skrzydło, aby otworzyć lub zamknąć')}
              </div>
              {!isCanvasReady && (
                <div className={styles.viewerLoadingOverlay} aria-live="polite" aria-busy="true">
                  <div className={styles.viewerSpinner} />
                  <p className={styles.viewerLoadingText}>{t('hsConfigurator.loading', 'Ładowanie konfiguratora…')}</p>
                </div>
              )}
              <Suspense fallback={<div className={styles.canvasFallback} />}>
                <HsConfiguratorCanvas
                  selectedTexture={selectedTexture}
                  selectedHandleFinish={selectedHandleFinish}
                  selectedType={selectedType}
                  selectedThreshold={selectedThreshold}
                  width={width}
                  height={height}
                  onReady={handleCanvasReady}
                />
              </Suspense>
            </div>

            {priceResult ? (
              <div className={styles.priceCard}>
                {priceResult.status === PRICE_STATUS.OK ? (
                  <>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>
                        {t('hsConfigurator.price.estimatedLabel', 'Szacunkowa cena')}
                      </span>
                      <span className={styles.priceValue}>≈ {formatPln(priceResult.total)}</span>
                    </div>
                    {priceResult.breakdown.length > 1 ? (
                      <details className={styles.priceDetails}>
                        <summary className={styles.priceDetailsSummary}>
                          {t('hsConfigurator.price.detailsLabel', 'Szczegóły wyceny')}
                        </summary>
                        <ul className={styles.priceDetailsList}>
                          {priceResult.breakdown.map((item) => (
                            <li key={item.key} className={styles.priceDetailsItem}>
                              <span>{getBreakdownLabel(item)}</span>
                              <span className={styles.priceDetailsAmount}>{formatPln(item.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : null}
                    <p className={styles.priceDisclaimer}>
                      {t(
                        'hsConfigurator.price.disclaimer',
                        'Cena ma charakter poglądowy i może nieznacznie odbiegać od rzeczywistej wyceny.'
                      )}
                    </p>
                  </>
                ) : (
                  <p className={styles.priceUnavailable}>
                    {t(
                      'hsConfigurator.price.individualQuote',
                      'Dla tej konfiguracji przygotujemy wycenę indywidualną — skontaktuj się z nami.'
                    )}
                  </p>
                )}
                <a className={styles.priceCta} href={quoteHref}>
                  {t('hsConfigurator.price.cta', 'Zapytaj o wycenę')}
                  <FiArrowRight aria-hidden="true" />
                </a>
              </div>
            ) : null}

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

        {priceResult?.status === PRICE_STATUS.OK ? (
          <div className={styles.stickyPriceBar} aria-hidden="true">
            <span className={styles.stickyPriceLabel}>
              {t('hsConfigurator.price.estimatedLabel', 'Szacunkowa cena')}
            </span>
            <span className={styles.stickyPriceValue}>≈ {formatPln(priceResult.total)}</span>
          </div>
        ) : null}
      </div>
    </Page>
  );
};

export default HsConfiguratorPage;
