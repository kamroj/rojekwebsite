import React from 'react';
import SanityImage from '../../ui/SanityImage.jsx';
import RouterAgnosticLink from '../../_astro/RouterAgnosticLink.jsx';
import { getArticleDetailPath, getArticlesTagPath } from '../../../lib/i18n/routing.js';

import styles from './ArticleCard.module.css';

export default function ArticleCard({ article, lang = 'pl' }) {
  const {
    slug,
    title,
    excerpt,
    featuredImage,
    author,
    publishedAtFormatted,
    tags,
    readingTime,
  } = article;

  const href = getArticleDetailPath(lang, slug);

  return (
    <article className={styles.card}>
      <RouterAgnosticLink
        href={href}
        className={styles.cardLinkOverlay}
        aria-label={`Przejdź do artykułu: ${title}`}
      />

      <div className={styles.imageContainer}>
        {featuredImage ? (
          <SanityImage
            image={featuredImage}
            altFallback={title}
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 300px"
            widths={[300, 400, 600]}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {readingTime} min czytania
          </span>
          <span className={styles.metaItem}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {publishedAtFormatted}
          </span>
          <span className={styles.metaItem}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Autor: {author}
          </span>
        </div>

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.excerpt}>{excerpt}</p>

        {tags?.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.tags}>
              {tags.slice(0, 3).map((tag) => (
                <RouterAgnosticLink key={tag} href={getArticlesTagPath(lang, tag)} className={styles.tag}>
                  {tag}
                </RouterAgnosticLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}