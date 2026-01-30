/**
 * Card list API stub.
 * Implement: fetch from YGOPRODeck (e.g. https://db.ygoprodeck.com/api/v7/cardinfo.php) or your own backend.
 * Query: name, type, limit, offset.
 */
export async function GET(_request: Request) {
  // Implement: parse searchParams (name, type, limit, offset), call YGOPRODeck or backend, return card list
  return Response.json([]);
}
