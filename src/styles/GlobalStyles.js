import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%; // Allows using 1rem = 10px for easier calculations, adjust if needed
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }

  body {
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    /* font-family: 'Arial', sans-serif; // Wybierzemy lepszą czcionkę później */
    line-height: 1.6;
    font-size: 1.6rem; // Default font size (16px)
    background-color: #f9fafb; // Jasne tło jako przykład
    color: #333; // Domyślny kolor tekstu
  }

  a {
    text-decoration: none;
    color: inherit; // Linki dziedziczą kolor tekstu
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }
`;

export default GlobalStyles;