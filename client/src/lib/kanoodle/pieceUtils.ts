/**
 * Kanoodle Fusion - Piece Transformation Utilities
 * Handles rotation and flipping of pieces
 */

import { PieceCell, RotationValue, Rotations } from './types';

/**
 * Rotate a piece cell 90 degrees clockwise
 * Rotation is relative to piece origin (0,0)
 */
function rotateCellClockwise(cell: PieceCell): PieceCell {
  // Rotation matrix for 90° clockwise: (x, y) -> (-y, x)
  // This works correctly with normalization
  return {
    x: -cell.y,
    y: cell.x,
    color: cell.color,
  };
}

/**
 * Normalize piece cells to ensure all coordinates are positive
 * Shifts all cells so minimum x and y are 0
 */
function normalizeCells(cells: PieceCell[]): PieceCell[] {
  if (cells.length === 0) return [];

  const minX = Math.min(...cells.map(c => c.x));
  const minY = Math.min(...cells.map(c => c.y));

  return cells.map(cell => ({
    x: cell.x - minX,
    y: cell.y - minY,
    color: cell.color,
  }));
}

/**
 * Rotate piece cells by specified rotation value
 * @param cells - Original piece cells
 * @param rotation - Rotation value (0=0°, 1=90°, 2=180°, 3=270°)
 * @returns Rotated and normalized cells
 */
export function rotatePiece(cells: PieceCell[], rotation: RotationValue): PieceCell[] {
  let rotated = [...cells];

  // Apply rotation the specified number of times
  for (let i = 0; i < rotation; i++) {
    rotated = rotated.map(rotateCellClockwise);
  }

  return normalizeCells(rotated);
}

/**
 * Flip piece cells horizontally
 * @param cells - Original piece cells
 * @returns Flipped and normalized cells
 */
export function flipPiece(cells: PieceCell[]): PieceCell[] {
  if (cells.length === 0) return [];

  const maxX = Math.max(...cells.map(c => c.x));

  const flipped = cells.map(cell => ({
    x: maxX - cell.x,
    y: cell.y,
    color: cell.color,
  }));

  return normalizeCells(flipped);
}

/**
 * Apply both rotation and flip to piece cells
 * @param cells - Original piece cells
 * @param rotation - Rotation value
 * @param flipped - Whether to flip horizontally
 * @returns Transformed cells
 */
export function transformPiece(
  cells: PieceCell[],
  rotation: RotationValue,
  flipped: boolean
): PieceCell[] {
  let transformed = cells;

  // Apply flip first, then rotation
  if (flipped) {
    transformed = flipPiece(transformed);
  }

  if (rotation !== Rotations.DEG_0) {
    transformed = rotatePiece(transformed, rotation);
  }

  return transformed;
}

/**
 * Get the bounding box dimensions of a piece
 * @param cells - Piece cells
 * @returns Width and height of the bounding box
 */
export function getPieceBounds(cells: PieceCell[]): { width: number; height: number } {
  if (cells.length === 0) return { width: 0, height: 0 };

  const maxX = Math.max(...cells.map(c => c.x));
  const maxY = Math.max(...cells.map(c => c.y));

  return {
    width: maxX + 1,
    height: maxY + 1,
  };
}

/**
 * Check if a piece can be placed at a specific position on the board
 * @param cells - Piece cells (already transformed)
 * @param boardX - X position on board (0-3)
 * @param boardY - Y position on board (0-3)
 * @returns True if piece fits within board bounds
 */
export function canPlacePiece(
  cells: PieceCell[],
  boardX: number,
  boardY: number
): boolean {
  const BOARD_SIZE = 4;

  for (const cell of cells) {
    const finalX = boardX + cell.x;
    const finalY = boardY + cell.y;

    // Check if out of bounds
    if (finalX < 0 || finalX >= BOARD_SIZE || finalY < 0 || finalY >= BOARD_SIZE) {
      return false;
    }
  }

  return true;
}

/**
 * Get the absolute board positions for a placed piece
 * @param cells - Piece cells (already transformed)
 * @param boardX - X position on board
 * @param boardY - Y position on board
 * @returns Array of cells with absolute board positions
 */
export function getAbsoluteCellPositions(
  cells: PieceCell[],
  boardX: number,
  boardY: number
): Array<{ x: number; y: number; color: number }> {
  return cells.map(cell => ({
    x: boardX + cell.x,
    y: boardY + cell.y,
    color: cell.color,
  }));
}

/**
 * Rotate a rotation value by 90 degrees clockwise
 * @param current - Current rotation
 * @returns Next rotation value
 */
export function rotateClockwise(current: RotationValue): RotationValue {
  return ((current + 1) % 4) as RotationValue;
}

/**
 * Rotate a rotation value by 90 degrees counter-clockwise
 * @param current - Current rotation
 * @returns Previous rotation value
 */
export function rotateCounterClockwise(current: RotationValue): RotationValue {
  return ((current + 3) % 4) as RotationValue;
}

/**
 * Predict the resulting board state after placing a piece
 * @param currentBoard - Current board solution (16 cells)
 * @param pieceCells - Piece cells to place (already transformed)
 * @param boardX - X position on board
 * @param boardY - Y position on board
 * @returns Predicted board state after placement
 */
export function predictBoardAfterPlacement(
  currentBoard: number[],
  pieceCells: PieceCell[],
  boardX: number,
  boardY: number
): number[] {
  const BOARD_SIZE = 4;
  const newBoard = [...currentBoard];

  // Add each piece cell to the board
  for (const cell of pieceCells) {
    const finalX = boardX + cell.x;
    const finalY = boardY + cell.y;
    const index = finalY * BOARD_SIZE + finalX;

    // Mix colors additively
    // This is a simplified version - you may need to match the contract's mixing logic
    const currentColor = newBoard[index];
    const newColor = cell.color;

    // If current is empty, just use new color
    if (currentColor === 0) {
      newBoard[index] = newColor;
    } else if (newColor === 0) {
      // If new color is empty, keep current
      newBoard[index] = currentColor;
    } else {
      // Otherwise, mix colors
      // This should match the contract's color mixing logic
      // For now, using a simplified approach
      newBoard[index] = mixColors(currentColor, newColor);
    }
  }

  return newBoard;
}

/**
 * Mix two colors together (simplified version)
 * TODO: Match this with the contract's actual mixing logic
 */
function mixColors(color1: number, color2: number): number {
  // Color constants matching the contract
  const EMPTY = 0;
  const RED = 1;
  const YELLOW = 2;
  const BLUE = 3;
  const GREEN = 4;
  const ORANGE = 5;
  const PURPLE = 6;
  const NEUTRAL = 7;

  // If either is neutral, result is neutral
  if (color1 === NEUTRAL || color2 === NEUTRAL) return NEUTRAL;

  // Same color = same color
  if (color1 === color2) return color1;

  // Primary + Primary mixing
  if (color1 === RED && color2 === YELLOW) return ORANGE;
  if (color1 === YELLOW && color2 === RED) return ORANGE;
  if (color1 === RED && color2 === BLUE) return PURPLE;
  if (color1 === BLUE && color2 === RED) return PURPLE;
  if (color1 === YELLOW && color2 === BLUE) return GREEN;
  if (color1 === BLUE && color2 === YELLOW) return GREEN;

  // Secondary + Primary (results in EMPTY/muddy)
  if ((color1 === ORANGE && color2 === BLUE) || (color1 === BLUE && color2 === ORANGE)) return EMPTY;
  if ((color1 === PURPLE && color2 === YELLOW) || (color1 === YELLOW && color2 === PURPLE)) return EMPTY;
  if ((color1 === GREEN && color2 === RED) || (color1 === RED && color2 === GREEN)) return EMPTY;

  // Secondary + Secondary = EMPTY
  if ((color1 === ORANGE || color1 === PURPLE || color1 === GREEN) &&
      (color2 === ORANGE || color2 === PURPLE || color2 === GREEN)) {
    return EMPTY;
  }

  // Default to EMPTY if we don't know
  return EMPTY;
}
