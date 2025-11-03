use starknet::ContractAddress;


pub mod piece {
    pub const ID_1: u8 = 1;
    pub const ID_2: u8 = 2;
    pub const ID_3: u8 = 3;
    pub const ID_4: u8 = 4;
    pub const ID_5: u8 = 5;
    pub const ID_6: u8 = 6;
    pub const ID_7: u8 = 7;
    pub const ID_8: u8 = 8;
    pub const ID_9: u8 = 9;
    pub const ID_10: u8 = 10;
    pub const ID_11: u8 = 11;
    pub const ID_12: u8 = 12;
    pub const ID_13: u8 = 13;
}

// Kanoodle Fusion Game Models
// Colors represented as u8 for efficiency
pub mod colors {
    pub const EMPTY: u8 = 0;
    pub const RED: u8 = 1;
    pub const YELLOW: u8 = 2;
    pub const BLUE: u8 = 3;
    pub const GREEN: u8 = 4; // Secondary: Yellow + Blue
    pub const ORANGE: u8 = 5; // Secondary: Red + Yellow
    pub const PURPLE: u8 = 6; // Secondary: Red + Blue
    pub const NEUTRAL: u8 = 7; // Neutral pieces (no color mixing)
}

// Rotation constants: 0=0°, 1=90°, 2=180°, 3=270°
pub mod rotations {
    pub const DEG_0: u8 = 0;
    pub const DEG_90: u8 = 1;
    pub const DEG_180: u8 = 2;
    pub const DEG_270: u8 = 3;
}

// Flip constants: false=normal, true=flipped
pub const FLIP_NORMAL: bool = false;
pub const FLIP_MIRROR: bool = true;

#[derive(Copy, Drop, Serde, Debug, PartialEq)]
pub struct PieceCell {
    pub x: u8, // Relative position within piece
    pub y: u8, // Relative position within piece
    pub color: u8,
}

// A piece definition with relative coordinates
// Max 4 cells per piece, stored as individual fields
// NOT stored in blockchain - retrieved from constant function
#[derive(Copy, Drop, Serde)]
pub struct GamePiece {
    pub piece_id: u8,
    pub size: u8, // Number of cells in the piece (1-4)
    // Cell 0
    pub x0: u8,
    pub y0: u8,
    pub color0: u8,
    // Cell 1
    pub x1: u8,
    pub y1: u8,
    pub color1: u8,
    // Cell 2
    pub x2: u8,
    pub y2: u8,
    pub color2: u8,
    // Cell 3
    pub x3: u8,
    pub y3: u8,
    pub color3: u8,
}

// Level definition
#[derive(Copy, Drop, Serde)]
pub struct Level {
    pub level_id: u8,
    pub solution: Span<u8>, // 16 cells (4x4) with final colors
    pub allowed_pieces: Span<u8> // List of piece IDs allowed for this level
}

// Constant function to get level data
// Returns level configuration with solution and allowed pieces
pub fn get_level(level_id: u8) -> Level {
    if level_id == 1 {
        Level {
            level_id: 1,
            solution: array![
                colors::RED, colors::BLUE, colors::BLUE, colors::NEUTRAL, colors::RED, colors::RED,
                colors::PURPLE, colors::BLUE, colors::RED, colors::RED, colors::NEUTRAL,
                colors::NEUTRAL, colors::PURPLE, colors::PURPLE, colors::BLUE, colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_4, piece::ID_6, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 2 {
        Level {
            level_id: 2,
            solution: array![
                colors::RED, colors::RED, colors::RED, colors::BLUE, colors::RED, colors::BLUE,
                colors::RED, colors::BLUE, colors::RED, colors::BLUE, colors::PURPLE, colors::BLUE,
                colors::NEUTRAL, colors::NEUTRAL, colors::PURPLE, colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 3 {
        Level {
            level_id: 3,
            solution: array![
                colors::RED, colors::RED, colors::RED, colors::YELLOW, colors::RED, colors::RED,
                colors::RED, colors::ORANGE, colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL,
                colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 4 {
        Level {
            level_id: 4,
            solution: array![
                colors::BLUE, colors::GREEN, colors::BLUE, colors::BLUE, colors::RED,
                colors::YELLOW, colors::YELLOW, colors::BLUE, colors::RED, colors::YELLOW,
                colors::YELLOW, colors::BLUE, colors::RED, colors::RED, colors::BLUE,
                colors::NEUTRAL,
            ]
                .span(),
            allowed_pieces: array![piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_11]
                .span(),
        }
    } else if level_id == 5 {
        Level {
            level_id: 5,
            solution: array![
                colors::YELLOW, colors::NEUTRAL, colors::NEUTRAL, colors::RED, colors::YELLOW,
                colors::ORANGE, colors::RED, colors::RED, colors::YELLOW, colors::NEUTRAL,
                colors::RED, colors::RED, colors::YELLOW, colors::YELLOW, colors::ORANGE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 6 {
        Level {
            level_id: 6,
            solution: array![
                colors::BLUE, colors::BLUE, colors::BLUE, colors::BLUE, colors::RED, colors::PURPLE,
                colors::RED, colors::RED, colors::BLUE, colors::BLUE, colors::NEUTRAL,
                colors::NEUTRAL, colors::GREEN, colors::YELLOW, colors::YELLOW, colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_3, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 7 {
        Level {
            level_id: 7,
            solution: array![
                colors::NEUTRAL, colors::BLUE, colors::YELLOW, colors::NEUTRAL, colors::BLUE,
                colors::BLUE, colors::YELLOW, colors::YELLOW, colors::BLUE, colors::RED,
                colors::ORANGE, colors::RED, colors::BLUE, colors::PURPLE, colors::BLUE,
                colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 8 {
        Level {
            level_id: 8,
            solution: array![
                colors::BLUE, colors::GREEN, colors::BLUE, colors::RED, colors::BLUE,
                colors::YELLOW, colors::GREEN, colors::PURPLE, colors::BLUE, colors::YELLOW,
                colors::NEUTRAL, colors::RED, colors::BLUE, colors::NEUTRAL, colors::NEUTRAL,
                colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_10, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 9 {
        Level {
            level_id: 9,
            solution: array![
                colors::NEUTRAL, colors::BLUE, colors::PURPLE, colors::RED, colors::BLUE,
                colors::BLUE, colors::NEUTRAL, colors::RED, colors::YELLOW, colors::YELLOW,
                colors::YELLOW, colors::ORANGE, colors::RED, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 10 {
        Level {
            level_id: 10,
            solution: array![
                colors::BLUE, colors::NEUTRAL, colors::RED, colors::PURPLE, colors::BLUE,
                colors::BLUE, colors::RED, colors::BLUE, colors::NEUTRAL, colors::BLUE, colors::RED,
                colors::BLUE, colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::GREEN,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 11 {
        Level {
            level_id: 11,
            solution: array![
                colors::NEUTRAL, colors::YELLOW, colors::YELLOW, colors::ORANGE, colors::NEUTRAL,
                colors::NEUTRAL, colors::YELLOW, colors::RED, colors::PURPLE, colors::BLUE,
                colors::BLUE, colors::PURPLE, colors::RED, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 12 {
        Level {
            level_id: 12,
            solution: array![
                colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL, colors::RED, colors::YELLOW,
                colors::YELLOW, colors::ORANGE, colors::RED, colors::RED, colors::RED, colors::RED,
                colors::RED, colors::BLUE, colors::BLUE, colors::BLUE, colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 13 {
        Level {
            level_id: 13,
            solution: array![
                colors::RED, colors::PURPLE, colors::RED, colors::ORANGE, colors::RED, colors::BLUE,
                colors::YELLOW, colors::ORANGE, colors::NEUTRAL, colors::BLUE, colors::NEUTRAL,
                colors::ORANGE, colors::YELLOW, colors::GREEN, colors::YELLOW, colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 14 {
        Level {
            level_id: 14,
            solution: array![
                colors::NEUTRAL, colors::YELLOW, colors::BLUE, colors::NEUTRAL, colors::RED,
                colors::ORANGE, colors::GREEN, colors::BLUE, colors::RED, colors::YELLOW,
                colors::NEUTRAL, colors::BLUE, colors::ORANGE, colors::YELLOW, colors::YELLOW,
                colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 15 {
        Level {
            level_id: 15,
            solution: array![
                colors::RED, colors::YELLOW, colors::RED, colors::RED, colors::RED, colors::GREEN,
                colors::GREEN, colors::RED, colors::RED, colors::YELLOW, colors::BLUE,
                colors::PURPLE, colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10]
                .span(),
        }
    } else if level_id == 16 {
        Level {
            level_id: 16,
            solution: array![
                colors::YELLOW, colors::BLUE, colors::RED, colors::RED, colors::YELLOW,
                colors::GREEN, colors::RED, colors::RED, colors::YELLOW, colors::BLUE,
                colors::PURPLE, colors::RED, colors::BLUE, colors::BLUE, colors::RED,
                colors::NEUTRAL,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 17 {
        Level {
            level_id: 17,
            solution: array![
                colors::NEUTRAL, colors::PURPLE, colors::RED, colors::ORANGE, colors::YELLOW,
                colors::PURPLE, colors::NEUTRAL, colors::YELLOW, colors::YELLOW, colors::GREEN,
                colors::BLUE, colors::GREEN, colors::YELLOW, colors::BLUE, colors::BLUE,
                colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 18 {
        Level {
            level_id: 18,
            solution: array![
                colors::PURPLE, colors::GREEN, colors::RED, colors::RED, colors::RED, colors::GREEN,
                colors::BLUE, colors::ORANGE, colors::RED, colors::YELLOW, colors::YELLOW,
                colors::ORANGE, colors::PURPLE, colors::GREEN, colors::BLUE, colors::GREEN,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10,
            ]
                .span(),
        }
    } else if level_id == 19 {
        Level {
            level_id: 19,
            solution: array![
                colors::NEUTRAL, colors::NEUTRAL, colors::GREEN, colors::NEUTRAL, colors::BLUE,
                colors::GREEN, colors::GREEN, colors::GREEN, colors::YELLOW, colors::GREEN,
                colors::BLUE, colors::GREEN, colors::YELLOW, colors::YELLOW, colors::YELLOW,
                colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 20 {
        Level {
            level_id: 20,
            solution: array![
                colors::NEUTRAL, colors::GREEN, colors::GREEN, colors::NEUTRAL, colors::GREEN,
                colors::GREEN, colors::GREEN, colors::GREEN, colors::BLUE, colors::YELLOW,
                colors::NEUTRAL, colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN,
                colors::GREEN,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11,
                piece::ID_12, piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 21 {
        Level {
            level_id: 21,
            solution: array![
                colors::YELLOW, colors::NEUTRAL, colors::NEUTRAL, colors::RED, colors::YELLOW,
                colors::ORANGE, colors::ORANGE, colors::RED, colors::ORANGE, colors::ORANGE,
                colors::NEUTRAL, colors::RED, colors::ORANGE, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_7, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 22 {
        Level {
            level_id: 22,
            solution: array![
                colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::NEUTRAL, colors::RED,
                colors::ORANGE, colors::ORANGE, colors::NEUTRAL, colors::RED, colors::RED,
                colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::YELLOW, colors::YELLOW,
                colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 23 {
        Level {
            level_id: 23,
            solution: array![
                colors::NEUTRAL, colors::BLUE, colors::BLUE, colors::NEUTRAL, colors::RED,
                colors::RED, colors::PURPLE, colors::BLUE, colors::BLUE, colors::BLUE,
                colors::PURPLE, colors::BLUE, colors::NEUTRAL, colors::PURPLE, colors::PURPLE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_9, piece::ID_11, piece::ID_12,
                piece::ID_13,
            ]
                .span(),
        }
    } else if level_id == 24 {
        Level {
            level_id: 24,
            solution: array![
                colors::RED, colors::BLUE, colors::RED, colors::PURPLE, colors::PURPLE,
                colors::BLUE, colors::RED, colors::PURPLE, colors::PURPLE, colors::RED, colors::RED,
                colors::PURPLE, colors::PURPLE, colors::BLUE, colors::BLUE, colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_9]
                .span(),
        }
    } else if level_id == 25 {
        Level {
            level_id: 25,
            solution: array![
                colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL, colors::BLUE, colors::PURPLE,
                colors::ORANGE, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::ORANGE,
                colors::BLUE, colors::ORANGE, colors::PURPLE, colors::YELLOW, colors::ORANGE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_7, piece::ID_9, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 26 {
        Level {
            level_id: 26,
            solution: array![
                colors::BLUE, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE,
                colors::YELLOW, colors::YELLOW, colors::ORANGE, colors::PURPLE, colors::NEUTRAL,
                colors::YELLOW, colors::ORANGE, colors::PURPLE, colors::NEUTRAL, colors::ORANGE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_6, piece::ID_10, piece::ID_7, piece::ID_9, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 27 {
        Level {
            level_id: 27,
            solution: array![
                colors::RED, colors::ORANGE, colors::GREEN, colors::GREEN, colors::RED,
                colors::BLUE, colors::GREEN, colors::NEUTRAL, colors::RED, colors::GREEN,
                colors::GREEN, colors::ORANGE, colors::GREEN, colors::GREEN, colors::ORANGE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_7, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 28 {
        Level {
            level_id: 28,
            solution: array![
                colors::RED, colors::GREEN, colors::ORANGE, colors::ORANGE, colors::ORANGE,
                colors::GREEN, colors::GREEN, colors::ORANGE, colors::ORANGE, colors::ORANGE,
                colors::GREEN, colors::NEUTRAL, colors::GREEN, colors::BLUE, colors::BLUE,
                colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_7, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 29 {
        Level {
            level_id: 29,
            solution: array![
                colors::PURPLE, colors::YELLOW, colors::GREEN, colors::YELLOW, colors::PURPLE,
                colors::NEUTRAL, colors::GREEN, colors::PURPLE, colors::PURPLE, colors::GREEN,
                colors::GREEN, colors::PURPLE, colors::GREEN, colors::GREEN, colors::RED,
                colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_2, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 30 {
        Level {
            level_id: 30,
            solution: array![
                colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::GREEN, colors::RED,
                colors::GREEN, colors::YELLOW, colors::YELLOW, colors::GREEN, colors::GREEN,
                colors::NEUTRAL, colors::YELLOW, colors::GREEN, colors::PURPLE, colors::PURPLE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_9, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 31 {
        Level {
            level_id: 31,
            solution: array![
                colors::PURPLE, colors::ORANGE, colors::ORANGE, colors::GREEN, colors::PURPLE,
                colors::ORANGE, colors::GREEN, colors::GREEN, colors::PURPLE, colors::ORANGE,
                colors::GREEN, colors::YELLOW, colors::YELLOW, colors::RED, colors::ORANGE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10,
                piece::ID_7,
            ]
                .span(),
        }
    } else if level_id == 32 {
        Level {
            level_id: 32,
            solution: array![
                colors::YELLOW, colors::NEUTRAL, colors::ORANGE, colors::ORANGE, colors::ORANGE,
                colors::ORANGE, colors::RED, colors::ORANGE, colors::ORANGE, colors::PURPLE,
                colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_7, piece::ID_9,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 33 {
        Level {
            level_id: 33,
            solution: array![
                colors::ORANGE, colors::BLUE, colors::BLUE, colors::NEUTRAL, colors::ORANGE,
                colors::ORANGE, colors::GREEN, colors::BLUE, colors::ORANGE, colors::YELLOW,
                colors::YELLOW, colors::YELLOW, colors::RED, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 34 {
        Level {
            level_id: 34,
            solution: array![
                colors::PURPLE, colors::YELLOW, colors::BLUE, colors::RED, colors::PURPLE,
                colors::YELLOW, colors::GREEN, colors::PURPLE, colors::PURPLE, colors::YELLOW,
                colors::RED, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_9,
            ]
                .span(),
        }
    } else if level_id == 35 {
        Level {
            level_id: 35,
            solution: array![
                colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::RED,
                colors::YELLOW, colors::ORANGE, colors::ORANGE, colors::NEUTRAL, colors::ORANGE,
                colors::ORANGE, colors::ORANGE, colors::PURPLE, colors::PURPLE, colors::PURPLE,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_9,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 36 {
        Level {
            level_id: 36,
            solution: array![
                colors::BLUE, colors::NEUTRAL, colors::GREEN, colors::NEUTRAL, colors::BLUE,
                colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN,
                colors::GREEN, colors::GREEN, colors::GREEN, colors::YELLOW, colors::GREEN,
                colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11,
                piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 37 {
        Level {
            level_id: 37,
            solution: array![
                colors::BLUE, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE,
                colors::NEUTRAL, colors::PURPLE, colors::RED, colors::PURPLE, colors::ORANGE,
                colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::ORANGE, colors::ORANGE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_7, piece::ID_9,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 38 {
        Level {
            level_id: 38,
            solution: array![
                colors::BLUE, colors::GREEN, colors::BLUE, colors::RED, colors::YELLOW,
                colors::GREEN, colors::GREEN, colors::RED, colors::RED, colors::YELLOW, colors::RED,
                colors::RED, colors::RED, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_8]
                .span(),
        }
    } else if level_id == 39 {
        Level {
            level_id: 39,
            solution: array![
                colors::NEUTRAL, colors::BLUE, colors::PURPLE, colors::RED, colors::GREEN,
                colors::BLUE, colors::YELLOW, colors::RED, colors::GREEN, colors::YELLOW,
                colors::RED, colors::RED, colors::ORANGE, colors::RED, colors::RED, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_8, piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 40 {
        Level {
            level_id: 40,
            solution: array![
                colors::PURPLE, colors::BLUE, colors::BLUE, colors::GREEN, colors::ORANGE,
                colors::BLUE, colors::GREEN, colors::ORANGE, colors::ORANGE, colors::GREEN,
                colors::BLUE, colors::ORANGE, colors::ORANGE, colors::PURPLE, colors::RED,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10,
                piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 41 {
        Level {
            level_id: 41,
            solution: array![
                colors::RED, colors::RED, colors::ORANGE, colors::PURPLE, colors::RED, colors::RED,
                colors::RED, colors::YELLOW, colors::BLUE, colors::BLUE, colors::GREEN,
                colors::GREEN, colors::YELLOW, colors::PURPLE, colors::PURPLE, colors::YELLOW,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10,
                piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 42 {
        Level {
            level_id: 42,
            solution: array![
                colors::YELLOW, colors::ORANGE, colors::ORANGE, colors::YELLOW, colors::ORANGE,
                colors::YELLOW, colors::ORANGE, colors::YELLOW, colors::ORANGE, colors::BLUE,
                colors::YELLOW, colors::ORANGE, colors::RED, colors::RED, colors::RED,
                colors::ORANGE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 43 {
        Level {
            level_id: 43,
            solution: array![
                colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::RED,
                colors::YELLOW, colors::GREEN, colors::NEUTRAL, colors::RED, colors::GREEN,
                colors::GREEN, colors::YELLOW, colors::RED, colors::RED, colors::PURPLE,
                colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_8,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 44 {
        Level {
            level_id: 44,
            solution: array![
                colors::GREEN, colors::BLUE, colors::YELLOW, colors::RED, colors::ORANGE,
                colors::GREEN, colors::GREEN, colors::YELLOW, colors::ORANGE, colors::GREEN,
                colors::GREEN, colors::BLUE, colors::ORANGE, colors::RED, colors::GREEN,
                colors::GREEN,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 45 {
        Level {
            level_id: 45,
            solution: array![
                colors::PURPLE, colors::ORANGE, colors::BLUE, colors::BLUE, colors::PURPLE,
                colors::GREEN, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::YELLOW,
                colors::YELLOW, colors::PURPLE, colors::GREEN, colors::YELLOW, colors::GREEN,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_9,
                piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 46 {
        Level {
            level_id: 46,
            solution: array![
                colors::PURPLE, colors::NEUTRAL, colors::PURPLE, colors::PURPLE, colors::GREEN,
                colors::BLUE, colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::GREEN,
                colors::PURPLE, colors::PURPLE, colors::ORANGE, colors::ORANGE, colors::ORANGE,
                colors::PURPLE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_9,
                piece::ID_8, piece::ID_12,
            ]
                .span(),
        }
    } else if level_id == 47 {
        Level {
            level_id: 47,
            solution: array![
                colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::BLUE, colors::PURPLE,
                colors::RED, colors::ORANGE, colors::BLUE, colors::PURPLE, colors::GREEN,
                colors::GREEN, colors::YELLOW, colors::PURPLE, colors::NEUTRAL, colors::GREEN,
                colors::BLUE,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_9, piece::ID_8,
                piece::ID_11,
            ]
                .span(),
        }
    } else if level_id == 48 {
        Level {
            level_id: 48,
            solution: array![
                colors::PURPLE, colors::BLUE, colors::PURPLE, colors::RED, colors::PURPLE,
                colors::ORANGE, colors::BLUE, colors::PURPLE, colors::PURPLE, colors::ORANGE,
                colors::ORANGE, colors::RED, colors::PURPLE, colors::ORANGE, colors::RED,
                colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_7, piece::ID_9, piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 49 {
        Level {
            level_id: 49,
            solution: array![
                colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::BLUE, colors::ORANGE,
                colors::ORANGE, colors::ORANGE, colors::BLUE, colors::ORANGE, colors::RED,
                colors::YELLOW, colors::BLUE, colors::ORANGE, colors::ORANGE, colors::ORANGE,
                colors::GREEN,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7,
                piece::ID_8,
            ]
                .span(),
        }
    } else if level_id == 50 {
        Level {
            level_id: 50,
            solution: array![
                colors::RED, colors::RED, colors::BLUE, colors::BLUE, colors::PURPLE, colors::BLUE,
                colors::BLUE, colors::BLUE, colors::ORANGE, colors::YELLOW, colors::YELLOW,
                colors::YELLOW, colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::RED,
            ]
                .span(),
            allowed_pieces: array![
                piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10,
                piece::ID_8,
            ]
                .span(),
        }
    } else {
        // Default/invalid level - return empty
        Level {
            level_id: 0,
            solution: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].span(),
            allowed_pieces: array![].span(),
        }
    }
}

// Constant function to get piece definitions - no blockchain storage needed
// Piece IDs: 1-13
pub fn get_piece_definition(piece_id: u8) -> GamePiece {
    if piece_id == piece::ID_1 {
        // Piece 1: Straight 4-cell blue
        GamePiece {
            piece_id: piece::ID_1,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::BLUE,
            x1: 0,
            y1: 1,
            color1: colors::BLUE,
            x2: 0,
            y2: 2,
            color2: colors::BLUE,
            x3: 0,
            y3: 3,
            color3: colors::BLUE,
        }
    } else if piece_id == piece::ID_2 {
        // Piece 2: Straight 4-cell red
        GamePiece {
            piece_id: piece::ID_2,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::RED,
            x1: 0,
            y1: 1,
            color1: colors::RED,
            x2: 0,
            y2: 2,
            color2: colors::RED,
            x3: 0,
            y3: 3,
            color3: colors::RED,
        }
    } else if piece_id == piece::ID_3 {
        // Piece 3: Straight 4-cell yellow
        GamePiece {
            piece_id: piece::ID_3,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::YELLOW,
            x1: 0,
            y1: 1,
            color1: colors::YELLOW,
            x2: 0,
            y2: 2,
            color2: colors::YELLOW,
            x3: 0,
            y3: 3,
            color3: colors::YELLOW,
        }
    } else if piece_id == piece::ID_4 {
        // Piece 4: Z 4-cell blue
        GamePiece {
            piece_id: piece::ID_4,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::BLUE,
            x1: 0,
            y1: 1,
            color1: colors::BLUE,
            x2: 1,
            y2: 1,
            color2: colors::BLUE,
            x3: 1,
            y3: 2,
            color3: colors::BLUE,
        }
    } else if piece_id == piece::ID_5 {
        // Piece 5: Z 4-cell green
        GamePiece {
            piece_id: piece::ID_5,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::GREEN,
            x1: 0,
            y1: 1,
            color1: colors::GREEN,
            x2: 1,
            y2: 1,
            color2: colors::GREEN,
            x3: 1,
            y3: 2,
            color3: colors::GREEN,
        }
    } else if piece_id == piece::ID_6 {
        // Piece 6: L 4-cell red
        GamePiece {
            piece_id: piece::ID_6,
            size: 4,
            x0: 0,
            y0: 0,
            color0: colors::RED,
            x1: 0,
            y1: 1,
            color1: colors::RED,
            x2: 0,
            y2: 2,
            color2: colors::RED,
            x3: 1,
            y3: 0,
            color3: colors::RED,
        }
    } else if piece_id == piece::ID_7 {
        // Piece 7: Elbow 3-cell orange
        GamePiece {
            piece_id: piece::ID_7,
            size: 3,
            x0: 1,
            y0: 0,
            color0: colors::ORANGE,
            x1: 0,
            y1: 1,
            color1: colors::ORANGE,
            x2: 1,
            y2: 1,
            color2: colors::ORANGE,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    } else if piece_id == piece::ID_8 {
        // Piece 8: Straight 3-cell multicolor
        GamePiece {
            piece_id: piece::ID_8,
            size: 3,
            x0: 0,
            y0: 0,
            color0: colors::RED,
            x1: 0,
            y1: 1,
            color1: colors::YELLOW,
            x2: 0,
            y2: 2,
            color2: colors::BLUE,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    } else if piece_id == piece::ID_9 {
        // Piece 9: Straight 3-cell purple
        GamePiece {
            piece_id: piece::ID_9,
            size: 3,
            x0: 0,
            y0: 0,
            color0: colors::PURPLE,
            x1: 0,
            y1: 1,
            color1: colors::PURPLE,
            x2: 0,
            y2: 2,
            color2: colors::PURPLE,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    } else if piece_id == piece::ID_10 {
        // Piece 10: T 4-cell yellow
        GamePiece {
            piece_id: piece::ID_10,
            size: 4,
            x0: 0,
            y0: 1,
            color0: colors::YELLOW,
            x1: 1,
            y1: 0,
            color1: colors::YELLOW,
            x2: 1,
            y2: 1,
            color2: colors::YELLOW,
            x3: 2,
            y3: 1,
            color3: colors::YELLOW,
        }
    } else if piece_id == piece::ID_11 {
        // Piece 11: Single neutral cell
        GamePiece {
            piece_id: piece::ID_11,
            size: 1,
            x0: 0,
            y0: 0,
            color0: colors::NEUTRAL,
            x1: 0,
            y1: 0,
            color1: 0,
            x2: 0,
            y2: 0,
            color2: 0,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    } else if piece_id == piece::ID_12 {
        // Piece 12: Single neutral cell
        GamePiece {
            piece_id: piece::ID_12,
            size: 1,
            x0: 0,
            y0: 0,
            color0: colors::NEUTRAL,
            x1: 0,
            y1: 0,
            color1: 0,
            x2: 0,
            y2: 0,
            color2: 0,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    } else {
        // Piece 13: Single neutral cell
        GamePiece {
            piece_id: piece::ID_13,
            size: 1,
            x0: 0,
            y0: 0,
            color0: colors::NEUTRAL,
            x1: 0,
            y1: 0,
            color1: 0,
            x2: 0,
            y2: 0,
            color2: 0,
            x3: 0,
            y3: 0,
            color3: 0,
        }
    }
}

// Store each placed piece as a separate model
#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GamePlacedPiece {
    #[key]
    pub game_id: u32,
    #[key]
    pub player: ContractAddress,
    #[key]
    pub piece_id: u8,
    pub x: u8,
    pub y: u8,
    pub rotation: u8,
    pub flipped: bool,
}

// Main game state
#[derive(Drop, Serde)]
#[dojo::model]
pub struct KanoodleGame {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub level_id: u8, // References the level (use get_level() to get solution and allowed pieces)
    pub current_solution: Span<u8>, // 16 cells (4x4) with current colors after mixing
    pub placed_piece_ids: Span<u8>, // List of piece IDs that have been placed
}
