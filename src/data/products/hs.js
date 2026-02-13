import { WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from './windows.js';

export const HS_SPECS_DEFS = WINDOW_SPECS_DEFS;
export const HS_SPECS_ORDER_LIST = WINDOW_SPECS_ORDER_LIST;

export const HS_PRODUCT_DETAILS = {
  'drewno-alu': {
    id: 'drewno-alu',
    slug: 'drewno-alu',
    category: 'Okna przesuwne HS',
    categoryKey: 'oknaPrzesuwne',
    name: 'HS DREWNO-ALU',
    shortDescription:
      'System HS Drewno-Alu łączy naturalne drewno od wewnątrz z trwałą osłoną aluminiową od zewnątrz, zapewniając estetykę i stabilność na lata.',
    longDescription:
      'Wariant Drewno-Alu został zaprojektowany dla inwestorów oczekujących dużych przeszkleń, nowoczesnej linii profilu i wysokiej odporności na warunki zewnętrzne. To rozwiązanie, które podnosi komfort codziennego użytkowania i jednocześnie wspiera bardzo dobre parametry izolacyjne. Dzięki szerokim możliwościom konfiguracji system łatwo dopasować do architektury domu oraz indywidualnych wymagań projektu.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/hs/top.jpg', '/images/aboutus/hs-kafelka.png'],
    video: '/videos/hs.mp4',
    features: [
      {
        text: 'Duże przeszklenia i płynne połączenie strefy dziennej z tarasem.',
      },
      {
        text: 'Stabilna konstrukcja skrzydeł przystosowana do intensywnej eksploatacji.',
      },
      {
        text: 'Bardzo dobra izolacyjność i wysoki komfort codziennej obsługi.',
      },
    ],
    advantages: [
      {
        title: 'Naturalne drewno we wnętrzu',
        description: 'Wnętrze zyskuje ciepły, szlachetny charakter i spójność z pozostałą stolarką.',
      },
      {
        title: 'Aluminiowa osłona od zewnątrz',
        description: 'Zwiększona odporność na warunki atmosferyczne i ograniczone wymagania konserwacyjne.',
      },
      {
        title: 'Szeroka konfiguracja systemu',
        description: 'Możliwość dopasowania rozwiązań technicznych do wymagań projektu oraz estetyki elewacji.',
      },
      {
        title: 'Komfort codziennego użytkowania',
        description: 'Płynna praca skrzydeł i rozwiązania wspierające bezpieczne domykanie dużych przeszkleń.',
      },
    ],
    faq: [
      {
        question: 'Jakie grubości profilu są dostępne w HS Drewno‑Alu?',
        answer: 'Wariant HS Drewno‑Alu dostępny jest w grubościach 68 / 78 / 88, co pozwala dobrać system do wymagań projektu.',
      },
      {
        question: 'Czy w systemie HS można zastosować niski próg?',
        answer: 'Tak, dostępne są warianty progu 67 mm oraz 50 mm płaski, zależnie od potrzeb funkcjonalnych i estetycznych.',
      },
      {
        question: 'Jakie rozwiązania poprawiają komfort domykania?',
        answer: 'System może być wyposażony w opcję Silent Close oraz Stop Unit, które wspierają kontrolę ruchu skrzydła.',
      },
    ],
    hsProfileThicknesses: ['68', '78', '88'],
    hsAdditionalInfo: [
      {
        title: 'Dodatkowe opcje wykończenia alu',
        description:
          'Sekcja przygotowana pod rozszerzenie oferty o dodatkowe warianty okładzin aluminiowych i indywidualne konfiguracje kolorystyczne.',
      },
      {
        title: 'Rozszerzone wyposażenie projektowe',
        description:
          'Miejsce na dodatkowe informacje techniczne i handlowe dla inwestycji wymagających rozszerzonej specyfikacji wariantu Drewno-Alu.',
      },
    ],
    specs: {
      profileThickness: '68 / 78 / 88 mm',
      thermalTransmittance: 'Uw zależne od konfiguracji HS',
      waterTightness: 'do klasy projektowej systemu HS',
    },
  },
  drewno: {
    id: 'drewno',
    slug: 'drewno',
    category: 'Okna przesuwne HS',
    categoryKey: 'oknaPrzesuwne',
    name: 'HS DREWNO',
    shortDescription:
      'System HS Drewno to ciepło naturalnego materiału, duże przeszklenia i płynna obsługa zaprojektowana z myślą o nowoczesnym tarasie.',
    longDescription:
      'Wariant Drewno to propozycja dla osób, które cenią naturalny charakter stolarki i komfort codziennego użytkowania. Konstrukcja systemu wspiera stabilność dużych skrzydeł i bardzo dobre parametry izolacyjne. Rozwiązanie sprawdza się zarówno w nowoczesnych bryłach, jak i projektach o bardziej klasycznej estetyce.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/hs/top.jpg', '/images/aboutus/hs-kafelka.png'],
    video: '/videos/hs.mp4',
    features: [
      {
        text: 'Naturalna estetyka drewna i nowoczesna forma dużych przeszkleń HS.',
      },
      {
        text: 'Wysoki komfort obsługi oraz stabilna praca systemu przy codziennym użytkowaniu.',
      },
      {
        text: 'Bardzo dobre parametry izolacyjne wspierające efektywność energetyczną budynku.',
      },
      {
        text: 'Możliwość wykonania niskiego progu, który poprawia wygodę przejścia między wnętrzem a tarasem.',
      },
      {
        text: 'Szeroki wybór schematów otwierania, dzięki czemu łatwo dopasować układ skrzydeł do projektu domu.',
      },
    ],
    advantages: [
      {
        title: 'Naturalny charakter stolarki',
        description: 'Drewno podkreśla jakość wykończenia wnętrz i zapewnia ponadczasowy wygląd systemu HS.',
      },
      {
        title: 'Dopasowanie do projektu',
        description: 'Dostępne konfiguracje pozwalają dobrać rozwiązanie do układu pomieszczeń i strefy tarasowej.',
      },
      {
        title: 'Stabilność i trwałość',
        description: 'Konstrukcja systemu wspiera bezpieczne użytkowanie dużych skrzydeł przez długi czas.',
      },
      {
        title: 'Komfort codziennej obsługi',
        description: 'Płynna praca okuć i możliwość rozbudowy o funkcje zwiększające wygodę użytkownika.',
      },
    ],
    faq: [
      {
        question: 'Jakie grubości profilu są dostępne w HS Drewno?',
        answer: 'Wariant HS Drewno dostępny jest w grubościach 78 / 90, co pozwala dobrać system do wymagań inwestycji.',
      },
      {
        question: 'Jakie okucia stosowane są w systemie HS?',
        answer: 'W systemach HS stosowane są okucia GU, które zapewniają płynną i stabilną pracę skrzydeł.',
      },
      {
        question: 'Czy system HS jest dostępny w różnych schematach?',
        answer: 'Tak, system dostępny jest w wielu konfiguracjach skrzydeł i otwierania, zgodnie z wymaganiami projektu.',
      },
    ],
    hsProfileThicknesses: ['78', '90'],
    specs: {
      profileThickness: '78 / 90 mm',
      thermalTransmittance: 'Uw zależne od konfiguracji HS',
      waterTightness: 'do klasy projektowej systemu HS',
    },
  },
};
