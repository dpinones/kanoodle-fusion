/**
 * TutorialScreen Component
 * How to play Kanoodle Fusion
 */

import { useNavigate } from 'react-router-dom';

export function TutorialScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-8 left-0 right-0 c64-rainbow z-10"></div>

      <div className="relative c64-border bg-[#6C5EB5] p-6 max-w-3xl w-full z-20">
        {/* Title bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#A4A0E4] flex items-center justify-center px-3 border-b-2 border-[#000000]">
          <span className="text-sm text-black font-bold">HOW TO PLAY</span>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="bg-[#000000] border-2 border-[#0088FF] p-4">
            <h3 className="text-xs mb-2 text-[#0088FF] c64-text-glow">1. SELECT A PIECE</h3>
            <p className="text-[10px] leading-relaxed text-[#AAFFEE]">
              Click on a piece from the spawn area on the left. The piece will appear in the preview section.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#000000] border-2 border-[#CC44CC] p-4">
            <h3 className="text-xs mb-2 text-[#CC44CC] c64-text-glow">2. ROTATE & FLIP</h3>
            <p className="text-[10px] leading-relaxed text-[#AAFFEE]">
              Use the ROTATE button to turn the piece 90 degrees clockwise. Use the FLIP button to mirror it horizontally.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#000000] border-2 border-[#00CC55] p-4">
            <h3 className="text-xs mb-2 text-[#00CC55] c64-text-glow">3. PLACE ON BOARD</h3>
            <p className="text-[10px] leading-relaxed text-[#AAFFEE]">
              Click on a cell in the board to place your piece. The colors will blend where pieces overlap!
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-[#000000] border-2 border-[#EEEE77] p-4">
            <h3 className="text-xs mb-2 text-[#EEEE77] c64-text-glow">4. MATCH COLORS</h3>
            <p className="text-[10px] leading-relaxed text-[#AAFFEE]">
              Your goal is to match all colors on the board with the target pattern. Green checkmarks show correct cells!
            </p>
          </div>

          {/* Color Mixing Info */}
          <div className="bg-[#000000] border-2 border-[#DD8855] p-4">
            <h3 className="text-xs mb-2 text-[#DD8855] c64-text-glow">COLOR MIXING</h3>
            <div className="text-[10px] leading-relaxed space-y-1 text-[#BBBBBB]">
              <p>RED + YELLOW = ORANGE</p>
              <p>RED + BLUE = PURPLE</p>
              <p>YELLOW + BLUE = GREEN</p>
              <p>NEUTRAL pieces don't mix</p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          className="w-full mt-6 c64-button py-4 px-8 bg-[#0088FF] border-[#006CD8]"
        >
          ← BACK TO HOME
        </button>

        {/* Rainbow stripe */}
        <div className="absolute bottom-0 left-0 right-0 c64-rainbow"></div>
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
    </div>
  );
}
