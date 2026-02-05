import { useMemo, useState, useEffect, useRef } from 'react';

const useImagePreloader = (imageUrls = []) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const loadedCountRef = useRef(0);
  const isLoadingRef = useRef(false);

  // Normalize input into a stable dependency.
  // We keep ordering stable so callers can pass a new array instance without retriggering unnecessarily.
  const stableUrls = useMemo(() => {
    if (!Array.isArray(imageUrls)) return [];
    return imageUrls.filter(Boolean);
  }, [imageUrls]);

  useEffect(() => {
    if (!stableUrls || stableUrls.length === 0) {
      setImagesLoaded(true);
      setTotalCount(0);
      setLoadedCount(0);
      return;
    }

    // Prevent multiple simultaneous loading sessions
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setTotalCount(stableUrls.length);
    setLoadedCount(0);
    setImagesLoaded(false);
    loadedCountRef.current = 0;

    const imagePromises = stableUrls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        
        const handleLoad = () => {
          loadedCountRef.current++;
          setLoadedCount(loadedCountRef.current);
          resolve(url);
        };
        
        const handleError = () => {
          loadedCountRef.current++;
          setLoadedCount(loadedCountRef.current);
          // Avoid noisy logs in production.
          if (import.meta?.env?.DEV) {
            console.warn(`Failed to load image: ${url}`);
          }
          resolve(url); 
        };
        
        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = url;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
      isLoadingRef.current = false;
    });

    return () => {
      isLoadingRef.current = false;
    };

  }, [stableUrls]);

  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 100;

  return {
    imagesLoaded,
    loadedCount,
    totalCount,
    progress: Math.round(progress)
  };
};

export default useImagePreloader;
