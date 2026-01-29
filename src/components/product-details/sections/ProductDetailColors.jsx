import React, { useState } from 'react';
import styled from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';
import Section from '../../common/Section';

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

const ColorsSection = styled.div`
  padding: 5rem 0;
  background: #f6f8f9;
  padding-left: 3rem;
  padding-right: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const ColorsLayout = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ColorSwatchesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ColorSwatchesLabel = styled.span`
  font-size: 1.4rem;
  color: #4b5563;
  font-weight: 500;
`;

const ColorSwatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ColorSwatchButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

const ColorSquare = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  background-image: ${({ $image }) => ($image ? `url(${$image})` : 'none')};
  background-size: cover;
  background-position: center;
  border: 2px solid ${({ $active }) => ($active ? '#1a5618' : 'rgba(0, 0, 0, 0.1)')};
  box-shadow: ${({ $active }) =>
    $active
      ? '0 0 0 2px rgba(26, 86, 24, 0.2)'
      : '0 2px 6px rgba(0, 0, 0, 0.08)'};
  transition: all 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
  }
`;

const ColorSwatchRAL = styled.span`
  font-size: 1rem;
  color: ${({ $active }) => ($active ? '#1a5618' : '#6b7280')};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  letter-spacing: 0.3px;
  transition: color 0.2s ease;
`;

const FullPaletteLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: #1a5618;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    color: #2d7a2a;
    text-decoration: underline;
  }

  svg {
    font-size: 1rem;
  }
`;

const ColorPreviewContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 550px;
    margin: 0 auto;
    width: 100%;
  }
`;

const ColorPreviewMain = styled.div`
  aspect-ratio: 16/9;
  background: ${({ $color }) => $color};
  background-image: ${({ $image }) => ($image ? `url(${$image})` : 'none')};
  background-size: cover;
  background-position: center;
`;

const ColorPreviewInfo = styled.div`
  padding: 1.75rem 2rem;
  border-top: 1px solid #e5e7eb;
`;

const ColorPreviewName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 0.35rem 0;
`;

const ColorPreviewRAL = styled.span`
  font-size: 1.2rem;
  color: #1a5618;
  font-weight: 500;
`;

const ColorPreviewDescription = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 1.25rem 0 0 0;
`;

export default function ProductDetailColors({
  colors,
  title,
  mostPopularLabel,
  fullPaletteLabel,
  fullPaletteHref = 'https://www.ralcolorchart.com/',
  t,
}) {
  const [selectedColor, setSelectedColor] = useState(0);
  if (!Array.isArray(colors) || colors.length === 0) return null;
  const currentColor = colors?.[selectedColor];

  return (
    <ColorsSection>
      <Section>
        <SectionTitle>{title}</SectionTitle>

        <ColorsLayout>
          <ColorSwatchesContainer>
            <ColorSwatchesLabel>{mostPopularLabel}</ColorSwatchesLabel>

            <ColorSwatchesGrid>
              {colors.map((color, index) => (
                <ColorSwatchButton key={color.id} onClick={() => setSelectedColor(index)}>
                  <ColorSquare $color={color.color} $image={color.image} $active={selectedColor === index} />
                  <ColorSwatchRAL $active={selectedColor === index}>{color.ral}</ColorSwatchRAL>
                </ColorSwatchButton>
              ))}
            </ColorSwatchesGrid>

            <FullPaletteLink href={fullPaletteHref} target="_blank" rel="noopener noreferrer">
              {fullPaletteLabel}
              <FiExternalLink />
            </FullPaletteLink>
          </ColorSwatchesContainer>

          <ColorPreviewContainer>
            <ColorPreviewMain $color={currentColor?.color} $image={currentColor?.image} />
            <ColorPreviewInfo>
              <ColorPreviewName>{currentColor?.name}</ColorPreviewName>
              <ColorPreviewRAL>{currentColor?.ral}</ColorPreviewRAL>
              <ColorPreviewDescription>{currentColor?.description}</ColorPreviewDescription>
            </ColorPreviewInfo>
          </ColorPreviewContainer>
        </ColorsLayout>
      </Section>
    </ColorsSection>
  );
}
