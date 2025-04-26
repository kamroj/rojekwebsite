// src/components/layout/Footer.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  
  p {
    margin-bottom: 0;
    font-size: 1.4rem;
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <p>{t('footer.copy', { year: currentYear })}</p>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;