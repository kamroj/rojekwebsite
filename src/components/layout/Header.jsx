// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Navigation from '../common/Navigation';
import logoSrc from '../../assets/images/logo.png';

// Main header wrapper
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings.medium};
  height: ${({ theme }) => theme.layout.headerHeight};
  z-index: 1000;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              background-color 0.1s linear, 
              border-color 0.1s linear, 
              color 0.1s linear;

  /* Background changes based on scroll position */
  background-color: ${({ isPastThreshold, isVisible, theme }) =>
    isPastThreshold && isVisible ? "#f8f9fa" : '#017e5414'};

  /* Border styling */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #e6c71968;

  /* Visibility control */
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};

  /* Text color changes with background */
  color: ${({ isPastThreshold, isVisible, theme }) =>
    isPastThreshold && isVisible ? theme.colors.text : theme.colors.textLight};

  /* Style for all links inside the header */
  a {
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

// Logo link styling
const LogoLink = styled(Link)`
  display: block;
  height: 50px;
  cursor: pointer;
  z-index: 1;

  img {
    height: 100%;
    width: auto;
    display: block;
    filter: ${({ isPastThreshold, isVisible }) =>
      isPastThreshold && isVisible ? 'brightness(0.5)' : 'none'};
    transition: filter 0.1s linear;
  }
`;

// Container for right-side controls (language switcher)
const RightControls = styled.div`
  display: flex;
  align-items: center;
`;

// Main Header component
const Header = () => {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 5;

  // Handle scroll events for header visibility and styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const pastThreshold = currentScrollY > SCROLL_THRESHOLD;

      setIsPastThreshold(pastThreshold);

      if (!pastThreshold) {
        setIsVisible(true);
      } else {
        if (scrollingUp) setIsVisible(true);
        else if (scrollingDown) setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };

    // Initialize scroll position
    lastScrollY.current = window.scrollY;
    setIsPastThreshold(lastScrollY.current > SCROLL_THRESHOLD);
    setIsVisible(true);

    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Clean up
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <HeaderWrapper isPastThreshold={isPastThreshold} isVisible={isVisible}>
      <LogoLink to="/" isPastThreshold={isPastThreshold} isVisible={isVisible}>
        <img src={logoSrc} alt="ROJEK okna i drzwi Logo" />
      </LogoLink>

      <Navigation variant="header" />

      <RightControls>
        <LanguageSwitcher />
      </RightControls>
    </HeaderWrapper>
  );
};

export default Header;