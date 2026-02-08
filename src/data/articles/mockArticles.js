// src/data/articles/mockArticles.js
// Local mock data used when Sanity is not configured.
// Shape matches what `src/lib/sanity/articles.js` returns.

/**
 * Minimal “Sanity-like” image object.
 * - `asset.url` is enough for rendering.
 * - metadata dimensions are optional but help avoid CLS.
 */
const img = (url, alt, width = 1600, height = 900) => ({
  alt,
  asset: {
    url,
    metadata: {
      dimensions: {
        width,
        height,
        aspectRatio: width / height,
      },
    },
  },
});

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

/**
 * Very small PortableText mock.
 * We include blocks and images to exercise the renderer.
 */
const mkContent = ({ title, imageUrl }) => ([
  {
    _type: 'block',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: `To jest przykładowy artykuł „${title}”. Poniżej znajdziesz akapit, nagłówek H2 oraz obrazek z podpisem.`,
      },
    ],
  },
  {
    _type: 'block',
    style: 'h2',
    children: [{ _type: 'span', text: 'Sekcja: Dlaczego to ważne?' }],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'W tym miejscu w docelowej wersji będzie pełna treść artykułu z Sanity (Portable Text).',
      },
    ],
  },
  {
    _type: 'image',
    alt: 'Przykładowe zdjęcie w treści artykułu',
    caption: 'Podpis pod zdjęciem (mock)',
    layout: 'full',
    asset: {
      url: imageUrl,
      metadata: {
        dimensions: {
          width: 1600,
          height: 900,
          aspectRatio: 1600 / 900,
        },
        // keep placeholder empty for local images
        lqip: null,
      },
    },
  },
]);

const MOCKS = [
  {
    id: 'mock-article-1',
    slug: 'jak-wybrac-okna-do-domu',
    title: 'Jak wybrać okna do domu? Poradnik i najważniejsze kryteria',
    excerpt:
      'Przegląd kluczowych parametrów okien: izolacyjność, akustyka, bezpieczeństwo i trwałość. Zobacz, na co zwrócić uwagę przed zakupem.',
    featuredImage: img('/images/aboutus/071.png', 'Okna w nowoczesnym wnętrzu', 1200, 800),
    author: 'ROJEK',
    publishedAt: '2026-01-15T10:00:00.000Z',
    publishedAtFormatted: formatDate('2026-01-15T10:00:00.000Z'),
    tags: ['okna', 'poradnik'],
    content: mkContent({
      title: 'Jak wybrać okna do domu?',
      imageUrl: '/images/aboutus/070.png',
    }),
    readingTime: 4,
    seoTitle: 'Jak wybrać okna do domu? | ROJEK',
    seoDescription:
      'Poradnik wyboru okien: Uw, pakiet szybowy, profil, okucia i montaż. Sprawdź najważniejsze kryteria przed zakupem.',
    _assetUrls: ['/images/aboutus/071.png', '/images/aboutus/070.png'],
  },
  {
    id: 'mock-article-2',
    slug: 'drzwi-zewnetrzne-bezpieczenstwo-i-design',
    title: 'Drzwi zewnętrzne: bezpieczeństwo, design i izolacja cieplna',
    excerpt:
      'Jak dobrać drzwi wejściowe, żeby były ciepłe, bezpieczne i pasowały do architektury? Zebraliśmy praktyczne wskazówki.',
    featuredImage: img('/images/aboutus/036.png', 'Drzwi zewnętrzne – detal', 1200, 800),
    author: 'ROJEK',
    publishedAt: '2026-01-28T10:00:00.000Z',
    publishedAtFormatted: formatDate('2026-01-28T10:00:00.000Z'),
    tags: ['drzwi', 'bezpieczeństwo'],
    content: mkContent({
      title: 'Drzwi zewnętrzne: bezpieczeństwo i design',
      imageUrl: '/images/aboutus/071.png',
    }),
    readingTime: 5,
    seoTitle: 'Drzwi zewnętrzne: bezpieczeństwo i design | ROJEK',
    seoDescription:
      'Sprawdź, jakie parametry drzwi wejściowych są najważniejsze: zamek, izolacja, próg, okucia i konstrukcja.',
    _assetUrls: ['/images/aboutus/036.png', '/images/aboutus/071.png'],
  },
];

export const mockArticles = MOCKS;

export const mockArticleSlugs = MOCKS.map((a) => a.slug);

export const getMockArticleBySlug = (slug) => MOCKS.find((a) => a.slug === slug) || null;
