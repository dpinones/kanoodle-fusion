/**
 * PieceSpawn Component
 * Displays available pieces that can be selected, rotated, flipped, and dragged
 */

import { Piece } from './Piece';
import { gamePieceToCells, type RotationValue } from '../../lib/kanoodle/types';
import { audioManager } from '../../lib/audioManager';
import { rotatePiece, flipPiece } from '../../lib/kanoodle/pieceUtils';
import type { GamePiece } from '../../lib/kanoodle/types';

interface PieceSpawnProps {
  availablePieces: GamePiece[];
  placedPieceIds: number[];
  selectedPiece: GamePiece | null;
  pieceTransformations: Record<number, { rotation: RotationValue; flipped: boolean }>;
  onPieceSelect: (piece: GamePiece) => void;
  onRotate: () => void;
  onFlip: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  cellSize?: number;
}

export function PieceSpawn({
  availablePieces,
  placedPieceIds,
  selectedPiece,
  pieceTransformations,
  onPieceSelect,
  onRotate,
  onFlip,
  onDragStart,
  onDragEnd,
  cellSize = 35,
}: PieceSpawnProps) {
  // Debug: Log placed pieces
  console.log('PieceSpawn - Placed piece IDs:', placedPieceIds);

  return (
    <div className="c64-border bg-[#6C5EB5] p-4">
      {/* Header - C64 Style */}
      <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000] mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-black font-bold">PIECES</span>
          <span className="text-[8px] text-black">
            {availablePieces.length - placedPieceIds.length} / {availablePieces.length}
          </span>
        </div>
      </div>

      {/* Pieces grid - C64 Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-2">
        {availablePieces.map((piece) => {
          const isPlaced = placedPieceIds.includes(piece.piece_id);
          const isSelected = selectedPiece?.piece_id === piece.piece_id;

          // Apply transformations for this piece (each piece remembers its own state)
          let cells = gamePieceToCells(piece);
          const transformation = pieceTransformations[piece.piece_id];
          if (transformation) {
            // Apply rotation
            cells = rotatePiece(cells, transformation.rotation);
            // Apply flip
            if (transformation.flipped) {
              cells = flipPiece(cells);
            }
          }

          return (
            <div
              key={piece.piece_id}
              className={`relative bg-[#000000] border-2 p-3 transition-all ${
                isPlaced
                  ? 'opacity-30 cursor-not-allowed border-[#555555]'
                  : isSelected
                  ? 'border-[#EEEE77] bg-[#222222] cursor-move'
                  : 'border-[#A4A0E4] hover:bg-[#333333] cursor-pointer'
              }`}
              draggable={!isPlaced && isSelected}
              onClick={() => {
                if (!isPlaced) {
                  audioManager.playButtonClick();
                  onPieceSelect(piece);
                }
              }}
              onDragStart={(e) => {
                if (isSelected && !isPlaced) {
                  onDragStart(e);
                }
              }}
              onDragEnd={onDragEnd}
            >
              {/* Piece ID badge - C64 Style */}
              <div className="absolute top-1 right-1 bg-[#EEEE77] text-black text-[8px] font-bold w-5 h-5 flex items-center justify-center border-2 border-[#000000]">
                {piece.piece_id}
              </div>

              {/* Piece visual */}
              <div className="flex items-center justify-center min-h-[80px]">
                <Piece
                  cells={cells}
                  cellSize={cellSize}
                  showGrid={true}
                  opacity={isPlaced ? 0.3 : 1}
                />
              </div>

              {/* Placed indicator - C64 Style with strikethrough */}
              {isPlaced && (
                <>
                  {/* Diagonal strikethrough line */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="absolute bg-[#880000] h-1"
                        style={{
                          width: '141.4%', // sqrt(2) * 100% to cover diagonal
                          transform: 'rotate(-45deg)',
                          boxShadow: '0 0 4px rgba(136, 0, 0, 0.8)',
                        }}
                      />
                    </div>
                  </div>
                  {/* PLACED badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#880000] text-[#AAFFEE] px-3 py-1 border-2 border-[#000000] font-bold text-[8px] shadow-lg">
                      PLACED
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions & Controls - C64 Style */}
      <div className="mt-4 space-y-3">
        {selectedPiece ? (
          <>
            {/* Selected piece info */}
            <div className="text-center text-[10px] text-[#EEEE77] font-bold">
              PIECE {selectedPiece.piece_id} SELECTED
            </div>

            {/* Control buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioManager.playButtonClick();
                  onRotate();
                }}
                className="c64-button py-2 px-3 text-[10px] bg-[#0088FF] border-[#0066CC]"
              >
                ↻ ROTATE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioManager.playButtonClick();
                  onFlip();
                }}
                className="c64-button py-2 px-3 text-[10px] bg-[#8c28d8] border-[#6a1fa8]"
              >
                ⇄ FLIP
              </button>
            </div>

            {/* Drag hint */}
            <div className="text-center text-[8px] text-[#AAFFEE]">
              
            </div>
          </>
        ) : (
          <div className="text-center text-[8px] text-[#BBBBBB]">
            CLICK TO SELECT A PIECE
          </div>
        )}
      </div>
    </div>
  );
}
