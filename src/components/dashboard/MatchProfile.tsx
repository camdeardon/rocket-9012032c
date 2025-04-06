
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, X, MessageCircle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";

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
  // Transform the data for the radar chart
  const matchData = [
    { subject: 'Skills', value: match.matchScore.skillsMatch, fullMark: 100 },
    { subject: 'Interests', value: match.matchScore.interestsMatch, fullMark: 100 },
    { subject: 'Location', value: match.matchScore.locationMatch, fullMark: 100 },
    { subject: 'Experience', value: match.matchScore.experienceMatch, fullMark: 100 },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <img src={match.avatar} alt={match.name} />
            </Avatar>
            <h2 className="text-2xl font-bold text-primary">{match.name}</h2>
            <p className="text-secondary-foreground">{match.location}</p>
          </div>
          <div className="space-y-4">
            <p className="text-secondary-foreground">{match.bio}</p>
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {match.skills.slice(0, 5).map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
                {match.skills.length > 5 && (
                  <Badge variant="outline">+{match.skills.length - 5} more</Badge>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {match.interests.slice(0, 5).map(interest => (
                  <Badge key={interest} variant="outline">{interest}</Badge>
                ))}
                {match.interests.length > 5 && (
                  <Badge variant="outline">+{match.interests.length - 5} more</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-4"
              onClick={onPass}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              className="rounded-full p-4 bg-primary"
              onClick={onLike}
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full p-4"
              onClick={onMessage}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={matchData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Match Score']} 
                  labelFormatter={(label) => `${label} Match`}
                />
                <Radar
                  name="Match"
                  dataKey="value"
                  stroke="#529493"
                  fill="#529493"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Match Analysis</h4>
            <div className="space-y-2">
              <p className="text-secondary-foreground">
                <span className="font-medium">Skills Match:</span> {match.matchScore.skillsMatch}%
              </p>
              <p className="text-secondary-foreground">
                <span className="font-medium">Interests Match:</span> {match.matchScore.interestsMatch}%
              </p>
              <p className="text-secondary-foreground">
                <span className="font-medium">Overall Match:</span> {match.matchScore.overallMatch}%
              </p>
              <p className="text-sm text-muted-foreground mt-4">
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
