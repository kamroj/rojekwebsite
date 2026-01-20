import { windowCategory, windowProductDetails } from './windows.js';

export const productCategories = {
  okna: windowCategory,
  drzwi: {
    id: 'drzwi',
    detailType: 'doors',
    title: 'Produkty drzwiowe',
    subtitle: 'Poznaj nasze nowoczesne systemy drzwiowe.',
    pageTitle: 'Drzwi',
    headerImage: '/images/products/drzwi-header.jpg',
    products: []
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
  windows: windowProductDetails
};
