// src/components/home/ProductSection.jsx
import React from 'react';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { IoIosArrowForward } from 'react-icons/io';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import { useTranslation } from 'react-i18next';
import { getProductCategoryPath } from '../../../lib/i18n/routing';
import styles from './ProducSection.module.css';

// --- Component ---
const ProductTile = ({ id, product }) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const to = getProductCategoryPath(lang, id);

  return (
    <article className={styles.card}>
      <RouterAgnosticLink className={styles.cardLink} href={to} aria-label={`${product.name} - ${t('common.learnMore', 'Dowiedz się więcej')}`}>
        <div className={styles.imageContainer}>
          <img className={styles.image}
            src={product.backgroundSrc} 
            alt={product.name}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{product.name}</h3>
          <div className={styles.divider} />
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.footer}>
            <span className={styles.linkText}>{product.linkText || t('common.learnMore', 'Dowiedz się więcej')}</span>
            <span className={styles.arrowWrapper} aria-hidden="true">
              <IoIosArrowForward className={styles.arrowIcon} />
            </span>
          </div>
        </div>
      </RouterAgnosticLink>
    </article>
  );
};

const ProductSection = ({ productData }) => {
  const { t } = useTranslation();
  const productIds = Object.keys(productData);

  return (
    <section className={styles.section} aria-labelledby="products-heading">
      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader id="products-heading">
            {t('sections.products')}
          </ProductHeader>
          <ProductHeaderSubtitle>
            {t('sections.productsSubtitle', 'Poznaj nasze systemy okienne i drzwiowe')}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <div className={styles.content}>
          <div className={styles.grid}>
            {productIds.map((id) => (
              <ProductTile
                key={id}
                id={id}
                product={productData[id]}
              />
            ))}
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default ProductSection;