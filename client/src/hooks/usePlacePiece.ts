/**
 * usePlacePiece Hook
 * Handles placing pieces on the board
 * Pattern adapted from activations/client
 */

import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { KANOODLE_SYSTEM_ADDRESS } from '../lib/config';
import type { RotationValue } from '../lib/kanoodle/types';

interface UsePlacePieceReturn {
  placePiece: (
    gameId: number,
    pieceId: number,
    x: number,
    y: number,
    rotation: RotationValue,
    flipped: boolean
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function usePlacePiece(): UsePlacePieceReturn {
  const { address, account } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placePiece = useCallback(
    async (
      gameId: number,
      pieceId: number,
      x: number,
      y: number,
      rotation: RotationValue,
      flipped: boolean
    ): Promise<boolean> => {
      if (!address || !account) {
        setError('Wallet not connected');
        return false;
      }

      if (!gameId) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Placing piece:', { gameId, pieceId, x, y, rotation, flipped });

        // Call place_piece via account.execute
        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'place_piece',
          calldata: [
            gameId,
            address,
            pieceId,
            x,
            y,
            rotation,
            flipped ? 1 : 0, // Convert boolean to u8
          ],
        });

        console.log('Transaction sent:', tx.transaction_hash);

        // Wait for transaction confirmation
        await account.waitForTransaction(tx.transaction_hash);

        console.log('Piece placed successfully');

        return true;
      } catch (err: any) {
        console.error('Failed to place piece:', err);
        const errorMessage = err?.message || 'Failed to place piece';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [address, account]
  );

  return {
    placePiece,
    isLoading,
    error,
  };
}
