import {TbTemperatureSun} from 'react-icons/tb'
import {RiContrastDrop2Line} from 'react-icons/ri'
import {FiLayers} from 'react-icons/fi'

/**
 * NOTE:
 * Okna mają predefiniowane parametry (ikony/etykiety) w kodzie.
 * W danych (lokalnych lub z Sanity) trzymamy tylko wartości (zgodne ze schematem Sanity):
 * - profileThickness
 * - thermalTransmittance
 * - waterTightness
 */

export const WINDOW_SPECS_DEFS = {
  profileThickness: {
    labelKey: 'productSpecs.labels.profileThickness',
    label: 'grubość profilu',
    icon: FiLayers,
  },
  thermalTransmittance: {
    labelKey: 'productSpecs.labels.thermalTransmittance',
    label: 'przenikanie ciepła (Uw)',
    icon: TbTemperatureSun,
  },
  waterTightness: {
    labelKey: 'productSpecs.labels.waterTightness',
    label: 'wodoszczelność',
    icon: RiContrastDrop2Line,
  },
}

export const WINDOW_SPECS_ORDER = ['profileThickness', 'thermalTransmittance', 'waterTightness']

// Na listingu (karta produktu) pokazujemy 3 najważniejsze parametry.
export const WINDOW_SPECS_ORDER_LIST = ['profileThickness', 'thermalTransmittance', 'waterTightness']

// W CMS usunęliśmy kolory (są takie same dla wszystkich okien), więc trzymamy je jako stałą w kodzie.
export const WINDOW_COLORS_PALETTE = [
  {
    id: 'ral9016',
    name: 'Biały Ruchu Drogowego',
    ral: 'RAL 9016',
    color: '#F7F9F4',
    description:
      'Klasyczna biel w wykończeniu matowym. Idealnie komponuje się z nowoczesnymi wnętrzami, dodając im lekkości i świeżości.',
  },
  {
    id: 'ral7016',
    name: 'Szary Antracytowy',
    ral: 'RAL 7016',
    color: '#383E42',
    description:
      'Głęboki odcień antracytu z satynowym wykończeniem. Elegancki i nowoczesny, doskonale podkreśla minimalistyczny charakter budynku.',
  },
  {
    id: 'ral9005',
    name: 'Czarny Głęboki',
    ral: 'RAL 9005',
    color: '#0E0E10',
    description: 'Intensywna czerń o głębokim, satynowym połysku. Nadaje oknom luksusowy, wyrazisty charakter.',
  },
  {
    id: 'ral7035',
    name: 'Szary jasny',
    ral: 'RAL 7035',
    color: '#C5C7C4',
    description: 'Jasny, neutralny szary. Uniwersalny i bardzo popularny w nowoczesnych realizacjach.',
  },
  {
    id: 'ral8017',
    name: 'Brąz czekoladowy',
    ral: 'RAL 8017',
    color: '#2F1B12',
    description: 'Głęboki brąz o klasycznym charakterze, dobrze komponuje się z drewnem i elewacjami w ciepłych tonach.',
  },
  {
    id: 'ral6005',
    name: 'Zieleń mchu',
    ral: 'RAL 6005',
    color: '#0F4336',
    description: 'Ciemna, elegancka zieleń. Świetna do budynków o naturalnym charakterze.',
  },
  {
    id: 'ral7021',
    name: 'Szary czarny',
    ral: 'RAL 7021',
    color: '#1F2324',
    description: 'Bardzo ciemny szary zbliżony do czerni. Minimalistyczny i nowoczesny.',
  },
  {
    id: 'ral1015',
    name: 'Kość słoniowa jasna',
    ral: 'RAL 1015',
    color: '#E6D2B5',
    description: 'Ciepły, jasny odcień beżu. Subtelny i ponadczasowy.',
  },
  {
    id: 'ral9006',
    name: 'Białe aluminium',
    ral: 'RAL 9006',
    color: '#A5A5A5',
    description: 'Metaliczny jasnoszary. Dobrze pasuje do nowoczesnych elewacji i detali aluminiowych.',
  },
  {
    id: 'ral7039',
    name: 'Szary kwarcowy',
    ral: 'RAL 7039',
    color: '#6B665E',
    description: 'Stonowany, ciemniejszy szary. Elegancki kompromis między antracytem a jasnym szarym.',
  },
  {
    id: 'ral8019',
    name: 'Brąz szary',
    ral: 'RAL 8019',
    color: '#3A3631',
    description: 'Ciemny, przygaszony brąz z nutą szarości. Bardzo „architektoniczny” odcień.',
  },
  {
    id: 'ral5011',
    name: 'Niebieski stalowy',
    ral: 'RAL 5011',
    color: '#1F2A44',
    description: 'Głęboki granat o stalowym charakterze. Wyróżnia się, ale pozostaje elegancki.',
  },
  {
    id: 'ral3005',
    name: 'Czerwony wino',
    ral: 'RAL 3005',
    color: '#5E2129',
    description: 'Ciemna, szlachetna czerwień. Dobrze współgra z klasycznymi elewacjami.',
  },
  {
    id: 'ral9001',
    name: 'Kremowy',
    ral: 'RAL 9001',
    color: '#F2EFE6',
    description: 'Ciepła, delikatna biel. Alternatywa dla czystej bieli w bardziej klasycznych projektach.',
  },
  {
    id: 'ral7022',
    name: 'Szary umbra',
    ral: 'RAL 7022',
    color: '#3D3F3A',
    description: 'Ciemny szary o lekko ziemistym odcieniu. Stabilny, nowoczesny kolor elewacyjny.',
  },
]

const WINDOW_RAL_TRANSLATIONS = {
  ral9016: {
    en: {
      name: 'Traffic white',
      description:
        'Classic white in a matte finish. Perfect for modern interiors, adding lightness and freshness.',
    },
    de: {
      name: 'Verkehrsweiß',
      description:
        'Klassisches Weiß in matter Ausführung. Ideal für moderne Innenräume und eine helle, klare Optik.',
    },
    fr: {
      name: 'Blanc signalisation',
      description:
        'Blanc classique en finition mate. Idéal pour les intérieurs modernes, avec une impression de légèreté.',
    },
  },
  ral7016: {
    en: {
      name: 'Anthracite grey',
      description:
        'Deep anthracite tone with a satin finish. Elegant and modern, ideal for minimalist architecture.',
    },
    de: {
      name: 'Anthrazitgrau',
      description:
        'Tiefer Anthrazitton mit satinierter Oberfläche. Elegant und modern, ideal für minimalistische Architektur.',
    },
    fr: {
      name: 'Gris anthracite',
      description:
        'Teinte anthracite profonde en finition satinée. Élégante et moderne, parfaite pour une architecture minimaliste.',
    },
  },
  ral9005: {
    en: {
      name: 'Jet black',
      description: 'Intense black with a deep satin look. Gives windows a distinctive, premium character.',
    },
    de: {
      name: 'Tiefschwarz',
      description: 'Intensives Schwarz mit tiefer, satinierter Wirkung. Verleiht Fenstern einen markanten Premium-Look.',
    },
    fr: {
      name: 'Noir foncé',
      description: 'Noir intense à l’aspect satiné profond. Donne aux fenêtres un caractère haut de gamme.',
    },
  },
  ral7035: {
    en: {
      name: 'Light grey',
      description: 'Light neutral grey. A versatile and very popular choice in modern projects.',
    },
    de: {
      name: 'Lichtgrau',
      description: 'Helles, neutrales Grau. Universell einsetzbar und sehr beliebt in modernen Projekten.',
    },
    fr: {
      name: 'Gris clair',
      description: 'Gris clair et neutre. Un choix polyvalent et très populaire dans les projets contemporains.',
    },
  },
  ral8017: {
    en: {
      name: 'Chocolate brown',
      description: 'Deep brown with a classic character, matching wood and warm-toned façades very well.',
    },
    de: {
      name: 'Schokoladenbraun',
      description: 'Tiefes Braun mit klassischem Charakter, passend zu Holz und Fassaden in warmen Tönen.',
    },
    fr: {
      name: 'Brun chocolat',
      description: 'Brun profond au caractère classique, en harmonie avec le bois et les façades aux tons chauds.',
    },
  },
  ral6005: {
    en: {
      name: 'Moss green',
      description: 'Dark, elegant green. Great for buildings with a natural architectural character.',
    },
    de: {
      name: 'Moosgrün',
      description: 'Dunkles, elegantes Grün. Ideal für Gebäude mit natürlichem architektonischem Charakter.',
    },
    fr: {
      name: 'Vert mousse',
      description: 'Vert foncé et élégant. Très adapté aux bâtiments avec un caractère naturel.',
    },
  },
  ral7021: {
    en: {
      name: 'Black grey',
      description: 'Very dark grey close to black. Minimalist and modern in appearance.',
    },
    de: {
      name: 'Schwarzgrau',
      description: 'Sehr dunkles Grau, nahe an Schwarz. Minimalistisch und modern im Erscheinungsbild.',
    },
    fr: {
      name: 'Gris noir',
      description: 'Gris très foncé proche du noir. Un rendu minimaliste et contemporain.',
    },
  },
  ral1015: {
    en: {
      name: 'Light ivory',
      description: 'Warm, light beige tone. Subtle and timeless for both classic and modern projects.',
    },
    de: {
      name: 'Hellelfenbein',
      description: 'Warmer, heller Beigeton. Dezent und zeitlos für klassische und moderne Projekte.',
    },
    fr: {
      name: 'Ivoire clair',
      description: 'Teinte beige claire et chaleureuse. Subtile et intemporelle, en style classique ou moderne.',
    },
  },
  ral9006: {
    en: {
      name: 'White aluminium',
      description: 'Metallic light grey. Works perfectly with modern façades and aluminium details.',
    },
    de: {
      name: 'Weißaluminium',
      description: 'Metallisches Hellgrau. Passt hervorragend zu modernen Fassaden und Aluminiumdetails.',
    },
    fr: {
      name: 'Aluminium blanc',
      description: 'Gris clair métallisé. S’accorde parfaitement avec les façades modernes et les détails en aluminium.',
    },
  },
  ral7039: {
    en: {
      name: 'Quartz grey',
      description: 'Balanced dark grey. A refined middle ground between anthracite and light grey.',
    },
    de: {
      name: 'Quarzgrau',
      description: 'Ausgewogenes, dunkleres Grau. Ein eleganter Mittelweg zwischen Anthrazit und Hellgrau.',
    },
    fr: {
      name: 'Gris quartz',
      description: 'Gris soutenu et équilibré. Un compromis élégant entre l’anthracite et le gris clair.',
    },
  },
  ral8019: {
    en: {
      name: 'Grey brown',
      description: 'Dark, muted brown with a grey undertone. A distinctly architectural shade.',
    },
    de: {
      name: 'Graubraun',
      description: 'Dunkles, gedämpftes Braun mit grauer Note. Ein deutlich architektonischer Farbton.',
    },
    fr: {
      name: 'Brun gris',
      description: 'Brun sombre et atténué avec une nuance de gris. Une teinte très architecturale.',
    },
  },
  ral5011: {
    en: {
      name: 'Steel blue',
      description: 'Deep navy-blue with a steel character. Distinctive while still elegant.',
    },
    de: {
      name: 'Stahlblau',
      description: 'Tiefes Blau mit stählernem Charakter. Ausdrucksstark und zugleich elegant.',
    },
    fr: {
      name: 'Bleu acier',
      description: 'Bleu profond au caractère acier. Une teinte marquée qui reste élégante.',
    },
  },
  ral3005: {
    en: {
      name: 'Wine red',
      description: 'Dark, noble red. Works especially well with classic façades and traditional forms.',
    },
    de: {
      name: 'Weinrot',
      description: 'Dunkles, nobles Rot. Harmoniert besonders mit klassischen Fassaden und traditionellen Formen.',
    },
    fr: {
      name: 'Rouge vin',
      description: 'Rouge sombre et noble. Très adapté aux façades classiques et aux formes traditionnelles.',
    },
  },
  ral9001: {
    en: {
      name: 'Cream',
      description: 'Warm off-white. A softer alternative to pure white in more classic concepts.',
    },
    de: {
      name: 'Cremeweiß',
      description: 'Warmes Cremeweiß. Eine sanftere Alternative zu Reinweiß in klassischeren Konzepten.',
    },
    fr: {
      name: 'Blanc crème',
      description: 'Blanc chaud légèrement cassé. Une alternative douce au blanc pur dans les projets plus classiques.',
    },
  },
  ral7022: {
    en: {
      name: 'Umbra grey',
      description: 'Dark grey with a subtle earthy undertone. Stable, contemporary façade colour.',
    },
    de: {
      name: 'Umbragrau',
      description: 'Dunkles Grau mit leicht erdigem Unterton. Ein stabiler, zeitgemäßer Fassadenfarbton.',
    },
    fr: {
      name: 'Gris ombre',
      description: 'Gris foncé avec une légère nuance terreuse. Une couleur de façade stable et contemporaine.',
    },
  },
}

export function getLocalizedWindowColorsPalette(locale = 'pl') {
  if (locale === 'pl') {
    return WINDOW_COLORS_PALETTE;
  }

  return WINDOW_COLORS_PALETTE.map((color) => {
    const translation = WINDOW_RAL_TRANSLATIONS[color.id]?.[locale];

    if (!translation) {
      return color;
    }

    return {
      ...color,
      name: translation.name,
      description: translation.description,
    };
  });
}

export const WINDOW_LAZUR_PALETTE = [
  {
    id: 'lazur-e4-16-46t',
    name: 'Acacia',
    ral: 'E4.16.46T',
    image: '/images/colors/E4.16.46T-acacia.png',
    description:
      'Dekor lazur Acacia (kod E4.16.46T) o ciepłym, naturalnym charakterze drewna. Dobrze komponuje się z klasycznymi i nowoczesnymi elewacjami.',
  },
  {
    id: 'lazur-e2-26-56t',
    name: 'Douglas',
    ral: 'E2.26.56T',
    image: '/images/colors/E2.26.56T-douglas.png',
    description:
      'Lazur Douglas (kod E2.26.56T) o ciepłym, miodowo-brązowym charakterze. Dobrze podkreśla usłojenie i nadaje profilom naturalny, stolarski wygląd.',
  },
  {
    id: 'lazur-e8-35-66t',
    name: 'Érable Naturel',
    ral: 'E8.35.66T',
    image: '/images/colors/E8.35.66T-Erable Naturel.png',
    description:
      'Lazur Érable Naturel (kod E8.35.66T) w jasnym, naturalnym tonie klonu. Rozjaśnia wizualnie stolarkę i dobrze komponuje się z nowoczesnymi, lekkimi elewacjami.',
  },
  {
    id: 'lazur-g1-18-82t',
    name: 'Peuplier',
    ral: 'G1.18.82T',
    image: '/images/colors/G1.18.82T-peupiler.png',
    description:
      'Lazur Peuplier (kod G1.18.82T) o stonowanym, neutralno-ciepłym odcieniu drewna. Uniwersalny wybór do projektów klasycznych i nowoczesnych.',
  },
]

export const windowProductDetails = {
  pava: {
    category: 'Okna',
    name: 'PAVA',
    shortDescription:
      'Nowatorskie okno zaprojektowane z myślą o rosnących potrzebach, takich jak większa energooszczędność i nieprzemijający design.',
    longDescription:
      'Obniżony profil skrzydła to nawet 10% więcej naturalnego światła we wnętrzu. Dzięki dodatkowej uszczelce w ramie, system PAVA zapewnia skuteczniejszą izolację cieplną i akustyczną. Przełomowa technologia suchego wklejania szyby sprawia, że otwieranie i zamykanie okna przebiega niezwykle płynnie.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pava/pava-1.jpg', '/images/products/windows/pava/pava-2.jpg'],
    video: '/videos/products/windows/pava/pava.mp4',
    specs: {
      profileThickness: '82–86 mm',
      thermalTransmittance: 'Uw < 0,73',
      waterTightness: 'do 1500 Pa',
    },
    features: [
      {
        text: 'Skrzydło posiada <strong>obniżoną przylgę szybową</strong>. Dzięki temu do wnętrza wpada nawet 10% więcej światła.',
      },
      {
        text: '<strong>7-komorowy profil ramy</strong> i 6-komorowy profil skrzydła klasy A o głębokości zabudowy 82 mm (rama), 86 mm (skrzydło).',
      },
      {
        text: 'Szeroki <strong>zakres grubości możliwych do zastosowania pakietów szybowych</strong>, między 35 a 59 mm.',
      },
      {text: 'Możliwość wyboru <strong>listwy przyszybowej PIXEL</strong> lub KONCEPT.'},
      {text: '<strong>Zewnętrzna uszczelka szybowa</strong> maskująca taśmę STV.'},
      {text: 'Okna nie wymagają tak częstej regulacji jak okna bez <strong>technologii STV</strong>.'},
      {
        text: 'Okucia działają jeszcze lżej w porównaniu do okna z szybą wbijaną, co wpływa na <strong>bardziej komfortowe otwieranie i zamykanie</strong> okna PAVA.',
      },
    ],
    // Lokalnie można nadpisać, ale jeśli brak w danych (np. Sanity) UI weźmie WINDOW_COLORS_PALETTE.
    colors: WINDOW_COLORS_PALETTE,
    advantages: [
      {
        title: 'Doskonała izolacja termiczna',
        description:
          'Niski współczynnik przenikania ciepła Uw zapewnia minimalne straty ciepła i niższe rachunki za ogrzewanie.',
      },
      {
        title: 'Więcej światła',
        description: 'Obniżony profil skrzydła pozwala na wpuszczenie nawet 10% więcej naturalnego światła.',
      },
      {
        title: 'Technologia STV',
        description: 'Suche wklejanie szyby zapewnia płynne działanie i rzadszą potrzebę regulacji.',
      },
      {
        title: 'Wysoka wodoszczelność',
        description: 'Wysoka odporność na działanie wody opadowej nawet przy silnym wietrze.',
      },
    ],
  },

  pilar: {
    category: 'Okna',
    name: 'PILAR',
    shortDescription: 'System okienny łączący elegancję z funkcjonalnością.',
    longDescription: 'Okna PILAR to połączenie nowoczesnego designu z najwyższą jakością wykonania.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/windows/pava/pava.mp4',
    specs: {
      profileThickness: '82–86 mm',
      thermalTransmittance: 'Uw < 0,79',
      waterTightness: 'do 1500 Pa',
    },
    features: [],
    colors: [],
    advantages: [],
  },

  prismatic: {
    category: 'Okna',
    name: 'PRISMATIC',
    shortDescription: 'Okna o geometrycznym, nowoczesnym designie.',
    longDescription: 'System PRISMATIC wyróżnia się charakterystycznym kształtem profilu.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/windows/pava/pava.mp4',
    specs: {
      profileThickness: '82–86 mm',
      thermalTransmittance: 'Uw < 0,79',
      waterTightness: 'do 1500 Pa',
    },
    features: [],
    colors: [],
    advantages: [],
  },
}

export const windowCategory = {
  id: 'okna',
  detailType: 'windows',
  title: 'Produkty okienne',
  subtitle: 'Poznaj nasze nowoczesne systemy okienne.',
  pageTitle: 'Okna',
  headerImage: '/images/products/windows/top.jpg',
  products: [
    {
      id: 'pava',
      name: 'PAVA',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specs: {
        profileThickness: '82–86 mm',
        thermalTransmittance: 'Uw < 0,73',
        waterTightness: 'do 1500 Pa',
      },
      image: '/images/products/windows/pilar.png',
    },
    {
      id: 'pilar',
      name: 'PILAR',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specs: {
        profileThickness: '82–86 mm',
        thermalTransmittance: 'Uw < 0,79',
        waterTightness: 'do 1500 Pa',
      },
      image: '/images/products/windows/pilar.png',
    },
    {
      id: 'prismatic',
      name: 'PRISMATIC',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specs: {
        profileThickness: '82–86 mm',
        thermalTransmittance: 'Uw < 0,79',
        waterTightness: 'do 1500 Pa',
      },
      image: '/images/products/windows/pilar.png',
    },
  ],
}
