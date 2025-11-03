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
import { SettingsPopup } from '../SettingsPopup';
import { useKanoodleGame } from '../../hooks/useKanoodleGame';
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
  const { address } = useAccount();
  const navigate = useNavigate();
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();

  // Convert gameId from URL param to number
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : null;

  // Game state
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [availablePieces, setAvailablePieces] = useState<GamePiece[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  const [showLevelComplete, setShowLevelCompleteInternal] = useState(false);
  const [nextLevelNumber, setNextLevelNumber] = useState<number | null>(null);
  const [hasShownCompletion, setHasShownCompletion] = useState(false);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<{ x: number; y: number } | null>(null);

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
    loadLevel,
    getPieceDefinition,
    refreshGameState,
  } = useKanoodleGame(gameId || undefined);

  // Start background music when component mounts
  useEffect(() => {
    audioManager.startBackgroundMusic();

    return () => {
      // Don't stop music on unmount, let it continue
    };
  }, []);

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
        setShowLevelComplete(true);
        setNextLevelNumber(currentLevelNumber + 1);
        setHasShownCompletion(true);

        setTimeout(() => {
          console.log('⏭️  Hiding animation and advancing to next level...');
          setShowLevelComplete(false);
          handleNextLevel();
        }, 3000);
      }
    }
  }, [gameState?.current_solution, gameState?.level_id, currentLevel?.solution, hasShownCompletion]);

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
    if (!selectedPiece || !gameId || !address || !currentLevel || !gameState || isLoading) return;

    console.log('🎮 Placing piece:', {
      piece_id: selectedPiece.piece_id,
      position: { x, y },
      rotation: pieceRotation,
      flipped: pieceFlipped,
      current_level: gameState.level_id
    });

    // Predict if this placement will complete the level BEFORE placing
    const pieceCells = gamePieceToCells(selectedPiece);
    const transformedCells = transformPiece(pieceCells, pieceRotation, pieceFlipped);

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
          setShowLevelComplete(true);
          setNextLevelNumber(currentLevelNumber + 1);
          setHasShownCompletion(true);

          // Auto-hide after 3 seconds and go to next level
          setTimeout(() => {
            console.log('⏭️  Hiding animation and advancing to next level...');
            setShowLevelComplete(false);
            handleNextLevel();
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

  const handleNextLevel = () => {
    // Just hide the animation, don't navigate anywhere
    // The game will automatically load the next level from the contract
    console.log('📍 Staying on current screen, next level will load automatically');
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

      {/* Right buttons - top right corner */}
      <div className="absolute top-12 right-12 flex gap-2 sm:gap-3 items-center z-50">
        <ConnectWallet />
        <button
          onClick={() => {
            audioManager.playMenuNav();
            setShowSettings(true);
          }}
          className="c64-button p-2 sm:p-2.5"
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Home button and Level info - aligned with top buttons */}
      <div className="w-full relative z-20 mb-8">
        <div className="absolute top-12 left-12 flex items-center gap-4">
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
                  previewPiece={selectedPiece ? transformPiece(gamePieceToCells(selectedPiece), pieceRotation, pieceFlipped) : null}
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
