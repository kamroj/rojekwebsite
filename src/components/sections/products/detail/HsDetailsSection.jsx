import React from 'react';

import styles from './HsDetailsSection.module.css';

export default function HsDetailsSection({ profileThicknesses = [], isWoodAlu = false, additionalInfo = [], children = null }) {
  const [activeProfileThickness, setActiveProfileThickness] = React.useState('78');
  const [activeThreshold, setActiveThreshold] = React.useState('67');
  const [activeUsageFeature, setActiveUsageFeature] = React.useState('glazing');

  const profileThicknessContent = {
    '78': {
      overline: 'PROFIL',
      title: 'Grubość 78 mm',
      paragraphs: [
        'Profil HS o grubości 78 mm to rozwiązanie idealne do nowoczesnego budownictwa jednorodzinnego oraz obiektów o podwyższonych wymaganiach estetycznych. Konstrukcja oparta na klejonce warstwowej z drewna litego zapewnia wysoką stabilność wymiarową oraz odporność na odkształcenia, nawet przy dużych przeszkleniach. System umożliwia zastosowanie pakietów trzyszybowych, co przekłada się na bardzo dobre parametry izolacyjności termicznej oraz akustycznej.',
        'Grubość 78 mm stanowi optymalny balans pomiędzy smukłą linią profilu a parametrami technicznymi. Dzięki temu konstrukcja zachowuje elegancki, lekki wygląd przy jednoczesnym zapewnieniu odpowiedniej sztywności skrzydeł przesuwnych. System doskonale sprawdza się w wyjściach tarasowych, ogrodowych oraz w strefach dziennych z dużymi przeszkleniami, gdzie kluczowe jest połączenie designu, funkcjonalności i komfortu użytkowania.',
      ],
    },
    '90': {
      overline: 'PROFIL',
      title: 'Grubość 90 mm',
      paragraphs: [
        'Profil HS o grubości 90 mm to rozwiązanie dedykowane inwestycjom o najwyższych wymaganiach w zakresie energooszczędności oraz trwałości konstrukcji. Zwiększona głębokość zabudowy umożliwia zastosowanie pakietów szybowych o większej grubości, co znacząco poprawia współczynnik przenikania ciepła całego systemu. To propozycja szczególnie polecana do budynków pasywnych i energooszczędnych.',
        'Masywniejsza konstrukcja profilu przekłada się również na jeszcze większą stabilność przy bardzo dużych formatach przeszkleń. System 90 mm pozwala na realizację imponujących przesuwnych ścian szklanych, zachowując wysoką szczelność, odporność na obciążenia wiatrem oraz komfort eksploatacji. To rozwiązanie premium – dla inwestorów oczekujących maksymalnych parametrów technicznych bez kompromisu w estetyce naturalnego drewna.',
      ],
    },
  };

  const activeProfile = profileThicknessContent[activeProfileThickness];

  const thresholdContent = {
    '67': {
      overline: 'PRÓG HS',
      title: '67 mm – rozwiązanie standardowe',
      paragraphs: [
        'Próg o wysokości 67 mm to klasyczne rozwiązanie w systemach HS, zapewniające bardzo dobre parametry szczelności oraz trwałości eksploatacyjnej. Konstrukcja oparta na stabilnym profilu z przekładką termiczną gwarantuje skuteczną izolację cieplną oraz ochronę przed przenikaniem wody i powietrza. To wariant rekomendowany w inwestycjach, gdzie priorytetem jest maksymalna szczelność oraz odporność na intensywne użytkowanie.',
        'Wyższy próg zapewnia również zwiększoną sztywność całej konstrukcji w strefie dolnej, co ma szczególne znaczenie przy dużych, ciężkich skrzydłach przesuwnych. Rozwiązanie to sprawdza się w domach jednorodzinnych, apartamentach oraz obiektach o dużych przeszkleniach tarasowych, gdzie istotne jest połączenie trwałości, bezpieczeństwa i wysokiej klasy parametrów technicznych.',
      ],
    },
    '50': {
      overline: 'PRÓG HS',
      title: '50 mm – płaski, komfortowy i nowoczesny',
      paragraphs: [
        'Próg płaski o wysokości 50 mm to rozwiązanie dedykowane nowoczesnym realizacjom, w których kluczową rolę odgrywa komfort przejścia oraz estetyka minimalizmu. Obniżona wysokość progu pozwala uzyskać niemal bezbarierowe połączenie wnętrza z tarasem lub ogrodem, co znacząco poprawia ergonomię użytkowania – szczególnie w domach z małymi dziećmi lub dla osób starszych.',
        'Pomimo smuklejszej konstrukcji, system zachowuje wysokie parametry szczelności dzięki zastosowaniu odpowiednich uszczelnień oraz rozwiązań konstrukcyjnych ograniczających mostki termiczne. Płaski próg podkreśla nowoczesny charakter przeszklenia HS i pozwala uzyskać efekt płynnego przejścia między strefą wewnętrzną a zewnętrzną, bez kompromisów w zakresie trwałości i bezpieczeństwa.',
      ],
    },
  };

  const activeThresholdContent = thresholdContent[activeThreshold];

  const usageFeatureContent = {
    glazing: {
      tabLabel: 'Szklenie',
      title: 'Szklenie listwowe i bezlistwowe',
      paragraphs: [
        'System HS oferuje dwa podejścia do wykończenia szyby: klasyczne szklenie listwowe oraz wariant bezlistwowy. Dzięki temu można dobrać nie tylko parametry techniczne, ale również finalny charakter wizualny konstrukcji — od bardziej tradycyjnego po nowoczesny, minimalistyczny.',
        'Wariant listwowy ułatwia serwisowanie i dobrze sprawdza się w projektach, gdzie liczy się trwałość oraz przewidywalność eksploatacyjna. Rozwiązanie bezlistwowe podkreśla lekkość dużych przeszkleń i estetykę jednolitej tafli, co jest szczególnie pożądane w nowoczesnej architekturze.',
      ],
      benefit: 'Większa swoboda projektowa bez kompromisu w zakresie szczelności i trwałości.',
      mediaLabel: 'Szklenie',
      mediaText: 'Dobór wariantu szklenia do stylu budynku, oczekiwań użytkowych i założeń projektu.',
    },
    hardware: {
      tabLabel: 'Okucia',
      title: 'Okucia GU do ciężkich skrzydeł HS',
      paragraphs: [
        'Zastosowanie okuć GU zapewnia stabilną i płynną pracę nawet przy dużych gabarytach skrzydeł przesuwnych. To system opracowany z myślą o wysokich obciążeniach, częstym użytkowaniu oraz utrzymaniu komfortu przesuwu przez długi czas eksploatacji.',
        'Precyzyjna praca mechanizmów przekłada się na wyższą kulturę użytkowania: skrzydło prowadzi się lekko, bez szarpnięć i z dobrą kontrolą ruchu. To szczególnie ważne w realizacjach premium, gdzie duże przeszklenia mają działać intuicyjnie każdego dnia.',
      ],
      benefit: 'Pewna, lekka obsługa skrzydeł i wysoka trwałość mechaniczna systemu.',
      mediaLabel: 'Okucia GU',
      mediaText: 'Sprawdzony standard dla konstrukcji HS o podwyższonych wymaganiach użytkowych.',
    },
    silentClose: {
      tabLabel: 'Komfort domykania',
      title: 'Komfort domykania i kontrola ruchu skrzydła',
      paragraphs: [
        'W obszarze komfortu domykania system HS może łączyć funkcję Silent Close z rozwiązaniem Stop Unit. Taki zestaw poprawia kulturę pracy całej konstrukcji: skrzydło kończy ruch łagodniej, bez gwałtownego domknięcia i bez nieprzyjemnego efektu uderzenia.',
        'Połączenie obu funkcji szczególnie dobrze sprawdza się przy dużych i ciężkich przeszkleniach, gdzie kluczowa jest kontrola końcowej fazy ruchu. Użytkownik zyskuje większą przewidywalność obsługi, wyższy komfort akustyczny oraz dodatkowe poczucie bezpieczeństwa na co dzień.',
      ],
      benefit: 'Cichsze domykanie, lepsza kontrola ruchu i większe bezpieczeństwo codziennej obsługi.',
    },
  };

  const activeUsage = usageFeatureContent[activeUsageFeature];

  return (
    <section className={styles.sectionWrap}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>Najważniejsze elementy</span>
        <h2 className={styles.headerTitle}>W systemie HS</h2>
        <p className={styles.headerSubtitle}>Konfiguracja dopasowana do projektu</p>
      </div>

      <div className={styles.profileThicknessSection}>
        <div className={styles.profileThicknessLayout}>
          <div className={styles.profileThicknessMediaColumn}>
            <div className={styles.profileThicknessPlaceholder}>
              {activeProfileThickness === '90' ? (
                <img
                  src="/images/hs/hs-profil-90.png"
                  alt="Rysunek techniczny profilu HS 90 mm"
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
                <span className={styles.profileThicknessOverline}>{activeProfile.overline}</span>
                <div className={styles.profileThicknessSwitch} role="tablist" aria-label="Wybór grubości profilu HS">
                  {['78', '90'].map((thickness) => (
                    <button
                      key={thickness}
                      type="button"
                      role="tab"
                      aria-selected={activeProfileThickness === thickness}
                      className={`${styles.profileThicknessButton} ${activeProfileThickness === thickness ? styles.profileThicknessButtonActive : ''}`}
                      onClick={() => setActiveProfileThickness(thickness)}
                    >
                      {thickness} mm
                    </button>
                  ))}
                </div>
              </div>
              <h4 className={styles.profileThicknessMainTitle}>{activeProfile.title}</h4>
            </div>
            {activeProfile.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.thresholdSection}>
        <div className={styles.thresholdLayout}>
          <div className={styles.thresholdDescription}>
            <div className={styles.thresholdTitleBlock}>
              <div className={styles.thresholdTopLine}>
                <span className={styles.thresholdOverline}>PRÓG</span>

                <div className={styles.thresholdSwitch} role="tablist" aria-label="Wybór progu HS">
                  {['67', '50'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={activeThreshold === value}
                      className={`${styles.thresholdButton} ${activeThreshold === value ? styles.thresholdButtonActive : ''}`}
                      onClick={() => setActiveThreshold(value)}
                    >
                      {value} mm
                    </button>
                  ))}
                </div>
              </div>

              <h3 className={styles.thresholdTitle}>{activeThresholdContent.title}</h3>
            </div>

            {activeThresholdContent.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.thresholdParagraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.thresholdMedia}>
            <img
              src={activeThreshold === '67' ? '/images/hs/prog-67mm.png' : '/images/hs/prog-50mm.png'}
              alt={activeThreshold === '67' ? 'Próg HS 67 mm' : 'Próg HS 50 mm'}
              className={styles.thresholdImage}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className={styles.usageSection}>
        <div className={styles.usageTitleBlock}>
          <div className={styles.usageTopLine}>
            <span className={styles.usageOverline}>DETALE</span>
            <div className={styles.usageSwitch} role="tablist" aria-label="Wybór parametrów użytkowych HS">
              {Object.entries(usageFeatureContent).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeUsageFeature === key}
                  className={`${styles.usageButton} ${activeUsageFeature === key ? styles.usageButtonActive : ''}`}
                  onClick={() => setActiveUsageFeature(key)}
                >
                  {item.tabLabel}
                </button>
              ))}
            </div>
          </div>
          <h3 className={styles.usageMainTitle}>Szczegóły, które robią różnicę w codziennym użytkowaniu</h3>
        </div>

        <div className={styles.usageLayout}>
          <div className={styles.usageDescription}>
            <h4 className={styles.usageItemTitle}>{activeUsage.title}</h4>
            {activeUsage.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.usageParagraph}>
                {paragraph}
              </p>
            ))}
            <p className={styles.usageBenefit}>
              <span>Korzyść:</span> {activeUsage.benefit}
            </p>
          </div>
        </div>
      </div>

      {children ? <div className={styles.embeddedSection}>{children}</div> : null}

      {isWoodAlu ? (
        <div className={styles.additionalStrip}>
          <h3 className={styles.additionalTitle}>Dodatkowo w wersji Drewno-Alu</h3>
          <div className={styles.additionalGrid}>
            {(additionalInfo.length ? additionalInfo : [
              {
                title: 'Dodatkowe opcje konfiguracji',
                description: 'Miejsce na rozszerzone informacje produktowe dla wariantu Drewno‑Alu.',
              },
              {
                title: 'Rozszerzenia techniczne',
                description:
                  'Miejsce na dodatkowe informacje techniczne i handlowe bez podawania wartości liczbowych.',
              },
            ]).map((item) => (
              <article className={styles.additionalCard} key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
