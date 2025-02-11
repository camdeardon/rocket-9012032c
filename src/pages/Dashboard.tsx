
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMatchData } from "@/hooks/useMatchData";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { matches, isLoading: matchesLoading } = useMatchData();
  const { profileData, userSkills, userInterests } = useProfileData();

  const handleLike = () => {
    toast({
      title: "It's a match! 🎉",
      description: `You and ${matches[currentMatchIndex].name} have been matched!`,
    });
    setCurrentMatchIndex(prev => prev + 1);
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

  const currentMatch = matches[currentMatchIndex];

  if (!profileData) {
    return null; // Or loading state
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
          <Button onClick={goToProjects} className="hover:scale-105 transition-transform w-full md:w-auto">
            <Briefcase className="mr-2 h-4 w-4" />
            View Projects
          </Button>
        </div>
        
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-[1fr,400px] gap-8'} mt-8`}>
          <div>
            {matchesLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : currentMatch ? (
              <MatchProfile
                match={currentMatch}
                onLike={handleLike}
                onPass={handlePass}
                onMessage={() => handleMessage(currentMatch.id)}
              />
            ) : (
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
            matches={matches} 
            onMessage={handleMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
