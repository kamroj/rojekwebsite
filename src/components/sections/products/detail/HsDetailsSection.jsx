import React from 'react';
import { useTranslation } from 'react-i18next';
import ImageWithSpinner from '../../../ui/ImageWithSpinner.jsx';
import SanityImage from '../../../ui/SanityImage.jsx';
import SanityPortableText from '../../../portable/SanityPortableText.jsx';

import styles from './HsDetailsSection.module.css';

const DEFAULT_PROFILE_TABS = [
  {
    tabId: '78',
    tabLabel: '78 mm',
    overline: 'PROFIL',
    title: 'Grubość 78 mm',
    paragraphs: [
      'Profil HS o grubości 78 mm to rozwiązanie idealne do nowoczesnego budownictwa jednorodzinnego oraz obiektów o podwyższonych wymaganiach estetycznych. Konstrukcja oparta na klejonce warstwowej z drewna litego zapewnia wysoką stabilność wymiarową oraz odporność na odkształcenia, nawet przy dużych przeszkleniach. System umożliwia zastosowanie pakietów trzyszybowych, co przekłada się na bardzo dobre parametry izolacyjności termicznej oraz akustycznej.',
      'Grubość 78 mm stanowi optymalny balans pomiędzy smukłą linią profilu a parametrami technicznymi. Dzięki temu konstrukcja zachowuje elegancki, lekki wygląd przy jednoczesnym zapewnieniu odpowiedniej sztywności skrzydeł przesuwnych. System doskonale sprawdza się w wyjściach tarasowych, ogrodowych oraz w strefach dziennych z dużymi przeszkleniami, gdzie kluczowe jest połączenie designu, funkcjonalności i komfortu użytkowania.',
    ],
    image: null,
  },
  {
    tabId: '90',
    tabLabel: '90 mm',
    overline: 'PROFIL',
    title: 'Grubość 90 mm',
    paragraphs: [
      'Profil HS o grubości 90 mm to rozwiązanie dedykowane inwestycjom o najwyższych wymaganiach w zakresie energooszczędności oraz trwałości konstrukcji. Zwiększona głębokość zabudowy umożliwia zastosowanie pakietów szybowych o większej grubości, co znacząco poprawia współczynnik przenikania ciepła całego systemu. To propozycja szczególnie polecana do budynków pasywnych i energooszczędnych.',
      'Masywniejsza konstrukcja profilu przekłada się również na jeszcze większą stabilność przy bardzo dużych formatach przeszkleń. System 90 mm pozwala na realizację imponujących przesuwnych ścian szklanych, zachowując wysoką szczelność, odporność na obciążenia wiatrem oraz komfort eksploatacji. To rozwiązanie premium – dla inwestorów oczekujących maksymalnych parametrów technicznych bez kompromisu w estetyce naturalnego drewna.',
    ],
    image: '/images/hs/hs-profil-90.png',
  },
];

const DEFAULT_PROFILE_TABS_EN = [
  {
    tabId: '78',
    tabLabel: '78 mm',
    overline: 'PROFILE',
    title: '78 mm profile thickness',
    paragraphs: [
      'The 78 mm HS profile is an excellent choice for modern single-family homes and projects with elevated aesthetic expectations. Its engineered laminated timber core provides high dimensional stability and good resistance to deformation, even with large glazed areas. The system supports triple-glazed units, improving both thermal and acoustic performance.',
      'A 78 mm construction offers a balanced combination of slim profile lines and strong technical performance. It allows an elegant, light visual effect while keeping the sash stable and reliable during everyday use. This option works especially well in terrace and garden openings, where design quality, functionality and user comfort matter equally.',
    ],
    image: null,
  },
  {
    tabId: '90',
    tabLabel: '90 mm',
    overline: 'PROFILE',
    title: '90 mm profile thickness',
    paragraphs: [
      'The 90 mm HS profile is dedicated to premium projects with the highest requirements for energy efficiency, airtightness and long-term durability. Its increased installation depth enables thicker glazing packages, which can significantly improve the thermal transmittance of the whole system.',
      'This more robust profile also brings greater stability in very large-format glazing. The 90 mm version is ideal for passive and low-energy buildings, where investors expect top technical values without compromising the elegant character of natural wood joinery.',
    ],
    image: '/images/hs/hs-profil-90.png',
  },
];

const DEFAULT_PROFILE_TABS_DE = [
  {
    tabId: '78',
    tabLabel: '78 mm',
    overline: 'PROFIL',
    title: 'Profilstärke 78 mm',
    paragraphs: [
      'Das 78-mm-HS-Profil ist eine sehr gute Lösung für moderne Einfamilienhäuser und Projekte mit hohen ästhetischen Anforderungen. Die Konstruktion aus verleimtem Schichtholz sorgt für hohe Formstabilität und gute Widerstandsfähigkeit gegen Verzug – auch bei großen Glasflächen. Das System ermöglicht den Einsatz von Dreifachverglasung und verbessert damit Wärme- und Schalldämmung.',
      'Mit 78 mm bietet das Profil ein ausgewogenes Verhältnis zwischen schlanker Optik und soliden technischen Parametern. Dadurch wirkt die Konstruktion leicht und elegant, bleibt aber im täglichen Betrieb stabil und komfortabel. Besonders gut eignet sich diese Variante für Terrassen- und Gartenausgänge.',
    ],
    image: null,
  },
  {
    tabId: '90',
    tabLabel: '90 mm',
    overline: 'PROFIL',
    title: 'Profilstärke 90 mm',
    paragraphs: [
      'Das 90-mm-HS-Profil wurde für Projekte mit höchsten Anforderungen an Energieeffizienz, Dichtheit und Langlebigkeit entwickelt. Die größere Bautiefe erlaubt den Einsatz dickerer Verglasungspakete und kann so den Wärmedurchgang des gesamten Systems deutlich verbessern.',
      'Die massivere Konstruktion erhöht zusätzlich die Stabilität bei sehr großen Glasformaten. Diese Ausführung ist besonders für Passiv- und Niedrigenergiehäuser geeignet, in denen maximale technische Leistung ohne ästhetische Kompromisse erwartet wird.',
    ],
    image: '/images/hs/hs-profil-90.png',
  },
];

const DEFAULT_PROFILE_TABS_FR = [
  {
    tabId: '78',
    tabLabel: '78 mm',
    overline: 'PROFIL',
    title: 'Épaisseur du profil 78 mm',
    paragraphs: [
      'Le profil HS de 78 mm convient parfaitement aux maisons individuelles modernes et aux projets exigeants sur le plan esthétique. Sa structure en bois lamellé-collé assure une bonne stabilité dimensionnelle et une résistance élevée aux déformations, même avec de grandes surfaces vitrées. Le système permet l’intégration de vitrages triples, avec de bonnes performances thermiques et acoustiques.',
      'Avec 78 mm, on obtient un excellent compromis entre finesse visuelle et solidité technique. Le profil garde une ligne élégante tout en offrant une utilisation confortable au quotidien. Cette option est particulièrement adaptée aux ouvertures sur terrasse ou jardin.',
    ],
    image: null,
  },
  {
    tabId: '90',
    tabLabel: '90 mm',
    overline: 'PROFIL',
    title: 'Épaisseur du profil 90 mm',
    paragraphs: [
      'Le profil HS de 90 mm est conçu pour les projets premium avec des exigences élevées en matière d’efficacité énergétique, d’étanchéité et de durabilité. Sa profondeur plus importante permet l’utilisation de vitrages plus épais, ce qui améliore sensiblement les performances thermiques du système.',
      'Cette construction renforcée apporte aussi davantage de stabilité aux très grandes surfaces vitrées. C’est une solution idéale pour les bâtiments passifs et basse consommation, lorsque l’on recherche des performances maximales sans compromis sur l’esthétique du bois.',
    ],
    image: '/images/hs/hs-profil-90.png',
  },
];

const DEFAULT_THRESHOLD_TABS = [
  {
    tabId: '67',
    tabLabel: '67 mm',
    overline: 'PRÓG HS',
    title: '67 mm – rozwiązanie standardowe',
    paragraphs: [
      'Próg o wysokości 67 mm to klasyczne rozwiązanie w systemach HS, zapewniające bardzo dobre parametry szczelności oraz trwałości eksploatacyjnej. Konstrukcja oparta na stabilnym profilu z przekładką termiczną gwarantuje skuteczną izolację cieplną oraz ochronę przed przenikaniem wody i powietrza. To wariant rekomendowany w inwestycjach, gdzie priorytetem jest maksymalna szczelność oraz odporność na intensywne użytkowanie.',
      'Wyższy próg zapewnia również zwiększoną sztywność całej konstrukcji w strefie dolnej, co ma szczególne znaczenie przy dużych, ciężkich skrzydłach przesuwnych. Rozwiązanie to sprawdza się w domach jednorodzinnych, apartamentach oraz obiektach o dużych przeszkleniach tarasowych, gdzie istotne jest połączenie trwałości, bezpieczeństwa i wysokiej klasy parametrów technicznych.',
    ],
    image: '/images/hs/prog-67mm.png',
  },
  {
    tabId: '50',
    tabLabel: '50 mm',
    overline: 'PRÓG HS',
    title: '50 mm – płaski, komfortowy i nowoczesny',
    paragraphs: [
      'Próg płaski o wysokości 50 mm to rozwiązanie dedykowane nowoczesnym realizacjom, w których kluczową rolę odgrywa komfort przejścia oraz estetyka minimalizmu. Obniżona wysokość progu pozwala uzyskać niemal bezbarierowe połączenie wnętrza z tarasem lub ogrodem, co znacząco poprawia ergonomię użytkowania – szczególnie w domach z małymi dziećmi lub dla osób starszych.',
      'Pomimo smuklejszej konstrukcji, system zachowuje wysokie parametry szczelności dzięki zastosowaniu odpowiednich uszczelnień oraz rozwiązań konstrukcyjnych ograniczających mostki termiczne. Płaski próg podkreśla nowoczesny charakter przeszklenia HS i pozwala uzyskać efekt płynnego przejścia między strefą wewnętrzną a zewnętrzną, bez kompromisów w zakresie trwałości i bezpieczeństwa.',
    ],
    image: '/images/hs/prog-50mm.png',
  },
];

const DEFAULT_THRESHOLD_TABS_EN = [
  {
    tabId: '67',
    tabLabel: '67 mm',
    overline: 'HS THRESHOLD',
    title: '67 mm – standard solution',
    paragraphs: [
      'A 67 mm threshold is the classic HS solution, offering strong tightness and high long-term durability. Its stable profile with a thermal break supports effective insulation and protection against water and air infiltration.',
      'The higher threshold also improves structural rigidity in the bottom zone, which is especially important for large and heavy sliding sashes. It is recommended where priority is maximum sealing performance and intensive everyday use.',
    ],
    image: '/images/hs/prog-67mm.png',
  },
  {
    tabId: '50',
    tabLabel: '50 mm',
    overline: 'HS THRESHOLD',
    title: '50 mm – flat and comfortable',
    paragraphs: [
      'The 50 mm flat threshold is designed for modern projects where comfort and accessibility are key. The reduced threshold height creates an almost barrier-free transition between interior and terrace or garden.',
      'Despite its slimmer geometry, the system maintains high sealing performance through dedicated gasket and thermal-bridge-limiting solutions. This option highlights a clean contemporary look while keeping everyday use safe and practical.',
    ],
    image: '/images/hs/prog-50mm.png',
  },
];

const DEFAULT_THRESHOLD_TABS_DE = [
  {
    tabId: '67',
    tabLabel: '67 mm',
    overline: 'HS-SCHWELLE',
    title: '67 mm – Standardlösung',
    paragraphs: [
      'Die 67-mm-Schwelle ist die klassische HS-Lösung mit sehr guter Dichtheit und hoher Dauerhaftigkeit. Die Konstruktion mit thermischer Trennung unterstützt eine wirksame Wärmedämmung und schützt vor dem Eindringen von Wasser und Luft.',
      'Durch die höhere Schwelle steigt zudem die Steifigkeit im unteren Konstruktionsbereich – ein wichtiger Vorteil bei großen und schweren Schiebeflügeln. Diese Variante wird überall dort empfohlen, wo maximale Dichtheit und intensive Nutzung im Vordergrund stehen.',
    ],
    image: '/images/hs/prog-67mm.png',
  },
  {
    tabId: '50',
    tabLabel: '50 mm',
    overline: 'HS-SCHWELLE',
    title: '50 mm – flach und komfortabel',
    paragraphs: [
      'Die flache 50-mm-Schwelle ist für moderne Projekte konzipiert, bei denen Komfort und Barrierearmut entscheidend sind. Die reduzierte Höhe schafft einen nahezu schwellenlosen Übergang zwischen Innenraum und Terrasse oder Garten.',
      'Trotz der schlankeren Bauform bleiben dank spezieller Dichtungen und konstruktiver Maßnahmen gegen Wärmebrücken sehr gute Dichtwerte erhalten. So verbindet diese Lösung modernes Design mit hoher Alltagstauglichkeit.',
    ],
    image: '/images/hs/prog-50mm.png',
  },
];

const DEFAULT_THRESHOLD_TABS_FR = [
  {
    tabId: '67',
    tabLabel: '67 mm',
    overline: 'SEUIL HS',
    title: '67 mm – solution standard',
    paragraphs: [
      'Le seuil de 67 mm est la solution HS classique, offrant une excellente étanchéité et une grande durabilité. Sa conception avec rupture thermique assure une bonne isolation et protège efficacement contre les infiltrations d’air et d’eau.',
      'Ce seuil plus haut améliore aussi la rigidité de la zone basse, ce qui est particulièrement utile pour les vantaux coulissants de grandes dimensions. Il est recommandé lorsque la priorité est la performance d’étanchéité et la robustesse en usage intensif.',
    ],
    image: '/images/hs/prog-67mm.png',
  },
  {
    tabId: '50',
    tabLabel: '50 mm',
    overline: 'SEUIL HS',
    title: '50 mm – plat et confortable',
    paragraphs: [
      'Le seuil plat de 50 mm est destiné aux réalisations modernes où le confort de passage est prioritaire. Sa hauteur réduite permet une transition presque sans obstacle entre l’intérieur et la terrasse ou le jardin.',
      'Malgré son profil plus fin, le système conserve de bonnes performances d’étanchéité grâce à des solutions spécifiques de joints et de limitation des ponts thermiques. Cette version associe esthétique contemporaine et praticité au quotidien.',
    ],
    image: '/images/hs/prog-50mm.png',
  },
];

const DEFAULT_USAGE_TABS = [
  {
    tabId: 'glazing',
    tabLabel: 'Szklenie',
    title: 'Szklenie listwowe i bezlistwowe',
    paragraphs: [
      'System HS oferuje dwa podejścia do wykończenia szyby: klasyczne szklenie listwowe oraz wariant bezlistwowy. Dzięki temu można dobrać nie tylko parametry techniczne, ale również finalny charakter wizualny konstrukcji — od bardziej tradycyjnego po nowoczesny, minimalistyczny.',
      'Wariant listwowy ułatwia serwisowanie i dobrze sprawdza się w projektach, gdzie liczy się trwałość oraz przewidywalność eksploatacyjna. Rozwiązanie bezlistwowe podkreśla lekkość dużych przeszkleń i estetykę jednolitej tafli, co jest szczególnie pożądane w nowoczesnej architekturze.',
    ],
    benefitLabel: 'Korzyść:',
    benefitText: 'Większa swoboda projektowa bez kompromisu w zakresie szczelności i trwałości.',
  },
  {
    tabId: 'hardware',
    tabLabel: 'Okucia',
    title: 'Okucia GU do ciężkich skrzydeł HS',
    paragraphs: [
      'Zastosowanie okuć GU zapewnia stabilną i płynną pracę nawet przy dużych gabarytach skrzydeł przesuwnych. To system opracowany z myślą o wysokich obciążeniach, częstym użytkowaniu oraz utrzymaniu komfortu przesuwu przez długi czas eksploatacji.',
      'Precyzyjna praca mechanizmów przekłada się na wyższą kulturę użytkowania: skrzydło prowadzi się lekko, bez szarpnięć i z dobrą kontrolą ruchu. To szczególnie ważne w realizacjach premium, gdzie duże przeszklenia mają działać intuicyjnie każdego dnia.',
    ],
    benefitLabel: 'Korzyść:',
    benefitText: 'Pewna, lekka obsługa skrzydeł i wysoka trwałość mechaniczna systemu.',
  },
  {
    tabId: 'silentClose',
    tabLabel: 'Komfort domykania',
    title: 'Komfort domykania i kontrola ruchu skrzydła',
    paragraphs: [
      'W obszarze komfortu domykania system HS może łączyć funkcję Silent Close z rozwiązaniem Stop Unit. Taki zestaw poprawia kulturę pracy całej konstrukcji: skrzydło kończy ruch łagodniej, bez gwałtownego domknięcia i bez nieprzyjemnego efektu uderzenia.',
      'Połączenie obu funkcji szczególnie dobrze sprawdza się przy dużych i ciężkich przeszkleniach, gdzie kluczowa jest kontrola końcowej fazy ruchu. Użytkownik zyskuje większą przewidywalność obsługi, wyższy komfort akustyczny oraz dodatkowe poczucie bezpieczeństwa na co dzień.',
    ],
    benefitLabel: 'Korzyść:',
    benefitText: 'Cichsze domykanie, lepsza kontrola ruchu i większe bezpieczeństwo codziennej obsługi.',
  },
];

const DEFAULT_USAGE_TABS_EN = [
  {
    tabId: 'glazing',
    tabLabel: 'Glazing',
    title: 'Beaded and beadless glazing',
    paragraphs: [
      'The HS system supports two glazing concepts: traditional beaded glazing and a beadless option. This allows you to match not only technical performance but also the final visual character of the construction.',
      'Beaded glazing is often preferred for easy serviceability and proven durability, while beadless glazing emphasizes large, clean glass surfaces and a more minimalist architectural look.',
    ],
    benefitLabel: 'Benefit:',
    benefitText: 'Greater design flexibility without compromising tightness and durability.',
  },
  {
    tabId: 'hardware',
    tabLabel: 'Hardware',
    title: 'GU hardware for heavy HS sashes',
    paragraphs: [
      'GU hardware ensures smooth, stable operation even for large and heavy sliding HS sashes. It is designed for high loads, frequent use and long-term operating comfort.',
      'Precise mechanism performance improves user experience: the sash movement feels lighter, more predictable and better controlled throughout daily operation.',
    ],
    benefitLabel: 'Benefit:',
    benefitText: 'Reliable handling and long-term mechanical durability.',
  },
  {
    tabId: 'silentClose',
    tabLabel: 'Closing comfort',
    title: 'Smooth closing and sash movement control',
    paragraphs: [
      'For closing comfort, HS systems can combine Silent Close with Stop Unit functionality. This setup improves the movement culture of the entire system and reduces hard end impacts.',
      'The combination is especially valuable with large, heavy glazing units, where better end-of-travel control translates directly into comfort, safety and acoustic quality.',
    ],
    benefitLabel: 'Benefit:',
    benefitText: 'Quieter closing and better control in everyday use.',
  },
];

const DEFAULT_USAGE_TABS_DE = [
  {
    tabId: 'glazing',
    tabLabel: 'Verglasung',
    title: 'Verglasung mit und ohne Leiste',
    paragraphs: [
      'Das HS-System bietet zwei Varianten der Verglasung: die klassische Verglasung mit Leiste sowie eine moderne leistelose Ausführung. So lassen sich technische Anforderungen und gewünschte Optik flexibel kombinieren.',
      'Die Variante mit Leiste wird häufig wegen einfacher Wartung und bewährter Dauerhaftigkeit gewählt. Die leistelose Ausführung betont dagegen große, ruhige Glasflächen und einen minimalistischen Architekturcharakter.',
    ],
    benefitLabel: 'Vorteil:',
    benefitText: 'Mehr Gestaltungsfreiheit ohne Kompromisse bei Dichtheit und Haltbarkeit.',
  },
  {
    tabId: 'hardware',
    tabLabel: 'Beschläge',
    title: 'GU-Beschläge für schwere HS-Flügel',
    paragraphs: [
      'GU-Beschläge gewährleisten eine stabile und leichtgängige Bedienung auch bei großen und schweren HS-Schiebeflügeln. Das System ist für hohe Belastungen und häufige Nutzung ausgelegt.',
      'Die präzise Mechanik verbessert den Bedienkomfort im Alltag: Der Flügel läuft ruhiger, kontrollierter und mit gleichbleibender Qualität über lange Zeit.',
    ],
    benefitLabel: 'Vorteil:',
    benefitText: 'Zuverlässige Funktion und hohe mechanische Lebensdauer.',
  },
  {
    tabId: 'silentClose',
    tabLabel: 'Schließkomfort',
    title: 'Sanftes Schließen und Bewegungsführung',
    paragraphs: [
      'Für höheren Schließkomfort kann das HS-System Funktionen wie Silent Close und Stop Unit kombinieren. Dadurch wird die Endphase der Bewegung deutlich sanfter und kontrollierter.',
      'Gerade bei großen und schweren Verglasungen erhöht dies Komfort, Sicherheit und akustische Qualität im täglichen Gebrauch.',
    ],
    benefitLabel: 'Vorteil:',
    benefitText: 'Leiseres Schließen und bessere Kontrolle im Alltag.',
  },
];

const DEFAULT_USAGE_TABS_FR = [
  {
    tabId: 'glazing',
    tabLabel: 'Vitrage',
    title: 'Vitrage avec ou sans parclose',
    paragraphs: [
      'Le système HS propose deux approches de vitrage : avec parclose (version classique) ou sans parclose (version moderne). Cela permet d’adapter à la fois les paramètres techniques et le rendu visuel final.',
      'Le vitrage parclosé facilite la maintenance et offre une durabilité éprouvée. Le vitrage sans parclose met en valeur de grandes surfaces vitrées et une esthétique plus minimaliste.',
    ],
    benefitLabel: 'Avantage :',
    benefitText: 'Plus de liberté de conception sans compromis sur l’étanchéité.',
  },
  {
    tabId: 'hardware',
    tabLabel: 'Quincaillerie',
    title: 'Quincaillerie GU pour vantaux lourds',
    paragraphs: [
      'Les ferrures GU assurent un fonctionnement stable et fluide, même avec des vantaux HS lourds et de grande dimension. Elles sont conçues pour des charges élevées et une utilisation fréquente.',
      'La précision du mécanisme améliore le confort d’usage : le mouvement du vantail est plus doux, plus maîtrisé et plus fiable dans le temps.',
    ],
    benefitLabel: 'Avantage :',
    benefitText: 'Utilisation fiable et durable au quotidien.',
  },
  {
    tabId: 'silentClose',
    tabLabel: 'Confort de fermeture',
    title: 'Fermeture douce et contrôle du mouvement',
    paragraphs: [
      'Pour le confort de fermeture, le système HS peut associer les fonctions Silent Close et Stop Unit. Cette combinaison adoucit la fin de course et améliore la qualité de mouvement.',
      'Sur les grandes baies coulissantes, cela apporte un meilleur contrôle, plus de sécurité d’usage et un meilleur confort acoustique au quotidien.',
    ],
    benefitLabel: 'Avantage :',
    benefitText: 'Fermeture plus silencieuse et meilleur contrôle.',
  },
];

const pickByLocale = (locale, values) => values[locale] || values.pl;

const getStringParagraphs = (value) => {
  if (typeof value === 'string' && value.trim()) return [value];
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item.trim());
  return [];
};

const isPortableTextValue = (value) => Array.isArray(value) && value.some((item) => item && typeof item === 'object' && item._type);

const applyOverrides = (defaults, overrides = [], type = 'base') => {
  const map = new Map((overrides || []).map((item) => [item?.tabId, item]));
  return defaults.map((tab) => {
    const o = map.get(tab.tabId);
    if (!o) return tab;

    return {
      ...tab,
      tabLabel: o.overrideTabLabel ? (o.tabLabel || tab.tabLabel) : tab.tabLabel,
      title: o.overrideTitle ? (o.title || tab.title) : tab.title,
      description: o.overrideDescription ? (o.description || tab.description || tab.paragraphs) : (tab.description || tab.paragraphs),
      image: o.overrideImage ? (o.image || tab.image) : tab.image,
      benefitLabel: type === 'usage' ? (o.overrideBenefitLabel ? (o.benefitLabel || tab.benefitLabel) : tab.benefitLabel) : tab.benefitLabel,
      benefitText: type === 'usage' ? (o.overrideBenefitText ? (o.benefitText || tab.benefitText) : tab.benefitText) : tab.benefitText,
    };
  });
};

const buildTabs = ({ defaultTabs, section, type = 'base' }) => {
  const useDefaults = section?.useDefaultTabs !== false;

  if (!useDefaults) {
    return (section?.customTabs || []).map((tab, index) => ({
      tabId: tab?.tabId || `custom-${type}-${index}`,
      tabLabel: tab?.tabLabel || tab?.tabId || `${index + 1}`,
      title: tab?.title || '',
      description: tab?.description || [],
      image: tab?.image || null,
      benefitLabel: tab?.benefitLabel || '',
      benefitText: tab?.benefitText || '',
    }));
  }

  return applyOverrides(defaultTabs, section?.defaultTabOverrides || [], type);
};

const renderContent = (value, paragraphClassName) => {
  if (isPortableTextValue(value)) {
    return (
      <div className={paragraphClassName}>
        <SanityPortableText value={value} />
      </div>
    );
  }

  const paragraphs = getStringParagraphs(value);
  return paragraphs.map((paragraph) => (
    <p key={paragraph} className={paragraphClassName}>
      {paragraph}
    </p>
  ));
};

export default function HsDetailsSection({
  children = null,
  commonSections = null,
  specialSections = [],
}) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'pl').split('-')[0];
  const defaultProfileTabs = pickByLocale(locale, {
    pl: DEFAULT_PROFILE_TABS,
    en: DEFAULT_PROFILE_TABS_EN,
    de: DEFAULT_PROFILE_TABS_DE,
    fr: DEFAULT_PROFILE_TABS_FR,
  });
  const defaultThresholdTabs = pickByLocale(locale, {
    pl: DEFAULT_THRESHOLD_TABS,
    en: DEFAULT_THRESHOLD_TABS_EN,
    de: DEFAULT_THRESHOLD_TABS_DE,
    fr: DEFAULT_THRESHOLD_TABS_FR,
  });
  const defaultUsageTabs = pickByLocale(locale, {
    pl: DEFAULT_USAGE_TABS,
    en: DEFAULT_USAGE_TABS_EN,
    de: DEFAULT_USAGE_TABS_DE,
    fr: DEFAULT_USAGE_TABS_FR,
  });
  const profileSection = commonSections?.profileThickness || {};
  const thresholdSection = commonSections?.threshold || {};
  const usageSection = commonSections?.usageDetails || {};

  const profileTabs = React.useMemo(
    () => buildTabs({ defaultTabs: defaultProfileTabs, section: profileSection, type: 'profile' }),
    [defaultProfileTabs, profileSection]
  );
  const thresholdTabs = React.useMemo(
    () => buildTabs({ defaultTabs: defaultThresholdTabs, section: thresholdSection, type: 'threshold' }),
    [defaultThresholdTabs, thresholdSection]
  );
  const usageTabs = React.useMemo(
    () => buildTabs({ defaultTabs: defaultUsageTabs, section: usageSection, type: 'usage' }),
    [defaultUsageTabs, usageSection]
  );

  const [activeProfileThickness, setActiveProfileThickness] = React.useState(profileTabs[0]?.tabId || '78');
  const [activeThreshold, setActiveThreshold] = React.useState(thresholdTabs[0]?.tabId || '67');
  const [activeUsageFeature, setActiveUsageFeature] = React.useState(usageTabs[0]?.tabId || 'glazing');

  React.useEffect(() => {
    if (!profileTabs.some((item) => item.tabId === activeProfileThickness)) {
      setActiveProfileThickness(profileTabs[0]?.tabId || '78');
    }
  }, [profileTabs, activeProfileThickness]);

  React.useEffect(() => {
    if (!thresholdTabs.some((item) => item.tabId === activeThreshold)) {
      setActiveThreshold(thresholdTabs[0]?.tabId || '67');
    }
  }, [thresholdTabs, activeThreshold]);

  React.useEffect(() => {
    if (!usageTabs.some((item) => item.tabId === activeUsageFeature)) {
      setActiveUsageFeature(usageTabs[0]?.tabId || 'glazing');
    }
  }, [usageTabs, activeUsageFeature]);

  const activeProfile = profileTabs.find((item) => item.tabId === activeProfileThickness) || profileTabs[0];
  const activeThresholdContent = thresholdTabs.find((item) => item.tabId === activeThreshold) || thresholdTabs[0];
  const activeUsage = usageTabs.find((item) => item.tabId === activeUsageFeature) || usageTabs[0];

  const enabledSpecialSections = (specialSections || []).filter((item) => item?.enabled !== false);

  return (
    <section className={styles.sectionWrap}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>
          {profileSection?.sectionOverline || t('productDetail.hsOverview.overline', 'Najważniejsze elementy')}
        </span>
        <h2 className={styles.headerTitle}>{profileSection?.sectionTitle || t('productDetail.hsOverview.title', 'W systemie HS')}</h2>
        <p className={styles.headerSubtitle}>
          {profileSection?.sectionSubtitle || t('productDetail.hsOverview.subtitle', 'Konfiguracja dopasowana do projektu')}
        </p>
      </div>

      {profileSection?.enabled !== false && activeProfile ? <div className={styles.profileThicknessSection}>
        <div className={styles.profileThicknessLayout}>
          <div className={styles.profileThicknessMediaColumn}>
            <div className={styles.profileThicknessPlaceholder}>
              {activeProfile?.image?.asset ? (
                <SanityImage
                  wrapperClassName={styles.profileThicknessImageWrap}
                  image={activeProfile.image}
                  altFallback={activeProfile.title}
                  className={styles.profileThicknessImage}
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 280px"
                  widths={[220, 280, 360, 420]}
                />
              ) : typeof activeProfile?.image === 'string' ? (
                <ImageWithSpinner
                  wrapperClassName={styles.profileThicknessImageWrap}
                  src={activeProfile.image}
                  alt={activeProfile.title}
                  className={styles.profileThicknessImage}
                  loading="lazy"
                />
              ) : (
                <span aria-hidden="true">PLACEHOLDER</span>
              )}
            </div>
          </div>

          <div className={styles.profileThicknessDescription}>
            <div className={styles.profileThicknessTitleBlock}>
              <div className={styles.profileThicknessTopLine}>
                <span className={styles.profileThicknessOverline}>{activeProfile?.overline || 'PROFIL'}</span>
                <div
                  className={styles.profileThicknessSwitch}
                  role="tablist"
                  aria-label={t('productDetail.hsOverview.profileSelectorAriaLabel', {
                    defaultValue:
                      locale === 'de'
                        ? 'Auswahl der HS-Profilstärke'
                        : locale === 'fr'
                          ? 'Sélection de l’épaisseur du profil HS'
                          : locale === 'en'
                            ? 'HS profile thickness selector'
                            : 'Wybór grubości profilu HS',
                  })}
                >
                  {profileTabs.map((item) => (
                    <button
                      key={item.tabId}
                      type="button"
                      role="tab"
                      aria-selected={activeProfileThickness === item.tabId}
                      className={`${styles.profileThicknessButton} ${activeProfileThickness === item.tabId ? styles.profileThicknessButtonActive : ''}`}
                      onClick={() => setActiveProfileThickness(item.tabId)}
                    >
                      {item.tabLabel}
                    </button>
                  ))}
                </div>
              </div>
              <h4 className={styles.profileThicknessMainTitle}>{activeProfile.title}</h4>
            </div>
            {renderContent(activeProfile.description || activeProfile.paragraphs, styles.profileThicknessParagraph)}
          </div>
        </div>
      </div> : null}

      {thresholdSection?.enabled !== false && activeThresholdContent ? <div className={styles.thresholdSection}>
        <div className={styles.thresholdLayout}>
          <div className={styles.thresholdDescription}>
            <div className={styles.thresholdTitleBlock}>
              <div className={styles.thresholdTopLine}>
                <span className={styles.thresholdOverline}>
                  {thresholdSection?.sectionOverline
                    || t('productDetail.hsOverview.thresholdOverline', {
                      defaultValue: locale === 'de' ? 'SCHWELLE' : locale === 'fr' ? 'SEUIL' : locale === 'en' ? 'THRESHOLD' : 'PRÓG',
                    })}
                </span>

                <div
                  className={styles.thresholdSwitch}
                  role="tablist"
                  aria-label={t('productDetail.hsOverview.thresholdSelectorAriaLabel', {
                    defaultValue:
                      locale === 'de'
                        ? 'Auswahl der HS-Schwelle'
                        : locale === 'fr'
                          ? 'Sélection du seuil HS'
                          : locale === 'en'
                            ? 'HS threshold selector'
                            : 'Wybór progu HS',
                  })}
                >
                  {thresholdTabs.map((item) => (
                    <button
                      key={item.tabId}
                      type="button"
                      role="tab"
                      aria-selected={activeThreshold === item.tabId}
                      className={`${styles.thresholdButton} ${activeThreshold === item.tabId ? styles.thresholdButtonActive : ''}`}
                      onClick={() => setActiveThreshold(item.tabId)}
                    >
                      {item.tabLabel}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className={styles.thresholdTitle}>{activeThresholdContent.title}</h3>
            </div>

            {renderContent(activeThresholdContent.description || activeThresholdContent.paragraphs, styles.thresholdParagraph)}
          </div>

          <div className={styles.thresholdMedia}>
            {activeThresholdContent?.image?.asset ? (
              <SanityImage
                wrapperClassName={styles.thresholdImageWrap}
                className={styles.thresholdImage}
                image={activeThresholdContent.image}
                altFallback={activeThresholdContent.title}
                loading="lazy"
                sizes="(max-width: 900px) 100vw, 520px"
                widths={[320, 480, 640, 760, 920]}
              />
            ) : activeThresholdContent?.image ? (
              <ImageWithSpinner
                wrapperClassName={styles.thresholdImageWrap}
                src={activeThresholdContent.image}
                alt={activeThresholdContent.title}
                className={styles.thresholdImage}
                loading="lazy"
              />
            ) : (
              <div className={styles.thresholdPlaceholder}>
                <span aria-hidden="true">PLACEHOLDER</span>
              </div>
            )}
          </div>
        </div>
      </div> : null}

      {usageSection?.enabled !== false && activeUsage ? <div className={styles.usageSection}>
        <div className={styles.usageTitleBlock}>
          <div className={styles.usageTopLine}>
            <span className={styles.usageOverline}>
              {usageSection?.sectionOverline
                || t('productDetail.hsOverview.usageOverline', {
                  defaultValue: locale === 'de' ? 'DETAILS' : locale === 'fr' ? 'DÉTAILS' : locale === 'en' ? 'DETAILS' : 'DETALE',
                })}
            </span>
            <div
              className={styles.usageSwitch}
              role="tablist"
              aria-label={t('productDetail.hsOverview.usageSelectorAriaLabel', {
                defaultValue:
                  locale === 'de'
                    ? 'Auswahl der HS-Nutzungsparameter'
                    : locale === 'fr'
                      ? 'Sélection des paramètres d’utilisation HS'
                      : locale === 'en'
                        ? 'HS usage parameters selector'
                        : 'Wybór parametrów użytkowych HS',
              })}
            >
              {usageTabs.map((item) => (
                <button
                  key={item.tabId}
                  type="button"
                  role="tab"
                  aria-selected={activeUsageFeature === item.tabId}
                  className={`${styles.usageButton} ${activeUsageFeature === item.tabId ? styles.usageButtonActive : ''}`}
                  onClick={() => setActiveUsageFeature(item.tabId)}
                >
                  {item.tabLabel}
                </button>
              ))}
            </div>
          </div>
          <h3 className={styles.usageMainTitle}>
            {usageSection?.sectionTitle
              || t('productDetail.hsOverview.usageSectionTitle', {
                defaultValue:
                  locale === 'de'
                    ? 'Details, die den Unterschied im Alltag machen'
                    : locale === 'fr'
                      ? 'Des détails qui font la différence au quotidien'
                      : locale === 'en'
                        ? 'Details that make a difference in everyday use'
                        : 'Szczegóły, które robią różnicę w codziennym użytkowaniu',
              })}
          </h3>
        </div>

        <div className={styles.usageLayout}>
          <div className={styles.usageDescription}>
            <h4 className={styles.usageItemTitle}>{activeUsage.title}</h4>
            {renderContent(activeUsage.description || activeUsage.paragraphs, styles.usageParagraph)}
            <p className={styles.usageBenefit}>
              <span>
                {activeUsage.benefitLabel
                  || t('productDetail.hsOverview.benefitLabel', {
                    defaultValue: locale === 'de' ? 'Vorteil:' : locale === 'fr' ? 'Avantage :' : locale === 'en' ? 'Benefit:' : 'Korzyść:',
                  })}
              </span>{' '}
              {activeUsage.benefitText || activeUsage.benefit}
            </p>
          </div>
        </div>
      </div> : null}

      {enabledSpecialSections.length ? (
        <div className={styles.specialSectionsWrap}>
          {enabledSpecialSections.map((item, index) => (
            <article
              key={`${item?.title || 'special'}-${index}`}
              className={`${styles.specialCard} ${item?.imageOnLeft ? styles.specialCardImageLeft : ''}`}
            >
              <div className={styles.specialContent}>
                <h3 className={styles.specialTitle}>{item.title}</h3>
                <div className={styles.specialBody}>
                  <SanityPortableText value={item.content} />
                </div>
                {item.ctaLabel && item.ctaHref ? (
                  <a href={item.ctaHref} className={styles.specialCta}>
                    {item.ctaLabel}
                  </a>
                ) : null}
              </div>

              {item.image?.asset ? (
                <SanityImage
                  wrapperClassName={styles.specialImageWrap}
                  className={styles.specialImage}
                  image={item.image}
                  altFallback={item.title}
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 440px"
                  widths={[360, 520, 720, 960]}
                />
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {children ? <div className={styles.embeddedSection}>{children}</div> : null}
    </section>
  );
}
