import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../views/HomeView';
import RealizationsPage2 from '../views/Realizations2View';
import AboutUsPage from '../views/AboutUsView';
import ContactPage from '../views/ContactView';
import HsConfiguratorPage from '../views/HsConfiguratorView';
import { ROUTES } from '../constants';
import ProductCategoryPage from '../views/ProductCategoryView';
import ProductDetailPage from '../views/ProductDetailView';
import ProductsPage from '../views/ProductsView';
import { productCategories, productDetailsByType } from '../data/products';
import I18nRouteSync from './I18nRouteSync';
import { getCategoryKeyFromAnySlug, getProductDetailPath, getProductCategoryPath, getSectionPath, SECTION_SLUGS } from '../lib/i18n/routing';

const cloneWithPaths = (routes, mapping) => {
  return {
    ...routes,
    children: routes.children.map((c) => {
      if (!c.path) return c

      const next = {...c, path: mapping[c.path] || c.path}

      // products subtree
      if (c.path === SECTION_SLUGS.pl.products && c.children) {
        next.children = c.children.map((cc) => ({...cc}))
      }

      return next
    }),
  }
}

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
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <NotFoundContainer>
      <h1>{t('errors.404.title')}</h1>
      <p>{t('errors.404.message')}</p>
      <BackButton href={getSectionPath(lang, 'home')}>
        {t('buttons.backToHome')}
      </BackButton>
    </NotFoundContainer>
  );
};

const ErrorBoundary = ({ error }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <NotFoundContainer>
      <h1>{t('errors.general')}</h1>
      <p>{error?.message || t('errors.general')}</p>
      <BackButton href={getSectionPath(lang, 'home')}>
        {t('buttons.backToHome')}
      </BackButton>
    </NotFoundContainer>
  );
};

const appRoutes = {
  element: <MainLayout />,
  errorElement: <ErrorBoundary />,
  handle: {
    crumb: {to: '/', labelKey: 'breadcrumbs.home', defaultLabel: 'Home'},
  },
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: SECTION_SLUGS.pl.realizations,
      element: <RealizationsPage2 />,
      handle: {
        crumb: {
          // base route key (localized later in AppBreadcrumbs)
          to: '/realizacje',
          labelKey: 'breadcrumbs.realizations',
          defaultLabel: 'Realizations',
        },
      },
    },
    {
      path: SECTION_SLUGS.pl.about,
      element: <AboutUsPage />,
      handle: {
        crumb: {to: '/o-firmie', labelKey: 'breadcrumbs.about', defaultLabel: 'About'},
      },
    },
    {
      path: SECTION_SLUGS.pl.contact,
      element: <ContactPage />,
      handle: {
        crumb: {to: '/kontakt', labelKey: 'breadcrumbs.contact', defaultLabel: 'Contact'},
      },
    },
    {
      path: SECTION_SLUGS.pl.hsConfigurator,
      element: <HsConfiguratorPage />,
      handle: {
        crumb: {
          to: '/konfigurator-hs',
          labelKey: 'breadcrumbs.configurator',
          defaultLabel: 'HS Configurator',
        },
      },
    },
    {
      path: SECTION_SLUGS.pl.products,
      handle: {
        crumb: {to: '/produkty', labelKey: 'breadcrumbs.products', defaultLabel: 'Products'},
      },
      children: [
        {
          index: true,
          element: <ProductsPage />,
        },
        {
          path: ':category',
          handle: {
            crumb: (match) => {
              const rawSlug = match.params.category
              const categoryKey = getCategoryKeyFromAnySlug(rawSlug) || rawSlug
              const c = productCategories[categoryKey];
              return {
                to: getProductCategoryPath('pl', categoryKey),
                labelKey: `breadcrumbs.categories.${categoryKey}`,
                defaultLabel: c?.pageTitle || categoryKey,
              };
            },
          },
          children: [
            {
              index: true,
              element: <ProductCategoryPage />,
            },
            {
              path: ':productId',
              element: <ProductDetailPage />,
              handle: {
                crumb: (match) => {
                  const rawSlug = match.params.category
                  const categoryKey = getCategoryKeyFromAnySlug(rawSlug) || rawSlug
                  const c = productCategories[categoryKey];
                  const detailType = c?.detailType;
                  const p = detailType
                    ? productDetailsByType?.[detailType]?.[match.params.productId]
                    : undefined;
                  return {
                    to: getProductDetailPath('pl', categoryKey, match.params.productId),
                    label: p?.name || match.params.productId,
                  };
                },
              },
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};

const router = createBrowserRouter([
  // Default language (PL) - no prefix
  {
    path: '/',
    element: <I18nRouteSync lang="pl" />,
    children: [appRoutes],
  },

  // Other languages - with prefix
  {
    path: '/en',
    element: <I18nRouteSync lang="en" />,
    children: [
      {
        ...cloneWithPaths(appRoutes, {
          [SECTION_SLUGS.pl.realizations]: SECTION_SLUGS.en.realizations,
          [SECTION_SLUGS.pl.about]: SECTION_SLUGS.en.about,
          [SECTION_SLUGS.pl.contact]: SECTION_SLUGS.en.contact,
          [SECTION_SLUGS.pl.hsConfigurator]: SECTION_SLUGS.en.hsConfigurator,
          [SECTION_SLUGS.pl.products]: SECTION_SLUGS.en.products,
        }),
      },
    ],
  },
  {
    path: '/de',
    element: <I18nRouteSync lang="de" />,
    children: [
      {
        ...cloneWithPaths(appRoutes, {
          [SECTION_SLUGS.pl.realizations]: SECTION_SLUGS.de.realizations,
          [SECTION_SLUGS.pl.about]: SECTION_SLUGS.de.about,
          [SECTION_SLUGS.pl.contact]: SECTION_SLUGS.de.contact,
          [SECTION_SLUGS.pl.hsConfigurator]: SECTION_SLUGS.de.hsConfigurator,
          [SECTION_SLUGS.pl.products]: SECTION_SLUGS.de.products,
        }),
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
