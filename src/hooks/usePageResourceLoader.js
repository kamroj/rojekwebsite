import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useResourcePreloader from './useResourcePreloader';
import { collectPageResources, getUniqueResources } from '../utils/resourceCollector';

const usePageResourceLoader = (additionalData = {}) => {
  const location = useLocation();

  // Zbierz zasoby dla aktualnej strony
  const resources = useMemo(() => {
    const pageResources = collectPageResources(location.pathname, additionalData);
    return getUniqueResources(pageResources);
  }, [location.pathname, JSON.stringify(additionalData)]);

  // Użyj generycznego preloadera zasobów
  const {
    resourcesLoaded,
    loadedCount,
    totalCount,
    progress,
    loadedResources,
    failedResources
  } = useResourcePreloader(resources);

  return {
    resourcesLoaded,
    loadedCount,
    totalCount,
    progress,
    loadedResources,
    failedResources,
    resources, // Zwracamy też listę zasobów dla debugowania
    // Zachowujemy kompatybilność z poprzednim API
    imagesLoaded: resourcesLoaded
  };
};

export default usePageResourceLoader;
