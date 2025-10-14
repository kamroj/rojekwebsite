// src/components/common/Section.jsx
import React from 'react';
import styled, { css } from 'styled-components';

const SectionWrapper = styled.section`
  position: relative;
  color: ${({ theme, $dark }) => $dark ? theme.colors.textLight : 'inherit'};
  ${({ $customStyles }) => $customStyles && css`${$customStyles}`}
`;

const ContentContainer = styled.div`
  width: 100%;
  text-align: ${({ align }) => align || 'left'};
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
    <SectionWrapper $dark={dark} $customStyles={customStyles}>
      <ContentContainer align={align} $noPadding={noPadding} $noInset={$noInset}>
        {children}
      </ContentContainer>
    </SectionWrapper>
  );
};

export default Section;
