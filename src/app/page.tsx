"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Node, Vehicle, Edge } from '@/lib/graph';
import { GraphVisualizer } from '@/components/ui/graph-visualizer';

interface PathResult {
  path: string[];
  time: number;
  distance: number;
  nodes: Node[];
  edges: Edge[];
}

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [vehicle, setVehicle] = useState<Vehicle>('Car');
  const [result, setResult] = useState<PathResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isFindingRoute, setIsFindingRoute] = useState(false);

  // Fetch graph data on component mount
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('/api/graph');
        const data = await response.json();
        setNodes(data.nodes);
        setEdges(data.edges);
        // Set default source and destination
        if (data.nodes.length > 1) {
          setSource(data.nodes[0].id);
          setDestination(data.nodes[1].id);
        }
      } catch (err) {
        setError('Failed to fetch graph data.');
      }
    };
    fetchGraphData();
  }, []);

  const findRoute = useCallback(async () => {
    if (!source || !destination) {
      setError('Please select a source and destination.');
      return;
    }

    setIsFindingRoute(true);
    setError(null);
    try {
      const response = await fetch('/api/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, vehicle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to find path');
        setResult(null);
        return;
      }

      const data: PathResult = await response.json();
      // Update the result and the graph state together to ensure consistency
      setResult(data);
      setNodes(data.nodes);
      setEdges(data.edges);
      setError(null);
    } catch (err) {
      setError('An unexpected error occurred.');
      setResult(null);
    } finally {
      setIsFindingRoute(false);
    }
  }, [source, destination, vehicle]);

  // Effect for live updates
  useEffect(() => {
    if (liveUpdates) {
      findRoute(); // Find route immediately when toggled on
      const interval = setInterval(findRoute, 5000);
      return () => clearInterval(interval);
    }
  }, [liveUpdates, findRoute]);

  const handleRandomizeTraffic = async () => {
    setIsRandomizing(true);
    setError(null);
    try {
      const response = await fetch('/api/traffic/update', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update traffic');
      }
      setEdges(data.edges); // Update the visualizer with new traffic data

      // If a route is already shown, recalculate it
      if (result) {
        await findRoute();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRandomizing(false);
    }
  };

  const getNodeName = (id: string) => nodes.find(n => n.id === id)?.name || id;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Traffic Navigator</h1>
        <p className="text-center text-muted-foreground mb-8">
          A web-based traffic simulator using Next.js and ShadCN.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plan Your Route</CardTitle>
            <CardDescription>Select your start, end, and vehicle type.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="source">Source</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="destination">Destination</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="vehicle">Vehicle Type</label>
              <Select value={vehicle} onValueChange={(v) => setVehicle(v as Vehicle)}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="live-updates" checked={liveUpdates} onCheckedChange={setLiveUpdates} />
              <label htmlFor="live-updates" className="text-sm">Live Updates</label>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleRandomizeTraffic} disabled={liveUpdates || isRandomizing || isFindingRoute}>
                {isRandomizing ? 'Randomizing...' : 'Randomize Traffic'}
              </Button>
              <Button onClick={findRoute} disabled={liveUpdates || isFindingRoute}>
                {isFindingRoute ? 'Finding...' : 'Find Route'}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="my-8">
          <GraphVisualizer nodes={nodes} edges={edges} path={result?.path || []} />
        </div>

        {error && (
          <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Route Found!</CardTitle>
              <CardDescription>The best route based on current traffic.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-2">
                {result.path.map(getNodeName).join(' → ')}
              </p>
              <div className="mt-4 text-center">
                <p className="text-lg">
                  Estimated time: <span className="font-bold">{result.time} minutes</span>
                </p>
                <p className="text-md text-muted-foreground">
                  Total distance: <span className="font-bold">{result.distance} km</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

