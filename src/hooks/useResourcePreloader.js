import { useState, useEffect, useRef } from 'react';

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
        const img = new Image();
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
        const audio = new Audio();
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

const useResourcePreloader = (resources = []) => {
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadedResources, setLoadedResources] = useState([]);
  const [failedResources, setFailedResources] = useState([]);
  const loadedCountRef = useRef(0);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Jeśli brak zasobów, oznacz jako załadowane
    if (!resources || resources.length === 0) {
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
    setTotalCount(resources.length);
    setLoadedCount(0);
    setResourcesLoaded(false);
    setLoadedResources([]);
    setFailedResources([]);
    loadedCountRef.current = 0;

    // Przetwórz zasoby - mogą być stringami (URL) lub obiektami z url i type
    const processedResources = resources.map(resource => {
      if (typeof resource === 'string') {
        return {
          url: resource,
          type: getResourceType(resource)
        };
      }
      return {
        url: resource.url,
        type: resource.type || getResourceType(resource.url)
      };
    });

    // Ładuj wszystkie zasoby
    const resourcePromises = processedResources.map(({ url, type }) => {
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
          console.warn(`Failed to load ${type}: ${url}`, error);
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

  }, [JSON.stringify(resources)]); // Używamy JSON.stringify dla stabilnej zależności

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
