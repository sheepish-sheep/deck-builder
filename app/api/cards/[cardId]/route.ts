
import { NextResponse } from "next/server";
export async function GET(
  _request: Request, {params}: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  if (!cardId) return Response.json({ error: 'Missing card ID' }, { status: 400 });
  const apiUrl = new URL('https://db.ygoprodeck.com/api/v7/cardinfo.php');
  apiUrl.searchParams.set('id', cardId);
  const response = await fetch(apiUrl)
  const json = await response.json();
  const data = Array.isArray(json?.data) ? json.data : [];
  if (data.length === 0) return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  if (data.length === 1) return NextResponse.json(data[0]);
  return NextResponse.json(data);
}
