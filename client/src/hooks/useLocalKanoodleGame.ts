/**
 * useLocalKanoodleGame Hook
 * Manages Kanoodle game state purely in the frontend (no blockchain)
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  KanoodleGame,
  Level,
  GamePiece,
  GameStats,
  RotationValue,
  ColorValue,
} from '../lib/kanoodle/types';
import { getLevel } from '../lib/kanoodle/levels';
import { getPieceDefinition as getLocalPieceDefinition } from '../lib/kanoodle/pieces';
import { gamePieceToCells, Colors } from '../lib/kanoodle/types';
import { transformPiece } from '../lib/kanoodle/pieceUtils';

// Local storage keys
const STORAGE_KEYS = {
  GAME_STATS: 'kanoodle_stats',
};

interface PlacedPieceData {
  piece_id: number;
  x: number;
  y: number;
  rotation: RotationValue;
  flipped: boolean;
}

interface LocalGameState {
  level_id: number;
  current_solution: number[];
  placed_pieces: PlacedPieceData[];
  placed_piece_ids: number[];
}

interface UseLocalKanoodleGameReturn {
  // State
  gameState: KanoodleGame | null;
  currentLevel: Level | null;
  playerStats: GameStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  placePiece: (
    pieceId: number,
    x: number,
    y: number,
    rotation: RotationValue,
    flipped: boolean
  ) => Promise<boolean>;
  resetGame: () => Promise<boolean>;
  undoGame: () => Promise<boolean>;
  getPieceDefinition: (pieceId: number) => Promise<GamePiece | null>;
}

// Helper: Mix two colors together (additive mixing)
function mixColors(color1: ColorValue, color2: ColorValue): ColorValue {
  if (color1 === Colors.EMPTY) return color2;
  if (color2 === Colors.EMPTY) return color1;
  if (color1 === Colors.NEUTRAL) return color2;
  if (color2 === Colors.NEUTRAL) return color1;

  // If same color, just return it
  if (color1 === color2) return color1;

  // Sort to ensure consistent mixing order
  const [c1, c2] = [color1, color2].sort();

  // Primary color mixing
  if (c1 === Colors.RED && c2 === Colors.YELLOW) return Colors.ORANGE;
  if (c1 === Colors.RED && c2 === Colors.BLUE) return Colors.PURPLE;
  if (c1 === Colors.YELLOW && c2 === Colors.BLUE) return Colors.GREEN;

  // If mixing more than 2 primaries or incompatible colors, return empty/muddy
  return Colors.EMPTY;
}

// Helper: Calculate board state after placing pieces
function calculateBoardState(placedPieces: PlacedPieceData[]): number[] {
  // Initialize empty 4x4 board
  const board: ColorValue[] = new Array(16).fill(Colors.EMPTY);

  for (const placed of placedPieces) {
    const pieceDefinition = getLocalPieceDefinition(placed.piece_id);
    if (!pieceDefinition) continue;

    const cells = gamePieceToCells(pieceDefinition);

    // Apply transformations using the same function as the UI
    const transformedCells = transformPiece(cells, placed.rotation, placed.flipped, placed.piece_id);

    // Place cells on board
    for (const cell of transformedCells) {
      const boardX = placed.x + cell.x;
      const boardY = placed.y + cell.y;

      // Check bounds (4x4 board, 0-indexed)
      if (boardX < 0 || boardX >= 4 || boardY < 0 || boardY >= 4) continue;

      const boardIndex = boardY * 4 + boardX;
      board[boardIndex] = mixColors(board[boardIndex], cell.color);
    }
  }

  return board;
}

// Helper: Check if piece placement is valid
function isValidPlacement(
  pieceId: number,
  x: number,
  y: number,
  rotation: RotationValue,
  flipped: boolean,
  currentPieces: PlacedPieceData[]
): boolean {
  const pieceDefinition = getLocalPieceDefinition(pieceId);
  if (!pieceDefinition) return false;

  const cells = gamePieceToCells(pieceDefinition);

  // Apply transformations using the same function as the UI
  const transformedCells = transformPiece(cells, rotation, flipped, pieceId);

  // Check if all cells are within bounds
  for (const cell of transformedCells) {
    const boardX = x + cell.x;
    const boardY = y + cell.y;

    if (boardX < 0 || boardX >= 4 || boardY < 0 || boardY >= 4) {
      return false;
    }
  }

  // Check if piece already placed
  if (currentPieces.some(p => p.piece_id === pieceId)) {
    return false;
  }

  return true;
}

export function useLocalKanoodleGame(levelId?: number): UseLocalKanoodleGameReturn {
  const [gameState, setGameState] = useState<KanoodleGame | null>(null);
  const [localGameState, setLocalGameState] = useState<LocalGameState | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [playerStats, setPlayerStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load player stats from localStorage (only on mount)
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEYS.GAME_STATS);

    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse saved stats:', e);
      }
    } else {
      setPlayerStats({
        player: 'local_player',
        games_played: 0,
        games_solved: 0,
        best_moves: 0,
        total_moves: 0,
      });
    }
  }, []);

  // Initialize game state when levelId changes
  useEffect(() => {
    if (!levelId) {
      setLocalGameState(null);
      setCurrentLevel(null);
      return;
    }

    console.log('🎮 Loading level:', levelId);

    // Load level configuration
    const level = getLevel(levelId);
    if (!level) {
      console.error('❌ Level not found:', levelId);
      setError(`Level ${levelId} not found`);
      return;
    }

    setCurrentLevel(level);

    // Initialize fresh game state for this level
    const newGameState: LocalGameState = {
      level_id: levelId,
      current_solution: new Array(16).fill(Colors.EMPTY),
      placed_pieces: [],
      placed_piece_ids: [],
    };

    setLocalGameState(newGameState);
    console.log('✅ Level loaded:', levelId);
  }, [levelId]);

  // Sync localGameState to gameState
  useEffect(() => {
    if (localGameState) {
      setGameState({
        game_id: localGameState.level_id, // Use levelId as game_id for compatibility
        player: 'local_player',
        level_id: localGameState.level_id,
        current_solution: localGameState.current_solution,
        placed_piece_ids: localGameState.placed_piece_ids,
      });
    }
  }, [localGameState]);

  // Save player stats to localStorage
  const savePlayerStats = useCallback((stats: GameStats) => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
    setPlayerStats(stats);
  }, []);

  // Place a piece on the board
  const placePiece = useCallback(
    async (
      pieceId: number,
      x: number,
      y: number,
      rotation: RotationValue,
      flipped: boolean
    ): Promise<boolean> => {
      if (!localGameState) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Validate placement
        if (!isValidPlacement(pieceId, x, y, rotation, flipped, localGameState.placed_pieces)) {
          throw new Error('Invalid piece placement');
        }

        const newPlacedPiece: PlacedPieceData = {
          piece_id: pieceId,
          x,
          y,
          rotation,
          flipped,
        };

        const newPlacedPieces = [...localGameState.placed_pieces, newPlacedPiece];
        const newBoard = calculateBoardState(newPlacedPieces);

        const updatedGameState: LocalGameState = {
          ...localGameState,
          placed_pieces: newPlacedPieces,
          placed_piece_ids: [...localGameState.placed_piece_ids, pieceId],
          current_solution: newBoard,
        };

        setLocalGameState(updatedGameState);

        // Update total moves stat
        if (playerStats) {
          savePlayerStats({
            ...playerStats,
            total_moves: playerStats.total_moves + 1,
          });
        }

        // Check if game is solved
        if (currentLevel) {
          const isSolved = newBoard.every((color, idx) => color === currentLevel.solution[idx]);
          if (isSolved && playerStats) {
            savePlayerStats({
              ...playerStats,
              games_solved: playerStats.games_solved + 1,
              best_moves:
                playerStats.best_moves === 0
                  ? newPlacedPieces.length
                  : Math.min(playerStats.best_moves, newPlacedPieces.length),
            });
          }
        }

        return true;
      } catch (err: any) {
        console.error('Failed to place piece:', err);
        setError(err?.message || 'Failed to place piece');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [localGameState, currentLevel, playerStats, savePlayerStats]
  );

  // Reset the entire game
  const resetGame = useCallback(async (): Promise<boolean> => {
    if (!localGameState) {
      setError('Game not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedGameState: LocalGameState = {
        ...localGameState,
        placed_pieces: [],
        placed_piece_ids: [],
        current_solution: new Array(16).fill(Colors.EMPTY),
      };

      setLocalGameState(updatedGameState);

      return true;
    } catch (err: any) {
      console.error('Failed to reset game:', err);
      setError(err?.message || 'Failed to reset game');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [localGameState]);

  // Undo the last placed piece
  const undoGame = useCallback(async (): Promise<boolean> => {
    if (!localGameState || localGameState.placed_pieces.length === 0) {
      setError('No pieces to undo');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newPlacedPieces = localGameState.placed_pieces.slice(0, -1);
      const newBoard = calculateBoardState(newPlacedPieces);

      const updatedGameState: LocalGameState = {
        ...localGameState,
        placed_pieces: newPlacedPieces,
        placed_piece_ids: newPlacedPieces.map(p => p.piece_id),
        current_solution: newBoard,
      };

      setLocalGameState(updatedGameState);

      return true;
    } catch (err: any) {
      console.error('Failed to undo:', err);
      setError(err?.message || 'Failed to undo last piece');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [localGameState]);

  // Get piece definition
  const getPieceDefinition = useCallback(
    async (pieceId: number): Promise<GamePiece | null> => {
      try {
        const piece = getLocalPieceDefinition(pieceId);
        if (!piece) {
          console.warn(`Piece ${pieceId} not found in local definitions`);
          return null;
        }
        return piece;
      } catch (err) {
        console.error('Failed to get piece definition:', err);
        return null;
      }
    },
    []
  );

  return {
    gameState,
    currentLevel,
    playerStats,
    isLoading,
    error,
    placePiece,
    resetGame,
    undoGame,
    getPieceDefinition,
  };
}
