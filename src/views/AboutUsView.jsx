import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCalendar, FiPhone, FiMail } from 'react-icons/fi';
import Section from '../components/ui/Section';
import Page from '../components/ui/Page';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import { IoIosArrowForward } from 'react-icons/io';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import ImageWithSpinner from '../components/ui/ImageWithSpinner.jsx';

import styles from './AboutUsView.module.css';

const AboutUsPage = () => {
  const { t } = useTranslation();
  const _Motion = motion;

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goToPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const timeline = [
    {
      year: 'Od 1994',
      title: t('history.item1.title'),
      text: t('history.item1.text')
    },
    {
      year: '2002',
      title: t('history.item2.title'),
      text: t('history.item2.text')
    },
    {
      year: '2012',
      title: t('history.item3.title'),
      text: t('history.item3.text')
    },
    {
      year: '2014',
      title: t('history.item4.title'),
      text: t('history.item4.text')
    },
    {
      year: '2016',
      title: t('history.item5.title'),
      text: t('history.item5.text')
    },
    {
      year: '2019',
      title: t('history.item6.title'),
      text: t('history.item6.text')
    },
    {
      year: '2020',
      title: t('history.item7.title'),
      text: t('history.item7.text')
    }
  ];

  const managers = [
    {
      name: 'Wiesław Rojek',
      role: 'Właściciel',
      photo: '/images/realizations/realization2.jpg',
      alt: 'Wiesław Rojek',
      phone: '+48 603 923 011',
      phoneHref: 'tel:+48603923011',
      email: 'wieslaw.rojek@rojekoid.pl',
      emailHref: 'mailto:wieslaw.rojek@rojekoid.pl',
    },
    {
      name: 'Przemysław Rojek',
      role: 'Właściciel',
      photo: '/images/history/przemek.jpg',
      alt: 'Przemysław Rojek',
      phone: '+48 886 988 561',
      phoneHref: 'tel:+48886988561',
      email: 'przemyslaw.rojek@rojekoid.pl',
      emailHref: 'mailto:przemyslaw.rojek@rojekoid.pl',
    },
    {
      name: 'Tomasz Rojek',
      role: 'Właściciel',
      photo: '/images/history/tomek.jpg',
      alt: 'Tomasz Rojek',
      phone: '+48 889 194 388',
      phoneHref: 'tel:+48889194388',
      email: 'tomasz.rojek@rojekoid.pl',
      emailHref: 'mailto:tomasz.rojek@rojekoid.pl',
    },
  ];

  const ManagerItem = ({ manager }) => (
    <div className={styles.managerCard}>
      <div className={styles.managerImageWrapper}>
        <ImageWithSpinner
          wrapperClassName={styles.managerPhotoWrapper}
          className={styles.managerPhoto}
          src={manager.photo}
          alt={manager.alt}
        />
      </div>
      <div className={styles.managerBody}>
        <div className={styles.managerTopRow}>
          <h4 className={styles.managerName}>{manager.name}</h4>
        </div>
        <p className={styles.managerRole}>{manager.role}</p>
        <div className={styles.contactRow}>
          <a className={styles.contactLink} href={manager.phoneHref} aria-label={'Zadzwoń do ' + manager.name.split(' ')[0]}>
            <span className={styles.contactIconSmall}><FiPhone /></span>
            <span className={styles.contactInfoText}>{manager.phone}</span>
          </a>
          <a className={styles.contactLink} href={manager.emailHref} aria-label={'Napisz do ' + manager.name.split(' ')[0]}>
            <span className={styles.contactIconSmall}><FiMail /></span>
            <span className={styles.contactInfoText}>{manager.email}</span>
          </a>
        </div>
      </div>
    </div>
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Page imageSrc="/images/company/company-top.jpg" title={t('pageTitle.about', 'O Firmie')}>
      <Section>
        <HeaderWrap>
          <ProductHeader>
            {t('sections.whyUs')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('aboutPage.headers.whyUsSubtitle', 'Co odróżnia nas od innych')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.whyUsContainer}>
          <div className={styles.whyUsContentContainer}>
            <p>
              {t(
                'aboutPage.lead',
                'Dogodna lokalizacja stolarni przy granicy administracyjnej Krakowa, nowoczesny park maszynowy oraz hala o powierzchni 1200 m² dają nam wiele możliwości, aby zrealizować każde Państwa zamówienie. Zapewniamy konkurencyjne ceny oraz doświadczenie i profesjonalizm załogi w realizacji zleceń.'
              )}
            </p>
            <p>
              {t('aboutPage.invite', 'Zapraszamy osoby prywatne oraz firmy do składania zapytań ofertowych w następujących dziedzinach:')}
            </p>
            <ul className={styles.servicesList}>
              <li className={styles.serviceItem}>{t('aboutPage.services.0', { defaultValue: 'Okna jednoramowe (eurookna) standardowe i stylizowane' })}</li>
              <li className={styles.serviceItem}>{t('aboutPage.services.1', { defaultValue: 'Okna drewniane skrzynkowe' })}</li>
              <li className={styles.serviceItem}>{t('aboutPage.services.2', { defaultValue: 'Rekonstrukcje i renowacje stolarki zabytkowej' })}</li>
              <li className={styles.serviceItem}>{t('aboutPage.services.3', { defaultValue: 'Okna drewniane ppoż. EI30, EI60' })}</li>
              <li className={styles.serviceItem}>{t('aboutPage.services.4', { defaultValue: 'Drzwi drewniane ppoż. stylizowane dla obiektów zabytkowych' })}</li>
            </ul>
            <p>
              {t('aboutPage.partnersIntro', 'Ponadto posiadamy skład fabryczny i jesteśmy bezpośrednim dystrybutorem następujących firm:')}
            </p>
            <ul className={styles.servicesList}>
              <li className={styles.serviceItem}>{t('aboutPage.partners.0', { defaultValue: 'Okna PCV firmy OKNO-POL oraz SONAROL' })}<br /></li>
              <li className={styles.serviceItem}>{t('aboutPage.partners.1', { defaultValue: 'Drzwi wewnętrzne i wejściowe firmy CENTURION' })}</li>
            </ul>
          </div>
          <motion.div
            className={styles.headquartersImage}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ImageWithSpinner
              wrapperClassName={styles.headquartersMedia}
              className={styles.headquartersMediaImage}
              src="/images/company/company-building.jpg"
              alt={t('headquarters.imageAlt', 'Siedziba firmy ROJEK')}
            />
          </motion.div>
        </div>
      </Section>

      <Section>
        <HeaderWrap reversed>
          <ProductHeader>
            {t('history.title', 'Nasza Historia')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('aboutPage.headers.historySubtitle', 'Jak zmienialiśmy się przez lata')}</ProductHeaderSubtitle>
        </HeaderWrap>
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
              className={[styles.timelineItem, index % 2 === 0 ? null : styles.timelineItemRight].filter(Boolean).join(' ')}
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
      </Section>
      <Section label={t('management.label', 'ZARZĄD')} labelPosition="right" noPadding>
        <HeaderWrap>
          <ProductHeader>
            {t('management.title', 'MANAGEMENT')}
          </ProductHeader>
          <ProductHeaderSubtitle>{t('management.subtitle', 'Poznaj nasz zespół')}</ProductHeaderSubtitle>
        </HeaderWrap>
        <div className={styles.mobileSwiperContainer}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            onSlideChange={handleSlideChange}
            onSwiper={handleSlideChange}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                centeredSlides: false,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 28,
              },
            }}
            speed={400}
            className="managers-swiper"
          >
            {managers.map((m) => (
              <SwiperSlide key={m.name}>
                <ManagerItem manager={m} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.navigationContainer}>
            <button
              type="button"
              className={[styles.navigationButton, styles.prevNavigationButton].join(' ')}
              onClick={goToPrev}
              disabled={isBeginning}
              aria-label={t('navigation.previous', 'Poprzedni')}
            >
              <IoIosArrowForward />
            </button>
            <button
              type="button"
              className={[styles.navigationButton, styles.nextNavigationButton].join(' ')}
              onClick={goToNext}
              disabled={isEnd}
              aria-label={t('navigation.next', 'Następny')}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>

        <div className={styles.managementGrid}>
          {managers.map((m) => (
            <ManagerItem key={m.name} manager={m} />
          ))}
        </div>
      </Section>
    </Page>
  );
};

export default AboutUsPage;
