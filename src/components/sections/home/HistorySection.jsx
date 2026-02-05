import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { getSectionPath } from '../../../lib/i18n/routing.js';
import styles from './HistorySection.module.css';

const HistorySection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // eslint core does not treat JSX tag identifiers as variable usage unless eslint-plugin-react is enabled.
  // Keep a capitalized alias (ignored by our no-unused-vars config) so `motion` is considered used.
  const Motion = motion;

  // Timeline data with fallback
  const timeline = [
    { 
      year: '1981', 
      title: t('history.item1.title', 'Powstanie firmy'), 
      text: t('history.item1.text', 'Założenie rodzinnej firmy ROJEK. Rozpoczęcie produkcji wysokiej jakości stolarki otworowej z pasją i dbałością o każdy detal.')
    },
    { 
      year: '1998', 
      title: t('history.item2.title', 'Rozwój i innowacje'), 
      text: t('history.item2.text', 'Rozbudowa zakładu produkcyjnego i wprowadzenie nowoczesnych technologii. Poszerzenie oferty o nowe linie produktów.')
    },
    { 
      year: '2009', 
      title: t('history.item3.title', 'Ekspansja międzynarodowa'), 
      text: t('history.item3.text', 'Nawiązanie współpracy z renomowanymi partnerami zagranicznymi. Wdrożenie najwyższych standardów jakości.')
    },
    { 
      year: '2018', 
      title: t('history.item4.title', 'Modernizacja produkcji'), 
      text: t('history.item4.text', 'Kompleksowa modernizacja linii produkcyjnych. Wprowadzenie zaawansowanych rozwiązań technologicznych.')
    },
    { 
      year: '2023', 
      title: t('history.item5.title', 'Nowa era'), 
      text: t('history.item5.text', 'Wprowadzenie innowacyjnych systemów drewniano-aluminiowych i przesuwnych HS. Otwarcie na nowe możliwości.')
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerImageWrapper}>
        <img
          className={styles.headerImage}
          src="/images/realizations/top.jpg" 
          alt={t('history.headerAlt', 'Historia firmy ROJEK')} 
        />
        <div className={styles.headerContent}>
          <motion.h1
            className={styles.headerTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('history.title', 'Nasza Historia')}
          </motion.h1>
          <motion.p
            className={styles.headerSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('history.subtitle', 'Ponad 40 lat doświadczenia w branży')}
          </motion.p>
        </div>
      </div>

      <section className={styles.contentSection}>
        <motion.div
          className={styles.introText}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>
            {t('history.intro1', 'Firma ROJEK to rodzinne przedsiębiorstwo z ponad 40-letnią tradycją. Od samego początku stawiamy na najwyższą jakość, indywidualne podejście do klienta oraz ciągły rozwój.')}
          </p>
          <p>
            {t('history.intro2', 'Nasza historia to opowieść o pasji, determinacji i nieustannym dążeniu do doskonałości. Każdy etap naszego rozwoju był przemyślany i ukierunkowany na dostarczanie produktów spełniających najwyższe standardy.')}
          </p>
        </motion.div>

        <div className={styles.timelineContainer}>
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              className={`${styles.timelineItem} ${index % 2 === 0 ? styles.alignLeft : styles.alignRight}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className={styles.timelineCard}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.yearBadge}>
                  <FiCalendar />
                  {item.year}
                </div>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineText}>{item.text}</p>
              </motion.div>
              <div className={styles.timelineMarker} />
            </motion.div>
          ))}
        </div>

        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.ctaTitle}>{t('history.ctaTitle', 'Poznaj nas lepiej')}</h2>
          <p className={styles.ctaText}>
            {t('history.ctaText', 'Skontaktuj się z nami i dowiedz się więcej o naszych produktach i usługach')}
          </p>
          <motion.a
            className={styles.ctaButton}
            href={getSectionPath(lang, 'contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('history.ctaButton', 'Skontaktuj się')}
            <FiArrowRight />
          </motion.a>
        </motion.section>
      </section>
    </div>
  );
};

export default HistorySection;
