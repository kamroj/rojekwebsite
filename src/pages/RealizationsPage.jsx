// src/pages/RealizationsPage.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Section from '../components/common/Section';
import RealizationsGallery from '../components/gallery/RealizationsGallery';

const RealizationsContent = styled.div`
  padding: 2rem 0;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.large};
  }
`;

// Example realization data
const realizationData = [
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Dom jednorodzinny, Wrocław' },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Nowoczesne osiedle, Poznań' },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Renowacja kamienicy, Kraków' },
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Biurowiec klasy A, Warszawa' },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Lofty w starej fabryce, Łódź' },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Willa pod miastem, Gdańsk' },
];

const RealizationsPage = () => {
  const { t } = useTranslation();

  return (
    <Section
      customStyles={`
        background-color: #f8f9fa;
      `}
    >
      <RealizationsContent>
        <h2>{t('pageTitle.realizations', 'Realizacje')}</h2>
        
        {/* If we have realizations data, display the gallery */}
        {realizationData && realizationData.length > 0 ? (
          <RealizationsGallery 
            images={realizationData}
            options={{
              slidesPerViewDesktop: 3,
              slidesPerViewTablet: 2,
              slidesPerViewMobile: 1,
            }}
          />
        ) : (
          <div className="gallery-placeholder">
            (Tutaj pojawi się galeria zdjęć z naszymi realizacjami okien i drzwi)
          </div>
        )}
      </RealizationsContent>
    </Section>
  );
};

export default RealizationsPage;