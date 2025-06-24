// src/app/api/path/route.ts

import { NextResponse } from 'next/server';
import { findShortestPath, Vehicle, getGraph } from '@/lib/graph';

export async function POST(request: Request) {
  try {
    const { source, destination, vehicle } = (await request.json()) as {
      source: string;
      destination: string;
      vehicle: Vehicle;
    };

    if (!source || !destination || !vehicle) {
      return NextResponse.json(
        { error: 'Missing required parameters: source, destination, vehicle' },
        { status: 400 }
      );
    }

    // The graph state is captured here, at the moment of calculation
    const graph = getGraph();
    const result = findShortestPath(source, destination, vehicle);

    if (!result) {
      return NextResponse.json({ error: 'No path found' }, { status: 404 });
    }

    // Return the result bundled with the graph state used for the calculation
    return NextResponse.json({ ...result, ...graph });

  } catch (error) {
    console.error('Pathfinding error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
