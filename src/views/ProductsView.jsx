import React, { useMemo } from 'react';
import RouterAgnosticLink from '../components/_astro/RouterAgnosticLink.jsx';
import { IoIosArrowForward } from 'react-icons/io';
import Page from '../components/ui/Page';
import Section from '../components/ui/Section';
import SanityImage from '../components/ui/SanityImage.jsx';
import ImageWithSpinner from '../components/ui/ImageWithSpinner.jsx';
import { useTranslation } from 'react-i18next';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import { productCategories } from '../data/products/index.js';
import { getProductCategoryPath } from '../lib/i18n/routing';

import styles from './ProductsView.module.css';

const ProductsPage = ({
  initialProductCountsByCategory = null,
  productsHeaderImage = null,
  categoryCardImages = null,
  breadcrumbPathname,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const longDescriptionByKey = useMemo(() => {
    const locale = (lang || 'pl').split('-')[0];

    if (locale === 'en') {
      return {
        okna:
          'Wooden windows combine natural beauty with excellent insulation, helping maintain thermal comfort all year round. Their timeless look works well in both modern and classic architecture. Thanks to precision craftsmanship, they are durable, stable, and comfortable in daily use.',
        drzwi:
          'Wooden exterior doors provide a prestigious entrance and excellent protection against weather conditions. Solid construction and quality materials deliver durability, good insulation, and long service life. They also offer broad customization options to match your home style.',
      };
    }

    if (locale === 'de') {
      return {
        okna:
          'Holzfenster verbinden natürliche Ästhetik mit sehr guter Wärmedämmung und sorgen das ganze Jahr über für Wohnkomfort. Ihr zeitloses Design passt sowohl zu moderner als auch klassischer Architektur. Durch präzise Verarbeitung sind sie langlebig, stabil und angenehm im täglichen Gebrauch.',
        drzwi:
          'Holz-Außentüren sorgen für einen repräsentativen Eingang und zuverlässigen Schutz vor Witterungseinflüssen. Die solide Konstruktion und hochwertige Materialien bieten Langlebigkeit, gute Dämmwerte und hohen Nutzungskomfort. Zudem ermöglichen sie eine breite Personalisierung passend zur Fassade.',
      };
    }

    return {
      okna:
        'Okna drewniane łączą naturalne piękno materiału z bardzo dobrą izolacją termiczną, dzięki czemu zapewniają komfort o każdej porze roku. Ich ponadczasowy wygląd świetnie pasuje zarówno do nowoczesnych, jak i klasycznych realizacji. Precyzyjne wykonanie przekłada się na trwałość, stabilność i wygodę codziennego użytkowania.',
      drzwi:
        'Drewniane drzwi zewnętrzne to reprezentacyjne wejście do domu i skuteczna ochrona przed warunkami atmosferycznymi. Solidna konstrukcja oraz wysokiej jakości materiały zapewniają trwałość, szczelność i bardzo dobre parametry użytkowe. Szerokie możliwości wykończenia pozwalają idealnie dopasować je do stylu budynku.',
    };
  }, [lang]);

  const categoryCards = useMemo(() => {
    return Object.entries(productCategories)
      .map(([key, category]) => {
        const fallbackCount = Array.isArray(category?.products) ? category.products.length : 0;
        const sanityCount = initialProductCountsByCategory?.[key];
        const productsCount = Number.isFinite(sanityCount) ? sanityCount : fallbackCount;

        const homeTitle =
          key === 'okna'
            ? t('products.windows.name', 'OKNA')
            : key === 'drzwi'
              ? t('products.doors.name', 'DRZWI')
              : t(`productCategories.${key}.title`, category?.title || key);

        const homeImage =
          key === 'okna'
            ? '/images/aboutus/okno-kafelka.webp'
            : key === 'drzwi'
              ? '/images/aboutus/drzwi-kafelka.webp'
              : category?.headerImage || '/images/products/windows/top.jpg';

        return {
          key,
          title: homeTitle,
          subtitle: longDescriptionByKey[key] || t(`productCategories.${key}.subtitle`, category?.subtitle || ''),
          sanityImage: categoryCardImages?.[key] || null,
          image: homeImage,
          productsCount,
          href: getProductCategoryPath(lang, key),
        };
      })
      .filter((card) => card.productsCount > 0);
  }, [categoryCardImages, initialProductCountsByCategory, lang, longDescriptionByKey, t]);

  return (
    <Page
      imageSrc="/images/products/windows/top.jpg"
      headerImage={productsHeaderImage}
      title={t('pageTitle.products', t('nav.products', 'Produkty'))}
      breadcrumbPathname={breadcrumbPathname}
    >
      <Section>
        <HeaderWrap>
          <ProductHeader>{t('sections.products', 'PRODUKTY')}</ProductHeader>
          <ProductHeaderSubtitle>
            {t('sections.productsSubtitle', 'Poznaj nasze systemy okienne i drzwiowe')}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <div className={styles.productsContainer}>
          {categoryCards.map((card) => (
            <article className={styles.productCard} key={card.key}>
              <div className={styles.productInfo}>
                <h2 className={styles.productName}>{card.title}</h2>
                <p className={styles.productDescription}>{card.subtitle}</p>

                <div className={styles.divider} />

                <p className={styles.productCountText}>
                  {t('products.countLabel', 'Liczba produktów:')}{' '}
                  <span className={styles.productCountValue}>{card.productsCount}</span>
                </p>

                <RouterAgnosticLink className={styles.viewMoreButton} to={card.href}>
                  {t('common.viewMore', 'Zobacz więcej')}
                  <IoIosArrowForward />
                </RouterAgnosticLink>
              </div>

              <div className={styles.productImageWrapper}>
                {card.sanityImage ? (
                  <SanityImage
                    wrapperClassName={styles.productImageInner}
                    className={styles.productImage}
                    image={card.sanityImage}
                    placeholder="none"
                    altFallback={card.title}
                    loading="lazy"
                    decoding="async"
                    showSpinner={false}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    widths={[480, 640, 800, 1024, 1280]}
                  />
                ) : (
                  <ImageWithSpinner
                    wrapperClassName={styles.productImageInner}
                    className={styles.productImage}
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    showSpinner={false}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </Page>
  );
};

export default ProductsPage;
