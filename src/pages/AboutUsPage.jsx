import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiPhone, FiMail, FiCheckCircle } from 'react-icons/fi';
import Section from '../components/common/Section';
import { COMPANY_ADDRESS, MAP_SRC } from '../constants';
import Page from '../components/common/Page';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomePage';
import { IoIosArrowForward } from 'react-icons/io';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


const IntroText = styled(motion.div)`
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

const TimelineContainer = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 30px 0;

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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 60px;
    margin-bottom: 60px;
    padding: 50px 0;
  }
`;

const HeadquartersContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "info image";
  gap: 60px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "image"
      "info";
    gap: 24px;
    padding: 0 1vw;
    width: 100vw;
    max-width: none;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 24px;
    padding: 0 1vw;
    width: 100vw;
    max-width: none;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
  }
`;

const HeadquartersInfo = styled(motion.div)`
  grid-area: info;
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
        width: 100%;
        margin: 0 auto;
        border-radius: 0;
        height: 240px;
        box-shadow: none;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    h3 {
      font-size: 1.8rem;
    }
    p {
      font-size: 1.35rem;
    }
    .address {
      margin-top: 20px;
    }
  }
`;

const HeadquartersImage = styled(motion.div)`
  grid-area: image;
  position: relative;
  overflow: visible;
  width: 100%;
  min-width: 550px;
  height: 520px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 4px;
    box-shadow: none;
    display: block;
    position: relative;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 320px;
    overflow: visible;
    min-width: auto;

    img {
      position: static;
      left: auto;
      transform: none;
      width: 100%;
      max-width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      border-radius: 0;
      box-shadow: none;
      display: block;
      margin: 0 auto;
    }
  }
`;

/* Management (team) styles */
const ManagementGrid = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  justify-items: center;
  gap: 28px;

  /* Ukryj siatkę na mobile - tam pokażemy slider */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const ManagerCard = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid transparent;
  background:
    linear-gradient(${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}) padding-box,
    linear-gradient(180deg, ${({ theme }) => theme.colors.bottleGreenLight}33, transparent) border-box;
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 34px rgba(0,0,0,0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.bottleGreen} 0%, transparent 70%);
    pointer-events: none;
    z-index: 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0;
  }
`;

const ManagerPhoto = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  height: auto;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin: 0;
  box-shadow: none;
`;

const ManagerBody = styled.div`
  padding: 16px 16px 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 14px 14px 16px;
  }
`;

const ManagerName = styled.h4`
  font-size: 1.9rem;
  margin: 8px 0 8px 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
  }
`;

const ManagerRole = styled.p`
  display: inline-block;
  margin: 0;
  margin-bottom: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bottleGreenLight}22;
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-size: 1.15rem;
  font-weight: 600;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.35rem;
  }
`;

/* Mobile slider (na wzór WhyUs) */
const MobileSwiperContainer = styled.div`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  .swiper {
    width: 100%;
    padding: 20px 0 20px;
    overflow: visible;
    cursor: grab;
  }

  .swiper-slide {
    height: auto;
    display: flex;
    justify-content: center;
    padding: 0 4px;
  }
`;

const MobileSideArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 44px;
  height: 64px;
  border: none;
  background: transparent;
  color: #015123;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => disabled ? 0.35 : 1};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: transform 0.18s ease, opacity ${({ theme }) => theme.transitions.default};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  svg {
    width: 2.2rem;
    height: 2.2rem;
    color: #015123;
    transform: translateX(0);
    transition: transform 0.18s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(4px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileSideArrowLeft = styled(MobileSideArrow)`
  left: 8px;
  svg {
    transform: rotate(180deg) translateX(0);
  }
  &:hover:not(:disabled) svg {
    transform: rotate(180deg) translateX(-4px);
  }
`;

const MobileSideArrowRight = styled(MobileSideArrow)`
  right: 8px;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 40px;
  
  @media (min-width: 1400px) {
    display: none;
  }
`;

const NavigationButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 8px 14px;
  border-radius: 8px;
  background-color: transparent;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  color: #015123;
  font-size: 1.8rem;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default},
              border-color ${({ theme }) => theme.transitions.default};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  svg {
    display: block;
    width: 1.2em;
    height: 1.2em;
    color: #015123;
    transition: transform 0.22s ease, color 0.22s ease;
    transform: translateX(0);
  }

  &:hover:not(:disabled) {
    background-color: rgba(1, 85, 8, 0.08);
    border-color: ${({ theme }) => theme.colors.bottleGreen};
  }

  &:hover:not(:disabled) svg {
    transform: translateX(6px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 6px 12px;
    font-size: 2.2rem;
  }
`;

const PrevNavigationButton = styled(NavigationButton)`
  svg {
    transform: rotate(180deg) translateX(0);
  }

  &:hover:not(:disabled) svg {
    transform: rotate(180deg) translateX(-6px);
  }
`;

const NextNavigationButton = styled(NavigationButton)`
  svg {
    transform: translateX(0);
  }

  &:hover:not(:disabled) svg {
    transform: translateX(6px);
  }
`;

/* Contact inside manager card */
const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
  margin-top: 28px;
  margin-bottom: 12px;

  /* Desktop: mniejsze odstępy i bardziej kompaktowo */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
    margin-top: 18px;
    margin-bottom: 0;
  }
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 1.2rem;
  padding: 14px 20px;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background});
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  /* Desktop: bez chipów/obramowania i mniejsze odstępy/gabaryty */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    background: none;
    border: none;
    padding: 0;
    gap: 8px;
    font-size: 1.05rem;
  }

  /* Zachowujemy obecną logikę: na desktop linki są nieaktywne (tylko mobile klikalny) */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    pointer-events: none;
    cursor: default;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.bottleGreen};
    border-color: ${({ theme }) => theme.colors.bottleGreenLight};
    box-shadow: 0 6px 14px rgba(7,65,32,0.08);
  }
`;

const ContactIconSmall = styled.div`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.bottleGreen};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ContactInfoText = styled.span`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

/* Services list with custom arrow bullets */
const ServicesList = styled.ul`
  list-style: none;
  margin: auto auto 2rem 2rem;
  padding: 0;
`;

const ServiceItem = styled.li`
  position: relative;
  padding-left: 28px;
  line-height: 1.9;
  margin: 0.2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.45em;
    width: 16px;
    height: 16px;
    background-image: url('/images/arrow.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const AboutUsPage = () => {
  const { t } = useTranslation();

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goToPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

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

  const WhyUsContainer = styled.div`
    display: flex;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      flex-direction: column;
      gap: 30px;
    }
  `;

  const WhyUsContentContainer = styled.div`
    color: ${({ theme }) => theme.colors.text};
    

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      padding-right: 3rem;
    }
    `;

  return (
    <Page imageSrc="/images/company/company-top.jpg" height={500} title={t('pageTitle.about', 'O Firmie')}>
      <Section>
        <HeaderWrap>
          <ProductHeader>
            DLACZEGO MY
          </ProductHeader>
          <ProductHeaderSubtitle>Co odróznia nas od innych</ProductHeaderSubtitle>
        </HeaderWrap>
        <WhyUsContainer>
          <WhyUsContentContainer>
            <p>
              {t(
                'aboutPage.lead',
                'Dogodna lokalizacja stolarni przy granicy administracyjnej Krakowa, nowoczesny park maszynowy oraz hala o powierzchni 1200 m² dają nam wiele możliwości, aby zrealizować każde Państwa zamówienie. Zapewniamy konkurencyjne ceny oraz doświadczenie i profesjonalizm załogi w realizacji zleceń.'
              )}
            </p>
            <p>
              {t('aboutPage.invite', 'Zapraszamy osoby prywatne oraz firmy do składania zapytań ofertowych w następujących dziedzinach:')}
            </p>
            <ServicesList>
              <ServiceItem>{t('aboutPage.services.0', { defaultValue: 'Okna jednoramowe (eurookna) standardowe i stylizowane' })}</ServiceItem>
              <ServiceItem>{t('aboutPage.services.1', { defaultValue: 'Okna drewniane skrzynkowe' })}</ServiceItem>
              <ServiceItem>{t('aboutPage.services.2', { defaultValue: 'Rekonstrukcje i renowacje stolarki zabytkowej' })}</ServiceItem>
              <ServiceItem>{t('aboutPage.services.3', { defaultValue: 'Okna drewniane ppoż. EI30, EI60' })}</ServiceItem>
              <ServiceItem>{t('aboutPage.services.4', { defaultValue: 'Drzwi drewniane ppoż. stylizowane dla obiektów zabytkowych' })}</ServiceItem>
            </ServicesList>
            <p>
              {t('aboutPage.partnersIntro', 'Ponadto posiadamy skład fabryczny i jesteśmy bezpośrednim dystrybutorem następujących firm:')}
            </p>
            <ServicesList>
              <ServiceItem>{t('aboutPage.partners.0', { defaultValue: 'Okna PCV firmy OKNO-POL oraz SONAROL' })}<br /></ServiceItem>
              <ServiceItem>{t('aboutPage.partners.1', { defaultValue: 'Drzwi wewnętrzne i wejściowe firmy CENTURION' })}</ServiceItem>
            </ServicesList>
          </WhyUsContentContainer>
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
        </WhyUsContainer>
      </Section>

      <Section>
        <HeaderWrap $reversed>
          <ProductHeader $reversed>
            NASZA HISTORIA
          </ProductHeader>
          <ProductHeaderSubtitle>Jak zmienialiśmy się przez lata</ProductHeaderSubtitle>
        </HeaderWrap>
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
      </Section>

      {/* Company Headquarters Section */}

      {/* <Section>
        <HeaderWrap>
          <ProductHeader>
            LOKALIZACJA
          </ProductHeader>
          <ProductHeaderSubtitle>Sprawdź jak do nasz dojechać</ProductHeaderSubtitle>
        </HeaderWrap>
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
        </HeadquartersContent>
      </Section> */}

      {/* Management Section */}
      <Section label="ZARZĄD" labelPosition="right" noPadding>
        <HeaderWrap $reversed>
          <ProductHeader $reversed>
            MANAGEMENT
          </ProductHeader>
          <ProductHeaderSubtitle>Poznaj nasz zespół</ProductHeaderSubtitle>
        </HeaderWrap>
        <MobileSwiperContainer>
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            onSlideChange={handleSlideChange}
            onSwiper={handleSlideChange}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                centeredSlides: false,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 28,
              },
            }}
            speed={400}
            className="managers-swiper"
          >
            <SwiperSlide>
              <ManagerCard>
                <ManagerPhoto src="/images/realizations/realization2.jpg" alt="Wiesław Rojek" />
                <ManagerBody>
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
                </ManagerBody>
              </ManagerCard>
            </SwiperSlide>

            <SwiperSlide>
              <ManagerCard>
                <ManagerPhoto src="/images/history/przemek.jpg" alt="Przemysław Rojek" />
                <ManagerBody>
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
                </ManagerBody>
              </ManagerCard>
            </SwiperSlide>

            <SwiperSlide>
              <ManagerCard>
                <ManagerPhoto src="/images/history/tomek.jpg" alt="Tomasz Rojek" />
                <ManagerBody>
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
                </ManagerBody>
              </ManagerCard>
            </SwiperSlide>

            <SwiperSlide>
              <ManagerCard>
                <ManagerPhoto src="/images/realizations/realization5.jpg" alt="Kierownik produkcji" />
                <ManagerBody>
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
                </ManagerBody>
              </ManagerCard>
            </SwiperSlide>
          </Swiper>

          <NavigationContainer>
            <PrevNavigationButton
              onClick={goToPrev}
              disabled={isBeginning}
              aria-label={t('navigation.previous', 'Poprzedni')}
            >
              <IoIosArrowForward />
            </PrevNavigationButton>
            <NextNavigationButton
              onClick={goToNext}
              disabled={isEnd}
              aria-label={t('navigation.next', 'Następny')}
            >
              <IoIosArrowForward />
            </NextNavigationButton>
          </NavigationContainer>
        </MobileSwiperContainer>

        <ManagementGrid>
          <ManagerCard>
            <ManagerPhoto src="/images/realizations/realization2.jpg" alt="Wiesław Rojek" />
            <ManagerBody>
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
            </ManagerBody>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/history/przemek.jpg" alt="Przemysław Rojek" />
            <ManagerBody>
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
            </ManagerBody>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/history/tomek.jpg" alt="Tomasz Rojek" />
            <ManagerBody>
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
            </ManagerBody>
          </ManagerCard>

          <ManagerCard>
            <ManagerPhoto src="/images/realizations/realization5.jpg" alt="Kierownik produkcji" />
            <ManagerBody>
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
            </ManagerBody>
          </ManagerCard>
        </ManagementGrid>
      </Section>
    </Page>
  );
};

export default AboutUsPage;
