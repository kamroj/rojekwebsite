import React from 'react';
import SanityPortableText from '../../../portable/SanityPortableText';

import styles from './ProductDetailFeatures.module.css';

export default function ProductDetailFeatures({ product, title, t }) {
  // `t` is kept for API compatibility with older callsites.
  const _t = t;

  if (!product?.features?.length) return null;

  return (
    <div className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div className={styles.featuresLayout}>
        <div className={styles.videoWrapper}>
          <video className={styles.productVideo} src={product.video} autoPlay loop muted playsInline />
        </div>

        <div className={styles.featuresContent}>
          {product.features.map((feature, index) => (
            <div className={styles.featureItem} key={index}>
              {Array.isArray(feature) ? (
                <div className={styles.featureText}>
                  <SanityPortableText value={feature} variant="compact" />
                </div>
              ) : (
                <p className={styles.featureText} dangerouslySetInnerHTML={{ __html: feature?.text || '' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
