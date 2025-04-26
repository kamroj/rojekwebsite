// src/pages/ContactPage.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Section from '../components/common/Section';

const ContactContent = styled.div`
  padding: 3rem 0;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
  }
`;

const ContactDetails = styled.div`
  margin-top: ${({ theme }) => theme.spacings.medium};
  line-height: 1.8;
  font-size: 1.6rem;
  text-align: center;
  
  p {
    margin-bottom: 1rem;
  }
`;

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Section
      customStyles={`
        background-color: #e9ecef;
      `}
    >
      <ContactContent>
        <h2>{t('pageTitle.contact', 'Kontakt')}</h2>
        <ContactDetails>
          <p>Masz pytania? Skontaktuj się z nami!</p>
          <p>Email: kontakt@rojek-okna.pl (przykład)</p>
          <p>Telefon: +48 123 456 789 (przykład)</p>
          <p>Adres: ul. Przykładowa 1, 00-000 Miasto (przykład)</p>
        </ContactDetails>
      </ContactContent>
    </Section>
  );
};

export default ContactPage;