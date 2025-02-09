
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { MatchProfile } from "@/components/dashboard/MatchProfile";
import { MatchesPanel } from "@/components/dashboard/MatchesPanel";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const currentUser = {
  id: 1,
  name: "John Doe",
  avatar: "/placeholder.svg",
  bio: "Building a fintech startup focused on democratizing access to investment opportunities.",
  location: "San Francisco, CA",
  skills: ["React", "Node.js", "Product Management"],
  lookingFor: ["UI/UX Designer", "Marketing Expert", "Backend Developer"],
  interests: ["Fintech", "Blockchain", "Social Impact"],
  causes: ["Financial Inclusion", "Education"],
  hobbies: ["Rock Climbing", "Reading", "Travel"],
  project: {
    name: "InvestEasy",
    description: "A platform that makes investing accessible to everyone through fractional shares and educational content."
  }
};

const potentialMatches = [
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    bio: "UX designer with 5 years of experience in fintech",
    location: "New York, NY",
    skills: ["UI/UX Design", "User Research", "Figma"],
    interests: ["Fintech", "Design Systems", "User Psychology"],
    matchScore: {
      skillsMatch: 85,
      interestsMatch: 90,
      locationMatch: 70,
      experienceMatch: 80,
      overallMatch: 85
    }
  },
  {
    id: 3,
    name: "Michael Park",
    avatar: "/placeholder.svg",
    bio: "Full-stack developer passionate about AI",
    location: "Seattle, WA",
    skills: ["React", "Node.js", "Machine Learning"],
    interests: ["AI", "Blockchain", "Hiking"],
    matchScore: {
      skillsMatch: 95,
      interestsMatch: 75,
      locationMatch: 60,
      experienceMatch: 85,
      overallMatch: 80
    }
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "/placeholder.svg",
    bio: "Product manager with startup experience",
    location: "Austin, TX",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    interests: ["Startups", "Innovation", "Tech"],
    matchScore: {
      skillsMatch: 70,
      interestsMatch: 85,
      locationMatch: 65,
      experienceMatch: 90,
      overallMatch: 78
    }
  }
];

const matchData = [
  { subject: 'Skills', A: 85, fullMark: 100 },
  { subject: 'Interests', A: 90, fullMark: 100 },
  { subject: 'Location', A: 70, fullMark: 100 },
  { subject: 'Experience', A: 80, fullMark: 100 },
];

const Dashboard = () => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentMatch = potentialMatches[currentMatchIndex];

  const handleLike = () => {
    toast({
      title: "It's a match! 🎉",
      description: `You and ${currentMatch.name} have been matched! You can now start a project together.`,
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

  const handleMessage = (matchId?: number) => {
    toast({
      title: "Coming soon!",
      description: "The messaging feature will be available soon.",
    });
  };

  const goToProjects = () => {
    navigate('/project-management');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <ProfileSummary user={currentUser} />
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
