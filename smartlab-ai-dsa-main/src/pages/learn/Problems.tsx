import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Code, Play, CheckCircle, XCircle, Eye, Loader2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { codeTemplates, getDefaultTemplate } from "@/utils/codeTemplates";
import { usePointsAndBadges } from "@/hooks/usePointsAndBadges";

import { allProblems, type Problem } from "@/utils/problemsData";

const problems = allProblems;

const Problems = () => {
  const { user } = useAuth();
  const { markTopicComplete, awardPoints } = usePointsAndBadges();
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  const [filterTopic, setFilterTopic] = useState<string>("All");

  const topics = ["All", ...Array.from(new Set(problems.flatMap(p => p.topics)))];
  const filteredProblems = filterTopic === "All" 
    ? problems 
    : problems.filter(p => p.topics.includes(filterTopic));

  useEffect(() => {
    loadSolvedProblems();
    loadCodeTemplate();
  }, [selectedProblem, language]);

  const loadSolvedProblems = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('solved_problems')
      .select('problem_id')
      .eq('user_id', user.id);
    
    if (data) {
      setSolvedProblems(new Set(data.map((p) => p.problem_id)));
    }
  };

  const loadCodeTemplate = () => {
    const template = codeTemplates[selectedProblem.id]?.[language] || getDefaultTemplate(language);
    setCode(template);
    setOutput("");
    setTestResults([]);
    setShowSolution(false);
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("execute-code", {
        body: {
          code,
          language,
          testCases: selectedProblem.testCases.map(tc => ({
            input: tc.input,
            expected: tc.expected
          }))
        },
      });

      if (error) throw error;

      if (data.success) {
        setOutput(data.output || "Code executed successfully!");
        setTestResults(data.testResults || []);
        
        if (data.allTestsPassed && user) {
          await markProblemSolved(data.executionTime);
          toast.success("🎉 All test cases passed!");
        } else if (data.testResults && data.testResults.length > 0) {
          const passed = data.testResults.filter((r: any) => r.passed).length;
          toast.info(`${passed}/${data.testResults.length} test cases passed`);
        }
      } else {
        setOutput(data.error || data.output || "Execution failed");
        toast.error("Code execution failed");
      }
    } catch (error: any) {
      setOutput(error.message || "Error executing code");
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const markProblemSolved = async (executionTime: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('solved_problems')
        .upsert({
          user_id: user.id,
          problem_id: selectedProblem.id,
          problem_title: selectedProblem.title,
          language,
          solution_code: code,
          execution_time_ms: executionTime
        });

      if (!error) {
        setSolvedProblems(prev => new Set([...prev, selectedProblem.id]));
        
        // Award points based on difficulty
        const points = selectedProblem.difficulty === "Easy" ? 10 : 
                      selectedProblem.difficulty === "Medium" ? 20 : 30;
        await awardPoints(points);
        await markTopicComplete('problems', 10);
      }
    } catch (error) {
      console.error('Error marking problem solved:', error);
    }
  };

  const isSolved = solvedProblems.has(selectedProblem.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <Badge variant="outline" className="capitalize">
            {selectedProblem.difficulty}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Problem List */}
          <Card className="lg:col-span-1 overflow-auto">
            <CardHeader>
              <CardTitle>Problems ({filteredProblems.length})</CardTitle>
              <CardDescription>Select a problem to solve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topic Filter */}
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Problem List */}
              <div className="space-y-2">
                {filteredProblems.map((problem) => {
                const solved = solvedProblems.has(problem.id);
                return (
                  <Button
                    key={problem.id}
                    variant={selectedProblem.id === problem.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedProblem(problem)}
                  >
                    <span className="flex items-center gap-2">
                      {solved && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {problem.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        problem.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-500"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </Button>
                );
              })}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 overflow-auto">
            {/* Problem Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {isSolved && <Trophy className="w-5 h-5 text-secondary" />}
                    {selectedProblem.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedProblem.topics.map(topic => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="hints">Hints</TabsTrigger>
                    <TabsTrigger value="solution">
                      <Eye className="w-4 h-4 mr-2" />
                      Solution
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Problem</h3>
                      <p className="text-sm text-muted-foreground">{selectedProblem.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Constraints</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProblem.constraints.map((constraint, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    {selectedProblem.examples.map((example, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-sm">
                          <span className="font-semibold">Input:</span> {example.input}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Output:</span> {example.output}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="hints" className="space-y-2">
                    {selectedProblem.hints.map((hint, idx) => (
                      <div key={idx} className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm">
                          <span className="font-semibold">Hint {idx + 1}:</span> {hint}
                        </p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="solution">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        Try solving the problem first! View the solution only if you're stuck.
                      </p>
                      {!showSolution ? (
                        <Button onClick={() => setShowSolution(true)} variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Reveal Solution
                        </Button>
                      ) : (
                        <pre className="text-sm overflow-auto p-4 bg-background rounded">
                          <code>{codeTemplates[selectedProblem.id]?.[language] || "Solution not available for this language"}</code>
                        </pre>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Code Editor
                  </CardTitle>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono min-h-[300px] text-sm"
                  placeholder="Write your code here..."
                />

                <div className="flex gap-2">
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-gradient-primary"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                  <Button onClick={loadCodeTemplate} variant="outline">
                    Reset Template
                  </Button>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Test Results</h3>
                    {testResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          result.passed
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-red-500/10 border-red-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-semibold">
                            Test Case {idx + 1}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-muted-foreground">Input:</span> {result.input}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Expected:</span> {result.expected}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Got:</span> {result.actual}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Output */}
                {output && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Output</h3>
                    <pre className="p-4 bg-muted/50 rounded-lg text-sm overflow-auto max-h-[200px]">
                      {output}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
