/**
 * KanoodleBoard Component
 * Renders the 4x4 game board with current and target colors
 */

import { memo, useState, useEffect } from 'react';
import { ColorHex, type ColorValue, type BoardCell, type PieceCell } from '../../lib/kanoodle/types';
import { ColorblindHex, ColorSymbol } from '../../lib/kanoodle/colorblindColors';
import { BOARD_SIZE } from '../../lib/kanoodle/config';

interface KanoodleBoardProps {
  currentSolution: number[]; // 16 cells with current colors
  targetSolution: number[];  // 16 cells with target colors
  cellSize?: number;
  onCellClick?: (x: number, y: number) => void;
  onCellDrop?: (x: number, y: number) => void;
  onBoardDrop?: (e: React.DragEvent) => void;
  onBoardDragOver?: (e: React.DragEvent) => void;
  highlightErrors?: boolean;
  previewPiece?: PieceCell[] | null; // Piece to preview during drag
  previewPosition?: { x: number; y: number } | null; // Position of preview piece
}

export const KanoodleBoard = memo(function KanoodleBoard({
  currentSolution,
  targetSolution,
  cellSize = 60,
  onCellClick,
  onCellDrop,
  onBoardDrop,
  onBoardDragOver,
  highlightErrors = true,
  previewPiece = null,
  previewPosition = null,
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
        className="relative bg-[#000000] border-2 border-[#A4A0E4]"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (onBoardDragOver) {
            onBoardDragOver(e);
          }
        }}
        onDragLeave={() => {
          // Clear preview when leaving the board
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (onBoardDrop) {
            onBoardDrop(e);
          }
        }}
      >
        {/* Grid cells */}
        <div className="relative w-full h-full">
          {cells.map((cell, index) => {
            const showError = highlightErrors && !cell.isCorrect && cell.currentColor !== 0;

            // Check if this cell is part of the preview
            const isPreview = previewPiece && previewPosition &&
              previewPiece.some(pieceCell =>
                previewPosition.x + pieceCell.x === cell.x &&
                previewPosition.y + pieceCell.y === cell.y
              );

            return (
              <div
                key={index}
                className={`absolute transition-all duration-100 ${
                  onCellClick || onCellDrop ? 'cursor-pointer' : ''
                }`}
                style={{
                  left: `${cell.x * cellSize}px`,
                  top: `${cell.y * cellSize}px`,
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                onClick={() => onCellClick?.(cell.x, cell.y)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  onCellDrop?.(cell.x, cell.y);
                }}
              >
                {/* Cell with color - C64 Style matching TargetBoard */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: isPreview
                      ? '#888888' // Gray preview
                      : cell.currentColor !== 0
                      ? colorPalette[cell.currentColor]
                      : colorPalette[cell.targetColor],
                    opacity: isPreview ? 0.6 : cell.currentColor !== 0 ? 1 : 0.3,
                    border: '2px solid #333333',
                    boxShadow: showError
                      ? 'inset 0 0 8px rgba(136, 0, 0, 0.8), 0 0 8px #880000'
                      : isPreview
                      ? 'inset 2px 2px 0 rgba(255, 255, 255, 0.4), inset -2px -2px 0 rgba(0, 0, 0, 0.4)'
                      : 'inset 2px 2px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 0 rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Symbol in colorblind mode */}
                  {!isPreview && colorblindMode && (cell.currentColor !== 0 ? cell.currentColor : cell.targetColor) !== 0 && (
                    <span
                      className="text-black font-bold drop-shadow-sm"
                      style={{
                        fontSize: `${cellSize * 0.5}px`,
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {ColorSymbol[(cell.currentColor !== 0 ? cell.currentColor : cell.targetColor) as ColorValue]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
});
