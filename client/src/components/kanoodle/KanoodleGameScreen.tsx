/**
 * KanoodleGameScreen Component
 * Main game screen with board, pieces, and controls
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { KanoodleBoard } from './KanoodleBoard';
import { PieceSpawn } from './PieceSpawn';
import { PiecePreview } from './PiecePreview';
import { TargetBoard } from './TargetBoard';
import { ConnectWallet } from './ConnectWallet';
import { SettingsPopup } from '../SettingsPopup';
import { useKanoodleGame } from '../../hooks/useKanoodleGame';
import { getKanoodleText } from '../../lib/uiText';
import { rotateClockwise } from '../../lib/kanoodle/pieceUtils';
import { gamePieceToCells, Rotations, type GamePiece, type RotationValue } from '../../lib/kanoodle/types';

export function KanoodleGameScreen() {
  const text = getKanoodleText().game;
  const { address } = useAccount();
  const navigate = useNavigate();
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();

  // Convert gameId from URL param to number
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : null;

  // Game state
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [pieceRotation, setPieceRotation] = useState<RotationValue>(Rotations.DEG_0);
  const [pieceFlipped, setPieceFlipped] = useState(false);
  const [availablePieces, setAvailablePieces] = useState<GamePiece[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    };

    loadPieces();
  }, [currentLevel, getPieceDefinition]);

  // Check if level is complete
  useEffect(() => {
    if (gameState?.is_solved && !showSuccess) {
      setShowSuccess(true);
    }
  }, [gameState?.is_solved]);

  // Listen for settings event
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowSettings(true);
    };

    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  // Handlers
  const handlePieceSelect = (piece: GamePiece) => {
    setSelectedPiece(piece);
    setPieceRotation(Rotations.DEG_0);
    setPieceFlipped(false);
  };

  const handleRotate = () => {
    setPieceRotation(rotateClockwise(pieceRotation));
  };

  const handleFlip = () => {
    setPieceFlipped(!pieceFlipped);
  };

  const handleRemoveFromPreview = () => {
    setSelectedPiece(null);
    setPieceRotation(Rotations.DEG_0);
    setPieceFlipped(false);
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
      // Clear selection after successful placement
      handleRemoveFromPreview();
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
    <div className="h-screen w-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex flex-col">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[16px] sm:border-[24px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 c64-rainbow z-10"></div>

      {/* Header - C64 Style */}
      <div className="max-w-7xl mx-auto mb-1 sm:mb-2 relative z-20 px-2 sm:px-4 pt-6 sm:pt-8">
        <div className="flex justify-between items-center flex-wrap gap-2">
          {/* Back button */}
          <button
            onClick={handleBackToHome}
            className="c64-button py-1 px-2 text-[9px] bg-[#880000] border-[#660000]"
          >
            ← BACK
          </button>

          {/* Level and moves info - C64 Style */}
          <div className="flex gap-1.5">
            <div className="bg-[#000000] border border-[#A4A0E4] px-2 py-0.5">
              <span className="text-[9px] text-[#EEEE77] c64-text-glow font-bold">
                LV {gameState?.level_id || '?'}
              </span>
            </div>
            <div className="bg-[#000000] border border-[#A4A0E4] px-2 py-0.5">
              <span className="text-[9px] text-[#AAFFEE] c64-text-glow font-bold">
                MV: {gameState?.moves_count || 0}
              </span>
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex gap-2 items-center">
            <ConnectWallet />
            <button
              onClick={() => {
                const settingsEvent = new CustomEvent('openSettings');
                window.dispatchEvent(settingsEvent);
              }}
              className="c64-button py-1 px-1 sm:py-2 sm:px-2 text-base sm:text-lg flex items-center justify-center"
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>
      </div>

      {/* Main game area - 2x2 Grid Layout - C64 Style */}
      <div className="flex-1 max-w-6xl mx-auto relative z-20 px-3 sm:px-4 md:px-6 overflow-hidden py-2 sm:py-4 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14 h-full max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-220px)]">
          {/* Top Left: Piece Spawn */}
          <div className="relative flex flex-col h-[45%] lg:h-auto">
            <div className="flex-1 flex flex-col min-h-0">
              <PieceSpawn
                availablePieces={availablePieces}
                placedPieceIds={gameState?.placed_piece_ids || []}
                onPieceSelect={handlePieceSelect}
                cellSize={16}
              />
            </div>
            {/* Arrow pointing right (Step 1 → 2) */}
            <div className="hidden lg:block absolute top-1/2 -right-8 xl:-right-10 transform -translate-y-1/2 z-30">
              <div className="flex flex-col items-center gap-1">
                <div className="text-[9px] text-[#EEEE77] c64-text-glow font-bold">STEP 1</div>
                <div className="text-4xl text-[#EEEE77] c64-text-glow animate-pulse">→</div>
              </div>
            </div>
          </div>

          {/* Top Right: Selected Piece Preview */}
          <div className="relative flex flex-col h-[45%] lg:h-auto">
            <div className="flex-1 flex flex-col min-h-0">
              <PiecePreview
                cells={selectedPiece ? gamePieceToCells(selectedPiece) : []}
                rotation={pieceRotation}
                flipped={pieceFlipped}
                onRotate={handleRotate}
                onFlip={handleFlip}
                onRemove={handleRemoveFromPreview}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                cellSize={22}
              />
            </div>
            {/* Arrow pointing down (Step 2 → 3) */}
            <div className="hidden lg:block absolute -bottom-8 xl:-bottom-10 left-1/2 transform -translate-x-1/2 z-30">
              <div className="flex flex-col items-center gap-1">
                <div className="text-4xl text-[#EEEE77] c64-text-glow animate-pulse">↓</div>
                <div className="text-[9px] text-[#EEEE77] c64-text-glow font-bold">STEP 2</div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Target Pattern */}
          <div className="flex flex-col h-[45%] lg:h-auto">
            <div className="flex-1 flex flex-col min-h-0">
              <TargetBoard
                targetSolution={currentLevel?.solution || new Array(16).fill(0)}
                cellSize={22}
              />
            </div>
          </div>

          {/* Bottom Right: Game Board */}
          <div className="flex flex-col h-[45%] lg:h-auto">
            <div className="flex-1 flex flex-col min-h-0 c64-border bg-[#6C5EB5] p-1.5 sm:p-2">
              {/* Header - C64 Style */}
              <div className="bg-[#A4A0E4] px-2 py-0.5 sm:py-1 border-b-2 border-[#000000] mb-1.5 sm:mb-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] text-black font-bold">YOUR BOARD</span>
                  <span className="text-[8px] text-black font-bold">STEP 3</span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-0">
                <KanoodleBoard
                  currentSolution={gameState?.current_solution || new Array(16).fill(0)}
                  targetSolution={currentLevel?.solution || new Array(16).fill(0)}
                  onCellClick={handleBoardClick}
                  onCellDrop={handleBoardDrop}
                  highlightErrors={true}
                  cellSize={28}
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
      {showSuccess && (
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
                  {text.moves}: {gameState?.moves_count}
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

      {/* Settings Popup */}
      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}

      {/* Error display - C64 Style */}
      {error && (
        <div className="fixed bottom-4 right-4 c64-border bg-[#880000] px-6 py-4">
          <p className="text-[#AAFFEE] text-[10px] c64-text-glow">{error}</p>
        </div>
      )}
    </div>
  );
}
