// src/pages/RealizationsPage.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import RealizationsGallery from '../components/gallery/RealizationsGallery';

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

// Example realization data
const realizationData = [
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Dom jednorodzinny, Wrocław' },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Nowoczesne osiedle, Poznań' },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Renowacja kamienicy, Kraków' },
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Biurowiec klasy A, Warszawa' },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Lofty w starej fabryce, Łódź' },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Willa pod miastem, Gdańsk' },
  { id: 7, src: '/images/realizations/realization3.jpg', title: 'Kamienica zabytkowa, Kraków' },
  { id: 8, src: '/images/realizations/realization5.jpg', title: 'Apartamenty loftowe, Łódź' },
  { id: 9, src: '/images/realizations/realization1.jpg', title: 'Rezydencja prywatna, Wrocław' },
];

const RealizationsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitleContainer>
        <h2>{t('pageTitle.realizations', 'Realizacje')}</h2>
        <p>Poniżej prezentujemy wybrane projekty, które realizowaliśmy dla naszych klientów. Każde zlecenie to dla nas nowe wyzwanie, któremu stawiamy czoła z pasją i profesjonalizmem.</p>
      </PageTitleContainer>

      {/* Galeria realizacji z ciemnym tłem */}
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