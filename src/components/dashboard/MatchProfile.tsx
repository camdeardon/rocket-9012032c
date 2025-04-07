
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MessageCircle, Info, Zap } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";
import { useState } from "react";

interface MatchProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  matchScore: {
    skillsMatch: number;
    interestsMatch: number;
    locationMatch: number;
    experienceMatch: number;
    overallMatch: number;
  };
}

interface MatchProfileProps {
  match: MatchProfile;
  onLike: () => void;
  onPass: () => void;
  onMessage: () => void;
}

export const MatchProfile = ({ match, onLike, onPass, onMessage }: MatchProfileProps) => {
  const [isLiking, setIsLiking] = useState(false);
  
  // Ensure match data exists with fallbacks
  const safeMatch = {
    ...match,
    matchScore: {
      skillsMatch: match.matchScore?.skillsMatch || 0,
      interestsMatch: match.matchScore?.interestsMatch || 0,
      locationMatch: match.matchScore?.locationMatch || 0,
      experienceMatch: match.matchScore?.experienceMatch || 0,
      overallMatch: match.matchScore?.overallMatch || 0
    }
  };

  // Transform the data for the radar chart
  const matchData = [
    { subject: 'Skills', value: safeMatch.matchScore.skillsMatch, fullMark: 100 },
    { subject: 'Interests', value: safeMatch.matchScore.interestsMatch, fullMark: 100 },
    { subject: 'Location', value: safeMatch.matchScore.locationMatch, fullMark: 100 },
    { subject: 'Experience', value: safeMatch.matchScore.experienceMatch, fullMark: 100 },
  ];
  
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4 ring-2 ring-primary/20 shadow-md">
              <img src={safeMatch.avatar} alt={safeMatch.name} className="object-cover" />
            </Avatar>
            <h2 className="text-2xl font-bold text-primary">{safeMatch.name}</h2>
            <p className="text-secondary-foreground flex items-center justify-center gap-1">
              {safeMatch.location || "No location specified"}
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg">
            <p className="text-secondary-foreground italic">{safeMatch.bio || "No bio available"}</p>
            <div>
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {safeMatch.skills && safeMatch.skills.length > 0 ? (
                  <>
                    {safeMatch.skills.slice(0, 5).map(skill => (
                      <Badge key={skill} variant="secondary" className="animate-fade-in">{skill}</Badge>
                    ))}
                    {safeMatch.skills.length > 5 && (
                      <Badge variant="outline">+{safeMatch.skills.length - 5} more</Badge>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {safeMatch.interests && safeMatch.interests.length > 0 ? (
                  <>
                    {safeMatch.interests.slice(0, 5).map(interest => (
                      <Badge key={interest} variant="outline" className="animate-fade-in">{interest}</Badge>
                    ))}
                    {safeMatch.interests.length > 5 && (
                      <Badge variant="outline">+{safeMatch.interests.length - 5} more</Badge>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No interests listed</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-4 hover:bg-destructive/10 hover:border-destructive transition-colors"
              onClick={onPass}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              className={`rounded-full p-4 bg-primary hover:bg-primary/90 transition-colors ${isLiking ? 'opacity-80' : 'animate-pulse'}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Zap className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-4 hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
              onClick={onMessage}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary">Compatibility Chart</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>Higher values indicate stronger matches</span>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={matchData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Match Score']} 
                    labelFormatter={(label) => `${label} Match`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Radar
                    name="Match"
                    dataKey="value"
                    stroke="#529493"
                    fill="#529493"
                    fillOpacity={0.6}
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Match Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary-foreground">Skills Match:</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${safeMatch.matchScore.skillsMatch}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{safeMatch.matchScore.skillsMatch}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-foreground">Interests Match:</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${safeMatch.matchScore.interestsMatch}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{safeMatch.matchScore.interestsMatch}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-foreground">Overall Match:</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${safeMatch.matchScore.overallMatch}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{safeMatch.matchScore.overallMatch}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 border-t border-gray-200 pt-4">
                The radar chart shows compatibility across different dimensions.
                Higher values indicate stronger matches in each area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
