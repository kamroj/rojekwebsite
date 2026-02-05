import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../hooks/useResponsive';
import RealizationCard from '../components/sections/realizations/RealizationCard';
import Pagination from '../components/ui/Pagination';
import Page from '../components/ui/Page';

import styles from './RealizationsView.module.css';

const PAGE_SIZE = 6;

const PRODUCT_TYPES = {
  DOORS: {
    INTERIOR: 'interiorDoors',
    EXTERIOR: 'exteriorDoors'
  },
  WINDOWS: {
    WOOD: 'woodWindows',
    WOOD_ALU: 'woodAluWindows',
    PVC: 'pvcWindows'
  }
};

const COLORS = {
  RAL9017: 'ral9017',
  RAL7016: 'ral7016',
  RAL9016: 'ral9016'
};

const FILTER_CATEGORIES = {
  TYPE: 'type',
  COLOR: 'color'
};

const EXAMPLE_REALIZATIONS = [
  { 
    id: 1, 
    src: '/images/realizations/realization1.jpg', 
    title: 'Exterior doors 1', 
    tags: { 
      product: 'doors', 
      type: PRODUCT_TYPES.DOORS.EXTERIOR, 
      color: COLORS.RAL7016 
    } 
  },
  { 
    id: 2, 
    src: '/images/realizations/realization2.jpg', 
    title: 'Interior doors 1', 
    tags: { 
      product: 'doors', 
      type: PRODUCT_TYPES.DOORS.INTERIOR, 
      color: COLORS.RAL9016 
    } 
  },
  { 
    id: 3, 
    src: '/images/realizations/realization3.jpg', 
    title: 'Wood windows 1', 
    tags: { 
      product: 'windows', 
      type: PRODUCT_TYPES.WINDOWS.WOOD, 
      color: COLORS.RAL9017 
    } 
  },
  { 
    id: 4, 
    src: '/images/realizations/realization4.jpg', 
    title: 'PVC windows 1', 
    tags: { 
      product: 'windows', 
      type: PRODUCT_TYPES.WINDOWS.PVC, 
      color: COLORS.RAL7016 
    } 
  },
  { 
    id: 5, 
    src: '/images/realizations/realization5.jpg', 
    title: 'Interior doors 2', 
    tags: { 
      product: 'doors', 
      type: PRODUCT_TYPES.DOORS.INTERIOR, 
      color: COLORS.RAL7016 
    } 
  },
  { 
    id: 6, 
    src: '/images/realizations/realization6.jpg', 
    title: 'Wood-Alu windows 1', 
    tags: { 
      product: 'windows', 
      type: PRODUCT_TYPES.WINDOWS.WOOD_ALU, 
      color: COLORS.RAL9016 
    } 
  },
];


const DropdownPanel = motion.div;
const MobilePanel = motion.div;

const RealizationsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  
  const doorTypes = useMemo(() => [
    PRODUCT_TYPES.DOORS.INTERIOR, 
    PRODUCT_TYPES.DOORS.EXTERIOR
  ], []);
  
  const windowTypes = useMemo(() => [
    PRODUCT_TYPES.WINDOWS.WOOD, 
    PRODUCT_TYPES.WINDOWS.WOOD_ALU, 
    PRODUCT_TYPES.WINDOWS.PVC
  ], []);
  
  const colorOptions = useMemo(() => [
    ...new Set(EXAMPLE_REALIZATIONS.map(realization => realization.tags.color))
  ], []);

  const [dropdownsOpen, setDropdownsOpen] = useState({ 
    doors: false, 
    windows: false, 
    color: false 
  });
  
  const [selectedFilters, setSelectedFilters] = useState({ 
    [FILTER_CATEGORIES.TYPE]: new Set(), 
    [FILTER_CATEGORIES.COLOR]: new Set() 
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const [mobileTemporaryFilters, setMobileTemporaryFilters] = useState(null);

  const doorsRef = useRef();
  const windowsRef = useRef();
  const colorRef = useRef();
  const mobileButtonRef = useRef();
  const desktopButtonRef = useRef();
  const mobilePanelRef = useRef();

  // Framer Motion animation for desktop dropdowns (subtle and fast)
  const dropdownMotionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.12, ease: 'easeIn' } }
  };

  const openMobilePanel = () => {
    setMobileTemporaryFilters({
      [FILTER_CATEGORIES.TYPE]: new Set([...selectedFilters[FILTER_CATEGORIES.TYPE]]),
      [FILTER_CATEGORIES.COLOR]: new Set([...selectedFilters[FILTER_CATEGORIES.COLOR]]),
    });
    setIsMobilePanelOpen(true);
  };

  const closeMobilePanel = () => {
    setIsMobilePanelOpen(false);
    setMobileTemporaryFilters(null);
  };

  const toggleMobileFilter = (category, value) => {
    setMobileTemporaryFilters(prev => {
      if (!prev) return prev;
      const updated = { 
        [FILTER_CATEGORIES.TYPE]: new Set(prev[FILTER_CATEGORIES.TYPE]), 
        [FILTER_CATEGORIES.COLOR]: new Set(prev[FILTER_CATEGORIES.COLOR]) 
      };
      if (updated[category].has(value)) {
        updated[category].delete(value);
      } else {
        updated[category].add(value);
      }
      return updated;
    });
  };

  const clearMobileFilters = () => {
    // Clear mobile temporary selections
    setMobileTemporaryFilters({ 
      [FILTER_CATEGORIES.TYPE]: new Set(), 
      [FILTER_CATEGORIES.COLOR]: new Set() 
    });
    // Also apply cleared state to the actual filters so they are reset immediately
    setSelectedFilters({ 
      [FILTER_CATEGORIES.TYPE]: new Set(), 
      [FILTER_CATEGORIES.COLOR]: new Set() 
    });
    setCurrentPage(1);
    // Close the mobile panel after clearing
    closeMobilePanel();
  };

  const applyMobileFilters = () => {
    if (mobileTemporaryFilters) {
      setSelectedFilters({ 
        [FILTER_CATEGORIES.TYPE]: new Set([...mobileTemporaryFilters[FILTER_CATEGORIES.TYPE]]), 
        [FILTER_CATEGORIES.COLOR]: new Set([...mobileTemporaryFilters[FILTER_CATEGORIES.COLOR]]) 
      });
    }
    closeMobilePanel();
  };

  const toggleDropdown = (dropdownKey, event) => {
    if (event) {
      event.stopPropagation();
    }
    setDropdownsOpen(prev => {
      const isCurrentlyOpen = prev[dropdownKey];
      // Close all dropdowns first
      const allClosed = { doors: false, windows: false, color: false };
      // Then open the clicked one if it was closed
      return { ...allClosed, [dropdownKey]: !isCurrentlyOpen };
    });
  };

  const closeAllDropdowns = () => {
    setDropdownsOpen({ doors: false, windows: false, color: false });
  };

  const toggleFilter = (category, value, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedFilters(prev => {
      const updated = new Set(prev[category]);
      if (updated.has(value)) {
        updated.delete(value);
      } else {
        updated.add(value);
      }
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ 
      [FILTER_CATEGORIES.TYPE]: new Set(), 
      [FILTER_CATEGORIES.COLOR]: new Set() 
    });
    setCurrentPage(1);
    // close any open dropdowns after clearing filters (desktop)
    closeAllDropdowns();
  };

  const filteredRealizations = useMemo(() => {
    const hasFilters = (filterSet) => filterSet && filterSet.size > 0;
    
    return EXAMPLE_REALIZATIONS.filter(realization => {
      const { type, color } = realization.tags;
      
      if (hasFilters(selectedFilters[FILTER_CATEGORIES.TYPE]) && 
          !selectedFilters[FILTER_CATEGORIES.TYPE].has(type)) {
        return false;
      }
      
      if (hasFilters(selectedFilters[FILTER_CATEGORIES.COLOR]) && 
          !selectedFilters[FILTER_CATEGORIES.COLOR].has(color)) {
        return false;
      }
      
      return true;
    });
  }, [selectedFilters]);

  const totalPages = Math.ceil(filteredRealizations.length / PAGE_SIZE);
  const currentPageItems = filteredRealizations.slice(
    (currentPage - 1) * PAGE_SIZE, 
    currentPage * PAGE_SIZE
  );

  const selectedTypeCount = selectedFilters[FILTER_CATEGORIES.TYPE].size;
  const selectedColorCount = selectedFilters[FILTER_CATEGORIES.COLOR].size;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypeCount, selectedColorCount]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const target = event.target;

      // If click is inside any filter area (wrapper or dropdown), do nothing
      if (target.closest && target.closest('[data-filter-area="true"]')) {
        return;
      }

      // If mobile filters panel is open, handle it explicitly
      if (isMobilePanelOpen) {
        const insideMobile =
          (target.closest && target.closest('[data-mobile-panel="true"]')) ||
          (mobileButtonRef.current && mobileButtonRef.current.contains(target));

        if (!insideMobile) {
          setIsMobilePanelOpen(false);
        }
        return;
      }

      // Desktop: clicking outside closes all dropdowns
      closeAllDropdowns();
    };

    const handleKeyDown = (event) => { 
      if (event.key === 'Escape') { 
        closeAllDropdowns(); 
        setIsMobilePanelOpen(false); 
      } 
    };

    const handleResize = () => {
      if (window.innerWidth <= 720) {
        closeAllDropdowns();
      } else {
        setIsMobilePanelOpen(false);
      }
    };

    // Use setTimeout to ensure this runs after the onClick handlers
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);
    
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobilePanelOpen]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;

    if (isMobilePanelOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowX = 'hidden';

      setTimeout(() => {
        mobilePanelRef.current?.querySelector('input,button,select,textarea,a')?.focus();
      }, 0);
    } else {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    };
  }, [isMobilePanelOpen]);

  const getTranslatedProductType = (type) => {
    return t(`realizationsPage.productTypes.${type}`);
  };

  const getTranslatedColor = (color) => {
    return t(`realizationsPage.colors.${color}`);
  };

  return (
    <Page imageSrc="/images/realizations/top.jpg" title={t('realizationsPage.title')}>

      <div className={styles.content}>

        <AnimatePresence>
          {isMobilePanelOpen && (
            <MobilePanel 
              ref={mobilePanelRef}
              className={styles.mobilePanel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
              data-mobile-panel="true"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.mobileHeader}>
                <span className={styles.filterHeading} id="mobile-filters-title">
                  {t('realizationsPage.filters.filtersTitle')}
                </span>
                <button
                  type="button"
                  className={styles.mobileCloseButton}
                  onClick={() => setIsMobilePanelOpen(false)} 
                  aria-label={t('realizationsPage.filters.close')}
                >
                  <FiX />
                </button>
              </div>

              <div className={styles.mobileFilters}>
                <div className={styles.filterWrapper} data-filter-area="true">
                  <button
                    type="button"
                    className={styles.filterControl}
                    onClick={(e) => toggleDropdown('doors', e)} 
                    aria-expanded={dropdownsOpen.doors}
                  >
                    <div className={styles.labelBlock}>
                      <span className={styles.filterHeading}>{t('realizationsPage.filters.doors')}</span>
                    </div>
                    {dropdownsOpen.doors ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
              <AnimatePresence>
              {dropdownsOpen.doors && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                        {doorTypes.map(type => (
                          <label
                            key={type}
                            className={styles.optionRow}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={mobileTemporaryFilters ? 
                                mobileTemporaryFilters[FILTER_CATEGORIES.TYPE].has(type) : 
                                selectedFilters[FILTER_CATEGORIES.TYPE].has(type)
                              }
                              onChange={() => mobileTemporaryFilters ? 
                                toggleMobileFilter(FILTER_CATEGORIES.TYPE, type) : 
                                toggleFilter(FILTER_CATEGORIES.TYPE, type)
                              }
                            />
                            <span>{getTranslatedProductType(type)}</span>
                          </label>
                        ))}
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
                </div>

                <div className={styles.filterWrapper} data-filter-area="true">
                  <button
                    type="button"
                    className={styles.filterControl}
                    onClick={(e) => toggleDropdown('windows', e)} 
                    aria-expanded={dropdownsOpen.windows}
                  >
                    <div className={styles.labelBlock}>
                      <span className={styles.filterHeading}>{t('realizationsPage.filters.windows')}</span>
                    </div>
                    {dropdownsOpen.windows ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
              <AnimatePresence>
              {dropdownsOpen.windows && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                        {windowTypes.map(type => (
                          <label
                            key={type}
                            className={styles.optionRow}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={mobileTemporaryFilters ? 
                                mobileTemporaryFilters[FILTER_CATEGORIES.TYPE].has(type) : 
                                selectedFilters[FILTER_CATEGORIES.TYPE].has(type)
                              }
                              onChange={() => mobileTemporaryFilters ? 
                                toggleMobileFilter(FILTER_CATEGORIES.TYPE, type) : 
                                toggleFilter(FILTER_CATEGORIES.TYPE, type)
                              }
                            />
                            <span>{getTranslatedProductType(type)}</span>
                          </label>
                        ))}
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
                </div>

                <div className={styles.filterWrapper} data-filter-area="true">
                  <button
                    type="button"
                    className={styles.filterControl}
                    onClick={(e) => toggleDropdown('color', e)} 
                    aria-expanded={dropdownsOpen.color}
                  >
                    <div className={styles.labelBlock}>
                      <span className={styles.filterHeading}>{t('realizationsPage.filters.color')}</span>
                    </div>
                    {dropdownsOpen.color ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
              <AnimatePresence>
              {dropdownsOpen.color && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                        {colorOptions.map(color => (
                          <label
                            key={color}
                            className={styles.optionRow}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={mobileTemporaryFilters ? 
                                mobileTemporaryFilters[FILTER_CATEGORIES.COLOR].has(color) : 
                                selectedFilters[FILTER_CATEGORIES.COLOR].has(color)
                              }
                              onChange={() => mobileTemporaryFilters ? 
                                toggleMobileFilter(FILTER_CATEGORIES.COLOR, color) : 
                                toggleFilter(FILTER_CATEGORIES.COLOR, color)
                              }
                            />
                            <span>{getTranslatedColor(color)}</span>
                          </label>
                        ))}
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
                </div>
              </div>

              <div className={styles.mobileFooter}>
                <button type="button" className={styles.mobileAction} onClick={clearMobileFilters}>
                  {t('realizationsPage.filters.clear')}
                </button>
                <button
                  type="button"
                  className={`${styles.mobileAction} ${styles.mobileActionPrimary}`}
                  onClick={applyMobileFilters}
                >
                  {t('realizationsPage.filters.apply')}
                </button>
              </div>
            </MobilePanel>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          <motion.div
            initial={false}
            animate={{}}
            transition={{ duration: 0.12 }}
            style={{ overflow: 'visible', position: 'relative', zIndex: 5000 }}
          >
        <div className={styles.resultsTop}>

          <div className={styles.controlsBar}>
            {!isMobilePanelOpen && (
              <div className={styles.resultsCount} style={{ marginRight: 'auto' }}>
                {t('realizationsPage.results.found', { count: filteredRealizations.length })}
              </div>
            )}
            <button
              type="button"
              className={styles.mobileFiltersButton}
              ref={mobileButtonRef} 
              onClick={openMobilePanel} 
              aria-label={t('realizationsPage.filters.filtersTitle')}
            >
              <FiFilter />
            </button>

                <button
                  type="button"
                  className={styles.desktopFiltersButton}
                  ref={desktopButtonRef}
                  onClick={() => {
                    setIsDesktopFiltersOpen(prev => {
                      const next = !prev;
                      if (!next) {
                        // When hiding desktop filters, also close any open dropdowns
                        closeAllDropdowns();
                      }
                      return next;
                    });
                  }}
                  aria-label={t('realizationsPage.filters.filtersTitle')}
                >
                  <FiFilter />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
            {isDesktopFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -8 }}
                animate={{ height: 'auto', opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                exit={{ height: 0, opacity: 0, y: -8, transition: { duration: 0.12, ease: 'easeIn' } }}
                className={styles.filtersExpander}
              >
                <div className={styles.filtersRow}>
          <div className={styles.dropdownsGroup}>
            <div className={styles.filterWrapper} ref={doorsRef} data-filter-area="true">
              <button
                type="button"
                className={styles.filterControl}
                onClick={(e) => toggleDropdown('doors', e)} 
                aria-expanded={dropdownsOpen.doors} 
                aria-haspopup="menu"
              >
                <div className={styles.labelBlock}>
                  <span className={styles.filterHeading}>{t('realizationsPage.filters.doors')}</span>
                </div>
                {dropdownsOpen.doors ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <AnimatePresence>
              {dropdownsOpen.doors && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                    {doorTypes.map(type => (
                      <label
                        key={type}
                        className={styles.optionRow}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.TYPE].has(type)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.TYPE, type, e)}
                        />
                        <span>{getTranslatedProductType(type)}</span>
                      </label>
                    ))}
                  </div>
                </DropdownPanel>
              )}
              </AnimatePresence>
            </div>

            <div className={styles.filterWrapper} ref={windowsRef} data-filter-area="true">
              <button
                type="button"
                className={styles.filterControl}
                onClick={(e) => toggleDropdown('windows', e)} 
                aria-expanded={dropdownsOpen.windows} 
                aria-haspopup="menu"
              >
                <div className={styles.labelBlock}>
                  <span className={styles.filterHeading}>{t('realizationsPage.filters.windows')}</span>
                </div>
                {dropdownsOpen.windows ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <AnimatePresence>
              {dropdownsOpen.windows && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                    {windowTypes.map(type => (
                      <label
                        key={type}
                        className={styles.optionRow}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.TYPE].has(type)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.TYPE, type, e)}
                        />
                        <span>{getTranslatedProductType(type)}</span>
                      </label>
                    ))}
                  </div>
                </DropdownPanel>
              )}
              </AnimatePresence>
            </div>

            <div className={styles.filterWrapper} ref={colorRef} data-filter-area="true">
              <button
                type="button"
                className={styles.filterControl}
                onClick={(e) => toggleDropdown('color', e)} 
                aria-expanded={dropdownsOpen.color} 
                aria-haspopup="menu"
              >
                <div className={styles.labelBlock}>
                  <span className={styles.filterHeading}>{t('realizationsPage.filters.color')}</span>
                </div>
                {dropdownsOpen.color ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <AnimatePresence>
              {dropdownsOpen.color && (
                <DropdownPanel
                  role="menu"
                  className={styles.dropdownPanel}
                  data-filter-area="true"
                  {...(!isMobile ? dropdownMotionProps : {})}
                >
                  <div className={styles.optionList}>
                    {colorOptions.map(color => (
                      <label
                        key={color}
                        className={styles.optionRow}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.COLOR].has(color)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.COLOR, color, e)}
                        />
                        <span>{getTranslatedColor(color)}</span>
                      </label>
                    ))}
                  </div>
                </DropdownPanel>
              )}
              </AnimatePresence>
            </div>
          </div>

          <div style={{ marginLeft: '12px', alignSelf: 'center' }}>
            <button type="button" className={styles.clearButton} onClick={clearAllFilters}>
              <FiX style={{ transform: 'translateY(2px)' }} />
              {t('realizationsPage.filters.clear')}
            </button>
          </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <div id="realizations-grid">
          <div className={styles.grid}>
            {currentPageItems.map(({ id, src, title, tags }) => (
              <div key={id}>
                <RealizationCard id={id} src={src} title={title} tags={tags} />
              </div>
            ))}
          </div>
        </div>

        {filteredRealizations.length === 0 && (
          <div className={styles.noResults}>
            <h3>{t('realizationsPage.results.noResults')}</h3>
            <p>{t('realizationsPage.results.noResultsMessage')}</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({
              top: document.querySelector('#realizations-grid')?.offsetTop || 0,
              behavior: 'smooth',
            });
          }}
        />
      </div>
    </Page>
  );
};

export default RealizationsPage;
