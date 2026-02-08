// src/lib/sanity/articles.js
import { getSanityClient } from './client';
import { SANITY_IMAGE_PROJECTION } from './imageProjection.js';
import { isSanityConfigured } from './config.js';
import { getMockArticleBySlug, mockArticles, mockArticleSlugs } from '../../data/articles/mockArticles.js';

/**
 * Calculate estimated reading time based on word count.
 * @param {Array} content - Portable Text content blocks
 * @returns {number} - Reading time in minutes
 */
const calculateReadingTime = (content) => {
  if (!Array.isArray(content)) return 1;
  
  let wordCount = 0;
  content.forEach((block) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      block.children.forEach((child) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).filter(Boolean).length;
        }
      });
    }
  });
  
  const wordsPerMinute = 200;
  const time = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, time); // Minimum 1 minute
};

/**
 * Format date to Polish locale string.
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
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
 * Build article list excerpt from the first text paragraph.
 * Returns first 50 words + "..." when paragraph is longer.
 * @param {Array} content - Portable Text blocks
 * @param {number} maxWords
 * @returns {string}
 */
const buildExcerptFromFirstParagraph = (content, maxWords = 50) => {
  if (!Array.isArray(content)) return '';

  const firstParagraph = content.find(
    (block) =>
      block?._type === 'block' &&
      Array.isArray(block.children) &&
      block.children.some((child) => typeof child?.text === 'string' && child.text.trim().length > 0)
  );

  if (!firstParagraph) return '';

  const paragraphText = firstParagraph.children
    .map((child) => (typeof child?.text === 'string' ? child.text : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  if (!paragraphText) return '';

  const words = paragraphText.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return paragraphText;

  return `${words.slice(0, maxWords).join(' ')}...`;
};

/**
 * Normalize tags from Sanity.
 * Supports:
 * - proper array of strings
 * - single comma-separated string (legacy/editor input)
 */
const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .flatMap((tag) => {
        if (typeof tag === 'string') return tag.split(',');
        if (tag && typeof tag === 'object') {
          const label = tag.label || tag.value;
          return typeof label === 'string' ? label.split(',') : [];
        }
        return [];
      })
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeTagRefs = (tagRefs) => {
  if (!Array.isArray(tagRefs)) return [];
  return tagRefs.filter((tagRef) => typeof tagRef === 'string' && tagRef.trim().length > 0);
};

const normalizeTagValue = (value) => String(value || '').trim().toLowerCase();

/**
 * Fetch paginated list of articles.
 * @param {Object} options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.perPage - Articles per page
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<{articles: Array, total: number, totalPages: number}>}
 */
export const fetchArticlesList = async ({ page = 1, perPage = 6, signal } = {}) => {
  // DEV-friendly fallback: allow preview without Sanity config.
  if (!isSanityConfigured()) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const total = mockArticles.length;
    const totalPages = Math.ceil(total / perPage);
    return {
      articles: mockArticles.slice(start, end),
      total,
      totalPages,
    };
  }

  const sanityClient = getSanityClient();
  if (!sanityClient) return { articles: [], total: 0, totalPages: 0 };

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const query = `
    {
      "articles": *[_type == "article" && defined(publishedAt)] 
        | order(publishedAt desc)
        [$start...$end]
        {
          _id,
          "slug": slug.current,
          title,
          "featuredImage": featuredImage ${SANITY_IMAGE_PROJECTION},
          author,
          publishedAt,
          "tags": tags[]{
            _type == "reference" => @->{
              "label": name
            },
            _type != "reference" => @
          },
          "tagRefs": tags[@._type == "reference"][]._ref,
          "content": content
        },
      "total": count(*[_type == "article" && defined(publishedAt)])
    }
  `;

  let result;
  try {
    result = await sanityClient.fetch(query, { start, end }, { signal });
  } catch (e) {
    // In DEV, allow preview even if Sanity is unreachable / CORS / bad dataset.
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchArticlesList failed, using mock fallback in DEV', e);
      const total = mockArticles.length;
      const totalPages = Math.ceil(total / perPage);
      return {
        articles: mockArticles.slice(start, end),
        total,
        totalPages,
      };
    }
    throw e;
  }
  
  const articles = (result?.articles || []).map((article) => ({
    id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: buildExcerptFromFirstParagraph(article.content),
    featuredImage: article.featuredImage || null,
    author: article.author || '',
    publishedAt: article.publishedAt,
    publishedAtFormatted: formatDate(article.publishedAt),
    tags: normalizeTags(article.tags),
    tagRefs: normalizeTagRefs(article.tagRefs),
    readingTime: calculateReadingTime(article.content),
    _assetUrls: [article.featuredImage?.asset?.url].filter(Boolean),
  }));

  // If Sanity has 0 articles in DEV, fall back to mocks for visual testing.
  if (import.meta.env.DEV && (result?.total || 0) === 0) {
    const total = mockArticles.length;
    const totalPages = Math.ceil(total / perPage);
    return {
      articles: mockArticles.slice(start, end),
      total,
      totalPages,
    };
  }

  const total = result?.total || 0;
  const totalPages = Math.ceil(total / perPage);

  return { articles, total, totalPages };
};

/**
 * Fetch all articles (for SSG build).
 * @param {Object} options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<Array>}
 */
export const fetchAllArticles = async ({ signal } = {}) => {
  // DEV-friendly fallback: allow preview without Sanity config.
  if (!isSanityConfigured()) return mockArticles;

  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  const query = `
    *[_type == "article" && defined(publishedAt)] 
      | order(publishedAt desc)
      {
        _id,
        "slug": slug.current,
        title,
        "featuredImage": featuredImage ${SANITY_IMAGE_PROJECTION},
        author,
        publishedAt,
        "tags": tags[]{
          _type == "reference" => @->{
            "label": name
          },
          _type != "reference" => @
        },
        "tagRefs": tags[@._type == "reference"][]._ref,
        "content": content
      }
  `;

  let articles;
  try {
    articles = await sanityClient.fetch(query, {}, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchAllArticles failed, using mock fallback in DEV', e);
      return mockArticles;
    }
    throw e;
  }

  if (import.meta.env.DEV && (!articles || articles.length === 0)) {
    return mockArticles;
  }
  
  return (articles || []).map((article) => ({
    id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: buildExcerptFromFirstParagraph(article.content),
    featuredImage: article.featuredImage || null,
    author: article.author || '',
    publishedAt: article.publishedAt,
    publishedAtFormatted: formatDate(article.publishedAt),
    tags: normalizeTags(article.tags),
    tagRefs: normalizeTagRefs(article.tagRefs),
    readingTime: calculateReadingTime(article.content),
    _assetUrls: [article.featuredImage?.asset?.url].filter(Boolean),
  }));
};

/**
 * Fetch single article by slug.
 * @param {string} slug - Article slug
 * @param {Object} options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<Object|null>}
 */
export const fetchArticleBySlug = async (slug, { signal } = {}) => {
  // DEV-friendly fallback: allow preview without Sanity config.
  if (!isSanityConfigured()) return getMockArticleBySlug(slug);

  const sanityClient = getSanityClient();
  if (!sanityClient) return null;

  const query = `
    *[_type == "article" && slug.current == $slug][0]{
      _id,
      "slug": slug.current,
      title,
      "featuredImage": featuredImage ${SANITY_IMAGE_PROJECTION},
      author,
      publishedAt,
      "tags": tags[]{
        _type == "reference" => @->{
          "label": name
        },
        _type != "reference" => @
      },
      "tagRefs": tags[@._type == "reference"][]._ref,
      content[]{
        ...,
        _type in ["image", "contentImage"] => {
          ...,
          "asset": asset-> {
            _id,
            url,
            "metadata": metadata {
              dimensions,
              lqip
            }
          }
        }
      },
      seoTitle,
      seoDescription
    }
  `;

  let article;
  try {
    article = await sanityClient.fetch(query, { slug }, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchArticleBySlug failed, using mock fallback in DEV', e);
      return getMockArticleBySlug(slug);
    }
    throw e;
  }
  if (!article) {
    // If Sanity is configured but the document doesn't exist yet, allow mock preview in DEV.
    if (import.meta.env.DEV) return getMockArticleBySlug(slug);
    return null;
  }

  // Collect all image URLs for preloading
  const contentImageUrls = (article.content || [])
    .filter((block) => block._type === 'image' || block._type === 'contentImage')
    .map((img) => img.asset?.url)
    .filter(Boolean);

  return {
    id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: buildExcerptFromFirstParagraph(article.content),
    featuredImage: article.featuredImage || null,
    author: article.author || '',
    publishedAt: article.publishedAt,
    publishedAtFormatted: formatDate(article.publishedAt),
    tags: normalizeTags(article.tags),
    tagRefs: normalizeTagRefs(article.tagRefs),
    content: article.content || [],
    readingTime: calculateReadingTime(article.content),
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || buildExcerptFromFirstParagraph(article.content),
    _assetUrls: [
      article.featuredImage?.asset?.url,
      ...contentImageUrls,
    ].filter(Boolean),
  };
};

/**
 * Fetch related articles based on shared tags.
 * Falls back to random articles if not enough matches.
 * @param {string} currentSlug - Current article slug to exclude
 * @param {Array} tags - Tags to match
 * @param {number} limit - Number of articles to return
 * @param {Object} options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<Array>}
 */
export const fetchRelatedArticles = async (currentSlug, tagRefs = [], limit = 4, { signal } = {}) => {
  // DEV-friendly fallback: allow preview without Sanity config.
  if (!isSanityConfigured()) {
    return mockArticles
      .filter((a) => a.slug !== currentSlug)
      .slice(0, limit);
  }

  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  // First, try to get articles with matching tags
  const normalizedTagRefs = normalizeTagRefs(tagRefs);

  const queryWithTags = `
    *[_type == "article" && slug.current != $currentSlug && defined(publishedAt) && count(tags[@._ref in $tagRefs]) > 0]
      | order(count(tags[@._ref in $tagRefs]) desc, publishedAt desc)
      [0...$limit]
      {
        _id,
        "slug": slug.current,
        title,
        "featuredImage": featuredImage ${SANITY_IMAGE_PROJECTION},
        author,
        publishedAt,
        "tags": tags[]{
          _type == "reference" => @->{
            "label": name
          },
          _type != "reference" => @
        },
        "tagRefs": tags[@._type == "reference"][]._ref,
        "content": content
      }
  `;

  let articles;
  try {
    if (normalizedTagRefs.length > 0) {
      articles = await sanityClient.fetch(
        queryWithTags,
        { currentSlug, tagRefs: normalizedTagRefs, limit },
        { signal }
      );
    } else {
      articles = [];
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchRelatedArticles failed, using mock fallback in DEV', e);
      return mockArticles
        .filter((a) => a.slug !== currentSlug)
        .slice(0, limit);
    }
    throw e;
  }

  // If not enough articles with matching tags, fill with random
  if ((articles?.length || 0) < limit) {
    const existingSlugs = [currentSlug, ...(articles || []).map((a) => a.slug)];
    const remaining = limit - (articles?.length || 0);

    const queryRandom = `
      *[_type == "article" && !(slug.current in $existingSlugs) && defined(publishedAt)]
        | order(publishedAt desc)
        [0...$remaining]
        {
          _id,
          "slug": slug.current,
          title,
          "featuredImage": featuredImage ${SANITY_IMAGE_PROJECTION},
          author,
          publishedAt,
          "tags": tags[]{
            _type == "reference" => @->{
              "label": name
            },
            _type != "reference" => @
          },
          "tagRefs": tags[@._type == "reference"][]._ref,
          "content": content
        }
    `;

    let randomArticles;
    try {
      randomArticles = await sanityClient.fetch(
        queryRandom,
        { existingSlugs, remaining },
        { signal }
      );
    } catch (e) {
      if (import.meta.env.DEV) {
        // Just return what we already have.
        return (articles || [])
          .map((article) => ({
            id: article._id,
            slug: article.slug,
            title: article.title,
            excerpt: buildExcerptFromFirstParagraph(article.content),
            featuredImage: article.featuredImage || null,
            author: article.author || '',
            publishedAt: article.publishedAt,
            publishedAtFormatted: formatDate(article.publishedAt),
            tags: normalizeTags(article.tags),
            tagRefs: normalizeTagRefs(article.tagRefs),
            readingTime: calculateReadingTime(article.content),
            _assetUrls: [article.featuredImage?.asset?.url].filter(Boolean),
          }))
          .filter(Boolean)
          .slice(0, limit);
      }
      throw e;
    }

    articles = [...(articles || []), ...(randomArticles || [])];
  }

  return (articles || []).map((article) => ({
    id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: buildExcerptFromFirstParagraph(article.content),
    featuredImage: article.featuredImage || null,
    author: article.author || '',
    publishedAt: article.publishedAt,
    publishedAtFormatted: formatDate(article.publishedAt),
    tags: normalizeTags(article.tags),
    tagRefs: normalizeTagRefs(article.tagRefs),
    readingTime: calculateReadingTime(article.content),
    _assetUrls: [article.featuredImage?.asset?.url].filter(Boolean),
  }));
};

/**
 * Fetch all article slugs (for SSG getStaticPaths).
 * @param {Object} options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<Array<string>>}
 */
export const fetchAllArticleSlugs = async ({ signal } = {}) => {
  // DEV-friendly fallback: allow preview without Sanity config.
  if (!isSanityConfigured()) return mockArticleSlugs;

  const sanityClient = getSanityClient();
  if (!sanityClient) return [];

  const query = `
    *[_type == "article" && defined(publishedAt) && defined(slug.current)]{
      "slug": slug.current
    }
  `;

  let result;
  try {
    result = await sanityClient.fetch(query, {}, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchAllArticleSlugs failed, using mock fallback in DEV', e);
      return mockArticleSlugs;
    }
    throw e;
  }
  const slugs = (result || []).map((item) => item.slug).filter(Boolean);

  // If Sanity has 0 articles in DEV, fall back to mocks for visual testing.
  if (import.meta.env.DEV && slugs.length === 0) return mockArticleSlugs;

  return slugs;
};

/**
 * Fetch all articles for a given tag label (case-insensitive).
 * Filtering is done in JS for consistency between Sanity and mock fallback.
 * @param {string} tag
 * @param {Object} options
 * @param {AbortSignal} options.signal
 * @returns {Promise<Array>}
 */
export const fetchArticlesByTag = async (tag, { signal } = {}) => {
  const normalizedTag = normalizeTagValue(tag);
  if (!normalizedTag) return [];

  const allArticles = await fetchAllArticles({ signal });
  return allArticles.filter((article) =>
    (article.tags || []).some((articleTag) => normalizeTagValue(articleTag) === normalizedTag)
  );
};

/**
 * Fetch articles index page settings (header image/title/subtitle).
 * Singleton document: articlesPage
 * @param {Object} options
 * @param {AbortSignal} options.signal - Abort signal
 * @returns {Promise<{headerImage: any, headerTitle: string, headerSubtitle: string}>}
 */
export const fetchArticlesPageSettings = async ({ signal } = {}) => {
  const fallback = {
    headerImage: null,
    headerTitle: 'Artykuły',
    headerSubtitle: 'Wiedza i inspiracje ze świata stolarki budowlanej',
  };

  if (!isSanityConfigured()) return fallback;

  const sanityClient = getSanityClient();
  if (!sanityClient) return fallback;

  const query = `
    *[_type == "articlesPage" && _id == "articlesPage"][0]{
      "headerImage": headerImage ${SANITY_IMAGE_PROJECTION},
      headerTitle,
      headerSubtitle
    }
  `;

  let settings;
  try {
    settings = await sanityClient.fetch(query, {}, { signal });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[articles] fetchArticlesPageSettings failed, using fallback in DEV', e);
      return fallback;
    }
    throw e;
  }

  return {
    headerImage: settings?.headerImage || null,
    headerTitle: settings?.headerTitle || fallback.headerTitle,
    headerSubtitle: settings?.headerSubtitle || fallback.headerSubtitle,
  };
};