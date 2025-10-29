import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Plus, Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Heap = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [heapType, setHeapType] = useState<"max" | "min">("max");
  const [inputValue, setInputValue] = useState("");
  const [animatingNodes, setAnimatingNodes] = useState<number[]>([]);

  const getParent = (i: number) => Math.floor((i - 1) / 2);
  const getLeft = (i: number) => 2 * i + 1;
  const getRight = (i: number) => 2 * i + 2;

  const heapifyUp = (arr: number[], index: number, type: "max" | "min") => {
    const newHeap = [...arr];
    let current = index;

    while (current > 0) {
      const parent = getParent(current);
      const shouldSwap = type === "max" 
        ? newHeap[current] > newHeap[parent]
        : newHeap[current] < newHeap[parent];

      if (shouldSwap) {
        [newHeap[current], newHeap[parent]] = [newHeap[parent], newHeap[current]];
        setAnimatingNodes([current, parent]);
        current = parent;
      } else {
        break;
      }
    }
    return newHeap;
  };

  const heapifyDown = (arr: number[], index: number, type: "max" | "min") => {
    const newHeap = [...arr];
    let current = index;
    const size = newHeap.length;

    while (true) {
      const left = getLeft(current);
      const right = getRight(current);
      let target = current;

      if (left < size) {
        const shouldSwap = type === "max"
          ? newHeap[left] > newHeap[target]
          : newHeap[left] < newHeap[target];
        if (shouldSwap) target = left;
      }

      if (right < size) {
        const shouldSwap = type === "max"
          ? newHeap[right] > newHeap[target]
          : newHeap[right] < newHeap[target];
        if (shouldSwap) target = right;
      }

      if (target === current) break;

      [newHeap[current], newHeap[target]] = [newHeap[target], newHeap[current]];
      setAnimatingNodes([current, target]);
      current = target;
    }

    return newHeap;
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newHeap = [...heap, value];
    const heapified = heapifyUp(newHeap, newHeap.length - 1, heapType);
    setHeap(heapified);
    setInputValue("");
    toast.success(`Inserted ${value}`);
    setTimeout(() => setAnimatingNodes([]), 500);
  };

  const extractRoot = () => {
    if (heap.length === 0) {
      toast.error("Heap is empty!");
      return;
    }

    const root = heap[0];
    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();

    const heapified = heapifyDown(newHeap, 0, heapType);
    setHeap(heapified);
    toast.success(`Extracted ${root}`);
    setTimeout(() => setAnimatingNodes([]), 500);
  };

  const reset = () => {
    setHeap([]);
    setInputValue("");
    setAnimatingNodes([]);
  };

  const getNodePosition = (index: number): { x: number; y: number } => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const spacing = 600 / (nodesInLevel + 1);

    return {
      x: spacing * (positionInLevel + 1),
      y: 50 + level * 80,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Heap & Priority Queue</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Heap Visualization</CardTitle>
                <CardDescription>
                  Watch heapify process maintain heap property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] bg-muted/30 rounded-lg overflow-auto">
                  <svg className="w-full h-full min-w-[600px]">
                    {heap.map((_, index) => {
                      const pos = getNodePosition(index);
                      const leftChild = getLeft(index);
                      const rightChild = getRight(index);

                      return (
                        <g key={`edges-${index}`}>
                          {leftChild < heap.length && (
                            <line
                              x1={pos.x}
                              y1={pos.y}
                              x2={getNodePosition(leftChild).x}
                              y2={getNodePosition(leftChild).y}
                              stroke="hsl(var(--border))"
                              strokeWidth="2"
                            />
                          )}
                          {rightChild < heap.length && (
                            <line
                              x1={pos.x}
                              y1={pos.y}
                              x2={getNodePosition(rightChild).x}
                              y2={getNodePosition(rightChild).y}
                              stroke="hsl(var(--border))"
                              strokeWidth="2"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  <AnimatePresence>
                    {heap.map((value, index) => {
                      const pos = getNodePosition(index);
                      return (
                        <motion.div
                          key={`node-${index}-${value}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute"
                          style={{
                            left: pos.x - 25,
                            top: pos.y - 25,
                          }}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                              animatingNodes.includes(index)
                                ? "bg-primary text-primary-foreground border-primary scale-125 shadow-[var(--shadow-glow)]"
                                : index === 0
                                ? "bg-accent text-accent-foreground border-accent"
                                : "bg-secondary text-secondary-foreground border-secondary"
                            }`}
                          >
                            {value}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {heap.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Insert values to build the heap
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono">
                    Array representation: [{heap.join(", ")}]
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Heap Type</label>
                  <Select value={heapType} onValueChange={(v: any) => setHeapType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="max">Max Heap</SelectItem>
                      <SelectItem value="min">Min Heap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Insert Value</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && insert()}
                      placeholder="Enter number"
                    />
                    <Button onClick={insert} className="bg-gradient-primary">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={extractRoot} variant="outline" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Extract {heapType === "max" ? "Max" : "Min"}
                </Button>

                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-500">Heap Properties</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Complete binary tree structure</p>
                <p>• Max Heap: parent ≥ children</p>
                <p>• Min Heap: parent ≤ children</p>
                <p>• Array storage: left=2i+1, right=2i+2</p>
                <p>• Heapify maintains heap property</p>
                <p className="font-bold text-primary mt-4">
                  Insert: O(log n), Extract: O(log n)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heap;
