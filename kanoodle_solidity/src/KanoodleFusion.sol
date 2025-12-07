// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KanoodleTypes.sol";
import "./KanoodlePieces.sol";
import "./KanoodleLevels.sol";

contract KanoodleFusion {
    using KanoodlePieces for *;
    using KanoodleLevels for *;

    uint32 private nextGameId = 1;

    // gameId => player => pieceId => PlacedPiece
    mapping(uint32 => mapping(address => mapping(uint8 => KanoodleTypes.PlacedPiece))) public placedPieces;

    // gameId => Game
    mapping(uint32 => KanoodleTypes.Game) public games;

    event GameStarted(uint32 indexed gameId, address indexed player);
    event PiecePlaced(uint32 indexed gameId, address indexed player, uint8 pieceId);
    event PieceRemoved(uint32 indexed gameId, address indexed player, uint8 pieceId);
    event GameSolved(uint32 indexed gameId, address indexed player, uint32 moves);
    event SolutionValidated(uint8 indexed levelId, address indexed player, bool isValid);

    function startGame(address player, uint8 levelId) external returns (uint32) {
        require(levelId >= 1, "Invalid level_id");

        uint32 gameId = nextGameId++;

        KanoodleTypes.Game storage game = games[gameId];
        game.gameId = gameId;
        game.player = player;
        game.levelId = levelId;
        // currentSolution is already initialized to all zeros
        // placedPieceIds starts empty

        // Mark all pieces as not placed (x=255)
        for (uint8 i = 1; i <= 13; i++) {
            placedPieces[gameId][player][i].x = 255;
        }

        emit GameStarted(gameId, player);
        return gameId;
    }

    function placePiece(
        uint32 gameId,
        address player,
        uint8 pieceId,
        uint8 x,
        uint8 y,
        uint8 rotation,
        bool flipped
    ) external returns (bool) {
        require(pieceId >= 1 && pieceId <= 13, "Invalid piece_id");
        require(rotation < 4, "Invalid rotation");

        KanoodleTypes.Game storage game = games[gameId];

        // Check if piece is allowed for this level
        KanoodleTypes.Level memory level = KanoodleLevels.getLevel(game.levelId);
        bool pieceAllowed = false;
        for (uint256 i = 0; i < level.allowedPieces.length; i++) {
            if (level.allowedPieces[i] == pieceId) {
                pieceAllowed = true;
                break;
            }
        }
        require(pieceAllowed, "Invalid piece_id");

        // Check if piece already placed
        if (placedPieces[gameId][player][pieceId].x != 255) {
            return false;
        }

        // Store the placed piece
        placedPieces[gameId][player][pieceId] = KanoodleTypes.PlacedPiece({
            x: x,
            y: y,
            rotation: rotation,
            flipped: flipped
        });

        // Update placed piece IDs
        game.placedPieceIds.push(pieceId);

        // Recalculate current solution
        game.currentSolution = rebuildCurrentSolution(gameId, player);

        emit PiecePlaced(gameId, player, pieceId);

        // Check if solved
        _checkSolution(gameId, player);

        return true;
    }

    function reset(uint32 gameId) external returns (bool) {
        KanoodleTypes.Game storage game = games[gameId];

        // Clear all placed pieces
        for (uint8 i = 1; i <= 13; i++) {
            placedPieces[gameId][game.player][i].x = 255;
        }

        // Reset the game state to empty
        for (uint256 i = 0; i < 16; i++) {
            game.currentSolution[i] = 0;
        }
        delete game.placedPieceIds;

        return true;
    }

    function undo(uint32 gameId) external returns (bool) {
        KanoodleTypes.Game storage game = games[gameId];

        if (game.placedPieceIds.length == 0) {
            return false;
        }

        uint8 lastPieceId = game.placedPieceIds[game.placedPieceIds.length - 1];

        // Remove piece from storage
        placedPieces[gameId][game.player][lastPieceId].x = 255;

        emit PieceRemoved(gameId, game.player, lastPieceId);

        // Remove from placed piece IDs
        game.placedPieceIds.pop();

        // Recalculate current solution
        game.currentSolution = rebuildCurrentSolution(gameId, game.player);

        return true;
    }

    function getGameState(uint32 gameId) external view returns (KanoodleTypes.Game memory) {
        return games[gameId];
    }

    /**
     * @notice Validates a complete solution for a level
     * @param levelId The level to validate (1-50)
     * @param pieces Array of placed pieces with their IDs, positions and transformations
     * @return isValid True if the solution is correct, false otherwise
     */
    function validateSolution(
        uint8 levelId,
        KanoodleTypes.PlacedPieceWithId[] calldata pieces
    ) external returns (bool isValid) {
        require(levelId >= 1 && levelId <= 50, "Invalid level_id");
        require(pieces.length > 0, "No pieces provided");

        // Get the level configuration
        KanoodleTypes.Level memory level = KanoodleLevels.getLevel(levelId);

        // Track which pieces have been used (to prevent duplicates)
        bool[14] memory usedPieces; // Index 0 unused, 1-13 for piece IDs

        // Validate each piece
        for (uint256 i = 0; i < pieces.length; i++) {
            KanoodleTypes.PlacedPieceWithId memory piece = pieces[i];

            require(piece.pieceId >= 1 && piece.pieceId <= 13, "Invalid piece_id");
            require(piece.rotation < 4, "Invalid rotation");
            require(!usedPieces[piece.pieceId], "Duplicate piece");

            // Check if piece is allowed for this level
            bool pieceAllowed = false;
            for (uint256 j = 0; j < level.allowedPieces.length; j++) {
                if (level.allowedPieces[j] == piece.pieceId) {
                    pieceAllowed = true;
                    break;
                }
            }
            require(pieceAllowed, "Piece not allowed in this level");

            usedPieces[piece.pieceId] = true;
        }

        // Calculate the resulting board state
        uint8[16] memory resultBoard = calculateBoardFromPieces(pieces);

        // Compare with target solution
        isValid = true;
        for (uint256 i = 0; i < 16; i++) {
            if (resultBoard[i] != level.solution[i]) {
                isValid = false;
                break;
            }
        }

        emit SolutionValidated(levelId, msg.sender, isValid);
        return isValid;
    }

    /**
     * @notice Calculates the board state from a set of placed pieces
     * @param pieces Array of placed pieces with their IDs
     * @return The resulting 16-cell board with mixed colors
     */
    function calculateBoardFromPieces(
        KanoodleTypes.PlacedPieceWithId[] memory pieces
    ) internal pure returns (uint8[16] memory) {
        // Initialize color stacks for each cell
        uint8[][16] memory boardStacks;
        for (uint256 i = 0; i < 16; i++) {
            boardStacks[i] = new uint8[](0);
        }

        // Process all placed pieces
        for (uint256 pieceIdx = 0; pieceIdx < pieces.length; pieceIdx++) {
            KanoodleTypes.PlacedPieceWithId memory placed = pieces[pieceIdx];

            KanoodleTypes.GamePiece memory pieceDef = KanoodlePieces.getPieceDefinition(placed.pieceId);
            (uint8 pieceWidth, uint8 pieceHeight) = KanoodlePieces.getPieceBounds(pieceDef);

            // Process each cell in the piece
            for (uint8 cellNum = 0; cellNum < pieceDef.size; cellNum++) {
                (uint8 relX, uint8 relY, uint8 cellColor) = _getCell(pieceDef, cellNum);

                // Apply transformations
                (uint8 transX, uint8 transY) = transformCell(
                    relX, relY, placed.rotation, placed.flipped, pieceWidth, pieceHeight
                );

                // Calculate absolute board position
                uint8 absX = placed.x + transX;
                uint8 absY = placed.y + transY;

                // Add color to the stack if within bounds
                if (absX < 4 && absY < 4) {
                    uint8 boardIdx = absY * 4 + absX;

                    // Append to stack
                    uint8[] memory oldStack = boardStacks[boardIdx];
                    uint8[] memory newStack = new uint8[](oldStack.length + 1);
                    for (uint256 i = 0; i < oldStack.length; i++) {
                        newStack[i] = oldStack[i];
                    }
                    newStack[oldStack.length] = cellColor;
                    boardStacks[boardIdx] = newStack;
                }
            }
        }

        // Mix colors in each cell and build final solution
        uint8[16] memory finalSolution;
        for (uint256 i = 0; i < 16; i++) {
            finalSolution[i] = mixColors(boardStacks[i]);
        }

        return finalSolution;
    }

    function rebuildCurrentSolution(uint32 gameId, address player) internal view returns (uint8[16] memory) {
        // Initialize color stacks for each cell
        uint8[][16] memory boardStacks;
        for (uint256 i = 0; i < 16; i++) {
            boardStacks[i] = new uint8[](0);
        }

        // Process all placed pieces
        for (uint8 pieceId = 1; pieceId <= 13; pieceId++) {
            KanoodleTypes.PlacedPiece memory placed = placedPieces[gameId][player][pieceId];

            if (placed.x != 255) {
                KanoodleTypes.GamePiece memory pieceDef = KanoodlePieces.getPieceDefinition(pieceId);
                (uint8 pieceWidth, uint8 pieceHeight) = KanoodlePieces.getPieceBounds(pieceDef);

                // Process each cell in the piece
                for (uint8 cellNum = 0; cellNum < pieceDef.size; cellNum++) {
                    (uint8 relX, uint8 relY, uint8 cellColor) = _getCell(pieceDef, cellNum);

                    // Apply transformations
                    (uint8 transX, uint8 transY) = transformCell(
                        relX, relY, placed.rotation, placed.flipped, pieceWidth, pieceHeight
                    );

                    // Calculate absolute board position
                    uint8 absX = placed.x + transX;
                    uint8 absY = placed.y + transY;

                    // Add color to the stack if within bounds
                    if (absX < 4 && absY < 4) {
                        uint8 boardIdx = absY * 4 + absX;

                        // Append to stack
                        uint8[] memory oldStack = boardStacks[boardIdx];
                        uint8[] memory newStack = new uint8[](oldStack.length + 1);
                        for (uint256 i = 0; i < oldStack.length; i++) {
                            newStack[i] = oldStack[i];
                        }
                        newStack[oldStack.length] = cellColor;
                        boardStacks[boardIdx] = newStack;
                    }
                }
            }
        }

        // Mix colors in each cell and build final solution
        uint8[16] memory finalSolution;
        for (uint256 i = 0; i < 16; i++) {
            finalSolution[i] = mixColors(boardStacks[i]);
        }

        return finalSolution;
    }

    function transformCell(
        uint8 x,
        uint8 y,
        uint8 rotation,
        bool flipped,
        uint8 pieceWidth,
        uint8 pieceHeight
    ) internal pure returns (uint8, uint8) {
        // Apply flip first (mirror horizontally)
        uint8 fx = x;
        uint8 fy = y;
        if (flipped && pieceWidth > 0) {
            fx = pieceWidth - 1 - x;
        }

        // Then apply rotation
        if (rotation == KanoodleTypes.DEG_0) {
            return (fx, fy);
        } else if (rotation == KanoodleTypes.DEG_90) {
            // 90° clockwise: (x,y) -> (height-1-y, x)
            if (pieceHeight > 0) {
                return (pieceHeight - 1 - fy, fx);
            }
            return (fx, fy);
        } else if (rotation == KanoodleTypes.DEG_180) {
            // 180°: (x,y) -> (width-1-x, height-1-y)
            uint8 resultX = fx;
            uint8 resultY = fy;
            if (pieceWidth > 0) {
                resultX = pieceWidth - 1 - fx;
            }
            if (pieceHeight > 0) {
                resultY = pieceHeight - 1 - fy;
            }
            return (resultX, resultY);
        } else {
            // 270° clockwise: (x,y) -> (y, width-1-x)
            if (pieceWidth > 0) {
                return (fy, pieceWidth - 1 - fx);
            }
            return (fx, fy);
        }
    }

    function mixColors(uint8[] memory colorStack) internal pure returns (uint8) {
        if (colorStack.length == 0) {
            return KanoodleTypes.EMPTY;
        }

        // If any neutral piece is in the stack, return neutral
        for (uint256 i = 0; i < colorStack.length; i++) {
            if (colorStack[i] == KanoodleTypes.NEUTRAL) {
                return KanoodleTypes.NEUTRAL;
            }
        }

        // Track which primary colors are present
        bool hasRed = false;
        bool hasYellow = false;
        bool hasBlue = false;

        // Decompose all colors into primaries
        for (uint256 i = 0; i < colorStack.length; i++) {
            uint8 color = colorStack[i];

            if (color == KanoodleTypes.RED) {
                hasRed = true;
            } else if (color == KanoodleTypes.YELLOW) {
                hasYellow = true;
            } else if (color == KanoodleTypes.BLUE) {
                hasBlue = true;
            } else if (color == KanoodleTypes.ORANGE) {
                hasRed = true;
                hasYellow = true;
            } else if (color == KanoodleTypes.GREEN) {
                hasYellow = true;
                hasBlue = true;
            } else if (color == KanoodleTypes.PURPLE) {
                hasRed = true;
                hasBlue = true;
            }
        }

        // Mix primaries to get final color
        if (hasRed && hasYellow && hasBlue) {
            return KanoodleTypes.EMPTY; // All three primaries = muddy
        } else if (hasRed && hasYellow) {
            return KanoodleTypes.ORANGE;
        } else if (hasRed && hasBlue) {
            return KanoodleTypes.PURPLE;
        } else if (hasYellow && hasBlue) {
            return KanoodleTypes.GREEN;
        } else if (hasRed) {
            return KanoodleTypes.RED;
        } else if (hasYellow) {
            return KanoodleTypes.YELLOW;
        } else if (hasBlue) {
            return KanoodleTypes.BLUE;
        } else {
            return KanoodleTypes.EMPTY;
        }
    }

    function _checkSolution(uint32 gameId, address player) internal {
        KanoodleTypes.Game storage game = games[gameId];
        KanoodleTypes.Level memory level = KanoodleLevels.getLevel(game.levelId);

        bool isSolved = true;
        for (uint256 i = 0; i < 16; i++) {
            if (game.currentSolution[i] != level.solution[i]) {
                isSolved = false;
                break;
            }
        }

        if (isSolved) {
            uint32 moves = uint32(game.placedPieceIds.length);
            emit GameSolved(gameId, player, moves);

            // Advance to next level if not at max level (50)
            if (game.levelId < 50) {
                game.levelId += 1;

                // Reset the board for the new level
                for (uint256 i = 0; i < 16; i++) {
                    game.currentSolution[i] = 0;
                }
                delete game.placedPieceIds;

                // Clear all placed pieces
                for (uint8 i = 1; i <= 13; i++) {
                    placedPieces[gameId][player][i].x = 255;
                }
            }
        }
    }

    function _getCell(KanoodleTypes.GamePiece memory piece, uint8 cellNum)
        internal
        pure
        returns (uint8 x, uint8 y, uint8 color)
    {
        if (cellNum == 0) {
            return (piece.x0, piece.y0, piece.color0);
        } else if (cellNum == 1) {
            return (piece.x1, piece.y1, piece.color1);
        } else if (cellNum == 2) {
            return (piece.x2, piece.y2, piece.color2);
        } else {
            return (piece.x3, piece.y3, piece.color3);
        }
    }
}
