use starknet::ContractAddress;
use crate::models::KanoodleGame;

#[starknet::interface]
pub trait IKanoodleSystem<T> {
    fn start_game(ref self: T, player: ContractAddress, level_id: u8) -> u32;
    fn place_piece(
        ref self: T,
        game_id: u32,
        player: ContractAddress,
        piece_id: u8,
        x: u8,
        y: u8,
        rotation: u8,
        flipped: bool,
    ) -> bool;
    fn reset(ref self: T, game_id: u32) -> bool;
    fn get_game_state(self: @T, game_id: u32, player: ContractAddress) -> KanoodleGame;
}

#[dojo::contract]
pub mod kanoodle_fusion_system {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::ContractAddress;
    use crate::models::{GamePiece, GamePlacedPiece, KanoodleGame, colors};
    use crate::store::StoreTrait;
    use super::IKanoodleSystem;

    // Helper functions for piece transformation and color mixing

    /// Transform a cell coordinate based on rotation and flip
    /// Rotation: 0=0°, 1=90°, 2=180°, 3=270° (clockwise)
    /// Flip: mirrors horizontally before rotation
    fn transform_cell(
        x: u8, y: u8, rotation: u8, flipped: bool, piece_width: u8, piece_height: u8,
    ) -> (u8, u8) {
        // Apply flip first (mirror horizontally)
        let (fx, fy) = if flipped {
            if piece_width > 0 {
                (piece_width - 1 - x, y)
            } else {
                (x, y)
            }
        } else {
            (x, y)
        };

        // Then apply rotation
        if rotation == 0 {
            (fx, fy)
        } else if rotation == 1 {
            // 90° clockwise: (x,y) -> (height-1-y, x)
            if piece_height > 0 {
                (piece_height - 1 - fy, fx)
            } else {
                (fx, fy)
            }
        } else if rotation == 2 {
            // 180°: (x,y) -> (width-1-x, height-1-y)
            let mut result_x = fx;
            let mut result_y = fy;
            if piece_width > 0 {
                result_x = piece_width - 1 - fx;
            }
            if piece_height > 0 {
                result_y = piece_height - 1 - fy;
            }
            (result_x, result_y)
        } else {
            // 270° clockwise (or 90° counter-clockwise): (x,y) -> (y, width-1-x)
            if piece_width > 0 {
                (fy, piece_width - 1 - fx)
            } else {
                (fx, fy)
            }
        }
    }

    /// Calculate piece bounding box to determine transformation parameters
    fn get_piece_bounds(piece: GamePiece) -> (u8, u8) {
        let mut max_x: u8 = 0;
        let mut max_y: u8 = 0;

        if piece.size >= 1 {
            if piece.x0 > max_x {
                max_x = piece.x0;
            }
            if piece.y0 > max_y {
                max_y = piece.y0;
            }
        }
        if piece.size >= 2 {
            if piece.x1 > max_x {
                max_x = piece.x1;
            }
            if piece.y1 > max_y {
                max_y = piece.y1;
            }
        }
        if piece.size >= 3 {
            if piece.x2 > max_x {
                max_x = piece.x2;
            }
            if piece.y2 > max_y {
                max_y = piece.y2;
            }
        }
        if piece.size >= 4 {
            if piece.x3 > max_x {
                max_x = piece.x3;
            }
            if piece.y3 > max_y {
                max_y = piece.y3;
            }
        }

        (max_x + 1, max_y + 1) // width, height
    }

    /// Mix colors additively based on primary colors in the stack
    /// Returns the final mixed color
    fn mix_colors(color_stack: Span<u8>) -> u8 {
        if color_stack.len() == 0 {
            return colors::EMPTY;
        }

        // If any neutral piece is in the stack, return neutral (opaque, blocks everything below)
        let mut i = 0;
        loop {
            if i >= color_stack.len() {
                break;
            }
            if *color_stack.at(i) == colors::NEUTRAL {
                return colors::NEUTRAL;
            }
            i += 1;
        }

        // Track which primary colors are present
        let mut has_red = false;
        let mut has_yellow = false;
        let mut has_blue = false;

        // Decompose all colors into primaries
        i = 0;
        loop {
            if i >= color_stack.len() {
                break;
            }
            let color = *color_stack.at(i);

            // Primary colors
            if color == colors::RED {
                has_red = true;
            } else if color == colors::YELLOW {
                has_yellow = true;
            } else if color == colors::BLUE {
                has_blue = true;
            } // Secondary colors - decompose to primaries
            else if color == colors::ORANGE {
                has_red = true;
                has_yellow = true;
            } else if color == colors::GREEN {
                has_yellow = true;
                has_blue = true;
            } else if color == colors::PURPLE {
                has_red = true;
                has_blue = true;
            }

            i += 1;
        }

        // Mix primaries to get final color
        if has_red && has_yellow && has_blue {
            // All three primaries = muddy/undefined
            colors::EMPTY
        } else if has_red && has_yellow {
            colors::ORANGE
        } else if has_red && has_blue {
            colors::PURPLE
        } else if has_yellow && has_blue {
            colors::GREEN
        } else if has_red {
            colors::RED
        } else if has_yellow {
            colors::YELLOW
        } else if has_blue {
            colors::BLUE
        } else {
            colors::EMPTY
        }
    }

    /// Rebuild the current solution board from all placed pieces
    /// Returns a Span<u8> of 16 cells (4x4 board) with final mixed colors
    fn rebuild_current_solution(
        game_id: u32, player: ContractAddress, ref store: crate::store::Store,
    ) -> Span<u8> {
        // Initialize color stacks for each cell (4x4 = 16 cells)
        // Using arrays of arrays to store color stacks
        let mut board_stacks: Array<Array<u8>> = array![];
        let mut cell_idx: u8 = 0;
        loop {
            if cell_idx >= 16_u8 {
                break;
            }
            board_stacks.append(array![]);
            cell_idx += 1;
        }

        // Get all placed pieces for this game
        let mut piece_id: u8 = 1;
        loop {
            if piece_id > 13 {
                break;
            }

            let placed = store.get_placed_piece(game_id, player, piece_id);
            if placed.x != 255 { // Piece is placed
                // Get piece definition
                let piece_def = crate::models::get_piece_definition(piece_id);
                let (piece_width, piece_height) = get_piece_bounds(piece_def);

                // Process each cell in the piece
                let mut cell_num = 0;
                loop {
                    if cell_num >= piece_def.size {
                        break;
                    }

                    // Get cell relative coordinates and color
                    let (rel_x, rel_y, cell_color) = if cell_num == 0 {
                        (piece_def.x0, piece_def.y0, piece_def.color0)
                    } else if cell_num == 1 {
                        (piece_def.x1, piece_def.y1, piece_def.color1)
                    } else if cell_num == 2 {
                        (piece_def.x2, piece_def.y2, piece_def.color2)
                    } else {
                        (piece_def.x3, piece_def.y3, piece_def.color3)
                    };

                    // Apply transformations
                    let (trans_x, trans_y) = transform_cell(
                        rel_x, rel_y, placed.rotation, placed.flipped, piece_width, piece_height,
                    );

                    // Calculate absolute board position
                    let abs_x = placed.x + trans_x;
                    let abs_y = placed.y + trans_y;

                    // Add color to the stack if within bounds
                    if abs_x < 4 && abs_y < 4 {
                        let board_idx = abs_y * 4 + abs_x;
                        // We need to append to the array at board_idx
                        // Unfortunately, we can't mutate nested arrays directly in Cairo
                        // We'll use a workaround by rebuilding the array
                        let mut new_stacks: Array<Array<u8>> = array![];
                        let mut i = 0;
                        loop {
                            if i >= 16 {
                                break;
                            }
                            if i == board_idx.into() {
                                let mut new_stack = array![];
                                let mut j = 0;
                                let old_stack = board_stacks.at(i);
                                loop {
                                    if j >= old_stack.len() {
                                        break;
                                    }
                                    new_stack.append(*old_stack.at(j));
                                    j += 1;
                                }
                                new_stack.append(cell_color);
                                new_stacks.append(new_stack);
                            } else {
                                // Copy existing stack
                                let mut copied_stack = array![];
                                let mut j = 0;
                                let old_stack = board_stacks.at(i);
                                loop {
                                    if j >= old_stack.len() {
                                        break;
                                    }
                                    copied_stack.append(*old_stack.at(j));
                                    j += 1;
                                }
                                new_stacks.append(copied_stack);
                            }
                            i += 1;
                        }
                        board_stacks = new_stacks;
                    }

                    cell_num += 1;
                };
            }

            piece_id += 1;
        }

        // Mix colors in each cell and build final solution
        let mut final_solution = array![];
        let mut i = 0;
        loop {
            if i >= 16 {
                break;
            }
            let stack = board_stacks.at(i);
            let mixed_color = mix_colors(stack.span());
            final_solution.append(mixed_color);
            i += 1;
        }

        final_solution.span()
    }

    #[storage]
    struct Storage {
        next_game_id: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameStarted: GameStarted,
        PiecePlaced: PiecePlaced,
        PieceRemoved: PieceRemoved,
        GameSolved: GameSolved,
    }

    #[derive(Drop, starknet::Event)]
    struct GameStarted {
        game_id: u32,
        player: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct PiecePlaced {
        game_id: u32,
        player: ContractAddress,
        piece_id: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct PieceRemoved {
        game_id: u32,
        player: ContractAddress,
        piece_id: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct GameSolved {
        game_id: u32,
        player: ContractAddress,
        moves: u32,
    }

    fn dojo_init(ref self: ContractState) {
        self.next_game_id.write(1);
    }

    #[abi(embed_v0)]
    impl KanoodleSystemImpl of IKanoodleSystem<ContractState> {
        fn start_game(ref self: ContractState, player: ContractAddress, level_id: u8) -> u32 {
            assert(level_id >= 1, 'Invalid level_id');

            let mut store = StoreTrait::new(self.world(@"kanoodle_fusion"));
            let game_id = self.next_game_id.read();
            self.next_game_id.write(game_id + 1);

            // Initialize with empty board and no pieces
            let empty_solution = array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            let game = KanoodleGame {
                game_id,
                player,
                level_id,
                current_solution: empty_solution.span(),
                placed_piece_ids: array![].span(),
            };

            store.set_kanoodle_game(game);

            // Initialize all pieces as not placed (x=255 marker)
            let mut piece_id: u8 = 1;
            loop {
                if piece_id > 13 {
                    break;
                }
                store.delete_placed_piece(game_id, player, piece_id);
                piece_id += 1;
            }

            self.emit(GameStarted { game_id, player });
            game_id
        }

        fn place_piece(
            ref self: ContractState,
            game_id: u32,
            player: ContractAddress,
            piece_id: u8,
            x: u8,
            y: u8,
            rotation: u8,
            flipped: bool,
        ) -> bool {
            assert(piece_id >= 1 && piece_id <= 13, 'Invalid piece_id');
            assert(rotation < 4, 'Invalid rotation');

            let mut store = StoreTrait::new(self.world(@"kanoodle_fusion"));
            let mut game = store.get_kanoodle_game(game_id);

            // Check if piece is allowed for this level
            let level = crate::models::get_level(game.level_id);
            let mut piece_allowed = false;
            let mut i = 0;
            loop {
                if i >= level.allowed_pieces.len() {
                    break;
                }
                if *level.allowed_pieces.at(i) == piece_id {
                    piece_allowed = true;
                    break;
                }
                i += 1;
            }
            assert(piece_allowed, 'Invalid piece_id');

            // Check if piece already placed
            let existing = store.get_placed_piece(game_id, player, piece_id);
            if existing.x != 255 {
                return false; // Already placed
            }

            // Store the placed piece
            let placed = GamePlacedPiece { game_id, player, piece_id, x, y, rotation, flipped };
            store.set_placed_piece(placed);

            // Update placed_piece_ids
            let mut new_placed_ids = array![];
            let mut i = 0;
            loop {
                if i >= game.placed_piece_ids.len() {
                    break;
                }
                new_placed_ids.append(*game.placed_piece_ids.at(i));
                i += 1;
            }
            new_placed_ids.append(piece_id);

            // Recalculate current_solution based on all placed pieces
            let new_solution = rebuild_current_solution(game_id, player, ref store);

            game.placed_piece_ids = new_placed_ids.span();
            game.current_solution = new_solution;
            store.set_kanoodle_game(game);

            self.emit(PiecePlaced { game_id, player, piece_id });

            // Check if the level is now solved
            self.check_solution(ref store, game_id, player);

            true
        }

        fn reset(ref self: ContractState, game_id: u32) -> bool {
            let mut store = StoreTrait::new(self.world(@"kanoodle_fusion"));
            let mut game = store.get_kanoodle_game(game_id);

            // Reset the game state to empty
            let empty_solution = array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            game.current_solution = empty_solution.span();
            game.placed_piece_ids = array![].span();
            store.set_kanoodle_game(game);

            true
        }

        fn get_game_state(
            self: @ContractState, game_id: u32, player: ContractAddress,
        ) -> KanoodleGame {
            let mut store = StoreTrait::new(self.world(@"kanoodle_fusion"));
            store.get_kanoodle_game(game_id)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Check if the current solution matches the level's target solution
        /// Returns true if solved, false otherwise
        fn check_solution(
            ref self: ContractState,
            ref store: crate::store::Store,
            game_id: u32,
            player: ContractAddress
        ) -> bool {
            let game = store.get_kanoodle_game(game_id);

            // Get level configuration
            let level = crate::models::get_level(game.level_id);

            // Compare current_solution with level.solution
            // Both are 16-cell arrays (4x4 board)
            let mut is_solved = true;
            if game.current_solution.len() != level.solution.len() {
                is_solved = false;
            } else {
                let mut i = 0;
                loop {
                    if i >= 16 {
                        break;
                    }
                    if *game.current_solution.at(i) != *level.solution.at(i) {
                        is_solved = false;
                        break;
                    }
                    i += 1;
                };
            }

            if is_solved {
                // Calculate moves (number of pieces placed)
                let moves = game.placed_piece_ids.len();

                // Emit event
                self.emit(GameSolved { game_id, player, moves: moves });

                // Advance to next level if not at max level (50)
                if game.level_id < 50 {
                    let mut updated_game = game;
                    updated_game.level_id += 1;
                    // Reset the board for the new level
                    let empty_solution = array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    updated_game.current_solution = empty_solution.span();
                    updated_game.placed_piece_ids = array![].span();
                    store.set_kanoodle_game(updated_game);

                    // Clear all placed pieces
                    let mut piece_id: u8 = 1;
                    loop {
                        if piece_id > 13 {
                            break;
                        }
                        store.delete_placed_piece(game_id, player, piece_id);
                        piece_id += 1;
                    }
                }
            }

            is_solved
        }
    }
}
