
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [potentialMatches, setPotentialMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Transform profile data to match component expectations
        setCurrentUser({
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          avatar: profile.avatar_url || "/placeholder.svg",
          bio: profile.bio,
          location: profile.location,
          skills: profile.skills || [],
          interests: profile.interests || []
        });

        // Fetch potential matches
        const { data: matches, error: matchesError } = await supabase
          .from('match_scores')
          .select(`
            *,
            matched_user:matched_user_id(
              id,
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

        if (matchesError) throw matchesError;

        // Transform matches data
        const transformedMatches = matches.map((match: any) => ({
          id: match.matched_user.id,
          name: `${match.matched_user.first_name} ${match.matched_user.last_name}`,
          avatar: match.matched_user.avatar_url || "/placeholder.svg",
          bio: match.matched_user.bio || "",
          location: match.matched_user.location || "",
          skills: match.matched_user.skills || [],
          interests: match.matched_user.interests || [],
          matchScore: {
            skillsMatch: match.skills_similarity * 100,
            interestsMatch: match.interests_similarity * 100,
            locationMatch: match.location_similarity * 100,
            experienceMatch: match.background_similarity * 100,
            overallMatch: match.similarity_score * 100
          }
        }));

        setPotentialMatches(transformedMatches);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate, toast]);

  const currentMatch = potentialMatches[currentMatchIndex];

  const handleLike = async () => {
    if (!currentMatch) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('matches')
        .insert({
          user_id: user.id,
          matched_user_id: currentMatch.id,
          status: 'pending',
          skills_match_score: currentMatch.matchScore.skillsMatch,
          interests_match_score: currentMatch.matchScore.interestsMatch,
          match_score: currentMatch.matchScore.overallMatch
        });

      if (error) throw error;

      toast({
        title: "It's a match! 🎉",
        description: `You and ${currentMatch.name} have been matched! You can now start a project together.`,
      });
      setCurrentMatchIndex(prev => prev + 1);
    } catch (error: any) {
      console.error('Error creating match:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePass = () => {
    setCurrentMatchIndex(prev => prev + 1);
    toast({
      title: "Passed",
      description: "We'll keep looking for better matches!",
    });
  };

  const handleMessage = (matchId?: string) => {
    toast({
      title: "Coming soon!",
      description: "The messaging feature will be available soon.",
    });
  };

  const goToProjects = () => {
    navigate('/project-management');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          {currentUser && <ProfileSummary user={currentUser} />}
          <Button onClick={goToProjects} className="hover:scale-105 transition-transform w-full md:w-auto">
            <Briefcase className="mr-2 h-4 w-4" />
            View Projects
          </Button>
        </div>
        
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-[1fr,400px] gap-8'} mt-8`}>
          <div>
            {currentMatch && (
              <MatchProfile
                match={currentMatch}
                onLike={handleLike}
                onPass={handlePass}
                onMessage={() => handleMessage(currentMatch.id)}
              />
            )}
            {!currentMatch && (
              <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No More Matches</h3>
                <p className="text-muted-foreground">
                  We're working on finding more matches that align with your profile.
                  Check back soon!
                </p>
              </div>
            )}
          </div>
          
          <MatchesPanel 
            matches={potentialMatches} 
            onMessage={handleMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
