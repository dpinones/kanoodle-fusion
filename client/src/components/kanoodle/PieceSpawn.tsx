/**
 * PieceSpawn Component
 * Displays available pieces that can be selected, rotated, flipped, and dragged
 */

import { useRef } from 'react';
import { Piece } from './Piece';
import { gamePieceToCells, type RotationValue } from '../../lib/kanoodle/types';
import { audioManager } from '../../lib/audioManager';
import { transformPiece } from '../../lib/kanoodle/pieceUtils';
import type { GamePiece } from '../../lib/kanoodle/types';
import { getKanoodleText } from '../../lib/uiText';

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
  disabled?: boolean;
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
  disabled = false,
}: PieceSpawnProps) {
  // Debug: Log placed pieces and selected piece
  console.log('🎨 PieceSpawn render:', {
    placedPieceIds,
    selectedPiece: selectedPiece?.piece_id,
    availablePieces: availablePieces.length
  });

  // Ref to store piece elements for creating custom drag images
  const pieceRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const text = getKanoodleText().game;

  return (
    <div className="c64-border bg-[#6C5EB5] p-4">
      {/* Header - C64 Style */}
      <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000] mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-black font-bold">{text.pieces}</span>
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
          const isDraggable = !isPlaced && !disabled; // All non-placed pieces are draggable unless disabled

          console.log(`🎲 Piece ${piece.piece_id}:`, { isPlaced, isSelected, isDraggable });

          // Apply transformations for this piece (each piece remembers its own state)
          let cells = gamePieceToCells(piece);
          const transformation = pieceTransformations[piece.piece_id];
          if (transformation) {
            // Use transformPiece to handle special cases (like piece 6)
            cells = transformPiece(
              cells,
              transformation.rotation,
              transformation.flipped,
              piece.piece_id
            );
          }

          return (
            <div
              key={piece.piece_id}
              className={`relative bg-[#000000] border-2 p-3 transition-all ${
                isPlaced || disabled
                  ? 'opacity-30 cursor-not-allowed border-[#555555]'
                  : isSelected
                  ? 'border-[#EEEE77] bg-[#222222] cursor-move'
                  : 'border-[#A4A0E4] hover:bg-[#333333] cursor-grab active:cursor-grabbing'
              }`}
              draggable={isDraggable}
              onClick={() => {
                if (!isPlaced && !disabled) {
                  audioManager.playButtonClick();
                  onPieceSelect(piece);
                }
              }}
              onDragStart={(e) => {
                if (!isPlaced && !disabled) {
                  // If this piece is not selected, select it first
                  if (!isSelected) {
                    audioManager.playButtonClick();
                    onPieceSelect(piece);
                  }

                  // Create a custom drag image at board cell size (45px)
                  const boardCellSize = 45;

                  // Get the piece element bounds to calculate mouse offset
                  const pieceElement = pieceRefs.current[piece.piece_id];
                  const sourceCellSize = cellSize; // Current display size (35px)

                  // Calculate mouse position relative to the piece spawn container
                  const containerRect = e.currentTarget.getBoundingClientRect();
                  const mouseXInContainer = e.clientX - containerRect.left;
                  const mouseYInContainer = e.clientY - containerRect.top;

                  // Convert mouse position to cell coordinates in source piece
                  const mouseCellX = Math.floor(mouseXInContainer / sourceCellSize);
                  const mouseCellY = Math.floor(mouseYInContainer / sourceCellSize);

                  // Store the offset in dataTransfer for later use
                  e.dataTransfer.setData('offsetX', mouseCellX.toString());
                  e.dataTransfer.setData('offsetY', mouseCellY.toString());

                  // Create a container for the scaled piece
                  const dragImageContainer = document.createElement('div');
                  dragImageContainer.style.position = 'absolute';
                  dragImageContainer.style.top = '-1000px';
                  dragImageContainer.style.pointerEvents = 'none';
                  document.body.appendChild(dragImageContainer);

                  // Render the piece at board size
                  const scaledPieceHTML = document.createElement('div');
                  const minX = Math.min(...cells.map(c => Number(c.x)));
                  const minY = Math.min(...cells.map(c => Number(c.y)));
                  const maxX = Math.max(...cells.map(c => Number(c.x)));
                  const maxY = Math.max(...cells.map(c => Number(c.y)));
                  const width = (maxX - minX + 1) * boardCellSize;
                  const height = (maxY - minY + 1) * boardCellSize;

                  scaledPieceHTML.style.width = `${width}px`;
                  scaledPieceHTML.style.height = `${height}px`;
                  scaledPieceHTML.style.position = 'relative';

                  // Clone each cell at board size
                  cells.forEach((cell) => {
                    const cellDiv = document.createElement('div');
                    cellDiv.style.position = 'absolute';
                    cellDiv.style.left = `${(Number(cell.x) - minX) * boardCellSize}px`;
                    cellDiv.style.top = `${(Number(cell.y) - minY) * boardCellSize}px`;
                    cellDiv.style.width = `${boardCellSize}px`;
                    cellDiv.style.height = `${boardCellSize}px`;

                    // Get color from piece element
                    if (pieceElement) {
                      const cellElements = pieceElement.querySelectorAll('div[style*="background"]');
                      const sourceCellElement = cellElements[cells.indexOf(cell)] as HTMLElement;
                      if (sourceCellElement) {
                        cellDiv.style.backgroundColor = sourceCellElement.style.backgroundColor;
                        cellDiv.style.border = '2px solid #333333';
                        cellDiv.style.boxShadow = 'inset 2px 2px 0 rgba(255, 255, 255, 0.3), inset -2px -2px 0 rgba(0, 0, 0, 0.3)';
                      }
                    }

                    scaledPieceHTML.appendChild(cellDiv);
                  });

                  dragImageContainer.appendChild(scaledPieceHTML);

                  // Set the drag image offset to position (0,0) of the piece
                  // This way, the cursor will indicate where the piece origin will be placed
                  e.dataTransfer.setDragImage(dragImageContainer,
                    0,
                    0
                  );

                  // Clean up the temporary element after drag starts
                  setTimeout(() => {
                    document.body.removeChild(dragImageContainer);
                  }, 0);

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
              <div
                ref={(el) => { pieceRefs.current[piece.piece_id] = el; }}
                className="flex items-center justify-center min-h-[80px]"
              >
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
                  if (!disabled) {
                    audioManager.playButtonClick();
                    onRotate();
                  }
                }}
                disabled={disabled}
                className="c64-button py-2 px-3 text-[10px] bg-[#0088FF] border-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↻ ROTATE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) {
                    audioManager.playButtonClick();
                    onFlip();
                  }
                }}
                disabled={disabled || ![4, 5, 6].includes(selectedPiece.piece_id)}
                className="c64-button py-2 px-3 text-[10px] bg-[#8c28d8] border-[#6a1fa8] disabled:opacity-50 disabled:cursor-not-allowed"
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
