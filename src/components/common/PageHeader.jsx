import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.section`
  width: 100%;
  overflow: hidden;
`;

const HeaderImageWrapper = styled.div`
  position: relative;
  width: 100vw;
  left: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: ${({ height }) => (height ? `${height}px` : '300px')};
  overflow: hidden;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ overlayColor }) => overlayColor || 'rgba(0,0,0,0.65)'};
  pointer-events: none;
  z-index: 1;
`;

const HeaderContent = styled.div`
  position: absolute;
  bottom: 18px;
  right: 22px;
  margin: 0;
  padding: 12px 22px;
  background-color: ${({ contentBg, theme }) => contentBg || `${theme.colors.bottleGreen}cc`};
  color: ${({ contentColor, theme }) => contentColor || theme.colors.textLight};
  border-radius: 10px;
  display: inline-block;
  z-index: 2;
  white-space: nowrap; /* keep the title on a single line */
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);

  h1 {
    margin: 0;
    font-weight: 300;
    font-size: 2.6rem;
    color: inherit;
    line-height: 1;
    letter-spacing: 1px;
  }



  @media (max-width: 900px) {
    min-width: 180px;
    padding: 10px 16px;
    h1 { font-size: 2.2rem; }
  }

  @media (max-width: 600px) {
    h1 { font-size: 1.8rem; }
    min-width: 140px;
  }
`;

const PageHeader = ({ imageSrc, title, height = 300, id, overlayColor, contentBg, contentColor, children }) => {
  return (
    <HeaderWrapper id={id}>
      <HeaderImageWrapper height={height}>
        <HeaderImage src={imageSrc} alt={title || ''} />
        {/* overlay to match About page look */}
        <Overlay overlayColor={overlayColor} />
        {(title || children) && (
          <HeaderContent contentBg={contentBg} contentColor={contentColor}>
            {children || <h1>{title}</h1>}
          </HeaderContent>
        )}
      </HeaderImageWrapper>
    </HeaderWrapper>
  );
};

export default PageHeader;
