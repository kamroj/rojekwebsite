// src/components/common/LanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

// Mapowanie kodów języków i18next na kody krajów ISO 3166-1 alpha-2
const languageToCountryCode = {
  pl: 'PL',
  en: 'GB',
  de: 'DE',
};

// Wrapper przełącznika
const SwitcherWrapper = styled.div`
  position: relative;
  z-index: 11;
  
  ${props => props.isMobile && css`
    width: 100%;
    
    /* Style dla mobilnej wersji */
    .language-label {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.colors.text};
    }
  `}
`;

// Przycisk aktualnego języka
const CurrentLanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  
  /* Dodanie obramowania dla flag */
  .flag-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid ${({ isPastThreshold }) => 
      isPastThreshold ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
    line-height: 0;
  }
  
  /* Ustaw rozmiar dla ikony głównej */
  .flag-icon {
    width: 30px !important;
    height: auto;
  }
  
  &:hover .flag-container {
    opacity: 0.8;
  }
`;

// Menu rozwijane
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(40, 40, 40, 0.9);
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacings.small};
  margin-top: 10px;
  min-width: auto;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.small};
  z-index: 12;
  
  ${props => props.isMobile && css`
    position: relative;
    background-color: transparent;
    box-shadow: none;
    padding: ${({ theme }) => theme.spacings.medium} 0;
    margin-top: 1.5rem;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacings.medium};
  `}
`;

// Opcja języka
const LanguageOption = styled.button`
  background: none;
  border: none;
  padding: ${props => props.isMobile ? '6px 10px' : '0'};
  cursor: pointer;
  display: flex;
  align-items: center;
  line-height: 0;
  position: relative;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
  border-radius: 3px;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              background-color ${({ theme }) => theme.transitions.default};

  ${props => props.isMobile && css`
    background-color: ${props => props.isActive ? 'rgba(1, 126, 84, 0.1)' : 'transparent'};
    
    .lang-name {
      margin-left: 0.8rem;
      font-size: 1.6rem;
      font-weight: 500;
      color: ${({ theme, isActive }) => isActive ? theme.colors.bottleGreen : theme.colors.text};
    }
  `}

  /* Dodanie obramowania dla flag */
  .flag-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid ${({ isDropdown }) => 
      isDropdown ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
    line-height: 0;
  }
  
  /* Ustaw rozmiar dla ikon w menu rozwijanym */
  .dropdown-flag-icon {
    width: 24px !important;
    height: auto;
  }

  &:hover {
    opacity: 1;
    background-color: ${props => props.isMobile ? 'rgba(1, 126, 84, 0.05)' : 'transparent'};
  }

  &:disabled {
    cursor: default;
  }
`;

// Główny komponent
const LanguageSwitcher = ({ isMobile, isPastThreshold = false }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Pobierz aktualny język i obsługiwane języki
  const currentLanguage = i18n.language.split('-')[0];
  const supportedLanguages = i18n.options.supportedLngs || ['pl', 'en', 'de'];
  const displayLanguages = supportedLanguages.filter(lang => lang !== 'cimode');

  // Język nazwy dla mobilnej wersji
  const getLanguageName = (code) => {
    const names = {
      pl: 'Polski',
      en: 'English',
      de: 'Deutsch'
    };
    return names[code] || code.toUpperCase();
  };

  // Przełącz rozwijane menu
  const toggleDropdown = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  // Zmień język
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  // Obsługa kliknięć poza komponentem (tylko dla wersji desktop)
  useEffect(() => {
    if (isMobile) return;
    
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  // Pobierz tekst alt dla dostępności
  const getAltText = (langCode) => {
    const key = `language.${langCode}`;
    return t(key, langCode.toUpperCase());
  };

  // Renderowanie w zależności od typu (mobilne/desktop)
  return (
    <SwitcherWrapper ref={wrapperRef} isMobile={isMobile}>
      {isMobile && (
        <div className="language-label">{t('switcher.language', 'Język')}</div>
      )}
      
      {isMobile ? (
        // Mobilna wersja - wszystkie języki wyświetlone obok siebie
        <DropdownMenu isOpen={true} isMobile={true}>
          {displayLanguages.map((langCode) => (
            <LanguageOption
              key={langCode}
              onClick={() => changeLanguage(langCode)}
              disabled={currentLanguage === langCode}
              isActive={currentLanguage === langCode}
              isMobile={true}
              isPastThreshold={true} // W mobilnym menu zawsze ciemne obramowanie
              aria-label={t(`switcher.switchTo.${langCode}`, `Switch to ${langCode.toUpperCase()}`)}
            >
              <div className="flag-container">
                <ReactCountryFlag
                  countryCode={languageToCountryCode[langCode]}
                  svg
                  style={{
                    width: '1.4em',
                    height: 'auto',
                    display: 'block',
                  }}
                  aria-label={getAltText(langCode)}
                />
              </div>
              <span className="lang-name">{getLanguageName(langCode)}</span>
            </LanguageOption>
          ))}
        </DropdownMenu>
      ) : (
        // Wersja desktop - przycisk z rozwijanym menu
        <>
          <CurrentLanguageButton 
            onClick={toggleDropdown} 
            aria-label={t('switcher.changeLanguage', 'Change language')}
            isMobile={isMobile}
            isPastThreshold={isPastThreshold}
          >
            <div className="flag-container">
              <ReactCountryFlag
                countryCode={languageToCountryCode[currentLanguage]}
                svg
                style={{
                  width: '1.4em',
                  height: 'auto',
                }}
                className="flag-icon"
                aria-label={getAltText(currentLanguage)}
              />
            </div>
          </CurrentLanguageButton>

          <DropdownMenu isOpen={isOpen} isMobile={false}>
            {displayLanguages.map((langCode) => (
              <LanguageOption
                key={langCode}
                onClick={() => changeLanguage(langCode)}
                disabled={currentLanguage === langCode}
                isActive={currentLanguage === langCode}
                isMobile={false}
                isDropdown={true}
                aria-label={t(`switcher.switchTo.${langCode}`, `Switch to ${langCode.toUpperCase()}`)}
              >
                <div className="flag-container">
                  <ReactCountryFlag
                    countryCode={languageToCountryCode[langCode]}
                    svg
                    style={{
                      width: '1.4em',
                      height: 'auto',
                      display: 'block',
                    }}
                    className="dropdown-flag-icon"
                    aria-label={getAltText(langCode)}
                  />
                </div>
              </LanguageOption>
            ))}
          </DropdownMenu>
        </>
      )}
    </SwitcherWrapper>
  );
};

export default LanguageSwitcher;