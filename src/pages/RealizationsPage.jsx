import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const RealizationsPageWrapper = styled.section`
  padding: 60px 20px;
  min-height: 70vh;
  background-color: #f8f9fa; /* Jasnoszare tło */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.large}; /* Większy odstęp */
  }

  /* Placeholder for gallery/items */
  .gallery-placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    font-style: italic;
  }
`;

const RealizationsPage = ({ id }) => {
  const { t } = useTranslation();

  return (
    <RealizationsPageWrapper id={id}>
      <h2>{t('pageTitle.realizations')}</h2>
      <div className="gallery-placeholder">
        (Tutaj pojawi się galeria zdjęć z naszymi realizacjami okien i drzwi)
        {/* Implementacja galerii np. z siatką zdjęć */}
      </div>
    </RealizationsPageWrapper>
  );
};

export default RealizationsPage;