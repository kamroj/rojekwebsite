// src/components/home/CompanyPresentationSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiPlay } from 'react-icons/fi';

// Kontener dla całej sekcji
const PresentationWrapper = styled.div`
  width: 100%;
  background-color: #000;
  padding: 0;
  position: relative;
`;

// Kontener dla filmu YouTube - responsywny stosunek 16:9
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: #000;
  overflow: hidden;
  
  /* Większa wysokość na dużych ekranach */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-bottom: 50%; /* Nieco mniejszy aspect ratio dla większych ekranów */
    max-height: 70vh;
  }
`;

// Iframe YouTube
const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

// Placeholder z przyciskiem play (pokazywany przed załadowaniem filmu)
const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  background-image: ${props => props.thumbnail ? `url(${props.thumbnail})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    transition: background-color 0.3s ease;
  }
  
  &:hover::before {
    background: rgba(0, 0, 0, 0.6);
  }
`;

// Kontener dla przycisku - podobny do IntroSection
const PlayButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

// Przycisk play - skopiowany styl z IntroSection
const PlayButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 0;
  
  width: 56px;
  height: 56px;
  border: 1px solid #07be56;
  border-radius: 50%;
  background-color: rgb(3 84 0 / 58%);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: #fff;
  font-size: 2.2rem;
  cursor: pointer;
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default};
  opacity: 0.8;
  
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
    font-size: 2rem;
  }
  
  svg {
    margin-left: 5px; /* Centrowanie wizualne ikony play */
  }
`;

const CompanyPresentationSection = () => {
  const { t } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  
  // YouTube video ID z podanego URL
  const videoId = 'XhAN4U4bngs';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // Intersection Observer dla lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const handlePlayClick = () => {
    setShowVideo(true);
  };
  
  return (
    <PresentationWrapper ref={sectionRef}>
      <VideoContainer>
        {(!isInView || !showVideo) ? (
          <VideoPlaceholder 
            thumbnail={thumbnailUrl}
            onClick={handlePlayClick}
            role="button"
            aria-label={t('presentation.playVideo', 'Odtwórz film prezentacyjny')}
            tabIndex={0}
          >
            <PlayButtonContainer>
              <PlayButton type="button" aria-hidden="true">
                <FiPlay />
              </PlayButton>
            </PlayButtonContainer>
          </VideoPlaceholder>
        ) : (
          <VideoFrame
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
            title={t('presentation.title', 'Prezentacja firmy ROJEK')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </VideoContainer>
    </PresentationWrapper>
  );
};

export default CompanyPresentationSection;