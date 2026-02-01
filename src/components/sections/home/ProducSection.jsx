// src/components/home/ProductSection.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import MaxWidthContainer from '../../ui/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../../views/HomeView';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { getProductCategoryPath } from '../../../lib/i18n/routing';

// --- Styled Components ---
const SectionWrapper = styled.section`
  padding: 3rem 0 4rem;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
`;

const ProductContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1.2rem;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const ProductCard = styled.article`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.35s ease;
  border: 1px solid rgb(0 65 11 / 50%);
  box-shadow: 0 2px 12px -4px rgba(0, 59, 10, 0.063);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px -8px rgba(0, 0, 0, 0.215);
    border-color: rgba(2, 92, 17, 0.686);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 10px;
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(0, 77, 20, 0.03) 0%, transparent 50%);
    z-index: 1;
    pointer-events: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 180px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 130px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.04);
  }
  
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 1.4rem 1.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.8rem 1rem 1rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text || '#1a1a1a'};
  margin: 0 0 0.5rem 0;
  line-height: 1.25;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.4rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
    margin: 0 0 0.3rem 0;
  }
`;

const Divider = styled.div`
  width: 36px;
  height: 1px;
  background: #004d15ac;
  margin-bottom: 0.6rem;
  opacity: 0.5;
  transition: width 0.3s ease, opacity 0.3s ease;
  
  ${ProductCard}:hover & {
    width: 50px;
    opacity: 0.8;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 28px;
    margin-bottom: 0.4rem;
  }
`;

const CardDescription = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#4a5a4a'};
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(0, 59, 10, 0.06);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 0.6rem;
    padding-top: 0.6rem;
  }
`;

const LinkText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.bottleGreen || '#004d14'};
  transition: color 0.3s ease;
  
  ${ProductCard}:hover & {
    color: ${({ theme }) => theme.colors.bottleGreenDark || '#003b0a'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bottleGreen || '#004d14'}0d;
  transition: all 0.3s ease;
  
  ${ProductCard}:hover & {
    background: ${({ theme }) => theme.colors.bottleGreen || '#004d14'};
    transform: translateX(2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
  }
`;

const ArrowIcon = styled(IoIosArrowForward)`
  color: ${({ theme }) => theme.colors.bottleGreen || '#004d14'};
  font-size: 2rem;
  transition: transform 0.3s ease, color 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: translateX(4px);
    color: ${({ theme }) => theme.colors.bottleGreenDark || '#003b0a'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.6rem;
    color: #014e01
  }
`;

// --- Component ---
const ProductTile = ({ id, product }) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const to = getProductCategoryPath(lang, id);

  return (
    <ProductCard>
      <CardLink to={to} aria-label={`${product.name} - ${t('common.learnMore', 'Dowiedz się więcej')}`}>
        <ImageContainer>
          <ProductImage 
            src={product.backgroundSrc} 
            alt={product.name}
            loading="lazy"
          />
        </ImageContainer>
        
        <CardContent>
          <CardTitle>{product.name}</CardTitle>
          <Divider />
          <CardDescription>{product.description}</CardDescription>
          
          <CardFooter>
            <LinkText>{product.linkText || t('common.learnMore', 'Dowiedz się więcej')}</LinkText>
            <ArrowIcon />
          </CardFooter>
        </CardContent>
      </CardLink>
    </ProductCard>
  );
};

const ProductSection = ({ productData }) => {
  const productIds = Object.keys(productData);

  return (
    <SectionWrapper aria-labelledby="products-heading">
      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader id="products-heading">
            {t('sections.products')}
          </ProductHeader>
          <ProductHeaderSubtitle>
            {t('sections.productsSubtitle', 'Poznaj nasze systemy okienne i drzwiowe')}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <ProductContentContainer>
          <ProductsGrid>
            {productIds.map((id) => (
              <ProductTile
                key={id}
                id={id}
                product={productData[id]}
              />
            ))}
          </ProductsGrid>
        </ProductContentContainer>
      </MaxWidthContainer>
    </SectionWrapper>
  );
};

export default ProductSection;