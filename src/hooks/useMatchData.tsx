
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

        // First, manually trigger the calculation of match scores
        const { error: calcError } = await supabase.rpc('calculate_match_scores', { user_id_param: user.id });
        if (calcError) {
          console.error('Error calculating match scores:', calcError);
          throw calcError;
        }

        // Then fetch match scores with the profile information joined
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

        console.log("Match scores found:", matchScores?.length || 0);

        // If no match scores were found, try to get all other users as potential matches
        if (!matchScores || matchScores.length === 0) {
          console.log("No match scores found, fetching all potential users");
          
          // Get all users except the current user
          const { data: otherUsers, error: usersError } = await supabase
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
            .neq('id', user.id);
            
          if (usersError) {
            console.error('Error fetching other users:', usersError);
            throw usersError;
          }

          console.log("Other users found:", otherUsers?.length || 0);
          
          if (otherUsers && otherUsers.length > 0) {
            // Create placeholder match data for users
            const formattedMatches = otherUsers.map(profile => {
              return {
                id: profile.id,
                name: `${profile.first_name} ${profile.last_name}`,
                avatar: profile.avatar_url || '/placeholder.svg',
                bio: profile.bio || '',
                location: profile.location || '',
                skills: profile.skills || [],
                interests: profile.interests || [],
                matchScore: {
                  skillsMatch: 50, // Default placeholder score
                  interestsMatch: 50, // Default placeholder score
                  locationMatch: 50, // Placeholder
                  experienceMatch: 50, // Placeholder
                  overallMatch: 50, // Default placeholder score
                }
              };
            });
            
            console.log("Created placeholder matches:", formattedMatches.length);
            setMatches(formattedMatches);
            setIsLoading(false);
            return;
          }
        }

        // Fetch profile details for all matched users
        const matchedUserIds = matchScores?.map(match => match.matched_user_id) || [];
        
        if (matchedUserIds.length === 0) {
          setMatches([]);
          setIsLoading(false);
          return;
        }
        
        const { data: profiles, error: profilesError } = await supabase
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

        // Combine scores with profile information
        const formattedMatches = matchScores?.map(score => {
          const profile = profiles?.find(p => p.id === score.matched_user_id);
          
          if (!profile) {
            console.warn(`No profile found for match with ID ${score.matched_user_id}`);
            return null;
          }
          
          return {
            id: score.id,
            name: `${profile.first_name || 'User'} ${profile.last_name || ''}`.trim() || 'Anonymous User',
            avatar: profile.avatar_url || '/placeholder.svg',
            bio: profile.bio || '',
            location: profile.location || '',
            skills: profile.skills || [],
            interests: profile.interests || [],
            matchScore: {
              skillsMatch: Number(score.skills_similarity) || 0,
              interestsMatch: Number(score.interests_similarity) || 0,
              locationMatch: 75, // Placeholder until location matching is implemented
              experienceMatch: 80, // Placeholder until experience matching is implemented
              overallMatch: Number(score.similarity_score) || 0,
            }
          };
        }).filter(Boolean) || []; // Remove any null entries

        console.log("Formatted matches:", formattedMatches.length);
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
