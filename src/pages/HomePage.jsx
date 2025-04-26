import React, { useState, useEffect, useRef } from 'react'; // Usunięto nieużywany useMemo
import styled, { css, keyframes } from 'styled-components';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

// Import Swiper modules
import { Autoplay } from 'swiper/modules';

// Komponent IntroSection - upewnij się, że import jest poprawny
import IntroSection from '../components/home/IntroSection';

// --- Dane ---

const productData = {
  windows: {
    id: 'windows', name: 'OKNA', videoSrc: '/videos/window.mp4', posterSrc: '/images/posters/window_poster.jpg', description: 'Okna drewniane to inwestycja w najwyższą z możliwych jakości. Ekologiczne rozwiązanie i niepowtarzalny design, który nada charakter każdemu wnętrzu.', benefits: ['Najwyższa jakość naturalnego drewna', 'Przyjazne dla środowiska i zdrowe dla mieszkańców', 'Wyjątkowy design i estetyka', 'Bogata paleta kolorów i wykończeń', 'Bardzo długa żywotność i trwałość konstrukcji', 'Doskonałe parametry izolacyjności termicznej i akustycznej']
  },
  doors: {
    id: 'doors', name: 'DRZWI', videoSrc: '/videos/door.mp4', posterSrc: '/images/posters/door_poster.jpg', description: 'Drzwi zewnętrzne stanowią wizytówkę domu. Nasze drzwi łączą bezkompromisowe bezpieczeństwo, wysublimowaną estetykę i doskonałą izolację termiczną.', benefits: ['Solidna konstrukcja gwarantująca bezpieczeństwo', 'Wysoka izolacyjność termiczna i akustyczna', 'Odporność na warunki atmosferyczne i wypaczenia', 'Szeroki wybór wzorów, od klasycznych po nowoczesne', 'Możliwość zastosowania nowoczesnych systemów kontroli dostępu', 'Indywidualne dopasowanie wymiarów i dodatków']
  },
  sliding: {
    id: 'sliding', name: 'OKNA PRZESUWNE', videoSrc: '/videos/hs.mp4', posterSrc: '/images/posters/hs_poster.jpg', description: 'Systemy przesuwne HS to nowoczesne rozwiązanie pozwalające na tworzenie imponujących przeszkleń i płynne połączenie wnętrza z tarasem lub ogrodem, zacierając granice między domem a naturą.', benefits: ['Maksymalne doświetlenie wnętrz dzięki dużym powierzchniom szyb', 'Oszczędność miejsca w porównaniu do tradycyjnych drzwi balkonowych', 'Łatwa i komfortowa obsługa nawet bardzo dużych skrzydeł', 'Nowoczesny design i możliwość tworzenia panoramicznych widoków', 'Wysoka szczelność i doskonałe parametry termoizolacyjne', 'Możliwość wykonania w systemie niskoprogowym dla pełnej wygody']
  }
};

const realizationData = [
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Dom jednorodzinny, Wrocław' },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Nowoczesne osiedle, Poznań' },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Renowacja kamienicy, Kraków' },
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Biurowiec klasy A, Warszawa' },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Lofty w starej fabryce, Łódź' },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Willa pod miastem, Gdańsk' },
];

// --- Style ---

const colors = {
  bottleGreen: '#1a6039', bottleGreenLight: '#008a62', darkGreenLabel: '#003f2a', textDark: '#212529', textLightGray: '#555', white: '#ffffff', lightGrayBorder: '#017e543f', videoBackground: '#e0e0e0', galleryBackgroundDark: '#1a1a1a', galleryBorder: '#444', galleryOverlayDark: 'rgba(0, 0, 0, 0.65)', galleryOverlayActive: 'rgba(0, 0, 0, 0)', galleryTitleBg: 'rgba(26, 96, 57, 0.85)',
};

// --- Style Ogólne ---
const Section = styled.section`
  margin-top: 8rem; padding: 3.5rem; background-color: ${colors.white}; border: 1px solid ${colors.lightGrayBorder}; position: relative;
`;
const ContentLabel = styled.div`
  box-shadow: 0 4px 12px rgb(30 62 44 / 73%); background-color: ${colors.bottleGreen}; color: ${colors.white}; height: 60px; font-weight: 500; font-size: 1.6rem; padding: 0 50px; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; position: absolute; top: -30px; z-index: 1;
  ${({ left }) => left ? css`left: 60px; right: auto;` : css`right: 60px; left: auto;`}
`;
const ContentContainer = styled.div`
  width: 100%; max-width: 1200px; margin: 0 auto; text-align: center; padding-top: 30px;
`;

// --- Style Produktów ---
const ProductContentContainer = styled.div` width: 100%; display: flex; flex-direction: column; align-items: center; `;
const ProductListContainer = styled.div` width: 100%; display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; `;
const ProductListButton = styled.button`
  font-size: 1.6rem; padding: 8px 18px; border: none; border-bottom: 2px solid transparent; background-color: transparent; color: ${colors.textDark}; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease; font-weight: 500; margin: 0 5px;
  &:hover { color: ${colors.bottleGreen}; border-bottom-color: ${colors.bottleGreenLight}; }
  ${({ active }) => active && css` color: ${colors.bottleGreen}; font-weight: 700; border-bottom-color: ${colors.bottleGreen}; `}
`;
const ProductDetailsWrapper = styled.div`
  display: flex; width: 100%; gap: 8rem; align-items: flex-start; margin-top: 1.6rem;
  @media (max-width: 992px) { flex-direction: column; align-items: center; gap: 2rem; }
`;
const ProductVideoWrapper = styled.div`
  flex: 1; max-width: 50%; min-width: 300px; position: relative;
  @media (max-width: 992px) { max-width: 90%; width: 100%; margin-bottom: 1rem; }
`;

// Animacja dla spinnera
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Komponent Spinner
const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 5px solid rgba(26, 96, 57, 0.1);
  border-top: 5px solid ${colors.bottleGreen};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
  display: ${props => props.isLoading ? 'block' : 'none'};
`;

// Zmodyfikowany kontener wideo (teraz div zamiast video)
const ProductVideoContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgb(30 62 44 / 73%);
  overflow: hidden;
  aspect-ratio: 16 / 9;
`;

// Nowy komponent dla samego video
const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  opacity: ${props => props.isLoading ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const PrductDescriptionContainer = styled.div`
  flex: 1; text-align: left; max-width: 50%;
  @media (max-width: 992px) { max-width: 90%; width: 100%; }
`;
const ProductDescriptionTitle = styled.h3` font-size: 2.4rem; margin-bottom: 1.5rem; color: ${colors.bottleGreen}; font-weight: 600; border-bottom: 1px solid ${colors.bottleGreen}; padding-bottom: 0.5rem; `;
const ProductDescriptionText = styled.p` font-size: 1.6rem; line-height: 1.7; margin-bottom: 2rem; color: ${colors.textLightGray}; `;
const ProductBenefitsList = styled.ul` list-style: none; padding: 0; margin: 0; `;
const ProductBenefitItem = styled.li`
  font-size: 1.5rem; line-height: 1.8; margin-bottom: 0.8rem; position: relative; padding-left: 25px; color: ${colors.textDark};
  &::before { content: '✓'; position: absolute; left: 0; top: 1px; color: ${colors.bottleGreen}; font-weight: bold; font-size: 1.8rem; }
`;


// --- Style Galerii (Ze specjalnym focus na aktualnie przeciągany slajd) ---
const GallerySection = styled(Section)`
  background-color: ${colors.galleryBackgroundDark};
  border-color: ${colors.galleryBorder};
  padding-bottom: 5rem;
  padding-top: 5rem;
`;

const StyledSwiperContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  position: relative;

  .swiper {
    width: 100%;
    height: auto;
    padding: 10px 0px;
    box-sizing: border-box;
  }

  /* --- Styl domyślny slajdu (stan spoczynku) --- */
  .swiper-slide {
    height: auto;
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;

    /* Domyślnie lekko zmniejszamy nieaktywne */
    transform: scale(0.88);

    /* <<< WAŻNE: Przejścia działają tylko w stanie spoczynku */
    transition: transform 0.4s ease;

    &:active { cursor: grabbing; }
  }

  /* Domyślny styl AKTYWNEGO slajdu (stan spoczynku) */
  .swiper-slide-active {
    transform: scale(1.05);
    z-index: 1;
  }

  /* --- Styl domyślny wrappera wewnętrznego (stan spoczynku) --- */
  .SlideContentWrapperInside {
     position: relative;
     overflow: hidden;
     border-radius: 4px;
     height: 100%;
     width: 100%;
     transition: box-shadow 0.3s ease; // Przejście dla cienia
     display: block;

     /* Overlay */
     &::after {
       content: '';
       position: absolute; top: 0; left: 0; right: 0; bottom: 0;
       border-radius: 4px;
       pointer-events: none;
       z-index: 1;

       /* Domyślnie ciemny overlay dla nieaktywnych */
       background-color: ${colors.galleryOverlayDark};

       /* <<< WAŻNE: Przejście dla overlay'a działa tylko w stanie spoczynku */
       transition: background-color 0.4s ease;
     }

     /* Efekt hover na wrapperze (nadal usuwa overlay) */
     &:hover::after { background-color: ${colors.galleryOverlayActive}; }
     /* Efekt hover na obrazku (nadal go powiększa) */
     &:hover img { transform: scale(1.05); }
  }

  /* Domyślnie AKTYWNY slajd ma przezroczysty overlay (stan spoczynku) */
  .swiper-slide-active .SlideContentWrapperInside::after {
      background-color: ${colors.galleryOverlayActive};
  }

  /* Opcjonalny cień dla aktywnego slajdu (stan spoczynku) */
  .swiper-slide-active .SlideContentWrapperInside {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }

  /* --- REGUŁY PODCZAS PRZECIĄGANIA (.swiper-dragging) --- */
  .swiper-dragging {
    /* Wyłączamy animacje CSS podczas przeciągania */
    .swiper-slide {
      transition: none !important; /* Wyłączamy przejście dla transform */
      transform: scale(0.9) !important; /* Wszystkie slajdy zmniejszone */
      
      .SlideContentWrapperInside::after {
        transition: none !important; /* Wyłączamy przejście dla overlay'a */
        background-color: ${colors.galleryOverlayDark} !important; /* Wszystkie mają ciemny overlay */
      }
      
      .SlideContentWrapperInside {
        transition: none !important; /* Wyłączamy przejście dla cienia */
        box-shadow: none !important; /* Bez cienia */
      }
    }
    
    /* NOWE: Używamy specjalnej klasy dla rzeczywiście aktywnego slajdu podczas przeciągania */
    .swiper-slide-grabbed {
      transform: scale(1.05) !important; /* Powiększony */
      z-index: 10 !important; /* Wyższy z-index */
      
      .SlideContentWrapperInside::after {
        background-color: ${colors.galleryOverlayActive} !important; /* Przezroczysty overlay */
      }
      
      .SlideContentWrapperInside {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35) !important; /* Z cieniem */
      }
    }
  }
  /* --- Koniec reguł dla .swiper-dragging --- */
`;

// Obrazek w galerii
const GalleryImage = styled.img`
  display: block; width: 100%; height: 400px;
  object-fit: cover; user-select: none;
  transition: transform 0.3s ease; // Nadal działa hover na obrazku
  -webkit-user-drag: none; user-drag: none;
  border-radius: 4px;
`;

// Tytuł na obrazku
const GalleryImageTitle = styled.div`
  position: absolute; bottom: 10px; right: 10px;
  background-color: ${colors.galleryTitleBg}; color: ${colors.white};
  padding: 5px 12px; border-radius: 3px;
  font-size: 1.3rem; font-weight: 500; z-index: 2;
  pointer-events: none; max-width: calc(100% - 20px);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;


// --- Komponent Galerii Realizacji (Dodajemy obsługę klasy swiper-slide-grabbed) ---
const RealizationsGalleryInteractive = ({ images }) => {
  const totalImages = images.length;
  const slidesPerViewDesktop = 3; const slidesPerViewTablet = 2; const slidesPerViewMobile = 1;
  const swiperRef = useRef(null);

  // Fallback
  if (!images || totalImages < slidesPerViewDesktop) {
    console.warn("Za mało obrazków dla Swipera, wyświetlanie statyczne.");
    return (<div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}> {images.map((imgData, i) => (<div key={imgData.id || i} style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}> <img src={imgData.src} alt={imgData.title || `Realizacja ${i + 1}`} style={{ display: 'block', height: '250px', width: 'auto', maxWidth: '300px' }} /> </div>))} </div>);
  }

  const autoplayOptions = { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true, };

  // Funkcja do obsługi aktualnie przeciąganego slajdu
  const handleDragStart = (swiper, event) => {
    // Znajdź aktualnie kliknięty slajd i dodaj mu klasę
    const slideEl = event.target.closest('.swiper-slide');
    if (slideEl) {
      // Wyczyść klasę ze wszystkich slajdów
      swiper.slides.forEach(slide => {
        slide.classList.remove('swiper-slide-grabbed');
      });
      // Dodaj klasę do klikniętego slajdu
      slideEl.classList.add('swiper-slide-grabbed');
    }
  };

  const handleDragEnd = (swiper) => {
    // Usuń klasę ze wszystkich slajdów po zakończeniu przeciągania
    swiper.slides.forEach(slide => {
      slide.classList.remove('swiper-slide-grabbed');
    });
  };

  // Dodajemy dodatkowe zdarzenia do śledzenia przeciągania
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      // Dodaj listenery zdarzeń
      swiper.on('touchStart', (_, event) => handleDragStart(swiper, event));
      swiper.on('touchEnd', () => handleDragEnd(swiper));

      // Dodatkowe zdarzenia dla myszy
      swiper.on('mousedown', (event) => handleDragStart(swiper, event));
      document.addEventListener('mouseup', () => handleDragEnd(swiper));

      // Usunięcie listenerów przy odmontowaniu
      return () => {
        swiper.off('touchStart');
        swiper.off('touchEnd');
        swiper.off('mousedown');
        document.removeEventListener('mouseup', () => handleDragEnd(swiper));
      };
    }
  }, []);

  return (
    <StyledSwiperContainer>
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        loop={true}
        slidesPerView={slidesPerViewMobile}
        spaceBetween={25}
        autoplay={autoplayOptions}
        grabCursor={true}
        centeredSlides={true}
        speed={600} // Prędkość animacji snap po puszczeniu
        watchSlidesProgress={true} // Potrzebne do poprawnego działania
        breakpoints={{
          577: { slidesPerView: slidesPerViewTablet, spaceBetween: 25, },
          993: { slidesPerView: slidesPerViewDesktop, spaceBetween: 30, },
        }}
        className="myInteractiveSwiper" // Klasa dla .swiper-dragging
      >
        {images.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="SlideContentWrapperInside">
              <GalleryImage src={item.src} alt={item.title} loading="lazy" draggable="false" />
              <GalleryImageTitle>{item.title}</GalleryImageTitle>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledSwiperContainer>
  );
};


// --- Komponent Strony Głównej (Zaktualizowany z Loadingiem dla Video) ---
const HomePage = () => {
  const [selectedProductId, setSelectedProductId] = useState('windows');
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);
  const currentProduct = productData[selectedProductId];

  useEffect(() => {
    setIsVideoLoading(true);
    if (videoRef.current) { 
      videoRef.current.load(); 
    }
  }, [currentProduct.videoSrc]);

  return (
    <>
      <IntroSection />

      {/* Sekcja Produktów - ZAKTUALIZOWANA */}
      <Section> 
        <ContentLabel left>PRODUKTY</ContentLabel> 
        <ContentContainer> 
          <ProductContentContainer> 
            <ProductListContainer> 
              {Object.values(productData).map((product) => (
                <ProductListButton 
                  key={product.id} 
                  onClick={() => setSelectedProductId(product.id)} 
                  active={selectedProductId === product.id}
                >
                  {product.name}
                </ProductListButton>
              ))}
            </ProductListContainer> 
            <ProductDetailsWrapper> 
              <ProductVideoWrapper> 
                <ProductVideoContainer>
                  <LoadingSpinner isLoading={isVideoLoading} />
                  <Video
                    ref={videoRef}
                    key={currentProduct.videoSrc}
                    src={currentProduct.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={currentProduct.posterSrc}
                    preload="metadata"
                    isLoading={isVideoLoading}
                    onLoadedData={() => setIsVideoLoading(false)}
                    onPlaying={() => setIsVideoLoading(false)}
                  />
                </ProductVideoContainer>
              </ProductVideoWrapper> 
              <PrductDescriptionContainer> 
                <ProductDescriptionTitle>{currentProduct.name}</ProductDescriptionTitle> 
                <ProductDescriptionText>{currentProduct.description}</ProductDescriptionText> 
                <ProductBenefitsList> 
                  {currentProduct.benefits.map((benefit, index) => (
                    <ProductBenefitItem key={index}>{benefit}</ProductBenefitItem>
                  ))}
                </ProductBenefitsList> 
              </PrductDescriptionContainer> 
            </ProductDetailsWrapper> 
          </ProductContentContainer> 
        </ContentContainer> 
      </Section>

      {/* Sekcja Realizacji - NIEZMIENIONA */}
      <GallerySection> 
        <ContentLabel>REALIZACJE</ContentLabel> 
        <ContentContainer> 
          <RealizationsGalleryInteractive images={realizationData} /> 
        </ContentContainer> 
      </GallerySection>

      {/* Sekcja O Nas */}
      <Section> 
        <ContentLabel left>O NAS</ContentLabel> 
        <ContentContainer style={{ textAlign: 'left', paddingTop: '50px' }}> 
          <h2>Poznaj ROJEK</h2> 
          <p>Nasza Firma jest kontynuatorem działalności Przedsiębiorstwa Rewaloryzacji Zabytków w branży stolarskiej, której częścią był nasz zakład działający nieprzerwanie od 1981 roku. Pomimo upływu czasu, wdrożenia innowacyjnych technologii i znaczącą część naszej produkcji stanowi stolarka do obiektów zabytkowych lub podlegających ochronie konserwatorskiej. Królewskie miasto Kraków wraz z jego mieszkańcami zawsze będą dla nas priorytetem, a rekonstrukcja zabytkowych okien, bram i drzwi wyzwaniem, które od wielu lat stawiamy na pierwszym miejscu.</p> 
        </ContentContainer> 
      </Section>
    </>
  );
};

export default HomePage;