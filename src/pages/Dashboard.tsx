
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMatchData } from "@/hooks/useMatchData";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase, RefreshCw, AlertCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { matches, isLoading: matchesLoading, error: matchError, refreshMatches: fetchMatchesAgain } = useMatchData();
  const { profileData, userSkills, userInterests, isLoading: profileLoading } = useProfileData();

  useEffect(() => {
    let intervalId: number;
    if (autoRefresh) {
      toast({
        title: "Auto-refresh enabled",
        description: "Matches will refresh automatically every 30 seconds",
      });
      
      // Set up interval to refresh matches every 30 seconds
      intervalId = window.setInterval(() => {
        console.log("Auto-refreshing matches...");
        fetchMatchesAgain();
        toast({
          title: "Matches refreshed",
          description: "Your matches have been automatically updated",
        });
      }, 30000);
    }

    // Clean up interval on component unmount or when autoRefresh is turned off
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [autoRefresh, fetchMatchesAgain, toast]);

  // Set up subscription for new matches
  useEffect(() => {
    if (!profileData?.id) return;

    // Subscribe to changes in the matches table
    const subscription = supabase
      .channel('match_notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'matches', 
        filter: `matched_user_id=eq.${profileData.id}` 
      }, (payload) => {
        // Someone has matched with this user
        console.log('New match notification:', payload);
        
        // Show toast notification
        toast({
          title: "New Match! 🎉",
          description: "Someone has matched with you! Check your matches list.",
        });
        
        // Refresh matches to show the new match
        fetchMatchesAgain();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileData?.id, toast, fetchMatchesAgain]);

  const handleLike = async () => {
    if (matches && matches.length > 0) {
      const currentMatch = matches[currentMatchIndex];
      
      try {
        // First check if this is already a mutual match (the other user already liked this user)
        const { data: existingMatch, error: checkError } = await supabase
          .from('matches')
          .select('*')
          .eq('user_id', currentMatch.id)
          .eq('matched_user_id', profileData.id)
          .single();
          
        // Save the match to the database
        const { data, error } = await supabase
          .from('matches')
          .insert([
            { 
              user_id: profileData.id,
              matched_user_id: currentMatch.id,
              match_score: currentMatch.matchScore.overallMatch,
              skills_match_score: currentMatch.matchScore.skillsMatch,
              interests_match_score: currentMatch.matchScore.interestsMatch,
              status: existingMatch ? 'mutual' : 'matched'
            }
          ]);
        
        if (error) {
          console.error("Error saving match:", error);
          toast({
            title: "Error",
            description: "Failed to save match. Please try again.",
            variant: "destructive",
          });
        } else {
          // If this completes a mutual match, update the other user's match status to mutual
          if (existingMatch) {
            const { error: updateError } = await supabase
              .from('matches')
              .update({ status: 'mutual' })
              .eq('id', existingMatch.id);
            
            if (updateError) {
              console.error("Error updating mutual match:", updateError);
            }
            
            toast({
              title: "It's a Mutual Match! 🎉✨",
              description: `You and ${currentMatch.name} have matched with each other!`,
            });
          } else {
            toast({
              title: "Match Created! ⚡",
              description: `You've matched with ${currentMatch.name}!`,
            });
          }
          
          // Move to the next match
          setCurrentMatchIndex(prev => 
            prev + 1 >= matches.length ? prev : prev + 1
          );
        }
      } catch (error) {
        console.error("Error in match process:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePass = () => {
    if (matches && matches.length > 0) {
      setCurrentMatchIndex(prev => 
        prev + 1 >= matches.length ? prev : prev + 1
      );
      toast({
        title: "Passed",
        description: "We'll keep looking for better matches!",
      });
    }
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

  const goToAllMatches = () => {
    navigate('/all-matches');
  };

  const refreshMatches = async () => {
    try {
      toast({
        title: "Refreshing matches",
        description: "Please wait while we update your matches...",
      });
      
      await fetchMatchesAgain();
      
      toast({
        title: "Success",
        description: "Your matches have been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing matches:', error);
      toast({
        title: "Error",
        description: "Failed to refresh matches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    if (autoRefresh) {
      toast({
        title: "Auto-refresh disabled",
        description: "You've turned off automatic match refreshing",
      });
    }
  };

  const completeProfile = () => {
    navigate('/complete-profile');
  };

  if (profileLoading || matchesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8 flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Profile Not Found</h2>
        <p className="text-center mb-6">We couldn't find your profile information.</p>
        <Button onClick={completeProfile}>Complete Your Profile</Button>
      </div>
    );
  }

  if (matchError) {
    console.error('Match error in component:', matchError);
  }

  const userProfile = {
    id: profileData.id,
    name: `${profileData.first_name} ${profileData.last_name}`,
    avatar: profileData.avatar_url || "/placeholder.svg",
    bio: profileData.bio,
    location: profileData.location,
    skills: userSkills.map(s => s.skill.name),
    interests: userInterests.map(i => i.interest.name),
  };

  const hasMatches = matches && matches.length > 0;
  const currentMatch = hasMatches ? matches[currentMatchIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <ProfileSummary user={userProfile} />
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button onClick={goToProjects} className="hover:scale-105 transition-transform w-full sm:w-auto">
              <Briefcase className="mr-2 h-4 w-4" />
              View Projects
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshMatches} 
              className="hover:scale-105 transition-transform w-full sm:w-auto"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Refresh Matches
            </Button>
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              onClick={toggleAutoRefresh}
              className="hover:scale-105 transition-transform w-full sm:w-auto"
            >
              {autoRefresh ? "Disable Auto-refresh" : "Enable Auto-refresh"}
            </Button>
            <Button 
              onClick={goToAllMatches}
              className="hover:scale-105 transition-transform w-full sm:w-auto"
            >
              <Users className="mr-2 h-4 w-4" />
              View All Matches
            </Button>
          </div>
        </div>
        
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-[1fr,400px] gap-8'} mt-8`}>
          <div>
            {matchesLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : hasMatches && currentMatch ? (
              <MatchProfile
                match={currentMatch}
                onLike={handleLike}
                onPass={handlePass}
                onMessage={() => handleMessage(currentMatch.id)}
              />
            ) : (
              <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any matches for your profile yet. This could be because:
                </p>
                <ul className="text-left list-disc pl-6 mb-6">
                  <li>There aren't enough other users in the system yet</li>
                  <li>Your profile information needs to be more complete</li>
                  <li>You might need to update your skills and interests</li>
                </ul>
                <div className="flex flex-col space-y-4">
                  <Button onClick={() => navigate('/profile')} className="w-full">
                    Update Your Profile
                  </Button>
                  <Button onClick={refreshMatches} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Matches
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <MatchesPanel 
            matches={matches || []} 
            onMessage={handleMessage}
            currentUserId={profileData.id}
            onRefresh={fetchMatchesAgain}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
