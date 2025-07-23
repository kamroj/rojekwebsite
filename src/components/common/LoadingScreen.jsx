import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 10%, #2d2d2d 50%, #00412b 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${props => props.$isHiding ? fadeOut : fadeIn} 0.5s ease-in-out;
  
  ${props => props.$isHiding && `
    pointer-events: none;
  `}
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.large};
  text-align: center;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacings.medium};
`;

const Logo = styled.img`
  width: 160px;
  height: auto;
  margin-bottom: ${({ theme }) => theme.spacings.medium};
  opacity: 0.9;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(1, 126, 84, 0.3);
  border-top: 3px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0;
  opacity: 0.8;
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin-top: ${({ theme }) => theme.spacings.medium};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #017e54, #07be56);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ProgressText = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.4rem;
  margin-top: ${({ theme }) => theme.spacings.small};
  opacity: 0.7;
  text-align: center;
`;

const LoadingScreen = ({ 
  isVisible = true, 
  isHiding = false, 
  progress = 0, 
  loadedCount = 0, 
  totalCount = 0 
}) => {
  const { t } = useTranslation();

  // Don't render if not visible and not hiding
  if (!isVisible && !isHiding) return null;

  return (
    <LoadingOverlay $isHiding={isHiding}>
      <LoadingContent>
        <Logo 
          src="/images/logo.png" 
          alt={t('nav.logoAlt', 'ROJEK Logo')}
        />
        
        <Spinner />
        
        <LoadingText>
          {t('loading', 'Ładowanie...')}
        </LoadingText>
        
        {totalCount > 0 && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>
            <ProgressText>
              {loadedCount} / {totalCount} {t('loading.resources', 'zasobów')}
            </ProgressText>
          </ProgressContainer>
        )}
      </LoadingContent>
    </LoadingOverlay>
  );
};

export default LoadingScreen;
