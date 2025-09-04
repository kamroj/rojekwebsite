import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RealizationCard from '../components/gallery/RealizationCard';
import Pagination from '../components/common/Pagination';
import PageHeader from '../components/common/PageHeader';

const PAGE_SIZE = 6;

// Labels / example data
const LABELS = {
  produkt: { drzwi: 'Drzwi', okna: 'Okna' },
  typ: {
    drzwi_wewnetrzne: 'Wewnętrzne',
    drzwi_zewnetrzne: 'Zewnętrzne',
    okna_drewno: 'Drewno',
    okna_drewno_alu: 'Drewno-Alu',
    okna_pvc: 'PVC',
  },
  kolor: { ral9017: 'RAL 9017', ral7016: 'RAL 7016', ral9016: 'RAL 9016' },
};

const exampleRealizations = [
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Drzwi zewnętrzne 1', tags: { produkt: 'drzwi', typ: 'drzwi_zewnetrzne', kolor: 'ral7016' } },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Drzwi wewnętrzne 1', tags: { produkt: 'drzwi', typ: 'drzwi_wewnetrzne', kolor: 'ral9016' } },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Okno drewniane 1', tags: { produkt: 'okna', typ: 'okna_drewno', kolor: 'ral9017' } },
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Okno PVC 1', tags: { produkt: 'okna', typ: 'okna_pvc', kolor: 'ral7016' } },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Drzwi wewnętrzne 2', tags: { produkt: 'drzwi', typ: 'drzwi_wewnetrzne', kolor: 'ral7016' } },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Okno drewno-alu 1', tags: { produkt: 'okna', typ: 'okna_drewno_alu', kolor: 'ral9016' } },
];

// ============ Styles ============
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

  /* hide desktop filters on small screens - mobile will use the icon + panel */
  @media (max-width: 720px) {
    display: none;
  }
`;

/* group holding the three dropdowns; will take remaining width and space items evenly */
const DropdownsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 18px;
`;

/* Search input gets larger flex so it won't be squeezed */


const SmallFilterWrapper = styled.div`
  flex: 0 0 180px;
  max-width: 180px;
  min-width: 140px;
  position: relative;
  box-sizing: border-box;

  /* On mobile panels make wrappers slightly narrower and centered */
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
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  background:#fff;
  border:1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
  border-radius:8px;
  padding:10px 12px;
  cursor:pointer;
  box-sizing: border-box;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme?.colors?.accent || '#017e54'};
    box-shadow: 0 3px 12px rgba(1, 126, 84, 0.15);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme?.colors?.accent || '#017e54'};
    outline-offset: 2px;
  }
`;

const LabelBlock = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
`;

const Heading = styled.span`
  font-weight:600;
  font-size: 1.05rem;
  color: ${({ theme }) => theme?.colors?.text || '#222'};

  /* slightly larger headers on small screens for readability */
  @media (max-width: 720px) {
    font-size: 1.12rem;
  }
`;

const Sub = styled.span`
  font-size:0.82rem;
  color: ${({ theme }) => theme?.colors?.textMuted || '#666'};
  margin-top:1px;
`;

const DropdownPanel = styled.div`
  position:absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  width: auto;
  background:#fff;
  border:1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
  border-radius:10px;
  box-shadow:0 8px 18px rgba(0,0,0,0.07);
  z-index: 10;
  padding:6px;
  box-sizing: border-box;

  /* On mobile we render dropdown content inline inside the mobile panel as a boxed, scrollable list */
  @media (max-width: 720px) {
    /* Keep dropdown aligned with control on mobile - use same width calculation */
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border: 1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
    border-radius: 8px;
    padding: 0;
    background: #fff;
    display: block;
    box-sizing: border-box;
    z-index: 60;
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
  
  /* Custom scrollbar styling */
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
    /* compact, boxed list for mobile: limit height so it becomes scrollable */
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    box-sizing: border-box;
    gap: 0;

    /* remove extra inner padding on the list so the panel border and the
       option rows can align exactly with the control's inner content */
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    box-shadow: none;
  }
`;

const OptionRow = styled.label`
  display:flex;
  gap:10px;
  align-items:center;
  padding:12px 12px; /* full-bleed padding so text aligns with control edges on desktop */
  border-radius:6px;
  cursor:pointer;
  width: 100%;
  box-sizing: border-box;
  &:hover { background:#f5f7f9; }

  /* smaller checkboxes and consistent spacing */
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    margin-right: 10px;
    transform: none;
    accent-color: ${({ theme }) => theme?.colors?.accent || '#017e54'};
    flex-shrink: 0;
    cursor: pointer;
    
    /* Custom checkbox styling for better browser support */
    &:checked {
      background-color: ${({ theme }) => theme?.colors?.accent || '#017e54'};
      border-color: ${({ theme }) => theme?.colors?.accent || '#017e54'};
    }
    
    &:hover {
      border-color: ${({ theme }) => theme?.colors?.accent || '#017e54'};
    }
  }

  span {
    font-size: 0.95rem;
    flex: 1;
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    /* match option row padding to FilterControl inner padding so text aligns */
    padding: 12px;
    border-radius: 0;
    width: 100%;
    
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
    }

    &:hover { 
      background:#f5f7f9; 
    }
  }

  @media (max-width: 420px) {
    input[type="checkbox"] {
      width: 12px;
      height: 12px;
    }
    span { font-size: 0.95rem; }
  }
`;

const ResultsTop = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin: 8px 0 16px;
`;

const ResultsCount = styled.div`
  font-weight:600;
`;

const Grid = styled.div`
  display:grid;
  gap:18px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const NoResults = styled.div`
  padding:30px;
  text-align:center;
  background:#fff;
  border:1px solid #eee;
  border-radius:8px;
  margin-top:20px;
`;

/* Small screens: stack filters vertically to avoid overlap */
const ResponsiveHint = styled.div`
  @media (max-width: 640px) {
    ${FiltersRow} {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

/* Mobile filter button (top-right) */
const MobileFiltersButton = styled.button`
  all: unset;
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  cursor: pointer;
  svg { width: 18px; height: 18px; color: ${({ theme }) => theme?.colors?.text || '#222'}; }

  @media (max-width: 720px) {
    display: flex;
  }
`;

/* Mobile panel that slides down with filters stacked */
const MobilePanel = styled(motion.div)`
  /* full-screen mobile overlay */
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  background: #fff;
  border: none;
  border-radius: 0;
  box-shadow: none;
  z-index: 9999;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* prevent horizontal scroll */
  touch-action: pan-y; /* prefer vertical scrolling only */
  overscroll-behavior-x: contain;
  box-sizing: border-box;
`;

/* Mobile panel header with close */
const MobileHeader = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e6e6e6'};
`;

const MobileCloseButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius: 8px;
`;

const MobileFooter = styled.div`
  display:flex;
  gap:12px;
  padding: 12px;
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
  border: 1px solid ${({ primary, theme }) => primary ? (theme?.colors?.accent || '#017e54') : (theme?.colors?.border || '#e6e6e6')};
  color: ${({ primary, theme }) => primary ? '#fff' : (theme?.colors?.text || '#222')};
  background: ${({ primary, theme }) => primary ? (theme?.colors?.accent || '#017e54') : 'transparent'};
`;

/* Mobile stacked filters inside panel (scrollable body) */
const MobileFilters = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  box-sizing: border-box;

  /* child wrappers control their own width and are centered */
  ${SmallFilterWrapper} {
    margin: 8px 0;
  }
`;

// ================= Component =================
const RealizationsPage = () => {
  const drzwiTypes = useMemo(() => ['drzwi_wewnetrzne', 'drzwi_zewnetrzne'], []);
  const oknaTypes = useMemo(() => ['okna_drewno', 'okna_drewno_alu', 'okna_pvc'], []);
  const kolorOptions = useMemo(() => [...new Set(exampleRealizations.map(r => r.tags.kolor))], []);

  const [open, setOpen] = useState({ drzwi: false, okna: false, kolor: false });
  const [selected, setSelected] = useState({ typ: new Set(), kolor: new Set() });
  const [currentPage, setCurrentPage] = useState(1);

  const drzwiRef = useRef();
  const oknaRef = useRef();
  const kolorRef = useRef();
  const mobileRef = useRef();
  const mobilePanelRef = useRef();
  const [mobileOpen, setMobileOpen] = useState(false);

  // mobile temporary state for "Zastosuj" flow
  const [mobileTemp, setMobileTemp] = useState(null);

  const openMobilePanel = () => {
    setMobileTemp({
      typ: new Set([...selected.typ]),
      kolor: new Set([...selected.kolor]),
    });
    setMobileOpen(true);
  };

  const closeMobilePanel = () => {
    setMobileOpen(false);
    setMobileTemp(null);
  };

  const mobileToggleSelect = (group, value) => {
    setMobileTemp(prev => {
      if (!prev) return prev;
      const next = { typ: new Set(prev.typ), kolor: new Set(prev.kolor) };
      if (next[group].has(value)) next[group].delete(value);
      else next[group].add(value);
      return next;
    });
  };

  const mobileClear = () => {
    setMobileTemp({ typ: new Set(), kolor: new Set() });
  };

  const applyMobile = () => {
    if (mobileTemp) {
      setSelected({ typ: new Set([...mobileTemp.typ]), kolor: new Set([...mobileTemp.kolor]) });
    }
    closeMobilePanel();
  };

  const toggleOpen = (k) => setOpen(p => ({ ...p, [k]: !p[k] }));
  const closeAll = () => setOpen({ drzwi: false, okna: false, kolor: false });

  const toggleSelect = (group, value) => {
    setSelected(prev => {
      const next = new Set(prev[group]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [group]: next };
    });
    setCurrentPage(1);
  };

  const clearAll = () => {
    setSelected({ typ: new Set(), kolor: new Set() });
    setCurrentPage(1);
  };

  // filter logic: title search + typ + kolor
  const filteredRealizations = useMemo(() => {
    const hasAny = (s) => s && s.size > 0;
    return exampleRealizations.filter(item => {
      const { produkt, typ, kolor } = item.tags;
      if (hasAny(selected.typ) && !selected.typ.has(typ)) return false;
      if (hasAny(selected.kolor) && !selected.kolor.has(kolor)) return false;
      return true;
    });
  }, [selected]);

  const totalPages = Math.ceil(filteredRealizations.length / PAGE_SIZE);
  const currentItems = filteredRealizations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => setCurrentPage(1), [selected.typ.size, selected.kolor.size]);

  // Close dropdowns when clicking outside or pressing Escape; handle mobile panel and resize
  useEffect(() => {
    const onDoc = (e) => {
      const targets = [drzwiRef.current, oknaRef.current, kolorRef.current, mobileRef.current, mobilePanelRef.current];
      if (targets.every(ref => !ref || !ref.contains(e.target))) {
        closeAll();
        // close mobile panel if open and clicked outside
        setMobileOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') { closeAll(); setMobileOpen(false); } };
    const onResize = () => {
      // ensure desktop dropdowns closed on small screens and mobile panel closed on large screens
      if (window.innerWidth <= 720) {
        closeAll();
      } else {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileRef]);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverflowX = document.documentElement.style.overflowX;

    if (mobileOpen) {
      // lock scrolling in both axes on html/body to avoid horizontal panning
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overflowX = 'hidden';

      // focus first focusable element inside panel for accessibility
      setTimeout(() => {
        mobilePanelRef.current?.querySelector('input,button,select,textarea,a')?.focus();
      }, 0);
    } else {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
    };
  }, [mobileOpen]);

  // helper for counts
  const countText = (set) => set.size > 0 ? `(${set.size})` : '';

  return (
    <PageWrapper>
      <PageHeader imageSrc="/images/realizations/top.jpg" id="realizations-header" title="Realizacje" />

      <Content>
        <MobileFiltersButton ref={mobileRef} onClick={openMobilePanel} aria-label="Filtry">
          <FiFilter />
        </MobileFiltersButton>

        <FiltersRow>
          <DropdownsGroup>
            <SmallFilterWrapper ref={drzwiRef}>
              <FilterControl onClick={() => toggleOpen('drzwi')} aria-expanded={open.drzwi} aria-haspopup="menu">
                <LabelBlock>
                  <Heading>Drzwi</Heading>
                </LabelBlock>
                {open.drzwi ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {open.drzwi && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {drzwiTypes.map(opt => (
                      <OptionRow key={opt}>
                        <input
                          type="checkbox"
                          checked={selected.typ.has(opt)}
                          onChange={() => toggleSelect('typ', opt)}
                        />
                        <span>{LABELS.typ[opt]}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </SmallFilterWrapper>

            <SmallFilterWrapper ref={oknaRef}>
              <FilterControl onClick={() => toggleOpen('okna')} aria-expanded={open.okna} aria-haspopup="menu">
                <LabelBlock>
                  <Heading>Okna</Heading>
                </LabelBlock>
                {open.okna ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {open.okna && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {oknaTypes.map(opt => (
                      <OptionRow key={opt}>
                        <input
                          type="checkbox"
                          checked={selected.typ.has(opt)}
                          onChange={() => toggleSelect('typ', opt)}
                        />
                        <span>{LABELS.typ[opt]}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </SmallFilterWrapper>

            <SmallFilterWrapper ref={kolorRef}>
              <FilterControl onClick={() => toggleOpen('kolor')} aria-expanded={open.kolor} aria-haspopup="menu">
                <LabelBlock>
                  <Heading>Kolor</Heading>
                </LabelBlock>
                {open.kolor ? <FiChevronUp /> : <FiChevronDown />}
              </FilterControl>

              {open.kolor && (
                <DropdownPanel role="menu">
                  <OptionList>
                    {kolorOptions.map(opt => (
                      <OptionRow key={opt}>
                        <input
                          type="checkbox"
                          checked={selected.kolor.has(opt)}
                          onChange={() => toggleSelect('kolor', opt)}
                        />
                        <span>{LABELS.kolor[opt] || opt}</span>
                      </OptionRow>
                    ))}
                  </OptionList>
                </DropdownPanel>
              )}
            </SmallFilterWrapper>
          </DropdownsGroup>

          <div style={{ marginLeft: '12px', alignSelf: 'center' }}>
            <button onClick={clearAll} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>
              <FiX style={{ transform: 'translateY(2px)', marginRight: 6 }} /> Wyczyść
            </button>
          </div>
        </FiltersRow>

        <AnimatePresence>
          {mobileOpen && (
            <MobilePanel ref={mobilePanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <MobileHeader>
                <Heading id="mobile-filters-title">Filtry</Heading>
                <MobileCloseButton onClick={() => setMobileOpen(false)} aria-label="Zamknij">
                  <FiX />
                </MobileCloseButton>
              </MobileHeader>
              <MobileFilters>
                <SmallFilterWrapper>
                  <FilterControl onClick={() => toggleOpen('drzwi')} aria-expanded={open.drzwi}>
                    <LabelBlock><Heading>Drzwi</Heading></LabelBlock>
                    {open.drzwi ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {open.drzwi && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {drzwiTypes.map(opt => (
                          <OptionRow key={opt}>
                            <input
                              type="checkbox"
                              checked={mobileTemp ? mobileTemp.typ.has(opt) : selected.typ.has(opt)}
                              onChange={() => mobileTemp ? mobileToggleSelect('typ', opt) : toggleSelect('typ', opt)}
                            />
                            <span>{LABELS.typ[opt]}</span>
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </SmallFilterWrapper>

                <SmallFilterWrapper>
                  <FilterControl onClick={() => toggleOpen('okna')} aria-expanded={open.okna}>
                    <LabelBlock><Heading>Okna</Heading></LabelBlock>
                    {open.okna ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {open.okna && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {oknaTypes.map(opt => (
                          <OptionRow key={opt}>
                            <input
                              type="checkbox"
                              checked={mobileTemp ? mobileTemp.typ.has(opt) : selected.typ.has(opt)}
                              onChange={() => mobileTemp ? mobileToggleSelect('typ', opt) : toggleSelect('typ', opt)}
                            />
                            <span>{LABELS.typ[opt]}</span>
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </SmallFilterWrapper>

                <SmallFilterWrapper>
                  <FilterControl onClick={() => toggleOpen('kolor')} aria-expanded={open.kolor}>
                    <LabelBlock><Heading>Kolor</Heading></LabelBlock>
                    {open.kolor ? <FiChevronUp /> : <FiChevronDown />}
                  </FilterControl>
                  {open.kolor && (
                    <DropdownPanel role="menu">
                      <OptionList>
                        {kolorOptions.map(opt => (
                          <OptionRow key={opt}>
                            <input
                              type="checkbox"
                              checked={mobileTemp ? mobileTemp.kolor.has(opt) : selected.kolor.has(opt)}
                              onChange={() => mobileTemp ? mobileToggleSelect('kolor', opt) : toggleSelect('kolor', opt)}
                            />
                            <span>{LABELS.kolor[opt] || opt}</span>
                          </OptionRow>
                        ))}
                      </OptionList>
                    </DropdownPanel>
                  )}
                </SmallFilterWrapper>

              </MobileFilters>
              <MobileFooter>
                <MobileAction onClick={() => { mobileClear(); }} style={{ borderColor: 'transparent' }}>Wyczyść</MobileAction>
                <MobileAction primary onClick={applyMobile}>Zastosuj</MobileAction>
              </MobileFooter>
            </MobilePanel>
          )}
        </AnimatePresence>

        <ResultsTop>
          <ResultsCount>Znaleziono {filteredRealizations.length} realizacji</ResultsCount>
        </ResultsTop>

        <div id="realizations-grid">
          <Grid>
            {currentItems.map(({ id, src, title, tags }) => (
              <div key={id}>
                <RealizationCard id={id} src={src} title={title} tags={tags} />
              </div>
            ))}
          </Grid>
        </div>

        {filteredRealizations.length === 0 && (
          <NoResults>
            <h3>Brak wyników</h3>
            <p>Nie znaleziono realizacji dla wybranych filtrów.</p>
          </NoResults>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setCurrentPage(p);
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
