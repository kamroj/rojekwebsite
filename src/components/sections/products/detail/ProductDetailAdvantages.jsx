import React from 'react';
import styled from 'styled-components';
import { FiCheck } from 'react-icons/fi';
import { Trans } from 'react-i18next';

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 3rem 0;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
`;

const AdvantagesSection = styled.div`
  padding: 5rem 0 3rem 0;
`;

const AdvantagesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(6, 1fr);

  & > * {
    grid-column: span 2;
  }

  ${({ $count }) =>
    $count === 1 &&
    `
    & > * { grid-column: span 6; }
  `}

  ${({ $count }) =>
    $count === 2 &&
    `
    & > * { grid-column: span 3; }
  `}

  ${({ $count }) =>
    $count === 4 &&
    `
    & > * { grid-column: span 3; }
  `}

  ${({ $count }) =>
    $count === 5 &&
    `
    & > *:nth-child(n+4) { grid-column: span 3; }
  `}

  ${({ $count }) =>
    $count === 7 &&
    `
    & > *:last-child { grid-column: 3 / span 2; }
  `}

  ${({ $count }) =>
    $count === 8 &&
    `
    & > *:nth-child(7) { grid-column: 2 / span 2; }
    & > *:nth-child(8) { grid-column: 4 / span 2; }
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    & > * { grid-column: span 1 !important; }
    ${({ $count }) =>
      $count % 2 === 1 &&
      `
      & > *:last-child { grid-column: span 2 !important; }
    `}
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    & > * { grid-column: span 1 !important; }
  }
`;

const AdvantageCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #0d6b035e;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    transform: translateY(-5px);
  }
`;

const AdvantageTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 0.75rem 0;
`;

const AdvantageDescription = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

const WarrantySection = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 3.5rem 4rem;
  display: flex;
  align-items: center;
  gap: 4rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid #0d6b035e;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    gap: 2.5rem;
    padding: 3rem 2.5rem;
    text-align: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 2.5rem 1.5rem;
  }
`;

const WarrantyBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;

const WarrantyImage = styled.img`
  width: 350px;
  height: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 250px;
  }
`;

const WarrantyContent = styled.div`
  flex: 1;
`;

const WarrantyTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 1rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }
`;

const WarrantyText = styled.p`
  font-size: 1.3rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0;

  strong {
    color: #013613;
    font-weight: 600;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const WarrantyHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #d4ecd4 100%);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  margin-top: 1.5rem;

  svg {
    color: #1a5618;
    font-size: 1.3rem;
  }

  span {
    font-size: 1.15rem;
    color: #1a5618;
    font-weight: 600;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    padding: 0.6rem 1rem;
  }
`;

export default function ProductDetailAdvantages({
  product,
  title,
  i18nPrefix,
  t,
  warrantyImageSrc = '/images/products/windows/gwarancja.png',
}) {
  if (!product?.advantages?.length) return null;

  return (
    <AdvantagesSection>
      <SectionTitle>{title}</SectionTitle>

      <AdvantagesGrid $count={product.advantages.length}>
        {product.advantages.map((advantage, index) => (
          <AdvantageCard key={index}>
            <AdvantageTitle>{advantage.title}</AdvantageTitle>
            <AdvantageDescription>{advantage.description}</AdvantageDescription>
          </AdvantageCard>
        ))}
      </AdvantagesGrid>

      <WarrantySection>
        <WarrantyBadge>
          <WarrantyImage src={warrantyImageSrc} alt={t('common.warranty', 'Gwarancja')} />
        </WarrantyBadge>

        <WarrantyContent>
          <WarrantyTitle>{t(`${i18nPrefix}.warranty.title`, 'Pewność jakości na lata')}</WarrantyTitle>
          <WarrantyText>
            <Trans
              i18nKey={`${i18nPrefix}.warranty.text`}
              defaults="Jesteśmy pewni jakości naszych produktów, dlatego w ciągu <strong>5 lat</strong> od montażu możesz nam zgłosić jakikolwiek problem."
              components={{ strong: <strong /> }}
            />
          </WarrantyText>
          <WarrantyHighlight>
            <FiCheck />
            <span>{t(`${i18nPrefix}.warranty.highlight`, 'Bezpłatny serwis gwarancyjny')}</span>
          </WarrantyHighlight>
        </WarrantyContent>
      </WarrantySection>
    </AdvantagesSection>
  );
}
