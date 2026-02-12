import React, { useEffect, useMemo, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import Section from '../../../ui/Section';

import styles from './ProductDetailColors.module.css';

export default function ProductDetailColors({
  title = 'Kolorystyka',
  colors,
  colorsRal,
  colorsLazur = [],
  ralTabLabel = 'Kolorystyka RAL',
  lazurTabLabel = 'Lazur',
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
  const activePaletteIndex = activePalette === 'lazur' ? 1 : 0;
  const paletteTabsCount = hasLazur ? 2 : 1;

  const activeColors = activePalette === 'lazur' ? colorsLazur : ralColors;
  if (!Array.isArray(activeColors) || activeColors.length === 0) return null;

  useEffect(() => {
    setSelectedColor(0);
  }, [activePalette]);

  const currentColor = activeColors?.[selectedColor];

  return (
    <div className={styles.colorsSection}>
      <Section>
        <h2 className={styles.sectionTitle}>{title}</h2>

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

        <div className={styles.colorsLayout}>
          <div className={styles.colorSwatchesContainer}>
            <span className={styles.colorSwatchesLabel}>{mostPopularLabel}</span>

            <div className={styles.colorSwatchesGrid}>
              {activeColors.map((color, index) => (
                <button
                  type="button"
                  className={styles.colorSwatchButton}
                  key={color.id}
                  onClick={() => setSelectedColor(index)}
                >
                  <div
                    className={[styles.colorSquare, selectedColor === index ? styles.isActive : null].filter(Boolean).join(' ')}
                    style={{
                      '--swatch-color': color.color || 'transparent',
                      '--swatch-image': color.image ? `url(${color.image})` : 'none',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className={[styles.colorSwatchRal, selectedColor === index ? styles.isActive : null].filter(Boolean).join(' ')}
                  >
                    {color.ral}
                  </span>
                </button>
              ))}
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
              className={[
                styles.colorPreviewMain,
                activePalette === 'lazur' ? styles.colorPreviewMainLazur : null,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                '--preview-color': currentColor?.color || 'transparent',
                '--preview-image': currentColor?.image ? `url(${currentColor.image})` : 'none',
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
