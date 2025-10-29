import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Brain, LogOut, Trophy, Flame, Star, PlayCircle, Lock, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChatbot } from "@/components/AIChatbot";

interface LearningTopic {
  slug: string;
  name: string;
  description: string;
  icon: any;
  difficulty: "beginner" | "intermediate" | "advanced";
  locked?: boolean;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);

  const topics: LearningTopic[] = [
    {
      slug: "stack",
      name: "Stack",
      description: "Learn LIFO operations with 3D animated boxes",
      icon: "📚",
      difficulty: "beginner",
    },
    {
      slug: "queue",
      name: "Queue",
      description: "Master FIFO with horizontal moving blocks",
      icon: "🚶",
      difficulty: "beginner",
    },
    {
      slug: "linked-list",
      name: "Linked List",
      description: "Understand node connections with animated pointers",
      icon: "🔗",
      difficulty: "beginner",
    },
    {
      slug: "binary-tree",
      name: "Binary Tree",
      description: "Explore tree traversals with animated nodes",
      icon: "🌳",
      difficulty: "intermediate",
    },
    {
      slug: "avl-tree",
      name: "AVL Tree",
      description: "Self-balancing BST with rotation animations",
      icon: "⚖️",
      difficulty: "advanced",
    },
    {
      slug: "graph",
      name: "Graph",
      description: "Navigate vertices and edges with BFS/DFS",
      icon: "🕸️",
      difficulty: "intermediate",
    },
    {
      slug: "dijkstra",
      name: "Dijkstra's Algorithm",
      description: "Find shortest paths with weighted graphs",
      icon: "🗺️",
      difficulty: "advanced",
    },
    {
      slug: "hashing",
      name: "Hash Tables",
      description: "Learn hashing with collision resolution",
      icon: "🔐",
      difficulty: "intermediate",
    },
    {
      slug: "heap",
      name: "Heap & Priority Queue",
      description: "Master heap operations and heapify process",
      icon: "⛰️",
      difficulty: "intermediate",
    },
    {
      slug: "sorting",
      name: "Sorting Algorithms",
      description: "Visualize Bubble, Selection, Insertion, Merge & Quick Sort",
      icon: "🎨",
      difficulty: "beginner",
    },
    {
      slug: "searching",
      name: "Searching Algorithms",
      description: "Master Linear and Binary Search techniques",
      icon: "🔍",
      difficulty: "beginner",
    },
    {
      slug: "problems",
      name: "Practice Problems",
      description: "Solve coding challenges with visualization & compiler",
      icon: "💡",
      difficulty: "intermediate",
    },
  ];

  const utilityTools = [
    {
      slug: "code-explainer",
      name: "AI Code Explainer",
      description: "Get AI-powered code analysis and optimization tips",
      icon: "🤖",
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: progressData } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", user.id);

      setProfile(profileData);
      setProgress(progressData || []);
    };

    fetchData();
  }, [user, navigate]);

  const getTopicProgress = (slug: string) => {
    const topicProgress = progress.find((p) => p.topic_slug === slug);
    return topicProgress?.completed ? 100 : topicProgress?.score || 0;
  };

  const completedCount = topics.filter((t) => getTopicProgress(t.slug) === 100).length;
  const overallProgress = (completedCount / topics.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">SmartLab DS</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <Flame className="w-5 h-5 text-accent" />
              <span className="font-semibold">{profile?.streak_days || 0} day streak</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <Trophy className="w-5 h-5 text-secondary" />
              <span className="font-semibold">{profile?.total_points || 0} pts</span>
            </Link>
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20 bg-gradient-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {profile?.username || "Learner"}! 👋
              </CardTitle>
              <CardDescription className="text-base">
                Continue your journey to master Data Structures and Algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Paths */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Learning Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const progress = getTopicProgress(topic.slug);
              const isCompleted = progress === 100;

              return (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/50 transition-all hover:shadow-[var(--shadow-glow)]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-4xl mb-2">{topic.icon}</div>
                        {isCompleted && <Star className="w-5 h-5 text-secondary fill-secondary" />}
                        {topic.locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <CardTitle>{topic.name}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {topic.difficulty}
                        </Badge>
                        <Link to={`/learn/${topic.slug}`}>
                          <Button size="sm" className="bg-gradient-primary hover:opacity-90" disabled={topic.locked}>
                            {isCompleted ? "Review" : "Start Learning"}
                            <PlayCircle className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Tools Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI-Powered Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilityTools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all hover:shadow-[var(--shadow-glow)] bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader>
                    <div className="text-4xl mb-2">{tool.icon}</div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/${tool.slug}`}>
                      <Button className="w-full bg-gradient-primary hover:opacity-90">
                        Launch Tool
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
};

export default Dashboard;
