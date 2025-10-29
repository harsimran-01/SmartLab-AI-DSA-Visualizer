import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Code, Lightbulb, AlertCircle, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [explanation, setExplanation] = useState("");
  const [errors, setErrors] = useState("");
  const [optimization, setOptimization] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setExplanation("");
    setErrors("");
    setOptimization("");

    try {
      const { data, error } = await supabase.functions.invoke("code-explainer", {
        body: { code, language },
      });

      if (error) throw error;

      setExplanation(data.explanation);
      setErrors(data.errors);
      setOptimization(data.optimization);
    } catch (error) {
      console.error("Error:", error);
      setExplanation("Sorry, I encountered an error analyzing your code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">AI Code Explainer</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Paste Your Code
              </CardTitle>
              <CardDescription>
                Paste your C++, Java, or Python code and get instant AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="font-mono min-h-[300px]"
              />

              <Button
                onClick={analyzeCode}
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-primary"
              >
                {isLoading ? "Analyzing..." : "Analyze Code"}
                <Brain className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {(explanation || errors || optimization) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {explanation && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="h-full border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-500">
                        <Lightbulb className="w-5 h-5" />
                        Explanation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{explanation}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {errors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="h-full border-red-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        Potential Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{errors}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {optimization && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="h-full border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-500">
                        <Zap className="w-5 h-5" />
                        Optimization Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{optimization}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CodeExplainer;
