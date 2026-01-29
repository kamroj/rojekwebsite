import { WINDOW_COLORS_PALETTE, WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from './windows';

// NOTE:
// Drzwi mają mieć taką samą specyfikację jak okna (te same 3 parametry i te same ikony/etykiety).
export const DOOR_SPECS_DEFS = WINDOW_SPECS_DEFS;
export const DOOR_SPECS_ORDER_LIST = WINDOW_SPECS_ORDER_LIST;

// Mockupowe dane dla 3 typów drzwi
export const DOORS_MOCK_DATA = [
  {
    id: 'plycinowo-fryzowe',
    slug: 'plycinowo-fryzowe',
    name: 'Drzwi płycinowo-fryzowe',
    category: 'Drzwi zewnętrzne',
    categoryKey: 'exteriorDoors',
    shortDescription: 'Klasyczne drzwi łączące tradycję z nowoczesnością, wykonane w technologii płycinowo-fryzowej.',
    longDescription: 'Idealne rozwiązanie dla osób ceniących styl retro i elegancję. Konstrukcja płycinowo-fryzowa zapewnia wyjątkową estetykę i solidność.',
    headerImage: '/images/aboutus/drzwi-kafelka.png',
    images: [
      '/images/aboutus/drzwi-kafelka.png',
      '/images/aboutus/drzwi-ppoz-kafelka.png',
      '/images/aboutus/hs-kafelka.png',
    ],
    video: '/videos/door.mp4',
    specs: {
      profileThickness: '68 / 78 / 90 mm',
      thermalTransmittance: 'Uw < 0,90',
      waterTightness: 'do 1200 Pa',
    },
    features: [
      { text: '<strong>Konstrukcja płycinowo-fryzowa</strong> - tradycyjna technika zapewniająca wyjątkową trwałość' },
      { text: '<strong>Możliwość personalizacji</strong> - bogaty wybór wzorów i zdobień w stylu retro' },
      { text: '<strong>Wysoka izolacyjność</strong> - doskonałe parametry termiczne i akustyczne' },
      { text: '<strong>Naturalne drewno</strong> - ekologiczne materiały najwyższej jakości' },
    ],
    // Specyficzne sekcje dla tego typu drzwi
    specialSections: [
      {
        type: 'retroDecorations',
        title: 'Zdobienia w stylu retro',
        description: 'Wariant płycinowo‑fryzowy daje ogromne możliwości personalizacji. Możesz postawić na subtelne, klasyczne podziały albo na bardziej dekoracyjne płyciny, listwy i frezowania. Dzięki temu drzwi zyskują niepowtarzalny charakter i świetnie pasują do domów w stylu tradycyjnym, dworkowym oraz do renowacji. Estetyka idzie tu w parze z solidną konstrukcją i dopracowanymi detalami.',
        image: '/images/aboutus/drzwi-kafelka.png',
        features: [
          'Klasyczne wzory płycin',
          'Ręczne zdobienia',
          'Frezowania dekoracyjne',
          'Stylizacje historyczne',
          'Możliwość doboru szyb i aplikacji dekoracyjnych',
        ]
      }
    ],
    advantages: [
      {
        title: 'Styl i elegancja',
        description: 'Klasyczna konstrukcja płycinowo-fryzowa nadaje niepowtarzalny charakter każdemu wnętrzu.'
      },
      {
        title: 'Solidna konstrukcja',
        description: 'Tradycyjna technika wykonania gwarantuje wyjątkową trwałość i stabilność.'
      },
      {
        title: 'Indywidualizacja',
        description: 'Możliwość dostosowania wzoru i zdobień do własnych preferencji.'
      },
      {
        title: 'Naturalne materiały',
        description: 'Wykonane z wysokiej jakości drewna, przyjaznego dla środowiska.'
      },
      {
        title: 'Doskonała izolacja',
        description: 'Wysoka izolacyjność termiczna i akustyczna dla Twojego komfortu.'
      },
    ],
    colors: WINDOW_COLORS_PALETTE,
    faq: [
      {
        question: 'Jakie drewno jest używane do produkcji drzwi płycinowo-fryzowych?',
        answer: 'Używamy najwyższej jakości drewna sosnowego i dębowego, które przechodzi specjalną obróbkę suszarniczą i impregnację, zapewniając długowieczność i odporność na warunki atmosferyczne.'
      },
      {
        question: 'Czy mogę zamówić indywidualny wzór zdobień?',
        answer: 'Tak, oferujemy możliwość wykonania indywidualnych wzorów zdobień. Nasi projektanci pomogą stworzyć unikalny design dopasowany do Twojego domu.'
      },
      {
        question: 'Jak często należy konserwować drzwi drewniane?',
        answer: 'Zalecamy kontrolę i konserwację raz w roku. Należy sprawdzić stan powłoki lakierniczej i w razie potrzeby odświeżyć. Okucia warto smarować co 6 miesięcy.'
      },
    ]
  },
  {
    id: 'pelno-plytowe',
    slug: 'pelno-plytowe',
    name: 'Drzwi pełno-płytowe',
    category: 'Drzwi zewnętrzne',
    categoryKey: 'exteriorDoors',
    shortDescription: 'Nowoczesne drzwi o gładkiej powierzchni z możliwością frezowania dowolnych wzorów CNC.',
    longDescription: 'Minimalistyczny design spotyka funkcjonalność. Pełno-płytowa konstrukcja pozwala na nieograniczone możliwości personalizacji poprzez frezowanie CNC.',
    headerImage: '/images/aboutus/drzwi-kafelka.png',
    images: [
      '/images/aboutus/drzwi-kafelka.png',
      '/images/aboutus/drzwi-ppoz-kafelka.png',
      '/images/aboutus/hs-kafelka.png',
    ],
    video: '/videos/door.mp4',
    specs: {
      profileThickness: '68 / 78 / 90 mm',
      thermalTransmittance: 'Uw < 0,95',
      waterTightness: 'do 900 Pa',
    },
    features: [
      { text: '<strong>Gładka powierzchnia</strong> - nowoczesny minimalistyczny design' },
      { text: '<strong>Frezowanie CNC</strong> - nieograniczone możliwości personalizacji wzorów' },
      { text: '<strong>Pełna konstrukcja płytowa</strong> - maksymalna stabilność i izolacja' },
      { text: '<strong>Łatwość czyszczenia</strong> - gładka powierzchnia bez trudno dostępnych miejsc' },
    ],
    specialSections: [
      {
        type: 'cncMilling',
        title: 'Frezowanie CNC - Twój indywidualny wzór',
        description: 'Technologia frezowania CNC pozwala na precyzyjne wykonanie dowolnego wzoru na powierzchni drzwi. Od prostych geometrycznych linii po skomplikowane kompozycje - Twoja wyobraźnia jest jedynym ograniczeniem.',
        image: '/images/aboutus/drzwi-kafelka.png',
        features: [
          'Precyzyjne frezowanie do 0,1mm',
          'Dowolne wzory i projekty',
          'Możliwość podświetlenia LED',
          'Szybka realizacja projektu',
        ]
      }
    ],
    advantages: [
      {
        title: 'Nowoczesny design',
        description: 'Gładka, minimalistyczna powierzchnia idealnie komponuje się z współczesną architekturą.'
      },
      {
        title: 'Personalizacja CNC',
        description: 'Frezowanie CNC umożliwia realizację unikalnych wzorów i projektów.'
      },
      {
        title: 'Wysoka trwałość',
        description: 'Pełna konstrukcja płytowa zapewnia maksymalną stabilność.'
      },
      {
        title: 'Łatwa pielęgnacja',
        description: 'Gładka powierzchnia jest łatwa w utrzymaniu czystości.'
      },
      {
        title: 'Doskonała izolacja',
        description: 'Pełna płyta zapewnia doskonałe parametry termiczne i akustyczne.'
      },
    ],
    colors: WINDOW_COLORS_PALETTE,
    faq: [
      {
        question: 'Jak długo trwa realizacja indywidualnego projektu CNC?',
        answer: 'Czas realizacji zależy od złożoności wzoru. Standardowo od projektu do montażu mija 6-8 tygodni. Proste wzory mogą być zrealizowane szybciej.'
      },
      {
        question: 'Czy frezowane wzory wpływają na izolacyjność drzwi?',
        answer: 'Nie, frezowanie jest wykonywane w taki sposób, aby nie naruszyć warstw izolacyjnych. Wszystkie parametry termiczne pozostają bez zmian.'
      },
      {
        question: 'Czy mogę zobaczyć wizualizację mojego projektu przed produkcją?',
        answer: 'Tak, zawsze przygotowujemy wizualizację 3D projektu do akceptacji przed rozpoczęciem produkcji. Możesz wprowadzić poprawki na tym etapie.'
      },
    ]
  },
  {
    id: 'drewniano-aluminiowe',
    slug: 'drewniano-aluminiowe',
    name: 'Drzwi drewniano-aluminiowe',
    category: 'Drzwi zewnętrzne',
    categoryKey: 'exteriorDoors',
    shortDescription: 'Połączenie ciepła drewna z trwałością aluminium. Szeroki wybór paneli Aluron.',
    longDescription: 'Najlepsze z dwóch światów - naturalne piękno drewna wewnątrz i ochrona aluminium na zewnątrz. Panele Aluron zapewniają wyjątkową estetykę i trwałość.',
    headerImage: '/images/aboutus/drzwi-kafelka.png',
    images: [
      '/images/aboutus/drzwi-kafelka.png',
      '/images/aboutus/drzwi-ppoz-kafelka.png',
      '/images/aboutus/hs-kafelka.png',
    ],
    video: '/videos/door.mp4',
    specs: {
      profileThickness: '68 / 78 / 88 mm',
      thermalTransmittance: 'Uw < 0,85',
      waterTightness: 'do 1200 Pa',
    },
    features: [
      { text: '<strong>Drewno + aluminium</strong> - piękno drewna wewnątrz, trwałość aluminium na zewnątrz' },
      { text: '<strong>Panele Aluron</strong> - szeroki wybór nowoczesnych wzorów i kolorów' },
      { text: '<strong>Minimalna konserwacja</strong> - aluminium nie wymaga malowania ani impregnacji' },
      { text: '<strong>Odporność na warunki atmosferyczne</strong> - perfekcyjna ochrona przed deszczem, słońcem i mrozem' },
    ],
    specialSections: [
      {
        type: 'aluronPanels',
        title: 'Panele Aluron - Bogactwo wzorów',
        description: 'Panele Aluron to szeroka gama nowoczesnych wzorów i kolorów. Od gładkich minimalistycznych powierzchni po imitacje drewna i betonu. Wysoka jakość wykończenia i trwałość na lata.',
        image: '/images/aboutus/drzwi-kafelka.png',
        features: [
          'Ponad 200 wzorów paneli',
          'Imitacje drewna i betonu',
          'Kolory z palety RAL',
          'Odporność na UV i zarysowania',
        ]
      }
    ],
    advantages: [
      {
        title: 'Dwa materiały w jednym',
        description: 'Ciepło naturalnego drewna wewnątrz i trwałość aluminium na zewnątrz.'
      },
      {
        title: 'Szeroki wybór paneli',
        description: 'Panele Aluron oferują setki wzorów i kolorów do wyboru.'
      },
      {
        title: 'Minimalna konserwacja',
        description: 'Aluminium nie wymaga malowania ani specjalnej pielęgnacji.'
      },
      {
        title: 'Wysoka trwałość',
        description: 'Odporność na wszystkie warunki atmosferyczne przez dziesięciolecia.'
      },
      {
        title: 'Doskonała izolacja',
        description: 'Najlepsze parametry termiczne dzięki hybrydowej konstrukcji.'
      },
    ],
    colors: WINDOW_COLORS_PALETTE,
    faq: [
      {
        question: 'Jakie są główne zalety drzwi drewniano-aluminiowych?',
        answer: 'Łączą one najlepsze cechy obu materiałów - ciepło i estetykę drewna wewnątrz z trwałością i niskimi kosztami utrzymania aluminium na zewnątrz. Nie wymagają malowania ani impregnacji części aluminiowej.'
      },
      {
        question: 'Czy panele Aluron są odporne na zarysowania?',
        answer: 'Tak, panele Aluron posiadają specjalną powłokę ochronną, która zapewnia wysoką odporność na zarysowania i uszkodzenia mechaniczne. Dodatkowo są odporne na promieniowanie UV.'
      },
      {
        question: 'Jak długo zachowują kolor panele aluminiowe?',
        answer: 'Panele Aluron z powłoką proszkową zachowują intensywność koloru przez wiele lat. Gwarantujemy minimum 10 lat odporności na blaknięcie i zmianę koloru.'
      },
    ]
  }
];

// Helper do pobierania produktu po slug
export const getDoorBySlug = (slug) => {
  return DOORS_MOCK_DATA.find(door => door.slug === slug);
};

// Helper do pobierania wszystkich drzwi
export const getAllDoors = () => {
  return DOORS_MOCK_DATA;
};
