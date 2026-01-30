/**
 * Single card by ID stub.
 * Implement: fetch from YGOPRODeck (e.g. .../cardinfo.php?id=...) or your own backend.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;
  if (!cardId) return Response.json({ error: 'Missing card ID' }, { status: 400 });
  // Implement: fetch card by cardId, return card object or 404
  return Response.json({ error: 'Not implemented' }, { status: 404 });
}
