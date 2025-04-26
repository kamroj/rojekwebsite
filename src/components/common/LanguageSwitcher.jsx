// src/components/common/LanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

// Mapping of i18next language codes to ISO 3166-1 alpha-2 country codes
const languageToCountryCode = {
  pl: 'PL',
  en: 'GB',
  de: 'DE',
};

// Switcher wrapper
const SwitcherWrapper = styled.div`
  position: relative;
  z-index: 11;
`;

// Current language button
const CurrentLanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  font-size: 2rem;
  
  &:hover span {
    opacity: 0.8;
  }
`;

// Dropdown menu
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
`;

// Language option
const LanguageOption = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: block;
  line-height: 0;
  font-size: 2rem;
  opacity: ${({ isActive }) => (isActive ? 0.5 : 1)};
  border: ${({ isActive, theme }) => (isActive ? `2px solid ${theme.colors.secondary}` : '2px solid transparent')};
  border-radius: 3px;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              border-color ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: ${({ isActive }) => (isActive ? 0.6 : 0.8)};
  }

  &:disabled {
    cursor: default;
  }
`;

// Main component
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Get current language and supported languages
  const currentLanguage = i18n.language.split('-')[0];
  const supportedLanguages = i18n.options.supportedLngs || ['pl', 'en', 'de'];
  const displayLanguages = supportedLanguages.filter(lang => lang !== 'cimode');

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Change language
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Handle clicks outside the component
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
  }, []);

  // Get alt text for accessibility
  const getAltText = (langCode) => {
    const key = `language.${langCode}`;
    return t(key, langCode.toUpperCase());
  };

  return (
    <SwitcherWrapper ref={wrapperRef}>
      <CurrentLanguageButton 
        onClick={toggleDropdown} 
        aria-label={t('switcher.changeLanguage', 'Change language')}
      >
        <ReactCountryFlag
          countryCode={languageToCountryCode[currentLanguage]}
          svg
          style={{
            width: '1.2em',
            height: 'auto',
          }}
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
            aria-label={t(`switcher.switchTo.${langCode}`, `Switch to ${langCode.toUpperCase()}`)}
          >
            <ReactCountryFlag
              countryCode={languageToCountryCode[langCode]}
              svg
              style={{
                width: '1.2em',
                height: 'auto',
                display: 'block',
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