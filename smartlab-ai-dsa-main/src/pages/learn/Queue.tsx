import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TopicProblems from "@/components/TopicProblems";
import { queueProblems } from "@/utils/problemsData";

const Queue = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const enqueue = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value");
      return;
    }
    setQueue([...queue, inputValue]);
    setInputValue("");
    toast.success(`Enqueued "${inputValue}"`);
    getAIExplanation("enqueue", inputValue);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      toast.error("Queue is empty!");
      return;
    }
    const dequeued = queue[0];
    setQueue(queue.slice(1));
    toast.success(`Dequeued "${dequeued}"`);
    getAIExplanation("dequeue", dequeued);
  };

  const reset = () => {
    setQueue([]);
    setAiExplanation("");
    toast.info("Queue cleared");
  };

  const getAIExplanation = async (operation: string, value: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-explain", {
        body: {
          dataStructure: "queue",
          operation,
          value,
          currentState: queue,
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
                    <CardTitle className="text-2xl">Queue Visualization</CardTitle>
                    <CardDescription>First In, First Out (FIFO) Data Structure</CardDescription>
                  </div>
                  <Badge variant="outline">Beginner</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Queue Display */}
                <div className="relative bg-gradient-hero/10 rounded-lg p-8 min-h-[200px] overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">Front →</div>
                    <AnimatePresence mode="popLayout">
                      {queue.map((item, index) => (
                        <motion.div
                          key={`${item}-${index}`}
                          initial={{ opacity: 0, x: -50, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -50, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          layout
                        >
                          <div className="bg-gradient-secondary p-4 rounded-lg text-center font-mono text-lg font-semibold text-secondary-foreground shadow-lg min-w-[100px]">
                            {item}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {queue.length > 0 && <div className="text-sm text-muted-foreground whitespace-nowrap">← Rear</div>}
                  </div>
                  {queue.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Queue is empty. Enqueue an item to begin!
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
                      onKeyPress={(e) => e.key === "Enter" && enqueue()}
                    />
                    <Button onClick={enqueue} className="bg-gradient-secondary hover:opacity-90">
                      Enqueue
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={dequeue} variant="outline" className="flex-1" disabled={queue.length === 0}>
                      Dequeue
                    </Button>
                    <Button onClick={reset} variant="outline">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Queue Info */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-semibold">{queue.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Front Element:</span>
                      <span className="font-semibold">{queue[0] || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rear Element:</span>
                      <span className="font-semibold">{queue[queue.length - 1] || "N/A"}</span>
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
                  <Sparkles className="w-5 h-5 text-secondary" />
                  AI Explanation
                </CardTitle>
                <CardDescription>Real-time guidance powered by AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
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
                <CardTitle>What is a Queue?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  A <strong>Queue</strong> is a linear data structure that follows the First In, First Out (FIFO)
                  principle. Think of it like a line of people waiting - the first person in line is served first.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Operations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Enqueue:</strong> Add an element to the rear
                    </li>
                    <li>
                      <strong>Dequeue:</strong> Remove the front element
                    </li>
                    <li>
                      <strong>Peek:</strong> View the front element without removing it
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Real-world Examples:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Print job queue in printers</li>
                    <li>Customer service call centers</li>
                    <li>Task scheduling in operating systems</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Practice Problems Section */}
        <div className="mt-8">
          <TopicProblems problems={queueProblems} topicName="Queue" />
        </div>
      </div>
    </div>
  );
};

export default Queue;
