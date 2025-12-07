// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library KanoodleTypes {
    // Colors
    uint8 constant EMPTY = 0;
    uint8 constant RED = 1;
    uint8 constant YELLOW = 2;
    uint8 constant BLUE = 3;
    uint8 constant GREEN = 4;
    uint8 constant ORANGE = 5;
    uint8 constant PURPLE = 6;
    uint8 constant NEUTRAL = 7;

    // Rotations (0=0°, 1=90°, 2=180°, 3=270°)
    uint8 constant DEG_0 = 0;
    uint8 constant DEG_90 = 1;
    uint8 constant DEG_180 = 2;
    uint8 constant DEG_270 = 3;

    // Piece IDs
    uint8 constant PIECE_1 = 1;
    uint8 constant PIECE_2 = 2;
    uint8 constant PIECE_3 = 3;
    uint8 constant PIECE_4 = 4;
    uint8 constant PIECE_5 = 5;
    uint8 constant PIECE_6 = 6;
    uint8 constant PIECE_7 = 7;
    uint8 constant PIECE_8 = 8;
    uint8 constant PIECE_9 = 9;
    uint8 constant PIECE_10 = 10;
    uint8 constant PIECE_11 = 11;
    uint8 constant PIECE_12 = 12;
    uint8 constant PIECE_13 = 13;

    struct GamePiece {
        uint8 pieceId;
        uint8 size;
        uint8 x0; uint8 y0; uint8 color0;
        uint8 x1; uint8 y1; uint8 color1;
        uint8 x2; uint8 y2; uint8 color2;
        uint8 x3; uint8 y3; uint8 color3;
    }

    struct PlacedPiece {
        uint8 x;
        uint8 y;
        uint8 rotation;
        bool flipped;
    }

    struct PlacedPieceWithId {
        uint8 pieceId;
        uint8 x;
        uint8 y;
        uint8 rotation;
        bool flipped;
    }

    struct Level {
        uint8 levelId;
        uint8[16] solution;
        uint8[] allowedPieces;
    }

    struct Game {
        uint32 gameId;
        address player;
        uint8 levelId;
        uint8[16] currentSolution;
        uint8[] placedPieceIds;
    }
}
