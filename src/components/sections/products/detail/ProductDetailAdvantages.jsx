import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { Trans } from 'react-i18next';
import ImageWithSpinner from '../../../ui/ImageWithSpinner.jsx';

import styles from './ProductDetailAdvantages.module.css';

export default function ProductDetailAdvantages({
  product,
  title,
  i18nPrefix,
  t,
  warrantyImageSrc = '/images/products/windows/gwarancja.png',
}) {
  if (!product?.advantages?.length) return null;

  const count = product.advantages.length;
  const countClass = styles[`count${count}`];
  const isOdd = count % 2 === 1;

  return (
    <div className={styles.advantagesSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div
        className={[
          styles.advantagesGrid,
          countClass,
          isOdd ? styles.oddCount : null,
        ].filter(Boolean).join(' ')}
      >
        {product.advantages.map((advantage, index) => (
          <div className={styles.advantageCard} key={index}>
            <h3 className={styles.advantageTitle}>{advantage.title}</h3>
            <p className={styles.advantageDescription}>{advantage.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.warrantySection}>
        <div className={styles.warrantyBadge}>
          <ImageWithSpinner
            wrapperClassName={styles.warrantyImageWrap}
            className={styles.warrantyImage}
            src={warrantyImageSrc}
            alt={t('common.warranty', 'Gwarancja')}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.warrantyContent}>
          <h3 className={styles.warrantyTitle}>{t(`${i18nPrefix}.warranty.title`, 'Pewność jakości na lata')}</h3>
          <p className={styles.warrantyText}>
            <Trans
              i18nKey={`${i18nPrefix}.warranty.text`}
              defaults="Jesteśmy pewni jakości naszych produktów, dlatego w ciągu <strong>5 lat</strong> od montażu możesz nam zgłosić jakikolwiek problem."
              components={{ strong: <strong /> }}
            />
          </p>
          <div className={styles.warrantyHighlight}>
            <FiCheck />
            <span>{t(`${i18nPrefix}.warranty.highlight`, 'Bezpłatny serwis gwarancyjny')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
