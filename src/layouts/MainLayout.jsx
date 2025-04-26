import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Ensure layout takes at least full viewport height
`;

const MainContent = styled.main`
  flex-grow: 1; // Allows main content to expand and push footer down
  /* padding: ${({ theme }) => theme.spacings.large} 0; // Add some top/bottom padding */
`;

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