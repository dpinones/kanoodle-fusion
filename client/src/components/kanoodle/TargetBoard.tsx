/**
 * TargetBoard Component
 * Shows the target pattern that needs to be matched
 */

import { memo, useState, useEffect } from 'react';
import { ColorHex, type ColorValue } from '../../lib/kanoodle/types';
import { ColorblindHex, ColorSymbol } from '../../lib/kanoodle/colorblindColors';
import { BOARD_SIZE } from '../../lib/kanoodle/config';
import { getKanoodleText } from '../../lib/uiText';

interface TargetBoardProps {
  targetSolution: number[];  // 16 cells with target colors
  cellSize?: number;
  compact?: boolean; // For mobile compact view
}

export const TargetBoard = memo(function TargetBoard({
  targetSolution,
  cellSize = 50,
  compact = false,
}: TargetBoardProps) {
  const [colorblindMode, setColorblindMode] = useState(() => {
    const saved = localStorage.getItem('colorblindMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleColorblindChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setColorblindMode(customEvent.detail);
    };

    window.addEventListener('colorblindModeChanged', handleColorblindChange);
    return () => window.removeEventListener('colorblindModeChanged', handleColorblindChange);
  }, []);

  const boardWidth = BOARD_SIZE * cellSize;
  const boardHeight = BOARD_SIZE * cellSize;

  // Select color palette based on mode
  const colorPalette = colorblindMode ? ColorblindHex : ColorHex;

  const text = getKanoodleText().game;

  return (
    <div className={`c64-border bg-[#6C5EB5] ${compact ? 'p-1' : 'p-3'} flex flex-col ${compact ? '' : 'h-full'}`}>
      {/* Header - C64 Style - Compact on mobile */}
      <div className={`bg-[#A4A0E4] ${compact ? 'px-1 py-0.5 border border-[#000000] mb-1' : 'px-2 py-1 border-b-2 border-[#000000] mb-3'} flex items-center justify-center`}>
        <span className={`${compact ? 'text-[7px]' : 'text-[10px]'} text-black font-bold`}>{text.targetPattern}</span>
      </div>

      {/* Board container - C64 Style */}
      <div className="flex items-center justify-center p-2 flex-1">
        <div
          className="relative bg-[#000000] border-2 border-[#A4A0E4]"
          style={{
            width: `${boardWidth}px`,
            height: `${boardHeight}px`,
          }}
        >
          {/* Grid cells */}
          {targetSolution.map((color, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${x * cellSize}px`,
                  top: `${y * cellSize}px`,
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
              >
                {/* Cell with target color - C64 Style */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: colorPalette[color as ColorValue],
                    border: '2px solid #333333',
                    boxShadow: 'inset 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 0 rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Symbol for colorblind mode */}
                  {colorblindMode && color !== 0 && (
                    <span
                      className="text-black font-bold drop-shadow-sm"
                      style={{
                        fontSize: `${cellSize * 0.5}px`,
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {ColorSymbol[color as ColorValue]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Label - C64 Style */}
      <div className="mt-3 text-center text-[8px] text-[#BBBBBB]">
        {text.matchPattern}
      </div>
    </div>
  );
});
