# Kanoodle Fusion Client Hooks Guide

Este documento explica cómo usar los hooks de React para interactuar con los contratos Dojo de Kanoodle Fusion.

## Patrón de Implementación

Los hooks siguen el mismo patrón que `activations/client`:
- Configuración centralizada basada en manifiestos
- Hooks específicos para cada función del contrato
- Manejo de errores consistente
- Estados de carga compartidos

## Configuración

### 1. Variables de Entorno

```bash
# Desarrollo local (Katana)
VITE_CHAIN=dev pnpm dev

# Slot network
VITE_CHAIN=slot pnpm dev
```

### 2. Archivos de Configuración

La configuración se carga automáticamente desde:
- `contracts/manifest_dev.json` (desarrollo)
- `contracts/manifest_slot.json` (slot)

## Hooks Disponibles

### useStartGame

Inicia un nuevo juego.

```typescript
import { useStartGame } from './hooks';

function MyComponent() {
  const { startGame, isLoading, error, gameId } = useStartGame();

  const handleStart = async () => {
    const levelId = 1;
    const newGameId = await startGame(levelId);

    if (newGameId) {
      console.log('Game started:', newGameId);
    }
  };

  return (
    <button onClick={handleStart} disabled={isLoading}>
      {isLoading ? 'Starting...' : 'Start Game'}
    </button>
  );
}
```

**Función del contrato:**
```cairo
fn start_game(ref self: T, player: ContractAddress, level_id: u8) -> u32;
```

### useLoadLevel

Carga información del nivel.

```typescript
import { useLoadLevel } from './hooks';

function LevelSelector() {
  const { loadLevel, currentLevel, isLoading, error } = useLoadLevel();

  useEffect(() => {
    loadLevel(1); // Cargar nivel 1
  }, []);

  if (isLoading) return <div>Loading level...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Level {currentLevel?.level_id}</h3>
      <p>Solution cells: {currentLevel?.solution?.length}</p>
      <p>Allowed pieces: {currentLevel?.allowed_pieces?.length}</p>
    </div>
  );
}
```

**Función del contrato:**
```cairo
fn get_level(self: @T, level_id: u8) -> Level;
```

### usePlacePiece

Coloca una pieza en el tablero.

```typescript
import { usePlacePiece } from './hooks';

function PiecePlacer({ gameId }: { gameId: number }) {
  const { placePiece, isLoading, error } = usePlacePiece();

  const handlePlace = async () => {
    const success = await placePiece(
      gameId,      // ID del juego
      0,           // ID de la pieza
      2,           // Posición X
      1,           // Posición Y
      0,           // Rotación (0, 1, 2, 3)
      false        // Volteada (true/false)
    );

    if (success) {
      console.log('Piece placed successfully');
    }
  };

  return (
    <button onClick={handlePlace} disabled={isLoading}>
      {isLoading ? 'Placing...' : 'Place Piece'}
    </button>
  );
}
```

**Función del contrato:**
```cairo
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
```

### useGameState

Lee y actualiza el estado del juego.

```typescript
import { useGameState } from './hooks';

function GameDisplay({ gameId }: { gameId: number }) {
  const { gameState, refreshGameState, isLoading } = useGameState(gameId);

  // Se actualiza automáticamente cuando cambia gameId
  // También puedes refrescar manualmente:
  const handleRefresh = () => {
    refreshGameState();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Game #{gameState?.game_id}</h3>
      <p>Level: {gameState?.level_id}</p>
      <p>Pieces: {gameState?.pieces_count}</p>
      <p>Moves: {gameState?.moves_count}</p>
      <p>Solved: {gameState?.is_solved ? 'Yes' : 'No'}</p>

      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
```

**Función del contrato:**
```cairo
fn get_game_state(self: @T, game_id: u32, player: ContractAddress) -> KanoodleGame;
```

## Ejemplo Completo

Ver el componente `GameController.tsx` para un ejemplo completo de uso:

```typescript
import { useState } from 'react';
import { useStartGame, useLoadLevel, usePlacePiece, useGameState } from './hooks';

function KanoodleGame() {
  const [gameId, setGameId] = useState<number | null>(null);
  const [level, setLevel] = useState(1);

  // Hooks
  const { startGame } = useStartGame();
  const { loadLevel, currentLevel } = useLoadLevel();
  const { placePiece } = usePlacePiece();
  const { gameState, refreshGameState } = useGameState(gameId || undefined);

  // Iniciar juego
  const handleStart = async () => {
    await loadLevel(level); // Primero cargar nivel
    const newGameId = await startGame(level);
    if (newGameId) {
      setGameId(newGameId);
    }
  };

  // Colocar pieza
  const handlePlace = async (pieceId: number, x: number, y: number) => {
    if (!gameId) return;

    const success = await placePiece(gameId, pieceId, x, y, 0, false);
    if (success) {
      await refreshGameState(); // Refrescar estado después de colocar
    }
  };

  return (
    <div>
      {!gameId ? (
        <button onClick={handleStart}>Start Game</button>
      ) : (
        <div>
          <GameBoard
            gameState={gameState}
            onPlacePiece={handlePlace}
          />
        </div>
      )}
    </div>
  );
}
```

## Tipos TypeScript

Todos los tipos están definidos en `lib/kanoodle/types.ts`:

```typescript
// Estado del juego
interface KanoodleGame {
  game_id: number;
  player: string;
  level_id: number;
  current_solution: number[];
  placed_piece_ids: number[];
  pieces_count: number;
  is_solved: boolean;
  moves_count: number;
  timestamp: number;
}

// Definición de nivel
interface Level {
  level_id: number;
  solution: number[];        // 16 celdas (4x4)
  allowed_pieces: number[];  // IDs de piezas permitidas
}

// Rotación (0=0°, 1=90°, 2=180°, 3=270°)
type RotationValue = 0 | 1 | 2 | 3;
```

## Flujo de Trabajo Típico

1. **Cargar nivel** → `useLoadLevel()`
2. **Iniciar juego** → `useStartGame()`
3. **Colocar piezas** → `usePlacePiece()`
4. **Verificar estado** → `useGameState()`
5. **Repetir pasos 3-4** hasta resolver el puzzle

## Notas Importantes

### Game ID
Por ahora, el `game_id` se genera como placeholder. Necesitarás parsearlo del receipt de la transacción o de los eventos emitidos por el contrato.

```typescript
// TODO: Parsear game_id real del receipt
const receipt = await account.waitForTransaction(tx.transaction_hash);
// Buscar evento GameStarted y extraer game_id
```

### Manejo de Errores

Todos los hooks incluyen manejo de errores:

```typescript
const { placePiece, error } = usePlacePiece();

if (error) {
  console.error('Error placing piece:', error);
  // Mostrar error al usuario
}
```

### Estados de Carga

Cada hook tiene su propio estado `isLoading`:

```typescript
const { startGame, isLoading: isStarting } = useStartGame();
const { placePiece, isLoading: isPlacing } = usePlacePiece();

// Puedes deshabilitar botones mientras se procesan
<button disabled={isStarting || isPlacing}>
  Place Piece
</button>
```

## Próximos Pasos

1. **Implementar parseo de game_id** desde eventos del contrato
2. **Agregar hook para `remove_piece()`**
3. **Agregar hook para `check_solution()`**
4. **Agregar hook para `get_piece_definition()`**
5. **Agregar hook para `get_player_stats()`**

## Comparación con Activations

| Activations | Kanoodle Fusion |
|-------------|-----------------|
| `useTrialProgress()` | `useGameState()` |
| `useWazaClaim()` | `usePlacePiece()` |
| `useChiQuiz()` | `useLoadLevel()` |
| Transaction wrapper | Direct `account.execute()` |
| Multiple trial states | Single game state |

Ambos proyectos siguen el mismo patrón arquitectónico para consistencia y mantenibilidad.
