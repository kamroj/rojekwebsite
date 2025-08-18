import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Section from '../components/common/Section';

const PageWrapper = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
`;

/* Header image section - copied from RealizationsPage */
const HeaderImageWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 400px;
  margin-bottom: 40px;
  overflow: hidden;
  border-radius: 0;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgb(0 0 0 / 65%);
    pointer-events: none;
    z-index: 1;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 0;
`;

const HeaderTitle = styled.h1`
  position: absolute;
  bottom: 15px;
  right: 20px;
  margin: 0;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.bottleGreen}cc;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 2.5rem;
  font-weight: 100;
  border-radius: 6px;
  user-select: none;
  z-index: 2;

  @media (max-width: 600px) {
    font-size: 1.8rem;
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
      left: 30px;
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
    padding-left: 60px;
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
    left: 30px;
  }
`;

const YearBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bottleGreen};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
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

  .address {
    background: ${({ theme }) => theme.colors.background};
    padding: 25px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
    margin-top: 30px;
    text-align: left;

    h4 {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.bottleGreen};
      margin-bottom: 15px;
    }

    p {
      font-size: 1.4rem;
      margin: 8px 0;
    }
  }
`;

const HeadquartersImage = styled(motion.div)`
  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
`;

/* Management (team) styles */
const ManagementGrid = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 60px auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ManagerCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  border-radius: 12px;
  padding: 5px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
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
      year: '1981', 
      title: t('history.item1.title', 'Powstanie firmy'), 
      text: t('history.item1.text', 'Założenie rodzinnej firmy ROJEK. Rozpoczęcie produkcji wysokiej jakości stolarki otworowej z pasją i dbałością o każdy detal.')
    },
    { 
      year: '1998', 
      title: t('history.item2.title', 'Rozwój i innowacje'), 
      text: t('history.item2.text', 'Rozbudowa zakładu produkcyjnego i wprowadzenie nowoczesnych technologii. Poszerzenie oferty o nowe linie produktów.')
    },
    { 
      year: '2009', 
      title: t('history.item3.title', 'Ekspansja międzynarodowa'), 
      text: t('history.item3.text', 'Nawiązanie współpracy z renomowanymi partnerami zagranicznymi. Wdrożenie najwyższych standardów jakości.')
    },
    { 
      year: '2018', 
      title: t('history.item4.title', 'Modernizacja produkcji'), 
      text: t('history.item4.text', 'Kompleksowa modernizacja linii produkcyjnych. Wprowadzenie zaawansowanych rozwiązań technologicznych.')
    },
    { 
      year: '2023', 
      title: t('history.item5.title', 'Nowa era'), 
      text: t('history.item5.text', 'Wprowadzenie innowacyjnych systemów drewniano-aluminiowych i przesuwnych HS. Otwarcie na nowe możliwości.')
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper>
      <HeaderImageWrapper>
        <HeaderImage src="/images/realizations/top.jpg" alt="O nas" />
        <HeaderTitle>{t('pageTitle.about', 'O nas')}</HeaderTitle>
      </HeaderImageWrapper>

      {/* History Section */}
      <HistorySection label={t('sections.history', 'HISTORIA')} labelPosition="left">
        <SectionTitle>{t('history.title', 'Nasza Historia')}</SectionTitle>
        
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
      <HeadquartersSection label={t('sections.headquarters', 'SIEDZIBA FIRMY')} labelPosition="right">
        <HeadquartersContent>
          <HeadquartersInfo
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>
              <FiMapPin />
              {t('headquarters.subtitle', 'Nasza lokalizacja')}
            </h3>
            <p>
              {t('headquarters.description1', 'Nasza siedziba znajduje się w malowniczej miejscowości w województwie dolnośląskim. To tutaj, w nowoczesnym zakładzie produkcyjnym, powstają nasze wysokiej jakości okna i drzwi.')}
            </p>
            <p>
              {t('headquarters.description2', 'Zapraszamy do odwiedzenia naszego showroomu, gdzie można zobaczyć pełną gamę naszych produktów oraz uzyskać fachowe doradztwo.')}
            </p>
            
            <div className="address">
              <h4>{t('contact.address', 'Adres')}</h4>
              <p><strong>ROJEK okna i drzwi</strong></p>
              <p>ul. Przykładowa 1</p>
              <p>00-000 Miasto</p>
              <p>woj. dolnośląskie</p>
            </div>
          </HeadquartersInfo>

          <HeadquartersImage
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/images/realizations/realization1.jpg" 
              alt={t('headquarters.imageAlt', 'Siedziba firmy ROJEK')} 
            />
          </HeadquartersImage>
        </HeadquartersContent>
      </HeadquartersSection>

      {/* Management Section */}
      <Section label="MANAGEMENT" labelPosition="left" noPadding>
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
