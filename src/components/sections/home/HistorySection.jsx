import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

const PageWrapper = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
`;

/* Header image section */
const HeaderImageWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 400px;
  margin-bottom: 60px;
  overflow: hidden;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 300px;
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

const HeaderContent = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 40px;
  }
`;

const HeaderTitle = styled(motion.h1)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

const HeaderSubtitle = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.3rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.1rem;
  }
`;

/* Main content section */
const ContentSection = styled.section`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 20px 80px;
`;

const IntroText = styled(motion.div)`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;

  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: left;
  }
`;

/* Timeline section */
const TimelineContainer = styled.div`
  position: relative;
  padding: 40px 0;
  
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 30px;
  width: 45%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const TimelineMarker = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.colors.bottleGreen};
  border: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(230, 198, 25, 0.2);

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
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const TimelineTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const TimelineText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0;
`;

/* Call to action section */
const CTASection = styled(motion.section)`
  background: ${({ theme }) => theme.colors.bottleGreen};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 60px 20px;
  text-align: center;
  margin-top: 80px;
  border-radius: 20px;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-left: auto;
  margin-right: auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0 0 20px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  margin: 0 0 30px 0;
  opacity: 0.9;
`;

const CTAButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bottleGreen};
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(230, 198, 25, 0.3);
    gap: 15px;
  }
`;

const HistorySection = () => {
  const { t } = useTranslation();

  // Timeline data with fallback
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PageWrapper>
      <HeaderImageWrapper>
        <HeaderImage 
          src="/images/realizations/top.jpg" 
          alt={t('history.headerAlt', 'Historia firmy ROJEK')} 
        />
        <HeaderContent>
          <HeaderTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('history.title', 'Nasza Historia')}
          </HeaderTitle>
          <HeaderSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('history.subtitle', 'Ponad 40 lat doświadczenia w branży')}
          </HeaderSubtitle>
        </HeaderContent>
      </HeaderImageWrapper>

      <ContentSection>
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

        <CTASection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTATitle>{t('history.ctaTitle', 'Poznaj nas lepiej')}</CTATitle>
          <CTAText>
            {t('history.ctaText', 'Skontaktuj się z nami i dowiedz się więcej o naszych produktach i usługach')}
          </CTAText>
          <CTAButton
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('history.ctaButton', 'Skontaktuj się')}
            <FiArrowRight />
          </CTAButton>
        </CTASection>
      </ContentSection>
    </PageWrapper>
  );
};

export default HistorySection;
