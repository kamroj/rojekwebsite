// Central, shared dataset for the Realizations page.
// Used both by the SSG page (Astro) and the interactive React view.

export const REALIZATIONS_DATA = [
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"],
    },
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"],
    },
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"],
    },
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"],
    },
  },
  // Duplicates are kept intentionally for now (demo content / pagination),
  // but data is centralized so it doesn't drift between SSG and React.
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"],
    },
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"],
    },
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"],
    },
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"],
    },
  },
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"],
    },
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"],
    },
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"],
    },
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"],
    },
  },
  {
    img: "/images/realizations/realization1.jpg",
    tags: {
      door: ["interior", "sliding"],
      color: ["ral7013"],
    },
  },
  {
    img: "/images/realizations/realization2.jpg",
    tags: {
      door: ["exterior"],
      color: ["ral9016", "ral9005"],
    },
  },
  {
    img: "/images/realizations/realization3.jpg",
    tags: {
      window: ["wooden", "double-sash"],
      color: ["ral7024"],
    },
  },
  {
    img: "/images/realizations/realization4.jpg",
    tags: {
      window: ["pvc"],
      color: ["ral7016"],
    },
  },
  {
    img: "/images/realizations/realization5.jpg",
    tags: {
      door: ["interior"],
      window: ["wooden"],
      color: ["ral6005"],
    },
  },
];
