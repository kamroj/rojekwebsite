export const getTotalPages = (totalItems, perPage) => {
  const safeTotal = Number.isFinite(totalItems) ? Math.max(0, Number(totalItems)) : 0;
  const safePerPage = Number.isFinite(perPage) ? Math.max(1, Number(perPage)) : 1;
  return Math.max(1, Math.ceil(safeTotal / safePerPage));
};

export const getSafePage = (page, totalPages) => {
  const safeTotal = Number.isFinite(totalPages) ? Math.max(1, Number(totalPages)) : 1;
  const numeric = Number.isFinite(page) ? Number(page) : Number.parseInt(String(page || '1'), 10);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(Math.max(1, Math.trunc(numeric)), safeTotal);
};

export const paginateItems = (items, page, perPage) => {
  const list = Array.isArray(items) ? items : [];
  const totalPages = getTotalPages(list.length, perPage);
  const currentPage = getSafePage(page, totalPages);
  const safePerPage = Number.isFinite(perPage) ? Math.max(1, Number(perPage)) : 1;

  const start = (currentPage - 1) * safePerPage;
  const end = start + safePerPage;

  return {
    items: list.slice(start, end),
    currentPage,
    totalPages,
    totalItems: list.length,
    perPage: safePerPage,
  };
};