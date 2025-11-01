/**
 * useStartGame Hook
 * Handles starting a new Kanoodle Fusion game
 * Pattern adapted from activations/client
 */

import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { KANOODLE_SYSTEM_ADDRESS } from '../lib/config';

interface UseStartGameReturn {
  startGame: (levelId: number) => Promise<number | null>;
  isLoading: boolean;
  error: string | null;
  gameId: number | null;
}

export function useStartGame(): UseStartGameReturn {
  const { address, account } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<number | null>(null);

  const startGame = useCallback(
    async (levelId: number): Promise<number | null> => {
      if (!address || !account) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Starting game with level:', levelId);

        // Call the start_game function via account.execute
        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'start_game',
          calldata: [address, levelId],
        });

        console.log('Transaction sent:', tx.transaction_hash);

        // Wait for transaction to be confirmed
        await account.waitForTransaction(tx.transaction_hash);

        console.log('Transaction confirmed:', tx.transaction_hash);

        // TODO: Parse game_id from receipt events
        // For now, using a placeholder - you'll need to extract this from the actual receipt
        // Look for GameStarted event or parse return value
        const newGameId = Date.now() % 100000; // Placeholder

        setGameId(newGameId);
        console.log('Game started successfully with ID:', newGameId);

        return newGameId;
      } catch (err: any) {
        console.error('Failed to start game:', err);
        const errorMessage = err?.message || 'Failed to start game';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [address, account]
  );

  return {
    startGame,
    isLoading,
    error,
    gameId,
  };
}
