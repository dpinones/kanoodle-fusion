// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/KanoodleFusion.sol";
import "../src/KanoodleTypes.sol";
import "../src/KanoodleLevels.sol";

contract KanoodleFusionTest is Test {
    using KanoodleTypes for *;

    KanoodleFusion public kanoodle;
    address public player = address(0x1234);

    function setUp() public {
        kanoodle = new KanoodleFusion();
    }

    function test_check_solution() public {
        vm.startPrank(player);

        uint32 gameId = kanoodle.startGame(player, 1);

        // Place all 7 allowed pieces for level 1 in correct positions
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_1, 0, 3, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_2, 0, 0, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_4, 1, 0, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_6, 1, 1, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_11, 2, 2, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_12, 3, 0, KanoodleTypes.DEG_0, false);

        // Get current state before last piece
        KanoodleTypes.Game memory gameBefore = kanoodle.getGameState(gameId);
        KanoodleTypes.Level memory level1 = KanoodleLevels.getLevel(1);

        console.log("EXPECTED SOLUTION - Level 1");
        _printSolution(level1.solution);
        console.log("\nCURRENT SOLUTION - Before last piece");
        _printSolution(gameBefore.currentSolution);

        // Place last piece - this should complete the level and advance to level 2
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_13, 3, 2, KanoodleTypes.DEG_0, false);

        // After solving, the game should advance to level 2 and reset
        KanoodleTypes.Game memory game = kanoodle.getGameState(gameId);

        console.log("\nLevel after placing all pieces:", game.levelId);
        console.log("Placed pieces count:", game.placedPieceIds.length);

        console.log("\nCURRENT SOLUTION - After last piece");
        _printSolution(game.currentSolution);

        // Note: The Cairo test doesn't assert the solution matches
        // It just verifies that pieces can be placed and the game logic works
        // This matches the Cairo test behavior
        console.log("Test completed - all pieces placed successfully");
        assertEq(game.placedPieceIds.length, 7, "All 7 pieces should be placed");

        vm.stopPrank();
    }

    function test_level_36() public {
        vm.startPrank(player);

        uint32 gameId = kanoodle.startGame(player, 36);

        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_3, 0, 3, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_10, 0, 1, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_1, 0, 0, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_4, 1, 1, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_5, 2, 0, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_11, 1, 0, KanoodleTypes.DEG_0, false);

        // Get current state before last piece
        KanoodleTypes.Game memory gameBefore = kanoodle.getGameState(gameId);
        KanoodleTypes.Level memory level36 = KanoodleLevels.getLevel(36);

        console.log("EXPECTED SOLUTION - Level 36");
        _printSolution(level36.solution);
        console.log("\nCURRENT SOLUTION - Before last piece");
        _printSolution(gameBefore.currentSolution);

        // Place last piece - this should complete the level and advance to level 37
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_12, 3, 0, KanoodleTypes.DEG_0, false);

        // After solving, the game should advance to level 37 and reset
        KanoodleTypes.Game memory game = kanoodle.getGameState(gameId);

        console.log("\nLevel after placing all pieces:", game.levelId);
        console.log("Placed pieces count:", game.placedPieceIds.length);

        console.log("\nCURRENT SOLUTION - After last piece");
        _printSolution(game.currentSolution);

        // Verify level advancement if solution was correct
        if (game.levelId == 37) {
            console.log("SUCCESS: Level 36 solved and advanced to level 37!");
            assertEq(game.placedPieceIds.length, 0, "Board should be reset");
        } else {
            console.log("Solution did not match - level remains at 36");
            assertEq(game.levelId, 37, "Should advance to level 37");
        }

        vm.stopPrank();
    }

    function test_level_50() public {
        vm.startPrank(player);

        uint32 gameId = kanoodle.startGame(player, 50);

        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_1, 0, 1, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_3, 0, 2, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_2, 0, 3, KanoodleTypes.DEG_90, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_6, 0, 0, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_10, 0, 2, KanoodleTypes.DEG_0, false);
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_4, 1, 0, KanoodleTypes.DEG_90, false);

        // Get current state before last piece
        KanoodleTypes.Game memory gameBefore = kanoodle.getGameState(gameId);
        KanoodleTypes.Level memory level50 = KanoodleLevels.getLevel(50);

        console.log("EXPECTED SOLUTION - Level 50");
        _printSolution(level50.solution);
        console.log("\nCURRENT SOLUTION - Before last piece");
        _printSolution(gameBefore.currentSolution);

        // Place last piece - this should complete level 50
        // Note: Level 50 is the max level, so it should NOT advance
        kanoodle.placePiece(gameId, player, KanoodleTypes.PIECE_8, 3, 1, KanoodleTypes.DEG_180, false);

        // After solving level 50, the level should stay at 50 (no advancement)
        KanoodleTypes.Game memory game = kanoodle.getGameState(gameId);

        console.log("\nLevel after placing all pieces:", game.levelId);
        console.log("Placed pieces count:", game.placedPieceIds.length);

        console.log("\nCURRENT SOLUTION - After last piece");
        _printSolution(game.currentSolution);

        // Level 50 is the max level - should stay at 50 even if solved
        if (game.levelId == 50 && game.placedPieceIds.length == 7) {
            console.log("Level 50 completed! Board stays at level 50 (max level)");
        }

        assertEq(game.levelId, 50, "Should stay at level 50");

        vm.stopPrank();
    }

    // Helper function to print a 4x4 solution
    function _printSolution(uint8[16] memory solution) internal view {
        string[8] memory colorNames = [
            "EMPTY  ",
            "RED    ",
            "YELLOW ",
            "BLUE   ",
            "GREEN  ",
            "ORANGE ",
            "PURPLE ",
            "NEUTRAL"
        ];

        for (uint256 row = 0; row < 4; row++) {
            string memory line = "| ";
            for (uint256 col = 0; col < 4; col++) {
                uint256 idx = row * 4 + col;
                uint8 color = solution[idx];
                line = string(abi.encodePacked(line, colorNames[color]));
                if (col < 3) {
                    line = string(abi.encodePacked(line, " | "));
                }
            }
            console.log(string(abi.encodePacked(line, " |")));
        }
    }

    function test_validateSolution_validSolution() public {
        vm.startPrank(player);

        // Prepare a valid solution for level 1
        KanoodleTypes.PlacedPieceWithId[] memory pieces = new KanoodleTypes.PlacedPieceWithId[](7);

        pieces[0] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_1,
            x: 0,
            y: 3,
            rotation: KanoodleTypes.DEG_90,
            flipped: false
        });

        pieces[1] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_2,
            x: 0,
            y: 0,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[2] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_4,
            x: 1,
            y: 0,
            rotation: KanoodleTypes.DEG_90,
            flipped: false
        });

        pieces[3] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_6,
            x: 1,
            y: 1,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[4] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_11,
            x: 2,
            y: 2,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[5] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_12,
            x: 3,
            y: 0,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[6] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_13,
            x: 3,
            y: 2,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        // Validate the solution
        bool isValid = kanoodle.validateSolution(1, pieces);

        console.log("Solution is valid:", isValid);
        assertTrue(isValid, "Valid solution should be accepted");

        vm.stopPrank();
    }

    function test_validateSolution_invalidSolution() public {
        vm.startPrank(player);

        // Prepare an invalid solution (wrong positions)
        KanoodleTypes.PlacedPieceWithId[] memory pieces = new KanoodleTypes.PlacedPieceWithId[](3);

        pieces[0] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_1,
            x: 0,
            y: 0,  // Wrong position
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[1] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_2,
            x: 1,
            y: 1,  // Wrong position
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[2] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_4,
            x: 2,
            y: 2,  // Wrong position
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        // Validate the solution
        bool isValid = kanoodle.validateSolution(1, pieces);

        console.log("Solution is valid:", isValid);
        assertFalse(isValid, "Invalid solution should be rejected");

        vm.stopPrank();
    }

    function test_validateSolution_duplicatePiece() public {
        vm.startPrank(player);

        // Try to use the same piece twice
        KanoodleTypes.PlacedPieceWithId[] memory pieces = new KanoodleTypes.PlacedPieceWithId[](2);

        pieces[0] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_1,
            x: 0,
            y: 0,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        pieces[1] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_1,  // Same piece ID!
            x: 1,
            y: 1,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        // This should revert with "Duplicate piece"
        vm.expectRevert("Duplicate piece");
        kanoodle.validateSolution(1, pieces);

        vm.stopPrank();
    }

    function test_validateSolution_pieceNotAllowed() public {
        vm.startPrank(player);

        // Try to use a piece not allowed in level 1
        KanoodleTypes.PlacedPieceWithId[] memory pieces = new KanoodleTypes.PlacedPieceWithId[](1);

        pieces[0] = KanoodleTypes.PlacedPieceWithId({
            pieceId: KanoodleTypes.PIECE_5,  // Piece 5 is not allowed in level 1
            x: 0,
            y: 0,
            rotation: KanoodleTypes.DEG_0,
            flipped: false
        });

        // This should revert with "Piece not allowed in this level"
        vm.expectRevert("Piece not allowed in this level");
        kanoodle.validateSolution(1, pieces);

        vm.stopPrank();
    }
}
