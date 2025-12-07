/**
 * KanoodleGameScreen Component
 * Main game screen with board, pieces, and controls
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KanoodleBoard } from './KanoodleBoard';
import { PieceSpawn } from './PieceSpawn';
import { TargetBoard } from './TargetBoard';
import { SettingsPopup } from '../SettingsPopup';
import { useLocalKanoodleGame } from '../../hooks/useLocalKanoodleGame';
import { getKanoodleText } from '../../lib/uiText';
import { audioManager } from '../../lib/audioManager';
import { rotateClockwise, transformPiece, predictBoardAfterPlacement } from '../../lib/kanoodle/pieceUtils';
import {
  Rotations,
  type GamePiece,
  type RotationValue,
  gamePieceToCells
} from '../../lib/kanoodle/types';

export function KanoodleGameScreen() {
  const text = getKanoodleText().game;
  const navigate = useNavigate();
  const { levelId: levelIdParam } = useParams<{ levelId: string }>();

  // Convert levelId from URL param to number
  const levelId = levelIdParam ? parseInt(levelIdParam, 10) : null;

  // Game state
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [availablePieces, setAvailablePieces] = useState<GamePiece[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  const [showLevelComplete, setShowLevelCompleteInternal] = useState(false);
  const [nextLevelNumber, setNextLevelNumber] = useState<number | null>(null);
  const [hasShownCompletion, setHasShownCompletion] = useState(false);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const textLogin = getKanoodleText().login;

  // Wrapper to log state changes
  const setShowLevelComplete = (value: boolean) => {
    console.log('🎭 Setting showLevelComplete:', value);
    setShowLevelCompleteInternal(value);
  };

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
    resetGame,
    undoGame,
    getPieceDefinition,
  } = useLocalKanoodleGame(levelId || undefined);

  // Start background music when component mounts
  useEffect(() => {
    audioManager.startBackgroundMusic();

    return () => {
      // Don't stop music on unmount, let it continue
    };
  }, []);

  // Redirect to home if no levelId
  useEffect(() => {
    if (!levelId) {
      console.error('No levelId in URL, redirecting to home');
      navigate('/home');
    }
  }, [levelId, navigate]);

  // Reset completion state when level changes
  useEffect(() => {
    console.log('🔄 Level changed, resetting completion state for level:', levelId);
    setHasShownCompletion(false);
    setShowLevelComplete(false);
    setNextLevelNumber(null);
  }, [levelId]);

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

  // Reset completion flag when level changes
  useEffect(() => {
    console.log('🔄 Level changed to:', gameState?.level_id);
    setHasShownCompletion(false);
  }, [gameState?.level_id]);

  // Auto-select first piece when board is cleared (placed_piece_ids becomes empty)
  useEffect(() => {
    if (!gameState || !availablePieces.length) return;

    // If board is empty and no piece is selected, select the first piece
    const isBoardEmpty = gameState.placed_piece_ids.length === 0;
    const noPieceSelected = !selectedPiece;

    console.log('👀 Auto-select check:', {
      isBoardEmpty,
      noPieceSelected,
      placed_piece_ids: gameState.placed_piece_ids,
      selectedPiece: selectedPiece?.piece_id,
      availablePiecesCount: availablePieces.length
    });

    if (isBoardEmpty && noPieceSelected) {
      console.log('🔄 Board is empty and no piece selected - auto-selecting first piece');
      setSelectedPiece(availablePieces[0]);
    }
  }, [gameState?.placed_piece_ids, availablePieces, selectedPiece]);

  // Monitor game state changes to detect level completion
  useEffect(() => {
    if (!gameState || !currentLevel) return;

    console.log('📊 Game State Update:', {
      level_id: gameState.level_id,
      current_solution: gameState.current_solution,
      target_solution: currentLevel.solution,
      placed_pieces: gameState.placed_piece_ids,
      hasShownCompletion
    });

    // Convert BigInt to Number for comparison
    const currentSolution = gameState.current_solution.map(c => Number(c));
    const targetSolution = currentLevel.solution.map(t => Number(t));
    const isComplete = currentSolution.every((color, index) => color === targetSolution[index]);
    const hasContent = currentSolution.some(c => c !== 0);

    console.log('🎯 Completion check:', {
      isComplete,
      hasContent,
      hasShownCompletion,
      currentSolution,
      targetSolution
    });

    if (isComplete && hasContent && !hasShownCompletion) {
      console.log('🎉 LEVEL COMPLETE DETECTED! Showing animation...');
      const currentLevelNumber = Number(gameState.level_id || 0);

      // Check if this is the final level (level 50)
      if (currentLevelNumber === 50) {
        console.log('🏆 FINAL LEVEL COMPLETED! Navigating to victory screen...');
        setShowLevelComplete(true);
        setNextLevelNumber(null);
        setHasShownCompletion(true);

        setTimeout(() => {
          console.log('🎊 Navigating to Victory Screen...');
          navigate('/victory');
        }, 3000);
      } else {
        const nextLevel = currentLevelNumber + 1;
        setShowLevelComplete(true);
        setNextLevelNumber(nextLevel);
        setHasShownCompletion(true);

        setTimeout(() => {
          console.log('⏭️  Hiding animation and advancing to next level:', nextLevel);
          setShowLevelComplete(false);
          navigate(`/level/${nextLevel}`);
        }, 3000);
      }
    }
  }, [gameState?.current_solution, gameState?.level_id, currentLevel?.solution, hasShownCompletion, navigate]);

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

    // Only allow flip for pieces 4, 5, and 6
    const flippablePieces = [4, 5, 6];
    if (!flippablePieces.includes(selectedPiece.piece_id)) {
      console.log(`Piece ${selectedPiece.piece_id} cannot be flipped`);
      return;
    }

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
    if (!selectedPiece || !levelId || !currentLevel || !gameState || isLoading) return;

    console.log('🎮 Placing piece:', {
      piece_id: selectedPiece.piece_id,
      position: { x, y },
      rotation: pieceRotation,
      flipped: pieceFlipped,
      current_level: gameState.level_id
    });

    // Predict if this placement will complete the level BEFORE placing
    const pieceCells = gamePieceToCells(selectedPiece);
    const transformedCells = transformPiece(pieceCells, pieceRotation, pieceFlipped, selectedPiece.piece_id);

    // Convert BigInt to Number for prediction
    const currentBoardNumbers = gameState.current_solution.map(c => Number(c));
    const predictedBoard = predictBoardAfterPlacement(
      currentBoardNumbers,
      transformedCells,
      x,
      y
    );

    // Check if predicted board matches target
    const targetSolution = currentLevel.solution.map(t => Number(t));
    const willComplete = predictedBoard.every((color, index) => color === targetSolution[index]) &&
                        predictedBoard.some(c => c !== 0);

    console.log('🔮 Predicting completion:', {
      willComplete,
      predictedBoard,
      targetSolution,
      currentBoard: currentBoardNumbers,
      currentLevel: gameState.level_id
    });

    // Place the piece
    console.log('⏳ Sending placement transaction...');
    const success = await placePiece(
      selectedPiece.piece_id,
      x,
      y,
      pieceRotation,
      pieceFlipped
    );

    console.log('✅ Placement result:', success);

    if (success) {
      // Clear the transformation for this piece after placement
      setPieceTransformations((prev) => {
        const newTransformations = { ...prev };
        delete newTransformations[selectedPiece.piece_id];
        return newTransformations;
      });

      // Select the first available (non-placed) piece
      const updatedPlacedIds = [...(gameState?.placed_piece_ids || []), selectedPiece.piece_id];
      const firstAvailable = availablePieces.find(
        (piece) => !updatedPlacedIds.includes(piece.piece_id)
      );

      setSelectedPiece(firstAvailable || null);

      // If we predicted completion, show the animation immediately
      if (willComplete && !hasShownCompletion) {
        console.log('🎊 Level WILL complete! Showing animation NOW (predicted)...');
        const currentLevelNumber = Number(gameState.level_id || 0);

        // Check if this is the final level (level 50)
        if (currentLevelNumber === 50) {
          console.log('🏆 FINAL LEVEL COMPLETED! Navigating to victory screen...');
          setShowLevelComplete(true);
          setNextLevelNumber(null);
          setHasShownCompletion(true);

          setTimeout(() => {
            console.log('🎊 Navigating to Victory Screen...');
            navigate('/victory');
          }, 3000);
        } else {
          const nextLevel = currentLevelNumber + 1;
          setShowLevelComplete(true);
          setNextLevelNumber(nextLevel);
          setHasShownCompletion(true);

          // Auto-hide after 3 seconds and go to next level
          setTimeout(() => {
            console.log('⏭️  Hiding animation and advancing to next level:', nextLevel);
            setShowLevelComplete(false);
            navigate(`/level/${nextLevel}`);
          }, 3000);
        }
      } else {
        console.log('⚪ Level not complete yet (predicted)');
      }
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!selectedPiece) return;
    e.dataTransfer.effectAllowed = 'move';
    // Store piece data in dataTransfer
    e.dataTransfer.setData('text/plain', 'dragging');
  };

  const handleDragEnd = () => {
    // Clear preview when drag ends
    setDragPreviewPosition(null);
  };

  const handleBoardDragOver = (e: React.DragEvent) => {
    if (!selectedPiece) return;

    // Get the board element's position
    const boardElement = e.currentTarget as HTMLElement;
    const boardRect = boardElement.getBoundingClientRect();

    // Calculate mouse position relative to board
    const mouseX = e.clientX - boardRect.left;
    const mouseY = e.clientY - boardRect.top;

    // Calculate which cell the mouse is over (using board cell size of 45px)
    const boardCellSize = 45;
    const cellX = Math.floor(mouseX / boardCellSize);
    const cellY = Math.floor(mouseY / boardCellSize);

    // Update preview position
    setDragPreviewPosition({ x: cellX, y: cellY });
  };

  const handleBoardDrop = async (e: React.DragEvent) => {
    if (!selectedPiece || isLoading) return;

    // Clear preview immediately
    setDragPreviewPosition(null);

    // Get the board element's position
    const boardElement = e.currentTarget as HTMLElement;
    const boardRect = boardElement.getBoundingClientRect();

    // Calculate mouse position relative to board
    const mouseX = e.clientX - boardRect.left;
    const mouseY = e.clientY - boardRect.top;

    // Calculate which cell the mouse is over (using board cell size of 45px)
    const boardCellSize = 45;
    const cellX = Math.floor(mouseX / boardCellSize);
    const cellY = Math.floor(mouseY / boardCellSize);

    console.log('Drop at cell:', { x: cellX, y: cellY });

    // The drag image origin (0,0) is at the cursor, so place directly at cursor position
    await handleBoardClick(cellX, cellY);
  };

  const handleBackToHome = () => {
    setShowHomeConfirmation(true);
  };

  const handleConfirmBackToHome = () => {
    audioManager.playMenuNav();
    navigate('/home');
  };

  const handleCancelBackToHome = () => {
    audioManager.playButtonClick();
    setShowHomeConfirmation(false);
  };

  const handleNextLevel = async () => {
    if (!nextLevelNumber) return;

    console.log('📍 Advancing to level:', nextLevelNumber);

    // Simply navigate to the next level
    navigate(`/level/${nextLevelNumber}`);
  };

  const handleClearBoard = async () => {
    console.log('🧹 Clearing board...');
    console.log('📋 State before clear:', {
      gameState,
      availablePieces: availablePieces.length,
      selectedPiece: selectedPiece?.piece_id,
      transformations: pieceTransformations,
      placed_piece_ids: gameState?.placed_piece_ids
    });

    audioManager.playButtonClick();

    // Clear all piece transformations
    setPieceTransformations({});

    // Clear selected piece - the useEffect will auto-select after reset
    setSelectedPiece(null);

    const success = await resetGame();
    console.log('🔄 Reset result:', success);

    if (success) {
      console.log('✅ Board cleared successfully');
      console.log('📋 Game state after reset:', {
        placed_piece_ids: gameState?.placed_piece_ids,
        current_solution: gameState?.current_solution
      });
      console.log('📋 useEffect will auto-select first piece when state updates');
    } else {
      console.log('❌ Failed to clear board');
      // Restore selection if failed
      if (availablePieces.length > 0) {
        setSelectedPiece(availablePieces[0]);
      }
    }
  };

  const handleUndo = async () => {
    console.log('↩️ Undoing last piece...');
    audioManager.playButtonClick();

    const success = await undoGame();
    console.log('🔄 Undo result:', success);

    if (success) {
      console.log('✅ Last piece removed successfully');
    } else {
      console.log('❌ Failed to undo (no pieces to remove or error)');
    }
  };

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

      {/* Right buttons - top right corner */}
      <div className="absolute top-12 right-12 flex gap-2 sm:gap-3 items-center z-50">
        <button
          onClick={() => {
            audioManager.playMenuNav();
            setShowSettings(true);
          }}
          className="c64-button py-2 px-4 text-xs"
          title="Settings"
        >
          {textLogin.settingsButton}
        </button>
      </div>

      {/* Home button and Level info - aligned with top buttons */}
      <div className="absolute top-12 left-12 flex items-center gap-3 z-50">
        <button
          onClick={handleBackToHome}
          className="c64-button py-2 px-5 text-xs bg-[#00CC55] border-[#00B428]"
        >
           {text.homeButton}
        </button>
        <div className="bg-[#000000] border-2 border-[#A4A0E4] px-4 py-2">
          <span className="text-xs text-[#EEEE77] c64-text-glow font-bold">
            {text.level} {gameState?.level_id || '?'}
          </span>
        </div>
      </div>

      {/* Main game area - 3 Column Layout - C64 Style */}
      <div className="max-w-7xl mx-auto relative z-20 flex items-center min-h-[calc(100vh-200px)]">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Left: Piece Spawn with Controls - flexible width */}
          <div className="flex-1">
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
              disabled={isLoading}
            />
          </div>

          {/* Center: Your Board - fixed width, full height */}
          <div className="w-full lg:w-[280px] flex">
            <div className="c64-border bg-[#6C5EB5] p-3 flex flex-col flex-1">
              {/* Header - C64 Style */}
              <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000] mb-3">
                <span className="text-[10px] text-black font-bold">{text.yourBoard}</span>
              </div>

              <div className="flex justify-center items-center flex-1">
                <KanoodleBoard
                  currentSolution={gameState?.current_solution || new Array(16).fill(0)}
                  targetSolution={currentLevel?.solution || new Array(16).fill(0)}
                  cellSize={45}
                  onCellClick={handleBoardClick}
                  onBoardDrop={handleBoardDrop}
                  onBoardDragOver={handleBoardDragOver}
                  highlightErrors={false}
                  previewPiece={selectedPiece ? transformPiece(gamePieceToCells(selectedPiece), pieceRotation, pieceFlipped, selectedPiece.piece_id) : null}
                  previewPosition={dragPreviewPosition}
                />
              </div>

              {/* Undo and Clear buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleUndo}
                  className="flex-1 c64-button py-2 px-4 text-[10px] bg-[#0088FF] border-[#006CD8]"
                  disabled={isLoading || !gameState?.placed_piece_ids || gameState.placed_piece_ids.length === 0}
                >
                  {text.undoButton}
                </button>
                <button
                  onClick={handleClearBoard}
                  className="flex-1 c64-button py-2 px-4 text-[10px] bg-[#880000] border-[#660000]"
                  disabled={isLoading || !gameState?.placed_piece_ids || gameState.placed_piece_ids.length === 0}
                >
                   {text.clearButton}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Target Pattern - fixed width matching Your Board, full height */}
          <div className="w-full lg:w-[280px] flex">
            <div className="flex-1">
              <TargetBoard
                targetSolution={currentLevel?.solution || new Array(16).fill(0)}
                cellSize={45}
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

      {/* Home Confirmation Popup - C64 Style */}
      {showHomeConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative c64-border bg-[#6C5EB5] p-6 max-w-md w-full mx-4 shadow-2xl">
            {/* Title bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#A4A0E4] flex items-center justify-center px-3 border-b-2 border-[#000000]">
              <span className="text-sm text-black font-bold">{text.warning}</span>
            </div>

            {/* Content */}
            <div className="mt-10 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <pre className="text-[#AAFFEE] c64-text-glow text-sm mb-6">
{`${text.progressLost}

${text.areYouSure}`}
              </pre>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmBackToHome}
                  className="flex-1 c64-button py-3 px-6 bg-[#880000] border-[#660000]"
                >
                  {text.goHome}
                </button>
                <button
                  onClick={handleCancelBackToHome}
                  className="flex-1 c64-button py-3 px-6 bg-[#777777] border-[#333333]"
                >
                  {text.cancel}
                </button>
              </div>
            </div>

            {/* Rainbow stripe */}
            <div className="absolute bottom-0 left-0 right-0 c64-rainbow"></div>
          </div>
        </div>
      )}

      {/* Settings Popup */}
      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}

      {/* Level Complete Animation - C64 Style */}
      {(() => {
        console.log('🎬 Render animation state:', { showLevelComplete, nextLevelNumber });
        const isFinalLevel = gameState?.level_id === 50;
        return showLevelComplete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="text-center animate-bounce-in">
              {/* YOU PASSED! */}
              <div className="mb-6">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#AAFFEE] c64-text-glow mb-2 animate-pulse"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  {isFinalLevel ? 'VICTORY!' : text.youPassed}
                </h1>
              </div>

              {/* NEXT X or FINAL LEVEL MESSAGE */}
              {isFinalLevel ? (
                <div className="bg-[#6C5EB5] border-4 border-[#A4A0E4] px-8 py-6 c64-text-glow">
                  <p
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00CC55]"
                    style={{ fontFamily: 'Press Start 2P, monospace' }}
                  >
                    ALL 50 LEVELS
                  </p>
                  <p
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00CC55] mt-2"
                    style={{ fontFamily: 'Press Start 2P, monospace' }}
                  >
                    COMPLETE!
                  </p>
                </div>
              ) : (
                <div className="bg-[#6C5EB5] border-4 border-[#A4A0E4] px-8 py-6 c64-text-glow">
                  <p
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EEEE77]"
                    style={{ fontFamily: 'Press Start 2P, monospace' }}
                  >
                    {text.nextLevel} {nextLevelNumber}
                  </p>
                </div>
              )}

              {/* Decorative stars */}
              <div className="mt-6 flex justify-center gap-4">
                <span className="text-4xl text-[#EEEE77] animate-spin-slow">★</span>
                <span className="text-5xl text-[#AAFFEE] animate-pulse">★</span>
                <span className="text-4xl text-[#EEEE77] animate-spin-slow">★</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Error display - C64 Style */}
      {error && (
        <div className="fixed bottom-4 right-4 c64-border bg-[#880000] px-6 py-4">
          <p className="text-[#AAFFEE] text-[10px] c64-text-glow">{error}</p>
        </div>
      )}
    </div>
  );
}
