import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../../components/ui/Page';
import Section from '../../components/ui/Section';
import { DOOR_SPECS_DEFS, DOOR_SPECS_ORDER_LIST } from '../../data/products/doors';
import { WINDOW_COLORS_PALETTE, WINDOW_LAZUR_PALETTE } from '../../data/products/windows';
import SanityPortableText from '../../components/portable/SanityPortableText';
import ImageWithSpinner from '../../components/ui/ImageWithSpinner.jsx';
import {
  ProductDetailHero,
  ProductDetailSpecs,
  ProductDetailFeatures,
  ProductDetailColors,
  ProductDetailAdvantages,
  ProductDetailFAQ,
  ProductDetailCTA,
} from '../../components/sections/products/detail';
import { DOOR_FAQ_FALLBACK } from '../../data/products/faqFallback.js';
import styles from './FireRatedProductDetail.module.css';

const pickByLocale = (locale, values) => values[locale] || values.pl;

const containsPolishChars = (value) => typeof value === 'string' && /[ąćęłńóśźż]/i.test(value);

const shouldUseTranslatedStringFallback = (value, locale) => {
  if (locale === 'pl') return false;
  if (!value) return true;
  return containsPolishChars(value);
};

const shouldUseTranslatedArrayFallback = (items, locale) => {
  if (locale === 'pl') return false;
  if (!Array.isArray(items) || items.length === 0) return true;

  return items.some((item) => {
    if (Array.isArray(item)) return false;
    const text = item?.text || item?.title || item?.description || '';
    return containsPolishChars(text);
  });
};

const FireRatedInfoSections = ({ locale }) => {
  const content = pickByLocale(locale, {
    pl: {
      certificationItems: [
        {
          text: 'Deklaracja właściwości użytkowych (DoP) – jeśli dotyczy systemu',
          icon: '/images/icons/ikona-certifikat.png',
        },
        {
          text: 'Raporty z badań / klasyfikacja odporności ogniowej – w zakresie oferty',
          icon: '/images/icons/ikona-raporty-ppoz.png',
        },
        {
          text: 'Zgodność z PN-EN 13501-2 (klasyfikacja odporności ogniowej) – opisowo',
          icon: '/images/icons/ikona-zgodnosc-z-norma.png',
        },
      ],
      constructionItems: [
        'Uszczelnienia pęczniejące – ograniczenie przepływu dymu i ognia',
        'Szklenie ognioodporne (opcjonalnie) – konfiguracje pod projekt',
        'Wielowarstwowa konstrukcja stabilizująca – kontrola pracy drewna',
        'Okucia i zamki w konfiguracjach spełniających wymagania projektu',
        'Montaż i kompletność systemu – kluczowe dla zachowania klasy EI',
        'Dobór rozwiązań pod projekt wykonawczy – wsparcie techniczne na etapie uzgodnień',
      ],
      applications: [
        {
          text: 'Budynki wielorodzinne, klatki schodowe, korytarze ewakuacyjne',
          icon: '/images/icons/ikona-blok.png',
        },
        {
          text: 'Obiekty użyteczności publicznej: szkoły, hotele, urzędy',
          icon: '/images/icons/ikona-szkola.png',
        },
        {
          text: 'Obiekty komercyjne i magazynowe (w zależności od projektu)',
          icon: '/images/icons/ikona-budynki-publiczne.png',
        },
        {
          text: 'Domy jednorodzinne – warianty dobierane do wymagań inwestycji',
          icon: '/images/icons/ikona-dom-jednorodzinny.png',
        },
      ],
      comparisonRows: [
        {
          label: 'Czas odporności ogniowej',
          ei30: 'Do 30 minut utrzymania kryteriów klasy EI',
          ei60: 'Do 60 minut utrzymania kryteriów klasy EI',
        },
        {
          label: 'Typowe zastosowania',
          ei30: 'Mieszkania, strefy komunikacji wewnętrznej, obiekty o niższym obciążeniu ogniowym',
          ei60: 'Klatki schodowe, drogi ewakuacyjne, obiekty o podwyższonych wymaganiach',
        },
        {
          label: 'Dostępne warianty szklenia',
          ei30: 'Konfiguracje przeszkleń zgodnie z dokumentacją systemu',
          ei60: 'Warianty przeszkleń dobierane indywidualnie do projektu i klasy',
        },
        {
          label: 'Rekomendacje projektowe',
          ei30: 'Optymalny kompromis między wymaganiem ochrony i ekonomią inwestycji',
          ei60: 'Rekomendowany przy wyższych wymaganiach formalnych i funkcjonalnych',
        },
      ],
      headerOverline: 'Stolarka ognioodporna',
      headerTitle: 'Certyfikacja i normy',
      headerSubtitle: 'Dokumentacja i zgodność projektowa',
      investorOverline: 'Co otrzymuje inwestor',
      investorTitle: 'Zakres dokumentacji',
      disclaimer:
        'Jako jeden z wyspecjalizowanych producentów w regionie Krakowa dostarczamy rozwiązania dobierane do wymagań projektowych i formalnych.',
      constructionOverline: 'Konstrukcja przeciwpożarowa',
      constructionTitle: 'Kluczowe elementy systemu',
      comparisonTitle: 'EI30 vs EI60 – jak dobrać?',
      tableParam: 'Parametr',
      applicationsTitle: 'Obszary zastosowania',
    },
    en: {
      certificationItems: [
        {
          text: 'Declaration of Performance (DoP) – where applicable for the system',
          icon: '/images/icons/ikona-certifikat.png',
        },
        {
          text: 'Test reports / fire resistance classification – according to offer scope',
          icon: '/images/icons/ikona-raporty-ppoz.png',
        },
        {
          text: 'Compliance with PN-EN 13501-2 (fire resistance classification) – descriptive',
          icon: '/images/icons/ikona-zgodnosc-z-norma.png',
        },
      ],
      constructionItems: [
        'Intumescent seals – limiting smoke and fire transfer',
        'Fire-rated glazing (optional) – project-based configurations',
        'Multi-layer stabilising construction – controlled timber behaviour',
        'Hardware and locks in configurations meeting project requirements',
        'Installation and system completeness – key to maintaining EI class',
        'Project-specific technical selection with support during coordination',
      ],
      applications: [
        { text: 'Multi-family buildings, staircases, evacuation corridors', icon: '/images/icons/ikona-blok.png' },
        { text: 'Public buildings: schools, hotels, offices', icon: '/images/icons/ikona-szkola.png' },
        { text: 'Commercial and warehouse facilities (project-dependent)', icon: '/images/icons/ikona-budynki-publiczne.png' },
        { text: 'Single-family homes – variants selected per investment requirements', icon: '/images/icons/ikona-dom-jednorodzinny.png' },
      ],
      comparisonRows: [
        { label: 'Fire resistance time', ei30: 'Up to 30 minutes while maintaining EI criteria', ei60: 'Up to 60 minutes while maintaining EI criteria' },
        { label: 'Typical applications', ei30: 'Residential units, internal circulation zones, lower fire load buildings', ei60: 'Staircases, evacuation routes, facilities with increased requirements' },
        { label: 'Available glazing variants', ei30: 'Glazing configurations according to system documentation', ei60: 'Glazing options selected individually by project and class' },
        { label: 'Design recommendations', ei30: 'Optimal balance between protection requirements and investment cost', ei60: 'Recommended for higher formal and functional requirements' },
      ],
      headerOverline: 'Fire-rated joinery',
      headerTitle: 'Certification and standards',
      headerSubtitle: 'Documentation and design compliance',
      investorOverline: 'What the investor receives',
      investorTitle: 'Documentation scope',
      disclaimer:
        'As one of the specialised manufacturers in the Kraków region, we deliver solutions aligned with design and formal requirements.',
      constructionOverline: 'Fire-protection construction',
      constructionTitle: 'Key system elements',
      comparisonTitle: 'EI30 vs EI60 – how to choose?',
      tableParam: 'Parameter',
      applicationsTitle: 'Application areas',
    },
    de: {
      certificationItems: [
        {
          text: 'Leistungserklärung (DoP) – sofern für das System relevant',
          icon: '/images/icons/ikona-certifikat.png',
        },
        {
          text: 'Prüfberichte / Feuerwiderstandsklassifizierung – gemäß Angebotsumfang',
          icon: '/images/icons/ikona-raporty-ppoz.png',
        },
        {
          text: 'Konformität mit PN-EN 13501-2 (Feuerwiderstandsklassifizierung) – beschreibend',
          icon: '/images/icons/ikona-zgodnosc-z-norma.png',
        },
      ],
      constructionItems: [
        'Intumeszierende Dichtungen – Begrenzung von Rauch- und Feuerdurchtritt',
        'Feuerhemmende Verglasung (optional) – projektbezogene Konfigurationen',
        'Mehrschichtige stabilisierende Konstruktion – kontrolliertes Holzverhalten',
        'Beschläge und Schlösser in projektkonformen Konfigurationen',
        'Montage und Systemvollständigkeit – entscheidend für den Erhalt der EI-Klasse',
        'Projektbezogene Lösungswahl mit technischer Unterstützung in der Abstimmung',
      ],
      applications: [
        { text: 'Mehrfamilienhäuser, Treppenhäuser, Fluchtkorridore', icon: '/images/icons/ikona-blok.png' },
        { text: 'Öffentliche Gebäude: Schulen, Hotels, Ämter', icon: '/images/icons/ikona-szkola.png' },
        { text: 'Gewerbe- und Lagerobjekte (projektabhängig)', icon: '/images/icons/ikona-budynki-publiczne.png' },
        { text: 'Einfamilienhäuser – Varianten je nach Investitionsanforderungen', icon: '/images/icons/ikona-dom-jednorodzinny.png' },
      ],
      comparisonRows: [
        { label: 'Feuerwiderstandsdauer', ei30: 'Bis zu 30 Minuten bei Einhaltung der EI-Kriterien', ei60: 'Bis zu 60 Minuten bei Einhaltung der EI-Kriterien' },
        { label: 'Typische Anwendungen', ei30: 'Wohnungen, interne Verkehrsflächen, Objekte mit geringerer Brandlast', ei60: 'Treppenhäuser, Fluchtwege, Objekte mit erhöhten Anforderungen' },
        { label: 'Verfügbare Verglasungsvarianten', ei30: 'Verglasungskonfigurationen gemäß Systemdokumentation', ei60: 'Verglasungsvarianten individuell nach Projekt und Klasse' },
        { label: 'Planungsempfehlungen', ei30: 'Optimaler Kompromiss zwischen Schutzanforderung und Wirtschaftlichkeit', ei60: 'Empfohlen bei höheren formalen und funktionalen Anforderungen' },
      ],
      headerOverline: 'Feuerhemmende Tischlerei',
      headerTitle: 'Zertifizierung und Normen',
      headerSubtitle: 'Dokumentation und Planungskonformität',
      investorOverline: 'Was der Investor erhält',
      investorTitle: 'Dokumentationsumfang',
      disclaimer:
        'Als einer der spezialisierten Hersteller in der Region Krakau liefern wir Lösungen passend zu planerischen und formalen Anforderungen.',
      constructionOverline: 'Brandschutzkonstruktion',
      constructionTitle: 'Wesentliche Systemelemente',
      comparisonTitle: 'EI30 vs EI60 – wie wählen?',
      tableParam: 'Parameter',
      applicationsTitle: 'Einsatzbereiche',
    },
    fr: {
      certificationItems: [
        {
          text: 'Déclaration des performances (DoP) – si applicable au système',
          icon: '/images/icons/ikona-certifikat.png',
        },
        {
          text: 'Rapports d’essais / classification de résistance au feu – selon l’offre',
          icon: '/images/icons/ikona-raporty-ppoz.png',
        },
        {
          text: 'Conformité à la norme PN-EN 13501-2 (classification feu) – descriptif',
          icon: '/images/icons/ikona-zgodnosc-z-norma.png',
        },
      ],
      constructionItems: [
        'Joints intumescents – limitation du passage de fumée et de feu',
        'Vitrage coupe-feu (optionnel) – configurations selon le projet',
        'Construction multicouche stabilisante – contrôle du comportement du bois',
        'Quincaillerie et serrures dans des configurations conformes au projet',
        'Pose et complétude du système – essentielles pour préserver la classe EI',
        'Choix des solutions selon le projet avec support technique en phase de coordination',
      ],
      applications: [
        { text: 'Immeubles collectifs, cages d’escalier, couloirs d’évacuation', icon: '/images/icons/ikona-blok.png' },
        { text: 'Établissements publics : écoles, hôtels, administrations', icon: '/images/icons/ikona-szkola.png' },
        { text: 'Bâtiments commerciaux et entrepôts (selon projet)', icon: '/images/icons/ikona-budynki-publiczne.png' },
        { text: 'Maisons individuelles – variantes adaptées aux exigences de l’investissement', icon: '/images/icons/ikona-dom-jednorodzinny.png' },
      ],
      comparisonRows: [
        { label: 'Durée de résistance au feu', ei30: 'Jusqu’à 30 minutes de maintien des critères EI', ei60: 'Jusqu’à 60 minutes de maintien des critères EI' },
        { label: 'Applications typiques', ei30: 'Logements, circulations intérieures, bâtiments à charge feu plus faible', ei60: 'Cages d’escalier, voies d’évacuation, bâtiments à exigences renforcées' },
        { label: 'Variantes de vitrage disponibles', ei30: 'Configurations conformes à la documentation système', ei60: 'Variantes de vitrage définies individuellement selon le projet et la classe' },
        { label: 'Recommandations de conception', ei30: 'Compromis optimal entre exigence de protection et coût d’investissement', ei60: 'Recommandé pour des exigences formelles et fonctionnelles plus élevées' },
      ],
      headerOverline: 'Menuiserie coupe-feu',
      headerTitle: 'Certification et normes',
      headerSubtitle: 'Documentation et conformité projet',
      investorOverline: 'Ce que reçoit l’investisseur',
      investorTitle: 'Périmètre documentaire',
      disclaimer:
        'En tant que l’un des fabricants spécialisés de la région de Cracovie, nous proposons des solutions adaptées aux exigences de projet et de conformité.',
      constructionOverline: 'Construction coupe-feu',
      constructionTitle: 'Éléments clés du système',
      comparisonTitle: 'EI30 vs EI60 – comment choisir ?',
      tableParam: 'Paramètre',
      applicationsTitle: 'Domaines d’application',
    },
  });

  const { certificationItems, constructionItems, applications, comparisonRows } = content;

  return (
    <section className={styles.standardSectionWrapper}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>{content.headerOverline}</span>
        <h2 className={styles.headerTitle}>{content.headerTitle}</h2>
        <p className={styles.headerSubtitle}>{content.headerSubtitle}</p>
      </div>

      <div className={`${styles.contentGrid} ${styles.contentGridWithPadding}`}>
        <div className={styles.textContent}>
          <div className={styles.titleBlock}>
            <span className={styles.overline}>{content.investorOverline}</span>
            <h3 className={styles.blockTitle}>{content.investorTitle}</h3>
          </div>
          <div className={styles.featuresList}>
            {certificationItems.map((item) => (
              <div key={item.text} className={styles.featureItem}>
                <div className={styles.featureIconBox}>
                  <ImageWithSpinner
                    wrapperClassName={styles.featureIconWrap}
                    className={styles.featureIconImg}
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.featureTextBlock}>
                  <span className={styles.featureTitle}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.disclaimerText}>{content.disclaimer}</p>
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleBlock}>
            <span className={styles.overline}>{content.constructionOverline}</span>
            <h3 className={`${styles.blockTitle} ${styles.constructionSectionTitle}`}>{content.constructionTitle}</h3>
          </div>
          <div className={`${styles.cardGrid} ${styles.constructionGrid}`}>
            {constructionItems.map((item) => (
              <article key={item} className={styles.simpleCard}>
                <p className={styles.simpleCardText}>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentGridWithPadding}>
        <div className={styles.tableWrapper}>
          <h3 className={`${styles.blockTitle} ${styles.fireRatedSubsectionTitle}`}>{content.comparisonTitle}</h3>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th scope="col">{content.tableParam}</th>
                <th scope="col">EI30</th>
                <th scope="col">EI60</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.ei30}</td>
                  <td>{row.ei60}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.contentGridWithPadding}>
        <h3 className={`${styles.blockTitle} ${styles.applicationsHeading} ${styles.fireRatedSubsectionTitle}`}>{content.applicationsTitle}</h3>
        <div className={`${styles.cardGrid} ${styles.applicationsGrid}`}>
          {applications.map((item) => (
            <article key={item.text} className={styles.simpleCard}>
              <p className={styles.simpleCardText}>{item.text}</p>
              <ImageWithSpinner
                wrapperClassName={styles.applicationIconWrap}
                className={styles.applicationIcon}
                src={item.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function FireRatedProductDetail({ product, breadcrumbPathname }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'pl').split('-')[0];

  const specTooltipKeyMap = {
    profileThickness: 'productSpecs.tooltips.profileThickness',
    thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
    waterTightness: 'productSpecs.tooltips.waterTightness',
  };

  const colors = WINDOW_COLORS_PALETTE;

  const translatedShortDescription = t('productDetail.fireRated.hero.shortDescription', {
    defaultValue:
      'Certyfikowana stolarka ognioodporna do budownictwa mieszkaniowego i komercyjnego. Dokumentacja, badania, wsparcie projektowe.',
  });

  const translatedLongDescription = t('productDetail.fireRated.hero.longDescription', {
    defaultValue:
      'Rozwiązania przeciwpożarowe w klasach EI30 i EI60 projektujemy z myślą o bezpieczeństwie użytkowników oraz zgodności z wymaganiami dokumentacji technicznej. Stolarka drewniana łączy estetykę, stabilność konstrukcji i możliwość dopasowania do charakteru inwestycji.',
  });

  const resolvedShortDescription = shouldUseTranslatedStringFallback(product?.shortDescription, locale)
    ? translatedShortDescription
    : product?.shortDescription;

  const longDescriptionSource = Array.isArray(product?.longDescription)
    ? product.longDescription
    : shouldUseTranslatedStringFallback(product?.longDescription, locale)
      ? translatedLongDescription
      : product?.longDescription;

  const longDescriptionContent = Array.isArray(longDescriptionSource)
    ? <SanityPortableText value={longDescriptionSource} />
    : longDescriptionSource;

  const translatedFeatures = [
    {
      text: t('productDetail.fireRated.features.items.1', {
        defaultValue:
          '<strong>Klasy odporności EI30 / EI60</strong> – wariant dobierany do wymagań obiektu i scenariusza pożarowego',
      }),
    },
    {
      text: t('productDetail.fireRated.features.items.2', {
        defaultValue:
          '<strong>Szklenie ognioodporne i uszczelnienia pęczniejące</strong> – kompletne rozwiązania zgodne z zakresem oferty',
      }),
    },
    {
      text: t('productDetail.fireRated.features.items.3', {
        defaultValue:
          '<strong>Produkcja i doradztwo: Kraków / Małopolska / Polska</strong> – wsparcie projektowe od doboru po dokumentację',
      }),
    },
    {
      text: t('productDetail.fireRated.features.items.4', {
        defaultValue:
          '<strong>Wykończenia i kolorystyka</strong> – lazury i kolory dopasowane do standardowej stolarki drewnianej',
      }),
    },
    {
      text: t('productDetail.fireRated.features.items.5', {
        defaultValue:
          '<strong>Kompletacja pod wymagania inwestycji</strong> – dobór okuć, wyposażenia i detali montażowych pod konkretny projekt',
      }),
    },
  ];

  const translatedAdvantages = [
    {
      title: t('productDetail.fireRated.advantages.items.1.title', {
        defaultValue: 'Bezpieczeństwo potwierdzone dokumentacją',
      }),
      description: t('productDetail.fireRated.advantages.items.1.description', {
        defaultValue:
          'Rozwiązania przygotowywane z uwzględnieniem klas odporności ogniowej i wymagań formalnych projektu.',
      }),
    },
    {
      title: t('productDetail.fireRated.advantages.items.2.title', {
        defaultValue: 'Elastyczna konfiguracja EI30 / EI60',
      }),
      description: t('productDetail.fireRated.advantages.items.2.description', {
        defaultValue:
          'Dobór konstrukcji, szklenia i okuć zgodnie z przeznaczeniem obiektu oraz oczekiwaniami inwestora.',
      }),
    },
    {
      title: t('productDetail.fireRated.advantages.items.3.title', {
        defaultValue: 'Spójność estetyczna',
      }),
      description: t('productDetail.fireRated.advantages.items.3.description', {
        defaultValue:
          'Stolarka przeciwpożarowa może zachować charakter i kolorystykę pozostałych elementów drewnianych.',
      }),
    },
    {
      title: t('productDetail.fireRated.advantages.items.4.title', {
        defaultValue: 'Wsparcie techniczne',
      }),
      description: t('productDetail.fireRated.advantages.items.4.description', {
        defaultValue:
          'Pomoc na etapie koncepcji, projektu wykonawczego i przygotowania dokumentacji do odbioru.',
      }),
    },
    {
      title: t('productDetail.fireRated.advantages.items.5.title', {
        defaultValue: 'Obsługa lokalna i ogólnopolska',
      }),
      description: t('productDetail.fireRated.advantages.items.5.description', {
        defaultValue: 'Realizacje prowadzimy w Krakowie, Małopolsce i na terenie całej Polski.',
      }),
    },
  ];

  const resolvedFeatures = shouldUseTranslatedArrayFallback(product?.features, locale)
    ? translatedFeatures
    : product?.features;

  const resolvedAdvantages = shouldUseTranslatedArrayFallback(product?.advantages, locale)
    ? translatedAdvantages
    : product?.advantages;

  const resolvedProduct = {
    ...product,
    shortDescription: resolvedShortDescription,
    features: resolvedFeatures,
    advantages: resolvedAdvantages,
  };

  const faqItems =
    Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : DOOR_FAQ_FALLBACK;

  const categoryLabel = t('products.fireResistant.name', {
    defaultValue: locale === 'de'
      ? 'Feuerfeste Fenster und Türen'
      : locale === 'fr'
        ? 'Fenêtres et portes coupe-feu'
        : locale === 'en'
          ? 'Fire-rated windows and doors'
          : 'Okna i Drzwi przeciwpożarowe',
  });

  const featuresTitle = t('productDetail.doors.featuresTitle', {
    product: product.name,
    defaultValue: 'Co wyróżnia drzwi {{product}}?',
  });

  const colorsTitle = t('productDetail.doors.colorsTitle', 'KOLORYSTYKA');
  const colorsRalTabLabel = t('productDetail.doors.colorsRalTab', 'RAL');
  const colorsLazurTabLabel = t('productDetail.doors.colorsLazurTab', 'LAZUR');
  const colorsMostPopular = t('productDetail.doors.colorsMostPopular', 'Najczęściej wybierane kolory');
  const colorsFullPalette = t('productDetail.doors.colorsFullPalette', 'Pełna paleta kolorów RAL');

  const advantagesTitle = t('productDetail.doors.advantagesTitle', {
    product: product.name,
    defaultValue: 'Dlaczego warto wybrać {{product}}?',
  });

  const ctaTitle = t('productDetail.doors.cta.title', {
    product: product.name,
    defaultValue: 'Zainteresowany drzwiami {{product}}?',
  });
  const ctaDescription = t('productDetail.doors.cta.fireRatedDescription', {
    defaultValue:
      locale === 'de'
        ? 'Hersteller aus Krakau – Projekte in Kleinpolen und in ganz Polen. Unterstützung für Architekten und Ausführende.'
        : locale === 'fr'
          ? 'Fabricant de Cracovie – réalisations en Petite-Pologne et dans toute la Pologne. Accompagnement des architectes et des entreprises.'
          : locale === 'en'
            ? 'Manufacturer based in Kraków – projects across Lesser Poland and all over Poland. Support for architects and contractors.'
            : 'Producent Kraków – realizacje w Małopolsce i całej Polsce. Wsparcie dla architektów i wykonawców.',
  });
  const ctaNote = t('productDetail.doors.cta.note', 'Odpowiadamy w ciągu 24 godzin');

  return (
    <Page
      imageSrc={product.headerImage}
      headerImage={product.headerImageSanity}
      title={product.name}
      breadcrumbPathname={breadcrumbPathname}
      headerProps={{
        badge: { label: product.name },
        headerContent: {
          content: {
            isSubpage: true,
            pageType: 'product',
            subpageType: 'product',
          },
        },
      }}
    >
      <Section>
        <ProductDetailHero
          product={resolvedProduct}
          categoryLabel={categoryLabel}
          longDescriptionContent={longDescriptionContent}
          primaryCtaLabel={t('productDetail.fireRated.hero.primaryCta', {
            defaultValue:
              locale === 'de'
                ? 'Angebot und Beratung'
                : locale === 'fr'
                  ? 'Devis et consultation'
                  : locale === 'en'
                    ? 'Quote and consultation'
                    : 'Wycena i konsultacja',
          })}
          secondaryCtaLabel={t('productDetail.fireRated.hero.secondaryCta', {
            defaultValue:
              locale === 'de'
                ? 'Technisches Datenblatt herunterladen'
                : locale === 'fr'
                  ? 'Télécharger la fiche technique'
                  : locale === 'en'
                    ? 'Download technical sheet'
                    : 'Pobierz kartę techniczną',
          })}
          t={t}
        />

        <ProductDetailSpecs
          product={product}
          specsDefs={DOOR_SPECS_DEFS}
          specsOrderList={DOOR_SPECS_ORDER_LIST}
          tooltipKeyMap={specTooltipKeyMap}
          t={t}
        />

        <ProductDetailFeatures product={resolvedProduct} title={featuresTitle} t={t} />
      </Section>

      <FireRatedInfoSections locale={locale} />

      <ProductDetailColors
        title={colorsTitle}
        colorsRal={colors}
        colorsLazur={WINDOW_LAZUR_PALETTE}
        ralTabLabel={colorsRalTabLabel}
        lazurTabLabel={colorsLazurTabLabel}
        mostPopularLabel={colorsMostPopular}
        fullPaletteLabel={colorsFullPalette}
        t={t}
      />

      <Section>
        <ProductDetailAdvantages
          product={resolvedProduct}
          title={advantagesTitle}
          i18nPrefix="productDetail.doors"
          t={t}
        />
      </Section>

      <ProductDetailFAQ
        items={faqItems}
        productName={product.name}
        titleOverride={t('productDetail.fireRated.faq.title', {
          defaultValue:
            locale === 'de'
              ? 'FAQ – feuerfeste Holzfenster und -türen'
              : locale === 'fr'
                ? 'FAQ – fenêtres et portes coupe-feu en bois'
                : locale === 'en'
                  ? 'FAQ – fire-rated wooden windows and doors'
                  : 'FAQ – drzwi i okna przeciwpożarowe drewniane',
        })}
        subtitleOverride={t('productDetail.fireRated.faq.subtitle', {
          defaultValue:
            locale === 'de'
              ? 'Die häufigsten Fragen zu Auswahl, Dokumentation und Umsetzung von EI30/EI60-Elementen.'
              : locale === 'fr'
                ? 'Questions les plus fréquentes sur le choix, la documentation et la mise en œuvre des menuiseries EI30/EI60.'
                : locale === 'en'
                  ? 'Most common questions about selection, documentation and implementation of EI30/EI60 joinery.'
                  : 'Najczęściej zadawane pytania dotyczące doboru, dokumentacji i realizacji stolarki EI30/EI60.',
        })}
        t={t}
      />

      <ProductDetailCTA title={ctaTitle} description={ctaDescription} note={ctaNote} t={t} />
    </Page>
  );
}
