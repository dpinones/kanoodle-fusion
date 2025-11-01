/**
 * GameController Component
 * Example component showing how to use Kanoodle hooks
 * Pattern adapted from activations/client
 */

import { useState, useEffect } from 'react';
import { useStartGame, useLoadLevel, usePlacePiece, useGameState } from '../../hooks';
import type { RotationValue } from '../../lib/kanoodle/types';

export function GameController() {
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // Use the hooks
  const { startGame, isLoading: isStarting, error: startError } = useStartGame();
  const { loadLevel, currentLevel, isLoading: isLoadingLevel, error: levelError } = useLoadLevel();
  const { placePiece, isLoading: isPlacing, error: placeError } = usePlacePiece();
  const { gameState, refreshGameState, isLoading: isLoadingState } = useGameState(currentGameId || undefined);

  // Load level information when selected level changes
  useEffect(() => {
    loadLevel(selectedLevel);
  }, [selectedLevel, loadLevel]);

  // Handle starting a new game
  const handleStartGame = async () => {
    const gameId = await startGame(selectedLevel);
    if (gameId) {
      setCurrentGameId(gameId);
    }
  };

  // Handle placing a piece
  const handlePlacePiece = async (
    pieceId: number,
    x: number,
    y: number,
    rotation: RotationValue = 0,
    flipped: boolean = false
  ) => {
    if (!currentGameId) {
      console.error('No active game');
      return;
    }

    const success = await placePiece(currentGameId, pieceId, x, y, rotation, flipped);
    if (success) {
      // Refresh game state after successful placement
      await refreshGameState();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Kanoodle Fusion Game Controller</h2>

      {/* Level Selection */}
      <div className="space-y-2">
        <label htmlFor="level-select" className="block font-medium">
          Select Level:
        </label>
        <select
          id="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          className="border rounded px-3 py-2"
          disabled={isStarting || !!currentGameId}
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {/* Level Info */}
      {currentLevel && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Level {currentLevel.level_id}</h3>
          <p>Solution cells: {currentLevel.solution?.length || 0}</p>
          <p>Allowed pieces: {currentLevel.allowed_pieces?.length || 0}</p>
        </div>
      )}

      {/* Start Game Button */}
      {!currentGameId && (
        <button
          onClick={handleStartGame}
          disabled={isStarting || isLoadingLevel}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isStarting ? 'Starting Game...' : 'Start Game'}
        </button>
      )}

      {/* Game State Display */}
      {currentGameId && gameState && (
        <div className="bg-green-100 p-4 rounded space-y-2">
          <h3 className="font-bold">Active Game #{currentGameId}</h3>
          <p>Level: {gameState.level_id}</p>
          <p>Pieces Placed: {gameState.pieces_count}</p>
          <p>Moves: {gameState.moves_count}</p>
          <p>Solved: {gameState.is_solved ? '✓ Yes' : '✗ No'}</p>

          {/* Example: Place a piece */}
          <button
            onClick={() => handlePlacePiece(0, 0, 0, 0, false)}
            disabled={isPlacing || gameState.is_solved}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-300"
          >
            {isPlacing ? 'Placing Piece...' : 'Place Piece 0 at (0,0)'}
          </button>

          <button
            onClick={refreshGameState}
            disabled={isLoadingState}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 ml-2"
          >
            {isLoadingState ? 'Refreshing...' : 'Refresh State'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {(startError || levelError || placeError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{startError || levelError || placeError}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2">How to Use:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select a level from the dropdown</li>
          <li>Click "Start Game" to create a new game</li>
          <li>Use the game controls to place pieces</li>
          <li>The game state will update automatically</li>
        </ol>
      </div>
    </div>
  );
}
