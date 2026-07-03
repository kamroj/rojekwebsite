import React from 'react';
import MaxWidthContainer from './MaxWidthContainer';
import SanityImage from './SanityImage.jsx';
import styles from './PageHeader.module.css';
const PageHeader = ({
  imageSrc = undefined,
  image = undefined,
  title = undefined,
  height = 360,
  id = undefined,
  overlayColor = undefined,
  contentBg = undefined,
  contentColor = undefined,
  contentMaxWidth = '',
  contentMobileCentered = false,
  contentInMaxWidth = false,
  // Performance hints for the header image (often LCP).
  imgLoading = 'eager',
  imgDecoding = 'async',
  imgFetchPriority = 'high',
  imgSizes = '100vw',
  mobileHeight,
  children,
}) => {
  const numericHeight = Number(height);
  const resolvedHeight = Number.isFinite(numericHeight) ? `${numericHeight}px` : '360px';
  const resolvedMobileHeight = Number.isFinite(Number(mobileHeight))
    ? `${Number(mobileHeight)}px`
    : (numericHeight >= 420 ? '320px' : numericHeight >= 360 ? '300px' : numericHeight >= 320 ? '280px' : resolvedHeight);
  const resolvedSmallMobileHeight =
    numericHeight >= 420 ? '300px' : numericHeight >= 360 ? '280px' : numericHeight >= 320 ? '260px' : resolvedMobileHeight;

  return (
    <section className={styles.headerWrapper} id={id}>
      <div
        className={styles.headerImageWrapper}
        style={{
          '--header-height': resolvedHeight,
          '--header-height-mobile': resolvedMobileHeight,
          '--header-height-small': resolvedSmallMobileHeight,
        }}
      >
        {image ? (
          <SanityImage
            className={styles.headerImage}
            image={image}
            altFallback={title || ''}
            loading={imgLoading}
            decoding={imgDecoding}
            fetchPriority={imgFetchPriority}
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
            fetchPriority={imgFetchPriority}
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
                  className={`${styles.headerContent} ${contentMobileCentered ? styles.headerContentMobileCentered : ''}`.trim()}
                  style={{
                    backgroundColor: contentBg || '#0136002b',
                    color: contentColor || '#f8f9fa',
                    maxWidth: contentMaxWidth || undefined,
                  }}
                >
                  {children || <h1>{title}</h1>}
                </div>
              </MaxWidthContainer>
            </div>
          ) : (
            <div
              className={`${styles.headerContent} ${contentMobileCentered ? styles.headerContentMobileCentered : ''}`.trim()}
              style={{
                backgroundColor: contentBg || '#0136002b',
                color: contentColor || '#f8f9fa',
                maxWidth: contentMaxWidth || undefined,
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
