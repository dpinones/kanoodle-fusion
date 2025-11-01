/**
 * Kanoodle Fusion Types
 * TypeScript types matching Dojo Cairo models
 */

// Color constants matching Dojo
export const Colors = {
  EMPTY: 0,
  RED: 1,
  YELLOW: 2,
  BLUE: 3,
  GREEN: 4,      // Secondary: Yellow + Blue
  ORANGE: 5,     // Secondary: Red + Yellow
  PURPLE: 6,     // Secondary: Red + Blue
  NEUTRAL: 7,    // Neutral pieces (no color mixing)
} as const;

export type ColorValue = typeof Colors[keyof typeof Colors];

// Rotation constants: 0=0°, 1=90°, 2=180°, 3=270°
export const Rotations = {
  DEG_0: 0,
  DEG_90: 1,
  DEG_180: 2,
  DEG_270: 3,
} as const;

export type RotationValue = typeof Rotations[keyof typeof Rotations];

// Color names for display
export const ColorNames: Record<ColorValue, string> = {
  [Colors.EMPTY]: 'Empty',
  [Colors.RED]: 'Red',
  [Colors.YELLOW]: 'Yellow',
  [Colors.BLUE]: 'Blue',
  [Colors.GREEN]: 'Green',
  [Colors.ORANGE]: 'Orange',
  [Colors.PURPLE]: 'Purple',
  [Colors.NEUTRAL]: 'Neutral',
};

// Color hex codes for rendering - C64 Palette
export const ColorHex: Record<ColorValue, string> = {
  [Colors.EMPTY]: '#000000',       // Black (C64)
  [Colors.RED]: '#880000',         // Red (C64)
  [Colors.YELLOW]: '#EEEE77',      // Yellow (C64)
  [Colors.BLUE]: '#0088FF',        // Light Blue (C64)
  [Colors.GREEN]: '#00CC55',       // Green (C64)
  [Colors.ORANGE]: '#DD8855',      // Orange (C64)
  [Colors.PURPLE]: '#8c28d8',      // Purple (C64)
  [Colors.NEUTRAL]: '#BBBBBB',     // Light Grey (C64)
};

// Piece cell relative position
export interface PieceCell {
  x: number;
  y: number;
  color: ColorValue;
}

// Game piece definition (matches Dojo contract structure)
export interface GamePiece {
  piece_id: number;
  size: number; // Number of cells (1-4)
  // Cell 0
  x0: number;
  y0: number;
  color0: ColorValue;
  // Cell 1
  x1: number;
  y1: number;
  color1: ColorValue;
  // Cell 2
  x2: number;
  y2: number;
  color2: ColorValue;
  // Cell 3
  x3: number;
  y3: number;
  color3: ColorValue;
}

// Helper to convert GamePiece to PieceCell array
// Handles BigInt conversion from contract data
export function gamePieceToCells(piece: GamePiece): PieceCell[] {
  const cells: PieceCell[] = [];

  // Convert to number to handle BigInt values from contracts
  const toNum = (val: any): number => Number(val);

  if (toNum(piece.size) >= 1 && toNum(piece.color0) !== Colors.EMPTY) {
    cells.push({
      x: toNum(piece.x0),
      y: toNum(piece.y0),
      color: toNum(piece.color0) as ColorValue
    });
  }
  if (toNum(piece.size) >= 2 && toNum(piece.color1) !== Colors.EMPTY) {
    cells.push({
      x: toNum(piece.x1),
      y: toNum(piece.y1),
      color: toNum(piece.color1) as ColorValue
    });
  }
  if (toNum(piece.size) >= 3 && toNum(piece.color2) !== Colors.EMPTY) {
    cells.push({
      x: toNum(piece.x2),
      y: toNum(piece.y2),
      color: toNum(piece.color2) as ColorValue
    });
  }
  if (toNum(piece.size) >= 4 && toNum(piece.color3) !== Colors.EMPTY) {
    cells.push({
      x: toNum(piece.x3),
      y: toNum(piece.y3),
      color: toNum(piece.color3) as ColorValue
    });
  }

  return cells;
}

// Level definition
export interface Level {
  level_id: number;
  solution: number[];        // 16 cells (4x4) with final colors
  allowed_pieces: number[];  // List of piece IDs allowed for this level
}

// Placed piece state
export interface GamePlacedPiece {
  game_id: number;
  player: string;
  piece_id: number;
  x: number;
  y: number;
  rotation: RotationValue;
  flipped: boolean;
}

// Main game state (from Dojo get_game_state)
export interface KanoodleGame {
  game_id: number;
  player: string;
  level_id: number;
  current_solution: number[];  // 16 cells (4x4) with current colors after mixing
  placed_piece_ids: number[];  // List of piece IDs that have been placed
  pieces_count: number;
  is_solved: boolean;
  moves_count: number;
  timestamp: number;
}

// Player statistics
export interface GameStats {
  player: string;
  games_played: number;
  games_solved: number;
  best_moves: number;
  total_moves: number;
}

// Client-side piece state (for UI)
export interface ClientPieceState {
  piece_id: number;
  definition: GamePiece;
  location: 'spawn' | 'preview' | 'board';
  rotation: RotationValue;
  flipped: boolean;
  boardPosition?: { x: number; y: number }; // If placed on board
}

// Board cell state
export interface BoardCell {
  x: number;
  y: number;
  currentColor: ColorValue;
  targetColor: ColorValue;
  isCorrect: boolean;
}
