
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

        // Fetch match scores first
        const { data: matchScores, error: matchScoresError } = await supabase
          .from('match_scores')
          .select(`
            id,
            matched_user_id,
            skills_similarity,
            interests_similarity,
            similarity_score
          `)
          .eq('user_id', user.id)
          .order('similarity_score', { ascending: false });

        if (matchScoresError) {
          console.error('Match scores error:', matchScoresError);
          throw matchScoresError;
        }

        if (!matchScores || matchScores.length === 0) {
          console.log("No matches found for user");
          setMatches([]);
          setIsLoading(false);
          return;
        }

        // Get the matched user profiles separately
        const matchedUserIds = matchScores.map(match => match.matched_user_id);
        const { data: matchedProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            avatar_url,
            bio,
            location,
            skills,
            interests
          `)
          .in('id', matchedUserIds);

        if (profilesError) {
          console.error('Profiles error:', profilesError);
          throw profilesError;
        }

        // Combine the data
        const formattedMatches = matchScores.map(matchScore => {
          const matchedProfile = matchedProfiles?.find(
            profile => profile.id === matchScore.matched_user_id
          );
          
          if (!matchedProfile) {
            console.warn(`No profile found for match ${matchScore.id}`);
            return null;
          }

          return {
            id: matchScore.id,
            name: `${matchedProfile.first_name} ${matchedProfile.last_name}`,
            avatar: matchedProfile.avatar_url || '/placeholder.svg',
            bio: matchedProfile.bio || '',
            location: matchedProfile.location || '',
            skills: matchedProfile.skills || [],
            interests: matchedProfile.interests || [],
            matchScore: {
              skillsMatch: Number(matchScore.skills_similarity) || 0,
              interestsMatch: Number(matchScore.interests_similarity) || 0,
              locationMatch: 75, // Placeholder until location matching is implemented
              experienceMatch: 80, // Placeholder until experience matching is implemented
              overallMatch: Number(matchScore.similarity_score) || 0,
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
