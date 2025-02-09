
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, FileText, Heart, Image, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Temporary mock data - replace with real data later
const profileData = {
  name: "Sarah Chen",
  title: "Full Stack Developer",
  location: "San Francisco, CA",
  avatar: "/placeholder.svg",
  bio: "Passionate developer with 5+ years of experience building scalable web applications. Looking to collaborate on innovative projects.",
  interests: ["AI/ML", "Web3", "Cloud Architecture", "Mobile Development", "UI/UX Design"],
  background: "Previously led engineering teams at startups and Fortune 500 companies. Master's in Computer Science from Stanford University.",
  skills: ["React", "Node.js", "TypeScript", "AWS", "Python", "Docker"],
  currentProjects: [
    {
      name: "EcoTrack",
      description: "A sustainability tracking platform helping users reduce their carbon footprint",
      role: "Tech Lead"
    }
  ],
  previousProjects: [
    {
      name: "HealthConnect",
      description: "Telemedicine platform connecting patients with healthcare providers",
      role: "Senior Developer"
    },
    {
      name: "FinTech Analytics",
      description: "Real-time financial data analysis dashboard",
      role: "Full Stack Developer"
    }
  ]
};

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Header Section */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-32 w-32">
              <img src={profileData.avatar} alt={profileData.name} className="object-cover" />
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-primary">{profileData.name}</h1>
                  <p className="text-xl text-secondary-foreground">{profileData.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-secondary-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/project-management')}
                >
                  <Briefcase className="h-4 w-4" />
                  View Projects
                </Button>
              </div>
              <p className="mt-4 text-secondary-foreground">{profileData.bio}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            {/* Background Section */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Background</h2>
              </div>
              <p className="text-secondary-foreground">{profileData.background}</p>
            </Card>

            {/* Projects Section */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Current Projects</h2>
              </div>
              <div className="space-y-4">
                {profileData.currentProjects.map((project, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold text-primary">{project.name}</h3>
                    <p className="text-sm text-secondary-foreground mt-1">{project.description}</p>
                    <Badge variant="outline" className="mt-2">{project.role}</Badge>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Previous Projects</h2>
              </div>
              <div className="space-y-4">
                {profileData.previousProjects.map((project, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold text-primary">{project.name}</h3>
                    <p className="text-sm text-secondary-foreground mt-1">{project.description}</p>
                    <Badge variant="outline" className="mt-2">{project.role}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Skills Section */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>

            {/* Interests Section */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Interests</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>
            </Card>

            {/* Resume Upload Section */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Resume</h2>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
