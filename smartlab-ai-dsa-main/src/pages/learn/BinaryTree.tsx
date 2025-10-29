import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

const BinaryTree = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [traversal, setTraversal] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState("");
  const [explanation, setExplanation] = useState("");

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else {
      node.right = insertNode(node.right, value);
    }
    return node;
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setRoot(insertNode(root, value));
    toast.success(`Inserted ${value}`);
    setInputValue("");
  };

  const inorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (!node) return result;
    inorderTraversal(node.left, result);
    result.push(node.value);
    inorderTraversal(node.right, result);
    return result;
  };

  const preorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (!node) return result;
    result.push(node.value);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
    return result;
  };

  const postorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (!node) return result;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.value);
    return result;
  };

  const traverse = (type: string) => {
    let result: number[] = [];
    if (type === "inorder") result = inorderTraversal(root);
    else if (type === "preorder") result = preorderTraversal(root);
    else if (type === "postorder") result = postorderTraversal(root);

    setTraversal(result);
    setTraversalType(type);
    toast.success(`${type} traversal: ${result.join(", ")}`);
  };

  const renderTree = (node: TreeNode | null, x: number, y: number, offset: number): JSX.Element | null => {
    if (!node) return null;

    const nodeSize = 50;
    const verticalGap = 80;

    return (
      <g key={`${node.value}-${x}-${y}`}>
        {node.left && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x - offset}
              y2={y + verticalGap}
              stroke="hsl(var(--accent))"
              strokeWidth="2"
            />
            {renderTree(node.left, x - offset, y + verticalGap, offset / 2)}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x + offset}
              y2={y + verticalGap}
              stroke="hsl(var(--accent))"
              strokeWidth="2"
            />
            {renderTree(node.right, x + offset, y + verticalGap, offset / 2)}
          </>
        )}
        <circle
          cx={x}
          cy={y}
          r={nodeSize / 2}
          fill="hsl(var(--primary))"
          stroke="hsl(var(--accent))"
          strokeWidth="3"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="18"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );
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
          <h1 className="text-4xl font-bold">🌳 Binary Search Tree</h1>
          <p className="text-muted-foreground">
            A hierarchical data structure with left values smaller and right values larger
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tree Visualization</CardTitle>
              <CardDescription>See the tree structure and relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg overflow-auto">
                {!root ? (
                  <div className="text-muted-foreground">Tree is empty. Insert some nodes!</div>
                ) : (
                  <svg width="800" height="400" className="mx-auto">
                    {renderTree(root, 400, 40, 150)}
                  </svg>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert nodes and traverse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && insert()}
                />
                <Button onClick={insert}>Insert</Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Traversals:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => traverse("inorder")} variant="secondary" size="sm">
                    Inorder
                  </Button>
                  <Button onClick={() => traverse("preorder")} variant="secondary" size="sm">
                    Preorder
                  </Button>
                  <Button onClick={() => traverse("postorder")} variant="secondary" size="sm">
                    Postorder
                  </Button>
                </div>
              </div>
              {traversal.length > 0 && (
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-semibold capitalize">{traversalType}:</p>
                  <p className="text-lg font-mono">{traversal.join(" → ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>About Binary Search Trees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Insert: O(log n) average, O(n) worst</li>
                <li>Search: O(log n) average, O(n) worst</li>
                <li>Delete: O(log n) average, O(n) worst</li>
              </ul>
              <p className="mt-4"><strong>Traversals:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Inorder: Left → Root → Right (sorted order)</li>
                <li>Preorder: Root → Left → Right</li>
                <li>Postorder: Left → Right → Root</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BinaryTree;
