-- Create function to update daily streak
CREATE OR REPLACE FUNCTION public.update_daily_streak(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_active DATE;
  current_streak INTEGER;
BEGIN
  -- Get current streak and last active date
  SELECT last_active_date, streak_days 
  INTO last_active, current_streak
  FROM profiles 
  WHERE id = user_uuid;
  
  -- If last active was yesterday, increment streak
  IF last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE profiles 
    SET streak_days = streak_days + 1,
        last_active_date = CURRENT_DATE
    WHERE id = user_uuid;
  
  -- If last active was today, do nothing
  ELSIF last_active = CURRENT_DATE THEN
    -- Already counted today
    RETURN;
  
  -- Otherwise reset streak to 1
  ELSE
    UPDATE profiles 
    SET streak_days = 1,
        last_active_date = CURRENT_DATE
    WHERE id = user_uuid;
  END IF;
END;
$$;

-- Create function to award points
CREATE OR REPLACE FUNCTION public.award_points(user_uuid UUID, points INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET total_points = total_points + points
  WHERE id = user_uuid;
END;
$$;

-- Create function to check and award achievement badges
CREATE OR REPLACE FUNCTION public.check_and_award_badge(user_uuid UUID, badge_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  badge_exists BOOLEAN;
  user_streak INTEGER;
  user_points INTEGER;
  completed_topics INTEGER;
BEGIN
  -- Check if badge already exists
  SELECT EXISTS(
    SELECT 1 FROM achievements 
    WHERE user_id = user_uuid AND badge_name = badge_type
  ) INTO badge_exists;
  
  IF badge_exists THEN
    RETURN;
  END IF;
  
  -- Get user stats
  SELECT streak_days, total_points INTO user_streak, user_points
  FROM profiles WHERE id = user_uuid;
  
  SELECT COUNT(*) INTO completed_topics
  FROM learning_progress 
  WHERE user_id = user_uuid AND completed = true;
  
  -- Award badges based on achievements
  IF badge_type = 'first_steps' AND completed_topics >= 1 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, 'First Steps', 'Completed your first topic');
    
  ELSIF badge_type = 'streak_3' AND user_streak >= 3 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, '3-Day Streak', 'Maintained a 3-day learning streak');
    
  ELSIF badge_type = 'streak_7' AND user_streak >= 7 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, '7-Day Streak', 'Maintained a 7-day learning streak');
    
  ELSIF badge_type = 'streak_30' AND user_streak >= 30 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, '30-Day Streak', 'Maintained a 30-day learning streak');
    
  ELSIF badge_type = 'points_100' AND user_points >= 100 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, 'Century', 'Earned 100 points');
    
  ELSIF badge_type = 'points_500' AND user_points >= 500 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, 'Expert', 'Earned 500 points');
    
  ELSIF badge_type = 'all_topics' AND completed_topics >= 10 THEN
    INSERT INTO achievements (user_id, badge_name, badge_description)
    VALUES (user_uuid, 'Master', 'Completed all topics');
  END IF;
END;
$$;