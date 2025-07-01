// src/utils/responsive.js
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Basado en el ancho de diseño estándar de un iPhone 14 Pro Max (aprox. 430 puntos)
// O un diseño más común como iPhone 8 (375 puntos) o Pixel 2 (411 puntos)
// Podemos ajustar esta base según el diseño de origen más cercano a tus HTML.
// Usaremos 411 como base, que es un ancho común en Android.
const baseWidth = 411; // Ancho de un Pixel 2 XL
const baseHeight = 823; // Alto de un Pixel 2 XL

// Función para escalar el tamaño de un elemento basado en el ancho de la pantalla
const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;

// Función para escalar el tamaño de una fuente
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Función para escalar verticalmente (útil para alturas o padding/margin verticales)
const verticalScale = (size) => (SCREEN_HEIGHT / baseHeight) * size;

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  scale,
  verticalScale,
  moderateScale,
};