import { RxDimensions } from 'react-icons/rx';
import { TbTemperatureSun, TbVolume, TbWind } from 'react-icons/tb';
import { RiContrastDrop2Line } from 'react-icons/ri';
import { FiCheck } from 'react-icons/fi';

export const windowProductDetails = {
  pava: {
    category: 'Okna',
    name: 'PAVA',
    shortDescription: 'Nowatorskie okno zaprojektowane z myślą o rosnących potrzebach, takich jak większa energooszczędność i nieprzemijający design.',
    longDescription: 'Obniżony profil skrzydła to nawet 10% więcej naturalnego światła we wnętrzu. Dzięki dodatkowej uszczelce w ramie, system PAVA zapewnia skuteczniejszą izolację cieplną i akustyczną. Przełomowa technologia suchego wklejania szyby sprawia, że otwieranie i zamykanie okna przebiega niezwykle płynnie.',
    headerImage: '/images/hs/top.jpg',
    images: [
      '/images/products/windows/pava/pava-1.jpg',
      '/images/products/windows/pava/pava-2.jpg'
    ],
    video: '/videos/products/windows/pava/pava.mp4',
    specs: {
      soundInsulation: {
        value: 'Rw = 38 (-2; -7) dB',
        label: 'Wskaźnik izolacyjności akustycznej właściwej',
        icon: TbVolume
      },
      thermalTransmittance: {
        value: 'Uw = 0,75 W/(m²K)',
        label: 'Współczynnik przenikania ciepła',
        icon: TbTemperatureSun
      },
      windResistance: {
        value: '800 - 1600 Pa',
        label: 'Odporność na obciążenie wiatrem',
        icon: TbWind
      },
      waterTightness: {
        value: '600 Pa',
        label: 'Wodoszczelność',
        icon: RiContrastDrop2Line
      }
    },
    features: [
      {
        text: 'Skrzydło posiada <strong>obniżoną przylgę szybową</strong>. Dzięki temu do wnętrza wpada nawet 10% więcej światła.'
      },
      {
        text: '<strong>7-komorowy profil ramy</strong> i 6-komorowy profil skrzydła klasy A o głębokości zabudowy 82 mm (rama), 86 mm (skrzydło).'
      },
      {
        text: 'Szeroki <strong>zakres grubości możliwych do zastosowania pakietów szybowych</strong>, między 35 a 59 mm.'
      },
      {
        text: 'Możliwość wyboru <strong>listwy przyszybowej PIXEL</strong> lub KONCEPT.'
      },
      {
        text: '<strong>Zewnętrzna uszczelka szybowa</strong> maskująca taśmę STV.'
      },
      {
        text: 'Okna nie wymagają tak częstej regulacji jak okna bez <strong>technologii STV</strong>.'
      },
      {
        text: 'Okucia działają jeszcze lżej w porównaniu do okna z szybą wbijaną, co wpływa na <strong>bardziej komfortowe otwieranie i zamykanie</strong> okna PAVA.'
      }
    ],
    colors: [
      {
        id: 'ral9016',
        name: 'Biały Ruchu Drogowego',
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym. Idealnie komponuje się z nowoczesnymi wnętrzami, dodając im lekkości i świeżości.'
      },
      {
        id: 'ral7016',
        name: 'Szary Antracytowy',
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu z satynowym wykończeniem. Elegancki i nowoczesny, doskonale podkreśla minimalistyczny charakter budynku.'
      },
      {
        id: 'ral9005',
        name: 'Czarny Głęboki',
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń o głębokim, satynowym połysku. Nadaje oknom luksusowy, wyrazisty charakter.'
      },
      {
        id: 'ral7035',
        name: 'Szary Jasny',
        ral: 'RAL 7035',
        color: '#C5C7C4',
        description: 'Delikatny, jasny odcień szarości. Neutralny ton, który doskonale harmonizuje z różnymi stylami architektonicznymi.'
      },
      {
        id: 'ral8017',
        name: 'Brąz Czekoladowy',
        ral: 'RAL 8017',
        color: '#3E2B23',
        description: 'Ciepły, głęboki odcień brązu przypominający czekoladę. Nadaje ciepła i przytulności.'
      },
      {
        id: 'ral6005',
        name: 'Zielony Mchowy',
        ral: 'RAL 6005',
        color: '#0F4336',
        description: 'Głęboka, butelkowa zieleń o eleganckim charakterze. Nawiązuje do natury i doskonale komponuje się z otoczeniem.'
      },
      {
        id: 'ral7021',
        name: 'Szary Czarny',
        ral: 'RAL 7021',
        color: '#2F3234',
        description: 'Ciemny odcień grafitu z subtelnym niebieskim podtonem. Nowoczesny i wyrafinowany.'
      },
      {
        id: 'ral1015',
        name: 'Kość Słoniowa Jasna',
        ral: 'RAL 1015',
        color: '#E6D2B5',
        description: 'Ciepły, kremowy odcień kości słoniowej. Elegancka alternatywa dla czystej bieli.'
      },
      {
        id: 'ral9006',
        name: 'Aluminium Białe',
        ral: 'RAL 9006',
        color: '#A1A1A0',
        description: 'Metaliczny odcień aluminium z charakterystycznym połyskiem. Nowoczesny i industrialny.'
      },
      {
        id: 'ral7039',
        name: 'Szary Kwarcowy',
        ral: 'RAL 7039',
        color: '#6B665E',
        description: 'Ciepły odcień szarości z brązowym podtonem. Naturalny i stonowany, harmonijnie łączy się z drewnem.'
      },
      {
        id: 'ral8019',
        name: 'Brąz Szary',
        ral: 'RAL 8019',
        color: '#3D3635',
        description: 'Ciemny brąz z szarym podtonem. Elegancki i dyskretny, idealny do klasycznych aranżacji.'
      },
      {
        id: 'ral5011',
        name: 'Granatowy Stalowy',
        ral: 'RAL 5011',
        color: '#1A2B3C',
        description: 'Głęboki odcień granatu ze stalowym połyskiem. Elegancki i wyrafinowany.'
      },
      {
        id: 'ral3005',
        name: 'Czerwień Winna',
        ral: 'RAL 3005',
        color: '#5E2028',
        description: 'Głęboka, burgundowa czerwień. Nadaje charakter i wyróżnia budynek spośród innych.'
      },
      {
        id: 'ral9001',
        name: 'Biały Kremowy',
        ral: 'RAL 9001',
        color: '#FFFDF4',
        description: 'Delikatna, ciepła biel z kremowym podtonem. Stonowana i elegancka alternatywa dla czystej bieli.'
      },
      {
        id: 'ral7022',
        name: 'Szary Umbra',
        ral: 'RAL 7022',
        color: '#4B4D46',
        description: 'Ciepły, ziemisty odcień szarości. Naturalny i uniwersalny, pasuje do różnych stylów.'
      }
    ],
    advantages: [
      {
        icon: TbTemperatureSun,
        title: 'Doskonała izolacja termiczna',
        description: 'Współczynnik Uw = 0,75 W/(m²K) zapewnia minimalne straty ciepła i niższe rachunki za ogrzewanie.'
      },
      {
        icon: TbVolume,
        title: 'Wysoka izolacyjność akustyczna',
        description: 'Rw = 38 dB skutecznie redukuje hałas z zewnątrz, zapewniając ciszę i komfort w domu.'
      },
      {
        icon: RxDimensions,
        title: 'Więcej światła',
        description: 'Obniżony profil skrzydła pozwala na wpuszczenie nawet 10% więcej naturalnego światła.'
      },
      {
        icon: FiCheck,
        title: 'Technologia STV',
        description: 'Suche wklejanie szyby zapewnia płynne działanie i rzadszą potrzebę regulacji.'
      },
      {
        icon: RiContrastDrop2Line,
        title: 'Wodoszczelność 600 Pa',
        description: 'Wysoka odporność na działanie wody opadowej nawet przy silnym wietrze.'
      },
      {
        icon: TbWind,
        title: 'Odporność na wiatr',
        description: 'Klasa odporności 800-1600 Pa gwarantuje stabilność nawet przy ekstremalnych warunkach.'
      }
    ]
  },
  pilar: {
    category: 'Okna',
    name: 'PILAR',
    shortDescription: 'System okienny łączący elegancję z funkcjonalnością.',
    longDescription: 'Okna PILAR to połączenie nowoczesnego designu z najwyższą jakością wykonania.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/pilar-demo.mp4',
    specs: {
      soundInsulation: { value: 'Rw = 36 dB', label: 'Izolacyjność akustyczna', icon: TbVolume },
      thermalTransmittance: { value: 'Uw = 0,79 W/(m²K)', label: 'Współczynnik przenikania ciepła', icon: TbTemperatureSun },
      windResistance: { value: '800 - 1400 Pa', label: 'Odporność na wiatr', icon: TbWind },
      waterTightness: { value: '500 Pa', label: 'Wodoszczelność', icon: RiContrastDrop2Line }
    },
    features: [
      { text: '<strong>7-komorowy profil</strong> zapewniający doskonałą izolację.' },
      { text: 'Możliwość zastosowania <strong>pakietów szybowych do 52 mm</strong>.' }
    ],
    colors: [
      {
        id: 'ral9016',
        name: 'Biały',
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym.'
      },
      {
        id: 'ral7016',
        name: 'Antracyt',
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu z satynowym wykończeniem.'
      },
      {
        id: 'ral9005',
        name: 'Czarny Głęboki',
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń o głębokim połysku.'
      },
      {
        id: 'ral7035',
        name: 'Szary Jasny',
        ral: 'RAL 7035',
        color: '#C5C7C4',
        description: 'Delikatny, jasny odcień szarości.'
      },
      {
        id: 'ral8017',
        name: 'Brąz Czekoladowy',
        ral: 'RAL 8017',
        color: '#3E2B23',
        description: 'Ciepły, głęboki odcień brązu.'
      },
      {
        id: 'ral6005',
        name: 'Zielony Mchowy',
        ral: 'RAL 6005',
        color: '#0F4336',
        description: 'Głęboka, butelkowa zieleń.'
      }
    ],
    advantages: []
  },
  prismatic: {
    category: 'Okna',
    name: 'PRISMATIC',
    shortDescription: 'Okna o geometrycznym, nowoczesnym designie.',
    longDescription: 'System PRISMATIC wyróżnia się charakterystycznym kształtem profilu.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/prismatic-demo.mp4',
    specs: {
      soundInsulation: { value: 'Rw = 35 dB', label: 'Izolacyjność akustyczna', icon: TbVolume },
      thermalTransmittance: { value: 'Uw = 0,82 W/(m²K)', label: 'Współczynnik przenikania ciepła', icon: TbTemperatureSun },
      windResistance: { value: '600 - 1200 Pa', label: 'Odporność na wiatr', icon: TbWind },
      waterTightness: { value: '450 Pa', label: 'Wodoszczelność', icon: RiContrastDrop2Line }
    },
    features: [],
    colors: [
      {
        id: 'ral9016',
        name: 'Biały',
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym.'
      },
      {
        id: 'ral7016',
        name: 'Antracyt',
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu.'
      },
      {
        id: 'ral9005',
        name: 'Czarny',
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń.'
      }
    ],
    advantages: []
  }
};

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
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specs: {
        chambers: '70 mm',
        chambersLabel: 'grubość profilu',
        uw: 'Uw < 0,73',
        uwUnit: 'W/m²K',
        pressure: 'do 1500 Pa',
        pressureLabel: 'wodoszczelność'
      },
      image: '/images/products/windows/pilar.png'
    },
    {
      id: 'pilar',
      name: 'PILAR',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      specs: {
        chambers: '80 mm',
        chambersLabel: 'grubość profilu',
        uw: 'Uw < 0,79',
        uwUnit: 'W/m²K',
        pressure: 'do 1500 Pa',
        pressureLabel: 'wodoszczelność'
      },
      image: '/images/products/windows/pilar.png'
    },
    {
      id: 'prismatic',
      name: 'PRISMATIC',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      specs: {
        chambers: '70 mm',
        chambersLabel: 'grubość profilu',
        uw: 'Uw < 0,79',
        uwUnit: 'W/m²K',
        pressure: 'do 1500 Pa',
        pressureLabel: 'wodoszczelność'
      },
      image: '/images/products/windows/pilar.png'
    }
  ]
};
