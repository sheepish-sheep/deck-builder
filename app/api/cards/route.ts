import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  const { searchParams } = new URL(_request.url);
  const name = searchParams.get('name');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';
  const race = searchParams.get('race') || null;
  const attribute = searchParams.get('attribute');
  const archetype = searchParams.get('archetype') || null;
  const level = searchParams.get('level');
  const pendulum_scale = searchParams.get('pendulum_scale');
  const id = searchParams.get('id');
  const desc = searchParams.get('desc');

  const apiUrl = new URL('https://db.ygoprodeck.com/api/v7/cardinfo.php');
  if (name) apiUrl.searchParams.set('fname', name);
  if (type) apiUrl.searchParams.set('type', type);
  if (limit) apiUrl.searchParams.set('num', limit);
  if (offset) apiUrl.searchParams.set('offset', offset);
  if (race) apiUrl.searchParams.set('race', race);
  if (attribute) apiUrl.searchParams.set('attribute', attribute);
  if (archetype) apiUrl.searchParams.set('archetype', archetype);
  if (level) apiUrl.searchParams.set('level', level);
  if (pendulum_scale) apiUrl.searchParams.set('pendulum_scale', pendulum_scale);
  if (id) apiUrl.searchParams.set('id', id);
  if (desc) apiUrl.searchParams.set('desc', desc);

  const response = await fetch(apiUrl.toString(), { cache: 'no-store' });
  const text = await response.text();
  let json: { data?: unknown; error?: string } = {};
  try {
    json = JSON.parse(text);
  } catch {
    // ignore
  }
  let data: unknown[] = [];
  if (Array.isArray(json?.data)) {
    data = json.data;
  } else if (json?.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
    data = [json.data];
  } else if (Array.isArray(json)) {
    data = json as unknown[];
  } else if (json && typeof json === 'object' && 'id' in json && 'name' in json) {
    data = [json];
  }
  return NextResponse.json(data);
}
