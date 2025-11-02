/**
 * PiecePreview Component
 * Shows selected piece with rotation and flip controls
 */

import { Piece } from './Piece';
import { transformPiece } from '../../lib/kanoodle/pieceUtils';
import { getKanoodleText } from '../../lib/uiText';
import { audioManager } from '../../lib/audioManager';
import type { PieceCell, RotationValue } from '../../lib/kanoodle/types';

interface PiecePreviewProps {
  cells: PieceCell[];
  rotation: RotationValue;
  flipped: boolean;
  onRotate: () => void;
  onFlip: () => void;
  onRemove: () => void;
  cellSize?: number;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function PiecePreview({
  cells,
  rotation,
  flipped,
  onRotate,
  onFlip,
  onRemove,
  cellSize = 50,
  onDragStart,
  onDragEnd,
}: PiecePreviewProps) {
  const text = getKanoodleText().game;
  const transformedCells = transformPiece(cells, rotation, flipped);

  return (
    <div className="c64-border bg-[#6C5EB5] p-4">
      {/* Header - C64 Style */}
      <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000] mb-4">
        <span className="text-[10px] text-black font-bold">SELECTED PIECE</span>
      </div>

      {/* Piece display area - C64 Style - Fixed size container */}
      <div className="bg-[#000000] p-6 mb-4 flex items-center justify-center border-2 border-[#A4A0E4]" style={{ width: '100%', height: '240px' }}>
        {cells.length > 0 ? (
          <div className="flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
            <Piece
              cells={transformedCells}
              cellSize={cellSize}
              showGrid={true}
              draggable={true}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        ) : (
          <div className="text-[#777777] text-center text-[10px]">
            NO PIECE
            <br />
            SELECTED
          </div>
        )}
      </div>

      {/* Rotation and flip info - C64 Style */}
      {cells.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-[#AAFFEE]">
          <div className="bg-[#000000] border-2 border-[#A4A0E4] px-3 py-2">
            <span className="c64-text-glow">ROT:</span> {rotation * 90}°
          </div>
          <div className="bg-[#000000] border-2 border-[#A4A0E4] px-3 py-2">
            <span className="c64-text-glow">FLIP:</span> {flipped ? 'YES' : 'NO'}
          </div>
        </div>
      )}

      {/* Control buttons - C64 Style */}
      <div className="grid grid-cols-3 gap-2">
        {/* Rotate button */}
        <button
          onClick={() => {
            audioManager.playPieceRotate();
            onRotate();
          }}
          disabled={cells.length === 0}
          className={`c64-button py-3 px-2 text-[10px] ${
            cells.length === 0 ? 'bg-[#777777] border-[#333333]' : 'bg-[#0088FF] border-[#006CD8]'
          }`}
        >
          ↻
          <br />
          {text.rotateButton}
        </button>

        {/* Flip button */}
        <button
          onClick={() => {
            audioManager.playPieceRotate();
            onFlip();
          }}
          disabled={cells.length === 0}
          className={`c64-button py-3 px-2 text-[10px] ${
            cells.length === 0 ? 'bg-[#777777] border-[#333333]' : 'bg-[#CC44CC] border-[#8C28D8]'
          }`}
        >
          ⇄
          <br />
          {text.flipButton}
        </button>

        {/* Remove/Return button */}
        <button
          onClick={() => {
            audioManager.playButtonClick();
            onRemove();
          }}
          disabled={cells.length === 0}
          className={`c64-button py-3 px-2 text-[10px] ${
            cells.length === 0 ? 'bg-[#777777] border-[#333333]' : 'bg-[#880000] border-[#660000]'
          }`}
        >
          ✕
          <br />
          RETURN
        </button>
      </div>

      {/* Drag instruction - C64 Style */}
      {cells.length > 0 && (
        <div className="mt-4 text-center text-[8px] text-[#BBBBBB]">
          
        </div>
      )}
    </div>
  );
}
