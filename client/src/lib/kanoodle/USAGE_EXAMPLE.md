# Level and Piece Constants Usage Examples

The level and piece data are now available as TypeScript constants in the client, eliminating the need to call Dojo's `get_level` and `get_piece_definition` functions.

## Import the functions

```typescript
// Levels
import { getLevel, getAllLevelIds, isValidLevel, getTotalLevels, PieceIds } from '@/lib/kanoodle/levels';

// Pieces
import { getPieceDefinition, getAllPieceIds, isValidPiece, getTotalPieces, getPieceName } from '@/lib/kanoodle/pieces';

// Types and utilities
import { Colors, ColorHex, gamePieceToCells } from '@/lib/kanoodle/types';
import { transformPiece, Rotations } from '@/lib/kanoodle/pieceUtils';
```

## Get a specific level

```typescript
// Get level 1
const level1 = getLevel(1);

console.log(level1);
// Output:
// {
//   level_id: 1,
//   solution: [
//     1, 3, 3, 7,  // RED, BLUE, BLUE, NEUTRAL
//     1, 1, 6, 3,  // RED, RED, PURPLE, BLUE
//     1, 1, 7, 7,  // RED, RED, NEUTRAL, NEUTRAL
//     6, 6, 3, 3,  // PURPLE, PURPLE, BLUE, BLUE
//   ],
//   allowed_pieces: [1, 2, 4, 6, 11, 12, 13]
// }
```

## Use in a component

```typescript
import { getLevel } from '@/lib/kanoodle/levels';
import { Colors, ColorHex } from '@/lib/kanoodle/types';

function LevelDisplay({ levelId }: { levelId: number }) {
  const level = getLevel(levelId);

  if (!level) {
    return <div>Level not found</div>;
  }

  return (
    <div>
      <h2>Level {level.level_id}</h2>

      {/* Display the 4x4 board */}
      <div className="grid grid-cols-4 gap-1">
        {level.solution.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12"
            style={{ backgroundColor: ColorHex[color] }}
          />
        ))}
      </div>

      {/* Display allowed pieces */}
      <div>
        <h3>Allowed Pieces:</h3>
        <ul>
          {level.allowed_pieces.map(pieceId => (
            <li key={pieceId}>Piece {pieceId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Get all level IDs

```typescript
const allLevelIds = getAllLevelIds();
console.log(allLevelIds); // [1, 2, 3, ..., 50]

// Use in a level selector
function LevelSelector({ onSelectLevel }: { onSelectLevel: (id: number) => void }) {
  return (
    <select onChange={(e) => onSelectLevel(Number(e.target.value))}>
      {allLevelIds.map(id => (
        <option key={id} value={id}>Level {id}</option>
      ))}
    </select>
  );
}
```

## Validate a level ID

```typescript
const isValid = isValidLevel(25);
console.log(isValid); // true

const isInvalid = isValidLevel(999);
console.log(isInvalid); // false
```

## Get total number of levels

```typescript
const total = getTotalLevels();
console.log(total); // 50
```

## Access color constants

```typescript
import { Colors } from '@/lib/kanoodle/types';

// Use color constants for comparisons
if (currentColor === Colors.RED) {
  console.log('This cell is red!');
}

// Check if colors match
function checkSolution(currentBoard: number[], targetBoard: number[]): boolean {
  return currentBoard.every((color, index) => color === targetBoard[index]);
}
```

## Access piece ID constants

```typescript
import { PieceIds } from '@/lib/kanoodle/levels';

// Use piece ID constants
const straightBluePiece = PieceIds.ID_1;
const straightRedPiece = PieceIds.ID_2;

// Check if a piece is allowed
const level5 = getLevel(5);
const canUsePiece1 = level5?.allowed_pieces.includes(PieceIds.ID_1);
console.log(canUsePiece1); // false (level 5 doesn't include piece 1)
```

## Updated Hook Usage

The `useKanoodleGame` hook now uses the local constants automatically:

```typescript
import { useKanoodleGame } from '@/hooks/useKanoodleGame';

function GameComponent() {
  const { loadLevel, currentLevel } = useKanoodleGame();

  useEffect(() => {
    // This now loads from local constants, not from the contract
    loadLevel(1);
  }, [loadLevel]);

  return (
    <div>
      {currentLevel && (
        <div>Level {currentLevel.level_id} loaded!</div>
      )}
    </div>
  );
}
```

## Working with Pieces

### Get a piece definition

```typescript
import { getPieceDefinition, PieceIds } from '@/lib/kanoodle/pieces';
import { gamePieceToCells } from '@/lib/kanoodle/types';

// Get piece 1 (Straight 4-cell Blue)
const piece1 = getPieceDefinition(PieceIds.ID_1);

console.log(piece1);
// Output:
// {
//   piece_id: 1,
//   size: 4,
//   x0: 0, y0: 0, color0: 3,  // BLUE
//   x1: 0, y1: 1, color1: 3,  // BLUE
//   x2: 0, y2: 2, color2: 3,  // BLUE
//   x3: 0, y3: 3, color3: 3,  // BLUE
// }

// Convert to array of cells for easier processing
const cells = gamePieceToCells(piece1);
console.log(cells);
// Output:
// [
//   { x: 0, y: 0, color: 3 },
//   { x: 0, y: 1, color: 3 },
//   { x: 0, y: 2, color: 3 },
//   { x: 0, y: 3, color: 3 },
// ]
```

### Display a piece in a component

```typescript
import { getPieceDefinition, getPieceName } from '@/lib/kanoodle/pieces';
import { gamePieceToCells, ColorHex } from '@/lib/kanoodle/types';

function PieceDisplay({ pieceId }: { pieceId: number }) {
  const piece = getPieceDefinition(pieceId);

  if (!piece) {
    return <div>Piece not found</div>;
  }

  const cells = gamePieceToCells(piece);
  const name = getPieceName(pieceId);

  return (
    <div>
      <h3>{name}</h3>
      <div className="relative">
        {cells.map((cell, index) => (
          <div
            key={index}
            className="absolute w-8 h-8 border border-gray-400"
            style={{
              left: `${cell.x * 32}px`,
              top: `${cell.y * 32}px`,
              backgroundColor: ColorHex[cell.color],
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Get all pieces

```typescript
import { getAllPieceIds, getPieceDefinition } from '@/lib/kanoodle/pieces';

const allPieceIds = getAllPieceIds();
console.log(allPieceIds); // [1, 2, 3, ..., 13]

// Load all pieces
const allPieces = allPieceIds.map(id => getPieceDefinition(id));
```

### Check if a piece is valid

```typescript
import { isValidPiece } from '@/lib/kanoodle/pieces';

console.log(isValidPiece(1));   // true
console.log(isValidPiece(999)); // false
```

### Get piece with transformations

```typescript
import { getPieceDefinition } from '@/lib/kanoodle/pieces';
import { gamePieceToCells } from '@/lib/kanoodle/types';
import { transformPiece, Rotations } from '@/lib/kanoodle/pieceUtils';

const piece = getPieceDefinition(1);
const cells = gamePieceToCells(piece);

// Rotate 90 degrees
const rotatedCells = transformPiece(cells, Rotations.DEG_90, false);

// Rotate 90 degrees and flip
const rotatedFlippedCells = transformPiece(cells, Rotations.DEG_90, true);
```

### Updated Hook Usage for Pieces

The `useKanoodleGame` hook now uses local constants automatically:

```typescript
import { useKanoodleGame } from '@/hooks/useKanoodleGame';
import { PieceIds } from '@/lib/kanoodle/pieces';

function GameComponent() {
  const { getPieceDefinition } = useKanoodleGame();

  useEffect(() => {
    // This now loads from local constants, not from the contract
    const loadPiece = async () => {
      const piece = await getPieceDefinition(PieceIds.ID_1);
      console.log('Piece loaded:', piece);
    };
    loadPiece();
  }, [getPieceDefinition]);

  return <div>Game Component</div>;
}
```

## Benefits

1. **No network calls** - Instant level and piece loading
2. **No gas costs** - Reading from local constants is free
3. **Offline support** - Works without blockchain connection
4. **Type safety** - Full TypeScript support
5. **Better UX** - No loading states needed for level/piece data
6. **Reduced RPC load** - Fewer calls to Dojo contracts
