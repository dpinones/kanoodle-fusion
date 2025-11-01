/**
 * Colorblind-friendly color palette for Kanoodle
 * Uses colors that are distinguishable for people with different types of color blindness
 * Combined with patterns/symbols for additional differentiation
 */

import { Colors, type ColorValue } from './types';

// Colorblind-friendly palette using high contrast and distinguishable hues
// Based on research for deuteranopia, protanopia, and tritanopia
export const ColorblindHex: Record<number, string> = {
  [Colors.EMPTY]: '#000000',           // Black
  [Colors.RED]: '#E63946',             // Bright red (distinguishable)
  [Colors.YELLOW]: '#FFD60A',          // Bright yellow
  [Colors.BLUE]: '#0077B6',            // Strong blue
  [Colors.GREEN]: '#06D6A0',           // Cyan-green (distinguishable from red)
  [Colors.ORANGE]: '#F77F00',          // Bright orange
  [Colors.PURPLE]: '#8338EC',          // Violet (distinguishable)
  [Colors.NEUTRAL]: '#ADB5BD',         // Light gray
  // Mixed colors
  9: '#F77F00',  // Orange (RED + YELLOW)
  10: '#8338EC', // Purple (RED + BLUE)
  11: '#06D6A0', // Green (YELLOW + BLUE)
  12: '#ADB5BD', // Neutral
  13: '#ADB5BD', // Neutral
  14: '#ADB5BD', // Neutral
  15: '#ADB5BD', // Neutral
};

// Symbols/patterns for each color to provide additional visual differentiation
export const ColorSymbol: Record<number, string> = {
  [Colors.EMPTY]: '',
  [Colors.RED]: '●',      // Circle
  [Colors.YELLOW]: '■',   // Square
  [Colors.BLUE]: '▲',     // Triangle
  [Colors.GREEN]: '◆',    // Diamond
  [Colors.ORANGE]: '★',   // Star
  [Colors.PURPLE]: '♦',   // Diamond filled
  [Colors.NEUTRAL]: '○',  // Circle outline
  // Mixed colors
  9: '★',   // Orange
  10: '♦',  // Purple
  11: '◆',  // Green
  12: '○',  // Neutral
  13: '○',
  14: '○',
  15: '○',
};

// Pattern descriptions for accessibility
export const ColorPattern: Record<number, string> = {
  [Colors.EMPTY]: 'empty',
  [Colors.RED]: 'dots',
  [Colors.YELLOW]: 'horizontal-lines',
  [Colors.BLUE]: 'vertical-lines',
  [Colors.GREEN]: 'diagonal-lines',
  [Colors.ORANGE]: 'cross-hatch',
  [Colors.PURPLE]: 'grid',
  [Colors.NEUTRAL]: 'solid',
  9: 'cross-hatch',
  10: 'grid',
  11: 'diagonal-lines',
  12: 'solid',
  13: 'solid',
  14: 'solid',
  15: 'solid',
};

// SVG patterns for cell backgrounds (for additional visual differentiation)
export const getColorPattern = (color: ColorValue): string => {
  switch (color) {
    case Colors.RED:
      return 'url(#pattern-dots)';
    case Colors.YELLOW:
      return 'url(#pattern-horizontal)';
    case Colors.BLUE:
      return 'url(#pattern-vertical)';
    case Colors.GREEN:
      return 'url(#pattern-diagonal)';
    case Colors.ORANGE:
      return 'url(#pattern-cross)';
    case Colors.PURPLE:
      return 'url(#pattern-grid)';
    default:
      return 'none';
  }
};
