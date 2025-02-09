
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, ChevronRight, ChevronLeft } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Find Your Perfect Match</h1>
          <p className="text-xl text-secondary-foreground">Swipe right on your future co-founder</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-3">
            <ProfileCard />
          </div>

          {/* Main Matching Section */}
          <div className="lg:col-span-6">
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
  <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
    <div className="relative">
      <div className="h-24 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
      <div className="absolute -bottom-12 left-6">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 shadow-lg" />
      </div>
    </div>
    <div className="mt-14 space-y-4">
      <h2 className="text-xl font-semibold text-primary">John Doe</h2>
      <p className="text-sm text-secondary-foreground">Technical Co-Founder</p>
      <div className="space-y-2">
        <p className="text-sm font-medium text-secondary-foreground">Core Skills</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Full-Stack Development</Badge>
          <Badge variant="secondary">System Architecture</Badge>
          <Badge variant="secondary">AI/ML</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-secondary-foreground">Interests</p>
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
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary">Potential Match</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentProfile(prev => Math.max(0, prev - 1))}
              disabled={currentProfile === 0}
              className="hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentProfile(prev => Math.min(profiles.length - 1, prev + 1))}
              disabled={currentProfile === profiles.length - 1}
              className="hover:bg-primary/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-accent/20" />
          <div>
            <h3 className="font-semibold text-lg text-secondary-foreground">{profiles[currentProfile].name}</h3>
            <p className="text-sm text-secondary-foreground/70">{profiles[currentProfile].role} • {profiles[currentProfile].location}</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={profiles[currentProfile].compatibility}>
              <PolarGrid stroke="#96cce9" />
              <PolarAngleAxis dataKey="subject" stroke="#132641" />
              <Radar
                name="You"
                dataKey="A"
                stroke="#529493"
                fill="#529493"
                fillOpacity={0.3}
              />
              <Radar
                name={profiles[currentProfile].name}
                dataKey="B"
                stroke="#96cce9"
                fill="#96cce9"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full w-16 h-16 hover:bg-red-100"
            onClick={() => setCurrentProfile(prev => prev + 1)}
          >
            <X className="h-8 w-8 text-red-500" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 hover:bg-green-100"
            onClick={() => setCurrentProfile(prev => prev + 1)}
          >
            <Heart className="h-8 w-8 text-green-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const RecommendedMatches = () => (
  <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
    <h3 className="font-semibold mb-4 text-primary">Today's Top Matches</h3>
    <div className="space-y-4">
      {[1, 2, 3].map((suggestion) => (
        <div key={suggestion} className="group flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-accent/20" />
          <div className="flex-1">
            <h4 className="font-medium text-secondary-foreground">Alex Johnson</h4>
            <p className="text-sm text-secondary-foreground/70">Product Strategy • 85% Match</p>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </Button>
        </div>
      ))}
    </div>
  </Card>
);

export default Index;
