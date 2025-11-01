/**
 * useGameState Hook
 * Handles fetching and managing game state
 * Pattern adapted from activations/client
 */

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContract } from '@starknet-react/core';
import { KANOODLE_SYSTEM_ADDRESS, KANOODLE_SYSTEM_ABI } from '../lib/config';
import type { KanoodleGame } from '../lib/kanoodle/types';

interface UseGameStateReturn {
  gameState: KanoodleGame | null;
  refreshGameState: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useGameState(gameId?: number): UseGameStateReturn {
  const { address } = useAccount();
  // @ts-expect-error - ABI type mismatch with starknet.js, will be fixed later
  const { contract } = useContract({
    address: KANOODLE_SYSTEM_ADDRESS,
    abi: KANOODLE_SYSTEM_ABI,
  });

  const [gameState, setGameState] = useState<KanoodleGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGameState = useCallback(async () => {
    if (!contract || !address || !gameId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching game state for game:', gameId);

      // Call get_game_state view function
      // @ts-expect-error - Contract call type mismatch
      const state = await contract.call('get_game_state', [gameId, address]);

      // Parse game state
      const parsedState: KanoodleGame = {
        game_id: state.game_id || gameId,
        player: state.player || address,
        level_id: state.level_id || 0,
        current_solution: state.current_solution || [],
        placed_piece_ids: state.placed_piece_ids || [],
        pieces_count: state.pieces_count || 0,
        is_solved: state.is_solved || false,
        moves_count: state.moves_count || 0,
        timestamp: state.timestamp || 0,
      };

      setGameState(parsedState);
      console.log('Game state loaded:', parsedState);
    } catch (err: any) {
      console.error('Failed to get game state:', err);
      const errorMessage = err?.message || 'Failed to load game state';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [contract, address, gameId]);

  // Auto-refresh when gameId changes
  useEffect(() => {
    if (gameId) {
      refreshGameState();
    }
  }, [gameId, refreshGameState]);

  return {
    gameState,
    refreshGameState,
    isLoading,
    error,
  };
}
