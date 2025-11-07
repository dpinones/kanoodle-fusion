/**
 * useKanoodleGame Hook
 * Manages Kanoodle game state and interactions with Dojo system
 * Pattern adapted from activations/client
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useContract } from '@starknet-react/core';
import { KANOODLE_SYSTEM_ADDRESS, KANOODLE_SYSTEM_ABI } from '../lib/config';
import type {
  KanoodleGame,
  Level,
  GamePiece,
  GameStats,
  RotationValue,
} from '../lib/kanoodle/types';
import { getLevel } from '../lib/kanoodle/levels';
import { getPieceDefinition as getLocalPieceDefinition } from '../lib/kanoodle/pieces';
import { adjustParamsForContract } from '../lib/kanoodle/pieceUtils';

// Use ABI from manifest - Updated to match actual contract functions
const KANOODLE_ABI = KANOODLE_SYSTEM_ABI || [
  {
    name: 'start_game',
    type: 'function',
    inputs: [
      { name: 'player', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'level_id', type: 'core::integer::u8' },
    ],
    outputs: [{ type: 'core::integer::u32' }],
    state_mutability: 'external',
  },
  {
    name: 'place_piece',
    type: 'function',
    inputs: [
      { name: 'game_id', type: 'core::integer::u32' },
      { name: 'player', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'piece_id', type: 'core::integer::u8' },
      { name: 'x', type: 'core::integer::u8' },
      { name: 'y', type: 'core::integer::u8' },
      { name: 'rotation', type: 'core::integer::u8' },
      { name: 'flipped', type: 'core::bool' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
  {
    name: 'reset',
    type: 'function',
    inputs: [
      { name: 'game_id', type: 'core::integer::u32' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
  {
              name: 'undo',
              inputs: [
                {
                  name: 'game_id',
                  type: 'core::integer::u32'
                }
              ],
              outputs: [
                {
                  type: 'core::bool'
                }
              ],
              state_mutability: 'external'
            },
  {
    name: 'get_game_state',
    type: 'function',
    inputs: [
      { name: 'game_id', type: 'core::integer::u32' },
      { name: 'player', type: 'core::starknet::contract_address::ContractAddress' },
    ],
    outputs: [{ type: 'KanoodleGame' }],
    state_mutability: 'view',
  },
];

interface UseKanoodleGameReturn {
  // State
  gameState: KanoodleGame | null;
  currentLevel: Level | null;
  playerStats: GameStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startGame: (levelId: number) => Promise<number | null>;
  placePiece: (
    pieceId: number,
    x: number,
    y: number,
    rotation: RotationValue,
    flipped: boolean
  ) => Promise<boolean>;
  removePiece: (pieceId: number) => Promise<boolean>; // Deprecated - use resetGame instead
  resetGame: () => Promise<boolean>;
  undoGame: () => Promise<boolean>;
  refreshGameState: () => Promise<void>;
  loadLevel: (levelId: number) => Promise<void>;
  getPieceDefinition: (pieceId: number) => Promise<GamePiece | null>;
}

export function useKanoodleGame(gameId?: number): UseKanoodleGameReturn {
  const { address, account } = useAccount();
  const { contract } = useContract({
    address: KANOODLE_SYSTEM_ADDRESS as `0x${string}`,
    abi: KANOODLE_ABI as any,
  });

  const [gameState, setGameState] = useState<KanoodleGame | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [playerStats, setPlayerStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start a new game
  const startGame = useCallback(
    async (levelId: number): Promise<number | null> => {
      if (!address || !account) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Starting game with LEVEL:', levelId);

        // const level_id = 4;

        // Call the start_game function via account.execute
        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'start_game',
          calldata: [address, levelId],
        });

        console.log('Transaction sent:', tx.transaction_hash);

        // Wait for transaction to be confirmed
        await account.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        });

        console.log('Transaction confirmed:', tx.transaction_hash);

        // Extract game_id from receipt events
        const receipt: any = await account.getTransactionReceipt(tx.transaction_hash);
        console.log('Transaction receipt:', receipt);

        // GameStarted event keys:
        // Starknet selector: 0x0301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88
        // Alternative format: 0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88 (without leading 0)
        // ByteArray hash: 0x073ec113228a7b192143f3be0991f1cb6b30e9ac596896a24b93dad89db06ce9
        const gameStartedSelector1 = '0x0301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88';
        const gameStartedSelector2 = '0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88';
        const gameStartedByteArrayHash = '0x073ec113228a7b192143f3be0991f1cb6b30e9ac596896a24b93dad89db06ce9';

        let newGameId: number | null = null;

        // Receipt can have different structures depending on starknet.js version
        const events = receipt.events || (receipt as any).transaction_receipt?.events || [];

        if (events && events.length > 0) {
          // Find GameStarted event
          for (const event of events) {

            // Check if this is the GameStarted event (match by key)
            if (event.keys && event.keys.length > 0) {
              const eventKey = event.keys[0];

              // Normalize comparison - convert both to same format
              const normalizedEventKey = eventKey.toLowerCase();
              const isGameStartedEvent =
                normalizedEventKey === gameStartedSelector1.toLowerCase() ||
                normalizedEventKey === gameStartedSelector2.toLowerCase() ||
                normalizedEventKey === gameStartedByteArrayHash.toLowerCase();

              if (isGameStartedEvent) {
                console.log('Found GameStarted event!', event);

                // GameStarted event structure:
                // - keys[0]: event selector (0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88)
                // - data[0]: game_id (u32) - e.g., 0x25 = 37
                // - data[1]: player (ContractAddress)

                if (event.data && event.data.length > 0) {
                  const gameIdBigInt = BigInt(event.data[0]);
                  newGameId = Number(gameIdBigInt);
                  console.log('Extracted game_id from event:', newGameId, 'from hex:', event.data[0]);
                  break;
                }
              }
            }
          }
        }

        if (newGameId === null) {
          console.error('Could not extract game_id from receipt events');
          console.log('Full receipt:', JSON.stringify(receipt, null, 2));
          throw new Error('Failed to extract game_id from transaction receipt');
        }

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

  // Place a piece on the board
  const placePiece = useCallback(
    async (
      pieceId: number,
      x: number,
      y: number,
      rotation: RotationValue,
      flipped: boolean
    ): Promise<boolean> => {
      if (!address || !account || !gameId) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Placing piece (client params):', { pieceId, x, y, rotation, flipped });

        // Adjust parameters for contract based on piece-specific transformations
        const adjustedParams = adjustParamsForContract(pieceId, rotation, flipped);
        console.log('Adjusted params for contract:', adjustedParams);

        // Call place_piece via account.execute
        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'place_piece',
          calldata: [gameId, address, pieceId, x, y, adjustedParams.rotation, adjustedParams.flipped ? 1 : 0],
        });

        console.log('Transaction sent:', tx.transaction_hash);

        // Wait for transaction confirmation
        await account.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        });

        console.log('Piece placed successfully');

        // Refresh game state after successful placement
        await refreshGameState();

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
    [address, account, gameId]
  );

  // Remove a piece from the board
  // NOTE: remove_piece function no longer exists in contract
  // The new contract only has reset() which resets the entire game
  const removePiece = useCallback(
    async (_pieceId: number): Promise<boolean> => {
      console.warn('removePiece called but remove_piece() no longer exists in contract');
      console.warn('Use reset() to reset the entire game instead');
      setError('Remove piece not supported. Use reset to start over.');
      return false;
    },
    []
  );

  // Reset the entire game
  const resetGame = useCallback(
    async (): Promise<boolean> => {
      if (!account || !gameId) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Resetting game:', gameId);

        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'reset',
          calldata: [gameId],
        });

        console.log('Reset transaction sent:', tx.transaction_hash);

        await account.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        });

        console.log('Game reset successfully');
        await refreshGameState();
        return true;
      } catch (err: any) {
        console.error('Failed to reset game:', err);
        const errorMessage = err?.message || 'Failed to reset game';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account, gameId]
  );

  // Undo the last placed piece
  const undoGame = useCallback(
    async (): Promise<boolean> => {
      if (!account || !gameId) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Undoing last piece:', gameId);

        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'undo',
          calldata: [gameId],
        });

        console.log('Undo transaction sent:', tx.transaction_hash);

        await account.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        });

        console.log('Undo successful');
        await refreshGameState();
        return true;
      } catch (err: any) {
        console.error('Failed to undo:', err);
        const errorMessage = err?.message || 'Failed to undo last piece';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account, gameId]
  );

  // Refresh game state from contract
  const refreshGameState = useCallback(async () => {
    if (!gameId) return;

    setIsLoading(true);
    setError(null);

    try {
      // If no wallet connected, create a mock game state for preview
      if (!contract || !address) {
        console.log('No wallet connected - creating mock game state for gameId:', gameId);
        const mockState: KanoodleGame = {
          game_id: gameId,
          player: '0x0' as `0x${string}`,
          level_id: 1, // Default to level 1
          current_solution: new Array(16).fill(0),
          placed_piece_ids: [],
        };
        setGameState(mockState);
        setIsLoading(false);
        return;
      }

      const state = await contract.get_game_state(gameId, address);
      console.log('=== RAW game state from contract ===');
      console.log('Full state:', state);
      console.log('Placed piece IDs raw:', (state as any).placed_piece_ids);
      console.log('Type of placed_piece_ids:', typeof (state as any).placed_piece_ids);
      console.log('Is Array?:', Array.isArray((state as any).placed_piece_ids));

      // Convert BigInt values in placed_piece_ids to numbers
      const processedState = {
        ...state,
        placed_piece_ids: Array.isArray((state as any).placed_piece_ids)
          ? (state as any).placed_piece_ids.map((id: any) => Number(id))
          : [],
      };

      console.log('Processed placed_piece_ids:', processedState.placed_piece_ids);
      setGameState(processedState as KanoodleGame);
    } catch (err) {
      console.error('Failed to get game state:', err);
      setError('Failed to load game state');
    } finally {
      setIsLoading(false);
    }
  }, [contract, address, gameId]);

  // Load level information (now using local constants instead of contract call)
  const loadLevel = useCallback(
    async (levelId: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const level = getLevel(levelId);
        if (!level) {
          throw new Error(`Level ${levelId} not found`);
        }
        setCurrentLevel(level);
      } catch (err) {
        console.error('Failed to load level:', err);
        setError('Failed to load level');
      } finally {
        setIsLoading(false);
      }
    },
    [] // No longer depends on contract
  );

  // Get piece definition (now using local constants instead of contract call)
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
    [] // No longer depends on contract
  );

  // Load player stats on mount
  // NOTE: get_player_stats is no longer available in the contract
  // Stats would need to be computed client-side or from events
  useEffect(() => {
    if (!address) return;

    // TODO: Implement client-side stats tracking or fetch from events
    // For now, we just set empty stats
    setPlayerStats({
      player: address,
      games_played: 0,
      games_solved: 0,
      best_moves: 0,
      total_moves: 0,
    });
  }, [address]);

  // Refresh game state when gameId changes
  useEffect(() => {
    if (gameId) {
      refreshGameState();
    }
  }, [gameId, refreshGameState]);

  return {
    gameState,
    currentLevel,
    playerStats,
    isLoading,
    error,
    startGame,
    placePiece,
    removePiece,
    resetGame,
    undoGame,
    refreshGameState,
    loadLevel,
    getPieceDefinition,
  };
}
