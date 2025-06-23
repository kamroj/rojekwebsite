// src/components/home/IntroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause } from 'react-icons/fi';

// Animacja tekstu przy wczytywaniu
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const IntroWrapper = styled.section`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background-color: #000;
  z-index: 1;
  
  /* Zapewnienie pełnej wysokości na różnych urządzeniach */
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height dla nowszych przeglądarek */
  
  /* Usunięcie wszelkich marginów i paddingów */
  margin: 0;
  padding: 0;
  
  /* Pozycjonowanie bez przesunięć */
  top: 0;
  left: 0;
  
  /* Wyciągnięcie poza kontener główny jeśli potrzeba */
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  pointer-events: none;
  z-index: 1;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background-color: ${({ theme }) => theme.colors.overlay};
  pointer-events: none;
  z-index: 2;
`;

// Nowy wrapper flexowy trzymający play/pause i tekst+CTA
const BottomOverlay = styled.div`
  position: absolute;
  bottom: 8%;
  left: 5%;
  right: 5%;
  display: flex;
  align-items: flex-end;      /* przyklejamy elementy do dołu kontenera */
  justify-content: space-between;
  min-height: 56px;           /* co najmniej wysokość przycisku */
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 5%;
    min-height: 52px;
    left: 3%;
    right: 3%;
  }
`;

// Kontener dla SVG pierścienia + przycisku
const ProgressContainer = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
  }
`;

const VideoControlButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 0;

  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #fff;
  font-size: 2.2rem;
  cursor: pointer;
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default};
  opacity: 0.8;

  z-index: 2;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    opacity: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const RightBottomContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacings.medium};
  text-align: right;
  flex: 1;
  min-width: 0; /* pozwala tekstowi zawijać się zamiast wypychać przycisk */

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacings.small};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-left: ${({ theme }) => theme.spacings.medium};
  }
`;

const DynamicText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 300;
  line-height: 1.2;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
  margin: 0;
  opacity: 0;
  animation: ${fadeIn} 1.4s ease-out forwards;
  word-wrap: break-word;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: clamp(2.4rem, 5vw, 4rem);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: clamp(2rem, 5vw, 3.2rem);
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 1rem 2.5rem;
  font-size: clamp(1.2rem, 2vw, 1.4rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.default},
              border-color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: #017e543f;
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.8rem 2rem;
    font-size: clamp(1.1rem, 2vw, 1.3rem);
  }
`;

export default function IntroSection({ id }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resetting, setResetting] = useState(false);
  const prevProgress = useRef(0);

  const introLinks = {
    'intro.text1': '/realizations',
    'intro.text2': '/about',
    'intro.text3': '/contact',
    'intro.text4': '/realizations',
  };
  const keys = Object.keys(introLinks);
  const [idx, setIdx] = useState(0);
  const [keyAnim, setKeyAnim] = useState(0);

  // cykl dynamicznych tekstów
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % keys.length);
      setKeyAnim(k => k + 1);
    }, 7000);
    return () => clearInterval(iv);
  }, [keys.length]);

  // obsługa pętli i postępu wideo
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    const p = Math.min(1, v.currentTime / v.duration);
    if (p < prevProgress.current) {
      setResetting(true);
      setProgress(0);
    } else {
      setProgress(p);
    }
    prevProgress.current = p;
  };

  useEffect(() => {
    if (resetting) {
      const to = setTimeout(() => setResetting(false), 50);
      return () => clearTimeout(to);
    }
  }, [resetting]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play(); setIsPlaying(true);
    } else {
      v.pause(); setIsPlaying(false);
    }
  };

  // parametry SVG pierścienia
  const SIZE = 56;
  const STROKE = 2;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - progress);

  return (
    <IntroWrapper id={id}>
      <VideoBackground
        ref={videoRef}
        src="/videos/background4.mp4"
        type="video/mp4"
        autoPlay muted loop playsInline webkit-playsinline="true"
        poster="/images/video_poster.jpg"
        onTimeUpdate={onTimeUpdate}
      />
      <VideoOverlay />

      <BottomOverlay>
        <ProgressContainer>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none'
            }}
          >
            <circle
              cx={SIZE/2} cy={SIZE/2} r={R}
              fill="none"
              stroke={theme.colors.borderAccent}
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE/2} cy={SIZE/2} r={R}
              fill="none"
              stroke={theme.colors.secondary}
              strokeWidth={STROKE}
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
              style={{
                transition: resetting ? 'none' : 'stroke-dashoffset 0.1s linear'
              }}
            />
          </svg>
          <VideoControlButton
            type="button"
            onClick={toggle}
            onTouchEnd={e => { e.preventDefault(); toggle(); }}
            aria-label={isPlaying ? t('buttons.pause','Pause') : t('buttons.play','Play')}
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
          </VideoControlButton>
        </ProgressContainer>

        <RightBottomContentWrapper>
          <DynamicText key={keyAnim}>
            {t(keys[idx], '')}
          </DynamicText>
          <CTAButton to={introLinks[keys[idx]]}>
            {t('buttons.see','Zobacz')}
          </CTAButton>
        </RightBottomContentWrapper>
      </BottomOverlay>
    </IntroWrapper>
  );
}