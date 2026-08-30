import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsive = {
  // Dimensions de l'écran
  screenWidth: width,
  screenHeight: height,
  
  // Détection de type d'appareil
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isTablet: width >= 768,
  isLargeTablet: width >= 1024,
  
  // Calculs responsifs
  getItemWidth: (columns = 2, padding = 15, margin = 7) => {
    const totalPadding = padding * 2;
    const totalMargin = margin * 2 * columns;
    return (width - totalPadding - totalMargin) / columns;
  },
  
  // Taille de police responsive
  scaleFont: (size: number) => {
    if (width < 375) return size * 0.85;
    if (width >= 768) return size * 1.2;
    return size;
  },
  
  // Espacement responsive
  scaleSpacing: (size: number) => {
    if (width < 375) return size * 0.8;
    if (width >= 768) return size * 1.3;
    return size;
  },
  
  // Status bar height
  statusBarHeight: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
};