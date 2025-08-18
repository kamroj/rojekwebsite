import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import RealizationCard from '../components/gallery/RealizationCard';
import Pagination from '../components/common/Pagination';

const PAGE_SIZE = 6;

// Typy i kategorie
const CATEGORIES = {
  ALL: 'all',
  DOORS: 'doors',
  WINDOWS: 'windows'
};

const SUBCATEGORIES = {
  DOORS_INTERIOR: 'doors_interior',
  DOORS_EXTERIOR: 'doors_exterior',
  WINDOWS_WOOD: 'windows_wood',
  WINDOWS_WOOD_ALU: 'windows_wood_alu',
  WINDOWS_PVC: 'windows_pvc'
};

// Mock data z kategoryzacją
const exampleRealizations = [
  // Drzwi zewnętrzne
  { id: 1, src: '/images/realizations/realization1.jpg', title: 'Drzwi zewnętrzne 1', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_EXTERIOR },
  { id: 2, src: '/images/realizations/realization2.jpg', title: 'Drzwi zewnętrzne 2', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_EXTERIOR },
  { id: 3, src: '/images/realizations/realization3.jpg', title: 'Drzwi zewnętrzne 3', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_EXTERIOR },
  
  // Drzwi wewnętrzne
  { id: 4, src: '/images/realizations/realization4.jpg', title: 'Drzwi wewnętrzne 1', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_INTERIOR },
  { id: 5, src: '/images/realizations/realization5.jpg', title: 'Drzwi wewnętrzne 2', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_INTERIOR },
  { id: 6, src: '/images/realizations/realization6.jpg', title: 'Drzwi wewnętrzne 3', category: CATEGORIES.DOORS, subcategory: SUBCATEGORIES.DOORS_INTERIOR },
  
  // Okna drewniane
  { id: 7, src: '/images/realizations/realization7.jpg', title: 'Okna drewniane 1', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD },
  { id: 8, src: '/images/realizations/realization8.jpg', title: 'Okna drewniane 2', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD },
  { id: 9, src: '/images/realizations/realization1.jpg', title: 'Okna drewniane 3', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD },
  
  // Okna drewno-aluminium
  { id: 10, src: '/images/realizations/realization2.jpg', title: 'Okna drewno-alu 1', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD_ALU },
  { id: 11, src: '/images/realizations/realization3.jpg', title: 'Okna drewno-alu 2', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD_ALU },
  { id: 12, src: '/images/realizations/realization4.jpg', title: 'Okna drewno-alu 3', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_WOOD_ALU },
  
  // Okna PVC
  { id: 13, src: '/images/realizations/realization5.jpg', title: 'Okna PVC 1', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_PVC },
  { id: 14, src: '/images/realizations/realization6.jpg', title: 'Okna PVC 2', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_PVC },
  { id: 15, src: '/images/realizations/realization7.jpg', title: 'Okna PVC 3', category: CATEGORIES.WINDOWS, subcategory: SUBCATEGORIES.WINDOWS_PVC },
];

const PageWrapper = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
`;

const HeaderImageWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 400px;
  margin-bottom: 40px;
  overflow: hidden;
  border-radius: 0;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgb(0 0 0 / 65%);
    pointer-events: none;
    z-index: 1;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 0;
`;

const HeaderTitle = styled.h1`
  position: absolute;
  bottom: 15px;
  right: 20px;
  margin: 0;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.bottleGreen}cc;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 2.5rem;
  font-weight: 100;
  border-radius: 6px;
  user-select: none;
  z-index: 2;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 3rem;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FiltersContainer = styled.div`
  width: 250px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: var(--header-offset, 80px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    position: static;
    order: -1;
    padding: 1.5rem;
  }
`;

const MobileFiltersHeader = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.8rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 0.8rem;
    
    h3 {
      font-size: 1.6rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.bottleGreen};
      margin: 0;
    }
    
    .icon {
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.bottleGreen};
      transition: transform ${({ theme }) => theme.transitions.default};
      transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    }
  }
`;

const MobileFiltersContent = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: ${({ isOpen }) => isOpen ? '1000px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bottleGreen};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.bottleGreen : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.textLight : theme.colors.text};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.bottleGreen : theme.colors.border};
  border-radius: 4px;
  font-size: 1.4rem;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.bottleGreen : theme.colors.bottleGreenLight};
    color: ${({ theme }) => theme.colors.textLight};
    border-color: ${({ theme }) => theme.colors.bottleGreenLight};
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.7rem 0.8rem;
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }
`;

const SubcategoryButton = styled(FilterButton)`
  margin-left: 1rem;
  font-size: 1.3rem;
  padding: 0.6rem 0.8rem;
  border-style: dashed;
  border-width: 1px;
  opacity: ${({ parentActive }) => parentActive ? 1 : 0.6};
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0.8rem;
    font-size: 1.2rem;
    padding: 0.5rem 0.7rem;
    margin-bottom: 0.3rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  width: 100%;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ResultsCount = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterTag = styled.span`
  background-color: ${({ theme }) => theme.colors.bottleGreenLight};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 0 3rem 0;
    padding: 0 2rem;
  }
`;

const FixedSizeCardWrapper = styled.div`
  width: 100%;
  height: 350px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    height: 300px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textMuted};

  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 1.6rem;
    line-height: 1.6;
  }
`;

const RealizationsPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filtrowanie realizacji
  const filteredRealizations = useMemo(() => {
    let filtered = exampleRealizations;

    if (selectedCategory !== CATEGORIES.ALL) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
    }

    return filtered;
  }, [selectedCategory, selectedSubcategory]);

  // Paginacja
  const totalPages = Math.ceil(filteredRealizations.length / PAGE_SIZE);
  const currentItems = filteredRealizations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset strony przy zmianie filtrów
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const mobileFiltersIconRotation = isMobileFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)';

  const getActiveFilterName = () => {
    if (selectedSubcategory) {
      const subcategoryNames = {
        [SUBCATEGORIES.DOORS_INTERIOR]: 'Drzwi wewnętrzne',
        [SUBCATEGORIES.DOORS_EXTERIOR]: 'Drzwi zewnętrzne',
        [SUBCATEGORIES.WINDOWS_WOOD]: 'Okna drewniane',
        [SUBCATEGORIES.WINDOWS_WOOD_ALU]: 'Okna drewno-alu',
        [SUBCATEGORIES.WINDOWS_PVC]: 'Okna PVC'
      };
      return subcategoryNames[selectedSubcategory];
    }

    if (selectedCategory !== CATEGORIES.ALL) {
      const categoryNames = {
        [CATEGORIES.DOORS]: 'Drzwi',
        [CATEGORIES.WINDOWS]: 'Okna'
      };
      return categoryNames[selectedCategory];
    }

    return null;
  };

  const handlePageChange = (page, options = {}) => {
    // update page
    setCurrentPage(page);

    // schedule scroll in next tick to ensure consistent behavior
    // regardless of whether caller was arrow or number button
    setTimeout(() => {
      // unified scroll behavior: scroll so content starts just after header image
      const headerEl = document.querySelector('#realizations-header');
      if (headerEl) {
        const headerRect = headerEl.getBoundingClientRect();
        const headerBottom = headerRect.top + window.pageYOffset + headerEl.offsetHeight;
        const headerOffsetStr = getComputedStyle(document.documentElement).getPropertyValue('--header-offset');
        const headerOffset = headerOffsetStr ? parseFloat(headerOffsetStr) : 80;
        const scrollTarget = Math.max(0, headerBottom - headerOffset);
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        return;
      }

      // Fallback: scroll to grid top if header not found
      const gridElement = document.querySelector('#realizations-grid');
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <PageWrapper>
      <HeaderImageWrapper id="realizations-header">
        <HeaderImage src="/images/realizations/top.jpg" alt="Realizations Header" />
        <HeaderTitle>Realizacje</HeaderTitle>
      </HeaderImageWrapper>
      
      <ContentWrapper>
        <FiltersContainer>
          <MobileFiltersHeader 
            isOpen={isMobileFiltersOpen} 
            onClick={toggleMobileFilters}
          >
            <h3>Filtry</h3>
            <div>
              {isMobileFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
              {console.log(isMobileFiltersOpen)}
            </div>
          </MobileFiltersHeader>
          
          <MobileFiltersContent isOpen={isMobileFiltersOpen}>
            <FilterSection>
              <FilterTitle>Kategorie</FilterTitle>
              
              <FilterButton
                active={selectedCategory === CATEGORIES.ALL}
                onClick={() => handleCategorySelect(CATEGORIES.ALL)}
              >
                Wszystko
              </FilterButton>
              
              <FilterButton
                active={selectedCategory === CATEGORIES.DOORS}
                onClick={() => handleCategorySelect(CATEGORIES.DOORS)}
              >
                Drzwi
              </FilterButton>
              
              <SubcategoryButton
                active={selectedSubcategory === SUBCATEGORIES.DOORS_INTERIOR}
                parentActive={selectedCategory === CATEGORIES.DOORS}
                onClick={() => { handleCategorySelect(CATEGORIES.DOORS); handleSubcategorySelect(SUBCATEGORIES.DOORS_INTERIOR); }}
              >
                Wewnętrzne
              </SubcategoryButton>
              
              <SubcategoryButton
                active={selectedSubcategory === SUBCATEGORIES.DOORS_EXTERIOR}
                parentActive={selectedCategory === CATEGORIES.DOORS}
                onClick={() => { handleCategorySelect(CATEGORIES.DOORS); handleSubcategorySelect(SUBCATEGORIES.DOORS_EXTERIOR); }}
              >
                Zewnętrzne
              </SubcategoryButton>
              
              <FilterButton
                active={selectedCategory === CATEGORIES.WINDOWS}
                onClick={() => handleCategorySelect(CATEGORIES.WINDOWS)}
              >
                Okna
              </FilterButton>
              
              <SubcategoryButton
                active={selectedSubcategory === SUBCATEGORIES.WINDOWS_WOOD}
                parentActive={selectedCategory === CATEGORIES.WINDOWS}
                onClick={() => { handleCategorySelect(CATEGORIES.WINDOWS); handleSubcategorySelect(SUBCATEGORIES.WINDOWS_WOOD); }}
              >
                Drewno
              </SubcategoryButton>
              
              <SubcategoryButton
                active={selectedSubcategory === SUBCATEGORIES.WINDOWS_WOOD_ALU}
                parentActive={selectedCategory === CATEGORIES.WINDOWS}
                onClick={() => { handleCategorySelect(CATEGORIES.WINDOWS); handleSubcategorySelect(SUBCATEGORIES.WINDOWS_WOOD_ALU); }}
              >
                Drewno-Alu
              </SubcategoryButton>
              
              <SubcategoryButton
                active={selectedSubcategory === SUBCATEGORIES.WINDOWS_PVC}
                parentActive={selectedCategory === CATEGORIES.WINDOWS}
                onClick={() => { handleCategorySelect(CATEGORIES.WINDOWS); handleSubcategorySelect(SUBCATEGORIES.WINDOWS_PVC); }}
              >
                PVC
              </SubcategoryButton>
            </FilterSection>
          </MobileFiltersContent>
        </FiltersContainer>

        <MainContent>
          <ResultsHeader>
            <ResultsCount>
              Znaleziono {filteredRealizations.length} realizacji
            </ResultsCount>
            
            {getActiveFilterName() && (
              <ActiveFilters>
                <FilterTag>{getActiveFilterName()}</FilterTag>
              </ActiveFilters>
            )}
          </ResultsHeader>

          {currentItems.length > 0 ? (
            <>
              <Grid id="realizations-grid">
                {currentItems.map(({ id, src, title }) => (
                  <FixedSizeCardWrapper key={id}>
                    <RealizationCard id={id} src={src} title={title} />
                  </FixedSizeCardWrapper>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <NoResults>
              <h3>Brak wyników</h3>
              <p>
                Nie znaleziono realizacji dla wybranej kategorii. 
                Spróbuj wybrać inną kategorię lub usuń filtry.
              </p>
            </NoResults>
          )}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default RealizationsPage;
