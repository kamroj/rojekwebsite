// src/components/home/WhyUsSection.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Kontener dla całej sekcji
const WhyUsContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

// Grid dla kafelek
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    margin-top: 4rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    margin-top: 3rem;
  }
`;

// Pojedynczy kafelek
const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  transition: transform ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default};
  
`;

// Kontener na ikonę z obramowaniem
const IconWrapper = styled.div`
  width: 150px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.colors.bottleGreenLight};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.bottleGreen};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.default};
  }
  
  ${FeatureCard}:hover & {
    &::before {
      opacity: 0.05;
    }
  }

`;

// Ikona
const Icon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
  position: relative;
`;

// Tytuł kafelka
const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bottleGreen};
  margin-bottom: 1rem;
  line-height: 1.3;
  min-height: 2.6em; /* Zapewnia równą wysokość dla 2-liniowych tytułów */
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.6rem;
    min-height: auto;
  }
`;

// Opis kafelka
const FeatureDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.3rem;
  }
`;

// Dane dla kafelek
const features = [
  {
    id: 'tradition',
    icon: '/images/icons/window-icon.png',
    titleKey: 'whyUs.tradition.title',
    descriptionKey: 'whyUs.tradition.description',
    defaultTitle: 'Tradycja i doświadczenie',
    defaultDescription: 'Od 1981 roku tworzymy stolarkę najwyższej jakości, łącząc wieloletnie doświadczenie z nowoczesnymi technologiami.'
  },
  {
    id: 'individual',
    icon: '/images/icons/cowork-icon.png',
    titleKey: 'whyUs.individual.title',
    descriptionKey: 'whyUs.individual.description',
    defaultTitle: 'Indywidualne podejście',
    defaultDescription: 'Każde zlecenie traktujemy wyjątkowo, dostosowując rozwiązania do potrzeb i oczekiwań naszych klientów.'
  },
  {
    id: 'ecological',
    icon: '/images/icons/leaf-icon.png',
    titleKey: 'whyUs.ecological.title',
    descriptionKey: 'whyUs.ecological.description',
    defaultTitle: 'Ekologiczne materiały',
    defaultDescription: 'Wykorzystujemy wyłącznie certyfikowane, przyjazne środowisku materiały najwyższej jakości.'
  },
  {
    id: 'precision',
    icon: '/images/icons/tools-icon.png',
    titleKey: 'whyUs.precision.title',
    descriptionKey: 'whyUs.precision.description',
    defaultTitle: 'Precyzja wykonania',
    defaultDescription: 'Dbałość o najmniejsze detale i perfekcyjne wykończenie to nasza wizytówka.'
  },
  {
    id: 'warranty',
    icon: '/images/icons/shield-icon.png',
    titleKey: 'whyUs.warranty.title',
    descriptionKey: 'whyUs.warranty.description',
    defaultTitle: 'Gwarancja i serwis',
    defaultDescription: 'Zapewniamy wieloletnią gwarancję oraz profesjonalny serwis naszych produktów.'
  },
  {
    id: 'delivery',
    icon: '/images/icons/clock-icon.png',
    titleKey: 'whyUs.delivery.title',
    descriptionKey: 'whyUs.delivery.description',
    defaultTitle: 'Terminowość dostaw',
    defaultDescription: 'Dotrzymujemy ustalonych terminów realizacji, szanując czas naszych klientów.'
  }
];

const WhyUsSection = () => {
  const { t } = useTranslation();

  return (
    <WhyUsContainer>
      <FeaturesGrid>
        {features.map((feature) => (
          <FeatureCard key={feature.id}>
            <IconWrapper>
              <Icon 
                src={feature.icon} 
                alt={t(feature.titleKey, feature.defaultTitle)}
                loading="lazy"
              />
            </IconWrapper>
            <FeatureTitle>
              {t(feature.titleKey, feature.defaultTitle)}
            </FeatureTitle>
            <FeatureDescription>
              {t(feature.descriptionKey, feature.defaultDescription)}
            </FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </WhyUsContainer>
  );
};

export default WhyUsSection;