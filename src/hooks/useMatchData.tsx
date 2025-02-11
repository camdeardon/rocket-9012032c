
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMatchData = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('match_details')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedMatches = data.map(match => ({
          id: match.match_id,
          name: `${match.first_name} ${match.last_name}`,
          avatar: match.avatar_url || '/placeholder.svg',
          skills: match.skills || [],
          matchScore: {
            skillsMatch: Number(match.skills_match_score) || 0,
            interestsMatch: Number(match.interests_match_score) || 0,
            locationMatch: 75, // TODO: Implement location matching
            experienceMatch: 80, // TODO: Implement experience matching
            overallMatch: Number(match.match_score) || 0,
          }
        }));

        setMatches(formattedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error",
          description: "Failed to load matches",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [toast]);

  return { matches, isLoading };
};
