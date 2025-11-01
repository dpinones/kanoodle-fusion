/**
 * Piece Component
 * Renders a visual representation of a Kanoodle piece
 */

import { memo, useState, useEffect } from 'react';
import { ColorHex, type PieceCell, type ColorValue } from '../../lib/kanoodle/types';
import { ColorblindHex, ColorSymbol } from '../../lib/kanoodle/colorblindColors';

interface PieceProps {
  cells: PieceCell[];
  cellSize?: number;
  showGrid?: boolean;
  opacity?: number;
  className?: string;
  onClick?: () => void;
  isDragging?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const Piece = memo(function Piece({
  cells,
  cellSize = 40,
  showGrid = true,
  opacity = 1,
  className = '',
  onClick,
  isDragging = false,
  draggable = false,
  onDragStart,
  onDragEnd,
}: PieceProps) {
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

  if (cells.length === 0) return null;

  // Select color palette based on mode
  const colorPalette = colorblindMode ? ColorblindHex : ColorHex;

  // Calculate bounding box - convert to number in case values are BigInt from contract
  const maxX = Math.max(...cells.map(c => Number(c.x)));
  const maxY = Math.max(...cells.map(c => Number(c.y)));
  const width = (maxX + 1) * cellSize;
  const height = (maxY + 1) * cellSize;

  return (
    <div
      className={`relative inline-block ${className} ${isDragging ? 'cursor-grabbing' : draggable ? 'cursor-grab' : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity,
      }}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {cells.map((cell, index) => (
        <div
          key={index}
          className="absolute transition-all duration-100"
          style={{
            left: `${Number(cell.x) * cellSize}px`,
            top: `${Number(cell.y) * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        >
          {/* C64 Style cell */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: colorPalette[cell.color as ColorValue],
              border: showGrid ? '2px solid #333333' : 'none',
              boxShadow: isDragging
                ? 'inset 2px 2px 0 rgba(255, 255, 255, 0.4), inset -2px -2px 0 rgba(0, 0, 0, 0.4), 0 4px 0 rgba(0, 0, 0, 0.5)'
                : 'inset 2px 2px 0 rgba(255, 255, 255, 0.3), inset -2px -2px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Symbol for colorblind mode */}
            {colorblindMode && cell.color !== 0 && (
              <span
                className="text-black font-bold drop-shadow-sm"
                style={{
                  fontSize: `${cellSize * 0.6}px`,
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
                }}
              >
                {ColorSymbol[cell.color as ColorValue]}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
