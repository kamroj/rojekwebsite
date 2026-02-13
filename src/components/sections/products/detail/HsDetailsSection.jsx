import React from 'react';

import styles from './HsDetailsSection.module.css';

const ICON_PLACEHOLDER = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
  </svg>
);

function HsCard({ title, description, chip, ctaHref, ctaLabel }) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>{ICON_PLACEHOLDER}</div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {chip ? <span className={styles.chip}>{chip}</span> : null}
        <p className={styles.cardDescription}>{description}</p>
        {ctaHref && ctaLabel ? (
          <a className={styles.cardLink} href={ctaHref}>
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function HsDetailsSection({ profileThicknesses = [], isWoodAlu = false, additionalInfo = [], children = null }) {
  const cards = [
    {
      title: 'Dostępne grubości profilu',
      chip: profileThicknesses.join(' / '),
      description:
        'Zakres grubości profili pozwala precyzyjnie dopasować system do wymagań projektu. Odpowiednia konfiguracja wspiera stabilność konstrukcji oraz parametry izolacyjności termicznej.',
    },
    {
      title: 'Próg',
      chip: '67 mm / 50 mm płaski',
      description:
        'Do wyboru wariant klasyczny 67 mm oraz płaski 50 mm. Dzięki temu łatwiej dobrać próg do oczekiwanego komfortu przejścia i charakteru realizacji.',
    },
    {
      title: 'Szklenie',
      chip: 'Listwą / Bezlistwowe',
      description:
        'System oferuje warianty szklenia listwą oraz bezlistwowe. Umożliwia to dopasowanie estetyki i techniki wykonania do projektu architektonicznego.',
    },
    {
      title: 'Okucia',
      chip: 'GU',
      description:
        'Zastosowanie okuć GU zapewnia płynną i stabilną pracę skrzydeł HS. To sprawdzone rozwiązanie dla dużych przeszkleń i codziennej, komfortowej obsługi.',
    },
    {
      title: 'Komfort domykania',
      chip: 'Silent Close (opcjonalnie)',
      description:
        'Opcjonalna funkcja Silent Close zwiększa wygodę użytkowania poprzez łagodne i ciche domykanie skrzydła. To szczególnie istotne przy cięższych, wielkogabarytowych konstrukcjach.',
    },
    {
      title: 'Kontrola domknięcia',
      chip: 'Stop Unit (hamulec)',
      description:
        'Hamulec Stop Unit wspiera kontrolę ruchu skrzydła i podnosi bezpieczeństwo codziennego użytkowania. Rozwiązanie ogranicza ryzyko gwałtownego domknięcia.',
    },
    {
      title: 'Schematy',
      description:
        'System HS jest dostępny we wszystkich schematach spotykanych na rynku. Dzięki temu łatwo dobrać konfigurację do układu pomieszczeń i strefy tarasowej.',
      ctaHref: '#hs-schemes',
      ctaLabel: 'Przejdź do sekcji schematów',
    },
  ];

  return (
    <section className={styles.sectionWrap}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerOverline}>Najważniejsze elementy systemu</span>
        <h2 className={styles.headerTitle}>W systemie HS</h2>
        <p className={styles.headerSubtitle}>Konfiguracja dopasowana do projektu</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <HsCard key={card.title} {...card} />
        ))}
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
