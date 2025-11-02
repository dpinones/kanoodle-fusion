// Kanoodle Fusion Configuration
// Environment-based chain configuration - set VITE_CHAIN to 'dev', 'sepolia', or 'mainnet'

import { constants } from "starknet";
import manifestDev from "../../../contracts/manifest_dev.json";
import manifestSlot from "../../../contracts/manifest_slot.json";

// ============================================================================
// ENVIRONMENT-BASED CHAIN SELECTION
// ============================================================================
// Set via VITE_CHAIN environment variable: 'dev', 'slot'
// Example: VITE_CHAIN=slot pnpm build

const CHAIN_ENV = import.meta.env.VITE_CHAIN || 'dev';

// ============================================================================
// CHAIN CONFIGURATION
// ============================================================================

export const KATANA_CHAIN_ID = "0x4b4154414e41"; // "KATANA" hex-encoded
export const KATANA_URL = "http://localhost:5050";

export const SEPOLIA_CHAIN_ID = constants.StarknetChainId.SN_SEPOLIA;
export const SEPOLIA_URL = "https://api.cartridge.gg/x/starknet/sepolia";

export const MAINNET_CHAIN_ID = constants.StarknetChainId.SN_MAIN;
export const MAINNET_URL = "https://api.cartridge.gg/x/starknet/mainnet";

export const SLOT_CHAIN_ID = "0x57505f4b414e4f4f444c455f465553494f4e5f47414d45";
export const SLOT_URL = "https://api.cartridge.gg/x/kanoodle-fusion-game/katana";

// ============================================================================
// MANIFEST SELECTION
// ============================================================================
// Select manifest based on environment variable

function getManifestForEnv(env: string) {
  switch (env) {
    case 'slot':
      return manifestSlot;
    case 'dev':
    default:
      return manifestDev;
  }
}

function getChainIdForEnv(env: string) {
  switch (env) {
    case 'slot':
      return SLOT_CHAIN_ID;
    case 'dev':
    default:
      return KATANA_CHAIN_ID;
  }
}

function getRpcUrlForEnv(env: string) {
  switch (env) {
    case 'slot':
      return SLOT_URL;
    case 'dev':
    default:
      return KATANA_URL;
  }
}

const manifest = getManifestForEnv(CHAIN_ENV);
export const DEFAULT_CHAIN_ID = getChainIdForEnv(CHAIN_ENV);
export const DEFAULT_RPC_URL = getRpcUrlForEnv(CHAIN_ENV);

// ============================================================================
// CONTRACT ADDRESSES AND ABIS FROM MANIFEST
// ============================================================================

export const WORLD_ADDRESS = manifest.world.address;

// Find the Kanoodle Fusion System contract
const kanoodleSystemContract = manifest.contracts?.find(
  (c: any) => c.tag === "kanoodle_fusion-kanoodle_fusion_system"
);
export const KANOODLE_SYSTEM_ADDRESS = kanoodleSystemContract?.address || '0x0';
export const KANOODLE_SYSTEM_ABI = kanoodleSystemContract?.abi || [];

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

// Board configuration
export const BOARD_SIZE = 4; // 4x4 grid
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE; // 16 cells

// Game configuration
export const MAX_PIECES = 13;
export const INITIAL_LEVEL = 1;

// Animation durations (ms)
export const ANIMATION = {
  PIECE_MOVE: 200,
  PIECE_ROTATE: 150,
  PIECE_FLIP: 150,
  BOARD_CHECK: 300,
  SUCCESS: 500,
} as const;

// Touch/drag configuration
export const DRAG_CONFIG = {
  THRESHOLD: 5, // pixels to start drag
  SNAP_THRESHOLD: 20, // pixels to snap to grid
} as const;

// ============================================================================
// LOGGING
// ============================================================================

console.log('Kanoodle Fusion Configuration loaded:');
console.log('  Environment:', CHAIN_ENV);
console.log('  Chain ID:', DEFAULT_CHAIN_ID);
console.log('  RPC URL:', DEFAULT_RPC_URL);
console.log('  World:', WORLD_ADDRESS);
console.log('  Kanoodle System:', KANOODLE_SYSTEM_ADDRESS);
