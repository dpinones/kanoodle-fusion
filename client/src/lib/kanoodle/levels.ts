/**
 * Kanoodle Fusion - Level Constants
 * All 50 levels with their solutions and allowed pieces
 * This allows the client to avoid calling Dojo's get_level
 */

import { Level, Colors } from './types';

// Piece ID constants (matching Cairo contract)
export const PieceIds = {
  ID_1: 1,
  ID_2: 2,
  ID_3: 3,
  ID_4: 4,
  ID_5: 5,
  ID_6: 6,
  ID_7: 7,
  ID_8: 8,
  ID_9: 9,
  ID_10: 10,
  ID_11: 11,
  ID_12: 12,
  ID_13: 13,
} as const;

/**
 * All 50 Kanoodle Fusion levels
 * Each level contains:
 * - level_id: The level number (1-50)
 * - solution: 16 color values representing the 4x4 target board
 * - allowed_pieces: Array of piece IDs that can be used for this level
 */
export const LEVELS: Record<number, Level> = {
  1: {
    level_id: 1,
    solution: [
      Colors.RED, Colors.BLUE, Colors.BLUE, Colors.NEUTRAL,
      Colors.RED, Colors.RED, Colors.PURPLE, Colors.BLUE,
      Colors.RED, Colors.RED, Colors.NEUTRAL, Colors.NEUTRAL,
      Colors.PURPLE, Colors.PURPLE, Colors.BLUE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_4, PieceIds.ID_6,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  2: {
    level_id: 2,
    solution: [
      Colors.RED, Colors.RED, Colors.RED, Colors.BLUE,
      Colors.RED, Colors.BLUE, Colors.RED, Colors.BLUE,
      Colors.RED, Colors.BLUE, Colors.PURPLE, Colors.BLUE,
      Colors.NEUTRAL, Colors.NEUTRAL, Colors.PURPLE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  3: {
    level_id: 3,
    solution: [
      Colors.RED, Colors.RED, Colors.RED, Colors.YELLOW,
      Colors.RED, Colors.RED, Colors.RED, Colors.ORANGE,
      Colors.NEUTRAL, Colors.YELLOW, Colors.NEUTRAL, Colors.YELLOW,
      Colors.YELLOW, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  4: {
    level_id: 4,
    solution: [
      Colors.BLUE, Colors.GREEN, Colors.BLUE, Colors.BLUE,
      Colors.RED, Colors.YELLOW, Colors.YELLOW, Colors.BLUE,
      Colors.RED, Colors.YELLOW, Colors.BLUE, Colors.BLUE,
      Colors.RED, Colors.RED, Colors.BLUE, Colors.NEUTRAL,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_11,
    ],
  },
  5: {
    level_id: 5,
    solution: [
      Colors.YELLOW, Colors.NEUTRAL, Colors.NEUTRAL, Colors.RED,
      Colors.YELLOW, Colors.ORANGE, Colors.RED, Colors.RED,
      Colors.YELLOW, Colors.NEUTRAL, Colors.RED, Colors.RED,
      Colors.YELLOW, Colors.YELLOW, Colors.ORANGE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  6: {
    level_id: 6,
    solution: [
      Colors.BLUE, Colors.BLUE, Colors.BLUE, Colors.BLUE,
      Colors.RED, Colors.PURPLE, Colors.RED, Colors.RED,
      Colors.BLUE, Colors.BLUE, Colors.NEUTRAL, Colors.NEUTRAL,
      Colors.GREEN, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_3,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  7: {
    level_id: 7,
    solution: [
      Colors.NEUTRAL, Colors.BLUE, Colors.YELLOW, Colors.NEUTRAL,
      Colors.BLUE, Colors.BLUE, Colors.YELLOW, Colors.YELLOW,
      Colors.BLUE, Colors.RED, Colors.ORANGE, Colors.RED,
      Colors.BLUE, Colors.PURPLE, Colors.BLUE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  8: {
    level_id: 8,
    solution: [
      Colors.BLUE, Colors.GREEN, Colors.BLUE, Colors.RED,
      Colors.BLUE, Colors.YELLOW, Colors.GREEN, Colors.PURPLE,
      Colors.BLUE, Colors.YELLOW, Colors.NEUTRAL, Colors.RED,
      Colors.BLUE, Colors.NEUTRAL, Colors.NEUTRAL, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  9: {
    level_id: 9,
    solution: [
      Colors.NEUTRAL, Colors.BLUE, Colors.PURPLE, Colors.RED,
      Colors.BLUE, Colors.BLUE, Colors.NEUTRAL, Colors.RED,
      Colors.YELLOW, Colors.YELLOW, Colors.YELLOW, Colors.ORANGE,
      Colors.RED, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  10: {
    level_id: 10,
    solution: [
      Colors.BLUE, Colors.NEUTRAL, Colors.RED, Colors.PURPLE,
      Colors.BLUE, Colors.BLUE, Colors.RED, Colors.BLUE,
      Colors.NEUTRAL, Colors.BLUE, Colors.RED, Colors.BLUE,
      Colors.YELLOW, Colors.YELLOW, Colors.YELLOW, Colors.GREEN,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  11: {
    level_id: 11,
    solution: [
      Colors.NEUTRAL, Colors.YELLOW, Colors.YELLOW, Colors.ORANGE,
      Colors.NEUTRAL, Colors.NEUTRAL, Colors.YELLOW, Colors.RED,
      Colors.PURPLE, Colors.BLUE, Colors.BLUE, Colors.PURPLE,
      Colors.RED, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  12: {
    level_id: 12,
    solution: [
      Colors.NEUTRAL, Colors.YELLOW, Colors.NEUTRAL, Colors.RED,
      Colors.YELLOW, Colors.YELLOW, Colors.ORANGE, Colors.RED,
      Colors.RED, Colors.RED, Colors.RED, Colors.RED,
      Colors.BLUE, Colors.BLUE, Colors.BLUE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  13: {
    level_id: 13,
    solution: [
      Colors.RED, Colors.PURPLE, Colors.RED, Colors.ORANGE,
      Colors.RED, Colors.BLUE, Colors.YELLOW, Colors.ORANGE,
      Colors.NEUTRAL, Colors.BLUE, Colors.NEUTRAL, Colors.ORANGE,
      Colors.YELLOW, Colors.GREEN, Colors.YELLOW, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  14: {
    level_id: 14,
    solution: [
      Colors.NEUTRAL, Colors.YELLOW, Colors.BLUE, Colors.NEUTRAL,
      Colors.RED, Colors.ORANGE, Colors.GREEN, Colors.BLUE,
      Colors.RED, Colors.YELLOW, Colors.NEUTRAL, Colors.BLUE,
      Colors.ORANGE, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  15: {
    level_id: 15,
    solution: [
      Colors.RED, Colors.YELLOW, Colors.RED, Colors.RED,
      Colors.RED, Colors.GREEN, Colors.GREEN, Colors.RED,
      Colors.RED, Colors.YELLOW, Colors.BLUE, Colors.PURPLE,
      Colors.ORANGE, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10,
    ],
  },
  16: {
    level_id: 16,
    solution: [
      Colors.YELLOW, Colors.BLUE, Colors.RED, Colors.RED,
      Colors.YELLOW, Colors.GREEN, Colors.RED, Colors.RED,
      Colors.YELLOW, Colors.BLUE, Colors.PURPLE, Colors.RED,
      Colors.BLUE, Colors.BLUE, Colors.RED, Colors.NEUTRAL,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_10, PieceIds.ID_11,
    ],
  },
  17: {
    level_id: 17,
    solution: [
      Colors.NEUTRAL, Colors.PURPLE, Colors.RED, Colors.ORANGE,
      Colors.YELLOW, Colors.PURPLE, Colors.NEUTRAL, Colors.YELLOW,
      Colors.YELLOW, Colors.GREEN, Colors.BLUE, Colors.GREEN,
      Colors.YELLOW, Colors.BLUE, Colors.BLUE, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  18: {
    level_id: 18,
    solution: [
      Colors.PURPLE, Colors.GREEN, Colors.RED, Colors.RED,
      Colors.RED, Colors.GREEN, Colors.BLUE, Colors.ORANGE,
      Colors.RED, Colors.YELLOW, Colors.YELLOW, Colors.ORANGE,
      Colors.PURPLE, Colors.GREEN, Colors.BLUE, Colors.GREEN,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_3, PieceIds.ID_10,
    ],
  },
  19: {
    level_id: 19,
    solution: [
      Colors.NEUTRAL, Colors.NEUTRAL, Colors.GREEN, Colors.NEUTRAL,
      Colors.BLUE, Colors.GREEN, Colors.GREEN, Colors.GREEN,
      Colors.YELLOW, Colors.GREEN, Colors.BLUE, Colors.GREEN,
      Colors.YELLOW, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_3, PieceIds.ID_10, PieceIds.ID_5,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  20: {
    level_id: 20,
    solution: [
      Colors.NEUTRAL, Colors.GREEN, Colors.GREEN, Colors.NEUTRAL,
      Colors.GREEN, Colors.GREEN, Colors.GREEN, Colors.GREEN,
      Colors.BLUE, Colors.YELLOW, Colors.NEUTRAL, Colors.GREEN,
      Colors.GREEN, Colors.GREEN, Colors.GREEN, Colors.GREEN,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_5, PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  21: {
    level_id: 21,
    solution: [
      Colors.YELLOW, Colors.NEUTRAL, Colors.NEUTRAL, Colors.RED,
      Colors.YELLOW, Colors.ORANGE, Colors.ORANGE, Colors.RED,
      Colors.ORANGE, Colors.ORANGE, Colors.NEUTRAL, Colors.RED,
      Colors.ORANGE, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_7,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  22: {
    level_id: 22,
    solution: [
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.NEUTRAL,
      Colors.RED, Colors.ORANGE, Colors.ORANGE, Colors.NEUTRAL,
      Colors.RED, Colors.RED, Colors.ORANGE, Colors.ORANGE,
      Colors.ORANGE, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_7, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  23: {
    level_id: 23,
    solution: [
      Colors.NEUTRAL, Colors.BLUE, Colors.BLUE, Colors.NEUTRAL,
      Colors.RED, Colors.RED, Colors.PURPLE, Colors.BLUE,
      Colors.BLUE, Colors.BLUE, Colors.PURPLE, Colors.BLUE,
      Colors.NEUTRAL, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_9,
      PieceIds.ID_11, PieceIds.ID_12, PieceIds.ID_13,
    ],
  },
  24: {
    level_id: 24,
    solution: [
      Colors.RED, Colors.BLUE, Colors.RED, Colors.PURPLE,
      Colors.PURPLE, Colors.BLUE, Colors.RED, Colors.PURPLE,
      Colors.PURPLE, Colors.RED, Colors.RED, Colors.PURPLE,
      Colors.PURPLE, Colors.BLUE, Colors.BLUE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_9,
    ],
  },
  25: {
    level_id: 25,
    solution: [
      Colors.NEUTRAL, Colors.YELLOW, Colors.NEUTRAL, Colors.BLUE,
      Colors.PURPLE, Colors.ORANGE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.ORANGE, Colors.BLUE, Colors.ORANGE,
      Colors.PURPLE, Colors.YELLOW, Colors.ORANGE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_7,
      PieceIds.ID_9, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  26: {
    level_id: 26,
    solution: [
      Colors.BLUE, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.YELLOW, Colors.YELLOW, Colors.ORANGE,
      Colors.PURPLE, Colors.NEUTRAL, Colors.YELLOW, Colors.ORANGE,
      Colors.PURPLE, Colors.NEUTRAL, Colors.ORANGE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_6, PieceIds.ID_10, PieceIds.ID_7,
      PieceIds.ID_9, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  27: {
    level_id: 27,
    solution: [
      Colors.RED, Colors.ORANGE, Colors.GREEN, Colors.GREEN,
      Colors.RED, Colors.BLUE, Colors.GREEN, Colors.NEUTRAL,
      Colors.RED, Colors.GREEN, Colors.GREEN, Colors.ORANGE,
      Colors.GREEN, Colors.GREEN, Colors.ORANGE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_10, PieceIds.ID_5,
      PieceIds.ID_7, PieceIds.ID_11,
    ],
  },
  28: {
    level_id: 28,
    solution: [
      Colors.RED, Colors.GREEN, Colors.ORANGE, Colors.ORANGE,
      Colors.ORANGE, Colors.GREEN, Colors.GREEN, Colors.ORANGE,
      Colors.ORANGE, Colors.ORANGE, Colors.GREEN, Colors.NEUTRAL,
      Colors.GREEN, Colors.BLUE, Colors.BLUE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_6, PieceIds.ID_10, PieceIds.ID_5,
      PieceIds.ID_7, PieceIds.ID_11,
    ],
  },
  29: {
    level_id: 29,
    solution: [
      Colors.PURPLE, Colors.YELLOW, Colors.GREEN, Colors.YELLOW,
      Colors.PURPLE, Colors.NEUTRAL, Colors.GREEN, Colors.PURPLE,
      Colors.PURPLE, Colors.GREEN, Colors.GREEN, Colors.PURPLE,
      Colors.GREEN, Colors.GREEN, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_10, PieceIds.ID_5,
      PieceIds.ID_9, PieceIds.ID_11,
    ],
  },
  30: {
    level_id: 30,
    solution: [
      Colors.PURPLE, Colors.PURPLE, Colors.PURPLE, Colors.GREEN,
      Colors.RED, Colors.GREEN, Colors.YELLOW, Colors.YELLOW,
      Colors.GREEN, Colors.GREEN, Colors.NEUTRAL, Colors.YELLOW,
      Colors.GREEN, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_6, PieceIds.ID_10, PieceIds.ID_5,
      PieceIds.ID_9, PieceIds.ID_11,
    ],
  },
  31: {
    level_id: 31,
    solution: [
      Colors.PURPLE, Colors.ORANGE, Colors.ORANGE, Colors.GREEN,
      Colors.PURPLE, Colors.ORANGE, Colors.GREEN, Colors.GREEN,
      Colors.PURPLE, Colors.ORANGE, Colors.GREEN, Colors.YELLOW,
      Colors.PURPLE, Colors.RED, Colors.ORANGE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_3, PieceIds.ID_10, PieceIds.ID_7,
    ],
  },
  32: {
    level_id: 32,
    solution: [
      Colors.YELLOW, Colors.NEUTRAL, Colors.ORANGE, Colors.ORANGE,
      Colors.ORANGE, Colors.ORANGE, Colors.RED, Colors.ORANGE,
      Colors.ORANGE, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_7, PieceIds.ID_9, PieceIds.ID_11,
    ],
  },
  33: {
    level_id: 33,
    solution: [
      Colors.ORANGE, Colors.BLUE, Colors.BLUE, Colors.NEUTRAL,
      Colors.ORANGE, Colors.ORANGE, Colors.GREEN, Colors.BLUE,
      Colors.ORANGE, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
      Colors.RED, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_7, PieceIds.ID_11,
    ],
  },
  34: {
    level_id: 34,
    solution: [
      Colors.PURPLE, Colors.YELLOW, Colors.BLUE, Colors.RED,
      Colors.PURPLE, Colors.YELLOW, Colors.GREEN, Colors.PURPLE,
      Colors.PURPLE, Colors.YELLOW, Colors.RED, Colors.PURPLE,
      Colors.PURPLE, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_10, PieceIds.ID_9,
    ],
  },
  35: {
    level_id: 35,
    solution: [
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.ORANGE,
      Colors.RED, Colors.YELLOW, Colors.ORANGE, Colors.ORANGE,
      Colors.NEUTRAL, Colors.ORANGE, Colors.ORANGE, Colors.ORANGE,
      Colors.PURPLE, Colors.PURPLE, Colors.PURPLE, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_7, PieceIds.ID_9, PieceIds.ID_11,
    ],
  },
  36: {
    level_id: 36,
    solution: [
      Colors.BLUE, Colors.NEUTRAL, Colors.GREEN, Colors.NEUTRAL,
      Colors.BLUE, Colors.GREEN, Colors.GREEN, Colors.GREEN,
      Colors.GREEN, Colors.GREEN, Colors.GREEN, Colors.GREEN,
      Colors.GREEN, Colors.YELLOW, Colors.GREEN, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_5, PieceIds.ID_11, PieceIds.ID_12,
    ],
  },
  37: {
    level_id: 37,
    solution: [
      Colors.BLUE, Colors.PURPLE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.NEUTRAL, Colors.PURPLE, Colors.RED,
      Colors.PURPLE, Colors.ORANGE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.ORANGE, Colors.ORANGE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_7, PieceIds.ID_9, PieceIds.ID_11,
    ],
  },
  38: {
    level_id: 38,
    solution: [
      Colors.BLUE, Colors.GREEN, Colors.BLUE, Colors.RED,
      Colors.YELLOW, Colors.GREEN, Colors.GREEN, Colors.RED,
      Colors.RED, Colors.YELLOW, Colors.RED, Colors.RED,
      Colors.RED, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_8,
    ],
  },
  39: {
    level_id: 39,
    solution: [
      Colors.NEUTRAL, Colors.BLUE, Colors.PURPLE, Colors.RED,
      Colors.GREEN, Colors.BLUE, Colors.YELLOW, Colors.RED,
      Colors.GREEN, Colors.YELLOW, Colors.RED, Colors.RED,
      Colors.ORANGE, Colors.RED, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_8, PieceIds.ID_11,
    ],
  },
  40: {
    level_id: 40,
    solution: [
      Colors.PURPLE, Colors.BLUE, Colors.BLUE, Colors.GREEN,
      Colors.ORANGE, Colors.BLUE, Colors.GREEN, Colors.ORANGE,
      Colors.ORANGE, Colors.GREEN, Colors.BLUE, Colors.ORANGE,
      Colors.ORANGE, Colors.PURPLE, Colors.RED, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_3, PieceIds.ID_10, PieceIds.ID_8,
    ],
  },
  41: {
    level_id: 41,
    solution: [
      Colors.RED, Colors.RED, Colors.ORANGE, Colors.PURPLE,
      Colors.RED, Colors.RED, Colors.RED, Colors.YELLOW,
      Colors.BLUE, Colors.BLUE, Colors.GREEN, Colors.GREEN,
      Colors.YELLOW, Colors.PURPLE, Colors.PURPLE, Colors.YELLOW,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_3, PieceIds.ID_10, PieceIds.ID_8,
    ],
  },
  42: {
    level_id: 42,
    solution: [
      Colors.YELLOW, Colors.ORANGE, Colors.ORANGE, Colors.YELLOW,
      Colors.ORANGE, Colors.YELLOW, Colors.ORANGE, Colors.YELLOW,
      Colors.ORANGE, Colors.BLUE, Colors.YELLOW, Colors.ORANGE,
      Colors.RED, Colors.RED, Colors.RED, Colors.ORANGE,
    ],
    allowed_pieces: [
      PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_7, PieceIds.ID_8,
    ],
  },
  43: {
    level_id: 43,
    solution: [
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.ORANGE,
      Colors.RED, Colors.YELLOW, Colors.GREEN, Colors.NEUTRAL,
      Colors.RED, Colors.GREEN, Colors.GREEN, Colors.YELLOW,
      Colors.RED, Colors.RED, Colors.PURPLE, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_8, PieceIds.ID_11,
    ],
  },
  44: {
    level_id: 44,
    solution: [
      Colors.GREEN, Colors.BLUE, Colors.YELLOW, Colors.RED,
      Colors.ORANGE, Colors.GREEN, Colors.GREEN, Colors.YELLOW,
      Colors.ORANGE, Colors.GREEN, Colors.GREEN, Colors.BLUE,
      Colors.ORANGE, Colors.RED, Colors.GREEN, Colors.GREEN,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3, PieceIds.ID_10,
      PieceIds.ID_5, PieceIds.ID_8,
    ],
  },
  45: {
    level_id: 45,
    solution: [
      Colors.PURPLE, Colors.ORANGE, Colors.BLUE, Colors.BLUE,
      Colors.PURPLE, Colors.GREEN, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.YELLOW, Colors.YELLOW, Colors.PURPLE,
      Colors.GREEN, Colors.YELLOW, Colors.GREEN, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_9, PieceIds.ID_8,
    ],
  },
  46: {
    level_id: 46,
    solution: [
      Colors.PURPLE, Colors.NEUTRAL, Colors.PURPLE, Colors.PURPLE,
      Colors.GREEN, Colors.BLUE, Colors.PURPLE, Colors.PURPLE,
      Colors.PURPLE, Colors.GREEN, Colors.PURPLE, Colors.PURPLE,
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.PURPLE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_10, PieceIds.ID_9, PieceIds.ID_8, PieceIds.ID_12,
    ],
  },
  47: {
    level_id: 47,
    solution: [
      Colors.PURPLE, Colors.PURPLE, Colors.PURPLE, Colors.BLUE,
      Colors.PURPLE, Colors.RED, Colors.ORANGE, Colors.BLUE,
      Colors.PURPLE, Colors.GREEN, Colors.GREEN, Colors.YELLOW,
      Colors.PURPLE, Colors.NEUTRAL, Colors.GREEN, Colors.BLUE,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_6, PieceIds.ID_10,
      PieceIds.ID_9, PieceIds.ID_8, PieceIds.ID_11,
    ],
  },
  48: {
    level_id: 48,
    solution: [
      Colors.PURPLE, Colors.BLUE, Colors.PURPLE, Colors.RED,
      Colors.PURPLE, Colors.ORANGE, Colors.BLUE, Colors.PURPLE,
      Colors.PURPLE, Colors.ORANGE, Colors.ORANGE, Colors.RED,
      Colors.PURPLE, Colors.ORANGE, Colors.RED, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_7,
      PieceIds.ID_9, PieceIds.ID_8,
    ],
  },
  49: {
    level_id: 49,
    solution: [
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.BLUE,
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.BLUE,
      Colors.ORANGE, Colors.RED, Colors.YELLOW, Colors.BLUE,
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.GREEN,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_2, PieceIds.ID_6, PieceIds.ID_3,
      PieceIds.ID_10, PieceIds.ID_7, PieceIds.ID_8,
    ],
  },
  50: {
    level_id: 50,
    solution: [
      Colors.RED, Colors.RED, Colors.BLUE, Colors.BLUE,
      Colors.PURPLE, Colors.BLUE, Colors.BLUE, Colors.BLUE,
      Colors.ORANGE, Colors.YELLOW, Colors.YELLOW, Colors.YELLOW,
      Colors.ORANGE, Colors.ORANGE, Colors.ORANGE, Colors.RED,
    ],
    allowed_pieces: [
      PieceIds.ID_1, PieceIds.ID_4, PieceIds.ID_2, PieceIds.ID_6,
      PieceIds.ID_3, PieceIds.ID_10, PieceIds.ID_8,
    ],
  },
};

/**
 * Get a level by its ID
 * @param levelId - Level number (1-50)
 * @returns Level data or undefined if not found
 */
export function getLevel(levelId: number): Level | undefined {
  return LEVELS[levelId];
}

/**
 * Get all available level IDs
 * @returns Array of level IDs (1-50)
 */
export function getAllLevelIds(): number[] {
  return Object.keys(LEVELS).map(Number).sort((a, b) => a - b);
}

/**
 * Check if a level ID is valid
 * @param levelId - Level number to check
 * @returns True if level exists
 */
export function isValidLevel(levelId: number): boolean {
  return levelId >= 1 && levelId <= 50 && LEVELS[levelId] !== undefined;
}

/**
 * Get the total number of levels
 * @returns Total count of levels
 */
export function getTotalLevels(): number {
  return Object.keys(LEVELS).length;
}
