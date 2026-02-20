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
  const { t } = useTranslation();
  const profileSection = commonSections?.profileThickness || {};
  const thresholdSection = commonSections?.threshold || {};
  const usageSection = commonSections?.usageDetails || {};

  const profileTabs = React.useMemo(
    () => buildTabs({ defaultTabs: DEFAULT_PROFILE_TABS, section: profileSection, type: 'profile' }),
    [profileSection]
  );
  const thresholdTabs = React.useMemo(
    () => buildTabs({ defaultTabs: DEFAULT_THRESHOLD_TABS, section: thresholdSection, type: 'threshold' }),
    [thresholdSection]
  );
  const usageTabs = React.useMemo(
    () => buildTabs({ defaultTabs: DEFAULT_USAGE_TABS, section: usageSection, type: 'usage' }),
    [usageSection]
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
                <div className={styles.profileThicknessSwitch} role="tablist" aria-label="Wybór grubości profilu HS">
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
                <span className={styles.thresholdOverline}>{thresholdSection?.sectionOverline || 'PRÓG'}</span>

                <div className={styles.thresholdSwitch} role="tablist" aria-label="Wybór progu HS">
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
            <span className={styles.usageOverline}>{usageSection?.sectionOverline || 'DETALE'}</span>
            <div className={styles.usageSwitch} role="tablist" aria-label="Wybór parametrów użytkowych HS">
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
            {usageSection?.sectionTitle || 'Szczegóły, które robią różnicę w codziennym użytkowaniu'}
          </h3>
        </div>

        <div className={styles.usageLayout}>
          <div className={styles.usageDescription}>
            <h4 className={styles.usageItemTitle}>{activeUsage.title}</h4>
            {renderContent(activeUsage.description || activeUsage.paragraphs, styles.usageParagraph)}
            <p className={styles.usageBenefit}>
              <span>{activeUsage.benefitLabel || 'Korzyść:'}</span> {activeUsage.benefitText || activeUsage.benefit}
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
