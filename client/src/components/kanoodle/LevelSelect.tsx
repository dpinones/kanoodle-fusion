/**
 * LevelSelect Component - Angry Birds style level selection
 * Shows a grid of all 50 levels
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { getKanoodleText } from '../../lib/uiText';
import { audioManager } from '../../lib/audioManager';
import { useKanoodleGame } from '../../hooks/useKanoodleGame';

const TOTAL_LEVELS = 50;

export function LevelSelect() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const text = getKanoodleText().levels;

  const { startGame, error } = useKanoodleGame();

  const handleLevelClick = async (levelId: number) => {
    if (!address || isCreatingGame) return;

    setSelectedLevel(levelId);
    setIsCreatingGame(true);
    audioManager.playButtonClick();

    try {
      console.log('Creating game for level:', levelId);
      const gameId = await startGame(levelId);

      if (gameId) {
        console.log('Game created successfully:', gameId);
        navigate(`/game/${gameId}`);
      } else {
        console.error('Failed to create game - no gameId returned');
      }
    } catch (err) {
      console.error('Error creating game:', err);
    } finally {
      setIsCreatingGame(false);
      setSelectedLevel(null);
    }
  };

  const handleBack = () => {
    audioManager.playButtonClick();
    navigate('/home');
  };

  // Generate level buttons
  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <div className="h-screen w-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex flex-col">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[16px] sm:border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-4 sm:top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Back button */}
      <div className="absolute top-6 sm:top-12 left-6 sm:left-12 z-20">
        <button
          onClick={handleBack}
          className="c64-button py-2 px-4 text-xs bg-[#880000] border-[#660000]"
        >
          ← {text.backButton}
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start flex-1 px-4 py-16 sm:py-20 overflow-y-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#AAFFEE] c64-text-glow mb-2 tracking-wider"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {text.title}
          </h1>
        </div>

        {/* Level grid */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 p-4">
            {levels.map((level) => {
              const isSelected = selectedLevel === level;
              const isDisabled = !address || isCreatingGame;

              return (
                <button
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  disabled={isDisabled}
                  className={`c64-border aspect-square flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-[#EEEE77] text-black border-[#CCCC55] scale-110'
                      : 'bg-[#6C5EB5] text-[#AAFFEE] c64-text-glow border-[#A4A0E4] hover:bg-[#8C7ED5] hover:scale-105'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{
                    fontFamily: 'Press Start 2P, monospace',
                  }}
                >
                  {isSelected ? '⏳' : level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        {!address && (
          <div className="mt-6 c64-border bg-[#880000] px-4 py-3 max-w-md">
            <p className="text-[#AAFFEE] text-[10px] text-center c64-text-glow">
              {text.connectWallet}
            </p>
          </div>
        )}
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Error display */}
      {error && (
        <div className="fixed bottom-4 right-4 c64-border bg-[#880000] px-6 py-4 z-50">
          <p className="text-[#AAFFEE] text-[10px] c64-text-glow">{error}</p>
        </div>
      )}

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
    </div>
  );
}
