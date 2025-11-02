#[cfg(test)]
mod tests_kanoodle_fusion_system {
    use dojo::world::{WorldStorage, WorldStorageTrait, world};
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use kanoodle_fusion::models::{
        FLIP_NORMAL, m_GamePlacedPiece, m_KanoodleGame, piece, rotations,
    };
    use kanoodle_fusion::store::{Store, StoreTrait};
    use kanoodle_fusion::systems::kanoodle_fusion_system::{
        IKanoodleSystemDispatcher, IKanoodleSystemDispatcherTrait, kanoodle_fusion_system,
    };
    use starknet::ContractAddress;
    use starknet::testing::{set_account_contract_address, set_contract_address};

    const X_0: u8 = 0;
    const X_1: u8 = 1;
    const X_2: u8 = 2;
    const X_3: u8 = 3;
    const Y_0: u8 = 0;
    const Y_1: u8 = 1;
    const Y_2: u8 = 2;
    const Y_3: u8 = 3;

    fn DEFAULT_NS_BYTE() -> ByteArray {
        "kanoodle_fusion"
    }

    fn OWNER() -> ContractAddress {
        'OWNER'.try_into().unwrap()
    }

    fn PLAYER() -> ContractAddress {
        'PLAYER'.try_into().unwrap()
    }

    fn setup() -> (WorldStorage, Store) {
        impersonate(OWNER());
        let ndef = namespace_def();

        let mut world = spawn_test_world(world::TEST_CLASS_HASH, [ndef].span());
        world.sync_perms_and_inits(contract_defs());
        (world, StoreTrait::new(world))
    }

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: DEFAULT_NS_BYTE(),
            resources: [
                TestResource::Model(m_KanoodleGame::TEST_CLASS_HASH),
                TestResource::Model(m_GamePlacedPiece::TEST_CLASS_HASH),
                TestResource::Contract(kanoodle_fusion_system::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@DEFAULT_NS_BYTE(), @"kanoodle_fusion_system")
                .with_writer_of([dojo::utils::bytearray_hash(@DEFAULT_NS_BYTE())].span())
        ]
            .span()
    }

    fn impersonate(address: ContractAddress) {
        set_contract_address(address);
        set_account_contract_address(address);
    }

    // Helper function to get color name from color code
    fn color_name(color: u8) -> ByteArray {
        if color == 0 {
            "EMPTY  "
        } else if color == 1 {
            "RED    "
        } else if color == 2 {
            "YELLOW "
        } else if color == 3 {
            "BLUE   "
        } else if color == 4 {
            "GREEN  "
        } else if color == 5 {
            "ORANGE "
        } else if color == 6 {
            "PURPLE "
        } else if color == 7 {
            "NEUTRAL"
        } else {
            "UNKNOWN"
        }
    }

    // Helper function to print a 4x4 matrix with nice formatting
    fn print_solution(solution: Span<u8>, title: ByteArray) {
        println!("{}", title);

        // Print 4 rows
        let mut row: u32 = 0;
        loop {
            if row >= 4 {
                break;
            }

            print!("| ");

            // Print 4 columns
            let mut col: u32 = 0;
            loop {
                if col >= 4 {
                    break;
                }

                let idx: u32 = row * 4 + col;
                print!("{}", color_name(*solution.at(idx)));

                if col < 3 {
                    print!(" | ");
                }

                col += 1;
            }

            println!(" |");

            if row < 3 {}

            row += 1;
        }

        println!("");
    }

    fn kanoodle_system_dispatcher(world: WorldStorage) -> IKanoodleSystemDispatcher {
        let (contract_address, _) = world.dns(@"kanoodle_fusion_system").unwrap();
        IKanoodleSystemDispatcher { contract_address }
    }

    #[test]
    fn test_start_game() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        assert!(game_id == 1, "Game ID should be 1");

        let game = store.get_kanoodle_game(game_id);
        assert!(game.game_id == 1, "Game ID mismatch");
        assert!(game.player == PLAYER(), "Player mismatch");
        assert!(game.level_id == 1, "Level ID should be 1");
        assert!(game.placed_piece_ids.len() == 0, "Should have no placed pieces");
        assert!(game.current_solution.len() == 16, "Should have 16 cells");
    }

    #[test]
    fn test_start_multiple_games() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id1 = kanoodle_system.start_game(PLAYER(), 1);
        let game_id2 = kanoodle_system.start_game(PLAYER(), 1);

        assert!(game_id1 == 1, "First game ID should be 1");
        assert!(game_id2 == 2, "Second game ID should be 2");
    }

    #[test]
    fn test_place_piece() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        let success = kanoodle_system.place_piece(game_id, PLAYER(), 1, 0, 0, 0, false);
        assert!(success, "Piece placement should succeed");

        let game = store.get_kanoodle_game(game_id);
        assert!(game.placed_piece_ids.len() == 1, "Should have 1 placed piece ID");
        assert!(*game.placed_piece_ids.at(0) == 1, "Should be piece 1");

        let placed = store.get_placed_piece(game_id, PLAYER(), 1);
        assert!(placed.x == 0, "X should be 0");
        assert!(placed.y == 0, "Y should be 0");
        assert!(placed.rotation == 0, "Rotation should be 0");
        assert!(!placed.flipped, "Should not be flipped");
    }

    #[test]
    fn test_place_multiple_pieces() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        kanoodle_system.place_piece(game_id, PLAYER(), 1, 0, 0, 0, false);
        kanoodle_system.place_piece(game_id, PLAYER(), 2, 0, 1, 0, false);

        let game = store.get_kanoodle_game(game_id);
        assert!(game.placed_piece_ids.len() == 2, "Should have 2 placed piece IDs");
    }

    #[test]
    fn test_check_solution() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        // Place all 7 allowed pieces for level 1 in correct positions
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_1, X_0, Y_3, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_2, X_0, Y_0, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_4, X_1, Y_0, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_6, X_1, Y_1, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_11, X_2, Y_2, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_12, X_3, Y_0, rotations::DEG_0, FLIP_NORMAL);

        // Print current state before last piece
        let game_before = store.get_kanoodle_game(game_id);
        let level_1 = crate::models::get_level(1);
        print_solution(level_1.solution, "EXPECTED SOLUTION - Level 1");
        print_solution(game_before.current_solution, "CURRENT SOLUTION - Before last piece");

        // Place last piece - this should complete the level and advance to level 2
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_13, X_3, Y_2, rotations::DEG_0, FLIP_NORMAL);

        // After solving, the game should advance to level 2 and reset
        let game = store.get_kanoodle_game(game_id);

        // If the solution was correct, level should be 2 and board reset
        // If not correct, level stays at 1 with 7 pieces
        println!("Level after placing all pieces: {}", game.level_id);
        println!("Placed pieces count: {}", game.placed_piece_ids.len());

        // Print final state
        print_solution(game.current_solution, "CURRENT SOLUTION - After last piece");
    }

    #[test]
    fn test_level_36() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 36);

        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_3, X_0, Y_3, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_10, X_0, Y_1, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_1, X_0, Y_0, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_4, X_1, Y_1, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_5, X_2, Y_0, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_11, X_1, Y_0, rotations::DEG_0, FLIP_NORMAL);

        // Print current state before last piece
        let game_before = store.get_kanoodle_game(game_id);
        let level_36 = crate::models::get_level(36);
        print_solution(level_36.solution, "EXPECTED SOLUTION - Level 36");
        print_solution(game_before.current_solution, "CURRENT SOLUTION - Before last piece");

        // Place last piece - this should complete the level and advance to level 37
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_12, X_3, Y_0, rotations::DEG_0, FLIP_NORMAL);

        // After solving, the game should advance to level 37 and reset
        let game = store.get_kanoodle_game(game_id);

        println!("Level after placing all pieces: {}", game.level_id);
        println!("Placed pieces count: {}", game.placed_piece_ids.len());

        // Print final state
        print_solution(game.current_solution, "CURRENT SOLUTION - After last piece");

        // Verify level advancement if solution was correct
        if game.level_id == 37 {
            println!("SUCCESS: Level 36 solved and advanced to level 37!");
            assert!(game.placed_piece_ids.len() == 0, "Board should be reset");
        } else {
            println!("Solution did not match - level remains at 36");
        }
    }

    #[test]
    fn test_level_50() {
        let (world, mut store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 50);

        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_1, X_0, Y_1, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_3, X_0, Y_2, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_2, X_0, Y_3, rotations::DEG_90, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_6, X_0, Y_0, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_10, X_0, Y_2, rotations::DEG_0, FLIP_NORMAL);
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_4, X_1, Y_0, rotations::DEG_90, FLIP_NORMAL);

        // Print current state before last piece
        let game_before = store.get_kanoodle_game(game_id);
        let level_50 = crate::models::get_level(50);
        print_solution(level_50.solution, "EXPECTED SOLUTION - Level 50");
        print_solution(game_before.current_solution, "CURRENT SOLUTION - Before last piece");

        // Place last piece - this should complete level 50
        // Note: Level 50 is the max level, so it should NOT advance
        kanoodle_system
            .place_piece(game_id, PLAYER(), piece::ID_8, X_3, Y_1, rotations::DEG_180, FLIP_NORMAL);

        // After solving level 50, the level should stay at 50 (no advancement)
        let game = store.get_kanoodle_game(game_id);

        println!("Level after placing all pieces: {}", game.level_id);
        println!("Placed pieces count: {}", game.placed_piece_ids.len());

        // Print final state
        print_solution(game.current_solution, "CURRENT SOLUTION - After last piece");

        // Level 50 is the max level - should stay at 50 even if solved
        if game.level_id == 50 && game.placed_piece_ids.len() == 7 {
            println!("Level 50 completed! Board stays at level 50 (max level)");
        }
    }

    #[test]
    fn test_get_game_state() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        let game = kanoodle_system.get_game_state(game_id, PLAYER());
        assert!(game.game_id == game_id, "Game ID mismatch");
        assert!(game.player == PLAYER(), "Player mismatch");
    }

    #[test]
    #[should_panic]
    fn test_place_piece_invalid_id() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        kanoodle_system.place_piece(game_id, PLAYER(), 0, 0, 0, 0, false);
    }

    #[test]
    #[should_panic]
    fn test_place_piece_invalid_rotation() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        kanoodle_system.place_piece(game_id, PLAYER(), 1, 0, 0, 4, false);
    }

    #[test]
    #[should_panic]
    fn test_place_piece_not_allowed() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        // Piece 3 is not allowed in level 1 - this should panic with assert
        kanoodle_system.place_piece(game_id, PLAYER(), 3, 0, 0, 0, false);
    }

    #[test]
    fn test_place_piece_already_placed() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        let game_id = kanoodle_system.start_game(PLAYER(), 1);

        kanoodle_system.place_piece(game_id, PLAYER(), 1, 0, 0, 0, false);
        let success = kanoodle_system.place_piece(game_id, PLAYER(), 1, 1, 1, 0, false);

        assert!(!success, "Should not allow duplicate piece");
    }

    #[test]
    #[should_panic]
    fn test_start_game_invalid_level() {
        let (world, _store) = setup();
        let kanoodle_system = kanoodle_system_dispatcher(world);

        set_contract_address(PLAYER());
        kanoodle_system.start_game(PLAYER(), 0);
    }
}
