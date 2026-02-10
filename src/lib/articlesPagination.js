import { paginateItems, getTotalPages } from './pagination.js';
import { getArticlesIndexPath, getArticlesPagePath } from './i18n/routing.js';

export const ARTICLES_PER_PAGE = 6;

export const getArticlesTotalPages = (totalItems) =>
  getTotalPages(totalItems, ARTICLES_PER_PAGE);

export const paginateArticles = (items, page) => {
  const list = Array.isArray(items) ? items : [];
  return paginateItems(list, page, ARTICLES_PER_PAGE);
};

export const getArticlesPagination = ({ lang, currentPage, totalItems }) => {
  const totalPages = getArticlesTotalPages(totalItems);
  const basePath = getArticlesIndexPath(lang);
  const samplePage2 = getArticlesPagePath(lang, 2);
  const pagedPrefix = samplePage2.replace(/\/2$/, '');

  return {
    currentPage,
    totalPages,
    basePath,
    pagedPrefix,
  };
};
