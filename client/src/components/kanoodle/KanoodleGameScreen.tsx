/**
 * KanoodleGameScreen Component
 * Main game screen with board, pieces, and controls
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { KanoodleBoard } from './KanoodleBoard';
import { PieceSpawn } from './PieceSpawn';
import { TargetBoard } from './TargetBoard';
import { ConnectWallet } from './ConnectWallet';
import { useKanoodleGame } from '../../hooks/useKanoodleGame';
import { getKanoodleText } from '../../lib/uiText';
import { rotateClockwise } from '../../lib/kanoodle/pieceUtils';
import {
  Rotations,
  type GamePiece,
  type RotationValue
} from '../../lib/kanoodle/types';

export function KanoodleGameScreen() {
  const text = getKanoodleText().game;
  const { address } = useAccount();
  const navigate = useNavigate();
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();

  // Convert gameId from URL param to number
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : null;

  // Game state
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [availablePieces, setAvailablePieces] = useState<GamePiece[]>([]);

  // Store transformations for each piece (by piece_id)
  const [pieceTransformations, setPieceTransformations] = useState<
    Record<number, { rotation: RotationValue; flipped: boolean }>
  >({});

  // Get current piece's transformation
  const pieceRotation = selectedPiece
    ? pieceTransformations[selectedPiece.piece_id]?.rotation ?? Rotations.DEG_0
    : Rotations.DEG_0;
  const pieceFlipped = selectedPiece
    ? pieceTransformations[selectedPiece.piece_id]?.flipped ?? false
    : false;

  // Success modal is now disabled - will be triggered by contract events
  // const [showSuccess, setShowSuccess] = useState(false);

  const {
    gameState,
    currentLevel,
    isLoading,
    error,
    placePiece,
    loadLevel,
    getPieceDefinition,
    refreshGameState,
  } = useKanoodleGame(gameId || undefined);

  // Redirect to home if no gameId
  useEffect(() => {
    if (!gameId) {
      console.error('No gameId in URL, redirecting to home');
      navigate('/home');
    }
  }, [gameId, navigate]);

  // Load game state and level data when gameId is available
  useEffect(() => {
    if (!gameId || !address) return;

    const loadGameData = async () => {
      console.log('Loading game data for gameId:', gameId);

      // Refresh game state to get level_id
      await refreshGameState();
    };

    loadGameData();
  }, [gameId, address, refreshGameState]);

  // Load level data when game state is loaded
  useEffect(() => {
    if (!gameState?.level_id) return;

    const loadLevelData = async () => {
      console.log('Loading level data for level_id:', gameState.level_id);
      await loadLevel(gameState.level_id);
    };

    loadLevelData();
  }, [gameState?.level_id, loadLevel]);

  // Load available pieces when level loads
  useEffect(() => {
    const loadPieces = async () => {
      if (!currentLevel || !currentLevel.allowed_pieces) return;

      console.log('Loading pieces for level:', currentLevel.level_id);
      const pieces: GamePiece[] = [];
      for (const pieceId of currentLevel.allowed_pieces) {
        const piece = await getPieceDefinition(pieceId);
        if (piece) {
          pieces.push(piece);
        }
      }
      setAvailablePieces(pieces);

      // Auto-select first piece if none selected
      if (pieces.length > 0 && !selectedPiece) {
        setSelectedPiece(pieces[0]);
      }
    };

    loadPieces();
  }, [currentLevel, getPieceDefinition, selectedPiece]);

  // Check if level is complete
  // NOTE: Level completion should be checked by the contract
  // For now, we'll rely on contract events or manual checking
  useEffect(() => {
    // TODO: Listen to contract events for game completion
    // For now, level completion UI is disabled
  }, []);

  // Handlers
  const handlePieceSelect = (piece: GamePiece) => {
    setSelectedPiece(piece);
    // No need to reset rotation/flip - each piece keeps its own state
  };

  const handleRotate = () => {
    if (!selectedPiece) return;
    const currentRotation =
      pieceTransformations[selectedPiece.piece_id]?.rotation ?? Rotations.DEG_0;
    const newRotation = rotateClockwise(currentRotation);

    setPieceTransformations((prev) => ({
      ...prev,
      [selectedPiece.piece_id]: {
        rotation: newRotation,
        flipped: prev[selectedPiece.piece_id]?.flipped ?? false,
      },
    }));
  };

  const handleFlip = () => {
    if (!selectedPiece) return;
    const currentFlipped = pieceTransformations[selectedPiece.piece_id]?.flipped ?? false;

    setPieceTransformations((prev) => ({
      ...prev,
      [selectedPiece.piece_id]: {
        rotation: prev[selectedPiece.piece_id]?.rotation ?? Rotations.DEG_0,
        flipped: !currentFlipped,
      },
    }));
  };

  const handleBoardClick = async (x: number, y: number) => {
    if (!selectedPiece || !gameId || !address) return;

    const success = await placePiece(
      selectedPiece.piece_id,
      x,
      y,
      pieceRotation,
      pieceFlipped
    );

    if (success) {
      // Clear the transformation for this piece after placement
      setPieceTransformations((prev) => {
        const newTransformations = { ...prev };
        delete newTransformations[selectedPiece.piece_id];
        return newTransformations;
      });
      // Keep piece selected - don't deselect
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!selectedPiece) return;
    e.dataTransfer.effectAllowed = 'move';
    // Store piece data in dataTransfer
    e.dataTransfer.setData('text/plain', 'dragging');
  };

  const handleDragEnd = () => {
    // Cleanup if needed
  };

  const handleBoardDrop = async (x: number, y: number) => {
    // Same as click handler
    await handleBoardClick(x, y);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleNextLevel = () => {
    // TODO: Implement level progression
    // For now, just go back to home
    navigate('/home');
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-[#6C5EB5] c64-screen flex items-center justify-center">
        <div className="text-center text-[#AAFFEE] c64-text-glow">
          <p className="text-xl mb-4">CONNECT WALLET</p>
          <p className="text-sm">TO START PLAYING</p>
        </div>
      </div>
    );
  }

  if (isLoading && !gameState) {
    return (
      <div className="min-h-screen bg-[#6C5EB5] c64-screen flex items-center justify-center">
        <div className="text-center text-[#AAFFEE] c64-text-glow">
          <div className="animate-spin text-6xl mb-4">⚙</div>
          <p className="text-xl">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6C5EB5] c64-screen relative overflow-hidden p-4 md:p-8">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Header - C64 Style */}
      <div className="max-w-7xl mx-auto mb-6 relative z-20">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Back button */}
          <button
            onClick={handleBackToHome}
            className="c64-button py-3 px-6 text-xs bg-[#880000] border-[#660000]"
          >
            ← {text.backButton}
          </button>

          {/* Level and moves info - C64 Style */}
          <div className="flex gap-4">
            <div className="bg-[#000000] border-2 border-[#A4A0E4] px-6 py-3">
              <span className="text-xs text-[#EEEE77] c64-text-glow font-bold">
                {text.level} {gameState?.level_id || '?'}
              </span>
            </div>
            <div className="bg-[#000000] border-2 border-[#A4A0E4] px-6 py-3">
              <span className="text-xs text-[#AAFFEE] c64-text-glow font-bold">
                {text.moves}: {gameState?.placed_piece_ids?.length || 0}
              </span>
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex gap-3 items-center">
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Main game area - 2 Column Layout - C64 Style */}
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Piece Spawn with Controls */}
          <div className="relative">
            <PieceSpawn
              availablePieces={availablePieces}
              placedPieceIds={gameState?.placed_piece_ids || []}
              selectedPiece={selectedPiece}
              pieceTransformations={pieceTransformations}
              onPieceSelect={handlePieceSelect}
              onRotate={handleRotate}
              onFlip={handleFlip}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>

          {/* Right: Game Boards */}
          <div className="space-y-6">
            {/* Target Pattern */}
            <TargetBoard
              targetSolution={currentLevel?.solution || new Array(16).fill(0)}
              cellSize={50}
            />

            {/* Game Board */}
            <div className="c64-border bg-[#6C5EB5] p-4">
              {/* Header - C64 Style */}
              <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000] mb-4">
                <span className="text-[10px] text-black font-bold">YOUR BOARD</span>
              </div>

              <div className="flex justify-center">
                <KanoodleBoard
                  currentSolution={gameState?.current_solution || new Array(16).fill(0)}
                  targetSolution={currentLevel?.solution || new Array(16).fill(0)}
                  onCellClick={handleBoardClick}
                  onCellDrop={handleBoardDrop}
                  highlightErrors={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            )`,
          }}
        ></div>
      </div>

      {/* Success Modal - C64 Style */}
      {/* TODO: Re-enable when contract emits completion events */}
      {false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="relative c64-border bg-[#6C5EB5] p-6 max-w-md w-full mx-4">
            {/* Title bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#A4A0E4] flex items-center justify-center px-3 border-b-2 border-[#000000]">
              <span className="text-sm text-black font-bold">{text.success}</span>
            </div>

            {/* Content */}
            <div className="mt-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">★</div>
              <pre className="text-[#AAFFEE] c64-text-glow text-xl mb-6">
{`LEVEL COMPLETE!`}
              </pre>
              <div className="bg-[#000000] border-2 border-[#A4A0E4] px-4 py-3 mb-8">
                <span className="text-[#EEEE77] c64-text-glow text-sm">
                  {text.moves}: {gameState?.placed_piece_ids?.length || 0}
                </span>
              </div>
              <button
                onClick={handleNextLevel}
                className="w-full c64-button py-4 px-8 mb-4 bg-[#00CC55] border-[#00B428]"
              >
                {text.nextLevel} →
              </button>
              <button
                onClick={handleBackToHome}
                className="w-full c64-button py-4 px-8 bg-[#777777] border-[#333333]"
              >
                {text.backButton}
              </button>
            </div>

            {/* Rainbow stripe */}
            <div className="absolute bottom-0 left-0 right-0 c64-rainbow"></div>
          </div>
        </div>
      )}

      {/* Error display - C64 Style */}
      {error && (
        <div className="fixed bottom-4 right-4 c64-border bg-[#880000] px-6 py-4">
          <p className="text-[#AAFFEE] text-[10px] c64-text-glow">{error}</p>
        </div>
      )}
    </div>
  );
}
