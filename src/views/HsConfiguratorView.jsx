import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import Page from '../components/ui/Page';
import { getLocalizedWindowColorsPalette } from '../data/products/windows.js';
import { parseHsConfig } from '../lib/hs/configUrl.js';
import { PRICE_STATUS, calculateHsPrice, deriveRanges, formatPln } from '../lib/pricing/hsPrice.js';
import { pickLocale } from '../lib/sanity/i18n.js';
import ArLauncher from './hs-configurator/ar/ArLauncher.jsx';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import {
  ADDON_OPTIONS,
  DEFAULT_ALU_COLOR,
  DEFAULT_WOOD_COLOR,
  HANDLE_FINISHES,
  HEIGHT_RANGE,
  MATERIAL_TYPES,
  THRESHOLDS,
  TYPES,
  WOOD_RAL_COLORS,
  getDefaultWoodKey,
  getLazurPalette,
  resolveWoodFinish,
} from './hs-configurator/hsOptions.js';
import styles from './HsConfiguratorView.module.css';

const HsConfiguratorCanvas = React.lazy(() => import('./hs-configurator/HsConfiguratorCanvas.jsx'));

const WOOD_LABEL_FALLBACKS = { pine: 'Sosna', meranti: 'Meranti', oak: 'Dąb' };

const CONTACT_PATHS = { pl: '/kontakt', en: '/en/contact', de: '/de/kontakt', fr: '/fr/contact' };

// Kompaktowy wybór koloru swatchami (wzorzec sekcji Kolorystyka na stronach
// produktowych): opcjonalne zakładki palet, siatka kwadracików (kolor lub
// miniatura zdjęcia próbki) i wiersz z nazwą + kodem wybranego koloru
const ColorSwatchPicker = ({ tabs, activeTab, onTabChange, options, value, onChange, selectedInfo, ariaLabel }) => (
  <div>
    {tabs ? (
      <div
        className={`${styles.materialTabs} ${styles.paletteTabsCompact}`}
        role="tablist"
        aria-label={ariaLabel}
        style={{
          '--active-index': Math.max(tabs.findIndex((tab) => tab.key === activeTab), 0),
          '--tabs-count': tabs.length,
        }}
      >
        <span className={styles.materialTabsThumb} aria-hidden="true" />
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`${styles.materialTabButton} ${styles.paletteTabButtonCompact} ${activeTab === tab.key ? styles.materialTabButtonActive : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    ) : null}
    <div className={styles.swatchGrid} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          aria-label={`${option.label} (${option.sublabel})`}
          title={`${option.label} (${option.sublabel})`}
          className={`${styles.swatchButton} ${value === option.value ? styles.swatchButtonActive : ''}`}
          onClick={() => onChange(option.value)}
          style={{
            '--swatch-color': option.hex || 'transparent',
            '--swatch-image': option.image ? `url(${option.image})` : 'none',
          }}
        />
      ))}
    </div>
    {selectedInfo ? (
      <div className={styles.swatchSelected}>
        <span className={styles.swatchSelectedName}>{selectedInfo.label}</span>
        <span className={styles.swatchSelectedCode}>{selectedInfo.sublabel}</span>
      </div>
    ) : null}
  </div>
);

const HsConfiguratorPage = ({ pricing = null }) => {
  const { t, i18n } = useTranslation();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [selectedWoodColor, setSelectedWoodColor] = useState({ ...DEFAULT_WOOD_COLOR });
  const [woodPaletteTab, setWoodPaletteTab] = useState(DEFAULT_WOOD_COLOR.palette);
  const [selectedHandleFinish, setSelectedHandleFinish] = useState(HANDLE_FINISHES[0].value);
  const [selectedType, setSelectedType] = useState(TYPES[0].value);
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].value);
  const [selectedMaterialType, setSelectedMaterialType] = useState(MATERIAL_TYPES[0].value);
  const [selectedAluColor, setSelectedAluColor] = useState(DEFAULT_ALU_COLOR);
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
  const [arAutoPrompt, setArAutoPrompt] = useState(false);

  // Ref do głównej grupy modelu w canvasie — ArLauncher klonuje ją do eksportu GLB/USDZ
  const modelExportRef = useRef(null);

  // Odtworzenie konfiguracji z parametrów URL (link z kodu QR). Celowo w efekcie,
  // nie w inicjalizatorach stanu — wyspa jest prerenderowana (client:load), więc
  // odczyt URL przy pierwszym renderze rozjechałby się z hydratacją.
  const didHydrateFromUrl = useRef(false);
  useEffect(() => {
    if (didHydrateFromUrl.current) return;
    didHydrateFromUrl.current = true;
    const parsed = parseHsConfig(window.location.search, { pricing });
    if (!parsed) return;
    setSelectedType(parsed.scheme);
    setWidth(parsed.width);
    setHeight(parsed.height);
    setSelectedWoodColor(parsed.woodColor);
    setWoodPaletteTab(parsed.woodColor.palette);
    setSelectedHandleFinish(parsed.handleFinish);
    setSelectedThreshold(parsed.threshold);
    setSelectedMaterialType(parsed.materialType);
    setSelectedAluColor(parsed.aluColor);
    setSelectedWood(parsed.wood);
    setAddons(parsed.addons);
    setArAutoPrompt(parsed.ar);
  }, [pricing]);

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

  const handleMaterialTypeChange = useCallback((value) => {
    setIsCanvasReady(false);
    setSelectedMaterialType(value);
    // Wzornik lazurów różni się między wariantami — przy zmianie materiału
    // przenosimy wybór lazuru na ten sam numer w nowej palecie (RAL bez zmian)
    setSelectedWoodColor((prev) => {
      if (prev.palette !== 'lazur') return prev;
      const fromPalette = getLazurPalette(prev.palette === 'lazur' ? (value === 'woodAlu' ? 'wood' : 'woodAlu') : 'wood');
      const toPalette = getLazurPalette(value);
      const index = Math.max(
        fromPalette.findIndex((c) => c.value === prev.id),
        0
      );
      return { palette: 'lazur', id: (toPalette[index] ?? toPalette[0]).value };
    });
  }, []);

  const handleWoodColorChange = useCallback(
    (palette) => (id) => {
      setIsCanvasReady(false);
      setSelectedWoodColor({ palette, id });
    },
    []
  );

  const handleAluColorChange = useCallback((id) => {
    setIsCanvasReady(false);
    setSelectedAluColor(id);
  }, []);

  // Gatunek wpływa nie tylko na cenę, ale i na teksturę lazuru w modelu
  const handleWoodChange = useCallback((event) => {
    setIsCanvasReady(false);
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
      options: { woodKey: selectedWood, materialType: selectedMaterialType, ...addons },
    });
  }, [pricing, schemePricing, width, height, selectedWood, selectedMaterialType, addons]);

  // Migawka konfiguracji dla ArLaunchera (eksport AR + serializacja do QR)
  const arConfig = useMemo(
    () => ({
      scheme: selectedType,
      width,
      height,
      woodColor: selectedWoodColor,
      handleFinish: selectedHandleFinish,
      threshold: selectedThreshold,
      materialType: selectedMaterialType,
      aluColor: selectedAluColor,
      wood: selectedWood,
      addons,
    }),
    [
      selectedType,
      width,
      height,
      selectedWoodColor,
      selectedHandleFinish,
      selectedThreshold,
      selectedMaterialType,
      selectedAluColor,
      selectedWood,
      addons,
    ]
  );

  const languageKey = (i18n.language || 'pl').split('-')[0];
  const contactPath = CONTACT_PATHS[languageKey] ?? CONTACT_PATHS.pl;

  // Parametry materiału drewna dla canvasa — kolor RAL (farba) albo tekstura
  // lazuru; gatunek drewna może mieć dedykowaną próbkę lazuru
  const woodFinish = useMemo(
    () => resolveWoodFinish(selectedWoodColor, selectedWood, selectedMaterialType),
    [selectedWoodColor, selectedWood, selectedMaterialType]
  );

  // Opcje swatchy: paleta RAL z lokalizowanymi nazwami ze strony produktowej,
  // lazury ze zdjęciami próbek. Paleta alu = ta sama paleta RAL
  const ralSwatchOptions = useMemo(() => {
    const localized = getLocalizedWindowColorsPalette(languageKey);
    return WOOD_RAL_COLORS.map((color) => ({
      value: color.value,
      hex: color.hex,
      label: localized.find((item) => item.id === color.value)?.name ?? color.ral,
      sublabel: color.ral,
    }));
  }, [languageKey]);

  // Lazury: paleta zależna od wariantu materiału (drewno / drewno-aluminium),
  // miniatura = mapa słojów wybranego gatunku × zmierzony kolor (multiply w CSS,
  // ta sama kompozycja co w materiale 3D). Nazwa PL na stronie polskiej,
  // oryginalna w pozostałych językach
  const lazurSwatchOptions = useMemo(
    () =>
      getLazurPalette(selectedMaterialType).map((color) => ({
        value: color.value,
        image: color.grainImages[selectedWood] ?? color.grainImages.pine,
        hex: color.hex,
        label: languageKey === 'pl' ? color.name : color.nameOrig,
        sublabel: color.nameOrig,
      })),
    [selectedMaterialType, selectedWood, languageKey]
  );

  const woodColorInfo = useMemo(() => {
    const pool = selectedWoodColor.palette === 'ral' ? ralSwatchOptions : lazurSwatchOptions;
    return pool.find((option) => option.value === selectedWoodColor.id) ?? null;
  }, [selectedWoodColor, ralSwatchOptions, lazurSwatchOptions]);

  const aluColorInfo = useMemo(
    () => ralSwatchOptions.find((option) => option.value === selectedAluColor) ?? null,
    [ralSwatchOptions, selectedAluColor]
  );

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
    if (item.key === 'aluminium') {
      const woodAlu = MATERIAL_TYPES.find((option) => option.value === 'woodAlu');
      return `${t(woodAlu.labelKey, woodAlu.fallback)} (+${item.percent}%)`;
    }
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

    const materialType = MATERIAL_TYPES.find((item) => item.value === selectedMaterialType);
    if (materialType) {
      lines.push(`- ${stripColon(t('hsConfigurator.sectionsLabel.material', 'Materiał'))}: ${t(materialType.labelKey, materialType.fallback)}`);
    }
    if (woodColorInfo) {
      lines.push(
        `- ${stripColon(t('hsConfigurator.labels.woodColor', 'Kolor drewna'))}: ${woodColorInfo.label} (${woodColorInfo.sublabel})`
      );
    }
    if (selectedMaterialType === 'woodAlu' && aluColorInfo) {
      lines.push(
        `- ${stripColon(t('hsConfigurator.labels.aluColor', 'Kolor nakładek aluminiowych'))}: ${aluColorInfo.label} (${aluColorInfo.sublabel})`
      );
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
    woodColorInfo,
    aluColorInfo,
    selectedHandleFinish,
    selectedThreshold,
    selectedMaterialType,
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
                  <span className={styles.sectionOverline}>{t('hsConfigurator.sectionsLabel.materials', 'Materiały')}</span>
                </div>

                {pricing ? (
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
                ) : null}

                <div className={styles.controlGroup}>
                  <div
                    className={styles.materialTabs}
                    role="radiogroup"
                    aria-label={t('hsConfigurator.sectionsLabel.material', 'Materiał')}
                    style={{
                      '--active-index': selectedMaterialType === 'woodAlu' ? 1 : 0,
                      '--tabs-count': MATERIAL_TYPES.length,
                    }}
                  >
                    <span className={styles.materialTabsThumb} aria-hidden="true" />
                    {MATERIAL_TYPES.map((material) => {
                      const isSelected = selectedMaterialType === material.value;
                      return (
                        <button
                          key={material.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`${styles.materialTabButton} ${styles.paletteTabButtonCompact} ${isSelected ? styles.materialTabButtonActive : ''}`}
                          onClick={() => handleMaterialTypeChange(material.value)}
                        >
                          {t(material.labelKey, material.fallback)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <label className={styles.label}>{t('hsConfigurator.labels.woodColor', 'Kolor drewna')}</label>
                  <ColorSwatchPicker
                    tabs={[
                      { key: 'ral', label: t('hsConfigurator.options.palettes.ral', 'RAL') },
                      { key: 'lazur', label: t('hsConfigurator.options.palettes.lazur', 'Lazur') },
                    ]}
                    activeTab={woodPaletteTab}
                    onTabChange={setWoodPaletteTab}
                    options={woodPaletteTab === 'ral' ? ralSwatchOptions : lazurSwatchOptions}
                    value={selectedWoodColor.palette === woodPaletteTab ? selectedWoodColor.id : null}
                    onChange={handleWoodColorChange(woodPaletteTab)}
                    selectedInfo={woodColorInfo}
                    ariaLabel={t('hsConfigurator.labels.woodColor', 'Kolor drewna')}
                  />
                </div>

                {selectedMaterialType === 'woodAlu' ? (
                  <div className={styles.controlGroup}>
                    <label className={styles.label}>
                      {t('hsConfigurator.labels.aluColor', 'Kolor nakładek aluminiowych')}
                    </label>
                    <ColorSwatchPicker
                      options={ralSwatchOptions}
                      value={selectedAluColor}
                      onChange={handleAluColorChange}
                      selectedInfo={aluColorInfo}
                      ariaLabel={t('hsConfigurator.labels.aluColor', 'Kolor nakładek aluminiowych')}
                    />
                  </div>
                ) : null}

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
              <ArLauncher
                modelRootRef={modelExportRef}
                isModelReady={isCanvasReady}
                config={arConfig}
                autoPrepare={arAutoPrompt}
              />
              {!isCanvasReady && (
                <div className={styles.viewerLoadingOverlay} aria-live="polite" aria-busy="true">
                  <div className={styles.viewerSpinner} />
                  <p className={styles.viewerLoadingText}>{t('hsConfigurator.loading', 'Ładowanie konfiguratora…')}</p>
                </div>
              )}
              <Suspense fallback={<div className={styles.canvasFallback} />}>
                <HsConfiguratorCanvas
                  selectedWoodFinish={woodFinish}
                  selectedHandleFinish={selectedHandleFinish}
                  selectedType={selectedType}
                  selectedThreshold={selectedThreshold}
                  selectedMaterialType={selectedMaterialType}
                  selectedAluColor={selectedAluColor}
                  width={width}
                  height={height}
                  onReady={handleCanvasReady}
                  exportRef={modelExportRef}
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
