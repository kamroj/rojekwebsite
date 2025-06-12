// src/pages/HomePage.jsx
import React from 'react';
import styled from 'styled-components';
import IntroSection from '../components/home/IntroSection';
import Section from '../components/common/Section';
import ProductSection from '../components/home/ProducSection';
import RealizationsGallery from '../components/gallery/RealizationsGallery';
import WhyUsSection from '../components/home/WhyUsSection';
import CompanyPresentationSection from '../components/home/CompanyPresentationSection';

// Mock data for products
const productData = {
  windows: {
    id: 'windows',
    name: 'OKNA',
    videoSrc: '/videos/window.mp4',
    posterSrc: '/images/posters/window_poster.jpg',
    description: 'Okna drewniane to inwestycja w najwyższą z możliwych jakości. Ekologiczne rozwiązanie i niepowtarzalny design, który nada charakter każdemu wnętrzu.',
    benefits: [
      'Najwyższa jakość naturalnego drewna',
      'Przyjazne dla środowiska i zdrowe dla mieszkańców',
      'Wyjątkowy design i estetyka',
      'Bogata paleta kolorów i wykończeń',
      'Bardzo długa żywotność i trwałość konstrukcji',
      'Doskonałe parametry izolacyjności termicznej i akustycznej'
    ]
  },
  doors: {
    id: 'doors',
    name: 'DRZWI',
    videoSrc: '/videos/door.mp4',
    posterSrc: '/images/posters/door_poster.jpg',
    description: 'Drzwi zewnętrzne stanowią wizytówkę domu. Nasze drzwi łączą bezkompromisowe bezpieczeństwo, wysublimowaną estetykę i doskonałą izolację termiczną.',
    benefits: [
      'Solidna konstrukcja gwarantująca bezpieczeństwo',
      'Wysoka izolacyjność termiczna i akustyczna',
      'Odporność na warunki atmosferyczne i wypaczenia',
      'Szeroki wybór wzorów, od klasycznych po nowoczesne',
      'Możliwość zastosowania nowoczesnych systemów kontroli dostępu',
      'Indywidualne dopasowanie wymiarów i dodatków'
    ]
  },
  sliding: {
    id: 'sliding',
    name: 'OKNA PRZESUWNE',
    videoSrc: '/videos/hs.mp4',
    posterSrc: '/images/posters/hs_poster.jpg',
    description: 'Systemy przesuwne HS to nowoczesne rozwiązanie pozwalające na tworzenie imponujących przeszkleń i płynne połączenie wnętrza z tarasem lub ogrodem, zacierając granice między domem a naturą.',
    benefits: [
      'Maksymalne doświetlenie wnętrz dzięki dużym powierzchniom szyb',
      'Oszczędność miejsca w porównaniu do tradycyjnych drzwi balkonowych',
      'Łatwa i komfortowa obsługa nawet bardzo dużych skrzydeł',
      'Nowoczesny design i możliwość tworzenia panoramicznych widoków',
      'Wysoka szczelność i doskonałe parametry termoizolacyjne',
      'Możliwość wykonania w systemie niskoprogowym dla pełnej wygody'
    ]
  }
};

// Mock data for realizations gallery
const realizationData = [
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Dom jednorodzinny, Wrocław' },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Nowoczesne osiedle, Poznań' },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Renowacja kamienicy, Kraków' },
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Biurowiec klasy A, Warszawa' },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Lofty w starej fabryce, Łódź' },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Willa pod miastem, Gdańsk' },
];

// Ciemna sekcja z galerią realizacji
const DarkSection = styled.section`
  background-color: #1a1a1a; /* Ciemne tło */
  padding: 60px 0;
  margin-top: 8rem;
  color: ${({ theme }) => theme.colors.textLight}; /* Jasny tekst */
  position: relative;
`;

// Label dla sekcji realizacji
const SectionLabel = styled.div`
  box-shadow: ${({ theme }) => theme.shadows.large};
  background-color: ${({ theme }) => theme.colors.bottleGreen};
  color: ${({ theme }) => theme.colors.textLight};
  height: 50px;
  font-weight: 500;
  font-size: 1.6rem;
  padding: 0 50px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -25px;
  right: 60px;
  z-index: 1;
`;

// HomePage component
const HomePage = () => {
  return (
    <>
      {/* Full-screen intro with video background */}
      <IntroSection />
      
      {/* Products section */}
      <Section label="PRODUKTY" labelPosition="left">
        <ProductSection 
          productData={productData} 
          initialProductId="windows"
        />
      </Section>
      
      {/* Realizacje section with dark background */}
      <Section dark label="REALIZACJE">
        <RealizationsGallery 
          images={realizationData}
          options={{
            slidesPerViewDesktop: 3,
            slidesPerViewTablet: 2,
            slidesPerViewMobile: 1,
            delay: 3500,
          }}
        />
      </Section>
      
      {/* Why Us section */}
      <Section label="DLACZEGO MY?" labelPosition="left">
        <WhyUsSection />
      </Section>
      
      {/* Company Presentation section - NOWA SEKCJA Z FILMEM */}
      <Section dark label="PREZENTACJA FIRMY" labelPosition="right" noPadding>
        <CompanyPresentationSection />
      </Section>
      
      <Section label="NASI PARTNERZY">
        Tutaj
      </Section>
    </>
  );
};

export default HomePage;