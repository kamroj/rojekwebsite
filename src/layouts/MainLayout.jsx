// src/layouts/MainLayout.jsx
import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Main layout wrapper
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Main content area
const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

// MainLayout component wraps all pages with Header and Footer
const MainLayout = () => {
  return (
    <LayoutWrapper>
      <Header />
      <MainContent>
        <Outlet /> {/* Child routes will be rendered here */}
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;