// src/pages/RealizationsPage.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import RealizationsGallery from '../components/gallery/RealizationsGallery';
import { REALIZATION_IMAGES } from '../constants';

// Stylizowany kontener dla tytułu strony
const PageTitleContainer = styled.div`
  background-color: #1a1a1a; /* Ciemne tło dla nagłówka */
  padding: 60px 20px 30px;
  text-align: center;
  
  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.textLight}; /* Jasny tekst na ciemnym tle */
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight}; /* Jasny tekst na ciemnym tle */
    opacity: 0.8;
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.6rem;
  }
`;

const RealizationsPage = () => {
  const { t } = useTranslation();

  // Create realization data with translations
  const realizationData = REALIZATION_IMAGES.map((img, index) => ({
    ...img,
    title: t(`realizations.items.${index}.title`, `Realizacja ${index + 1}`)
  }));

  return (
    <>
      <PageTitleContainer>
        <h2>{t('sections.realizations')}</h2>
        <p>{t('realizations.description', 'Poniżej prezentujemy wybrane projekty, które realizowaliśmy dla naszych klientów. Każde zlecenie to dla nas nowe wyzwanie, któremu stawiamy czoła z pasją i profesjonalizmem.')}</p>
      </PageTitleContainer>

      <RealizationsGallery 
        images={realizationData}
        options={{
          slidesPerViewDesktop: 3,
          slidesPerViewTablet: 2,
          slidesPerViewMobile: 1,
          delay: 3000,
        }}
      />
    </>
  );
};

export default RealizationsPage;
