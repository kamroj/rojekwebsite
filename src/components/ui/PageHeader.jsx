import React from 'react';
import MaxWidthContainer from './MaxWidthContainer';
import SanityImage from './SanityImage.jsx';
import styles from './PageHeader.module.css';
const PageHeader = ({
  imageSrc,
  image,
  title,
  height = 300,
  id,
  overlayColor,
  contentBg,
  contentColor,
  contentInMaxWidth = false,
  // Performance hints for the header image (often LCP).
  imgLoading = 'eager',
  imgDecoding = 'async',
  imgFetchPriority = 'high',
  imgSizes = '100vw',
  children,
}) => {
  return (
    <section className={styles.headerWrapper} id={id}>
      <div className={styles.headerImageWrapper} style={{ height: height ? `${height}px` : '300px' }}>
        {image ? (
          <SanityImage
            className={styles.headerImage}
            image={image}
            altFallback={title || ''}
            loading={imgLoading}
            decoding={imgDecoding}
            fetchpriority={imgFetchPriority}
            sizes={imgSizes}
            // Full-bleed header typically needs large widths.
            widths={[640, 800, 1024, 1280, 1600, 2000, 2400]}
          />
        ) : (
          <img
            className={styles.headerImage}
            src={imageSrc}
            alt={title || ''}
            loading={imgLoading}
            decoding={imgDecoding}
            fetchpriority={imgFetchPriority}
          />
        )}
        <div
          className={styles.overlay}
          style={{ backgroundColor: overlayColor || 'rgba(0,0,0,0.65)' }}
        />
        {(title || children) && (
          contentInMaxWidth ? (
            <div className={styles.headerContentLayer}>
              <MaxWidthContainer>
                <div
                  className={styles.headerContent}
                  style={{
                    backgroundColor: contentBg || '#0136002b',
                    color: contentColor || '#f8f9fa',
                  }}
                >
                  {children || <h1>{title}</h1>}
                </div>
              </MaxWidthContainer>
            </div>
          ) : (
            <div
              className={styles.headerContent}
              style={{
                backgroundColor: contentBg || '#0136002b',
                color: contentColor || '#f8f9fa',
              }}
            >
              {children || <h1>{title}</h1>}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default PageHeader;
