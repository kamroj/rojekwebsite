import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { useResponsive } from '../hooks/useResponsive';
import Page from '../components/ui/Page';
import ImageWithSpinner from '../components/ui/ImageWithSpinner.jsx';

import { REALIZATIONS_DATA } from '../data/realizations.js';

import styles from './RealizationsView.module.css';
const MENU_PORTAL_Z_INDEX = 9999;

// NOTE: data is now centralized in src/data/realizations.js

// Temporary placeholder filters for UI/view tuning.
// They will be removed once real CMS-backed taxonomy is finalized.
const TEMPORARY_FILTER_GROUPS = {
  system: ['MB-79N', 'MB-86N', 'MB-104 Passive', 'Genesis 75', 'Decalu 88', 'Veka Softline 82', 'Schuco LivIng', 'Salamander bluEvolution 82'],
  productType: ['window', 'front-door', 'terrace-door', 'hs-portal', 'fixed-glazing', 'corner-window', 'winter-garden', 'facade'],
  material: ['pvc', 'aluminium', 'wood', 'wood-alu', 'steel', 'composite'],
  openingType: ['fixed', 'tilt', 'turn', 'tilt-turn', 'slide', 'lift-slide', 'folding', 'pivot'],
  glazingPackage: ['2-pane', '3-pane', '4-pane', 'acoustic', 'safety', 'solar-control', 'ornament', 'anti-burglary'],
  profileColor: ['ral7016', 'ral7021', 'ral7024', 'ral7039', 'ral8019', 'ral9005', 'ral9006', 'ral9016', 'winchester', 'golden-oak', 'nut', 'anthracite-structure'],
  investmentType: ['single-family-house', 'apartment', 'office', 'hotel', 'school', 'restaurant', 'retail', 'industrial-hall', 'renovation', 'new-development'],
  region: ['warsaw', 'krakow', 'wroclaw', 'poznan', 'gdansk', 'lodz', 'katowice', 'bialystok', 'lublin', 'szczecin'],
  thermalClass: ['standard', 'warm', 'super-warm', 'passive', 'low-energy', 'nf40'],
  additionalFeature: ['hidden-hinges', 'warm-threshold', 'reed-switch', 'smart-lock', 'rc2', 'rc3', 'fingerprint', 'sun-shading', 'micro-ventilation', 'safe-kids'],
};

// Helpers for options and selection mapping
const collectUniqueTagOptions = (data) => {
  const seen = new Set();
  const uniqueOptions = [];
  let id = 1;

  data.forEach(item => {
    Object.entries(item.tags).forEach(([group, values]) => {
      values.forEach(val => {
        const key = `${group}__${val}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueOptions.push({ id: id++, label: val, value: val, group });
        }
      });
    });
  });

  uniqueOptions.sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label));
  return uniqueOptions;
};

const collectTemporaryPlaceholderOptions = (groups) => {
  const placeholderOptions = [];
  let id = 100000;

  Object.entries(groups).forEach(([group, values]) => {
    values.forEach((value) => {
      placeholderOptions.push({ id: id++, label: value, value, group });
    });
  });

  return placeholderOptions;
};

const mergeUniqueOptions = (baseOptions, extraOptions) => {
  const map = new Map();

  [...baseOptions, ...extraOptions].forEach((option) => {
    const key = `${option.group}__${option.value}`;
    if (!map.has(key)) {
      map.set(key, option);
    }
  });

  return Array.from(map.values()).sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label));
};

const groupOptionsByGroup = (options) => {
  const map = new Map();
  options.forEach(opt => {
    if (!map.has(opt.group)) map.set(opt.group, []);
    map.get(opt.group).push(opt);
  });
  return Array.from(map.entries()).map(([label, options]) => ({ label, options }));
};

const buildSelectedTagsByGroup = (selected) => {
  const map = new Map();
  selected.forEach(opt => {
    if (!map.has(opt.group)) map.set(opt.group, new Set());
    map.get(opt.group).add(opt.value);
  });
  return map;
};

export default function RealizationsPage() {
  const { t } = useTranslation();
  const tagOptions = useMemo(() => {
    const dataOptions = collectUniqueTagOptions(REALIZATIONS_DATA);
    const placeholderOptions = collectTemporaryPlaceholderOptions(TEMPORARY_FILTER_GROUPS);
    return mergeUniqueOptions(dataOptions, placeholderOptions);
  }, []);

  const groupedTagOptions = useMemo(() => groupOptionsByGroup(tagOptions), [tagOptions]);

  const [selectedTags, setSelectedTags] = useState([]);

  const { isLarge, isMobile } = useResponsive();
  // Hydration-safe: do not branch on `window/document` during render.
  // We enable browser-only widgets (react-select, pagination) after mount.
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  // For SSR we want a fully indexable list (no pagination / no client-only widgets).
  const itemsPerPage = isBrowser ? (isLarge ? 16 : (isMobile ? 8 : 12)) : REALIZATIONS_DATA.length;

  const selectedTagsByGroup = useMemo(() => buildSelectedTagsByGroup(selectedTags), [selectedTags]);

  const filteredRealizations = useMemo(() => {
    if (selectedTags.length === 0) return REALIZATIONS_DATA;

    return REALIZATIONS_DATA.filter(item => {
      for (const [group, wantedSet] of selectedTagsByGroup.entries()) {
        const vals = item.tags[group] || [];
        const hasAny = vals.some(v => wantedSet.has(v));
        if (!hasAny) return false;
      }
      return true;
    });
  }, [selectedTags, selectedTagsByGroup]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedTags, itemsPerPage]);

  const pageCount = Math.ceil(filteredRealizations.length / itemsPerPage) || 1;
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredRealizations.slice(offset, offset + itemsPerPage);

  const listTopRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeCardIndex, setActiveCardIndex] = useState(-1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateActiveCardIndex = () => {
      const viewportCenterY = window.innerHeight / 2;
      let closestIndex = -1;
      let closestDistance = Infinity;
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenterY - viewportCenterY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveCardIndex(closestIndex);
    };

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateActiveCardIndex();
      });
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateActiveCardIndex();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentItems, currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    if (listTopRef.current) {
      if (typeof window === 'undefined') return;
      const headerOffset = 90;
      const elementTop = listTopRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - headerOffset, behavior: "smooth" });
    }
  };

  return (
    <Page imageSrc="/images/realizations/top.jpg" height={500} title={t('realizationsPage.title')}>
      <div className={styles.filterContainer}>
        <div className={styles.filterCounter}>{t('realizationsPage.results.found', { count: filteredRealizations.length })}</div>
        {isBrowser ? (
          <Select
            isMulti
            options={groupedTagOptions}
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => `${opt.group}__${opt.value}`}
            value={selectedTags}
            onChange={(list) => setSelectedTags(list || [])}
            closeMenuOnSelect={false}
            placeholder={t('realizationsPage.filters.filtersTitle') || 'Filtry (grupy tagów)'}
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? '#017e54' : '#012712d7',
                boxShadow: 'none',
                outline: 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#017e54' : '#012712d7'
                }
              }),
              menuPortal: (base) => ({ ...base, zIndex: MENU_PORTAL_Z_INDEX })
            }}
          />
        ) : (
          // SSR placeholder - filters hydrate on the client.
          <div aria-hidden="true" style={{ height: 38 }} />
        )}
      </div>
      <div ref={listTopRef} aria-hidden="true" />
      <div className={styles.realizationsContainer}>
        {currentItems.map((item, idx) => (
          <div
            key={`${item.img}-${idx}`}
            ref={(el) => (cardRefs.current[idx] = el)}
            className={styles.singleRealizationContainer}
          >
            <ImageWithSpinner
              wrapperClassName={styles.realizationImageWrap}
              className={[
                styles.realizationImage,
                idx === activeCardIndex ? styles.realizationImageActive : null,
              ].filter(Boolean).join(' ')}
              src={item.img}
              alt={`${t('realizationsPage.title', 'Realizacje')} ${idx + 1}`}
              loading="lazy"
            />
            <div className={styles.realizationTags}>
              {Object.entries(item.tags).flatMap(([category, values]) =>
                values.map((val, i) => (
                  <span className={styles.tag} key={`${idx}-${category}-${val}-${i}`}>
                    {t(`tags.categories.${category}`, category)}: {val}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        isBrowser ? (
          <ReactPaginate
            className={styles.paginate}
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
            previousLabel="<"
            nextLabel=">"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            renderOnZeroPageCount={null}
          />
        ) : null
      )}
    </Page>
  );
}
