import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Brain, Play, RotateCcw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Edge {
  from: number;
  to: number;
  weight: number;
}

const Dijkstra = () => {
  const [nodes] = useState([0, 1, 2, 3, 4]);
  const [edges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 1 },
    { from: 2, to: 1, weight: 2 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 3, weight: 5 },
    { from: 3, to: 4, weight: 3 },
  ]);
  const [startNode, setStartNode] = useState(0);
  const [distances, setDistances] = useState<number[]>([]);
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([50]);

  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 100, y: 150 },
    1: { x: 250, y: 50 },
    2: { x: 250, y: 250 },
    3: { x: 400, y: 150 },
    4: { x: 550, y: 150 },
  };

  const runDijkstra = async () => {
    setIsRunning(true);
    const dist = Array(nodes.length).fill(Infinity);
    const vis: number[] = [];
    dist[startNode] = 0;
    setDistances([...dist]);

    const delay = (101 - speed[0]) * 20;

    for (let i = 0; i < nodes.length; i++) {
      let minDist = Infinity;
      let minNode = -1;

      for (let j = 0; j < nodes.length; j++) {
        if (!vis.includes(j) && dist[j] < minDist) {
          minDist = dist[j];
          minNode = j;
        }
      }

      if (minNode === -1) break;

      setCurrent(minNode);
      await new Promise((resolve) => setTimeout(resolve, delay));

      vis.push(minNode);
      setVisited([...vis]);

      for (const edge of edges) {
        if (edge.from === minNode && !vis.includes(edge.to)) {
          const newDist = dist[minNode] + edge.weight;
          if (newDist < dist[edge.to]) {
            dist[edge.to] = newDist;
            setDistances([...dist]);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    }

    setCurrent(-1);
    setIsRunning(false);
  };

  const reset = () => {
    setDistances([]);
    setVisited([]);
    setCurrent(-1);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Dijkstra's Algorithm</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Shortest Path Visualization</CardTitle>
                <CardDescription>
                  Finding shortest paths from start node to all other nodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] bg-muted/30 rounded-lg p-4">
                  <svg className="w-full h-full">
                    {edges.map((edge, idx) => {
                      const from = positions[edge.from];
                      const to = positions[edge.to];
                      return (
                        <g key={idx}>
                          <line
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            stroke="hsl(var(--border))"
                            strokeWidth="2"
                          />
                          <text
                            x={(from.x + to.x) / 2}
                            y={(from.y + to.y) / 2}
                            fill="hsl(var(--primary))"
                            className="text-sm font-bold"
                          >
                            {edge.weight}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <AnimatePresence>
                    {nodes.map((node) => (
                      <motion.div
                        key={node}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute"
                        style={{
                          left: positions[node].x - 25,
                          top: positions[node].y - 25,
                        }}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                            node === current
                              ? "bg-primary text-primary-foreground border-primary scale-125 shadow-[var(--shadow-glow)]"
                              : visited.includes(node)
                              ? "bg-secondary text-secondary-foreground border-secondary"
                              : node === startNode
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-card text-foreground border-border"
                          }`}
                        >
                          {node}
                        </div>
                        {distances[node] !== undefined && distances[node] !== Infinity && (
                          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold text-primary">
                            {distances[node]}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Node</label>
                  <Input
                    type="number"
                    min={0}
                    max={nodes.length - 1}
                    value={startNode}
                    onChange={(e) => setStartNode(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Speed: {speed[0]}%
                  </label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={1}
                    max={100}
                    step={1}
                    disabled={isRunning}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={runDijkstra}
                    disabled={isRunning}
                    className="flex-1 bg-gradient-primary"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isRunning}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-500">How it works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>1. Start with source node (distance 0)</p>
                <p>2. Visit unvisited node with minimum distance</p>
                <p>3. Update distances to neighbors</p>
                <p>4. Mark current node as visited</p>
                <p>5. Repeat until all nodes visited</p>
                <p className="font-bold text-primary mt-4">
                  Time: O((V+E)log V), Space: O(V)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dijkstra;
