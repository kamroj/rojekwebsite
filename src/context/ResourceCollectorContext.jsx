import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

// Typy zasobów
export const RESOURCE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio'
};

// Funkcja do określenia typu zasobu na podstawie rozszerzenia
const getResourceType = (url) => {
  const extension = url.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
    return RESOURCE_TYPES.IMAGE;
  }

  if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension)) {
    return RESOURCE_TYPES.VIDEO;
  }

  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return RESOURCE_TYPES.AUDIO;
  }

  // Domyślnie traktujemy jako obraz
  return RESOURCE_TYPES.IMAGE;
};

// Funkcja do ładowania pojedynczego zasobu
const loadResource = (url, type) => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case RESOURCE_TYPES.IMAGE: {
        const img = new window.Image();
        img.onload = () => resolve({ url, type, loaded: true });
        img.onerror = () => reject({ url, type, error: 'Failed to load image' });
        img.src = url;
        break;
      }
      case RESOURCE_TYPES.VIDEO: {
        const video = document.createElement('video');
        video.preload = 'metadata';

        const handleCanPlay = () => {
          cleanup();
          resolve({ url, type, loaded: true });
        };

        const handleError = () => {
          cleanup();
          reject({ url, type, error: 'Failed to load video' });
        };

        const cleanup = () => {
          video.removeEventListener('canplaythrough', handleCanPlay);
          video.removeEventListener('error', handleError);
          video.src = '';
        };

        video.addEventListener('canplaythrough', handleCanPlay);
        video.addEventListener('error', handleError);
        video.src = url;
        break;
      }
      case RESOURCE_TYPES.AUDIO: {
        const audio = new window.Audio();
        audio.preload = 'metadata';

        const handleCanPlay = () => {
          cleanup();
          resolve({ url, type, loaded: true });
        };

        const handleError = () => {
          cleanup();
          reject({ url, type, error: 'Failed to load audio' });
        };

        const cleanup = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          audio.src = '';
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.src = url;
        break;
      }
      default:
        reject({ url, type, error: 'Unsupported resource type' });
    }
  });
};

const ResourceCollectorContext = createContext();

export const ResourceCollectorProvider = ({ children }) => {
  const [resources, setResources] = useState([]); // [{url, type}]
  const [loadedResources, setLoadedResources] = useState([]);
  const [failedResources, setFailedResources] = useState([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const loadingRef = useRef(false);

  // Dodaj zasoby do kolektora (unikalne po url)
  const addResources = useCallback((newResources) => {
    setResources(prev => {
      const urls = new Set(prev.map(r => r.url));
      const toAdd = newResources
        .map(resource => {
          if (typeof resource === 'string') {
            return { url: resource, type: getResourceType(resource) };
          }
          return {
            url: resource.url,
            type: resource.type || getResourceType(resource.url)
          };
        })
        .filter(r => r.url && !urls.has(r.url));
      return [...prev, ...toAdd];
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
        failedResources
      }}
    >
      {children}
    </ResourceCollectorContext.Provider>
  );
};

// Hook do użycia w komponentach
export const useResourceCollector = () => useContext(ResourceCollectorContext);
