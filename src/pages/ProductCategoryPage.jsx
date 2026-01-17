// src/pages/ProductCategoryPage.jsx
import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { RxDimensions } from "react-icons/rx";
import { TbTemperatureSun } from 'react-icons/tb';
import { RiContrastDrop2Line } from 'react-icons/ri';
import Page from '../components/common/Page';
import Section from '../components/common/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomePage';

// --- Styled Components ---

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 420px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    min-height: auto;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 1rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  background: #ffffff;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1rem 1.5rem 1rem;;
    order: 2;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1rem 1.5rem 1rem;
  }
`;

const ProductName = styled.h2`
  font-size: 5rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 1rem 0;
  letter-spacing: 0.5px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.5rem;
    margin: 0 0 0.6rem 0;
  }
`;

const ProductDescription = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
    margin: 0 0 1.2rem 0;
  }
`;

const Divider = styled.div`
  width: 30%;
  height: 1px;
  background-color: #0132068e;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1.2rem;
  }
`;

const SpecsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1.5rem;
    gap: 1rem 0;
  }
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.6rem;
    padding-right: 0;
    flex: 1 1 100%;
  }
`;

const SpecSeparator = styled.div`
  width: 1px;
  height: 45px;
  background-color: #d1d5db;
  margin-right: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const SpecIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f4f0;
  border: 1px solid #e0e5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 1.8rem;
    color: #4a7c59;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
    
    svg {
      font-size: 1.5rem;
    }
  }
`;

const SpecDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const SpecValue = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.15rem;
  }
`;

const SpecLabel = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1a5618;
  color: #ffffff;
  padding: 1rem 1.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: fit-content;
  
  &:hover {
    background-color: #033408;
  }
  
  svg {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.9rem 1.5rem;
    font-size: 1.15rem;
  }
`;

const ProductImageWrapper = styled.div`
  width: 550px;
  min-width: 550px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    min-width: 100%;
    height: auto;
    order: 1;
    min-height: 320px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 280px;
    padding: 1.5rem;
  }
`;

const ProductImage = styled.img`
  width: 100%; /* Zawsze 100% szerokości kontenera */
  height: auto; /* Wysokość dostosowuje się automatycznie */
  max-height: 100%; /* Nie przekracza wysokości kontenera */
  object-fit: contain; /* Zachowuje proporcje i mieści się w kontenerze */
  display: block;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: 280px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-height: 240px;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  text-align: center;
  padding: 4rem 0;
`;

// --- Dane produktów ---
const categoriesData = {
  okna: {
    title: 'Produkty okienne',
    subtitle: 'Poznaj nasze nowoczesne systemy okienne.',
    pageTitle: 'Okna',
    headerImage: '/images/hs/top.jpg',
    products: [
      {
        id: 'pava',
        name: 'PAVA',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        specs: {
          chambers: '70 mm',
          chambersLabel: 'grubość profilu',
          uw: 'Uw < 0,73',
          uwUnit: 'W/m²K',
          pressure: 'do 1500 Pa',
          pressureLabel: 'wodoszczelność'
        },
        image: '/images/products/windows/pilar.png'
      },
      {
        id: 'pilar',
        name: 'PILAR',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        specs: {
          chambers: '80 mm',
          chambersLabel: 'grubość profilu',
          uw: 'Uw < 0,79',
          uwUnit: 'W/m²K',
          pressure: 'do 1500 Pa',
          pressureLabel: 'wodoszczelność'
        },
        image: '/images/products/windows/pilar.png'
      },
      {
        id: 'prismatic',
        name: 'PRISMATIC',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
        specs: {
          chambers: '70 mm',
          chambersLabel: 'grubość profilu',
          uw: 'Uw < 0,79',
          uwUnit: 'W/m²K',
          pressure: 'do 1500 Pa',
          pressureLabel: 'wodoszczelność'
        },
        image: '/images/products/windows/pilar.png'
      }
    ]
  },
  drzwi: {
    title: 'Produkty drzwiowe',
    subtitle: 'Poznaj nasze nowoczesne systemy drzwiowe.',
    pageTitle: 'Drzwi',
    headerImage: '/images/products/drzwi-header.jpg',
    products: []
  },
  bramy: {
    title: 'Bramy garażowe',
    subtitle: 'Poznaj nasze nowoczesne systemy bram garażowych.',
    pageTitle: 'Bramy',
    headerImage: '/images/products/bramy-header.jpg',
    products: []
  },
  rolety: {
    title: 'Rolety i żaluzje',
    subtitle: 'Poznaj nasze nowoczesne systemy rolet i żaluzji.',
    pageTitle: 'Rolety',
    headerImage: '/images/products/rolety-header.jpg',
    products: []
  }
};

// --- Component ---
const ProductCategoryPage = () => {
  const { t } = useTranslation();
  const { category } = useParams();

  const categoryInfo = categoriesData[category];

  if (!categoryInfo) {
    return (
      <Page
        imageSrc="/images/products/default-header.jpg"
        title={t('products.notFound', 'Nie znaleziono')}
      >
        <Section>
          <HeaderWrap>
            <ProductHeader>Kategoria nie znaleziona</ProductHeader>
            <ProductHeaderSubtitle>
              Wybrana kategoria produktów nie istnieje.
            </ProductHeaderSubtitle>
          </HeaderWrap>
        </Section>
      </Page>
    );
  }

  return (
    <Page
      imageSrc={categoryInfo.headerImage}
      title={t(`pageTitle.${category}`, categoryInfo.pageTitle)}
    >
      <Section>
        <HeaderWrap>
          <ProductHeader>{categoryInfo.title}</ProductHeader>
          <ProductHeaderSubtitle>{categoryInfo.subtitle}</ProductHeaderSubtitle>
        </HeaderWrap>

        {categoryInfo.products.length > 0 ? (
          <ProductsContainer>
            {categoryInfo.products.map((product) => (
              <ProductCard key={product.id}>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>

                  <Divider />

                  <SpecsContainer>
                    <SpecItem>
                      <SpecIconWrapper>
                        <RxDimensions />
                      </SpecIconWrapper>
                      <SpecDetails>
                        <SpecValue>{product.specs.chambers}</SpecValue>
                        <SpecLabel>{product.specs.chambersLabel}</SpecLabel>
                      </SpecDetails>
                    </SpecItem>

                    <SpecSeparator />

                    <SpecItem>
                      <SpecIconWrapper>
                        <TbTemperatureSun />
                      </SpecIconWrapper>
                      <SpecDetails>
                        <SpecValue>{product.specs.uw}</SpecValue>
                        <SpecLabel>{product.specs.uwUnit}</SpecLabel>
                      </SpecDetails>
                    </SpecItem>

                    <SpecSeparator />

                    <SpecItem>
                      <SpecIconWrapper>
                        <RiContrastDrop2Line />
                      </SpecIconWrapper>
                      <SpecDetails>
                        <SpecValue>{product.specs.pressure}</SpecValue>
                        <SpecLabel>{product.specs.pressureLabel}</SpecLabel>
                      </SpecDetails>
                    </SpecItem>
                  </SpecsContainer>

                  <ViewMoreButton to={`/produkty/${category}/${product.id}`}>
                    {t('common.viewMore', 'Zobacz więcej')}
                    <IoIosArrowForward />
                  </ViewMoreButton>
                </ProductInfo>

                <ProductImageWrapper>
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </ProductImageWrapper>
              </ProductCard>
            ))}
          </ProductsContainer>
        ) : (
          <NotFoundText>
            {t('products.emptyCategory', 'Brak produktów w tej kategorii.')}
          </NotFoundText>
        )}
      </Section>
    </Page>
  );
};

export default ProductCategoryPage;