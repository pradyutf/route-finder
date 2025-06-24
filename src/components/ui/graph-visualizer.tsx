"use client";

import { Node, Edge } from "@/lib/graph";

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  path: string[];
}

const getTrafficColor = (edge: Edge) => {
  const timeRatio = edge.currentTime / edge.baseTime;
  if (timeRatio < 1.3) return "#22c55e"; // green-500
  if (timeRatio < 1.7) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
};

export function GraphVisualizer({ nodes, edges, path }: GraphVisualizerProps) {
  if (nodes.length === 0) return null;

  return (
    <div className="aspect-video w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Render Edges and Time Labels */}
        {edges
          .filter(edge => edge.source < edge.destination) // Process each road only once
          .map((edge, index) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const destNode = nodes.find(n => n.id === edge.destination);
            if (!sourceNode || !destNode) return null;

            // Check if either direction of the road is in the calculated path
            const isHighlighted = path.some((nodeId, i) => {
              if (i === path.length - 1) return false;
              const nextNodeId = path[i + 1];
              return (
                (nodeId === edge.source && nextNodeId === edge.destination) ||
                (nodeId === edge.destination && nextNodeId === edge.source)
              );
            });

            const midX = (sourceNode.x + destNode.x) / 2;
            const midY = (sourceNode.y + destNode.y) / 2;

            return (
              <g key={index}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={destNode.x}
                  y2={destNode.y}
                  stroke={isHighlighted ? '#3b82f6' : getTrafficColor(edge)}
                  strokeWidth={isHighlighted ? 2 : 0.75}
                  strokeDasharray={isHighlighted ? 'none' : '2 2'}
                />
                <text
                  x={midX}
                  y={midY}
                  dy="-1.5"
                  textAnchor="middle"
                  fontSize="3"
                  fill="#0f172a"
                  className="font-sans font-semibold"
                >
                  {edge.currentTime} min
                </text>
                <text
                  x={midX}
                  y={midY}
                  dy="4.5"
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="#475569"
                  className="font-sans"
                >
                  ({edge.distance} km)
                </text>
              </g>
            );
          })}

        {/* Render Nodes */}
        {nodes.map(node => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle r="2.5" fill={path.includes(node.id) ? "#3b82f6" : "#1e293b"} />
            <text
              textAnchor="middle"
              dy="-4"
              fontSize="3"
              fill="#1e293b"
              className="font-sans font-bold"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
