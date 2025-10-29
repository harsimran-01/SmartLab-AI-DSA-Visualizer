import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Plus, Search, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface HashEntry {
  key: string;
  value: string;
}

const Hashing = () => {
  const [tableSize] = useState(10);
  const [hashTable, setHashTable] = useState<(HashEntry | null)[]>(Array(10).fill(null));
  const [collisionMethod, setCollisionMethod] = useState<"linear" | "chaining">("linear");
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % tableSize;
    }
    return hash;
  };

  const insert = () => {
    if (!inputKey.trim() || !inputValue.trim()) return;

    const hash = hashFunction(inputKey);
    const newTable = [...hashTable];
    let index = hash;
    let attempts = 0;

    setHighlightIndex(hash);

    if (collisionMethod === "linear") {
      while (newTable[index] !== null && attempts < tableSize) {
        index = (index + 1) % tableSize;
        attempts++;
      }

      if (attempts === tableSize) {
        toast.error("Hash table is full!");
        return;
      }

      newTable[index] = { key: inputKey, value: inputValue };
      
      if (index !== hash) {
        toast.success(`Collision! Inserted at index ${index} using linear probing`);
      } else {
        toast.success(`Inserted at index ${index}`);
      }
    }

    setHashTable(newTable);
    setInputKey("");
    setInputValue("");
    setTimeout(() => setHighlightIndex(null), 1500);
  };

  const search = () => {
    if (!searchKey.trim()) return;

    const hash = hashFunction(searchKey);
    let index = hash;
    let attempts = 0;

    setHighlightIndex(hash);

    while (hashTable[index] !== null && attempts < tableSize) {
      if (hashTable[index]?.key === searchKey) {
        toast.success(`Found "${searchKey}" at index ${index}`);
        setTimeout(() => setHighlightIndex(null), 2000);
        return;
      }
      index = (index + 1) % tableSize;
      attempts++;
    }

    toast.error(`"${searchKey}" not found!`);
    setTimeout(() => setHighlightIndex(null), 1500);
  };

  const deleteKey = () => {
    if (!searchKey.trim()) return;

    const hash = hashFunction(searchKey);
    let index = hash;
    let attempts = 0;

    while (hashTable[index] !== null && attempts < tableSize) {
      if (hashTable[index]?.key === searchKey) {
        const newTable = [...hashTable];
        newTable[index] = null;
        setHashTable(newTable);
        toast.success(`Deleted "${searchKey}" from index ${index}`);
        setSearchKey("");
        return;
      }
      index = (index + 1) % tableSize;
      attempts++;
    }

    toast.error(`"${searchKey}" not found!`);
  };

  const reset = () => {
    setHashTable(Array(tableSize).fill(null));
    setInputKey("");
    setInputValue("");
    setSearchKey("");
    setHighlightIndex(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Hash Tables & Collision Resolution</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Hash Table Visualization</CardTitle>
                <CardDescription>
                  See how collision resolution works in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <AnimatePresence>
                    {hashTable.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                          highlightIndex === index
                            ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                            : entry
                            ? "border-secondary bg-secondary/10"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="w-12 font-bold text-muted-foreground">[{index}]</div>
                        {entry ? (
                          <div className="flex-1 flex items-center gap-2">
                            <span className="font-mono text-primary">{entry.key}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-mono">{entry.value}</span>
                          </div>
                        ) : (
                          <div className="flex-1 text-muted-foreground italic">empty</div>
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
                <CardTitle>Insert Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Collision Method</label>
                  <Select value={collisionMethod} onValueChange={(v: any) => setCollisionMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Probing</SelectItem>
                      <SelectItem value="chaining">Chaining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Key</label>
                  <Input
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="e.g., name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Value</label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., John"
                  />
                </div>

                <Button onClick={insert} className="w-full bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Insert
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search / Delete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Key</label>
                  <Input
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Enter key to search"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={search} variant="outline" className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button onClick={deleteKey} variant="outline" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                <Button onClick={reset} variant="outline" className="w-full">
                  Reset
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-500">How it works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Hash function: sum of char codes % table size</p>
                <p>• Linear probing: move to next slot on collision</p>
                <p>• Chaining: store multiple entries per slot</p>
                <p className="font-bold text-primary mt-4">
                  Time: O(1) avg, O(n) worst
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hashing;
