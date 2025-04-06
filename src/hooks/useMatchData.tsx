
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

        // Use get_match_details RPC function to avoid ambiguous column issues
        const { data: matchDetails, error: matchError } = await supabase
          .rpc('get_match_details', { user_id_param: user.id });

        if (matchError) {
          console.error('Match details error:', matchError);
          throw matchError;
        }

        console.log("Match details from RPC:", matchDetails);

        // If no matches were found
        if (!matchDetails || matchDetails.length === 0) {
          console.log("No matches found for user");
          setMatches([]);
          setIsLoading(false);
          return;
        }

        // Format the matches data
        const formattedMatches = matchDetails.map(match => {
          return {
            id: match.match_id,
            name: `${match.first_name} ${match.last_name}`,
            avatar: match.avatar_url || '/placeholder.svg',
            bio: match.bio || '',
            location: match.location || '',
            skills: match.skills || [],
            interests: match.interests || [],
            matchScore: {
              skillsMatch: Number(match.skills_match_score) || 0,
              interestsMatch: Number(match.interests_match_score) || 0,
              locationMatch: 75, // Placeholder until location matching is implemented
              experienceMatch: 80, // Placeholder until experience matching is implemented
              overallMatch: Number(match.match_score) || 0,
            }
          };
        }).filter(Boolean); // Remove any null entries

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
