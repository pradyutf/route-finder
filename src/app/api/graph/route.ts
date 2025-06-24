// src/app/api/graph/route.ts

import { NextResponse } from 'next/server';
import { getGraph } from '@/lib/graph';

export async function GET() {
  const { nodes, edges } = getGraph();
  return NextResponse.json({ nodes, edges });
}
