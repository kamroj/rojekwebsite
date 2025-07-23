export const PRODUCT_TYPES = {
  WINDOWS: 'windows',
  EXTERIOR_DOORS: 'exteriorDoors',
  INTERIOR_DOORS: 'interiorDoors',
  SLIDING: 'sliding'
};

export const ROUTES = {
  HOME: '/',
  REALIZATIONS: '/realizations',
  ABOUT: '/about',
  CONTACT: '/contact'
};

export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 992,
  LG: 1200
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  DEFAULT: 300,
  SLOW: 500
};

export const GALLERY_CONFIG = {
  DEFAULT_SLIDES_PER_VIEW: {
    DESKTOP: 3,
    TABLET: 2,
    MOBILE: 1
  },
  DEFAULT_DELAY: 3500,
  AUTOPLAY_DELAY: 4000
};

export const SUPPORTED_LANGUAGES = ['pl', 'en', 'de'];

export const DEFAULT_LANGUAGE = 'pl';

export const COUNTRY_CODES = {
  pl: 'PL',
  en: 'GB',
  de: 'DE'
};

export const VIDEO_SOURCES = {
  WINDOWS: '/videos/window.mp4',
  EXTERIOR_DOORS: '/videos/door.mp4',
  INTERIOR_DOORS: '/videos/interior-door.mp4',
  SLIDING: '/videos/hs.mp4',
  BACKGROUND: '/videos/background4.mp4'
};

export const IMAGE_PATHS = {
  LOGO: '/src/assets/images/logo.png',
  REALIZATIONS: '/images/realizations/',
  PARTNERS: '/images/partners/',
  ICONS: '/images/icons/'
};

export const REALIZATION_IMAGES = [
  { id: 1, src: '/images/realizations/realization1.jpg' },
  { id: 2, src: '/images/realizations/realization2.jpg' },
  { id: 3, src: '/images/realizations/realization3.jpg' },
  { id: 4, src: '/images/realizations/realization4.jpg' },
  { id: 5, src: '/images/realizations/realization5.jpg' },
  { id: 6, src: '/images/realizations/realization6.jpg' },
  { id: 7, src: '/images/realizations/realization7.jpg' },
  { id: 8, src: '/images/realizations/realization8.jpg' }
];

export const PARTNER_LOGOS = [
  { id: 1, src: '/images/partners/aluron.png', alt: 'Aluron' },
  { id: 2, src: '/images/partners/matpol.png', alt: 'Matpol' },
  { id: 3, src: '/images/partners/okno-pol.jpg', alt: 'Okno-Pol' },
  { id: 4, src: '/images/partners/roto.png', alt: 'Roto' }
];

export const WHY_US_ICONS = {
  EXPERIENCE: '/images/icons/clock-icon.png',
  QUALITY: '/images/icons/shield-icon.png',
  SERVICE: '/images/icons/tools-icon.png',
  WARRANTY: '/images/icons/cowork-icon.png'
};
