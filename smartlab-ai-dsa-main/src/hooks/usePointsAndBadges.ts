import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePointsAndBadges = () => {
  const { user } = useAuth();

  const awardPoints = async (points: number) => {
    if (!user) return;

    try {
      await supabase.rpc('award_points', {
        user_uuid: user.id,
        points: points
      });

      // Check for point-based badges
      if (points >= 10) {
        await checkBadges(['points_100', 'points_500']);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const checkBadges = async (badgeTypes: string[]) => {
    if (!user) return;

    try {
      for (const badgeType of badgeTypes) {
        await supabase.rpc('check_and_award_badge', {
          user_uuid: user.id,
          badge_type: badgeType
        });
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const markTopicComplete = async (topicSlug: string, score: number) => {
    if (!user) return;

    try {
      // Update or insert learning progress
      const { data: existing } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic_slug', topicSlug)
        .single();

      if (existing) {
        await supabase
          .from('learning_progress')
          .update({
            completed: score === 100,
            score: score,
            last_accessed: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('learning_progress')
          .insert({
            user_id: user.id,
            topic_slug: topicSlug,
            topic_name: topicSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            completed: score === 100,
            score: score
          });
      }

      // Award points based on score
      const pointsToAward = Math.floor(score / 10);
      if (pointsToAward > 0) {
        await awardPoints(pointsToAward);
      }

      // Check for badges
      await checkBadges([
        'first_steps',
        'streak_3',
        'streak_7',
        'streak_30',
        'all_topics'
      ]);
    } catch (error) {
      console.error('Error marking topic complete:', error);
    }
  };

  return { awardPoints, checkBadges, markTopicComplete };
};
