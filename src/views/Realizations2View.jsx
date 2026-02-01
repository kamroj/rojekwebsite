import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PageHeader from '../components/ui/PageHeader';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import { t } from 'i18next';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { useResponsive } from '../hooks/useResponsive';
import Page from '../components/ui/Page';

const PageWrapper = styled.div`
  width: 100%;
`;

const FilterContainer = styled.div`
  padding: 3.2rem 1.6rem 1.6rem 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .react-select-container {
    min-width: 380px;
    z-index: 5;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column-reverse;
    align-items: stretch;
    .react-select-container {
        width: 100%;
        min-width: unset;
    }
  }
`;

const FilterCounter = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
  margin-right: auto;
  font-weight: 500;
  font-size: 1.4rem;
  align-self: end;
  color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 1.2rem;
        margin: 0;
        justify-content: start;
    }
`;

const RealizationsContainer = styled.div`
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
  display: grid;
  grid-template-columns: 1fr; 
  gap: 40px; 
  align-items: stretch;
  justify-items: center; 

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr)); 
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, minmax(0, 1fr)); 
  }
`;

const REALIZATION_BORDER_RADIUS = '6px';
const ZOOM_SCALE = 1.06;
const MENU_PORTAL_Z_INDEX = 9999;

const SingleRealizationContainer = styled.div`
  height: 350px;
  width: 100%;          
  max-width: 420px;       
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  border-radius: ${REALIZATION_BORDER_RADIUS};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
  }
`;

const RealizationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${REALIZATION_BORDER_RADIUS};
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(${ZOOM_SCALE});
    cursor: pointer;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    transform: ${({ $active }) => ($active ? `scale(${ZOOM_SCALE})` : 'scale(1)')};
  }
`;

const RealizationTags = styled.div`
  position: relative;
  border-radius: 0px 0px 6px 6px;
  bottom: 30px;
  height: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background-color: rgba(1, 39, 18, 0.842);
  padding: 5px 10px;
`;

const Tag = styled.span`
  color: #fff;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.342);
  padding: 3px 8px;
  border-radius: 12px;
  white-space: nowrap;
  font-weight: 500;
  text-transform: capitalize;
`;

const StyledPaginate = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  list-style: none;
  padding: 0;

  li {
    display: inline-flex;
  }

  a {
    text-align: center;
    border-radius: 50%;

    width: 28px;
    height: 28px;
    color: #212529;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
  }

  li.selected a {
    background-color: #003f1b;
    color: ${({ theme }) => theme.colors.textLight};
  }

  li.disabled a {
    opacity: 0.5;
    cursor: default;
    border-color: #1e1e1e94;

    &:hover {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  a:hover {
    background-color: #003f1b;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const REALIZATIONS_DATA = [
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"]
    }
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"]
    }
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"]
    }
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"]
    }
  },
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"]
    }
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"]
    }
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"]
    }
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"]
    }
  },
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"]
    }
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"]
    }
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"]
    }
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"]
    }
  },
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"]
    }
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"]
    }
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"]
    }
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"]
    }
  },
  {
    img: "/images/realizations/realization5.jpg",
    tags: {
      door: ["interior"],
      window: ["wooden"],
      color: ["ral6005"]
    },
  }
];

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

export default function RealizationsPage2() {
  const tagOptions = useMemo(() => collectUniqueTagOptions(REALIZATIONS_DATA), []);

  const groupedTagOptions = useMemo(() => groupOptionsByGroup(tagOptions), [tagOptions]);

  const [selectedTags, setSelectedTags] = useState([]);

  const { isLarge, isMobile } = useResponsive();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = isLarge ? 16 : (isMobile ? 8 : 12);

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
      const headerOffset = 90;
      const elementTop = listTopRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - headerOffset, behavior: "smooth" });
    }
  };

  return (
    <Page imageSrc="/images/realizations/top.jpg" height={500} title={t('realizationsPage.title')}>
      <FilterContainer>
        <FilterCounter>{t('realizationsPage.results.found', { count: filteredRealizations.length })}</FilterCounter>
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
      </FilterContainer>
      <div ref={listTopRef} aria-hidden="true" />
      <RealizationsContainer>
        {currentItems.map((item, idx) => (
          <SingleRealizationContainer
            key={`${item.img}-${idx}`}
            ref={(el) => (cardRefs.current[idx] = el)}
          >
            <RealizationImage
              src={item.img}
              alt={`Realization ${idx + 1}`}
              loading="lazy"
              $active={idx === activeCardIndex}
            />
            <RealizationTags>
              {Object.entries(item.tags).flatMap(([category, values]) =>
                values.map((val, i) => (
                  <Tag key={`${idx}-${category}-${val}-${i}`}>
                    {t(`tags.categories.${category}`, category)}: {val}
                  </Tag>
                ))
              )}
            </RealizationTags>
          </SingleRealizationContainer>
        ))}
      </RealizationsContainer>
      {pageCount > 1 && (
        <StyledPaginate
          pageCount={pageCount}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          previousLabel="<"
          nextLabel=">"
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          renderOnZeroPageCount={null}
        />
      )}
    </Page>
  );
}
