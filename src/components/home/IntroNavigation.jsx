import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const NavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacings.large};
  justify-content: center;
  flex-grow: 1;
`;

const NavItem = styled.a`
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 5px 0;
  position: relative;
`;

const IntroNavigation = () => {
  const { t } = useTranslation();

  return (
    <NavContainer>
      <NavItem href="/realizations">oferta</NavItem>
      <NavItem href="/realizations">{t('nav.realizations')}</NavItem>
      <NavItem href="/about">{t('nav.about')}</NavItem>
      <NavItem href="/contact">{t('nav.contact')}</NavItem>
    </NavContainer>
  );
};

export default IntroNavigation;