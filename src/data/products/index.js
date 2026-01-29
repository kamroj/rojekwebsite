import { windowCategory, windowProductDetails } from './windows.js';
import { DOORS_MOCK_DATA, getAllDoors } from './doors.js';

// Convenience: re-export from this folder so consumers can import from "../data/products".
export { windowCategory, windowProductDetails };
export { DOORS_MOCK_DATA, getAllDoors };

// Convert doors mock data to the format expected by productDetailsByType
const doorProductDetails = {};
DOORS_MOCK_DATA.forEach(door => {
  doorProductDetails[door.slug] = door;
});

export const productCategories = {
  okna: windowCategory,
  drzwi: {
    id: 'drzwi',
    detailType: 'doors',
    title: 'Produkty drzwiowe',
    subtitle: 'Poznaj nasze nowoczesne systemy drzwiowe.',
    pageTitle: 'Drzwi',
    headerImage: '/images/aboutus/drzwi-kafelka.png',
    products: DOORS_MOCK_DATA.map(door => ({
      id: door.id,
      slug: door.slug,
      name: door.name,
      image: door.images[0],
      description: door.shortDescription,
      specs: door.specs
    }))
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
  doors: doorProductDetails
};
