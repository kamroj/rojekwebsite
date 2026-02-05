// PostCSS config for Vite/Astro.
//
// This project uses CSS Custom Media queries in multiple CSS Modules, e.g.:
//   @media (--bp-sm) { ... }
//
// `@custom-media` definitions live in `src/styles/tokens.css`.
// Vite doesn't expand custom media by default, so without this plugin responsive
// rules would be ignored (breaking mobile layouts).

module.exports = {
  plugins: {
    // Make @custom-media definitions from tokens.css available to every CSS file
    // (CSS Modules are processed per-file, so without this they won't see the definitions).
    '@csstools/postcss-global-data': {
      files: ['src/styles/tokens.css'],
    },
    // Expand @media (--bp-*) into regular media queries.
    'postcss-custom-media': {},
  },
};
