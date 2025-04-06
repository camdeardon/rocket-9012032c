
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
        if (!user) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching matches for user:", user.id);

        // First, manually calculate match scores to ensure they're up to date
        const { error: calcError } = await supabase
          .rpc('calculate_match_scores', { user_id_param: user.id });
          
        if (calcError) {
          console.error('Error calculating match scores:', calcError);
          throw calcError;
        }

        // Then fetch match details with explicit table aliases to avoid ambiguity
        const { data: matchDetails, error: matchError } = await supabase
          .from('match_scores')
          .select(`
            id,
            matched_user_id,
            skills_similarity,
            interests_similarity,
            similarity_score,
            profiles:matched_user_id (
              first_name,
              last_name,
              avatar_url,
              bio,
              location,
              skills,
              interests
            )
          `)
          .eq('user_id', user.id)
          .order('similarity_score', { ascending: false });

        if (matchError) {
          console.error('Match details error:', matchError);
          throw matchError;
        }

        console.log("Received match details:", matchDetails);

        // If no matches were found
        if (!matchDetails || matchDetails.length === 0) {
          console.log("No matches found for user");
          setMatches([]);
          setIsLoading(false);
          return;
        }

        // Format the matches data
        const formattedMatches = matchDetails.map(match => ({
          id: match.id,
          name: `${match.profiles.first_name} ${match.profiles.last_name}`,
          avatar: match.profiles.avatar_url || '/placeholder.svg',
          bio: match.profiles.bio || '',
          location: match.profiles.location || '',
          skills: match.profiles.skills || [],
          interests: match.profiles.interests || [],
          matchScore: {
            skillsMatch: Number(match.skills_similarity) || 0,
            interestsMatch: Number(match.interests_similarity) || 0,
            locationMatch: 75, // Placeholder until location matching is implemented
            experienceMatch: 80, // Placeholder until experience matching is implemented
            overallMatch: Number(match.similarity_score) || 0,
          }
        }));

        console.log("Formatted matches:", formattedMatches);
        setMatches(formattedMatches);
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load matches",
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
