// src/components/common/SwipeHandler.jsx
import React, { useRef, useEffect } from 'react';

/**
 * Komponent do obsługi gestów przesuwania
 * @param {Function} onSwipeRight - Funkcja wywoływana po przesunięciu w prawo
 * @param {Function} onSwipeLeft - Funkcja wywoływana po przesunięciu w lewo
 * @param {React.ReactNode} children - Komponenty potomne
 * @param {number} threshold - Próg odległości przesunięcia w pikselach
 * @param {boolean} enabled - Czy gesty są aktywne
 */
const SwipeHandler = ({ 
  onSwipeRight, 
  onSwipeLeft, 
  children, 
  threshold = 50, 
  enabled = true 
}) => {
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      // Zapisz początkową pozycję dotyku
      if (e.touches && e.touches[0]) {
        startXRef.current = e.touches[0].clientX;
        startYRef.current = e.touches[0].clientY;
        isSwiping.current = true;
      }
    };

    const handleTouchMove = (e) => {
      // Nie rób nic, jeśli nie rozpoczęto przesuwania
      if (!isSwiping.current) return;
      
      if (e.touches && e.touches[0]) {
        // Oblicz dystans przesunięcia
        const deltaX = e.touches[0].clientX - startXRef.current;
        const deltaY = e.touches[0].clientY - startYRef.current;
        
        // Jeśli przesunięcie w pionie jest większe niż w poziomie,
        // to prawdopodobnie użytkownik przewija stronę
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          isSwiping.current = false;
          return;
        }
        
        // Zapobiegaj domyślnemu przewijaniu, jeśli wykryto gest poziomy
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping.current) return;
      
      // Oblicz końcowy dystans przesunięcia
      const changedTouches = e.changedTouches?.[0];
      if (changedTouches) {
        const deltaX = changedTouches.clientX - startXRef.current;
        
        // Jeśli przesunięcie przekracza próg, wywołaj odpowiednią funkcję
        if (Math.abs(deltaX) >= threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      }
      
      // Zresetuj stan
      isSwiping.current = false;
    };

    // Obsługa kliknięć/dotyków dla mobilnych urządzeń innych niż dotykowe
    const handleMouseDown = (e) => {
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      isSwiping.current = true;
      
      // Dodaj tymczasowe nasłuchiwacze dla ruchu i puszczenia myszy
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseMove = (e) => {
      if (!isSwiping.current) return;
      
      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;
      
      // Jeśli przesunięcie w pionie jest większe niż w poziomie, anuluj gest
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isSwiping.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        return;
      }
    };
    
    const handleMouseUp = (e) => {
      if (!isSwiping.current) return;
      
      const deltaX = e.clientX - startXRef.current;
      
      // Jeśli przesunięcie przekracza próg, wywołaj odpowiednią funkcję
      if (Math.abs(deltaX) >= threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      // Zresetuj stan i usuń nasłuchiwacze
      isSwiping.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Dodaj nasłuchiwacze zdarzeń
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Dodaj obsługę myszy dla urządzeń nie-dotykowych
    container.addEventListener('mousedown', handleMouseDown);

    // Usuń nasłuchiwacze zdarzeń przy odmontowaniu
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSwipeRight, onSwipeLeft, threshold, enabled]);

  return (
    <div ref={containerRef} style={{ touchAction: 'pan-y' }}>
      {children}
    </div>
  );
};

export default SwipeHandler;