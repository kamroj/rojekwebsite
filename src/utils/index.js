import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../constants/index.js';

/**
 * Validates if a language code is supported
 * @param {string} langCode - Language code to validate
 * @returns {boolean} - Whether the language is supported
 */
export const isLanguageSupported = (langCode) => {
  return SUPPORTED_LANGUAGES.includes(langCode);
};

/**
 * Gets the current language or falls back to default
 * @param {string} currentLang - Current language from i18n
 * @returns {string} - Valid language code
 */
export const getValidLanguage = (currentLang) => {
  const lang = currentLang?.split('-')[0];
  return isLanguageSupported(lang) ? lang : DEFAULT_LANGUAGE;
};

/**
 * Formats a translation key for consistent usage
 * @param {string} section - Section name
 * @param {string} key - Key name
 * @returns {string} - Formatted translation key
 */
export const formatTranslationKey = (section, key) => {
  return `${section}.${key}`;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let lastCall = 0;
  let timeoutId = null;
  let lastArgs;
  let lastThis;
  
  return function throttled(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    lastArgs = args;
    lastThis = this;
  
    // Leading call
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    } else if (!timeoutId) {
      // Schedule trailing call to ensure the final state is applied
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      }, remaining);
    }
  };
};

/**
 * Checks if device is mobile based on screen width
 * @param {number} width - Screen width
 * @returns {boolean} - Whether device is mobile
 */
export const isMobileDevice = (width = (typeof window !== 'undefined' ? window.innerWidth : 1024)) => {
  return width < 768;
};

/**
 * Checks if device is tablet based on screen width
 * @param {number} width - Screen width
 * @returns {boolean} - Whether device is tablet
 */
export const isTabletDevice = (width = (typeof window !== 'undefined' ? window.innerWidth : 1024)) => {
  return width >= 768 && width < 992;
};

/**
 * Gets device type based on screen width
 * @param {number} width - Screen width
 * @returns {string} - Device type: 'mobile', 'tablet', or 'desktop'
 */
export const getDeviceType = (width = (typeof window !== 'undefined' ? window.innerWidth : 1024)) => {
  if (width < 768) return 'mobile';
  if (width < 992) return 'tablet';
  return 'desktop';
};

/**
 * Safely gets nested object property
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} - Value at path or default value
 */
export const getNestedProperty = (obj, path, defaultValue = null) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
};

/**
 * Generates unique ID for components
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

/**
 * Lazy loads images with intersection observer
 * @param {HTMLElement} img - Image element
 * @param {string} src - Image source
 */
export const lazyLoadImage = (img, src) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = src;
          entry.target.classList.remove('lazy');
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(img);
  } else {
    img.src = src;
  }
};

/**
 * Handles keyboard navigation for accessibility
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Function} onEnter - Function to call on Enter key
 * @param {Function} onSpace - Function to call on Space key
 */
export const handleKeyboardNavigation = (event, onEnter, onSpace) => {
  if (event.key === 'Enter' && onEnter) {
    event.preventDefault();
    onEnter();
  } else if (event.key === ' ' && onSpace) {
    event.preventDefault();
    onSpace();
  }
};

/**
 * Scrolls to element smoothly
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top
 */
export const scrollToElement = (target, offset = 0) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
