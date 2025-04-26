import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ContactPageWrapper = styled.section`
  padding: 60px 20px;
  min-height: 50vh;
  background-color: #e9ecef; /* Inne tło */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

   h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
  }

   /* Placeholder for contact form/details */
  .contact-details {
    margin-top: ${({ theme }) => theme.spacings.medium};
    line-height: 1.8;
    font-size: 1.6rem;
  }
`;

const ContactPage = ({ id }) => {
  const { t } = useTranslation();

  return (
    <ContactPageWrapper id={id}>
      <h2>{t('pageTitle.contact')}</h2>
      <div className="contact-details">
        <p>Masz pytania? Skontaktuj się z nami!</p>
        <p>Email: kontakt@rojek-okna.pl (przykład)</p>
        <p>Telefon: +48 123 456 789 (przykład)</p>
        <p>Adres: ul. Przykładowa 1, 00-000 Miasto (przykład)</p>
        {/* Można tu dodać formularz kontaktowy */}
      </div>
    </ContactPageWrapper>
  );
};

export default ContactPage;