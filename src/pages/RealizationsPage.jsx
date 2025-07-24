import React, { useState } from 'react';
import styled from 'styled-components';
import RealizationCard from '../components/gallery/RealizationCard';
import Pagination from '../components/common/Pagination';

const PAGE_SIZE = 6;


const PageWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const HeaderImageWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 400px;
  margin-bottom: 40px;
  overflow: hidden;
  border-radius: 0;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgb(0 0 0 / 65%);
    pointer-events: none;
    z-index: 1;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 0;
`;

const HeaderTitle = styled.h1`
  position: absolute;
  bottom: 15px;
  right: 20px;
  margin: 0;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.bottleGreen}cc;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 2.5rem;
  font-weight: 100;
  border-radius: 6px;
  user-select: none;
  z-index: 2;

  @media (max-width: 600px) {
      font-size: 1.8rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px 50px;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px 20px;
    padding: 0 20px;
  }
`;

const FixedSizeCardWrapper = styled.div`
  width: 100%;
  height: 350px;
`;

const exampleRealizations = [
  { id: 1, src: '/public/images/realizations/realization1.jpg', title: 'Realization 1' },
  { id: 2, src: '/public/images/realizations/realization2.jpg', title: 'Realization 2' },
  { id: 3, src: '/public/images/realizations/realization3.jpg', title: 'Realization 3' },
  { id: 4, src: '/public/images/realizations/realization4.jpg', title: 'Realization 4' },
  { id: 5, src: '/public/images/realizations/realization5.jpg', title: 'Realization 5' },
  { id: 6, src: '/public/images/realizations/realization6.jpg', title: 'Realization 6' },
  { id: 7, src: '/public/images/realizations/realization7.jpg', title: 'Realization 7' },
  { id: 8, src: '/public/images/realizations/realization8.jpg', title: 'Realization 8' },
  { id: 9, src: '/public/images/realizations/realization1.jpg', title: 'Realization 9' },
  { id: 10, src: '/public/images/realizations/realization2.jpg', title: 'Realization 10' },
  { id: 11, src: '/public/images/realizations/realization3.jpg', title: 'Realization 11' },
  { id: 12, src: '/public/images/realizations/realization4.jpg', title: 'Realization 12' },
];

const RealizationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(exampleRealizations.length / PAGE_SIZE);

  const currentItems = exampleRealizations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <PageWrapper>
      <HeaderImageWrapper>
        <HeaderImage src="/public/images/realizations/top.jpg" alt="Realizations Header" />
        <HeaderTitle>Realizacje</HeaderTitle>
      </HeaderImageWrapper>
      <Grid id="realizations-grid">
        {currentItems.map(({ id, src, title }) => (
          <FixedSizeCardWrapper key={id}>
            <RealizationCard id={id} src={src} title={title} />
          </FixedSizeCardWrapper>
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          handlePageChange(page);
          // Scroll to top of the grid, not the whole page
          const gridElement = document.querySelector('#realizations-grid');
          if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </PageWrapper>
  );
};

export default RealizationsPage;
