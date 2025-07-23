import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { COUNTRY_CODES, SUPPORTED_LANGUAGES } from '../../constants';
import { getValidLanguage, handleKeyboardNavigation } from '../../utils';

const SwitcherWrapper = styled.div`
  position: relative;
  z-index: 11;
  
  ${props => props.$isMobile && css`
    width: 100%;
    
    .language-label {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 1rem;
      color: ${({ theme }) => theme.colors.text};
    }
  `}
`;

const CurrentLanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  transition: opacity ${({ theme }) => theme.transitions.default};
  
  .flag-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid ${({ $isPastThreshold }) => 
      $isPastThreshold ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
    line-height: 0;
    transition: opacity ${({ theme }) => theme.transitions.default};
  }
  
  .flag-icon {
    width: 28px !important;
    height: auto;
  }
  
  &:hover .flag-container {
    opacity: 0.8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(40, 40, 40, 0.9);
  border-radius: 4px;
  padding: 2px;
  margin-top: 10px;
  min-width: auto;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.small};
  z-index: 12;
  
  ${props => props.$isMobile && css`
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

const LanguageOption = styled.button`
  background: none;
  border: none;
  padding: ${props => props.$isMobile ? '6px 10px' : '0'};
  cursor: pointer;
  display: flex;
  align-items: center;
  line-height: 0;
  position: relative;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  border-radius: 3px;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              background-color ${({ theme }) => theme.transitions.default};

  ${props => props.$isMobile && css`
    background-color: ${props => props.$isActive ? 'rgba(1, 126, 84, 0.1)' : 'transparent'};
    
    .lang-name {
      margin-left: 0.8rem;
      font-size: 1.6rem;
      font-weight: 500;
      color: ${({ theme, $isActive }) => $isActive ? theme.colors.bottleGreen : theme.colors.text};
    }
  `}

  .flag-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid ${({ $isDropdown }) => 
      $isDropdown ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
    line-height: 0;
  }
  
  .dropdown-flag-icon {
    width: 100% !important;
    height: auto;
  }

  &:hover {
    opacity: 1;
    background-color: ${props => props.$isMobile ? 'rgba(1, 126, 84, 0.05)' : 'transparent'};
  }


  &:disabled {
    cursor: default;
    opacity: 1;
  }
`;

const LanguageSwitcher = ({ isMobile = false, isPastThreshold = false }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLanguage = getValidLanguage(i18n.language);
  const displayLanguages = SUPPORTED_LANGUAGES.filter(lang => lang !== 'cimode');

  const getLanguageName = (code) => {
    return t(`language.${code}`, code.toUpperCase());
  };

  const toggleDropdown = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event, langCode) => {
    handleKeyboardNavigation(
      event,
      () => changeLanguage(langCode),
      () => changeLanguage(langCode)
    );
  };

  const handleToggleKeyDown = (event) => {
    handleKeyboardNavigation(
      event,
      toggleDropdown,
      toggleDropdown
    );
  };

  useEffect(() => {
    if (isMobile) return;
    
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobile]);

  const getAltText = (langCode) => {
    return t(`language.switcher.switchTo.${langCode}`, `Switch to ${langCode.toUpperCase()}`);
  };

  return (
    <SwitcherWrapper ref={wrapperRef} $isMobile={isMobile}>
      {isMobile && (
        <div className="language-label">
          {t('language.switcher.label', 'Language')}
        </div>
      )}
      
      {isMobile ? (
        <DropdownMenu $isOpen={true} $isMobile={true}>
          {displayLanguages.map((langCode) => (
            <LanguageOption
              key={langCode}
              onClick={() => changeLanguage(langCode)}
              onKeyDown={(e) => handleKeyDown(e, langCode)}
              disabled={currentLanguage === langCode}
              $isActive={currentLanguage === langCode}
              $isMobile={true}
              $isPastThreshold={true}
              aria-label={getAltText(langCode)}
              tabIndex={0}
            >
              <div className="flag-container">
                <ReactCountryFlag
                  countryCode={COUNTRY_CODES[langCode]}
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
        <>
          <CurrentLanguageButton 
            onClick={toggleDropdown}
            onKeyDown={handleToggleKeyDown}
            aria-label={t('language.switcher.changeLanguage', 'Change language')}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            $isMobile={isMobile}
            $isPastThreshold={isPastThreshold}
            tabIndex={0}
          >
            <div className="flag-container">
              <ReactCountryFlag
                countryCode={COUNTRY_CODES[currentLanguage]}
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

          <DropdownMenu $isOpen={isOpen} $isMobile={false} role="listbox">
            {displayLanguages.map((langCode) => (
              <LanguageOption
                key={langCode}
                onClick={() => changeLanguage(langCode)}
                onKeyDown={(e) => handleKeyDown(e, langCode)}
                disabled={currentLanguage === langCode}
                $isActive={currentLanguage === langCode}
                $isMobile={false}
                $isDropdown={true}
                aria-label={getAltText(langCode)}
                role="option"
                aria-selected={currentLanguage === langCode}
                tabIndex={0}
              >
                <div className="flag-container">
                  <ReactCountryFlag
                    countryCode={COUNTRY_CODES[langCode]}
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
