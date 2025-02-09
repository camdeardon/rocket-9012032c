
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { Heart, X, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - In real app, this would come from your backend
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
  // Add more potential matches here
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
  const currentMatch = potentialMatches[currentMatchIndex];

  const handleLike = () => {
    toast({
      title: "It's a match! 🎉",
      description: `You and ${currentMatch.name} have been matched! You can now start chatting.`,
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

  const handleMessage = () => {
    toast({
      title: "Coming soon!",
      description: "The messaging feature will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* User Profile Summary */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <img src={currentUser.avatar} alt={currentUser.name} />
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary mb-2">{currentUser.name}</h1>
              <p className="text-secondary-foreground mb-4">{currentUser.bio}</p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Looking for</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.lookingFor.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Matching Interface */}
        {currentMatch && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Potential Match Profile */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="text-center mb-6">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <img src={currentMatch.avatar} alt={currentMatch.name} />
                </Avatar>
                <h2 className="text-2xl font-bold text-primary">{currentMatch.name}</h2>
                <p className="text-secondary-foreground">{currentMatch.location}</p>
              </div>
              <div className="space-y-4">
                <p className="text-secondary-foreground">{currentMatch.bio}</p>
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.interests.map(interest => (
                      <Badge key={interest} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full p-4"
                  onClick={handlePass}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full p-4 bg-primary"
                  onClick={handleLike}
                >
                  <Heart className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full p-4"
                  onClick={handleMessage}
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </div>
            </Card>

            {/* Match Analysis */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-primary mb-6 text-center">Match Analysis</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={matchData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name="Match"
                      dataKey="A"
                      stroke="#529493"
                      fill="#529493"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Why this match?</h4>
                <p className="text-secondary-foreground">
                  Based on your profiles, you share similar interests in fintech and have complementary skills.
                  Sarah's design expertise could be valuable for your project's user experience.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
