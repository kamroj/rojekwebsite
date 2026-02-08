import React from 'react';
import SanityImage from '../../ui/SanityImage.jsx';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { getArticleDetailPath } from '../../../lib/i18n/routing.js';

import styles from './RelatedArticles.module.css';

function RelatedArticleCard({ article, lang }) {
  const href = getArticleDetailPath(lang, article.slug);

  return (
    <article className={styles.card}>
      <RouterAgnosticLink href={href} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          {article.featuredImage ? (
            <SanityImage
              image={article.featuredImage}
              altFallback={article.title}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 300px"
              widths={[200, 300, 400]}
              loading="lazy"
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>
        <div className={styles.cardContent}>
          <span className={styles.readingTime}>{article.readingTime} min czytania</span>
          <h3 className={styles.cardTitle}>{article.title}</h3>
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
        </div>
      </RouterAgnosticLink>
    </article>
  );
}

export default function RelatedArticles({ articles, lang = 'pl', title = 'Inne artykuły' }) {
  if (!articles?.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {articles.map((article) => (
          <RelatedArticleCard
            key={article.id || article.slug}
            article={article}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}