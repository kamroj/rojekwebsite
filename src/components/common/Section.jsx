// src/components/common/Section.jsx
import React from 'react';
import styled, { css } from 'styled-components';

/* Base Section component
   Use transient props ($...) to avoid forwarding unknown props to the DOM
*/
const SectionWrapper = styled.section`
  margin-top: 6rem;
  /* padding: ${({ $dark }) => $dark ? '20px 0' : '5rem 3.5rem 1.5rem 3.5rem'}; */
  background-color: ${({ theme, $dark }) => $dark ? 'black' : theme.colors.background};
  border: ${({ $dark }) => $dark ? 'none' : '1px solid'};
  border-color: ${({ theme, $dark }) => $dark ? 'transparent' : theme.colors.borderAccent};
  position: relative;
  color: ${({ theme, $dark }) => $dark ? theme.colors.textLight : 'inherit'};
  ${({ $customStyles }) => $customStyles && css`${$customStyles}`}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* padding: ${({ $dark }) => $dark ? '20px 0' : '3rem 0 1.5rem 0'};; */
  }
`;

// Container dla labela - ogranicza pozycjonowanie do szerokości contentu
const LabelContainer = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: 0 60px;
  pointer-events: none;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 30px; /* Zwiększony padding na mobile */
  }
`;

// Section label (tag) - teraz pozycjonowany względem kontenera
const SectionLabel = styled.div`
  border: 1px solid #06c5065e;
  /* box-shadow: ${({ theme }) => theme.shadows.large}; */
  background-color: #01200d;
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
  pointer-events: auto;
  
  /* use transient prop $left to avoid forwarding to DOM */
  ${({ $left }) => $left ? css`
    left: 0;
    right: auto;
  ` : css`
    right: 0;
    left: auto;
  `}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 30px;
    font-size: 1.4rem;
    height: 45px;
    
    /* Na mobile odsunięcie o 30px od krawędzi */
    ${({ $left }) => $left ? css`
      left: 30px;
      right: auto;
    ` : css`
      right: 30px;
      left: auto;
    `}
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 20px;
    font-size: 1.3rem;
    height: 40px;
    
    /* Na małych ekranach mniejsze odsunięcie */
    ${({ $left }) => $left ? css`
      left: 20px;
      right: auto;
    ` : css`
      right: 20px;
      left: auto;
    `}
  }
`;

/* Content container for section content
   By default keep a small inset on mobile for text-heavy sections.
   Use transient prop $noInset to opt-out per-section (does not forward to DOM). */
const ContentContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  text-align: ${({ align }) => align || 'center'};

  /* apply mobile inset unless a section opts out via $noInset */
  ${({ $noInset }) => !$noInset && css`
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      max-width: 92%;
      margin-left: auto;
      margin-right: auto;
    }
  `}

  /* use transient $noPadding to avoid forwarding unknown prop */
  /* padding-top: ${({ $noPadding }) => $noPadding ? '0' : '30px'}; */
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
  $noInset,
  ...props 
}) => {
  return (
    /* pass transient props ($...) so they are not forwarded to DOM elements */
    <SectionWrapper $dark={dark} $customStyles={customStyles}>
      {label && (
        <LabelContainer>
          <SectionLabel $left={labelPosition === 'left'}>
            {label}
          </SectionLabel>
        </LabelContainer>
      )}
      <ContentContainer align={align} $noPadding={noPadding} $noInset={$noInset}>
        {children}
      </ContentContainer>
    </SectionWrapper>
  );
};

export default Section;
