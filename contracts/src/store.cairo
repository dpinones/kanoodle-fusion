use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use starknet::ContractAddress;
use crate::models::{GamePlacedPiece, GameStats, KanoodleGame};

#[derive(Drop)]
pub struct Store {
    world: WorldStorage,
}

#[generate_trait]
pub impl StoreImpl of StoreTrait {
    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    fn get_kanoodle_game(ref self: Store, game_id: u32, player: ContractAddress) -> KanoodleGame {
        self.world.read_model((game_id, player))
    }

    fn set_kanoodle_game(ref self: Store, game: KanoodleGame) {
        self.world.write_model(@game)
    }

    fn get_game_stats(ref self: Store, player: ContractAddress) -> GameStats {
        self.world.read_model(player)
    }

    fn set_game_stats(ref self: Store, stats: GameStats) {
        self.world.write_model(@stats)
    }

    fn get_placed_piece(
        ref self: Store, game_id: u32, player: ContractAddress, piece_id: u8,
    ) -> GamePlacedPiece {
        self.world.read_model((game_id, player, piece_id))
    }

    fn set_placed_piece(ref self: Store, placed: GamePlacedPiece) {
        self.world.write_model(@placed)
    }

    fn delete_placed_piece(ref self: Store, game_id: u32, player: ContractAddress, piece_id: u8) {
        // Set piece as not placed (x=255 as a marker)
        let empty_piece = GamePlacedPiece {
            game_id, player, piece_id, x: 255, y: 255, rotation: 0, flipped: false,
        };
        self.world.write_model(@empty_piece)
    }
}
