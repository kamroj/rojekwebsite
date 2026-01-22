// src/components/home/ProductSection.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import MaxWidthContainer from '../common/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../pages/HomePage';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { getProductCategoryPath } from '../../utils/i18nRouting';

// --- Styled Components ---
const ProductContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
`;

const TilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.4rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 1rem;
    max-width: 100%;
  }
`;

const TileCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 7px 23px -9px rgba(0, 0, 0, 0.39);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 7px 23px -9px rgba(0, 0, 0, 0.651);
  }
  
  &:hover svg {
    transform: translateX(4px);
    color: ${({ theme }) => theme.colors.bottleGreenDark || '#004d14'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 8px;
    box-shadow: 0px 6px 15px -9px rgba(0, 0, 0, 0.39);

    svg {
      color: ${({ theme }) => theme.colors.bottleGreenDark || '#004d14'};
    }
  }
`;

const TileBackgroundWrapper = styled.div`
  width: 100%;
  height: 390px;
  background-image: url(${({ $bgSrc }) => $bgSrc});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 280px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 140px;
  }
`;

const TileContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 2.4rem 2.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1rem 1rem;
  }
`;

const TileLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #003b0a65;
  margin: 0 0 1.6rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 0 1rem 0;
  }
`;

const TileTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || '#1a1a1a'};
  margin: 0 0 0.6rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
    margin: 0 0 0.3rem 0;
  }
`;

const TileDescription = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#002b06'};
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.1rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const TileFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 0.5rem;
  }
`;

const ArrowIcon = styled(IoIosArrowForward)`
  color: ${({ theme }) => theme.colors.bottleGreen || '#000000'};
  font-size: 2.2rem;
  transition: transform 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.6rem;
  }
`;

// Komponent dla pojedynczego kafelka
const ProductTile = ({ id, product }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // In `PRODUCT_TYPES` we have internal ids for categories.
  // For now, map only ids that exist in productCategories (okna/drzwi/bramy/rolety).
  // Others fall back to products index.
  const categoryKey = id;
  const to = getProductCategoryPath(lang, categoryKey);

  return (
    <TileCard to={to}>
      <TileBackgroundWrapper $bgSrc={product.backgroundSrc} />
      <TileContent>
        <TileTitle>{product.name}</TileTitle>
        <TileLine />
        <TileDescription>
          {product.description}
        </TileDescription>
        <TileFooter>
          <ArrowIcon />
        </TileFooter>
      </TileContent>
    </TileCard>
  );
};

const ProductSection = ({ productData }) => {
  const productIds = Object.keys(productData);

  return (
    <MaxWidthContainer>
      <HeaderWrap className='full-width'>
        <ProductHeader>
          {t('sections.products')}
        </ProductHeader>
        <ProductHeaderSubtitle>
          {t('sections.productsSubtitle', 'Poznaj nasze systemy okienne i drzwiowe')}
        </ProductHeaderSubtitle>
      </HeaderWrap>

      <ProductContentContainer>
        <TilesGrid>
          {productIds.map((id) => (
            <ProductTile
              key={id}
              id={id}
              product={productData[id]}
            />
          ))}
        </TilesGrid>
      </ProductContentContainer>
    </MaxWidthContainer>
  );
};

export default ProductSection;
