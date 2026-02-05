import React, { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import Section from '../../../ui/Section';

import styles from './ProductDetailColors.module.css';

export default function ProductDetailColors({
  colors,
  title,
  mostPopularLabel,
  fullPaletteLabel,
  fullPaletteHref = 'https://www.ralcolorchart.com/',
  t: _t,
}) {
  const [selectedColor, setSelectedColor] = useState(0);
  if (!Array.isArray(colors) || colors.length === 0) return null;
  const currentColor = colors?.[selectedColor];

  return (
    <div className={styles.colorsSection}>
      <Section>
        <h2 className={styles.sectionTitle}>{title}</h2>

        <div className={styles.colorsLayout}>
          <div className={styles.colorSwatchesContainer}>
            <span className={styles.colorSwatchesLabel}>{mostPopularLabel}</span>

            <div className={styles.colorSwatchesGrid}>
              {colors.map((color, index) => (
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

            <a className={styles.fullPaletteLink} href={fullPaletteHref} target="_blank" rel="noopener noreferrer">
              {fullPaletteLabel}
              <FiExternalLink />
            </a>
          </div>

          <div className={styles.colorPreviewContainer}>
            <div
              className={styles.colorPreviewMain}
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
