// src/components/home/IntroSection.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Animation for text appearance
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Intro section wrapper
const IntroWrapper = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: #000; // Fallback
  z-index: 1; // Below Header but above main content
`;

// Video background
const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 1;
  object-fit: cover;
`;

// Darkening overlay for video
const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 2;
`;

// Content container for the bottom right corner
const RightBottomContentWrapper = styled.div`
  position: absolute;
  bottom: 8%;
  right: 5%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacings.medium};
  z-index: 10;
  text-align: right;
  max-width: 60%;
`;

// Animated dynamic text
const DynamicText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 5rem;
  font-weight: 50;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0;
  opacity: 0;
  animation: ${fadeIn} 1.4s ease-out forwards;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

// Call-to-action button
const CTAButton = styled(Link)`
  display: inline-block;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 1rem 2.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.default}, 
              border-color ${({ theme }) => theme.transitions.default};
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => "#017e543f"};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

// Main component
const IntroSection = ({ id }) => {
  const { t } = useTranslation();
  const videoMp4Url = "/videos/background4.mp4"; // Video path
  
  // Translation keys mapped to section IDs
  const introLinks = {
    'intro.text1': '/realizations',
    'intro.text2': '/about',
    'intro.text3': '/contact',
    'intro.text4': '/realizations',
  };
  const introTextKeys = Object.keys(introLinks);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  // Effect for cycling text every 7 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % introTextKeys.length);
      setAnimationKey(prevKey => prevKey + 1);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [introTextKeys.length]);

  // Get current text key and corresponding link
  const currentTextKey = introTextKeys[currentTextIndex];
  const currentLinkHref = introLinks[currentTextKey] || '/realizations';

  return (
    <IntroWrapper id={id}>
      {/* Video background */}
      <VideoBackground 
        autoPlay 
        muted 
        loop 
        playsInline 
        poster="/images/video_poster.jpg"
      >
        <source src={videoMp4Url} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      {/* Darkening overlay */}
      <VideoOverlay />

      {/* Bottom right content */}
      <RightBottomContentWrapper>
        {/* Dynamic text with animation */}
        <DynamicText key={animationKey}>
          {t(currentTextKey, '')}
        </DynamicText>

        {/* CTA button */}
        <CTAButton to={currentLinkHref}>
          {t('buttons.see', 'Zobacz')}
        </CTAButton>
      </RightBottomContentWrapper>
    </IntroWrapper>
  );
};

export default IntroSection;