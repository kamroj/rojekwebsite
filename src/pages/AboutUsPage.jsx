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
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  justify-items: center;
  gap: 10px;

  /* Ukryj siatkę na mobile - tam pokażemy slider */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const ManagerCard = styled.div`
  position: relative;
  width: 100%;
  min-height: 310px;
  display: flex;
  flex-direction: column;
  height: 460px;
  padding: 6px;
  border-radius: 10px;
  background-color: #fffefe;
  border: 1px solid rgba(0, 0, 0, 0.55);
  overflow: hidden;
  text-align: left;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 15px rgba(0,0,0,0.35);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 420px;
  }
`;

const ManagerPhoto = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
  box-shadow: none;
`;

const ManagerImageWrapper = styled.div`
  position: relative;
  height: 74%;
  width: 100%;
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
  background: rgba(0,0,0,0.25);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 72%;
  }
`;

const ManagerBody = styled.div`
  position: static;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 6px 6px;
  color: rgb(0, 0, 0);
`;

const ManagerName = styled.h4`
  font-size: 1.9rem;
  margin: 0 0 6px 0;
  color: rgb(0, 0, 0);
  font-weight: 400;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
  }
`;

const ManagerRole = styled.p`
  margin: 0;
  color: rgb(0, 0, 0);
  font-size: 1.15rem;
  font-weight: 400;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.35rem;
  }
`;

const ManagerTopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 0;
`;


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
  gap: 10px 16px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: 0;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: black;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 6px 0;
  border-radius: 9999px;
  border: none;
  background: transparent;
  transition: opacity 0.2s ease, color 0.2s ease;

  &:hover {
    color: black;
    opacity: 0.9;
  }

  /* Desktop: nieklikalne (zachowujemy dotychczasową logikę) */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    pointer-events: none;
    cursor: default;
  }

  /* Mobile: chipy */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 10px 14px;
    border: 1px solid rgba(4, 121, 0, 0.575);
    background: rgb(40 79 41);
  }
`;

const ContactIconSmall = styled.div`
  font-size: 1.6rem;
  color: #024600;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
    color: #e2e2e2;
  }
`;

const ContactInfoText = styled.span`
  font-size: 1.05rem;
  color: black;

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

  // Managers data
  const managers = [
    {
      name: 'Wiesław Rojek',
      role: 'Właściciel',
      photo: '/images/realizations/realization2.jpg',
      alt: 'Wiesław Rojek',
      phone: '+48 603 923 011',
      phoneHref: 'tel:+48603923011',
      email: 'wieslaw.rojek@rojekoid.pl',
      emailHref: 'mailto:wieslaw.rojek@rojekoid.pl',
    },
    {
      name: 'Przemysław Rojek',
      role: 'Właściciel',
      photo: '/images/history/przemek.jpg',
      alt: 'Przemysław Rojek',
      phone: '+48 886 988 561',
      phoneHref: 'tel:+48886988561',
      email: 'przemyslaw.rojek@rojekoid.pl',
      emailHref: 'mailto:przemyslaw.rojek@rojekoid.pl',
    },
    {
      name: 'Tomasz Rojek',
      role: 'Właściciel',
      photo: '/images/history/tomek.jpg',
      alt: 'Tomasz Rojek',
      phone: '+48 889 194 388',
      phoneHref: 'tel:+48889194388',
      email: 'tomasz.rojek@rojekoid.pl',
      emailHref: 'mailto:tomasz.rojek@rojekoid.pl',
    },
    {
      name: 'Paweł Jakiśtam',
      role: 'Kierownik produkcji',
      photo: '/images/realizations/realization5.jpg',
      alt: 'Kierownik produkcji',
      phone: '+48 600 000 000',
      phoneHref: 'tel:+48600000000',
      email: 'pawel.jakistam@rojekoid.pl',
      emailHref: 'mailto:pawel.jakistam@rojekoid.pl',
    },
  ];

  const ManagerItem = ({ manager }) => (
    <ManagerCard>
      <ManagerImageWrapper>
        <ManagerPhoto src={manager.photo} alt={manager.alt} />
      </ManagerImageWrapper>
      <ManagerBody>
        <ManagerTopRow>
          <ManagerName>{manager.name}</ManagerName>
        </ManagerTopRow>
        <ManagerRole>{manager.role}</ManagerRole>
        <ContactRow>
          <ContactLink href={manager.phoneHref} aria-label={'Zadzwoń do ' + manager.name.split(' ')[0]}>
            <ContactIconSmall><FiPhone /></ContactIconSmall>
            <ContactInfoText>{manager.phone}</ContactInfoText>
          </ContactLink>
          <ContactLink href={manager.emailHref} aria-label={'Napisz do ' + manager.name.split(' ')[0]}>
            <ContactIconSmall><FiMail /></ContactIconSmall>
            <ContactInfoText>{manager.email}</ContactInfoText>
          </ContactLink>
        </ContactRow>
      </ManagerBody>
    </ManagerCard>
  );

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
    <Page imageSrc="/images/company/company-top.jpg" title={t('pageTitle.about', 'O Firmie')}>
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
      <Section label="ZARZĄD" labelPosition="right" noPadding>
        <HeaderWrap>
          <ProductHeader>
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
            {managers.map((m) => (
              <SwiperSlide key={m.name}>
                <ManagerItem manager={m} />
              </SwiperSlide>
            ))}
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
          {managers.map((m) => (
            <ManagerItem key={m.name} manager={m} />
          ))}
        </ManagementGrid>
      </Section>
    </Page>
  );
};

export default AboutUsPage;
