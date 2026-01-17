// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Zmienne dla menu mobilnego */
  :root {
    --header-height: 80px;
  }
  
  /* Reset and base styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Base font sizing - 1rem = 10px */
  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    line-height: 1.6;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    background-color: #fbfbfb;
    min-height: 100%;
    overflow-x: hidden;
    position: relative;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Reset link styles */
  a {
    text-decoration: none;
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};
  }

  /* Reset list styles */
  ul, ol {
    list-style: none;
  }

  /* Reset button styles */
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: 3.6rem;
  }

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 2.4rem;
  }

  h4 {
    font-size: 2rem;
  }

  p {
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Remove all focus outlines */
  * {
    outline: none;
  }

  /* Remove animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
