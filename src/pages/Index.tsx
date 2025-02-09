
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Share2, ChevronRight, ChevronLeft } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-3">
            <ProfileCard />
          </div>

          {/* Main Matching Section */}
          <div className="lg:col-span-6 space-y-6">
            <MatchingCard />
          </div>

          {/* Network Section */}
          <div className="lg:col-span-3">
            <RecommendedMatches />
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileCard = () => (
  <Card className="p-6 animate-fade-up">
    <div className="relative">
      <div className="h-24 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
      <div className="absolute -bottom-12 left-6">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200" />
      </div>
    </div>
    <div className="mt-14 space-y-4">
      <h2 className="text-xl font-semibold">John Doe</h2>
      <p className="text-sm text-gray-600">Technical Co-Founder</p>
      <div className="space-y-2">
        <p className="text-sm font-medium">Core Skills</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Full-Stack Development</Badge>
          <Badge variant="secondary">System Architecture</Badge>
          <Badge variant="secondary">AI/ML</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Interests</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Sustainability</Badge>
          <Badge variant="outline">EdTech</Badge>
          <Badge variant="outline">Social Impact</Badge>
        </div>
      </div>
    </div>
  </Card>
);

const MatchingCard = () => {
  const [currentProfile, setCurrentProfile] = useState(0);
  const profiles = [
    {
      name: "Sarah Chen",
      role: "Business Development",
      location: "San Francisco, CA",
      compatibility: [
        { subject: 'Experience', A: 90, B: 85 },
        { subject: 'Technical Skills', A: 50, B: 95 },
        { subject: 'Business Skills', A: 95, B: 45 },
        { subject: 'Industry Knowledge', A: 80, B: 75 },
        { subject: 'Values Alignment', A: 90, B: 85 },
      ]
    },
    // ... Add more profiles here
  ];

  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Potential Co-Founder Match</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentProfile(prev => Math.max(0, prev - 1))}
              disabled={currentProfile === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentProfile(prev => Math.min(profiles.length - 1, prev + 1))}
              disabled={currentProfile === profiles.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div>
            <h3 className="font-semibold text-lg">{profiles[currentProfile].name}</h3>
            <p className="text-sm text-gray-500">{profiles[currentProfile].role} • {profiles[currentProfile].location}</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={profiles[currentProfile].compatibility}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                name="You"
                dataKey="A"
                stroke="#0A66C2"
                fill="#0A66C2"
                fillOpacity={0.3}
              />
              <Radar
                name={profiles[currentProfile].name}
                dataKey="B"
                stroke="#057642"
                fill="#057642"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between">
          <Button variant="outline">Pass</Button>
          <Button>Connect</Button>
        </div>
      </div>
    </Card>
  );
};

const RecommendedMatches = () => (
  <Card className="p-6 animate-fade-up">
    <h3 className="font-semibold mb-4">Recommended Matches</h3>
    <div className="space-y-4">
      {[1, 2, 3].map((suggestion) => (
        <div key={suggestion} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1">
            <h4 className="font-medium">Alex Johnson</h4>
            <p className="text-sm text-gray-500">Product Strategy • 85% Match</p>
          </div>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      ))}
    </div>
  </Card>
);

export default Index;
