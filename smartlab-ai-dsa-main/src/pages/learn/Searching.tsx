import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Searching = () => {
  const [array, setArray] = useState<number[]>([3, 7, 12, 18, 24, 31, 45, 56, 67, 78]);
  const [searchValue, setSearchValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [algorithm, setAlgorithm] = useState<"linear" | "binary">("linear");

  const linearSearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      toast.error("Please enter a valid number");
      return;
    }

    setIsAnimating(true);
    setFound(null);

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (array[i] === target) {
        setFound(true);
        toast.success(`Found ${target} at index ${i}!`);
        setIsAnimating(false);
        return;
      }
    }

    setFound(false);
    setCurrentIndex(null);
    toast.error(`${target} not found in array`);
    setIsAnimating(false);
  };

  const binarySearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      toast.error("Please enter a valid number");
      return;
    }

    setIsAnimating(true);
    setFound(null);
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (array[mid] === target) {
        setFound(true);
        toast.success(`Found ${target} at index ${mid}!`);
        setIsAnimating(false);
        return;
      } else if (array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setFound(false);
    setCurrentIndex(null);
    toast.error(`${target} not found in array`);
    setIsAnimating(false);
  };

  const reset = () => {
    setCurrentIndex(null);
    setFound(null);
    setIsAnimating(false);
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
          <h1 className="text-4xl font-bold">🔍 Searching Algorithms</h1>
          <p className="text-muted-foreground">
            Master Linear and Binary Search with visual animations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Array Visualization</CardTitle>
              <CardDescription>Watch the search algorithm in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center gap-2 p-4">
                {array.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`w-16 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 ${
                        currentIndex === index
                          ? found === true
                            ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                            : "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                          : found === false && currentIndex === null
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                      style={{ height: `${value * 2}px` }}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">{index}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Search Operations</CardTitle>
              <CardDescription>Enter a value to search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter value to search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button onClick={reset} variant="secondary">
                  Reset
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={linearSearch}
                  disabled={isAnimating}
                  className="w-full"
                  variant={algorithm === "linear" ? "default" : "outline"}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Linear Search
                </Button>
                <Button
                  onClick={binarySearch}
                  disabled={isAnimating}
                  className="w-full"
                  variant={algorithm === "binary" ? "default" : "outline"}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Binary Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Linear Search:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Checks each element sequentially</li>
                  <li>Works on unsorted arrays</li>
                  <li>Time Complexity: O(n)</li>
                  <li>Space Complexity: O(1)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Binary Search:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Divides array in half each time</li>
                  <li>Requires sorted array</li>
                  <li>Time Complexity: O(log n)</li>
                  <li>Space Complexity: O(1)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Searching;
