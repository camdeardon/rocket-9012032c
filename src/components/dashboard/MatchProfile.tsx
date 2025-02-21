
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, X, MessageCircle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from "recharts";

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
  const matchData = [
    { subject: 'Skills', score: match.matchScore.skillsMatch },
    { subject: 'Interests', score: match.matchScore.interestsMatch },
    { subject: 'Location', score: match.matchScore.locationMatch },
    { subject: 'Experience', score: match.matchScore.experienceMatch },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="grid grid-cols-[1fr,1fr] gap-8">
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
                {match.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {match.interests.map(interest => (
                  <Badge key={interest} variant="outline">{interest}</Badge>
                ))}
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
              <RadarChart data={matchData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Match"
                  dataKey="score"
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
                Skills Match: {match.matchScore.skillsMatch}%
              </p>
              <p className="text-secondary-foreground">
                Interests Match: {match.matchScore.interestsMatch}%
              </p>
              <p className="text-secondary-foreground">
                Overall Match: {match.matchScore.overallMatch}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
