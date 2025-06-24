// src/lib/graph.ts

export type Vehicle = 'Car' | 'Bike' | 'Truck';
export type RoadType = 'highway' | 'narrow' | 'local';

export interface Node {
  id: string;
  name: string;
  x: number; // Percentage for positioning
  y: number; // Percentage for positioning
}

export interface Edge {
  source: string;
  destination: string;
  distance: number; // in kilometers
  baseTime: number; // in minutes
  currentTime: number; // in minutes
  type: RoadType;
}

// --- In-Memory Graph Data ---

const nodes: Node[] = [
  { id: 'A', name: 'Downtown',        x: 10, y: 20 },
  { id: 'B', name: 'Uptown',          x: 90, y: 20 },
  { id: 'C', name: 'Midtown',         x: 10, y: 50 },
  { id: 'D', name: 'Suburbia',        x: 90, y: 50 },
  { id: 'E', name: 'Industrial Park', x: 10, y: 80 },
  { id: 'F', name: 'Airport',         x: 90, y: 80 },
  { id: 'G', name: 'Central Station', x: 50, y: 35 },
  { id: 'H', name: 'Market District', x: 50, y: 65 },
  { id: 'I', name: 'South Bridge',    x: 50, y: 95 },
];

let edges: Edge[] = [
  // West-East Connections
  { source: 'A', destination: 'G', distance: 10, baseTime: 10, currentTime: 10, type: 'highway' },
  { source: 'G', destination: 'B', distance: 10, baseTime: 10, currentTime: 10, type: 'highway' },
  { source: 'C', destination: 'H', distance: 12, baseTime: 12, currentTime: 12, type: 'local' },
  { source: 'H', destination: 'D', distance: 12, baseTime: 12, currentTime: 12, type: 'local' },
  { source: 'E', destination: 'I', distance: 11, baseTime: 11, currentTime: 11, type: 'highway' },
  { source: 'I', destination: 'F', distance: 11, baseTime: 11, currentTime: 11, type: 'highway' },

  // North-South Connections
  { source: 'A', destination: 'C', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'C', destination: 'E', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'G', destination: 'H', distance: 7, baseTime: 7, currentTime: 7, type: 'highway' },
  { source: 'H', destination: 'I', distance: 7, baseTime: 7, currentTime: 7, type: 'highway' },
  { source: 'B', destination: 'D', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'D', destination: 'F', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },

  // Diagonals / Alternatives
  { source: 'C', destination: 'G', distance: 9, baseTime: 9, currentTime: 9, type: 'narrow' },
  { source: 'D', destination: 'G', distance: 9, baseTime: 9, currentTime: 9, type: 'narrow' },
  { source: 'E', destination: 'H', distance: 9, baseTime: 9, currentTime: 9, type: 'local' },
  { source: 'F', destination: 'H', distance: 9, baseTime: 9, currentTime: 9, type: 'local' },
  
  // Reverse Edges
  { source: 'G', destination: 'A', distance: 10, baseTime: 10, currentTime: 10, type: 'highway' },
  { source: 'B', destination: 'G', distance: 10, baseTime: 10, currentTime: 10, type: 'highway' },
  { source: 'H', destination: 'C', distance: 12, baseTime: 12, currentTime: 12, type: 'local' },
  { source: 'D', destination: 'H', distance: 12, baseTime: 12, currentTime: 12, type: 'local' },
  { source: 'I', destination: 'E', distance: 11, baseTime: 11, currentTime: 11, type: 'highway' },
  { source: 'F', destination: 'I', distance: 11, baseTime: 11, currentTime: 11, type: 'highway' },
  { source: 'C', destination: 'A', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'E', destination: 'C', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'H', destination: 'G', distance: 7, baseTime: 7, currentTime: 7, type: 'highway' },
  { source: 'I', destination: 'H', distance: 7, baseTime: 7, currentTime: 7, type: 'highway' },
  { source: 'D', destination: 'B', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'F', destination: 'D', distance: 8, baseTime: 8, currentTime: 8, type: 'local' },
  { source: 'G', destination: 'C', distance: 9, baseTime: 9, currentTime: 9, type: 'narrow' },
  { source: 'G', destination: 'D', distance: 9, baseTime: 9, currentTime: 9, type: 'narrow' },
  { source: 'H', destination: 'E', distance: 9, baseTime: 9, currentTime: 9, type: 'local' },
  { source: 'H', destination: 'F', distance: 9, baseTime: 9, currentTime: 9, type: 'local' },
];

// --- Traffic Simulation ---

let simulationInterval: NodeJS.Timeout | null = null;

export function updateTraffic() {
  const newEdges = [...edges];

  // Create a set to track updated roads to avoid redundant work
  const updatedRoads = new Set<string>();

  for (const edge of newEdges) {
    // Create a unique key for the road, regardless of direction
    const roadKey = [edge.source, edge.destination].sort().join('-');

    if (!updatedRoads.has(roadKey)) {
      // Calculate a new time once per road
      const fluctuation = Math.random() * 1.5 * edge.baseTime;
      const newTime = Math.max(1, Math.round(edge.baseTime + fluctuation));

      // Find this edge and its reverse
      const forwardEdge = newEdges.find(e => e.source === edge.source && e.destination === edge.destination);
      const reverseEdge = newEdges.find(e => e.source === edge.destination && e.destination === edge.source);

      if (forwardEdge) forwardEdge.currentTime = newTime;
      if (reverseEdge) reverseEdge.currentTime = newTime;

      updatedRoads.add(roadKey);
    }
  }

  edges = newEdges;
  console.log('Traffic updated at:', new Date().toLocaleTimeString());
}

export function startTrafficSimulation() {
  // Prevent multiple intervals from running
  if (simulationInterval) return;

  if (typeof window === 'undefined') {
    console.log('Starting traffic simulation...');
    updateTraffic(); // Initial update
    simulationInterval = setInterval(updateTraffic, 5000);
  }
}

// Start the simulation automatically on the server
startTrafficSimulation();

// --- Graph API ---

export const getGraph = () => {
  return { nodes, edges };
};

// --- Pathfinding (Dijkstra's Algorithm) ---

interface PathResult {
  path: string[];
  time: number;
  distance: number;
}

export const findShortestPath = (startId: string, endId: string, vehicle: Vehicle): PathResult | null => {
  const times: { [key: string]: number } = {};
  const totalDistances: { [key: string]: number } = {};
  const prev: { [key: string]: string | null } = {};
  const queue: string[] = [];

  nodes.forEach(node => {
    times[node.id] = Infinity;
    totalDistances[node.id] = Infinity;
    prev[node.id] = null;
    queue.push(node.id);
  });

  times[startId] = 0;
  totalDistances[startId] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => times[a] - times[b]);
    const u = queue.shift();

    if (u === undefined || u === endId) break;

    const neighbors = edges.filter(edge => edge.source === u);

    for (const edge of neighbors) {
      // Vehicle constraints
      if (vehicle === 'Truck' && edge.type === 'narrow') {
        continue; // Trucks can't use narrow roads
      }

      const altTime = times[u] + edge.currentTime;
      if (altTime < times[edge.destination]) {
        times[edge.destination] = altTime;
        totalDistances[edge.destination] = totalDistances[u] + edge.distance;
        prev[edge.destination] = u;
      }
    }
  }

  const path: string[] = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current);
    current = prev[current]!;
  }

  if (times[endId] === Infinity) {
    return null; // No path found
  }

  return {
    path,
    time: times[endId],
    distance: totalDistances[endId],
  };
};
