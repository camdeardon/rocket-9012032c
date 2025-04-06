import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMatchData } from "@/hooks/useMatchData";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { matches, isLoading: matchesLoading } = useMatchData();
  const { profileData, userSkills, userInterests, isLoading: profileLoading } = useProfileData();

  const handleLike = () => {
    toast({
      title: "It's a match! 🎉",
      description: `You and ${matches[currentMatchIndex].name} have been matched!`,
    });
    setCurrentMatchIndex(prev => 
      prev + 1 >= matches.length ? prev : prev + 1
    );
  };

  const handlePass = () => {
    setCurrentMatchIndex(prev => 
      prev + 1 >= matches.length ? prev : prev + 1
    );
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

  const refreshMatches = async () => {
    try {
      toast({
        title: "Refreshing matches",
        description: "Please wait while we update your matches...",
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Manually trigger recalculation of match scores
      await supabase.rpc('calculate_match_scores', { user_id_param: user.id });
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing matches:', error);
      toast({
        title: "Error",
        description: "Failed to refresh matches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentMatch = matches[currentMatchIndex];

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
        <Button onClick={() => navigate('/complete-profile')}>Complete Your Profile</Button>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <ProfileSummary user={userProfile} />
          <div className="flex gap-3 w-full md:w-auto">
            <Button onClick={goToProjects} className="hover:scale-105 transition-transform w-full md:w-auto">
              <Briefcase className="mr-2 h-4 w-4" />
              View Projects
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshMatches} 
              className="hover:scale-105 transition-transform w-full md:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Matches
            </Button>
          </div>
        </div>
        
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-[1fr,400px] gap-8'} mt-8`}>
          <div>
            {matchesLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : matches.length > 0 && currentMatch ? (
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
            matches={matches} 
            onMessage={handleMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
