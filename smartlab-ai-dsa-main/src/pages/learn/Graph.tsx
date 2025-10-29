import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Edge {
  from: number;
  to: number;
}

const Graph = () => {
  const [nodes, setNodes] = useState<number[]>([0, 1, 2, 3, 4]);
  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
  ]);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [path, setPath] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const bfs = async (start: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const visitedSet = new Set<number>();
    const queue = [start];
    const pathArray: number[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visitedSet.has(node)) continue;

      visitedSet.add(node);
      pathArray.push(node);
      setVisited(new Set(visitedSet));
      setPath([...pathArray]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const neighbors = edges.filter((e) => e.from === node).map((e) => e.to);
      queue.push(...neighbors.filter((n) => !visitedSet.has(n)));
    }

    toast.success("BFS traversal complete!");
    setIsAnimating(false);
  };

  const dfs = async (start: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const visitedSet = new Set<number>();
    const pathArray: number[] = [];

    const dfsHelper = async (node: number) => {
      if (visitedSet.has(node)) return;

      visitedSet.add(node);
      pathArray.push(node);
      setVisited(new Set(visitedSet));
      setPath([...pathArray]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const neighbors = edges.filter((e) => e.from === node).map((e) => e.to);
      for (const neighbor of neighbors) {
        await dfsHelper(neighbor);
      }
    };

    await dfsHelper(start);
    toast.success("DFS traversal complete!");
    setIsAnimating(false);
  };

  const reset = () => {
    setVisited(new Set());
    setPath([]);
    setIsAnimating(false);
  };

  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 200, y: 50 },
    1: { x: 100, y: 150 },
    2: { x: 300, y: 150 },
    3: { x: 50, y: 250 },
    4: { x: 350, y: 250 },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🕸️ Graph Traversal</h1>
          <p className="text-muted-foreground">
            Explore vertices and edges using BFS and DFS algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Graph Visualization</CardTitle>
              <CardDescription>Watch the traversal algorithms in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
                <svg width="400" height="300" className="mx-auto">
                  {/* Draw edges */}
                  {edges.map((edge, idx) => (
                    <line
                      key={idx}
                      x1={positions[edge.from].x}
                      y1={positions[edge.from].y}
                      x2={positions[edge.to].x}
                      y2={positions[edge.to].y}
                      stroke="hsl(var(--accent))"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Draw nodes */}
                  {nodes.map((node) => (
                    <g key={node}>
                      <circle
                        cx={positions[node].x}
                        cy={positions[node].y}
                        r="25"
                        fill={
                          visited.has(node)
                            ? "hsl(var(--secondary))"
                            : "hsl(var(--primary))"
                        }
                        stroke="hsl(var(--accent))"
                        strokeWidth="3"
                      />
                      <text
                        x={positions[node].x}
                        y={positions[node].y + 5}
                        textAnchor="middle"
                        fill="hsl(var(--primary-foreground))"
                        fontSize="18"
                        fontWeight="bold"
                      >
                        {node}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Traversal Operations</CardTitle>
              <CardDescription>Run BFS or DFS from node 0</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => bfs(0)} disabled={isAnimating} className="w-full">
                  BFS
                </Button>
                <Button onClick={() => dfs(0)} disabled={isAnimating} className="w-full">
                  DFS
                </Button>
                <Button onClick={reset} variant="secondary" className="w-full">
                  Reset
                </Button>
              </div>
              {path.length > 0 && (
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-semibold">Traversal Path:</p>
                  <p className="text-lg font-mono">{path.join(" → ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>About Graph Traversal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>BFS (Breadth-First Search):</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Explores neighbors level by level</li>
                <li>Uses a queue data structure</li>
                <li>Time: O(V + E), Space: O(V)</li>
              </ul>
              <p className="mt-4"><strong>DFS (Depth-First Search):</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Explores as deep as possible first</li>
                <li>Uses recursion or a stack</li>
                <li>Time: O(V + E), Space: O(V)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Graph;
