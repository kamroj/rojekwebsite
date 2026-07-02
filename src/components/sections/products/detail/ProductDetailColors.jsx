import React, { useEffect, useMemo, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import Section from '../../../ui/Section';

import styles from './ProductDetailColors.module.css';

// Gatunki drewna w zakładce Lazur — kolejność stała, klucze zgodne z
// LAZUR_GRAIN_IMAGES / LAZUR_COLORS (data/products)
const SPECIES_KEYS = ['pine', 'meranti', 'oak'];

// Wpisy lazurów w architekturze "słoje × kolor": mapa słojów per gatunek
// (grainImages) + jeden zmierzony kolor (hex); składanie w CSS przez
// background-blend-mode: multiply. Pozostałe palety (RAL) mają płaski color/image.
const resolveSwatch = (color, species) => {
  if (color?.hex && color?.grainImages) {
    return { hex: color.hex, image: color.grainImages[species] };
  }
  return { hex: color?.color, image: color?.image };
};

export default function ProductDetailColors({
  title = 'Kolorystyka',
  colors,
  colorsRal,
  colorsLazur = [],
  ralTabLabel = 'Kolorystyka RAL',
  lazurTabLabel = 'Lazur',
  speciesTabLabels = { pine: 'Sosna', meranti: 'Meranti', oak: 'Dąb' },
  mostPopularLabel,
  fullPaletteLabel,
  fullPaletteHref = 'https://www.ralcolorchart.com/',
  t: _t,
}) {
  const ralColors = useMemo(() => {
    if (Array.isArray(colorsRal) && colorsRal.length > 0) return colorsRal;
    if (Array.isArray(colors) && colors.length > 0) return colors;
    return [];
  }, [colorsRal, colors]);

  const hasLazur = Array.isArray(colorsLazur) && colorsLazur.length > 0;
  const [activePalette, setActivePalette] = useState('ral');
  const [selectedColor, setSelectedColor] = useState(0);
  const [species, setSpecies] = useState(SPECIES_KEYS[0]);
  const activePaletteIndex = activePalette === 'lazur' ? 1 : 0;
  const paletteTabsCount = hasLazur ? 2 : 1;

  const activeColors = activePalette === 'lazur' ? colorsLazur : ralColors;

  useEffect(() => {
    setSelectedColor(0);
  }, [activePalette]);

  if (!Array.isArray(activeColors) || activeColors.length === 0) return null;

  const currentColor = activeColors?.[selectedColor];
  const currentSwatch = resolveSwatch(currentColor, species);
  const hasSpecies = activePalette === 'lazur' && activeColors.some((color) => color?.hex && color?.grainImages);

  return (
    <div className={styles.colorsSection}>
      <Section>
        <h2 className={styles.sectionTitle}>{title}</h2>

        <div className={styles.tabsStack}>
        <div
          className={styles.paletteTabs}
          role="tablist"
          aria-label="Wybór palety kolorów"
          style={{
            '--active-index': activePaletteIndex,
            '--tabs-count': paletteTabsCount,
          }}
        >
          <span className={styles.paletteTabsThumb} aria-hidden="true" />

          <button
            type="button"
            role="tab"
            aria-selected={activePalette === 'ral'}
            className={[styles.paletteTabButton, activePalette === 'ral' ? styles.isActive : null].filter(Boolean).join(' ')}
            onClick={() => setActivePalette('ral')}
          >
            {ralTabLabel}
          </button>
          {hasLazur ? (
            <button
              type="button"
              role="tab"
              aria-selected={activePalette === 'lazur'}
              className={[styles.paletteTabButton, activePalette === 'lazur' ? styles.isActive : null].filter(Boolean).join(' ')}
              onClick={() => setActivePalette('lazur')}
            >
              {lazurTabLabel}
            </button>
          ) : null}
        </div>

        {hasSpecies ? (
          <div
            className={`${styles.paletteTabs} ${styles.speciesTabs}`}
            role="tablist"
            aria-label="Gatunek drewna"
            style={{
              '--active-index': Math.max(SPECIES_KEYS.indexOf(species), 0),
              '--tabs-count': SPECIES_KEYS.length,
            }}
          >
            <span className={styles.paletteTabsThumb} aria-hidden="true" />
            {SPECIES_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={species === key}
                className={[styles.paletteTabButton, styles.speciesTabButton, species === key ? styles.isActive : null]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSpecies(key)}
              >
                {speciesTabLabels[key] ?? key}
              </button>
            ))}
          </div>
        ) : null}
        </div>

        <div className={styles.colorsLayout}>
          <div className={styles.colorSwatchesContainer}>
            <span className={styles.colorSwatchesLabel}>{mostPopularLabel}</span>

            <div className={styles.colorSwatchesGrid}>
              {activeColors.map((color, index) => {
                const swatch = resolveSwatch(color, species);
                return (
                <button
                  type="button"
                  className={styles.colorSwatchButton}
                  key={color.id}
                  onClick={() => setSelectedColor(index)}
                >
                  <div
                    className={[styles.colorSquare, selectedColor === index ? styles.isActive : null].filter(Boolean).join(' ')}
                    style={{
                      '--swatch-color': swatch.hex || 'transparent',
                      '--swatch-image': swatch.image ? `url(${swatch.image})` : 'none',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className={[styles.colorSwatchRal, selectedColor === index ? styles.isActive : null].filter(Boolean).join(' ')}
                  >
                    {color.ral}
                  </span>
                </button>
                );
              })}
            </div>

            {activePalette === 'ral' ? (
              <a className={styles.fullPaletteLink} href={fullPaletteHref} target="_blank" rel="noopener noreferrer">
                {fullPaletteLabel}
                <FiExternalLink />
              </a>
            ) : null}
          </div>

          <div className={styles.colorPreviewContainer}>
            <div
              className={styles.colorPreviewMain}
              style={{
                '--preview-color': currentSwatch.hex || 'transparent',
                '--preview-image': currentSwatch.image ? `url(${currentSwatch.image})` : 'none',
              }}
            />
            <div className={styles.colorPreviewInfo}>
              <h3 className={styles.colorPreviewName}>{currentColor?.name}</h3>
              <span className={styles.colorPreviewRal}>{currentColor?.ral}</span>
              <p className={styles.colorPreviewDescription}>{currentColor?.description}</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
