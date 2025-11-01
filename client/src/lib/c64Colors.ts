/**
 * Commodore 64 Color Palette
 * Official colors from the VIC-II chip
 */

export const C64_COLORS = {
  // Background colors
  BLACK: '#000000',           // 0 - Black
  WHITE: '#FFFFFF',           // 1 - White

  // Primary colors
  RED: '#880000',             // 2 - Red
  CYAN: '#AAFFEE',            // 3 - Cyan
  PURPLE: '#CC44CC',          // 4 - Purple/Violet
  GREEN: '#00CC55',           // 5 - Green
  BLUE: '#0000AA',            // 6 - Blue
  YELLOW: '#EEEE77',          // 7 - Yellow

  // Secondary colors
  ORANGE: '#DD8855',          // 8 - Orange
  BROWN: '#664400',           // 9 - Brown
  LIGHT_RED: '#FF7777',       // 10 - Light Red
  DARK_GREY: '#333333',       // 11 - Dark Grey
  GREY: '#777777',            // 12 - Grey
  LIGHT_GREEN: '#AAFF66',    // 13 - Light Green
  LIGHT_BLUE: '#0088FF',     // 14 - Light Blue
  LIGHT_GREY: '#BBBBBB',     // 15 - Light Grey

  // Classic C64 screen background (light blue)
  SCREEN_BG: '#6C5EB5',      // Classic C64 purple/blue background

  // Border (lighter blue)
  BORDER: '#A4A0E4',         // Classic C64 border color

  // Text (light blue/white)
  TEXT: '#AAFFEE',           // Classic cyan text color

  // Rainbow stripe colors (logo)
  RAINBOW: {
    RED: '#D82800',
    ORANGE: '#FF6C00',
    YELLOW: '#FFD800',
    GREEN: '#00B428',
    BLUE: '#006CD8',
    PURPLE: '#8C28D8',
  }
} as const;

// Original Commodore 64 color array (16 colors indexed 0-15)
export const C64_PALETTE = [
  '#000000', // 0 - Black
  '#FFFFFF', // 1 - White
  '#880000', // 2 - Red
  '#AAFFEE', // 3 - Cyan
  '#CC44CC', // 4 - Purple
  '#00CC55', // 5 - Green
  '#0000AA', // 6 - Blue
  '#EEEE77', // 7 - Yellow
  '#DD8855', // 8 - Orange
  '#664400', // 9 - Brown
  '#FF7777', // 10 - Light Red
  '#333333', // 11 - Dark Grey
  '#777777', // 12 - Grey
  '#AAFF66', // 13 - Light Green
  '#0088FF', // 14 - Light Blue
  '#BBBBBB', // 15 - Light Grey
] as const;

// Kanoodle piece colors mapped to C64 palette
export const C64_KANOODLE_COLORS = {
  EMPTY: C64_COLORS.BLACK,
  RED: C64_COLORS.RED,
  YELLOW: C64_COLORS.YELLOW,
  BLUE: C64_COLORS.LIGHT_BLUE,
  GREEN: C64_COLORS.GREEN,
  ORANGE: C64_COLORS.ORANGE,
  PURPLE: C64_COLORS.PURPLE,
  NEUTRAL: C64_COLORS.LIGHT_GREY,
} as const;
