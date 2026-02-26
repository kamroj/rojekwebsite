// Product details source-of-truth is Sanity for:
// - windows (okna)
// - sliding windows HS (oknaPrzesuwne)
// - doors (drzwi)
// - fire-rated windows & doors (oknaDrzwiPrzeciwpozarowe)
//
// Keep only static category metadata here (titles, static headers, etc.).
// Do NOT keep local/mock product entities in this module.

export const productCategories = {
  okna: {
    id: 'okna',
    detailType: 'windows',
    title: 'Produkty okienne',
    subtitle: 'Poznaj nasze nowoczesne systemy okienne.',
    pageTitle: 'Okna',
    headerImage: '/images/products/windows/top.jpg',
    products: [],
  },
  oknaPrzesuwne: {
    id: 'oknaPrzesuwne',
    detailType: 'hs',
    title: 'Okna przesuwne HS',
    subtitle: 'Wybierz wariant systemu HS dopasowany do Twojego projektu.',
    pageTitle: 'Okna przesuwne HS',
    headerImage: '/images/hs/top.jpg',
    products: [],
  },
  drzwi: {
    id: 'drzwi',
    detailType: 'doors',
    title: 'Produkty drzwiowe',
    subtitle: 'Poznaj nasze nowoczesne systemy drzwiowe.',
    pageTitle: 'Drzwi',
    headerImage: '/images/aboutus/drzwi-kafelka.webp',
    products: [],
  },
  oknaDrzwiPrzeciwpozarowe: {
    id: 'oknaDrzwiPrzeciwpozarowe',
    detailType: 'doors',
    title: 'Okna i drzwi ppoż.',
    subtitle: 'Certyfikowana stolarka EI30 / EI60 do inwestycji mieszkaniowych i komercyjnych.',
    pageTitle: 'Okna i drzwi ppoż.',
    headerImage: '/images/aboutus/drzwi-ppoz-kafelka.webp',
    products: [],
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
  windows: {},
  doors: {},
  hs: {},
};
