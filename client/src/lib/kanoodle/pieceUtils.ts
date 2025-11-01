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
  // Rotation matrix for 90° clockwise: (x, y) -> (y, -x)
  // But we need to adjust for positive coordinates
  // For a bounding box, we rotate around center
  return {
    x: cell.y,
    y: -cell.x,
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
