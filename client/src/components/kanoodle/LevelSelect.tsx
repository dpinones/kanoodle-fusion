/**
 * LevelSelect Component - Angry Birds style level selection
 * Shows a grid of all 50 levels
 */

import { useNavigate } from 'react-router-dom';
import { getKanoodleText } from '../../lib/uiText';
import { audioManager } from '../../lib/audioManager';

const TOTAL_LEVELS = 50;

export function LevelSelect() {
  const navigate = useNavigate();
  const text = getKanoodleText().levels;

  const handleLevelClick = (levelId: number) => {
    audioManager.playButtonClick();
    console.log('Starting level:', levelId);
    // Navigate directly to the level
    navigate(`/level/${levelId}`);
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
            {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className="c64-border aspect-square flex items-center justify-center text-xs sm:text-sm font-bold transition-all bg-[#6C5EB5] text-[#AAFFEE] c64-text-glow border-[#A4A0E4] hover:bg-[#8C7ED5] hover:scale-105 cursor-pointer"
                  style={{
                    fontFamily: 'Press Start 2P, monospace',
                  }}
                >
                  {level}
                </button>
              ))}
          </div>
        </div>

        {/* Instructions removed - no wallet needed */}
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 c64-rainbow z-10"></div>

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
