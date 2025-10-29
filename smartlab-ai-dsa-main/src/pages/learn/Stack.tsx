import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import TopicProblems from "@/components/TopicProblems";
import { stackProblems } from "@/utils/problemsData";

const Stack = () => {
  const { user } = useAuth();
  const [stack, setStack] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const push = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value");
      return;
    }
    setStack([...stack, inputValue]);
    setInputValue("");
    toast.success(`Pushed "${inputValue}" to stack`);
    getAIExplanation("push", inputValue);
  };

  const pop = () => {
    if (stack.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    toast.success(`Popped "${popped}" from stack`);
    getAIExplanation("pop", popped);
  };

  const reset = () => {
    setStack([]);
    setAiExplanation("");
    toast.info("Stack cleared");
  };

  const getAIExplanation = async (operation: string, value: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-explain", {
        body: {
          dataStructure: "stack",
          operation,
          value,
          currentState: stack,
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
                    <CardTitle className="text-2xl">Stack Visualization</CardTitle>
                    <CardDescription>Last In, First Out (LIFO) Data Structure</CardDescription>
                  </div>
                  <Badge variant="outline">Beginner</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stack Display */}
                <div className="relative bg-gradient-hero/10 rounded-lg p-8 min-h-[400px] flex flex-col-reverse items-center justify-end">
                  <AnimatePresence>
                    {stack.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-xs mb-2"
                      >
                        <div className="bg-gradient-primary p-4 rounded-lg text-center font-mono text-lg font-semibold text-primary-foreground shadow-lg">
                          {item}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {stack.length === 0 && (
                    <div className="text-muted-foreground text-center">
                      Stack is empty. Push an item to begin!
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter value..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && push()}
                    />
                    <Button onClick={push} className="bg-gradient-primary hover:opacity-90">
                      Push
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={pop} variant="outline" className="flex-1" disabled={stack.length === 0}>
                      Pop
                    </Button>
                    <Button onClick={reset} variant="outline">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stack Info */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-semibold">{stack.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top Element:</span>
                      <span className="font-semibold">{stack[stack.length - 1] || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Is Empty:</span>
                      <span className="font-semibold">{stack.length === 0 ? "Yes" : "No"}</span>
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
                <CardDescription>Real-time guidance powered by AI</CardDescription>
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
                    Perform an operation to get AI-powered explanations
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What is a Stack?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  A <strong>Stack</strong> is a linear data structure that follows the Last In, First Out (LIFO)
                  principle. Think of it like a stack of plates - you can only add or remove from the top.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Operations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Push:</strong> Add an element to the top
                    </li>
                    <li>
                      <strong>Pop:</strong> Remove the top element
                    </li>
                    <li>
                      <strong>Peek:</strong> View the top element without removing it
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Real-world Examples:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Browser back button history</li>
                    <li>Undo/Redo operations in text editors</li>
                    <li>Function call stack in programming</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Practice Problems Section */}
        <div className="mt-8">
          <TopicProblems problems={stackProblems} topicName="Stack" />
        </div>
      </div>
    </div>
  );
};

export default Stack;
