import { useMemo, useState, useEffect, useRef } from 'react';

import { RESOURCE_TYPES, getResourceType } from '../utils/resourceTypes.js';

// Funkcja do ładowania pojedynczego zasobu
const loadResource = (url, type) => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case RESOURCE_TYPES.IMAGE: {
        const img = new Image();
        img.decoding = 'async';
        let timeoutId;

        const handleLoad = () => {
          cleanup();
          resolve({ url, type, loaded: true });
        };

        const handleError = () => {
          cleanup();
          reject({ url, type, error: 'Failed to load image' });
        };

        const cleanup = () => {
          img.onload = null;
          img.onerror = null;
          if (timeoutId) clearTimeout(timeoutId);
        };

        img.onload = handleLoad;
        img.onerror = handleError;

        // Timeout fallback to prevent getting stuck if 'load' never fires
        timeoutId = setTimeout(() => {
          cleanup();
          resolve({ url, type, loaded: true, timedOut: true });
        }, 8000);

        img.src = url;
        break;
      }
      
      case RESOURCE_TYPES.VIDEO: {
        const video = document.createElement('video');
        // Use 'auto' so 'loadeddata' reliably fires across browsers
        video.preload = 'auto';

        let timeoutId;

        const handleLoaded = () => {
          cleanup();
          resolve({ url, type, loaded: true });
        };

        const handleError = () => {
          cleanup();
          reject({ url, type, error: 'Failed to load video' });
        };

        const cleanup = () => {
          video.removeEventListener('loadeddata', handleLoaded);
          video.removeEventListener('canplay', handleLoaded);
          video.removeEventListener('error', handleError);
          if (timeoutId) clearTimeout(timeoutId);
          video.src = '';
          video.load();
        };

        video.addEventListener('loadeddata', handleLoaded);
        video.addEventListener('canplay', handleLoaded);
        video.addEventListener('error', handleError);

        // Timeout fallback to avoid stuck loader on some platforms
        timeoutId = setTimeout(() => {
          cleanup();
          resolve({ url, type, loaded: true, timedOut: true });
        }, 12000);

        video.src = url;
        video.load();
        break;
      }
      
      case RESOURCE_TYPES.AUDIO: {
        const audio = new Audio();
        audio.preload = 'auto';

        let timeoutId;

        const handleLoaded = () => {
          cleanup();
          resolve({ url, type, loaded: true });
        };

        const handleError = () => {
          cleanup();
          reject({ url, type, error: 'Failed to load audio' });
        };

        const cleanup = () => {
          audio.removeEventListener('loadeddata', handleLoaded);
          audio.removeEventListener('canplay', handleLoaded);
          audio.removeEventListener('error', handleError);
          if (timeoutId) clearTimeout(timeoutId);
          audio.src = '';
          audio.load();
        };

        audio.addEventListener('loadeddata', handleLoaded);
        audio.addEventListener('canplay', handleLoaded);
        audio.addEventListener('error', handleError);

        // Timeout fallback to avoid stuck loader on some platforms
        timeoutId = setTimeout(() => {
          cleanup();
          resolve({ url, type, loaded: true, timedOut: true });
        }, 12000);

        audio.src = url;
        audio.load();
        break;
      }
      
      default:
        reject({ url, type, error: 'Unsupported resource type' });
    }
  });
};

const useResourcePreloader = (resources = []) => {
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadedResources, setLoadedResources] = useState([]);
  const [failedResources, setFailedResources] = useState([]);
  const loadedCountRef = useRef(0);
  const isLoadingRef = useRef(false);

  const stableResources = useMemo(() => {
    if (!Array.isArray(resources)) return [];
    // Normalize into a predictable shape so we can safely depend on it.
    return resources
      .map((resource) => {
        if (typeof resource === 'string') {
          return { url: resource, type: getResourceType(resource) };
        }
        const url = resource?.url;
        if (!url) return null;
        return { url, type: resource?.type || getResourceType(url) };
      })
      .filter(Boolean);
  }, [resources]);

  useEffect(() => {
    // Jeśli brak zasobów, oznacz jako załadowane
    if (!stableResources || stableResources.length === 0) {
      setResourcesLoaded(true);
      setTotalCount(0);
      setLoadedCount(0);
      setLoadedResources([]);
      setFailedResources([]);
      return;
    }

    // Prevent multiple simultaneous loading sessions
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setTotalCount(stableResources.length);
    setLoadedCount(0);
    setResourcesLoaded(false);
    setLoadedResources([]);
    setFailedResources([]);
    loadedCountRef.current = 0;

    // Ładuj wszystkie zasoby
    const resourcePromises = stableResources.map(({ url, type }) => {
      return loadResource(url, type)
        .then(result => {
          loadedCountRef.current++;
          setLoadedCount(loadedCountRef.current);
          setLoadedResources(prev => [...prev, result]);
          return result;
        })
        .catch(error => {
          loadedCountRef.current++;
          setLoadedCount(loadedCountRef.current);
          setFailedResources(prev => [...prev, error]);
          if (import.meta?.env?.DEV) {
            console.warn(`Failed to load ${type}: ${url}`, error);
          }
          // Zwracamy sukces nawet przy błędzie, żeby nie blokować całego procesu
          return { url, type, loaded: false, error };
        });
    });

    Promise.all(resourcePromises).then(() => {
      setResourcesLoaded(true);
      isLoadingRef.current = false;
    });

    return () => {
      isLoadingRef.current = false;
    };

  }, [stableResources]);

  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 100;

  return {
    resourcesLoaded,
    loadedCount,
    totalCount,
    progress: Math.round(progress),
    loadedResources,
    failedResources,
    // Zachowujemy kompatybilność z poprzednim API
    imagesLoaded: resourcesLoaded
  };
};

export default useResourcePreloader;
