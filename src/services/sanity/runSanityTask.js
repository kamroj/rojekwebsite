// src/services/sanity/runSanityTask.js

/**
 * Small helper to integrate Sanity fetch + ResourceCollector global loading.
 *
 * Usage:
 *   const data = await runSanityTask({
 *     beginTask,
 *     endTask,
 *     addResources,
 *     taskName: 'windows:list',
 *     fetcher: () => fetchWindowProductsList(lang),
 *     extractAssetUrls: (data) => data.flatMap((x) => x._assetUrls || []),
 *   })
 */
export const runSanityTask = async ({
  beginTask,
  endTask,
  addResources,
  taskName,
  fetcher,
  extractAssetUrls,
  signal,
}) => {
  beginTask?.(taskName);
  try {
    // Convention: fetcher receives a context object.
    const data = await fetcher?.({ signal });
    const urls = extractAssetUrls ? extractAssetUrls(data) : [];
    // If request was aborted, do not enqueue assets.
    if (!signal?.aborted && addResources && urls?.length) addResources(urls);
    return data;
  } finally {
    endTask?.(taskName);
  }
};
