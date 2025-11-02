/**
 * Kanoodle Fusion - Piece Definitions
 * All 13 piece definitions with their shapes and colors
 * This allows the client to avoid calling Dojo's get_piece_definition
 */

import { GamePiece, Colors } from './types';
import { PieceIds } from './levels';

/**
 * All 13 Kanoodle Fusion piece definitions
 * Each piece contains:
 * - piece_id: The piece number (1-13)
 * - size: Number of cells in the piece (1-4)
 * - x0-x3, y0-y3: Relative coordinates of each cell
 * - color0-color3: Color of each cell
 */
export const PIECES: Record<number, GamePiece> = {
  // Piece 1: Straight 4-cell blue
  [PieceIds.ID_1]: {
    piece_id: PieceIds.ID_1,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.BLUE,
    x1: 0,
    y1: 1,
    color1: Colors.BLUE,
    x2: 0,
    y2: 2,
    color2: Colors.BLUE,
    x3: 0,
    y3: 3,
    color3: Colors.BLUE,
  },

  // Piece 2: Straight 4-cell red
  [PieceIds.ID_2]: {
    piece_id: PieceIds.ID_2,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.RED,
    x1: 0,
    y1: 1,
    color1: Colors.RED,
    x2: 0,
    y2: 2,
    color2: Colors.RED,
    x3: 0,
    y3: 3,
    color3: Colors.RED,
  },

  // Piece 3: Straight 4-cell yellow
  [PieceIds.ID_3]: {
    piece_id: PieceIds.ID_3,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.YELLOW,
    x1: 0,
    y1: 1,
    color1: Colors.YELLOW,
    x2: 0,
    y2: 2,
    color2: Colors.YELLOW,
    x3: 0,
    y3: 3,
    color3: Colors.YELLOW,
  },

  // Piece 4: Z-shaped 4-cell blue
  [PieceIds.ID_4]: {
    piece_id: PieceIds.ID_4,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.BLUE,
    x1: 0,
    y1: 1,
    color1: Colors.BLUE,
    x2: 1,
    y2: 1,
    color2: Colors.BLUE,
    x3: 1,
    y3: 2,
    color3: Colors.BLUE,
  },

  // Piece 5: Z-shaped 4-cell green
  [PieceIds.ID_5]: {
    piece_id: PieceIds.ID_5,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.GREEN,
    x1: 0,
    y1: 1,
    color1: Colors.GREEN,
    x2: 1,
    y2: 1,
    color2: Colors.GREEN,
    x3: 1,
    y3: 2,
    color3: Colors.GREEN,
  },

  // Piece 6: L-shaped 4-cell red
  [PieceIds.ID_6]: {
    piece_id: PieceIds.ID_6,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.RED,
    x1: 0,
    y1: 1,
    color1: Colors.RED,
    x2: 0,
    y2: 2,
    color2: Colors.RED,
    x3: 1,
    y3: 0,
    color3: Colors.RED,
  },

  // Piece 7: Elbow 3-cell orange
  [PieceIds.ID_7]: {
    piece_id: PieceIds.ID_7,
    size: 3,
    x0: 1,
    y0: 0,
    color0: Colors.ORANGE,
    x1: 0,
    y1: 1,
    color1: Colors.ORANGE,
    x2: 1,
    y2: 1,
    color2: Colors.ORANGE,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },

  // Piece 8: Straight 3-cell multicolor (Red, Yellow, Blue)
  [PieceIds.ID_8]: {
    piece_id: PieceIds.ID_8,
    size: 3,
    x0: 0,
    y0: 0,
    color0: Colors.RED,
    x1: 0,
    y1: 1,
    color1: Colors.YELLOW,
    x2: 0,
    y2: 2,
    color2: Colors.BLUE,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },

  // Piece 9: Straight 3-cell purple
  [PieceIds.ID_9]: {
    piece_id: PieceIds.ID_9,
    size: 3,
    x0: 0,
    y0: 0,
    color0: Colors.PURPLE,
    x1: 0,
    y1: 1,
    color1: Colors.PURPLE,
    x2: 0,
    y2: 2,
    color2: Colors.PURPLE,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },

  // Piece 10: T-shaped 4-cell yellow
  [PieceIds.ID_10]: {
    piece_id: PieceIds.ID_10,
    size: 4,
    x0: 0,
    y0: 0,
    color0: Colors.YELLOW,
    x1: 1,
    y1: 0,
    color1: Colors.YELLOW,
    x2: 2,
    y2: 0,
    color2: Colors.YELLOW,
    x3: 1,
    y3: 1,
    color3: Colors.YELLOW,
  },

  // Piece 11: Single neutral cell
  [PieceIds.ID_11]: {
    piece_id: PieceIds.ID_11,
    size: 1,
    x0: 0,
    y0: 0,
    color0: Colors.NEUTRAL,
    x1: 0,
    y1: 0,
    color1: Colors.EMPTY,
    x2: 0,
    y2: 0,
    color2: Colors.EMPTY,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },

  // Piece 12: Single neutral cell
  [PieceIds.ID_12]: {
    piece_id: PieceIds.ID_12,
    size: 1,
    x0: 0,
    y0: 0,
    color0: Colors.NEUTRAL,
    x1: 0,
    y1: 0,
    color1: Colors.EMPTY,
    x2: 0,
    y2: 0,
    color2: Colors.EMPTY,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },

  // Piece 13: Single neutral cell
  [PieceIds.ID_13]: {
    piece_id: PieceIds.ID_13,
    size: 1,
    x0: 0,
    y0: 0,
    color0: Colors.NEUTRAL,
    x1: 0,
    y1: 0,
    color1: Colors.EMPTY,
    x2: 0,
    y2: 0,
    color2: Colors.EMPTY,
    x3: 0,
    y3: 0,
    color3: Colors.EMPTY,
  },
};

/**
 * Get a piece definition by its ID
 * @param pieceId - Piece number (1-13)
 * @returns GamePiece definition or undefined if not found
 */
export function getPieceDefinition(pieceId: number): GamePiece | undefined {
  return PIECES[pieceId];
}

/**
 * Get all piece IDs
 * @returns Array of piece IDs (1-13)
 */
export function getAllPieceIds(): number[] {
  return Object.keys(PIECES).map(Number).sort((a, b) => a - b);
}

/**
 * Check if a piece ID is valid
 * @param pieceId - Piece number to check
 * @returns True if piece exists
 */
export function isValidPiece(pieceId: number): boolean {
  return pieceId >= 1 && pieceId <= 13 && PIECES[pieceId] !== undefined;
}

/**
 * Get the total number of pieces
 * @returns Total count of pieces (13)
 */
export function getTotalPieces(): number {
  return Object.keys(PIECES).length;
}

/**
 * Get piece name/description
 * @param pieceId - Piece number (1-13)
 * @returns Human-readable piece name
 */
export function getPieceName(pieceId: number): string {
  const names: Record<number, string> = {
    [PieceIds.ID_1]: 'Straight 4-cell Blue',
    [PieceIds.ID_2]: 'Straight 4-cell Red',
    [PieceIds.ID_3]: 'Straight 4-cell Yellow',
    [PieceIds.ID_4]: 'Z-shaped 4-cell Blue',
    [PieceIds.ID_5]: 'Z-shaped 4-cell Green',
    [PieceIds.ID_6]: 'L-shaped 4-cell Red',
    [PieceIds.ID_7]: 'Elbow 3-cell Orange',
    [PieceIds.ID_8]: 'Straight 3-cell Multicolor',
    [PieceIds.ID_9]: 'Straight 3-cell Purple',
    [PieceIds.ID_10]: 'T-shaped 4-cell Yellow',
    [PieceIds.ID_11]: 'Single Neutral Cell',
    [PieceIds.ID_12]: 'Single Neutral Cell',
    [PieceIds.ID_13]: 'Single Neutral Cell',
  };
  return names[pieceId] || `Unknown Piece ${pieceId}`;
}
