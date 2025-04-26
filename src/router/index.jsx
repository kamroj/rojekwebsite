import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import RealizationsPage from '../pages/RealizationsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
// Import other pages as needed, e.g., NotFoundPage

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // MainLayout is the parent for ALL these routes now
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true, // HomePage is the default route for '/'
        element: <HomePage />,
      },
      {
        path: 'realizations',
        element: <RealizationsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      // { path: '*', element: <NotFoundPage /> } // Optional 404
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;