import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../components/common/PageHeader';
import MaxWidthContainer from '../components/common/MaxWidthContainer';
import { t } from 'i18next';
import Select from 'react-select';

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

const RealizationBorderRadius = '6px';

const SingleRealizationContainer = styled.div`
  height: 350px;
  width: 100%;          
  max-width: 420px;       
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  border-radius: ${RealizationBorderRadius};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
  }
`;

const RealizationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${RealizationBorderRadius};
  &:hover {
    transform: scale(1.06);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  &:not(:hover) {
    transition: transform 0.3s ease;
    transform: scale(1);
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
        img: "/images/realizations/realization5.jpg",
        tags: {
            door: ["interior"],
            window: ["wooden"],
            color: ["ral6005"]
        },
    }
];

export default function RealizationsPage2() {
    const options = useMemo(() => {
        const seen = new Set();
        const acc = [];
        let id = 1;

        REALIZATIONS_DATA.forEach(item => {
            Object.entries(item.tags).forEach(([group, values]) => {
                values.forEach(val => {
                    const key = `${group}__${val}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        acc.push({ id: id++, label: val, value: val, group });
                    }
                });
            });
        });

        acc.sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label));
        return acc;
    }, []);

    const groupedOptions = useMemo(() => {
        const groups = new Map();
        options.forEach(opt => {
            if (!groups.has(opt.group)) groups.set(opt.group, []);
            groups.get(opt.group).push(opt);
        });
        return Array.from(groups.entries()).map(([label, opts]) => ({ label, options: opts }));
    }, [options]);

    const [selected, setSelected] = useState([]);

    const selectedMap = useMemo(() => {
        const m = new Map();
        selected.forEach(opt => {
            if (!m.has(opt.group)) m.set(opt.group, new Set());
            m.get(opt.group).add(opt.value);
        });
        return m;
    }, [selected]);

    const filtered = useMemo(() => {
        if (selected.length === 0) return REALIZATIONS_DATA;

        return REALIZATIONS_DATA.filter(item => {
            for (const [group, wantedSet] of selectedMap.entries()) {
                const vals = item.tags[group] || [];
                const hasAny = vals.some(v => wantedSet.has(v));
                if (!hasAny) return false;
            }
            return true;
        });
    }, [selected, selectedMap]);

    return (
        <PageWrapper>
            <PageHeader
                imageSrc="/images/realizations/top.jpg"
                id="realizations-header"
                title={t('realizationsPage.title')}
            />

            <MaxWidthContainer>
                <FilterContainer>
                    <FilterCounter>Znaleziono {filtered.length} realizacji</FilterCounter>
                    <Select
                        isMulti
                        options={groupedOptions}
                        getOptionLabel={(opt) => opt.label}
                        getOptionValue={(opt) => `${opt.group}__${opt.value}`}
                        value={selected}
                        onChange={(list) => setSelected(list || [])}
                        closeMenuOnSelect={false}
                        placeholder={t('realizationsPage.filters.filtersTitle') || 'Filtry (grupy tagów)'}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                        }}
                    />
                </FilterContainer>
            </MaxWidthContainer>

            <MaxWidthContainer>
                <RealizationsContainer>
                    {filtered.map((item, idx) => (
                        <SingleRealizationContainer key={`${item.img}-${idx}`}>
                            <RealizationImage
                                src={item.img}
                                alt={`Realization ${idx + 1}`}
                                loading="lazy"
                            />
                            <RealizationTags>
                                {Object.entries(item.tags).flatMap(([category, values]) =>
                                    values.map((val, i) => (
                                        <Tag key={`${idx}-${category}-${val}-${i}`}>
                                            {category}: {val}
                                        </Tag>
                                    ))
                                )}
                            </RealizationTags>
                        </SingleRealizationContainer>
                    ))}
                </RealizationsContainer>
            </MaxWidthContainer>
        </PageWrapper>
    );
}
