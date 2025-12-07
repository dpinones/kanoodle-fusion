/**
 * Utility functions for Kanoodle Fusion
 * Frontend-only version (no blockchain integration)
 */

/**
 * Parses error messages and returns user-friendly error descriptions.
 *
 * @param err - The error object
 * @returns A user-friendly error message string
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
