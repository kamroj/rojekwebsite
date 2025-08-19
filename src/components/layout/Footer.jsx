import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail } from 'react-icons/fi';
import { COMPANY_ADDRESS, MAP_SRC } from '../../constants';

const FooterWrapper = styled.footer`
  background: linear-gradient(127deg, #000000 50%, #003d29);
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

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

const ContactSection = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 500;
  }
`;

const ContactGroup = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactRole = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 100;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContactName = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

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

const ContactIcon = styled.div`
  color: ${({ theme }) => theme.colors.bottleGreenLight};
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ContactText = styled.span`
  font-size: 1.4rem;
`;

const MapSection = styled.div`
  h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 500;
  }
`;

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

  const contactData = [
    {
      role: t('contact.roles.quotes'),
      people: [
        {
          name: t('contact.people.wieslaw'),
          phone: '+48 603 923 011',
          emails: ['biuro@rojekoid.pl', 'wieslaw.rojek@rojekoid.pl']
        }
      ]
    },
    {
      role: t('contact.roles.distribution'),
      people: [
        {
          name: t('contact.people.przemyslaw'),
          phone: '+48 886 988 561',
          emails: ['przemyslaw.rojek@rojekoid.pl']
        },
        {
          name: t('contact.people.tomasz'),
          phone: '+48 889 194 388',
          emails: ['tomasz.rojek@rojekoid.pl']
        }
      ]
    }
  ];

  const companyAddress = COMPANY_ADDRESS;
  const mapSrc = MAP_SRC;

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterMainContent>
          <ContactSection>
            <h3>{t('contact.contactTitle')}</h3>
            
            {contactData.map((group, groupIndex) => (
              <ContactGroup key={groupIndex}>
                <ContactRole>{group.role}</ContactRole>
                {group.people.map((person, personIndex) => (
                  <div key={personIndex}>
                    <ContactName>{person.name}</ContactName>
                    <ContactInfo>
                      <a 
                        href={`tel:${person.phone.replace(/\s/g, '')}`}
                        aria-label={`${t('contact.phone')}: ${person.phone}`}
                      >
                        <ContactIcon><FiPhone /></ContactIcon>
                        <ContactText>{person.phone}</ContactText>
                      </a>
                    </ContactInfo>
                    {person.emails.map((email, emailIndex) => (
                      <ContactInfo key={emailIndex}>
                        <a 
                          href={`mailto:${email}`}
                          aria-label={`${t('contact.email')}: ${email}`}
                        >
                          <ContactIcon><FiMail /></ContactIcon>
                          <ContactText>{email}</ContactText>
                        </a>
                      </ContactInfo>
                    ))}
                  </div>
                ))}
              </ContactGroup>
            ))}
          </ContactSection>

          <MapSection>
            <h3>{t('contact.locationTitle')}</h3>
            <MapContainer>
              <iframe
                src={mapSrc}
                title={t('contact.locationTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </MapContainer>
          </MapSection>
        </FooterMainContent>

        <CopyrightSection>
          <p>{t('footer.copy', { year: currentYear })}</p>
        </CopyrightSection>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;
