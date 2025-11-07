// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KanoodleTypes.sol";

library KanoodleLevels {
    using KanoodleTypes for *;

    /**
     * @notice Get level configuration by ID
     * @param levelId The level ID (1-50)
     * @return Level memory struct with solution and allowed pieces
     */
    function getLevel(uint8 levelId) internal pure returns (KanoodleTypes.Level memory) {
        if (levelId == 1) {
            return KanoodleTypes.Level({
                levelId: 1,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.PURPLE, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray7(1, 2, 4, 6, 11, 12, 13)
            });
        } else if (levelId == 2) {
            return KanoodleTypes.Level({
                levelId: 2,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.BLUE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.PURPLE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray6(1, 4, 2, 6, 11, 12)
            });
        } else if (levelId == 3) {
            return KanoodleTypes.Level({
                levelId: 3,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.YELLOW,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.ORANGE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray6(2, 6, 3, 10, 11, 12)
            });
        } else if (levelId == 4) {
            return KanoodleTypes.Level({
                levelId: 4,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL
                ],
                allowedPieces: _createArray5(1, 4, 6, 10, 11)
            });
        } else if (levelId == 5) {
            return KanoodleTypes.Level({
                levelId: 5,
                solution: [
                    KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(2, 6, 3, 10, 11, 12, 13)
            });
        } else if (levelId == 6) {
            return KanoodleTypes.Level({
                levelId: 6,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray6(1, 4, 2, 3, 11, 12)
            });
        } else if (levelId == 7) {
            return KanoodleTypes.Level({
                levelId: 7,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW,
                    KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray6(1, 4, 6, 10, 11, 12)
            });
        } else if (levelId == 8) {
            return KanoodleTypes.Level({
                levelId: 8,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.PURPLE,
                    KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.RED
                ],
                allowedPieces: _createArray7(1, 4, 2, 10, 11, 12, 13)
            });
        } else if (levelId == 9) {
            return KanoodleTypes.Level({
                levelId: 9,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray6(4, 2, 6, 3, 11, 12)
            });
        } else if (levelId == 10) {
            return KanoodleTypes.Level({
                levelId: 10,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.RED, KanoodleTypes.PURPLE,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.BLUE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.BLUE,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.GREEN
                ],
                allowedPieces: _createArray6(1, 4, 6, 3, 11, 12)
            });
        } else if (levelId == 11) {
            return KanoodleTypes.Level({
                levelId: 11,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.RED,
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.PURPLE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray7(1, 2, 6, 10, 11, 12, 13)
            });
        } else if (levelId == 12) {
            return KanoodleTypes.Level({
                levelId: 12,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray6(1, 2, 6, 10, 11, 12)
            });
        } else if (levelId == 13) {
            return KanoodleTypes.Level({
                levelId: 13,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.ORANGE,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(1, 2, 6, 3, 10, 11, 12)
            });
        } else if (levelId == 14) {
            return KanoodleTypes.Level({
                levelId: 14,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.BLUE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(4, 6, 3, 10, 11, 12, 13)
            });
        } else if (levelId == 15) {
            return KanoodleTypes.Level({
                levelId: 15,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.PURPLE,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray5(4, 2, 6, 3, 10)
            });
        } else if (levelId == 16) {
            return KanoodleTypes.Level({
                levelId: 16,
                solution: [
                    KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.RED,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.NEUTRAL
                ],
                allowedPieces: _createArray6(1, 4, 2, 6, 10, 11)
            });
        } else if (levelId == 17) {
            return KanoodleTypes.Level({
                levelId: 17,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.ORANGE,
                    KanoodleTypes.YELLOW, KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.GREEN,
                    KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(1, 4, 6, 3, 10, 11, 12)
            });
        } else if (levelId == 18) {
            return KanoodleTypes.Level({
                levelId: 18,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.GREEN
                ],
                allowedPieces: _createArray6(1, 4, 2, 6, 3, 10)
            });
        } else if (levelId == 19) {
            return KanoodleTypes.Level({
                levelId: 19,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.GREEN,
                    KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(4, 3, 10, 5, 11, 12, 13)
            });
        } else if (levelId == 20) {
            return KanoodleTypes.Level({
                levelId: 20,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN
                ],
                allowedPieces: _createArray8(1, 4, 3, 10, 5, 11, 12, 13)
            });
        } else if (levelId == 21) {
            return KanoodleTypes.Level({
                levelId: 21,
                solution: [
                    KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.RED,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.NEUTRAL, KanoodleTypes.RED,
                    KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray7(2, 6, 3, 7, 11, 12, 13)
            });
        } else if (levelId == 22) {
            return KanoodleTypes.Level({
                levelId: 22,
                solution: [
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(2, 6, 3, 10, 7, 11, 12)
            });
        } else if (levelId == 23) {
            return KanoodleTypes.Level({
                levelId: 23,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.PURPLE, KanoodleTypes.BLUE,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.BLUE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray7(1, 4, 6, 9, 11, 12, 13)
            });
        } else if (levelId == 24) {
            return KanoodleTypes.Level({
                levelId: 24,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.RED, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray5(1, 4, 2, 6, 9)
            });
        } else if (levelId == 25) {
            return KanoodleTypes.Level({
                levelId: 25,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.ORANGE,
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(4, 6, 3, 7, 9, 11, 12)
            });
        } else if (levelId == 26) {
            return KanoodleTypes.Level({
                levelId: 26,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(1, 6, 10, 7, 9, 11, 12)
            });
        } else if (levelId == 27) {
            return KanoodleTypes.Level({
                levelId: 27,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.ORANGE,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray6(4, 6, 10, 5, 7, 11)
            });
        } else if (levelId == 28) {
            return KanoodleTypes.Level({
                levelId: 28,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray6(1, 6, 10, 5, 7, 11)
            });
        } else if (levelId == 29) {
            return KanoodleTypes.Level({
                levelId: 29,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.YELLOW,
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.PURPLE,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray6(4, 6, 10, 5, 9, 11)
            });
        } else if (levelId == 30) {
            return KanoodleTypes.Level({
                levelId: 30,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.GREEN,
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL, KanoodleTypes.YELLOW,
                    KanoodleTypes.GREEN, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray6(1, 6, 10, 5, 9, 11)
            });
        } else if (levelId == 31) {
            return KanoodleTypes.Level({
                levelId: 31,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.YELLOW,
                    KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(1, 4, 2, 6, 3, 10, 7)
            });
        } else if (levelId == 32) {
            return KanoodleTypes.Level({
                levelId: 32,
                solution: [
                    KanoodleTypes.YELLOW, KanoodleTypes.NEUTRAL, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray7(1, 2, 6, 10, 7, 9, 11)
            });
        } else if (levelId == 33) {
            return KanoodleTypes.Level({
                levelId: 33,
                solution: [
                    KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray7(4, 2, 6, 3, 10, 7, 11)
            });
        } else if (levelId == 34) {
            return KanoodleTypes.Level({
                levelId: 34,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.BLUE, KanoodleTypes.RED,
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.RED, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray6(1, 4, 2, 6, 10, 9)
            });
        } else if (levelId == 35) {
            return KanoodleTypes.Level({
                levelId: 35,
                solution: [
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.NEUTRAL, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(2, 6, 3, 10, 7, 9, 11)
            });
        } else if (levelId == 36) {
            return KanoodleTypes.Level({
                levelId: 36,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(1, 4, 3, 10, 5, 11, 12)
            });
        } else if (levelId == 37) {
            return KanoodleTypes.Level({
                levelId: 37,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.PURPLE, KanoodleTypes.RED,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray7(1, 4, 2, 6, 7, 9, 11)
            });
        } else if (levelId == 38) {
            return KanoodleTypes.Level({
                levelId: 38,
                solution: [
                    KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.RED,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray5(4, 2, 6, 10, 8)
            });
        } else if (levelId == 39) {
            return KanoodleTypes.Level({
                levelId: 39,
                solution: [
                    KanoodleTypes.NEUTRAL, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.RED,
                    KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.RED,
                    KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.RED, KanoodleTypes.RED,
                    KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray6(4, 2, 6, 10, 8, 11)
            });
        } else if (levelId == 40) {
            return KanoodleTypes.Level({
                levelId: 40,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.GREEN,
                    KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.ORANGE,
                    KanoodleTypes.ORANGE, KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray7(1, 4, 2, 6, 3, 10, 8)
            });
        } else if (levelId == 41) {
            return KanoodleTypes.Level({
                levelId: 41,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.PURPLE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.YELLOW,
                    KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.GREEN, KanoodleTypes.GREEN,
                    KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.YELLOW
                ],
                allowedPieces: _createArray7(1, 4, 2, 6, 3, 10, 8)
            });
        } else if (levelId == 42) {
            return KanoodleTypes.Level({
                levelId: 42,
                solution: [
                    KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.YELLOW,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE, KanoodleTypes.YELLOW,
                    KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.ORANGE
                ],
                allowedPieces: _createArray6(2, 6, 3, 10, 7, 8)
            });
        } else if (levelId == 43) {
            return KanoodleTypes.Level({
                levelId: 43,
                solution: [
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE,
                    KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.NEUTRAL,
                    KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.YELLOW,
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.PURPLE, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray7(4, 2, 6, 3, 10, 8, 11)
            });
        } else if (levelId == 44) {
            return KanoodleTypes.Level({
                levelId: 44,
                solution: [
                    KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.YELLOW, KanoodleTypes.RED,
                    KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.YELLOW,
                    KanoodleTypes.ORANGE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.GREEN, KanoodleTypes.GREEN
                ],
                allowedPieces: _createArray6(4, 6, 3, 10, 5, 8)
            });
        } else if (levelId == 45) {
            return KanoodleTypes.Level({
                levelId: 45,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.PURPLE,
                    KanoodleTypes.GREEN, KanoodleTypes.YELLOW, KanoodleTypes.GREEN, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray7(1, 4, 6, 3, 10, 9, 8)
            });
        } else if (levelId == 46) {
            return KanoodleTypes.Level({
                levelId: 46,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.GREEN, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.PURPLE
                ],
                allowedPieces: _createArray8(1, 4, 2, 6, 10, 9, 8, 12)
            });
        } else if (levelId == 47) {
            return KanoodleTypes.Level({
                levelId: 47,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.PURPLE, KanoodleTypes.BLUE,
                    KanoodleTypes.PURPLE, KanoodleTypes.RED, KanoodleTypes.ORANGE, KanoodleTypes.BLUE,
                    KanoodleTypes.PURPLE, KanoodleTypes.GREEN, KanoodleTypes.GREEN, KanoodleTypes.YELLOW,
                    KanoodleTypes.PURPLE, KanoodleTypes.NEUTRAL, KanoodleTypes.GREEN, KanoodleTypes.BLUE
                ],
                allowedPieces: _createArray7(1, 4, 6, 10, 9, 8, 11)
            });
        } else if (levelId == 48) {
            return KanoodleTypes.Level({
                levelId: 48,
                solution: [
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.PURPLE, KanoodleTypes.RED,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.BLUE, KanoodleTypes.PURPLE,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.RED,
                    KanoodleTypes.PURPLE, KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.RED
                ],
                allowedPieces: _createArray6(4, 2, 6, 7, 9, 8)
            });
        } else if (levelId == 49) {
            return KanoodleTypes.Level({
                levelId: 49,
                solution: [
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.RED, KanoodleTypes.YELLOW, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.GREEN
                ],
                allowedPieces: _createArray7(1, 2, 6, 3, 10, 7, 8)
            });
        } else if (levelId == 50) {
            return KanoodleTypes.Level({
                levelId: 50,
                solution: [
                    KanoodleTypes.RED, KanoodleTypes.RED, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.PURPLE, KanoodleTypes.BLUE, KanoodleTypes.BLUE, KanoodleTypes.BLUE,
                    KanoodleTypes.ORANGE, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW, KanoodleTypes.YELLOW,
                    KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.ORANGE, KanoodleTypes.RED
                ],
                allowedPieces: _createArray7(1, 4, 2, 6, 3, 10, 8)
            });
        } else {
            // Invalid level ID - return empty level
            return KanoodleTypes.Level({
                levelId: 0,
                solution: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                allowedPieces: new uint8[](0)
            });
        }
    }

    // Helper functions to create arrays of different sizes
    function _createArray5(uint8 p1, uint8 p2, uint8 p3, uint8 p4, uint8 p5)
        private pure returns (uint8[] memory)
    {
        uint8[] memory arr = new uint8[](5);
        arr[0] = p1; arr[1] = p2; arr[2] = p3; arr[3] = p4; arr[4] = p5;
        return arr;
    }

    function _createArray6(uint8 p1, uint8 p2, uint8 p3, uint8 p4, uint8 p5, uint8 p6)
        private pure returns (uint8[] memory)
    {
        uint8[] memory arr = new uint8[](6);
        arr[0] = p1; arr[1] = p2; arr[2] = p3; arr[3] = p4; arr[4] = p5; arr[5] = p6;
        return arr;
    }

    function _createArray7(uint8 p1, uint8 p2, uint8 p3, uint8 p4, uint8 p5, uint8 p6, uint8 p7)
        private pure returns (uint8[] memory)
    {
        uint8[] memory arr = new uint8[](7);
        arr[0] = p1; arr[1] = p2; arr[2] = p3; arr[3] = p4; arr[4] = p5; arr[5] = p6; arr[6] = p7;
        return arr;
    }

    function _createArray8(uint8 p1, uint8 p2, uint8 p3, uint8 p4, uint8 p5, uint8 p6, uint8 p7, uint8 p8)
        private pure returns (uint8[] memory)
    {
        uint8[] memory arr = new uint8[](8);
        arr[0] = p1; arr[1] = p2; arr[2] = p3; arr[3] = p4;
        arr[4] = p5; arr[5] = p6; arr[6] = p7; arr[7] = p8;
        return arr;
    }
}
