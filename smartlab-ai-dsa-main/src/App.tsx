import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Stack from "./pages/learn/Stack";
import Queue from "./pages/learn/Queue";
import Sorting from "./pages/learn/Sorting";
import LinkedList from "./pages/learn/LinkedList";
import BinaryTree from "./pages/learn/BinaryTree";
import Graph from "./pages/learn/Graph";
import Searching from "./pages/learn/Searching";
import Problems from "./pages/learn/Problems";
import Dijkstra from "./pages/learn/Dijkstra";
import AVLTree from "./pages/learn/AVLTree";
import Hashing from "./pages/learn/Hashing";
import Heap from "./pages/learn/Heap";
import CodeExplainer from "./pages/CodeExplainer";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/stack" element={<Stack />} />
            <Route path="/learn/queue" element={<Queue />} />
            <Route path="/learn/sorting" element={<Sorting />} />
            <Route path="/learn/linked-list" element={<LinkedList />} />
            <Route path="/learn/binary-tree" element={<BinaryTree />} />
            <Route path="/learn/graph" element={<Graph />} />
            <Route path="/learn/searching" element={<Searching />} />
            <Route path="/learn/problems" element={<Problems />} />
            <Route path="/learn/dijkstra" element={<Dijkstra />} />
            <Route path="/learn/avl-tree" element={<AVLTree />} />
            <Route path="/learn/hashing" element={<Hashing />} />
            <Route path="/learn/heap" element={<Heap />} />
            <Route path="/code-explainer" element={<CodeExplainer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
