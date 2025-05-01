// src/styles/animations.js
import { keyframes } from 'styled-components';

// Animacja wejścia z prawej strony
export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Animacja wyjścia w prawo
export const slideOutRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

// Animacja wejścia z lewej strony
export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Animacja wyjścia w lewo
export const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

// Animacja wejścia z góry
export const slideInTop = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animacja wejścia z dołu
export const slideInBottom = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animacja wyjścia do góry
export const slideOutTop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

// Animacja wyjścia w dół
export const slideOutBottom = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
`;

// Animacja pojawiania się
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Animacja zanikania
export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Animacja pulsowania
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Animacja obracania
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Animacja dla hamburger menu
export const hamburgerToX = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Animacja podświetlenia aktywnego elementu
export const activeLinkHighlight = keyframes`
  0% { 
    transform: translateX(-10px) scaleY(0.5); 
    opacity: 0; 
  }
  100% { 
    transform: translateX(0) scaleY(1); 
    opacity: 1; 
  }
`;

// Animacja skakania (bounce)
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Animacja zapętlonego podkreślenia
export const underlineLoop = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
`;

// Eksportuj wszystkie animacje jako domyślny obiekt
export default {
  slideInRight,
  slideOutRight,
  slideInLeft,
  slideOutLeft,
  slideInTop,
  slideInBottom,
  slideOutTop,
  slideOutBottom,
  fadeIn,
  fadeOut,
  pulse,
  rotate,
  hamburgerToX,
  activeLinkHighlight,
  bounce,
  underlineLoop
};