import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail } from 'react-icons/fi';
import Section from '../components/common/Section';
import { COMPANY_ADDRESS, MAP_SRC } from '../constants';
import Page from '../components/common/Page';

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

/* Grid with details + map */
const ContactGrid = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ContactDetails = styled.div`
  line-height: 1.8;
  font-size: 1.6rem;
  text-align: left;

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  .contact-row {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.6rem;
  }

  .icon {
    color: ${({ theme }) => theme.colors.bottleGreenLight};
    font-size: 1.6rem;
    display: flex;
    align-items: center;
  }
`;

const MapSection = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 260px;
  }
`;

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Page imageSrc="/images/company/company-top.jpg" title={t('pageTitle.contact', 'Kontakt')}>
      <Section
        customStyles={`
          background-color: #e9ecef;
        `}
      >
      <ContactContent>

        <ContactGrid>
          <ContactDetails>
            <p>{t('contact.intro', 'Masz pytania? Skontaktuj się z nami!')}</p>

            <div className="contact-row">
              <div className="icon"><FiMail /></div>
              <div>
                <a href="mailto:kontakt@rojek-okna.pl">kontakt@rojek-okna.pl</a>
              </div>
            </div>

            <div className="contact-row">
              <div className="icon"><FiPhone /></div>
              <div>
                <a href="tel:+48123456789">+48 123 456 789</a>
              </div>
            </div>

            <p>
              <strong>{t('contact.address', 'Adres')}:</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>
          </ContactDetails>

          <MapSection>
            <h3>{t('contact.locationTitle', 'Nasza lokalizacja')}</h3>
            <MapContainer>
              <iframe
                src={MAP_SRC}
                title={t('contact.locationTitle', 'Nasza lokalizacja')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </MapContainer>
          </MapSection>
        </ContactGrid>
      </ContactContent>
    </Section>
    </Page>
  );
};

export default ContactPage;
