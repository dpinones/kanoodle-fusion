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

// Use ABI from manifest
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
    name: 'remove_piece',
    type: 'function',
    inputs: [
      { name: 'game_id', type: 'core::integer::u32' },
      { name: 'player', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'piece_id', type: 'core::integer::u8' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
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
  {
    name: 'get_level',
    type: 'function',
    inputs: [{ name: 'level_id', type: 'core::integer::u8' }],
    outputs: [{ type: 'Level' }],
    state_mutability: 'view',
  },
  {
    name: 'get_piece_definition',
    type: 'function',
    inputs: [{ name: 'piece_id', type: 'core::integer::u8' }],
    outputs: [{ type: 'GamePiece' }],
    state_mutability: 'view',
  },
  {
    name: 'get_player_stats',
    type: 'function',
    inputs: [{ name: 'player', type: 'core::starknet::contract_address::ContractAddress' }],
    outputs: [{ type: 'GameStats' }],
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
  removePiece: (pieceId: number) => Promise<boolean>;
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
        console.log('Placing piece:', { pieceId, x, y, rotation, flipped });

        // Call place_piece via account.execute
        const tx = await account.execute({
          contractAddress: KANOODLE_SYSTEM_ADDRESS,
          entrypoint: 'place_piece',
          calldata: [gameId, address, pieceId, x, y, rotation, flipped ? 1 : 0],
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
  const removePiece = useCallback(
    async (pieceId: number): Promise<boolean> => {
      if (!contract || !address || !gameId) {
        setError('Game not initialized');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract.remove_piece(gameId, address, pieceId);
        const success = Boolean(result);

        if (success) {
          await refreshGameState();
        }

        return success;
      } catch (err) {
        console.error('Failed to remove piece:', err);
        setError('Failed to remove piece');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, address, gameId]
  );

  // Refresh game state from contract
  const refreshGameState = useCallback(async () => {
    if (!contract || !address || !gameId) return;

    setIsLoading(true);
    setError(null);

    try {
      const state = await contract.get_game_state(gameId, address);
      setGameState(state as KanoodleGame);
    } catch (err) {
      console.error('Failed to get game state:', err);
      setError('Failed to load game state');
    } finally {
      setIsLoading(false);
    }
  }, [contract, address, gameId]);

  // Load level information
  const loadLevel = useCallback(
    async (levelId: number) => {
      if (!contract) return;

      setIsLoading(true);
      setError(null);

      try {
        const level = await contract.get_level(levelId);
        setCurrentLevel(level as Level);
      } catch (err) {
        console.error('Failed to load level:', err);
        setError('Failed to load level');
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  // Get piece definition
  const getPieceDefinition = useCallback(
    async (pieceId: number): Promise<GamePiece | null> => {
      if (!contract) return null;

      try {
        const piece = await contract.get_piece_definition(pieceId);
        return piece as GamePiece;
      } catch (err) {
        console.error('Failed to get piece definition:', err);
        return null;
      }
    },
    [contract]
  );

  // Load player stats on mount
  useEffect(() => {
    if (!contract || !address) return;

    const loadStats = async () => {
      try {
        const stats = await contract.get_player_stats(address);
        setPlayerStats(stats as GameStats);
      } catch (err) {
        console.error('Failed to load player stats:', err);
      }
    };

    loadStats();
  }, [contract, address]);

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
    refreshGameState,
    loadLevel,
    getPieceDefinition,
  };
}
