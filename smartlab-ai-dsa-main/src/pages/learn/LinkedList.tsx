import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlayCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TopicProblems from "@/components/TopicProblems";
import { linkedListProblems } from "@/utils/problemsData";

interface Node {
  value: number;
  id: string;
}

const LinkedList = () => {
  const [list, setList] = useState<Node[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAIExplanation = async (operation: string, value: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-explain", {
        body: {
          dataStructure: "linked-list",
          operation,
          value,
          currentState: list.map((n) => n.value).join(" -> "),
        },
      });

      if (error) throw error;
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      toast.error("Failed to get AI explanation");
    } finally {
      setIsLoading(false);
    }
  };

  const insertAtHead = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    const newNode: Node = { value, id: Date.now().toString() };
    setList([newNode, ...list]);
    getAIExplanation("insert at head", inputValue);
    setInputValue("");
  };

  const insertAtTail = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    const newNode: Node = { value, id: Date.now().toString() };
    setList([...list, newNode]);
    getAIExplanation("insert at tail", inputValue);
    setInputValue("");
  };

  const deleteAtHead = () => {
    if (list.length === 0) {
      toast.error("List is empty");
      return;
    }
    const deletedValue = list[0].value;
    setList(list.slice(1));
    getAIExplanation("delete from head", deletedValue.toString());
  };

  const search = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    const found = list.some((n) => n.value === value);
    toast[found ? "success" : "error"](found ? "Value found!" : "Value not found");
    getAIExplanation("search", inputValue);
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
          <h1 className="text-4xl font-bold">🔗 Linked List</h1>
          <p className="text-muted-foreground">
            A linear data structure where elements are connected via pointers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Linked List Visualization</CardTitle>
              <CardDescription>Watch nodes connect with pointers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center overflow-x-auto p-4">
                <div className="flex items-center gap-4">
                  {list.length === 0 ? (
                    <div className="text-muted-foreground text-center">
                      List is empty. Add some nodes!
                    </div>
                  ) : (
                    <AnimatePresence>
                      {list.map((node, index) => (
                        <motion.div
                          key={node.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className="bg-gradient-primary p-4 rounded-lg shadow-[var(--shadow-glow)] min-w-[80px] text-center">
                            <div className="text-2xl font-bold text-primary-foreground">
                              {node.value}
                            </div>
                          </div>
                          {index < list.length - 1 && (
                            <div className="text-2xl text-accent">→</div>
                          )}
                        </motion.div>
                      ))}
                      <div className="text-2xl text-muted-foreground">→ null</div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Interact with the linked list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && insertAtTail()}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={insertAtHead} className="w-full">
                  Insert at Head
                </Button>
                <Button onClick={insertAtTail} className="w-full">
                  Insert at Tail
                </Button>
                <Button onClick={deleteAtHead} variant="destructive" className="w-full">
                  Delete Head
                </Button>
                <Button onClick={search} variant="secondary" className="w-full">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Explanation */}
        {explanation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  AI Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{explanation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Linked Lists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Time Complexity:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Insert at Head: O(1)</li>
              <li>Insert at Tail: O(n) without tail pointer, O(1) with tail pointer</li>
              <li>Delete: O(1) for head, O(n) for others</li>
              <li>Search: O(n)</li>
            </ul>
            <p className="mt-4"><strong>Use Cases:</strong> Dynamic memory allocation, implementing stacks/queues, navigation systems</p>
          </CardContent>
        </Card>

        {/* Practice Problems Section */}
        <TopicProblems problems={linkedListProblems} topicName="Linked List" />
      </div>
    </div>
  );
};

export default LinkedList;
