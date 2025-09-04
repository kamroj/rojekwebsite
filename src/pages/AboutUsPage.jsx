import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiPhone, FiMail, FiCheckCircle } from 'react-icons/fi';
import Section from '../components/common/Section';
import { COMPANY_ADDRESS, MAP_SRC } from '../constants';
import PageHeader from '../components/common/PageHeader';

const PageWrapper = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 2;

  /* Normalize heading sizes only for About page */
  h1 {
    font-size: 2.2rem !important;
  }

  h2 {
    font-size: 1.8rem !important;
  }

  h3 {
    font-size: 1.4rem !important;
  }

  h4 {
    font-size: 1.4rem !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    h1 {
      font-size: 1.8rem !important;
    }
    h2 {
      font-size: 1.6rem !important;
    }
    h3,
    h4 {
      font-size: 1.3rem !important;
    }
  }
`;



/* History Section */
const HistorySection = styled(Section)`
  margin-top: 80px;
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  color: ${({ theme }) => theme.colors.bottleGreen};
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 300;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
  }
`;

const IntroText = styled(motion.div)`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 60px;

  p {
    font-size: 1.6rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 1.4rem;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: left !important;

    p {
      text-align: left !important;
    }
  }
`;

/* About-specific variants and styled list for services */
const AboutIntro = styled(IntroText)`
  text-align: left;

  p {
    text-align: left;
  }

  /* Ensure list items have consistent font-size on About page (fix mobile scaling) */
  ul {
    font-size: 1.4rem !important;
    line-height: 1.8 !important;
    margin: 0 0 1.5rem 0 !important;
  }

  li {
    font-size: 1.4rem !important;
    margin-bottom: 0.6rem !important;
  }

  /* Also target the inline-styled ul in JSX to be safe */
  & > ul[style] {
    font-size: 1.4rem !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    ul, li, & > ul[style] {
      font-size: 1.3rem !important;
    }
  }
`;

const ServicesList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 18px;
  max-width: 900px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 18px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 18px 20px;
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.04);
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px rgba(0,0,0,0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 14px;
  }
`;

const ServiceIcon = styled.div`
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 12px;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.bottleGreenLight}22, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-size: 1.4rem;
  box-shadow: 0 6px 14px rgba(7,65,32,0.06);
`;

const ServiceContent = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 6px 0;
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.98rem;
    line-height: 1.5;
    opacity: 0.95;
  }
`;

/* Timeline */
const TimelineContainer = styled.div`
  position: relative;
  padding: 30px 0;
  max-width: 900px;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${({ theme }) => theme.colors.bottleGreenLight} 10%,
      ${({ theme }) => theme.colors.bottleGreenLight} 90%,
      transparent
    );
    transform: translateX(-50%);

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${({ $align }) => $align === 'left' ? 'flex-start' : 'flex-end'};
  padding: 20px 0;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
    padding-left: 40px;
  }
`;

const TimelineCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  border-radius: 12px;
  padding: 28px;
  width: 48%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: 22px;
  }
`;

const TimelineMarker = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.colors.bottleGreen};
  border: 4px solid ${({ theme }) => theme.colors.bottleGreenLight};
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(7, 65, 32, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    left: 20px;
  }
`;

const YearBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #01491f;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const TimelineTitle = styled.h3`
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 15px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.6rem;
  }
`;

const TimelineText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
  line-height: 1.7;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.3rem;
  }
`;

/* Company Headquarters Section */
const HeadquartersSection = styled(Section)`
  margin-top: 100px;
  margin-bottom: 80px;
  padding: 80px 0;
`;

const HeadquartersContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const HeadquartersInfo = styled(motion.div)`
  text-align: left;

  h3 {
    font-size: 2.2rem;
    color: ${({ theme }) => theme.colors.bottleGreen};
    margin-bottom: 18px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-start;

    svg {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.5rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 20px;
    text-align: left;
  }

  /* Simplified address/map styling:
     - remove framed background and header "Adres" in JSX
     - on mobile make map full-bleed
  */
  .address {
    margin-top: 30px;
    text-align: left;

    .map-wrapper {
      width: 100%;
      height: 360px;
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      .map-wrapper {
        width: calc(100% + 40px);
        margin-left: -20px;
        border-radius: 0;
        height: 220px;
        box-shadow: none;
      }
    }
  }
`;

const HeadquartersImage = styled(motion.div)`
  position: relative;
  overflow: visible;
  width: 100%;
  height: 520px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 12px;
    box-shadow: none;
    display: block;
    position: relative;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* mobile: make image full-bleed using viewport width + translate technique */
    width: 100%;
    height: 320px;
    overflow: visible;

    img {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 100vw;
      max-width: none;
      height: 320px;
      object-fit: cover;
      object-position: center center;
      border-radius: 0;
      box-shadow: none;
      display: block;
    }
  }
`;

/* Management (team) styles */
const ManagementGrid = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 60px auto 0;
  display: grid;
  /* create columns that are at most 220px wide; grid will fit as many as possible */
  grid-template-columns: repeat(auto-fit, minmax(0, 220px));
  justify-content: center;
  gap: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 20px;
  }

  /* on very small viewports keep a single column (one card per row) */
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ManagerCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 220px; /* never allow a card to be wider than 220px */
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    /* on very small mobile let card span full width */
    max-width: none;
    width: 100%;
    margin: 0;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const ManagerPhoto = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 14px;
`;

const ManagerName = styled.h4`
  font-size: 1.6rem;
  margin: 6px 0 4px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ManagerRole = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

/* Contact inside manager card */
const ContactRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 2px;
    align-items: center;
      margin-top: 16px;
  }
`;

const ContactLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  font-size: 0.95rem;

  /* On desktop show icon next to text and make non-interactive */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    gap: 8px;
    pointer-events: none;
    cursor: default;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.bottleGreen};
  }
`;

const ContactIconSmall = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.bottleGreenLight};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem; /* larger icons on mobile for easier tapping */
  }
`;

const ContactInfoText = styled.span`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const AboutUsPage = () => {
  const { t } = useTranslation();

  // Timeline data
  const timeline = [
    {
      year: 'Od 1994',
      title: t('history.item1.title'),
      text: t('history.item1.text')
    },
    {
      year: '2002',
      title: t('history.item2.title'),
      text: t('history.item2.text')
    },
    {
      year: '2012',
      title: t('history.item3.title'),
      text: t('history.item3.text')
    },
    {
      year: '2014',
      title: t('history.item4.title'),
      text: t('history.item4.text')
    },
    {
      year: '2016',
      title: t('history.item5.title'),
      text: t('history.item5.text')
    },
    {
      year: '2019',
      title: t('history.item6.title'),
      text: t('history.item6.text')
    },
    {
      year: '2020',
      title: t('history.item7.title'),
      text: t('history.item7.text')
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper>
      <PageHeader imageSrc="/images/company/company-top.jpg" height={400} title={t('pageTitle.about', 'O Firmie')} />

      {/* About (O nas) Section */}
      <Section label={t('sections.aboutUs', 'O NAS')} labelPosition="left" noPadding>
        <AboutIntro
          data-aos="fade-up"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>
            {t(
              'aboutPage.lead',
              'Dogodna lokalizacja stolarni przy granicy administracyjnej Krakowa, nowoczesny park maszynowy oraz hala o powierzchni 1200 m² dają nam wiele możliwości, aby zrealizować każde Państwa zamówienie. Zapewniamy konkurencyjne ceny oraz doświadczenie i profesjonalizm załogi w realizacji zleceń.'
            )}
          </p>
          <p>
            {t('aboutPage.invite', 'Zapraszamy osoby prywatne oraz firmy do składania zapytań ofertowych w następujących dziedzinach:')}
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', maxWidth: 900, margin: '1rem auto 2rem', lineHeight: 1.9 }}>
            <li>{t('aboutPage.services.0', { defaultValue: 'Okna jednoramowe (eurookna) standardowe i stylizowane' })}</li>
            <li>{t('aboutPage.services.1', { defaultValue: 'Okna drewniane skrzynkowe' })}</li>
            <li>{t('aboutPage.services.2', { defaultValue: 'Rekonstrukcje i renowacje stolarki zabytkowej' })}</li>
            <li>{t('aboutPage.services.3', { defaultValue: 'Okna drewniane ppoż. EI30, EI60' })}</li>
            <li>{t('aboutPage.services.4', { defaultValue: 'Drzwi drewniane ppoż. stylizowane dla obiektów zabytkowych' })}</li>
          </ul>

          <p style={{ fontWeight: 600, marginTop: '1rem' }}>
            {t('aboutPage.partnersIntro', 'Ponadto posiadamy skład fabryczny i jesteśmy bezpośrednim dystrybutorem następujących firm:')}
          </p>
            <p style={{ textAlign: 'left', maxWidth: 900, margin: '0 auto 2rem' }}>
            • {t('aboutPage.partners.0', { defaultValue: 'Okna PCV firmy OKNO-POL oraz SONAROL' })}<br />
            • {t('aboutPage.partners.1', { defaultValue: 'Drzwi wewnętrzne i wejściowe firmy CENTURION' })}
          </p>
        </AboutIntro>
      </Section>

      {/* History Section */}
      <HistorySection label={t('sections.history', 'HISTORIA')} labelPosition="right">
        <IntroText
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>
            {t('history.intro1', 'Firma ROJEK to rodzinne przedsiębiorstwo z ponad 40-letnią tradycją. Od samego początku stawiamy na najwyższą jakość, indywidualne podejście do klienta oraz ciągły rozwój.')}
          </p>
          <p>
            {t('history.intro2', 'Nasza historia to opowieść o pasji, determinacji i nieustannym dążeniu do doskonałości. Każdy etap naszego rozwoju był przemyślany i ukierunkowany na dostarczanie produktów spełniających najwyższe standardy.')}
          </p>
        </IntroText>

        <TimelineContainer>
          {timeline.map((item, index) => (
            <TimelineItem
              key={item.year}
              $align={index % 2 === 0 ? 'left' : 'right'}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TimelineCard
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <YearBadge>
                  <FiCalendar />
                  {item.year}
                </YearBadge>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineText>{item.text}</TimelineText>
              </TimelineCard>
              <TimelineMarker />
            </TimelineItem>
          ))}
        </TimelineContainer>
      </HistorySection>

      {/* Company Headquarters Section */}
      <HeadquartersSection label={t('sections.headquarters', 'SIEDZIBA FIRMY')} labelPosition="left">
        <HeadquartersContent>
          <HeadquartersInfo
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p>
              {t('headquarters.description1', 'Nasza siedziba znajduje się w malowniczej miejscowości w województwie dolnośląskim. To tutaj, w nowoczesnym zakładzie produkcyjnym, powstają nasze wysokiej jakości okna i drzwi.')}
            </p>
            
            <div className="address">
              {/* header "Adres" intentionally removed per request */}
              <div className="map-wrapper">
                <iframe
                  src={MAP_SRC}
                  title={t('headquarters.mapTitle', 'Mapa siedziby')}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </HeadquartersInfo>

          <HeadquartersImage
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/images/company/company-building.jpg" 
              alt={t('headquarters.imageAlt', 'Siedziba firmy ROJEK')} 
            />
          </HeadquartersImage>
        </HeadquartersContent>
      </HeadquartersSection>

      {/* Management Section */}
      <Section label="ZARZĄD" labelPosition="right" noPadding>
        <ManagementGrid>
          <ManagerCard>
            <ManagerPhoto src="/images/realizations/realization2.jpg" alt="Wiesław Rojek" />
            <ManagerName>Wiesław Rojek</ManagerName>
            <ManagerRole>Właściciel</ManagerRole>
            <ContactRow>
              <ContactLink href="tel:+48603923011" aria-label="Zadzwoń do Wiesław">
                <ContactIconSmall><FiPhone /></ContactIconSmall>
                <ContactInfoText>+48 603 923 011</ContactInfoText>
              </ContactLink>
              <ContactLink href="mailto:wieslaw.rojek@rojekoid.pl" aria-label="Napisz do Wiesław">
                <ContactIconSmall><FiMail /></ContactIconSmall>
                <ContactInfoText>wieslaw.rojek@rojekoid.pl</ContactInfoText>
              </ContactLink>
            </ContactRow>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/history/przemek.jpg" alt="Przemysław Rojek" />
            <ManagerName>Przemysław Rojek</ManagerName>
            <ManagerRole>Właściciel</ManagerRole>
            <ContactRow>
              <ContactLink href="tel:+48886988561" aria-label="Zadzwoń do Przemysław">
                <ContactIconSmall><FiPhone /></ContactIconSmall>
                <ContactInfoText>+48 886 988 561</ContactInfoText>
              </ContactLink>
              <ContactLink href="mailto:przemyslaw.rojek@rojekoid.pl" aria-label="Napisz do Przemysław">
                <ContactIconSmall><FiMail /></ContactIconSmall>
                <ContactInfoText>przemyslaw.rojek@rojekoid.pl</ContactInfoText>
              </ContactLink>
            </ContactRow>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/history/tomek.jpg" alt="Tomasz Rojek" />
            <ManagerName>Tomasz Rojek</ManagerName>
            <ManagerRole>Właściciel</ManagerRole>
            <ContactRow>
              <ContactLink href="tel:+48889194388" aria-label="Zadzwoń do Tomasz">
                <ContactIconSmall><FiPhone /></ContactIconSmall>
                <ContactInfoText>+48 889 194 388</ContactInfoText>
              </ContactLink>
              <ContactLink href="mailto:tomasz.rojek@rojekoid.pl" aria-label="Napisz do Tomasz">
                <ContactIconSmall><FiMail /></ContactIconSmall>
                <ContactInfoText>tomasz.rojek@rojekoid.pl</ContactInfoText>
              </ContactLink>
            </ContactRow>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/realizations/realization5.jpg" alt="Kierownik produkcji" />
            <ManagerName>Paweł Jakiśtam</ManagerName>
            <ManagerRole>Kierownik produkcji</ManagerRole>
            <ContactRow>
              <ContactLink href="tel:+48600000000" aria-label="Zadzwoń do Paweł">
                <ContactIconSmall><FiPhone /></ContactIconSmall>
                <ContactInfoText>+48 600 000 000</ContactInfoText>
              </ContactLink>
              <ContactLink href="mailto:pawel.jakistam@rojekoid.pl" aria-label="Napisz do Anna">
                <ContactIconSmall><FiMail /></ContactIconSmall>
                <ContactInfoText>pawel.jakistam@rojekoid.pl</ContactInfoText>
              </ContactLink>
            </ContactRow>
          </ManagerCard>
        </ManagementGrid>
      </Section>
    </PageWrapper>
  );
};

export default AboutUsPage;
