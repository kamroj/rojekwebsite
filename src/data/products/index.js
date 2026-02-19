import { windowCategory, windowProductDetails } from './windows.js';
import { DOORS_MOCK_DATA, getAllDoors, getDoorBySlug } from './doors.js';
import { HS_PRODUCT_DETAILS } from './hs.js';

// Convenience re-export.
// NOTE: In Node ESM (used by Astro build/SSG), directory imports like `../data/products` are not supported.
// Prefer importing explicitly from `../data/products/index.js`.
export { windowCategory, windowProductDetails };
export { DOORS_MOCK_DATA, getAllDoors };

const FIRE_RATED_DOOR = getDoorBySlug('okna-ei30-ei60');

const hsProductsList = [HS_PRODUCT_DETAILS['drewno-alu'], HS_PRODUCT_DETAILS.drewno].filter(Boolean);

// Convert doors mock data to the format expected by productDetailsByType
const doorProductDetails = {};
DOORS_MOCK_DATA.forEach(door => {
  doorProductDetails[door.slug] = door;
});

export const productCategories = {
  okna: windowCategory,
  oknaPrzesuwne: {
    id: 'oknaPrzesuwne',
    detailType: 'hs',
    title: 'Okna przesuwne HS',
    subtitle: 'Wybierz wariant systemu HS dopasowany do Twojego projektu.',
    pageTitle: 'Okna przesuwne HS',
    headerImage: '/images/hs/top.jpg',
    products: hsProductsList.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || '/images/aboutus/hs-kafelka.webp',
      description: product.shortDescription,
      specs: product.specs,
    })),
  },
  drzwi: {
    id: 'drzwi',
    detailType: 'doors',
    title: 'Produkty drzwiowe',
    subtitle: 'Poznaj nasze nowoczesne systemy drzwiowe.',
    pageTitle: 'Drzwi',
    headerImage: '/images/aboutus/drzwi-kafelka.webp',
    products: DOORS_MOCK_DATA.filter((door) => door.slug !== 'okna-ei30-ei60').map(door => ({
      id: door.id,
      slug: door.slug,
      name: door.name,
      image: door.images[0],
      description: door.shortDescription,
      specs: door.specs
    }))
  },
  oknaDrzwiPrzeciwpozarowe: {
    id: 'oknaDrzwiPrzeciwpozarowe',
    detailType: 'doors',
    title: 'Okna i drzwi przeciwpożarowe',
    subtitle: 'Certyfikowana stolarka EI30 / EI60 do inwestycji mieszkaniowych i komercyjnych.',
    pageTitle: 'Okna i drzwi przeciwpożarowe',
    headerImage: '/images/aboutus/drzwi-ppoz-kafelka.webp',
    products: FIRE_RATED_DOOR ? [{
      id: FIRE_RATED_DOOR.id,
      slug: FIRE_RATED_DOOR.slug,
      name: FIRE_RATED_DOOR.name,
      image: FIRE_RATED_DOOR.images?.[0],
      description: FIRE_RATED_DOOR.shortDescription,
      specs: FIRE_RATED_DOOR.specs,
    }] : [],
  },
  bramy: {
    id: 'bramy',
    detailType: 'gates',
    title: 'Bramy garażowe',
    subtitle: 'Poznaj nasze nowoczesne systemy bram garażowych.',
    pageTitle: 'Bramy',
    headerImage: '/images/products/bramy-header.jpg',
    products: []
  },
  rolety: {
    id: 'rolety',
    detailType: 'shutters',
    title: 'Rolety i żaluzje',
    subtitle: 'Poznaj nasze nowoczesne systemy rolet i żaluzji.',
    pageTitle: 'Rolety',
    headerImage: '/images/products/rolety-header.jpg',
    products: []
  }
};

export const productDetailsByType = {
  windows: windowProductDetails,
  doors: doorProductDetails,
  hs: HS_PRODUCT_DETAILS,
};
