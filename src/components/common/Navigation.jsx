// src/components/common/Navigation.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

// Bazowe style dla kontenera nawigacji
const BaseNavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacings.large};
  justify-content: center;
  flex-grow: 1;
`;

// Bazowe style dla elementów nawigacji
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

  /* Opcjonalne oznaczenie aktywnego stanu */
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

// Rozszerzone style dla różnych kontekstów
export const HeaderNavContainer = styled(BaseNavContainer)`
  /* Specyficzne style dla nawigacji w nagłówku */
`;

export const HeaderNavItem = styled(BaseNavItem)`
  /* Specyficzne style dla elementów nawigacji w nagłówku */
`;

export const IntroNavContainer = styled(BaseNavContainer)`
  /* Specyficzne style dla nawigacji wprowadzającej */
`;

export const IntroNavItem = styled(BaseNavItem)`
  /* Specyficzne style dla elementów nawigacji wprowadzającej */
`;

// Sam komponent nawigacji - wielokrotnego użytku w różnych kontekstach
const Navigation = ({ variant = 'header' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Wybierz style kontenera i elementu na podstawie wariantu
  const NavContainer = variant === 'intro' ? IntroNavContainer : HeaderNavContainer;
  const NavItem = variant === 'intro' ? IntroNavItem : HeaderNavItem;
  
  // Elementy nawigacji - scentralizowane w jednym miejscu
  const navItems = [
    { key: 'offer', path: '/realizations', label: 'nav.offer', fallback: 'Oferta' },
    { key: 'realizations', path: '/realizations', label: 'nav.realizations', fallback: 'Realizacje' },
    { key: 'about', path: '/about', label: 'nav.about', fallback: 'O nas' },
    { key: 'contact', path: '/contact', label: 'nav.contact', fallback: 'Kontakt' }
  ];
  
  // Funkcja sprawdzająca, czy element jest aktywny
  const isActive = (path) => {
    // Dla strony głównej sprawdź dokładnie
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // Dla innych stron sprawdź, czy ścieżka zaczyna się od podanej
    return path !== '/' && location.pathname.startsWith(path);
  };
  
  return (
    <NavContainer>
      {navItems.map(item => (
        <NavItem 
          to={item.path} 
          key={item.key}
          className={isActive(item.path) ? 'active' : ''}
        >
          {t(item.label, item.fallback)}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default Navigation;