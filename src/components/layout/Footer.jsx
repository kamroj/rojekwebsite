import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
  text-align: center;
  /* Usunięto margin-top: auto; - nie jest już potrzebne w tej strukturze */
`;

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <p>{t('footer.copy', { year: currentYear })}</p>
    </FooterWrapper>
  );
};

export default Footer;