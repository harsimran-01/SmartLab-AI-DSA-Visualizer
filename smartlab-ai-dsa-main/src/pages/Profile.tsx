import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Trophy, Flame, Star, Edit2, Save, Calendar, Target, Award, Code } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

interface Achievement {
  id: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

interface SolvedProblem {
  id: string;
  problem_id: string;
  problem_title: string;
  language: string;
  solved_at: string;
  execution_time_ms: number;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);
    setUsername(profileData?.username || "");
    setAvatarUrl(profileData?.avatar_url || "");

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    setAchievements(achievementsData || []);

    // Fetch learning progress
    const { data: progressData } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", user.id);

    setProgress(progressData || []);

    // Fetch solved problems
    const { data: solvedData } = await supabase
      .from("solved_problems")
      .select("*")
      .eq("user_id", user.id)
      .order("solved_at", { ascending: false });

    setSolvedProblems(solvedData || []);
  };

  const saveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
      return;
    }

    toast.success("Profile updated successfully!");
    setIsEditing(false);
    fetchProfileData();
  };

  const completedTopics = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((acc, p) => acc + (p.score || 0), 0);

  const stats = [
    {
      label: "Total Points",
      value: profile?.total_points || 0,
      icon: Trophy,
      color: "text-secondary",
    },
    {
      label: "Current Streak",
      value: `${profile?.streak_days || 0} days`,
      icon: Flame,
      color: "text-accent",
    },
    {
      label: "Topics Completed",
      value: completedTopics,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Problems Solved",
      value: solvedProblems.length,
      icon: Code,
      color: "text-green-500",
    },
    {
      label: "Achievements",
      value: achievements.length,
      icon: Award,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur flex-shrink-0">
        <div className="w-full px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 w-full px-4 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Avatar URL</label>
                        <Input
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="Enter avatar URL"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold">{username}</h2>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Joined {new Date(profile?.created_at).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>

                <Button
                  onClick={isEditing ? saveProfile : () => setIsEditing(true)}
                  variant={isEditing ? "default" : "outline"}
                  className={isEditing ? "bg-gradient-primary" : ""}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <Card className="border-primary/20 w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Achievements
            </CardTitle>
            <CardDescription>
              Badges you've earned on your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-accent/5">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-secondary/20">
                            <Star className="w-6 h-6 text-secondary fill-secondary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{achievement.badge_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.badge_description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(achievement.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Keep learning to earn badges!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card className="border-primary/20 w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your progress across all topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.length > 0 ? (
                progress.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.topic_name}</span>
                      <Badge variant={item.completed ? "default" : "outline"}>
                        {item.completed ? (
                          <>
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Completed
                          </>
                        ) : (
                          `${item.score}%`
                        )}
                      </Badge>
                    </div>
                    <Progress value={item.completed ? 100 : item.score} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start learning to track your progress!</p>
                  <Link to="/dashboard">
                    <Button className="mt-4 bg-gradient-primary">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solved Problems */}
        <Card className="border-primary/20 w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-green-500" />
              Solved Problems
            </CardTitle>
            <CardDescription>
              Coding challenges you've successfully completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {solvedProblems.length > 0 ? (
              <div className="space-y-3">
                {solvedProblems.map((problem) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="w-4 h-4 text-green-500 fill-green-500" />
                              <h3 className="font-semibold">{problem.problem_title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {problem.language}
                              </Badge>
                              <span>{new Date(problem.solved_at).toLocaleDateString()}</span>
                              {problem.execution_time_ms && (
                                <span>{problem.execution_time_ms}ms</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No problems solved yet. Start solving challenges!</p>
                <Link to="/learn/problems">
                  <Button className="mt-4 bg-gradient-primary">
                    Go to Problems
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
