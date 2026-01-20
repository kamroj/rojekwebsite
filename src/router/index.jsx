import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import RealizationsPage2 from '../pages/RealizationsPage2';
import AboutUsPage from '../pages/AboutUsPage';
import ContactPage from '../pages/ContactPage';
import HsConfiguratorPage from '../pages/HsConfiguratorPage';
import { ROUTES } from '../constants';
import ProductCategoryPage from '../pages/ProductCategoryPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductsPage from '../pages/ProductsPage';
import { productCategories, productDetailsByType } from '../data/products';

const NotFoundContainer = styled.div`
  padding: ${({ theme }) => theme.spacings.xlarge} ${({ theme }) => theme.spacings.medium};
  text-align: center;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;

  h1 {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
    font-weight: 600;
  }

  p {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacings.large};
    line-height: 1.6;
  }
`;

const BackButton = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacings.medium} ${({ theme }) => theme.spacings.large};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1.6rem;
  transition: all ${({ theme }) => theme.transitions.default};
  border: 2px solid ${({ theme }) => theme.colors.secondary};

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <NotFoundContainer>
      <h1>{t('errors.404.title')}</h1>
      <p>{t('errors.404.message')}</p>
      <BackButton href={ROUTES.HOME}>
        {t('buttons.backToHome')}
      </BackButton>
    </NotFoundContainer>
  );
};

const ErrorBoundary = ({ error }) => {
  const { t } = useTranslation();

  return (
    <NotFoundContainer>
      <h1>{t('errors.general')}</h1>
      <p>{error?.message || t('errors.general')}</p>
      <BackButton href={ROUTES.HOME}>
        {t('buttons.backToHome')}
      </BackButton>
    </NotFoundContainer>
  );
};

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    handle: {
      crumb: { to: '/', labelKey: 'breadcrumbs.home', defaultLabel: 'Strona główna' }
    },
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.REALIZATIONS.slice(1),
        element: <RealizationsPage2 />,
        handle: {
          crumb: { to: ROUTES.REALIZATIONS, labelKey: 'breadcrumbs.realizations', defaultLabel: 'Realizacje' }
        }
      },
      {
        path: ROUTES.ABOUT.slice(1),
        element: <AboutUsPage />,
        handle: {
          crumb: { to: ROUTES.ABOUT, labelKey: 'breadcrumbs.about', defaultLabel: 'O nas' }
        }
      },
      {
        path: ROUTES.CONTACT.slice(1),
        element: <ContactPage />,
        handle: {
          crumb: { to: ROUTES.CONTACT, labelKey: 'breadcrumbs.contact', defaultLabel: 'Kontakt' }
        }
      },
      {
        path: ROUTES.HS_CONFIGURATOR.slice(1),
        element: <HsConfiguratorPage />,
        handle: {
          crumb: { to: ROUTES.HS_CONFIGURATOR, labelKey: 'breadcrumbs.configurator', defaultLabel: 'Konfigurator HS' }
        }
      },
      {
        path: 'produkty',
        handle: {
          crumb: { to: ROUTES.PRODUCTS, labelKey: 'breadcrumbs.products', defaultLabel: 'Produkty' }
        },
        children: [
          {
            index: true,
            element: <ProductsPage />
          },
          {
            path: ':category',
            handle: {
              crumb: (match) => {
                const c = productCategories[match.params.category];
                return {
                  to: `/produkty/${match.params.category}`,
                  label: c?.pageTitle || match.params.category
                };
              }
            },
            children: [
              {
                index: true,
                element: <ProductCategoryPage />
              },
              {
                path: ':productId',
                element: <ProductDetailPage />,
                handle: {
                  crumb: (match) => {
                    const c = productCategories[match.params.category];
                    const detailType = c?.detailType;
                    const p = detailType
                      ? productDetailsByType?.[detailType]?.[match.params.productId]
                      : undefined;
                    return {
                      to: `/produkty/${match.params.category}/${match.params.productId}`,
                      label: p?.name || match.params.productId
                    };
                  }
                }
              }
            ]
          },
        ]
      },
      { 
        path: '*', 
        element: <NotFoundPage /> 
      }
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
