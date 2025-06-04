// src/components/common/Section.jsx
import React from 'react';
import styled, { css } from 'styled-components';

// Base Section component
const SectionWrapper = styled.section`
  margin-top: 8rem;
  padding: 3.5rem;
  background-color: ${({ theme, dark }) => dark ? theme.colors.galleryBackgroundDark : theme.colors.background};
  border: 1px solid ${({ theme, dark }) => dark ? theme.colors.galleryBorder : theme.colors.borderAccent};
  position: relative;
  ${({ customStyles }) => customStyles && css`${customStyles}`}
`;

// Section label (tag)
const SectionLabel = styled.div`
  box-shadow: ${({ theme }) => theme.shadows.large};
  background-color: ${({ theme }) => theme.colors.bottleGreen};
  color: ${({ theme }) => theme.colors.textLight};
  height: 50px;
  font-weight: 500;
  font-size: 1.6rem;
  padding: 0 50px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -25px;
  z-index: 1;
  ${({ left }) => left ? css`left: 60px; right: auto;` : css`right: 60px; left: auto;`}
`;

// Content container for section content
const ContentContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  text-align: ${({ align }) => align || 'center'};
  padding-top: ${({ noPadding }) => noPadding ? '0' : '30px'};
`;

// Combined Section component with label and content
const Section = ({ 
  children, 
  label, 
  labelPosition = 'right', 
  dark = false,
  align,
  noPadding,
  customStyles,
  ...props 
}) => {
  return (
    <SectionWrapper dark={dark} customStyles={customStyles} {...props}>
      {label && (
        <SectionLabel left={labelPosition === 'left'}>
          {label}
        </SectionLabel>
      )}
      <ContentContainer align={align} noPadding={noPadding}>
        {children}
      </ContentContainer>
    </SectionWrapper>
  );
};

export default Section;