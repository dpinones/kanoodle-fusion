// Kanoodle Fusion Configuration
// Frontend-only version (no blockchain integration)

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

// Board configuration
export const BOARD_SIZE = 4; // 4x4 grid
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE; // 16 cells

// Game configuration
export const MAX_PIECES = 13;
export const INITIAL_LEVEL = 1;

// Animation durations (ms)
export const ANIMATION = {
  PIECE_MOVE: 200,
  PIECE_ROTATE: 150,
  PIECE_FLIP: 150,
  BOARD_CHECK: 300,
  SUCCESS: 500,
} as const;

// Touch/drag configuration
export const DRAG_CONFIG = {
  THRESHOLD: 5, // pixels to start drag
  SNAP_THRESHOLD: 20, // pixels to snap to grid
} as const;

// ============================================================================
// LOGGING
// ============================================================================

console.log('Kanoodle Fusion Configuration loaded (frontend-only mode)');
