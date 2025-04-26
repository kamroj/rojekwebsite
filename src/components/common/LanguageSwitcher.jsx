import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag'; // Importuj komponent biblioteki

// Usuwamy importy manualnych flag:
// import flagPL from '../../assets/images/flags/pl.svg';
// import flagEN from '../../assets/images/flags/en.svg';
// import flagDE from '../../assets/images/flags/de.svg';

// Mapowanie kodów języków i18next na kody krajów ISO 3166-1 alpha-2
// wymagane przez react-country-flag
const languageToCountryCode = {
  pl: 'PL',
  en: 'GB', // Używamy flagi UK dla angielskiego (można zmienić na 'US')
  de: 'DE',
};

// Główny kontener przełącznika
const SwitcherWrapper = styled.div`
  position: relative;
  z-index: 11;
`;

// Przycisk pokazujący aktualną flagę
const CurrentLanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0; /* Zapobiega dodatkowej przestrzeni pod flagą */

  /* Rozmiar flagi kontrolujemy przez style w ReactCountryFlag lub font-size */
  font-size: 2rem; /* Przykładowy rozmiar - dostosuj wg potrzeb */

  &:hover span { /* Celujemy w span generowany przez react-country-flag */
     opacity: 0.8; /* Lekkie przygaszenie flagi przy najechaniu */
  }
`;

// Rozwijane menu z flagami
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(40, 40, 40, 0.9);
  border-radius: 4px;
  padding: 0.8rem;
  margin-top: 10px;
  min-width: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0.8rem;
  z-index: 12;
`;

// Pojedyncza flaga w dropdownie jako przycisk
const LanguageOption = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: block;
  line-height: 0; /* Zapobiega dodatkowej przestrzeni */
  font-size: 2rem; /* Ten sam rozmiar co w przycisku głównym dla spójności */
  opacity: ${({ isActive }) => (isActive ? 0.5 : 1)}; /* Zmniejsz opacity aktywnej */
  border: ${({ isActive, theme }) => (isActive ? `2px solid ${theme.colors.secondary}` : '2px solid transparent')}; /* Grubsze obramowanie aktywnej */
  border-radius: 3px; /* Lekkie zaokrąglenie dla obramowania */
  transition: opacity 0.2s ease, border-color 0.2s ease;

  &:hover {
     /* Nieaktywne flagi robią się lekko jaśniejsze/mniej przezroczyste na hover */
    opacity: ${({ isActive }) => (isActive ? 0.6 : 0.8)};
  }

  &:disabled {
    cursor: default;
  }
`;

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLanguage = i18n.language.split('-')[0];
  const supportedLanguages = i18n.options.supportedLngs || ['pl', 'en', 'de'];
  const displayLanguages = supportedLanguages.filter(lang => lang !== 'cimode');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Funkcja do pobierania alt textu (bez zmian)
  const getAltText = (langCode) => {
    const key = `language.${langCode}`;
    return t(key, langCode.toUpperCase());
  };

  return (
    <SwitcherWrapper ref={wrapperRef}>
      <CurrentLanguageButton onClick={toggleDropdown} aria-label={t('switcher.changeLanguage', 'Change language')}>
        <ReactCountryFlag
            // Pobierz kod kraju z mapowania
            countryCode={languageToCountryCode[currentLanguage]}
            svg // Używaj SVG dla lepszej jakości i skalowania
            // Styl flagi - można kontrolować rozmiar przez font-size przycisku lub bezpośrednio tutaj
            style={{
                width: '1.2em', // Rozmiar względny do font-size przycisku
                height: 'auto', // Zachowaj proporcje
            }}
            // Używamy aria-label zamiast alt dla elementów innych niż img
            aria-label={getAltText(currentLanguage)}
        />
      </CurrentLanguageButton>

      <DropdownMenu isOpen={isOpen}>
        {displayLanguages.map((langCode) => (
          <LanguageOption
            key={langCode}
            onClick={() => changeLanguage(langCode)}
            disabled={currentLanguage === langCode}
            isActive={currentLanguage === langCode}
            // Przekazujemy aria-label dla czytników ekranu
            aria-label={t(`switcher.switchTo.${langCode}`, `Switch to ${langCode.toUpperCase()}`)}
          >
            <ReactCountryFlag
                countryCode={languageToCountryCode[langCode]}
                svg
                style={{
                   width: '1.2em', // Ten sam rozmiar co w głównym przycisku
                   height: 'auto',
                   display: 'block', // Upewnij się, że flaga jest blokowa wewnątrz przycisku
                }}
                aria-label={getAltText(langCode)}
            />
          </LanguageOption>
        ))}
      </DropdownMenu>
    </SwitcherWrapper>
  );
};

export default LanguageSwitcher;