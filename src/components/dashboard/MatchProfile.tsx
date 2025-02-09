
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, X, MessageCircle } from "lucide-react";

interface MatchProfile {
  id: number;
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
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="text-center mb-6">
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
      <div className="flex justify-center gap-4 mt-8">
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
    </Card>
  );
};
