import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiDownload, FiPhone } from 'react-icons/fi';
import { useFitText } from '../../../../hooks';
import RouterAgnosticLink from '../../../_astro/RouterAgnosticLink.jsx';
import SanityImage from '../../../ui/SanityImage.jsx';

import styles from './ProductDetailHero.module.css';

export default function ProductDetailHero({
  product,
  categoryLabel,
  longDescriptionContent,
  contactHref = '/kontakt',
  onDownloadCatalog,
  t,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const titleRef = useFitText({ minPx: 22, deps: [product?.name] });

  // Prefer canonical Sanity gallery (array of SanityImage objects).
  // Fallback: legacy `product.images` (array of string URLs).
  const gallery = Array.isArray(product?.gallery) ? product.gallery : [];
  const images = Array.isArray(product?.images) ? product.images : [];
  const hasSanityGallery = gallery.length > 0;
  const totalSlides = hasSanityGallery ? gallery.length : images.length;

  const nextImage = () => {
    if (!totalSlides) return;
    setCurrentImageIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!totalSlides) return;
    setCurrentImageIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <span className={styles.productCategory}>{categoryLabel}</span>
        <h1 className={styles.productTitle} ref={titleRef}>{product?.name}</h1>
        <div className={styles.titleDivider} />
        <p className={styles.productDescription}>{product?.shortDescription}</p>
        <div className={styles.productHighlight}>{longDescriptionContent}</div>

        <div className={styles.buttonsContainer}>
          <RouterAgnosticLink className={styles.primaryButton} href={contactHref}>
            <FiPhone />
            {t?.('common.contactUs', 'Skontaktuj się z nami')}
          </RouterAgnosticLink>
          <button className={styles.outlineButton} type="button" onClick={onDownloadCatalog}>
            <FiDownload />
            {t?.('productDetail.downloadCatalogPdf', 'Pobierz katalog PDF')}
          </button>
        </div>
      </div>

      <div className={styles.heroImageContainer}>
        {hasSanityGallery
          ? gallery.map((image, index) => (
            <SanityImage
              key={image?._key || index}
              image={image}
              altFallback={`${product?.name || 'product'} - zdjęcie ${index + 1}`}
              className={[styles.heroImage, index === currentImageIndex ? styles.isActive : null].filter(Boolean).join(' ')}
              // LCP: first slide is likely visible immediately.
              loading={index === 0 ? 'eager' : 'lazy'}
              // Keep `fetchpriority="high"` reserved for the actual page header (PageHeader).
              fetchpriority="auto"
              sizes="(max-width: 1024px) 100vw, 50vw"
              widths={[640, 800, 1024, 1280, 1600]}
            />
          ))
          : images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product?.name || 'product'} - zdjęcie ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchpriority={index === 0 ? 'high' : undefined}
              className={[styles.heroImage, index === currentImageIndex ? styles.isActive : null].filter(Boolean).join(' ')}
            />
          ))}

        {totalSlides > 1 && (
          <>
            <button
              className={[styles.sliderArrow, styles.left].join(' ')}
              onClick={prevImage}
              type="button"
              aria-label={t?.('navigation.previous', 'Poprzedni')}
            >
              <IoIosArrowBack />
            </button>
            <button
              className={[styles.sliderArrow, styles.right].join(' ')}
              onClick={nextImage}
              type="button"
              aria-label={t?.('navigation.next', 'Następny')}
            >
              <IoIosArrowForward />
            </button>
            <div className={styles.sliderNav}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${t?.('navigation.goToSlide', 'Przejdź do slajdu')} ${index + 1}`}
                  className={[styles.sliderDot, index === currentImageIndex ? styles.isActive : null].filter(Boolean).join(' ')}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
