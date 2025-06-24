import { NextResponse } from 'next/server';
import { updateTraffic, getGraph } from '@/lib/graph';

export async function POST() {
  try {
    updateTraffic();
    const { nodes, edges } = getGraph();
    return NextResponse.json({ message: 'Traffic updated successfully', nodes, edges });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update traffic' }, { status: 500 });
  }
}
