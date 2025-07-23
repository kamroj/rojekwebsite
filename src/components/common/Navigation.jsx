import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

const BaseNavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacings.large};
  justify-content: center;
  flex-grow: 1;
`;

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

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

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

export const HeaderNavContainer = styled(BaseNavContainer)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const HeaderNavItem = styled(BaseNavItem)`
  color: ${({ theme }) => theme.colors.text};
`;

export const IntroNavContainer = styled(BaseNavContainer)`
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.medium};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacings.large};
  }
`;

export const IntroNavItem = styled(BaseNavItem)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.6rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`;

const Navigation = ({ variant = 'header' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const NavContainer = variant === 'intro' ? IntroNavContainer : HeaderNavContainer;
  const NavItem = variant === 'intro' ? IntroNavItem : HeaderNavItem;
  
  const navItems = [
    { 
      key: 'home', 
      path: ROUTES.HOME, 
      label: 'nav.home'
    },
    { 
      key: 'realizations', 
      path: ROUTES.REALIZATIONS, 
      label: 'nav.realizations'
    },
    { 
      key: 'about', 
      path: ROUTES.ABOUT, 
      label: 'nav.about'
    },
    { 
      key: 'contact', 
      path: ROUTES.CONTACT, 
      label: 'nav.contact'
    }
  ];
  
  const isActive = (path) => {
    if (path === ROUTES.HOME && location.pathname === ROUTES.HOME) {
      return true;
    }
    return path !== ROUTES.HOME && location.pathname.startsWith(path);
  };
  
  return (
    <NavContainer role="navigation" aria-label={t('nav.mainNavigation', 'Main navigation')}>
      {navItems.map(item => (
        <NavItem 
          to={item.path} 
          key={item.key}
          className={isActive(item.path) ? 'active' : ''}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          {t(item.label)}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default Navigation;
