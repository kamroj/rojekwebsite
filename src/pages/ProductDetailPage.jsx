// src/pages/ProductDetailPage.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Page from '../components/common/Page';
import Section from '../components/common/Section';
import { productCategories, productDetailsByType } from '../data/products';
import WindowProductDetail from './product-details/WindowProductDetail';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%);
  color: #ffffff;
  padding: 1.1rem 2.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 3px 10px 0px rgb(13 43 12 / 35%);
  }
`;

const ProductDetailPage = () => {
  const { category, productId } = useParams();

  const categoryInfo = productCategories[category];
  const detailType = categoryInfo?.detailType;

  const product = detailType
    ? productDetailsByType?.[detailType]?.[productId]
    : undefined;

  // Keep existing behavior for missing product/category
  if (!categoryInfo || !product) {
    return (
      <Page
        imageSrc="/images/products/default-header.jpg"
        title="Nie znaleziono produktu"
      >
        <Section>
          <p>Wybrany produkt nie istnieje.</p>
          <BackLink to={categoryInfo ? `/produkty/${category}` : '/produkty'}>
            Wróć do kategorii
          </BackLink>
        </Section>
      </Page>
    );
  }

  // Route to a detail component based on detailType.
  // For now only windows are implemented, but adding new types is a single mapping.
  switch (detailType) {
    case 'windows':
      return <WindowProductDetail product={product} category={category} />;
    default:
      return (
        <Page
          imageSrc="/images/products/default-header.jpg"
          title="Brak szablonu produktu"
        >
          <Section>
            <p>
              Dla tej kategorii produktów nie mamy jeszcze przygotowanej strony
              detalu.
            </p>
            <BackLink to={`/produkty/${category}`}>
              Wróć do kategorii
            </BackLink>
          </Section>
        </Page>
      );
  }
};

export default ProductDetailPage;
