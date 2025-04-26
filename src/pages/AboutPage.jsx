import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Stylowany wrapper dla sekcji
const AboutPageWrapper = styled.section`
  padding: 60px 20px; /* Więcej paddingu góra/dół */
  min-height: 60vh; /* Minimalna wysokość dla treści */
  background-color: #ffffff; /* Białe tło dla odróżnienia */
  display: flex;
  flex-direction: column;
  align-items: center; /* Wycentruj zawartość */
  justify-content: center;
  text-align: center; /* Wycentruj tekst */

  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
  }

  p {
    font-size: 1.7rem;
    line-height: 1.7;
    max-width: 800px; /* Ogranicz szerokość tekstu dla czytelności */
    color: ${({ theme }) => theme.colors.text};
  }
`;

// Komponent sekcji "O Firmie"
const AboutPage = ({ id }) => {
  const { t } = useTranslation();

  return (
    // Użyj przekazanego ID
    <AboutPageWrapper id={id}>
      <h2>{t('pageTitle.about')}</h2>
      <p>
        Jesteśmy firmą ROJEK okna i drzwi, specjalizującą się w dostarczaniu
        najwyższej jakości stolarki otworowej. Nasza misja to zapewnienie
        bezpieczeństwa, komfortu i estetyki w Państwa domach dzięki nowoczesnym
        i trwałym rozwiązaniom. Poznaj naszą historię i wartości.
        {/* Tutaj dodasz więcej treści, być może pobieranej z Sanity */}
      </p>
    </AboutPageWrapper>
  );
};

export default AboutPage;