// src/pages/HomePage.jsx
import React from 'react';
import styled from 'styled-components';
import IntroSection from '../components/home/IntroSection';
import Section from '../components/common/Section';
import ProductSection from '../components/home/ProducSection';
import RealizationsGallery from '../components/gallery/RealizationsGallery';
import WhyUsSection from '../components/home/WhyUsSection';
import CompanyPresentationSection from '../components/home/CompanyPresentationSection';
import PartnersSection from '../components/home/PartnersSection';

// Updated product data with interior doors
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
  exteriorDoors: {
    id: 'exteriorDoors',
    name: 'DRZWI ZEWNĘTRZNE',
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
  interiorDoors: {
    id: 'interiorDoors',
    name: 'DRZWI WEWNĘTRZNE',
    videoSrc: '/videos/interior-door.mp4',
    posterSrc: '/images/posters/interior_door_poster.jpg',
    description: 'Drzwi wewnętrzne to element wyposażenia wnętrza, który łączy funkcjonalność z elegancją. Nasze drzwi wewnętrzne doskonale komponują się z każdym stylem aranżacji.',
    benefits: [
      'Elegancki design harmonizujący z wystrojem wnętrza',
      'Szerokie możliwości personalizacji wzorów i kolorów',
      'Doskonała izolacja akustyczna między pomieszczeniami',
      'Trwała konstrukcja z wysokiej jakości materiałów',
      'Precyzyjne wykonanie zapewniające płynne działanie',
      'Bogaty wybór okuć i dodatków funkcjonalnych'
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

// HomePage component
const HomePage = () => {
  return (
    <>
      {/* Full-screen intro with video background - BEZ Section wrapper */}
      <IntroSection />
      
      {/* Products section */}
      <Section label="PRODUKTY" labelPosition="left">
        <ProductSection 
          productData={productData} 
          initialProductId="windows"
        />
      </Section>
      
      {/* Realizacje section with custom gradient background */}
      <Section 
        dark 
        label="REALIZACJE"
        customStyles={`
          background: linear-gradient(323deg,rgba(0, 0, 0, 1) 0%, rgba(9, 20, 10, 1) 86%, rgba(13, 31, 15, 1) 100%);
        `}
        noPadding
      >
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
      
      {/* Company Presentation section */}
      <Section dark label="PREZENTACJA FIRMY" labelPosition="right" noPadding>
        <CompanyPresentationSection />
      </Section>
      
      {/* Partners section */}
      <Section label="NASI PARTNERZY" labelPosition="left">
        <PartnersSection />
      </Section>
    </>
  );
};

export default HomePage;