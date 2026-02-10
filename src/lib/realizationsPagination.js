import { paginateItems, getTotalPages } from './pagination.js';
import { getRealizationsPagePath } from './i18n/routing.js';

export const REALIZATIONS_PER_PAGE = 9;

export const getRealizationsTotalPages = (totalItems) =>
  getTotalPages(totalItems, REALIZATIONS_PER_PAGE);

export const paginateRealizations = (items, page) => {
  const list = Array.isArray(items) ? items : [];
  const totalPages = getRealizationsTotalPages(list.length);

  const numericPage = Number.isFinite(page)
    ? Number(page)
    : Number.parseInt(String(page || '1'), 10);
  const currentPage = Number.isFinite(numericPage)
    ? Math.min(Math.max(1, Math.trunc(numericPage)), totalPages)
    : 1;

  const start = (currentPage - 1) * REALIZATIONS_PER_PAGE;
  const end = start + REALIZATIONS_PER_PAGE;
  const pageItems = list.slice(start, end);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    totalItems: list.length,
    perPage: REALIZATIONS_PER_PAGE,
  };
};

export const getRealizationsPagination = ({ lang, currentPage, totalItems }) => {
  const totalPages = getRealizationsTotalPages(totalItems);
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
