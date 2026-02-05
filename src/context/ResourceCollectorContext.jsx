import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

import { RESOURCE_TYPES, getResourceType } from '../utils/resourceTypes.js';

// Funkcja do ładowania pojedynczego zasobu
const loadResource = (url, type) => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case RESOURCE_TYPES.IMAGE: {
        const img = new window.Image();
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
        timeoutId = setTimeout(() => {
          // Avoid blocking the whole loading cycle if the event never fires
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
          // Count as completed via reject path (will be tracked in failedResources)
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
        const audio = new window.Audio();
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

// Default value makes this context OPTIONAL.
// This is useful for SSR/SSG renders where resource preloading is not needed.
const ResourceCollectorContext = createContext({
  resources: [],
  addResources: () => {},
  resetResources: () => {},
  resourcesLoaded: true,
  loadedCount: 0,
  totalCount: 0,
  progress: 100,
  loadedResources: [],
  failedResources: [],

  pendingTasks: 0,
  beginTask: () => {},
  endTask: () => {},
});

export const ResourceCollectorProvider = ({ children }) => {
  const [resources, setResources] = useState([]); // [{url, type}]
  const [loadedResources, setLoadedResources] = useState([]);
  const [failedResources, setFailedResources] = useState([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const loadingRef = useRef(false);

  // Additional async work not represented by image/video preload.
  // We will use it to track Sanity fetch requests so the global LoadingScreen can wait
  // for both: data fetch + asset preloading.
  const [pendingTasks, setPendingTasks] = useState(0);
  const pendingTasksRef = useRef(0);

  const beginTask = useCallback(() => {
    pendingTasksRef.current += 1;
    setPendingTasks(pendingTasksRef.current);
  }, []);

  const endTask = useCallback(() => {
    pendingTasksRef.current = Math.max(0, pendingTasksRef.current - 1);
    setPendingTasks(pendingTasksRef.current);
  }, []);

  // Dodaj zasoby do kolektora (unikalne po url)
  const addResources = useCallback((newResources) => {
    setResources(prev => {
      const urls = new Set(prev.map(r => r.url));
      
      // Normalize and deduplicate both against previous and within this batch
      const normalized = (newResources || []).map(resource => {
        if (typeof resource === 'string') {
          return { url: resource, type: getResourceType(resource) };
        }
        return {
          url: resource?.url,
          type: resource?.type || (resource?.url ? getResourceType(resource.url) : undefined)
        };
      });
      
      const uniqueToAdd = [];
      for (const r of normalized) {
        if (r && r.url && !urls.has(r.url)) {
          urls.add(r.url);
          uniqueToAdd.push(r);
        }
      }
      return [...prev, ...uniqueToAdd];
    });
  }, []);

  // Resetuj kolektor (np. przy zmianie strony)
  const resetResources = useCallback(() => {
    setResources([]);
    setLoadedResources([]);
    setFailedResources([]);
    setResourcesLoaded(false);
    setLoadedCount(0);
    setTotalCount(0);
    loadingRef.current = false;

    // Reset pending tasks as well (route change / hard reset)
    pendingTasksRef.current = 0;
    setPendingTasks(0);
  }, []);

  // Automatycznie ładuj zasoby, gdy się pojawią
  React.useEffect(() => {
    if (resources.length === 0) {
      setResourcesLoaded(true);
      setLoadedCount(0);
      setTotalCount(0);
      setLoadedResources([]);
      setFailedResources([]);
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;
    setResourcesLoaded(false);
    setLoadedCount(0);
    setTotalCount(resources.length);
    setLoadedResources([]);
    setFailedResources([]);

    let loaded = 0;
    let isUnmounted = false;

    const promises = resources.map(({ url, type }) =>
      loadResource(url, type)
        .then(result => {
          loaded++;
          setLoadedCount(loaded);
          setLoadedResources(prev => [...prev, result]);
          return result;
        })
        .catch(error => {
          loaded++;
          setLoadedCount(loaded);
          setFailedResources(prev => [...prev, error]);
          return { url, type, loaded: false, error };
        })
    );

    Promise.all(promises).then(() => {
      if (!isUnmounted) {
        setResourcesLoaded(true);
        loadingRef.current = false;
      }
    });

    return () => {
      isUnmounted = true;
      loadingRef.current = false;
    };
  }, [resources]);

  const progress = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 100;

  return (
    <ResourceCollectorContext.Provider
      value={{
        resources,
        addResources,
        resetResources,
        resourcesLoaded,
        loadedCount,
        totalCount,
        progress,
        loadedResources,
        failedResources,

        // Async tasks (e.g. Sanity fetch)
        pendingTasks,
        beginTask,
        endTask
      }}
    >
      {children}
    </ResourceCollectorContext.Provider>
  );
};

// Hook do użycia w komponentach
export const useResourceCollector = () => useContext(ResourceCollectorContext);
