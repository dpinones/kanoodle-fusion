/**
 * useLoadLevel Hook
 * Handles loading level information from contract
 * Pattern adapted from activations/client
 */

import { useState, useCallback } from 'react';
import { useContract } from '@starknet-react/core';
import { KANOODLE_SYSTEM_ADDRESS, KANOODLE_SYSTEM_ABI } from '../lib/config';
import type { Level } from '../lib/kanoodle/types';

interface UseLoadLevelReturn {
  loadLevel: (levelId: number) => Promise<Level | null>;
  currentLevel: Level | null;
  isLoading: boolean;
  error: string | null;
}

export function useLoadLevel(): UseLoadLevelReturn {
  // @ts-expect-error - ABI type mismatch with starknet.js, will be fixed later
  const { contract } = useContract({
    address: KANOODLE_SYSTEM_ADDRESS,
    abi: KANOODLE_SYSTEM_ABI,
  });

  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLevel = useCallback(
    async (levelId: number): Promise<Level | null> => {
      if (!contract) {
        setError('Contract not initialized');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Loading level:', levelId);

        // Call get_level view function
        // @ts-expect-error - Contract call type mismatch
        const levelData = await contract.call('get_level', [levelId]);

        // Parse level data
        const level: Level = {
          level_id: levelData.level_id || levelId,
          solution: levelData.solution || [],
          allowed_pieces: levelData.allowed_pieces || [],
        };

        setCurrentLevel(level);
        console.log('Level loaded successfully:', level);

        return level;
      } catch (err: any) {
        console.error('Failed to load level:', err);
        const errorMessage = err?.message || 'Failed to load level';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  return {
    loadLevel,
    currentLevel,
    isLoading,
    error,
  };
}
