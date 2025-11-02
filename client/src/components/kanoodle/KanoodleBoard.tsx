/**
 * KanoodleBoard Component
 * Renders the 4x4 game board with current and target colors
 */

import { memo, useState, useEffect } from 'react';
import { ColorHex, type ColorValue, type BoardCell } from '../../lib/kanoodle/types';
import { ColorblindHex, ColorSymbol } from '../../lib/kanoodle/colorblindColors';
import { BOARD_SIZE } from '../../lib/kanoodle/config';

interface KanoodleBoardProps {
  currentSolution: number[]; // 16 cells with current colors
  targetSolution: number[];  // 16 cells with target colors
  cellSize?: number;
  onCellClick?: (x: number, y: number) => void;
  onCellDrop?: (x: number, y: number) => void;
  highlightErrors?: boolean;
}

export const KanoodleBoard = memo(function KanoodleBoard({
  currentSolution,
  targetSolution,
  cellSize = 60,
  onCellClick,
  onCellDrop,
  highlightErrors = true,
}: KanoodleBoardProps) {
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

  // Convert flat arrays to 2D grid
  const getBoardCells = (): BoardCell[] => {
    const cells: BoardCell[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const index = y * BOARD_SIZE + x;
        cells.push({
          x,
          y,
          currentColor: currentSolution[index] as ColorValue,
          targetColor: targetSolution[index] as ColorValue,
          isCorrect: currentSolution[index] === targetSolution[index],
        });
      }
    }
    return cells;
  };

  const cells = getBoardCells();

  return (
    <div className="relative inline-block">
      {/* Board container - C64 Style */}
      <div
        className="relative c64-border bg-[#000000] p-2"
        style={{
          width: `${boardWidth + 16}px`,
          height: `${boardHeight + 16}px`,
        }}
      >
        {/* Grid cells */}
        <div className="relative w-full h-full">
          {cells.map((cell, index) => {
            const showError = highlightErrors && !cell.isCorrect && cell.currentColor !== 0;

            return (
              <div
                key={index}
                className={`absolute transition-all duration-100 ${
                  onCellClick || onCellDrop ? 'cursor-pointer' : ''
                }`}
                style={{
                  left: `${cell.x * cellSize + 8}px`,
                  top: `${cell.y * cellSize + 8}px`,
                  width: `${cellSize - 4}px`,
                  height: `${cellSize - 4}px`,
                }}
                onClick={() => onCellClick?.(cell.x, cell.y)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = '0.7';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = '1';
                  onCellDrop?.(cell.x, cell.y);
                }}
              >
                {/* Cell background (target color faded) - C64 Style */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backgroundColor: colorPalette[cell.targetColor],
                    opacity: 0.3,
                  }}
                >
                  {/* Target color symbol (faded) */}
                  {colorblindMode && cell.targetColor !== 0 && (
                    <span
                      className="text-black opacity-50 font-bold"
                      style={{ fontSize: `${cellSize * 0.4}px` }}
                    >
                      {ColorSymbol[cell.targetColor]}
                    </span>
                  )}
                </div>

                {/* Current color overlay - C64 Style */}
                {cell.currentColor !== 0 && (
                  <div
                    className="absolute inset-0 transition-all duration-100 flex items-center justify-center"
                    style={{
                      backgroundColor: colorPalette[cell.currentColor],
                      boxShadow: showError
                        ? 'inset 0 0 8px rgba(136, 0, 0, 0.8), 0 0 8px #880000'
                        : cell.isCorrect
                        ? 'inset 0 0 8px rgba(0, 204, 85, 0.8), 0 0 8px #00CC55'
                        : 'inset 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 0 rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Checkmark for correct cells OR symbol in colorblind mode */}
                    {cell.isCorrect ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#AAFFEE] text-2xl font-bold c64-text-glow">✓</span>
                      </div>
                    ) : colorblindMode ? (
                      <span
                        className="text-black font-bold drop-shadow-sm"
                        style={{
                          fontSize: `${cellSize * 0.5}px`,
                          textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        {ColorSymbol[cell.currentColor]}
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Grid coordinates (for debugging) */}
                {import.meta.env.DEV && (
                  <div className="absolute bottom-0 right-0 text-[8px] text-[#777777]">
                    {cell.x},{cell.y}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Board label - C64 Style */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6C5EB5] border-2 border-[#A4A0E4]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00CC55] animate-pulse" />
            <span className="text-xs text-[#AAFFEE] c64-text-glow">
              {cells.filter(c => c.isCorrect && c.currentColor !== 0).length} / {BOARD_SIZE * BOARD_SIZE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
