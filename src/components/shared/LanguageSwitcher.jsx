import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// `react-country-flag` is a bit tricky with ESM/CJS interop.
// In some bundlers the default import becomes an object, not a component.
// We normalize it to a React component for SSR safety.
import ReactCountryFlagImport from 'react-country-flag';
import { COUNTRY_CODES, SUPPORTED_LANGUAGES } from '../../constants/index.js';
import { getValidLanguage, handleKeyboardNavigation } from '../../utils';
import { translatePathname } from '../../lib/i18n/routing';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import styles from './LanguageSwitcher.module.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ReactCountryFlag =
  ReactCountryFlagImport?.ReactCountryFlag || ReactCountryFlagImport?.default || ReactCountryFlagImport;

// Internal router-agnostic UI.
function LanguageSwitcherUI({ isMobile = false, isPastThreshold = false, pathname, onSelectLanguage }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Hydration-safe: avoid reading window.location during render.
  // We get `pathname` from Header (SSR) and update it on the client in the parent when needed.
  const currentPathname = pathname || '/';

  const currentLanguage = getValidLanguage(i18n.language);
  const displayLanguages = SUPPORTED_LANGUAGES.filter(lang => lang !== 'cimode');

  const listboxId = isMobile ? undefined : 'language-switcher-listbox';

  const getLanguageShortCode = (code) => code.toUpperCase();

  const toggleDropdown = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const getNextPath = (langCode) => translatePathname(currentPathname, langCode);

  const closeDropdown = () => {
    if (!isMobile) setIsOpen(false);
  };

  const handleKeyDown = (event, langCode) => {
    const nextPath = getNextPath(langCode);
    handleKeyboardNavigation(
      event,
      () => onSelectLanguage(langCode, nextPath),
      () => onSelectLanguage(langCode, nextPath)
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
    <div ref={wrapperRef} className={cn(styles.wrapper, isMobile && styles.mobile)}>
      {isMobile ? (
        <div className={styles.mobileLanguageRow}>
          <div className={cn(styles.dropdownMenu, styles.dropdownMenuMobile)}>
            {displayLanguages.map((langCode) => {
              const nextPath = getNextPath(langCode);
              const isActive = currentLanguage === langCode;

              const optionClassName = cn(
                styles.option,
                styles.optionMobile,
                isActive && styles.optionActive,
                isActive && styles.optionMobileActive
              );

              const langNameClassName = cn(
                styles.langName,
                isActive && styles.langNameActive
              );

              if (isActive) {
                return (
                  <button
                    key={langCode}
                    onKeyDown={(e) => handleKeyDown(e, langCode)}
                    disabled
                    aria-label={getAltText(langCode)}
                    tabIndex={0}
                    className={optionClassName}
                  >
                    <div className={styles.optionFlagContainer}>
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
                    <span className={langNameClassName}>{getLanguageShortCode(langCode)}</span>
                  </button>
                );
              }

              return (
                <RouterAgnosticLink
                  key={langCode}
                  href={nextPath}
                  onClick={(e) => {
                    e.preventDefault();
                    closeDropdown();
                    onSelectLanguage(langCode, nextPath);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, langCode)}
                  aria-label={getAltText(langCode)}
                  tabIndex={0}
                  className={optionClassName}
                >
                  <div className={styles.optionFlagContainer}>
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
                  <span className={langNameClassName}>{getLanguageShortCode(langCode)}</span>
                </RouterAgnosticLink>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={toggleDropdown}
            onKeyDown={handleToggleKeyDown}
            aria-label={t('language.switcher.changeLanguage', 'Change language')}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            tabIndex={0}
            className={styles.currentButton}
          >
            <div
              className={cn(
                styles.flagContainer,
                isPastThreshold ? styles.borderPastThreshold : styles.borderBeforeThreshold
              )}
            >
              <ReactCountryFlag
                countryCode={COUNTRY_CODES[currentLanguage]}
                svg
                style={{
                  width: '1.4em',
                  height: 'auto',
                }}
                className={styles.flagIcon}
                aria-label={getAltText(currentLanguage)}
              />
            </div>
          </button>

          <div
            id={listboxId}
            className={cn(styles.dropdownMenu, isOpen && styles.open)}
            role="listbox"
            aria-label={t('language.switcher.label', 'Language')}
          >
            {displayLanguages.map((langCode) => {
              const nextPath = getNextPath(langCode);
              const isActive = currentLanguage === langCode;

              const optionClassName = cn(styles.option, isActive && styles.optionActive);
              const optionFlagClassName = cn(
                styles.optionFlagContainer,
                styles.optionFlagContainerDropdown
              );

              if (isActive) {
                return (
                  <button
                    key={langCode}
                    onKeyDown={(e) => handleKeyDown(e, langCode)}
                    disabled
                    aria-label={getAltText(langCode)}
                    role="option"
                    aria-selected={true}
                    tabIndex={0}
                    className={optionClassName}
                  >
                    <div className={optionFlagClassName}>
                      <ReactCountryFlag
                        countryCode={COUNTRY_CODES[langCode]}
                        svg
                        style={{
                          width: '1.4em',
                          height: 'auto',
                          display: 'block',
                        }}
                        className={styles.dropdownFlagIcon}
                        aria-label={getAltText(langCode)}
                      />
                    </div>
                  </button>
                );
              }

              return (
                <RouterAgnosticLink
                  key={langCode}
                  href={nextPath}
                  onClick={(e) => {
                    e.preventDefault();
                    closeDropdown();
                    onSelectLanguage(langCode, nextPath);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, langCode)}
                  aria-label={getAltText(langCode)}
                  role="option"
                  aria-selected={false}
                  tabIndex={0}
                  className={optionClassName}
                >
                  <div className={optionFlagClassName}>
                    <ReactCountryFlag
                      countryCode={COUNTRY_CODES[langCode]}
                      svg
                      style={{
                        width: '1.4em',
                        height: 'auto',
                        display: 'block',
                      }}
                      className={styles.dropdownFlagIcon}
                      aria-label={getAltText(langCode)}
                    />
                  </div>
                </RouterAgnosticLink>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Public LanguageSwitcher
 * - In SPA (React Router): uses client-side navigation (useNavigate)
 * - In Astro / no Router: falls back to full navigation (location.assign)
 */
export default function LanguageSwitcher(props) {
  // Astro owns routing (SSG). We always do full navigation.
  const { i18n } = useTranslation();
  // Hydration-safe: do not read window.location during render.
  // In Astro SSR, Header should pass `pathname` down when needed.
  const currentPathname = props.pathname || '/';

  const onSelectLanguage = (langCode, nextPathFromUi) => {
    i18n.changeLanguage(langCode);
    const nextPath = nextPathFromUi || translatePathname(currentPathname, langCode);
    if (typeof window !== 'undefined') {
      window.location.assign(nextPath);
    }
  };

  return <LanguageSwitcherUI {...props} pathname={currentPathname} onSelectLanguage={onSelectLanguage} />;
}
