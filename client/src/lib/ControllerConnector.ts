import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";

import {
  DEFAULT_CHAIN_ID,
  DEFAULT_RPC_URL,
} from "./config";
import { KANOODLE_SYSTEM_ADDRESS } from "./kanoodle/config";

// Define session policies for gasless transactions
const policies: SessionPolicies = {
  contracts: {
    // Kanoodle Fusion game policies
    ...(KANOODLE_SYSTEM_ADDRESS !== '0x0' ? {
      [KANOODLE_SYSTEM_ADDRESS]: {
        methods: [
          {
            name: "start_game",
            entrypoint: "start_game",
            description: "Start a new Kanoodle game",
          },
          {
            name: "place_piece",
            entrypoint: "place_piece",
            description: "Place a piece on the board",
          },
          {
            name: "remove_piece",
            entrypoint: "remove_piece",
            description: "Remove a piece from the board",
          },
        ],
      },
    } : {}),
  },
};

// Create controller connector instance for the environment-specific chain
// Use Cartridge's preset chain names instead of custom chain IDs
const controller = new ControllerConnector({
  chains: [{ rpcUrl: DEFAULT_RPC_URL }],
  defaultChainId: DEFAULT_CHAIN_ID,
  policies
});

export default controller;
