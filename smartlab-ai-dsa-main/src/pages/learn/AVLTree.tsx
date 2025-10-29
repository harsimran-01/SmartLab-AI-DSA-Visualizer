import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Brain, Plus, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
  x?: number;
  y?: number;
}

const AVLTree = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [rotationMsg, setRotationMsg] = useState("");
  const [speed, setSpeed] = useState([50]);

  const getHeight = (node: TreeNode | null): number => {
    return node ? node.height : 0;
  };

  const getBalance = (node: TreeNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const updateHeight = (node: TreeNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  const rightRotate = (y: TreeNode): TreeNode => {
    setRotationMsg("Right Rotation performed!");
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
  };

  const leftRotate = (x: TreeNode): TreeNode => {
    setRotationMsg("Left Rotation performed!");
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
  };

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
      return { value, left: null, right: null, height: 1 };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      return node;
    }

    updateHeight(node);

    const balance = getBalance(node);

    // Left Left
    if (balance > 1 && value < node.left!.value) {
      return rightRotate(node);
    }

    // Right Right
    if (balance < -1 && value > node.right!.value) {
      return leftRotate(node);
    }

    // Left Right
    if (balance > 1 && value > node.left!.value) {
      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }

    // Right Left
    if (balance < -1 && value < node.right!.value) {
      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }

    return node;
  };

  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    spacing: number
  ): void => {
    if (!node) return;

    node.x = x;
    node.y = y;

    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, spacing / 2);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, spacing / 2);
    }
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setRotationMsg("");
    const newRoot = insertNode(root, value);
    calculatePositions(newRoot, 300, 50, 100);
    setRoot(newRoot);
    setInputValue("");

    setTimeout(() => setRotationMsg(""), 2000);
  };

  const reset = () => {
    setRoot(null);
    setInputValue("");
    setRotationMsg("");
  };

  const renderTree = (node: TreeNode | null): JSX.Element[] => {
    if (!node || node.x === undefined || node.y === undefined) return [];

    const elements: JSX.Element[] = [];
    const balance = getBalance(node);

    if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
      elements.push(
        <line
          key={`line-left-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.left));
    }

    if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
      elements.push(
        <line
          key={`line-right-${node.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
      );
      elements.push(...renderTree(node.right));
    }

    elements.push(
      <g key={`node-${node.value}`}>
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          cx={node.x}
          cy={node.y}
          r="25"
          fill={Math.abs(balance) <= 1 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          fill="hsl(var(--primary-foreground))"
          className="font-bold"
        >
          {node.value}
        </text>
        <text
          x={node.x + 35}
          y={node.y}
          fill="hsl(var(--muted-foreground))"
          className="text-xs"
        >
          {balance}
        </text>
      </g>
    );

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">AVL Tree (Self-Balancing BST)</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>AVL Tree Visualization</CardTitle>
                <CardDescription>
                  Watch automatic rotations maintain balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[500px] bg-muted/30 rounded-lg overflow-auto">
                  <svg className="w-full h-full min-w-[600px]">
                    <AnimatePresence>{renderTree(root)}</AnimatePresence>
                  </svg>
                  {!root && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Insert nodes to see the AVL tree
                    </div>
                  )}
                </div>
                {rotationMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-center text-primary font-semibold"
                  >
                    {rotationMsg}
                  </motion.div>
                )}
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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Animation Speed: {speed[0]}%
                  </label>
                  <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} />
                </div>

                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Tree
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-500">AVL Properties</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Balance Factor = height(left) - height(right)</p>
                <p>• Must be -1, 0, or 1 for all nodes</p>
                <p>• Rotations restore balance:</p>
                <p className="ml-4">- Left-Left: Right Rotation</p>
                <p className="ml-4">- Right-Right: Left Rotation</p>
                <p className="ml-4">- Left-Right: Left then Right</p>
                <p className="ml-4">- Right-Left: Right then Left</p>
                <p className="font-bold text-primary mt-4">Time: O(log n) for all ops</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AVLTree;
