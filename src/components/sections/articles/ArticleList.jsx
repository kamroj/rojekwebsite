import React from 'react';
import ArticleCard from './ArticleCard.jsx';
import styles from './ArticleList.module.css';

export default function ArticleList({ 
  articles, 
  lang = 'pl',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (!articles?.length) {
    return (
      <div className={styles.empty}>
        <p>Brak artykułów do wyświetlenia.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {articles.map((article) => (
          <ArticleCard 
            key={article.id || article.slug} 
            article={article} 
            lang={lang}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Paginacja artykułów">
          <button
            className={styles.pageButton}
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Poprzednia strona"
          >
            ← Poprzednia
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${styles.pageNumber} ${page === currentPage ? styles.pageNumberActive : ''}`}
                onClick={() => onPageChange?.(page)}
                aria-label={`Strona ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className={styles.pageButton}
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Następna strona"
          >
            Następna →
          </button>
        </nav>
      )}
    </div>
  );
}