import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../hooks/useResponsive';
import RealizationCard from '../components/gallery/RealizationCard';
import Pagination from '../components/common/Pagination';
import PageHeader from '../components/common/PageHeader';

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

const PageWrapper = styled.div`
  width: 100%;
`;

const Content = styled.div`
  max-width: ${({ theme }) => (theme?.layout?.maxWidth || '1200px')};
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;
  margin: 12px 0 20px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const DropdownsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 18px;
`;

const FilterWrapper = styled.div.attrs({ 'data-filter-area': 'true' })`
  flex: 0 0 180px;
  max-width: 180px;
  min-width: 140px;
  position: relative;
  box-sizing: border-box;

  @media (max-width: 720px) {
    flex: 0 0 auto;
    max-width: 320px;
    width: min(90%, 320px);
    margin: 6px auto;
    position: relative;
  }
`;

const FilterControl = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: ${({ theme }) => theme?.shadows?.small || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition: ${({ theme }) => theme?.transitions?.default || '0.3s ease'};
  
  &:hover {
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: ${({ theme }) => theme?.shadows?.medium || '0 4px 8px rgba(0, 0, 0, 0.2)'};
    background: ${({ theme }) => theme?.colors?.backgroundAlt || '#f9fafb'};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.borderAccent || 'rgba(1, 126, 84, 0.25)'};
  }
  
  &:active {
    outline: none;
    transform: translateY(1px);
  }
`;

const LabelBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FilterHeading = styled.span`
  font-weight: 600;
  font-size: 1.3rem;
  color: ${({ theme }) => theme?.colors?.text || '#222'};

  @media (max-width: 720px) {
    font-size: 1.5rem;
  }
`;

const DropdownPanel = styled.div.attrs({ 'data-filter-area': 'true' })`
  /* Desktop: keep dropdown in-flow so it pushes content down under the filters */
  position: static;
  margin-top: 6px;
  width: 100%;
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme?.shadows?.medium || '0 4px 8px rgba(0, 0, 0, 0.2)'};
  z-index: 6000;
  padding: 6px;
  box-sizing: border-box;

  /* Mobile: keep absolute positioning (overlays) for small screens */
  @media (max-width: 720px) {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    box-shadow: ${({ theme }) => theme?.shadows?.medium || '0 4px 8px rgba(0, 0, 0, 0.2)'};
    border: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
    border-radius: 8px;
    padding: 0;
    background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
    display: block;
    box-sizing: border-box;
    z-index: 7000;
    overflow: hidden;
  }
`;

const OptionList = styled.div`
  max-height: 220px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.colors?.accent || '#017e54'};
    border-radius: 3px;
    
    &:hover {
      background: ${({ theme }) => theme?.colors?.accentDark || '#015a3c'};
    }
  }

  @media (max-width: 720px) {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    box-sizing: border-box;
    gap: 0;
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    box-shadow: none;
  }
`;

const OptionRow = styled.label`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: ${({ theme }) => theme?.transitions?.fast || '0.2s ease-in'};
  
  &:hover { 
    background: ${({ theme }) => theme?.colors?.backgroundAlt || '#f9fafb'}; 
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    margin-right: 10px;
    transform: none;
    accent-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    flex-shrink: 0;
    cursor: pointer;
    
    &:checked {
      background-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
      border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    }
    
    &:hover {
      border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme?.colors?.borderAccent || 'rgba(1, 126, 84, 0.25)'};
    }
  }

  span {
    font-size: 1.3rem;
    flex: 1;
    white-space: nowrap;
    color: ${({ theme }) => theme?.colors?.text || '#212529'};
  }

  @media (max-width: 720px) {
    padding: 12px;
    border-radius: 0;
    width: 100%;
    
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
    }

    &:hover { 
      background: ${({ theme }) => theme?.colors?.backgroundAlt || '#f9fafb'}; 
    }
  }

  @media (max-width: 420px) {
    input[type="checkbox"] {
      width: 12px;
      height: 12px;
    }
    span { 
      font-size: 1.3rem; 
    }
  }
`;

const ResultsTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 16px;
`;

const ResultsCount = styled.div`
  flex: 1;
  min-width: 0;
  color: ${({ theme }) => theme?.colors?.text || '#222'};
  font-weight: 500;
  font-size: 1rem;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;

  @media (min-width: 721px) {
    font-weight: 600;
    font-size: 1.3rem;
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(3, 1fr);
  
  @media (max-width: 1100px) { 
    grid-template-columns: repeat(2, 1fr); 
  }
  
  @media (max-width: 720px) { 
    grid-template-columns: 1fr; 
  }
`;

const NoResults = styled.div`
  padding: 30px;
  text-align: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-top: 20px;
`;

const MobileFiltersButton = styled.button`
  all: unset;
  display: none;
  /* keep in normal flow so ControlsBar height is preserved */
  position: static;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme?.shadows?.small || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: ${({ theme }) => theme?.transitions?.default || '0.3s ease'};
  
  &:hover {
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: ${({ theme }) => theme?.shadows?.medium || '0 4px 8px rgba(0, 0, 0, 0.2)'};
    background: ${({ theme }) => theme?.colors?.backgroundAlt || '#f9fafb'};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.borderAccent || 'rgba(1, 126, 84, 0.25)'};
  }
  
  &:active {
    outline: none;
    transform: translateY(1px);
  }
  
  svg { 
    width: 18px; 
    height: 18px; 
    color: ${({ theme }) => theme?.colors?.text || '#212529'}; 
  }

  @media (max-width: 720px) {
    display: flex;
  }
`;

const DesktopFiltersButton = styled.button`
  all: unset;
  display: flex;
  /* position in normal flow inside ControlsBar so it occupies space */
  position: static;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#dee2e6'};
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme?.shadows?.small || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: ${({ theme }) => theme?.transitions?.default || '0.3s ease'};
  z-index: 2000;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: ${({ theme }) => theme?.shadows?.medium || '0 4px 8px rgba(0, 0, 0, 0.2)'};
    background: ${({ theme }) => theme?.colors?.backgroundAlt || '#f9fafb'};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.secondary || '#017e54'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.borderAccent || 'rgba(1, 126, 84, 0.25)'};
  }

  &:active {
    outline: none;
    transform: translateY(1px);
  }

  svg { 
    width: 18px; 
    height: 18px; 
    color: ${({ theme }) => theme?.colors?.text || '#212529'}; 
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const MobilePanel = styled(motion.div).attrs({ 'data-mobile-panel': 'true' })`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  /* Prefer dynamic viewport height; fallback to VisualViewport CSS var if present */
  height: var(--vvh, 100dvh);
  max-height: 100dvh;
  background: #fff;
  border: none;
  border-radius: 0;
  box-shadow: none;
  z-index: 9999;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  touch-action: pan-y;
  overscroll-behavior-x: contain;
  box-sizing: border-box;
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
`;

const MobileCloseButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const MobileFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  /* Ensure footer actions are not obscured by bottom browser UI or iOS home indicator */
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#eee'};
  background: ${({ theme }) => theme?.colors?.panelBg || '#fff'};
  justify-content: space-between;
  box-sizing: border-box;
`;

const MobileAction = styled.button`
  all: unset;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  border: 1px solid ${({ primary, theme }) => primary ? (theme?.colors?.primary || '#004605') : (theme?.colors?.border || '#e6e6e6')};
  color: ${({ primary, theme }) => primary ? '#fff' : (theme?.colors?.text || '#222')};
  background: ${({ primary, theme }) => primary ? (theme?.colors?.primary || '#003d29') : 'transparent'};
`;

const MobileFilters = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  box-sizing: border-box;

  ${FilterWrapper} {
    margin: 8px 0;
  }
`;

const ClearButton = styled.button`
  all: unset;
  cursor: pointer;
  font-weight: 600;
  color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* ControlsBar holds the filter buttons (mobile + desktop) so the filters panel
   can slide down below the bar instead of overlapping the buttons. */
const ControlsBar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 12px;
  /* keep enough height for the buttons */
  min-height: 56px;
  margin-bottom: 8px;
`;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters[FILTER_CATEGORIES.TYPE].size, selectedFilters[FILTER_CATEGORIES.COLOR].size]);

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
    <PageWrapper>
      <PageHeader 
        imageSrc="/images/realizations/top.jpg" 
        id="realizations-header" 
        title={t('realizationsPage.title')} 
      />

      <Content>

        <AnimatePresence>
          {isMobilePanelOpen && (
            <MobilePanel 
              ref={mobilePanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <MobileHeader>
                <FilterHeading id="mobile-filters-title">
                  {t('realizationsPage.filters.filtersTitle')}
                </FilterHeading>
                <MobileCloseButton 
                  onClick={() => setIsMobilePanelOpen(false)} 
                  aria-label={t('realizationsPage.filters.close')}
                >
                  <FiX />
                </MobileCloseButton>
              </MobileHeader>

              <MobileFilters>
                <FilterWrapper>
                  <FilterControl 
                    onClick={(e) => toggleDropdown('doors', e)} 
                    aria-expanded={dropdownsOpen.doors}
                  >
                    <LabelBlock>
                      <FilterHeading>{t('realizationsPage.filters.doors')}</FilterHeading>
                    </LabelBlock>
                    {dropdownsOpen.doors ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {dropdownsOpen.doors && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {doorTypes.map(type => (
                          <OptionRow key={type} onClick={(e) => e.stopPropagation()}>
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
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </FilterWrapper>

                <FilterWrapper>
                  <FilterControl 
                    onClick={(e) => toggleDropdown('windows', e)} 
                    aria-expanded={dropdownsOpen.windows}
                  >
                    <LabelBlock>
                      <FilterHeading>{t('realizationsPage.filters.windows')}</FilterHeading>
                    </LabelBlock>
                    {dropdownsOpen.windows ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {dropdownsOpen.windows && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {windowTypes.map(type => (
                          <OptionRow key={type} onClick={(e) => e.stopPropagation()}>
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
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </FilterWrapper>

                <FilterWrapper>
                  <FilterControl 
                    onClick={(e) => toggleDropdown('color', e)} 
                    aria-expanded={dropdownsOpen.color}
                  >
                    <LabelBlock>
                      <FilterHeading>{t('realizationsPage.filters.color')}</FilterHeading>
                    </LabelBlock>
                    {dropdownsOpen.color ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {dropdownsOpen.color && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {colorOptions.map(color => (
                          <OptionRow key={color} onClick={(e) => e.stopPropagation()}>
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
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </FilterWrapper>
              </MobileFilters>

              <MobileFooter>
                <MobileAction onClick={clearMobileFilters}>
                  {t('realizationsPage.filters.clear')}
                </MobileAction>
                <MobileAction primary onClick={applyMobileFilters}>
                  {t('realizationsPage.filters.apply')}
                </MobileAction>
              </MobileFooter>
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
        <ResultsTop>

          <ControlsBar>
            {!isMobilePanelOpen && (
              <ResultsCount style={{ marginRight: 'auto' }}>
                {t('realizationsPage.results.found', { count: filteredRealizations.length })}
              </ResultsCount>
            )}
            <MobileFiltersButton 
              ref={mobileButtonRef} 
              onClick={openMobilePanel} 
              aria-label={t('realizationsPage.filters.filtersTitle')}
            >
              <FiFilter />
            </MobileFiltersButton>

                <DesktopFiltersButton
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
                </DesktopFiltersButton>
              </ControlsBar>
            </ResultsTop>

            {isDesktopFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{ overflow: 'visible' }}
              >
                <FiltersRow>
          <DropdownsGroup>
            <FilterWrapper ref={doorsRef}>
              <FilterControl 
                onClick={(e) => toggleDropdown('doors', e)} 
                aria-expanded={dropdownsOpen.doors} 
                aria-haspopup="menu"
              >
                <LabelBlock>
                  <FilterHeading>{t('realizationsPage.filters.doors')}</FilterHeading>
                </LabelBlock>
                {dropdownsOpen.doors ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {dropdownsOpen.doors && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {doorTypes.map(type => (
                      <OptionRow key={type} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.TYPE].has(type)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.TYPE, type, e)}
                        />
                        <span>{getTranslatedProductType(type)}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </FilterWrapper>

            <FilterWrapper ref={windowsRef}>
              <FilterControl 
                onClick={(e) => toggleDropdown('windows', e)} 
                aria-expanded={dropdownsOpen.windows} 
                aria-haspopup="menu"
              >
                <LabelBlock>
                  <FilterHeading>{t('realizationsPage.filters.windows')}</FilterHeading>
                </LabelBlock>
                {dropdownsOpen.windows ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {dropdownsOpen.windows && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {windowTypes.map(type => (
                      <OptionRow key={type} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.TYPE].has(type)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.TYPE, type, e)}
                        />
                        <span>{getTranslatedProductType(type)}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </FilterWrapper>

            <FilterWrapper ref={colorRef}>
              <FilterControl 
                onClick={(e) => toggleDropdown('color', e)} 
                aria-expanded={dropdownsOpen.color} 
                aria-haspopup="menu"
              >
                <LabelBlock>
                  <FilterHeading>{t('realizationsPage.filters.color')}</FilterHeading>
                </LabelBlock>
                {dropdownsOpen.color ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {dropdownsOpen.color && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {colorOptions.map(color => (
                      <OptionRow key={color} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[FILTER_CATEGORIES.COLOR].has(color)}
                          onChange={(e) => toggleFilter(FILTER_CATEGORIES.COLOR, color, e)}
                        />
                        <span>{getTranslatedColor(color)}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </FilterWrapper>
          </DropdownsGroup>

          <div style={{ marginLeft: '12px', alignSelf: 'center' }}>
            <ClearButton onClick={clearAllFilters}>
              <FiX style={{ transform: 'translateY(2px)' }} />
              {t('realizationsPage.filters.clear')}
            </ClearButton>
          </div>
                </FiltersRow>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div id="realizations-grid">
          <Grid>
            {currentPageItems.map(({ id, src, title, tags }) => (
              <div key={id}>
                <RealizationCard id={id} src={src} title={title} tags={tags} />
              </div>
            ))}
          </Grid>
        </div>

        {filteredRealizations.length === 0 && (
          <NoResults>
            <h3>{t('realizationsPage.results.noResults')}</h3>
            <p>{t('realizationsPage.results.noResultsMessage')}</p>
          </NoResults>
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
      </Content>
    </PageWrapper>
  );
};

export default RealizationsPage;
