-- Create table to track solved problems
CREATE TABLE IF NOT EXISTS public.solved_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  language TEXT NOT NULL,
  solution_code TEXT NOT NULL,
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  execution_time_ms INTEGER,
  UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE public.solved_problems ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own solved problems"
ON public.solved_problems
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own solved problems"
ON public.solved_problems
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solved problems"
ON public.solved_problems
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_solved_problems_user_id ON public.solved_problems(user_id);
CREATE INDEX idx_solved_problems_solved_at ON public.solved_problems(solved_at DESC);