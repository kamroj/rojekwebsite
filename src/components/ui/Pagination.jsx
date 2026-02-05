import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1, { via: 'arrow' });
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1, { via: 'arrow' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      pages.push(
        <button
          key={i}
          className={isActive ? `${styles.button} ${styles.buttonActive}` : styles.button}
          onClick={() => onPageChange(i, { via: 'number' })}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={styles.wrapper} role="navigation" aria-label="Pagination Navigation">
      <button
        className={styles.button}
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        className={styles.button}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
