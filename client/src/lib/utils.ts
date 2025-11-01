import { AccountInterface, Call } from 'starknet';

/**
 * Executes a transaction on Starknet and waits for confirmation.
 *
 * This helper function simplifies the process of executing transactions by:
 * - Executing the transaction call(s)
 * - Logging the transaction hash
 * - Waiting for transaction confirmation
 * - Checking transaction execution status (success vs reverted)
 * - Throwing an error if the transaction reverted
 * - Providing optional labeled logging for different transaction types
 *
 * @param account - The Starknet account interface to execute the transaction from
 * @param calls - The transaction call(s) to execute (single Call or array of Calls)
 * @param label - Optional label for logging (e.g., "Place Piece", "Start Game")
 * @returns The transaction result from account.execute()
 * @throws Error if the transaction execution reverted
 *
 * @example
 * ```typescript
 * const result = await executeTx(
 *   account,
 *   {
 *     contractAddress: contractAddr,
 *     entrypoint: 'place_piece',
 *     calldata: [gameId, pieceId, x, y, rotation, flipped]
 *   },
 *   'Place Piece Transaction'
 * );
 * ```
 */
export async function executeTx(
  account: AccountInterface,
  calls: Call | Call[],
  label?: string
) {
  if (label) {
    console.log(`=== ${label} ===`);
  }

  const tx = await account.execute(calls);
  console.log(`Tx hash: ${tx.transaction_hash}`);

  const receipt = await account.waitForTransaction(tx.transaction_hash);
  console.log('Tx confirmed!');

  // Check if the transaction execution was successful
  // In Starknet, a transaction can be "confirmed" (included in a block) even if it reverted
  if (receipt.isReverted()) {
    const revertReason = (receipt as any).revert_reason || 'Transaction execution failed';
    console.error('Transaction reverted:', revertReason);
    throw new Error(revertReason);
  }

  return tx;
}

/**
 * Parses contract error messages and returns user-friendly error descriptions.
 *
 * Handles common contract error patterns including:
 * - Game state errors
 * - Piece placement errors
 * - Validation errors
 * - Transaction errors
 * - Generic fallback for unknown errors
 *
 * @param err - The error object from a contract call
 * @returns A user-friendly error message string
 *
 * @example
 * ```typescript
 * try {
 *   await contract.execute(...);
 * } catch (err) {
 *   const message = parseContractError(err);
 *   console.error(message);
 * }
 * ```
 */
export function parseContractError(err: any): string {
  // Return generic message if no error message exists
  if (!err?.message) {
    return 'An unknown error occurred';
  }

  const errorMessage = err.message;

  // Game state errors
  if (errorMessage.includes('Game not found') || errorMessage.includes('does not exist')) {
    return 'Game not found. Please start a new game.';
  }

  if (errorMessage.includes('already solved') || errorMessage.includes('Game complete')) {
    return 'This game has already been completed';
  }

  // Piece placement errors
  if (errorMessage.includes('Invalid piece') || errorMessage.includes('Piece not found')) {
    return 'Invalid piece selected';
  }

  if (errorMessage.includes('Out of bounds') || errorMessage.includes('Invalid position')) {
    return 'Piece placement is out of bounds';
  }

  if (errorMessage.includes('overlaps') || errorMessage.includes('collision')) {
    return 'Piece overlaps with another piece';
  }

  if (errorMessage.includes('already placed')) {
    return 'This piece has already been placed';
  }

  // Validation errors
  if (errorMessage.includes('cannot be empty') || errorMessage.includes('required')) {
    return 'Please provide all required information';
  }

  // Transaction errors
  if (errorMessage.includes('rejected') || errorMessage.includes('User rejected')) {
    return 'Transaction was rejected';
  }

  if (errorMessage.includes('insufficient funds') || errorMessage.includes('balance')) {
    return 'Insufficient funds to complete this transaction';
  }

  // Permission errors
  if (errorMessage.includes('not authorized') || errorMessage.includes('permission')) {
    return 'You are not authorized to perform this action';
  }

  // Generic fallback - return the original message if no pattern matches
  return errorMessage;
}
