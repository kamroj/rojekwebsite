import { 
  REALIZATION_IMAGES, 
  PARTNER_LOGOS, 
  WHY_US_ICONS, 
  VIDEO_SOURCES 
} from '../constants';

// Funkcja do zbierania zasobów dla HomePage
export const collectHomePageResources = (productData) => {
  const resources = [];

  // Logo w LoadingScreen
  resources.push('/images/logo.png');

  // Video z IntroSection
  resources.push(VIDEO_SOURCES.BACKGROUND);

  // Wszystkie filmy z ProductSection
  if (productData) {
    Object.values(productData).forEach(product => {
      if (product.videoSrc) {
        resources.push(product.videoSrc);
      }
      // Pomijamy postery, które nie istnieją
      // if (product.posterSrc) {
      //   resources.push(product.posterSrc);
      // }
    });
  }

  // Obrazy z RealizationsGallery
  REALIZATION_IMAGES.forEach(image => {
    resources.push(image.src);
  });

  // Ikony z WhyUsSection
  Object.values(WHY_US_ICONS).forEach(iconPath => {
    resources.push(iconPath);
  });

  // Loga partnerów
  PARTNER_LOGOS.forEach(partner => {
    resources.push(partner.src);
  });

  return resources;
};

// Funkcja do zbierania zasobów dla RealizationsPage
export const collectRealizationsPageResources = () => {
  const resources = [];

  // Logo w LoadingScreen
  resources.push('/images/logo.png');

  // Wszystkie obrazy realizacji
  REALIZATION_IMAGES.forEach(image => {
    resources.push(image.src);
  });

  return resources;
};

// Funkcja do zbierania zasobów dla AboutPage
export const collectAboutPageResources = () => {
  const resources = [];

  // Logo w LoadingScreen
  resources.push('/images/logo.png');

  // Tutaj można dodać specyficzne zasoby dla AboutPage
  // np. zdjęcia zespołu, certyfikaty itp.

  return resources;
};

// Funkcja do zbierania zasobów dla ContactPage
export const collectContactPageResources = () => {
  const resources = [];

  // Logo w LoadingScreen
  resources.push('/images/logo.png');

  // Tutaj można dodać specyficzne zasoby dla ContactPage
  // np. mapa, zdjęcia biura itp.

  return resources;
};

// Główna funkcja kolektora - automatycznie wybiera odpowiednią funkcję na podstawie ścieżki
export const collectPageResources = (pathname, additionalData = {}) => {
  switch (pathname) {
    case '/':
      return collectHomePageResources(additionalData.productData);
    
    case '/realizations':
      return collectRealizationsPageResources();
    
    case '/about':
      return collectAboutPageResources();
    
    case '/contact':
      return collectContactPageResources();
    
    default:
      // Dla nieznanych ścieżek, zwróć przynajmniej logo
      return ['/images/logo.png'];
  }
};

// Funkcja pomocnicza do filtrowania unikalnych zasobów
export const getUniqueResources = (resources) => {
  return [...new Set(resources.filter(resource => resource && resource.trim() !== ''))];
};

// Funkcja do zbierania zasobów z komponentu (dla bardziej zaawansowanych przypadków)
export const collectComponentResources = (componentName, props = {}) => {
  const resources = [];

  switch (componentName) {
    case 'RealizationsGallery':
      if (props.images) {
        props.images.forEach(image => {
          if (image.src) resources.push(image.src);
        });
      }
      break;

    case 'ProductSection':
      if (props.productData) {
        Object.values(props.productData).forEach(product => {
          if (product.videoSrc) resources.push(product.videoSrc);
          if (product.posterSrc) resources.push(product.posterSrc);
        });
      }
      break;

    case 'PartnersSection':
      PARTNER_LOGOS.forEach(partner => {
        resources.push(partner.src);
      });
      break;

    case 'WhyUsSection':
      Object.values(WHY_US_ICONS).forEach(iconPath => {
        resources.push(iconPath);
      });
      break;

    case 'IntroSection':
      resources.push(VIDEO_SOURCES.BACKGROUND);
      break;

    default:
      break;
  }

  return resources;
};
