// src/router/index.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import RealizationsPage from '../pages/RealizationsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

// Create 404 page
const NotFoundPage = () => (
  <div style={{ 
    padding: '5rem 2rem', 
    textAlign: 'center', 
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h1>404 - Strona nie znaleziona</h1>
    <p>Przepraszamy, strona której szukasz nie istnieje.</p>
    <a href="/" style={{ marginTop: '2rem', padding: '0.8rem 1.6rem', backgroundColor: '#017e54', color: 'white', borderRadius: '4px' }}>
      Wróć do strony głównej
    </a>
  </div>
);

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // HomePage is default for '/'
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
      { 
        path: '*', 
        element: <NotFoundPage /> 
      }
    ],
  },
]);

// Main router component
const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;