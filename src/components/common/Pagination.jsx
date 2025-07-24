import React from 'react';
import styled from 'styled-components';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${({ active, theme }) => (active ? theme.colors.bottleGreen : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.colors.textLight : theme.colors.textDark)};
  border: 1px solid ${({ theme }) => theme.colors.bottleGreen};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bottleGreen};
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </PageButton>
      );
    }
    return pages;
  };

  return (
    <PaginationWrapper role="navigation" aria-label="Pagination Navigation">
      <PageButton onClick={handlePrev} disabled={currentPage === 1} aria-label="Previous Page">
        &lt;
      </PageButton>
      {renderPageNumbers()}
      <PageButton onClick={handleNext} disabled={currentPage === totalPages} aria-label="Next Page">
        &gt;
      </PageButton>
    </PaginationWrapper>
  );
};

export default Pagination;
