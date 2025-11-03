# Kanoodle Fusion

### Submission Track
Fully Onchain Game

### Project Summary
Kanoodle Fusion is a blockchain-based puzzle game built on Starknet using the Dojo framework. Players solve color-mixing puzzles by placing translucent polyomino pieces on a 4x4 grid, where colors stack and blend additively to match target patterns. The game features 50 progressively challenging levels, with all game state and logic stored on-chain.

The game implements a unique color-mixing mechanic where primary colors (red, yellow, blue) combine to create secondary colors (orange, green, purple), creating an engaging puzzle experience that requires both spatial reasoning and color theory understanding.

### GitHub
https://github.com/damianalejandropinones/kanoodle-fusion

### Play
[Deployment URL - To be added after deployment]

### Twitter
[@damianalejandropinones](https://x.com/damianalejandropinones)

### Team Members
- Damian Alejandro Pinones - [@damianalejandropinones](https://x.com/damianalejandropinones)

---

## Game Features

- **50 Unique Levels**: Progressively challenging puzzles from beginner to expert
- **Color Mixing Mechanics**: Additive RGB color blending system
- **13 Different Pieces**: Various polyomino shapes with different colors
- **Piece Transformations**: Rotate (0°, 90°, 180°, 270°) and flip pieces
- **Drag & Drop Interface**: Intuitive piece placement with visual preview
- **Undo & Clear**: Experiment freely with non-destructive gameplay
- **Multi-language Support**: English, Spanish, and Japanese
- **Colorblind Mode**: Accessibility features with symbols for colors
- **Commodore 64 Aesthetic**: Retro pixel-perfect design with CRT effects

## Technology Stack

### Contracts
- **Language**: Cairo 2.12.2
- **Framework**: Dojo 1.7.0
- **Blockchain**: Starknet
- **Build Tool**: Scarb

### Frontend
- **Framework**: Vite 7.1.9 + React 19.2.0 + TypeScript 5.9.3
- **Package Manager**: pnpm
- **Wallet Integration**: Cartridge Controller
- **Starknet Integration**: starknet-react + starknet.js
- **Styling**: Tailwind CSS 4.1.14

## How to Play

1. **Connect Your Wallet**: Use Cartridge Controller to authenticate
2. **Select a Level**: Start with Level 1 or continue your progress
3. **Place Pieces**:
   - Click to select a piece
   - Use ROTATE and FLIP buttons to transform it
   - Drag the piece to the board
4. **Mix Colors**: Stack pieces to blend colors additively
5. **Match the Pattern**: Make your board match the target pattern
6. **Progress**: Complete all 50 levels to win!

## Color Mixing Rules

- **Primary Colors**: Red + Yellow = Orange
- **Primary Colors**: Red + Blue = Purple
- **Primary Colors**: Yellow + Blue = Green
- **Muddy Mix**: Mixing all three primaries or incompatible colors = Empty
- **Neutral Pieces**: Don't mix with other colors

## Development

### Prerequisites
- Node.js 18+
- pnpm
- Scarb (for Cairo contracts)
- Dojo CLI

### Setup Contracts

```bash
cd contracts
sozo build
katana --disable-fee  # Start local node
sozo migrate         # Deploy contracts
```

### Setup Client

```bash
cd client
pnpm install
pnpm dev
```

### Build for Production

```bash
cd client
pnpm build
```

## Project Structure

```
kanoodle-fusion/
├── contracts/              # Cairo smart contracts
│   ├── src/
│   │   ├── systems/       # Game logic (Dojo systems)
│   │   └── models.cairo   # Data structures
│   └── scripts/           # Deployment scripts
└── client/                # React frontend
    ├── src/
    │   ├── components/    # UI components
    │   ├── hooks/         # React hooks for game state
    │   └── lib/           # Utilities and game logic
    └── public/            # Static assets
```

## License

MIT License

## Acknowledgments

Built with:
- [Dojo Engine](https://book.dojoengine.org/) - Provable game engine
- [Cartridge](https://cartridge.gg/) - Gaming infrastructure for Starknet
- [Starknet](https://www.starknet.io/) - Ethereum Layer 2

---

**Made with ❤️ for the Starknet community**
