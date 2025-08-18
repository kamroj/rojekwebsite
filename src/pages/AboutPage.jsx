// src/pages/AboutPage.jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Section from '../components/common/Section';
import HistorySection from '../components/home/HistorySection';

const AboutContent = styled.div`
  padding: 2rem 0;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
  }

  p {
    font-size: 1.7rem;
    line-height: 1.7;
    max-width: 800px;
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
  }
`;

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HistorySection />
    </>
  );
};

export default AboutPage;
