// src/components/common/Navigation.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Base navigation styles
const BaseNavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacings.large};
  justify-content: center;
  flex-grow: 1;
`;

// Base styles for navigation items
const BaseNavItem = styled(Link)`
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 5px 0;
  position: relative;
  transition: color ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  /* Optional active state indication */
  &.active {
    font-weight: 700;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

// Extended styles for different contexts
export const HeaderNavContainer = styled(BaseNavContainer)`
  /* Any header-specific nav container styles */
`;

export const HeaderNavItem = styled(BaseNavItem)`
  /* Any header-specific nav item styles */
`;

export const IntroNavContainer = styled(BaseNavContainer)`
  /* Any intro-specific nav container styles */
`;

export const IntroNavItem = styled(BaseNavItem)`
  /* Any intro-specific nav item styles */
`;

// The navigation component itself - reusable across contexts
const Navigation = ({ variant = 'header' }) => {
  const { t } = useTranslation();
  
  // Choose container and item styles based on variant
  const NavContainer = variant === 'intro' ? IntroNavContainer : HeaderNavContainer;
  const NavItem = variant === 'intro' ? IntroNavItem : HeaderNavItem;
  
  // Navigation items - centralized in one place
  const navItems = [
    { key: 'offer', path: '/realizations', label: 'nav.offer', fallback: 'Oferta' },
    { key: 'realizations', path: '/realizations', label: 'nav.realizations', fallback: 'Realizacje' },
    { key: 'about', path: '/about', label: 'nav.about', fallback: 'O nas' },
    { key: 'contact', path: '/contact', label: 'nav.contact', fallback: 'Kontakt' }
  ];
  
  return (
    <NavContainer>
      {navItems.map(item => (
        <NavItem to={item.path} key={item.key}>
          {t(item.label, item.fallback)}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default Navigation;