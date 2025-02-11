
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockUser = {
  id: "1",
  name: "John Doe",
  avatar: "/placeholder.svg",
  bio: "Full-stack developer passionate about creating great user experiences",
  location: "San Francisco, CA",
  skills: ["React", "Node.js", "TypeScript"],
  interests: ["Web Development", "UI/UX Design", "Open Source"]
};

const mockMatches = [
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    bio: "UX Designer with 5 years of experience",
    location: "New York, NY",
    skills: ["UI Design", "User Research", "Figma"],
    interests: ["Design Systems", "Accessibility", "User Testing"],
    matchScore: {
      skillsMatch: 85,
      interestsMatch: 90,
      locationMatch: 70,
      experienceMatch: 80,
      overallMatch: 85
    }
  },
  // Add more mock matches as needed
];

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLike = () => {
    toast({
      title: "It's a match! 🎉",
      description: `You and ${mockMatches[currentMatchIndex].name} have been matched!`,
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

  const currentMatch = mockMatches[currentMatchIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <ProfileSummary user={mockUser} />
          <Button onClick={goToProjects} className="hover:scale-105 transition-transform w-full md:w-auto">
            <Briefcase className="mr-2 h-4 w-4" />
            View Projects
          </Button>
        </div>
        
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-[1fr,400px] gap-8'} mt-8`}>
          <div>
            {currentMatch ? (
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
            matches={mockMatches} 
            onMessage={handleMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
