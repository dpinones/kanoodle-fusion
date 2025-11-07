// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KanoodleTypes.sol";

library KanoodlePieces {
    using KanoodleTypes for *;

    function getPieceDefinition(uint8 pieceId) internal pure returns (KanoodleTypes.GamePiece memory) {
        if (pieceId == KanoodleTypes.PIECE_1) {
            // Piece 1: Straight 4-cell blue
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_1,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.BLUE,
                x1: 0, y1: 1, color1: KanoodleTypes.BLUE,
                x2: 0, y2: 2, color2: KanoodleTypes.BLUE,
                x3: 0, y3: 3, color3: KanoodleTypes.BLUE
            });
        } else if (pieceId == KanoodleTypes.PIECE_2) {
            // Piece 2: Straight 4-cell red
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_2,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.RED,
                x1: 0, y1: 1, color1: KanoodleTypes.RED,
                x2: 0, y2: 2, color2: KanoodleTypes.RED,
                x3: 0, y3: 3, color3: KanoodleTypes.RED
            });
        } else if (pieceId == KanoodleTypes.PIECE_3) {
            // Piece 3: Straight 4-cell yellow
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_3,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.YELLOW,
                x1: 0, y1: 1, color1: KanoodleTypes.YELLOW,
                x2: 0, y2: 2, color2: KanoodleTypes.YELLOW,
                x3: 0, y3: 3, color3: KanoodleTypes.YELLOW
            });
        } else if (pieceId == KanoodleTypes.PIECE_4) {
            // Piece 4: Z 4-cell blue
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_4,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.BLUE,
                x1: 0, y1: 1, color1: KanoodleTypes.BLUE,
                x2: 1, y2: 1, color2: KanoodleTypes.BLUE,
                x3: 1, y3: 2, color3: KanoodleTypes.BLUE
            });
        } else if (pieceId == KanoodleTypes.PIECE_5) {
            // Piece 5: Z 4-cell green
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_5,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.GREEN,
                x1: 0, y1: 1, color1: KanoodleTypes.GREEN,
                x2: 1, y2: 1, color2: KanoodleTypes.GREEN,
                x3: 1, y3: 2, color3: KanoodleTypes.GREEN
            });
        } else if (pieceId == KanoodleTypes.PIECE_6) {
            // Piece 6: L 4-cell red
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_6,
                size: 4,
                x0: 0, y0: 0, color0: KanoodleTypes.RED,
                x1: 0, y1: 1, color1: KanoodleTypes.RED,
                x2: 0, y2: 2, color2: KanoodleTypes.RED,
                x3: 1, y3: 0, color3: KanoodleTypes.RED
            });
        } else if (pieceId == KanoodleTypes.PIECE_7) {
            // Piece 7: Elbow 3-cell orange
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_7,
                size: 3,
                x0: 1, y0: 0, color0: KanoodleTypes.ORANGE,
                x1: 0, y1: 1, color1: KanoodleTypes.ORANGE,
                x2: 1, y2: 1, color2: KanoodleTypes.ORANGE,
                x3: 0, y3: 0, color3: 0
            });
        } else if (pieceId == KanoodleTypes.PIECE_8) {
            // Piece 8: Straight 3-cell multicolor (red, yellow, blue)
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_8,
                size: 3,
                x0: 0, y0: 0, color0: KanoodleTypes.RED,
                x1: 0, y1: 1, color1: KanoodleTypes.YELLOW,
                x2: 0, y2: 2, color2: KanoodleTypes.BLUE,
                x3: 0, y3: 0, color3: 0
            });
        } else if (pieceId == KanoodleTypes.PIECE_9) {
            // Piece 9: Straight 3-cell purple
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_9,
                size: 3,
                x0: 0, y0: 0, color0: KanoodleTypes.PURPLE,
                x1: 0, y1: 1, color1: KanoodleTypes.PURPLE,
                x2: 0, y2: 2, color2: KanoodleTypes.PURPLE,
                x3: 0, y3: 0, color3: 0
            });
        } else if (pieceId == KanoodleTypes.PIECE_10) {
            // Piece 10: T 4-cell yellow
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_10,
                size: 4,
                x0: 0, y0: 1, color0: KanoodleTypes.YELLOW,
                x1: 1, y1: 0, color1: KanoodleTypes.YELLOW,
                x2: 1, y2: 1, color2: KanoodleTypes.YELLOW,
                x3: 2, y3: 1, color3: KanoodleTypes.YELLOW
            });
        } else if (pieceId == KanoodleTypes.PIECE_11) {
            // Piece 11: Single neutral cell
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_11,
                size: 1,
                x0: 0, y0: 0, color0: KanoodleTypes.NEUTRAL,
                x1: 0, y1: 0, color1: 0,
                x2: 0, y2: 0, color2: 0,
                x3: 0, y3: 0, color3: 0
            });
        } else if (pieceId == KanoodleTypes.PIECE_12) {
            // Piece 12: Single neutral cell
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_12,
                size: 1,
                x0: 0, y0: 0, color0: KanoodleTypes.NEUTRAL,
                x1: 0, y1: 0, color1: 0,
                x2: 0, y2: 0, color2: 0,
                x3: 0, y3: 0, color3: 0
            });
        } else {
            // Piece 13: Single neutral cell
            return KanoodleTypes.GamePiece({
                pieceId: KanoodleTypes.PIECE_13,
                size: 1,
                x0: 0, y0: 0, color0: KanoodleTypes.NEUTRAL,
                x1: 0, y1: 0, color1: 0,
                x2: 0, y2: 0, color2: 0,
                x3: 0, y3: 0, color3: 0
            });
        }
    }

    function getPieceBounds(KanoodleTypes.GamePiece memory piece) internal pure returns (uint8 width, uint8 height) {
        uint8 maxX = 0;
        uint8 maxY = 0;

        if (piece.size >= 1) {
            if (piece.x0 > maxX) maxX = piece.x0;
            if (piece.y0 > maxY) maxY = piece.y0;
        }
        if (piece.size >= 2) {
            if (piece.x1 > maxX) maxX = piece.x1;
            if (piece.y1 > maxY) maxY = piece.y1;
        }
        if (piece.size >= 3) {
            if (piece.x2 > maxX) maxX = piece.x2;
            if (piece.y2 > maxY) maxY = piece.y2;
        }
        if (piece.size >= 4) {
            if (piece.x3 > maxX) maxX = piece.x3;
            if (piece.y3 > maxY) maxY = piece.y3;
        }

        return (maxX + 1, maxY + 1);
    }
}
