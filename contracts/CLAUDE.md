# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kanoodle Fusion is a blockchain-based puzzle game built on Starknet using the Dojo framework. It implements a digital version of the Kanoodle Fusion physical puzzle game where players place translucent colored pieces on a 4x4 grid. Pieces stack and their colors mix additively to create secondary colors, matching a target pattern.

### Game Mechanics

- **Board**: 4x4 grid where each cell can have a stack of colors
- **Pieces**: 13 polyomino-style pieces (10 colored translucent, 3 neutral)
  - Pieces 0-2: Straight 4-cell pieces (blue, red, yellow)
  - Pieces 3-4: Z-shaped 4-cell pieces (blue, green)
  - Piece 5: L-shaped 4-cell piece (red)
  - Piece 6: 3-cell elbow piece (orange)
  - Piece 7: 3-cell multicolor straight piece (blue, yellow, red)
  - Piece 8: 3-cell straight piece (purple)
  - Piece 9: T-shaped 4-cell piece (yellow)
  - Pieces 10-12: Single neutral cells
- **Transformations**: Pieces can be rotated (0°, 90°, 180°, 270°) and flipped
- **Color Mixing**: Additive color mixing for translucent pieces
  - Red + Yellow = Orange
  - Red + Blue = Purple
  - Yellow + Blue = Green
  - All three primaries = muddy/undefined (EMPTY)
  - Neutral pieces don't mix colors

### Color Representation

Colors are represented as `u8` constants:
- 0 = EMPTY
- 1 = RED
- 2 = YELLOW
- 3 = BLUE
- 4 = GREEN (secondary)
- 5 = ORANGE (secondary)
- 6 = PURPLE (secondary)
- 7 = NEUTRAL

## Technology Stack

- **Language**: Cairo 2.12.2
- **Framework**: Dojo 1.7.0 (Starknet game engine)
- **Build Tool**: Scarb (Cairo package manager)
- **Blockchain**: Starknet (deployment via Sozo)

## Common Commands

### Build and Development
```bash
# Format and build the project
make build

# Or manually:
scarb fmt && sozo build

# Build with profile
sozo -P <profile> build

# Inspect contracts
sozo -P <profile> inspect
```

### Local Development
```bash
# Start local Katana node (Starknet devnet)
make katana

# Manually:
katana --dev --dev.no-fee --http.cors_origins "*"
```

### Deployment
```bash
# Deploy to environment (dev, slot, testnet, mainnet)
make setup PROFILE=dev

# Or using script directly:
./scripts/setup.sh dev

# Full deployment flow:
# 1. Cleans target/ and Scarb.lock
# 2. Removes manifest_<profile>.json
# 3. Builds, inspects, and migrates contracts
```

### Testing
Tests are currently pending implementation. The removed test files were:
- `src/tests/test_lives_system.cairo`
- `src/tests/test_pack_trait.cairo`
- `src/tests/test_world.cairo`

When implementing tests, use:
```bash
# Run tests
scarb test

# Or with Dojo testing
sozo test
```

## Architecture

### Core System: kanoodle_fusion_system

The main contract ([src/systems/kanoodle_fusion_system.cairo](src/systems/kanoodle_fusion_system.cairo)) implements all game logic:

**Key Functions:**
- `initialize_pieces()`: Sets up the 13 piece definitions (admin only)
- `start_game(player, target_board)`: Creates new game with target pattern
- `place_piece(game_id, player, piece_id, x, y, rotation, flipped)`: Places piece on board
- `remove_piece(game_id, player, piece_id)`: Removes piece and rebuilds board
- `check_solution(game_id, player)`: Validates if current board matches target
- `get_game_state(game_id, player)`: Returns current game state
- `get_player_stats(player)`: Returns player statistics
- `get_piece_definition(piece_id)`: Returns piece shape and colors

**Internal Implementation:**
- Piece transformation logic handles rotation and flipping with normalization
- Color mixing logic implements additive color theory
- Board state is rebuilt from scratch when pieces are removed (no undo stack)
- Each cell maintains a stack of colors for proper mixing calculation

### Data Models

Defined in [src/models.cairo](src/models.cairo):

- `GamePiece`: Piece definitions with relative cell coordinates
- `PlacedPiece`: Tracks piece position, rotation, and flip state
- `KanoodleGame`: Complete game state including board stacks and target
- `GameStats`: Player statistics (games played, solved, best moves)
- `PieceCell`: Individual cell with relative position and color

### Store Layer

The store ([src/store.cairo](src/store.cairo)) provides abstraction over Dojo's world storage:
- Uses Dojo's `WorldStorage` and `ModelStorage`
- Provides typed getters/setters for all models
- Integrates with external profile system from `jokers_of_neon_lib`

### Configuration

**Profiles** (defined in `dojo_*.toml` files):
- `dev`: Local Katana development (localhost:5050)
- `slot`: Slot network configuration
- Additional profiles were removed: testnet, mainnet

**Build Configuration** ([Scarb.toml](Scarb.toml)):
- Cairo 2.12.2 with edition 2024_07
- Dojo 1.7.0 dependencies
- OpenZeppelin for access control
- Custom build scripts for migration

## Important Patterns

### Working with Spans and Arrays
Cairo uses immutable `Span<T>` for array-like data. When modifying:
1. Create mutable `array![]`
2. Copy existing elements from span
3. Modify as needed
4. Convert back to `.span()`

Example from `place_piece`:
```cairo
let mut new_placed = array![];
let mut i = 0;
loop {
    if i >= game.placed_pieces.len() { break; }
    new_placed.append(*game.placed_pieces.at(i));
    i += 1;
};
new_placed.append(PlacedPiece { /* new piece */ });
game.placed_pieces = new_placed.span();
```

### Access Control
The system uses OpenZeppelin's AccessControl component:
- `DEFAULT_ADMIN_ROLE` is granted to contract deployer in constructor
- `initialize_pieces()` requires admin role via `assert_only_role()`

### Event Emission
Key events for off-chain tracking:
- `GameStarted`: New game creation
- `PiecePlaced`: Piece placement with full transformation data
- `PieceRemoved`: Piece removal
- `GameSolved`: Successful puzzle completion with move count

## Recent Changes

Based on git status, the codebase recently underwent significant refactoring:
- Removed season, lives, pack, profile, and XP systems (previous game mechanics)
- Simplified to pure Kanoodle Fusion gameplay
- Removed mainnet/testnet configurations
- Removed item and pack constants
- Cleaned up test files

The system is now focused solely on the puzzle game mechanics without metagame systems.

## External Dependencies

The store imports `jokers_of_neon_lib::models::external::profile::{PlayerStats, Profile}` but these are not actively used in the current game logic. This suggests potential future integration with a larger game ecosystem.
