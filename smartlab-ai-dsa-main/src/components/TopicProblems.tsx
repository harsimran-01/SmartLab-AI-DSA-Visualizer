import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, CheckCircle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { type Problem } from "@/utils/problemsData";

interface TopicProblemsProps {
  problems: Problem[];
  topicName: string;
}

const TopicProblems = ({ problems, topicName }: TopicProblemsProps) => {
  const { user } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSolvedProblems();
  }, [user]);

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

  if (problems.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Practice Problems - {topicName}
            </CardTitle>
            <CardDescription>
              Test your understanding with these coding challenges
            </CardDescription>
          </div>
          <Link to="/learn/problems">
            <Button variant="outline" size="sm">
              View All Problems
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {problems.map((problem) => {
            const solved = solvedProblems.has(problem.id);
            return (
              <Link key={problem.id} to="/learn/problems" state={{ problemId: problem.id }}>
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {solved && <Trophy className="w-4 h-4 text-secondary" />}
                      <h4 className="font-semibold">{problem.title}</h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        problem.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {problem.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {solved && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Solved
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicProblems;
