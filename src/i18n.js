import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Loads translations from your server (public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(HttpApi)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // debug: true, // Enable logs in development
    fallbackLng: 'pl', // Use Polish if detected language is not available
    supportedLngs: ['pl', 'en', 'de'], // Define supported languages
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      // Path where resources get loaded from, we will store translation files here
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      // Order and from where user language should be detected
      // With URL prefixes (/en, /de) we want the path to win.
      order: ['path', 'localStorage', 'navigator', 'htmlTag', 'subdomain'],
      // Caches the language in localStorage
      caches: ['localStorage'],
    }
  });

export default i18n;
