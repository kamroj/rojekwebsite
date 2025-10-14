import React from 'react';
import styled from 'styled-components';
import MaxWidthContainer from './MaxWidthContainer';

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

const HeaderContentLayer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  z-index: 2;
  pointer-events: none;

  ${MaxWidthContainer} {
    position: relative; /* make container the positioning context */
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
    border: 1px solid #794f00;
    position: absolute;
    bottom: 18px;
    right: 22px;
    margin: 0;
    padding: 12px 24px;
    background-color: ${({ contentBg }) => contentBg || '#8b73001f'};
    backdrop-filter: blur(3px);
    color: ${({ contentColor }) => contentColor || '#f8f9fa'};
    border-radius: 10px;
    display: inline-block;
    z-index: 2;
    pointer-events: auto;
    white-space: nowrap;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);

  h1 {
    margin: 0;
    font-weight: 300;
    font-size: 2.4rem;
    color: inherit;
    line-height: 1;
    letter-spacing: 1px;
  }



  @media (max-width: 900px) {
    h1 { font-size: 2rem; }
  }
`;

const PageHeader = ({ imageSrc, title, height = 300, id, overlayColor, contentBg, contentColor, contentInMaxWidth = false, children }) => {
  return (
    <HeaderWrapper id={id}>
      <HeaderImageWrapper height={height}>
        <HeaderImage src={imageSrc} alt={title || ''} />
        <Overlay overlayColor={overlayColor} />
        {(title || children) && (
          contentInMaxWidth ? (
            <HeaderContentLayer>
              <MaxWidthContainer>
                <HeaderContent contentBg={contentBg} contentColor={contentColor}>
                  {children || <h1>{title}</h1>}
                </HeaderContent>
              </MaxWidthContainer>
            </HeaderContentLayer>
          ) : (
            <HeaderContent contentBg={contentBg} contentColor={contentColor}>
              {children || <h1>{title}</h1>}
            </HeaderContent>
          )
        )}
      </HeaderImageWrapper>
    </HeaderWrapper>
  );
};

export default PageHeader;
