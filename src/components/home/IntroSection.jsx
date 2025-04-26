import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Keyframe dla pojawiania się tekstu
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Wrapper sekcji Intro
const IntroWrapper = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: #000; // Fallback
  z-index: 1; // Pod Headerem i MainContentWrapper
`;

// Tło wideo
const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 1;
  object-fit: cover;
`;

// Przyciemnienie wideo
const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); // Twoje przyciemnienie
  z-index: 2;
`;

// Kontener dla treści w prawym dolnym rogu
const RightBottomContentWrapper = styled.div`
  position: absolute;
  bottom: 8%; // Odstęp od dołu
  right: 5%;  // Odstęp od prawej
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Wyrównaj elementy do prawej
  gap: ${({ theme }) => theme.spacings.medium}; // Odstęp między tekstem a przyciskiem
  z-index: 10; // Nad overlayem
  text-align: right; // Wyrównaj tekst do prawej
  max-width: 60%; // Ogranicz szerokość
`;

// Stylizowany dynamiczny tekst
const DynamicText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 5rem; // Zwiększona czcionka
  font-weight: 50;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6); // Mocniejszy cień
  min-height: 70px; // Minimalna wysokość dla różnych długości tekstu
  display: flex;
  align-items: center;
  justify-content: flex-end; // Wyrównaj tekst do prawej wewnątrz kontenera
  margin: 0;
  opacity: 0; // Start niewidoczny dla animacji
  animation: ${fadeIn} 1.4s ease-out forwards; // Wydłużona animacja fadeIn
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

// Przycisk z prostą animacją hover
const BasicButton = styled.a`
  display: inline-block;
  background: transparent;
  border: 1px solid #017e547a; // Twój półprzezroczysty zielony border
  color: ${({ theme }) => theme.colors.textLight};
  padding: 1rem 2.5rem;
  font-size: 1.4rem; // Mniejsza czcionka dla "Zobacz"
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  text-decoration: none;
  /* border-radius: 4px; */
  transition: background-color 0.3s ease, border-color 0.3s ease; // Płynne przejścia
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => "#017e543f"}; // Pełne zielone tło na hover
    border-color: ${({ theme }) => "theme.colors.secondary"}; // Pełny zielony border na hover
  }
`;

// --- Komponent Główny IntroSection ---

const IntroSection = ({ id }) => {
  const { t } = useTranslation();
  const videoMp4Url = "/videos/background4.mp4"; // Ścieżka do Twojego wideo

  // Mapa kluczy tłumaczeń do docelowych ID sekcji
  // DOSTOSUJ TE ID DO SEKCJI W TWOIM App.jsx!
  const introLinks = {
    'intro.text1': '#realizations', // np. Zobacz nasze realizacje
    'intro.text2': '#about',       // np. Odkryj okna... -> O firmie
    'intro.text3': '#contact',     // np. Drzwi zewnętrzne... -> Kontakt
    'intro.text4': '#realizations', // np. Nowoczesne systemy... -> Realizacje
  };
  const introTextKeys = Object.keys(introLinks); // Pobierz listę kluczy

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // Stan używany jako klucz do restartowania animacji CSS
  const [animationKey, setAnimationKey] = useState(0);

  // Efekt do cyklicznej zmiany tekstu co 7 sekund
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Zaktualizuj indeks, zapętlając go
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % introTextKeys.length);
      // Zmień klucz animacji, aby ją zrestartować dla nowego tekstu
      setAnimationKey(prevKey => prevKey + 1);
    }, 7000); // 7 sekund

    // Wyczyszczenie interwału przy odmontowaniu komponentu
    return () => clearInterval(intervalId);
  }, [introTextKeys.length]); // Zależność tylko od długości tablicy (stała)

  // Pobierz aktualny klucz tekstu i odpowiadający mu link
  const currentTextKey = introTextKeys[currentTextIndex];
  const currentLinkHref = introLinks[currentTextKey] || '#realizations'; // Domyślny link, jeśli coś pójdzie nie tak

  return (
    <IntroWrapper>
      {/* Tło wideo */}
      <VideoBackground autoPlay muted loop playsInline poster="/images/video_poster.jpg">
        <source src={videoMp4Url} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      {/* Przyciemnienie */}
      <VideoOverlay />

      {/* Kontener z treścią w prawym dolnym rogu */}
      <RightBottomContentWrapper>
        {/* Dynamiczny tekst z animacją */}
        <DynamicText key={animationKey}>
          {/* Pobierz tłumaczenie dla aktualnego klucza */}
          {t(currentTextKey, '')} {/* Drugi argument to fallback */}
        </DynamicText>

        {/* Przycisk z dynamicznym linkiem */}
        <BasicButton href={currentLinkHref}>
           {/* Tekst przycisku */}
           {t('buttons.see', 'Zobacz')}
        </BasicButton>
      </RightBottomContentWrapper>
    </IntroWrapper>
  );
};

export default IntroSection;