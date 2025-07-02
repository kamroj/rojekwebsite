// src/components/layout/Footer.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail } from 'react-icons/fi';

const FooterWrapper = styled.footer`
  background: linear-gradient(127deg, #000000 50%, #003d29);
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

// Główny kontener z danymi kontaktowymi i mapą
const FooterMainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

// Kontener z danymi kontaktowymi
const ContactSection = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #017e54;
    font-weight: 500;
  }
`;

// Grupa kontaktowa (osoba + funkcja)
const ContactGroup = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Funkcja/rola osoby - teraz na górze
const ContactRole = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 100;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Nazwa osoby
const ContactName = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

// Kontener dla kontaktu (telefon/email)
const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.textLight};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.default};
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

// Ikona kontaktu
const ContactIcon = styled.div`
  color: ${({ theme }) => theme.colors.bottleGreenLight};
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// Tekst kontaktu
const ContactText = styled.span`
  font-size: 1.4rem;
`;

// Kontener mapy
const MapSection = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #017e54;
    font-weight: 500;
  }
`;

// Kontener iframe mapy
const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 250px;
  }
`;

// Copyright na dole
const CopyrightSection = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(248, 249, 250, 0.2);
  
  p {
    margin-bottom: 0;
    font-size: 1.4rem;
    color: rgba(248, 249, 250, 0.8);
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Adres dla mapy Google
  const companyAddress = "FPHU.PRZ Stolarnia Wiesław Rojek, Krakowiaków 26, 32-060 Kryspinów";
  const encodedAddress = encodeURIComponent(companyAddress);

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterMainContent>
          {/* Sekcja kontaktowa */}
          <ContactSection>
            <h3>Kontakt</h3>
            
            <ContactGroup>
              <ContactRole>Wyceny, zapytania</ContactRole>
              <ContactName>Wiesław Rojek</ContactName>
              <ContactInfo>
                <a href="tel:+48603923011">
                  <ContactIcon><FiPhone /></ContactIcon>
                  <ContactText>+48 603 923 011</ContactText>
                </a>
              </ContactInfo>
              <ContactInfo>
                <a href="mailto:biuro.rojek@rojekoid.pl">
                  <ContactIcon><FiMail /></ContactIcon>
                  <ContactText>biuro@rojekoid.pl</ContactText>
                </a>
              </ContactInfo>
              <ContactInfo>
                <a href="mailto:biuro.rojek@rojekoid.pl">
                  <ContactIcon><FiMail /></ContactIcon>
                  <ContactText>wieslaw.rojek@rojekoid.pl</ContactText>
                </a>
              </ContactInfo>
            </ContactGroup>
            <ContactGroup>
              <ContactRole>Dystrybucja, markieting, produkcja</ContactRole>
              <ContactName>Tomasz Rojek</ContactName>
              <ContactInfo>
                <a href="tel:+48889194388">
                  <ContactIcon><FiPhone /></ContactIcon>
                  <ContactText>+48 889 194 388</ContactText>
                </a>
              </ContactInfo>
              <ContactInfo>
                <a href="mailto:tomasz.rojek@rojekoid.pl">
                  <ContactIcon><FiMail /></ContactIcon>
                  <ContactText>tomasz.rojek@rojekoid.pl</ContactText>
                </a>
              </ContactInfo>
              <ContactName>Przemysław Rojek</ContactName>
              <ContactInfo>
                <a href="tel:+48886988561">
                  <ContactIcon><FiPhone /></ContactIcon>
                  <ContactText>+48 886 988 561</ContactText>
                </a>
              </ContactInfo>
              <ContactInfo>
                <a href="mailto:przemyslaw.rojek@rojekoid.pl">
                  <ContactIcon><FiMail /></ContactIcon>
                  <ContactText>przemyslaw.rojek@okno-expert.pl</ContactText>
                </a>
              </ContactInfo>
            </ContactGroup>
          </ContactSection>

          {/* Sekcja mapy */}
          <MapSection>
            <h3>Nasza lokalizacja</h3>
            <MapContainer>
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.8982345678!2d19.8912345!3d50.0123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471644c5e2e5e5e5%3A0x123456789abcdef!2sKrakowiakow%2026%2C%2032-060%20Kryspinow!5e0!3m2!1spl!2spl!4v1234567890123!5m2!1spl!2spl`}
                title="Mapa lokalizacji FPHU.PRZ Stolarnia Wiesław Rojek"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </MapContainer>
          </MapSection>
        </FooterMainContent>

        {/* Sekcja copyright */}
        <CopyrightSection>
          <p>© {currentYear} ROJEK okna i drzwi. Wszystkie prawa zastrzeżone.</p>
        </CopyrightSection>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;