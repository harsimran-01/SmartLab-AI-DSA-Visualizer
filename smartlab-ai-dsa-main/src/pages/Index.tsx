import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Trophy, Sparkles, Code, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized explanations and hints as you learn complex algorithms step by step.",
    },
    {
      icon: Play,
      title: "Interactive Visualizations",
      description: "See data structures come to life with 3D animations and real-time operation tracking.",
    },
    {
      icon: Code,
      title: "Step-by-Step Debugging",
      description: "Watch code execute line by line with visual feedback on data changes.",
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn badges, maintain streaks, and climb leaderboards as you master DSA concepts.",
    },
    {
      icon: Zap,
      title: "From Scratch to Pro",
      description: "Start with basics like arrays and loops, progress to advanced graph algorithms.",
    },
    {
      icon: Sparkles,
      title: "Anytime, Anywhere",
      description: "Learn on web or mobile with cloud-synced progress across all devices.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-block p-3 rounded-full bg-gradient-primary mb-4 animate-float">
            <Brain className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-primary">Data Structures</span>
            <br />& Algorithms Visually
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SmartLab DS turns complex algorithms into interactive visual stories. Learn, visualize, and master DSA
            with AI-powered guidance — anywhere, anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8">
                Start Learning Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:bg-primary/10">
                Explore Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card/95 backdrop-blur hover:border-primary/50 transition-all hover:shadow-[var(--shadow-glow)]">
                <CardHeader>
                  <div className="w-fit p-3 rounded-lg bg-gradient-primary/10 mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="max-w-4xl mx-auto border-primary/50 bg-gradient-secondary/10 backdrop-blur">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Transform Your DSA Journey?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students already mastering algorithms through interactive visualization and AI
                guidance.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-12">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
