import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArrayItem {
  value: number;
  color: "default" | "comparing" | "swapping" | "sorted";
}

const Sorting = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => ({
      value: Math.floor(Math.random() * 100) + 10,
      color: "default" as const,
    }));
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setAiExplanation("");
  };

  useEffect(() => {
    generateArray();
  }, []);

  const bubbleSort = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isPlaying) return;

        // Mark comparing elements
        arr[j].color = "comparing";
        arr[j + 1].color = "comparing";
        setArray([...arr]);
        await sleep(speed[0]);

        if (arr[j].value > arr[j + 1].value) {
          // Mark swapping
          arr[j].color = "swapping";
          arr[j + 1].color = "swapping";
          setArray([...arr]);
          await sleep(speed[0]);

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed[0]);

          // Get AI explanation for this swap
          getAIExplanation(j, j + 1, arr[j].value, arr[j + 1].value);
        }

        // Reset colors
        arr[j].color = "default";
        arr[j + 1].color = "default";
        setArray([...arr]);
      }

      // Mark sorted element
      arr[n - i - 1].color = "sorted";
      setArray([...arr]);
    }

    arr[0].color = "sorted";
    setArray([...arr]);
    setIsPlaying(false);
    toast.success("Array sorted!");
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const getAIExplanation = async (index1: number, index2: number, val1: number, val2: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-explain", {
        body: {
          dataStructure: "sorting",
          operation: "bubble_sort_swap",
          details: {
            index1,
            index2,
            value1: val1,
            value2: val2,
          },
        },
      });

      if (error) throw error;
      setAiExplanation(data.explanation);
    } catch (error) {
      console.error("AI explanation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (color: ArrayItem["color"]) => {
    switch (color) {
      case "comparing":
        return "bg-secondary";
      case "swapping":
        return "bg-accent";
      case "sorted":
        return "bg-primary";
      default:
        return "bg-gradient-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Bubble Sort Visualization</CardTitle>
                    <CardDescription>Watch the sorting algorithm in action</CardDescription>
                  </div>
                  <Badge variant="outline">Beginner</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Array Visualization */}
                <div className="bg-gradient-hero/10 rounded-lg p-8 min-h-[300px] flex items-end justify-center gap-2">
                  {array.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value * 2}px` }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`w-12 ${getBarColor(item.color)} rounded-t-lg relative transition-colors duration-300`}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold">
                        {item.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={bubbleSort}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                      disabled={array.every((item) => item.color === "sorted")}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Sorting
                        </>
                      )}
                    </Button>
                    <Button onClick={generateArray} variant="outline" disabled={isPlaying}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Animation Speed</span>
                      <span className="font-semibold">
                        {speed[0] === 100 ? "Fast" : speed[0] === 500 ? "Normal" : "Slow"}
                      </span>
                    </div>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={100}
                      max={1000}
                      step={450}
                      className="w-full"
                      disabled={isPlaying}
                    />
                  </div>
                </div>

                {/* Legend */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-primary rounded"></div>
                        <span>Unsorted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-secondary rounded"></div>
                        <span>Comparing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent rounded"></div>
                        <span>Swapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded"></div>
                        <span>Sorted</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Explanation
                </CardTitle>
                <CardDescription>Understanding each step of the algorithm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : aiExplanation ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed">{aiExplanation}</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Start sorting to see AI-powered step-by-step explanations
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Bubble Sort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  <strong>Bubble Sort</strong> is a simple sorting algorithm that repeatedly steps through the list,
                  compares adjacent elements, and swaps them if they're in the wrong order.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">How it works:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Compare adjacent elements</li>
                    <li>Swap if left element is greater than right</li>
                    <li>Continue until no more swaps are needed</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Complexity:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Time:</strong> O(n²) worst case
                    </li>
                    <li>
                      <strong>Space:</strong> O(1) - sorts in place
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sorting;
