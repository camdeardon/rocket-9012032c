
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface Match {
  id: number;
  name: string;
  avatar: string;
  skills: string[];
  matchScore: {
    skillsMatch: number;
    interestsMatch: number;
    locationMatch: number;
    experienceMatch: number;
    overallMatch: number;
  };
}

interface MatchesPanelProps {
  matches: Match[];
  onMessage: (matchId: number) => void;
}

export const MatchesPanel = ({ matches, onMessage }: MatchesPanelProps) => {
  const [filterBy, setFilterBy] = useState<'overall' | 'skills' | 'interests'>('overall');

  const sortedMatches = [...matches].sort((a, b) => {
    if (filterBy === 'skills') {
      return b.matchScore.skillsMatch - a.matchScore.skillsMatch;
    } else if (filterBy === 'interests') {
      return b.matchScore.interestsMatch - a.matchScore.interestsMatch;
    }
    return b.matchScore.overallMatch - a.matchScore.overallMatch;
  });

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Your Matches</h3>
        <div className="flex gap-2">
          <Button 
            variant={filterBy === 'overall' ? 'default' : 'outline'}
            onClick={() => setFilterBy('overall')}
            size="sm"
          >
            Overall
          </Button>
          <Button 
            variant={filterBy === 'skills' ? 'default' : 'outline'}
            onClick={() => setFilterBy('skills')}
            size="sm"
          >
            Skills
          </Button>
          <Button 
            variant={filterBy === 'interests' ? 'default' : 'outline'}
            onClick={() => setFilterBy('interests')}
            size="sm"
          >
            Interests
          </Button>
        </div>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {sortedMatches.map((match) => (
          <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <img src={match.avatar} alt={match.name} />
              </Avatar>
              <div>
                <h4 className="font-semibold">{match.name}</h4>
                <div className="flex gap-2 mt-1">
                  {match.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={filterBy === 'skills' ? 'default' : 'outline'} className="text-sm">
                Skills: {match.matchScore.skillsMatch}%
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMessage(match.id)}
                className="text-primary"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
