import { paginateItems, getTotalPages } from './pagination.js';
import { getRealizationsPagePath } from './i18n/routing.js';

export const REALIZATIONS_PER_PAGE = 9;

export const paginateRealizations = (items, page) =>
  paginateItems(items, page, REALIZATIONS_PER_PAGE);

export const getRealizationsPagination = ({ lang, currentPage, totalItems }) => {
  const totalPages = getTotalPages(totalItems, REALIZATIONS_PER_PAGE);
  const basePath = getRealizationsPagePath(lang, 1);
  const samplePage2 = getRealizationsPagePath(lang, 2);
  const pagedPrefix = samplePage2.replace(/\/2$/, '');

  return {
    currentPage,
    totalPages,
    basePath,
    pagedPrefix,
  };
};
