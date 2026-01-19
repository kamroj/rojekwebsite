// src/styles/theme.js
const theme = {
  colors: {
    primary: '#004605',         // Main primary color (blue)
    secondary: '#017e54',       // Secondary color (green)
    accent: '#e6c619',          // Accent color (yellow - used for hover states)
    background: '#ffffff',      // Base background color
    backgroundAlt: '#f9fafb',   // Alternative background for sections
    text: '#000000ff',            // Main text color
    textLight: '#f8f9fa',       // Light text (for dark backgrounds)
    textMuted: '#555',          // Muted/secondary text color
    border: '#dee2e6',          // Border color
    borderAccent: '#017e543f',  // Semi-transparent border accent
    overlay: 'rgba(0, 0, 0, 0.85)', // Dark overlay
    galleryOverlay: 'rgba(0, 0, 0, 0.65)',   // Gallery overlay
    videoBackground: '#e0e0e0', // Video background placeholder color
    bottleGreen: '#001308',     // Special bottle green color
    bottleGreenLight: '#074120' // Lighter bottle green
  },
  fonts: {
    main: '"Quicksand", sans-serif',
    heading: '"Quicksand", sans-serif',
  },
  spacings: {
    xsmall: '0.4rem',
    small: '0.8rem',
    medium: '1.6rem',
    large: '3.2rem',
    xlarge: '6.4rem'
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease-out',
    fast: '0.2s ease-in'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.2)',
    large: '0 4px 12px rgba(30, 62, 44, 0.73)',
  },
  layout: {
    headerHeight: '80px',
    maxWidth: '1200px'
  }
};
  
export default theme;