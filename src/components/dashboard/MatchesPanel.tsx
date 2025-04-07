
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Handshake } from "lucide-react";

interface Match {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  isMutual?: boolean;
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
  onMessage: (matchId: string) => void;
}

export const MatchesPanel = ({ matches, onMessage }: MatchesPanelProps) => {
  const [filterBy, setFilterBy] = useState<'overall' | 'skills' | 'interests' | 'location' | 'experience'>('overall');

  const sortedMatches = [...matches].sort((a, b) => {
    // Always prioritize mutual matches
    if (a.isMutual && !b.isMutual) return -1;
    if (!a.isMutual && b.isMutual) return 1;
    
    // Then sort by selected criteria
    switch (filterBy) {
      case 'skills':
        return b.matchScore.skillsMatch - a.matchScore.skillsMatch;
      case 'interests':
        return b.matchScore.interestsMatch - a.matchScore.interestsMatch;
      case 'location':
        return b.matchScore.locationMatch - a.matchScore.locationMatch;
      case 'experience':
        return b.matchScore.experienceMatch - a.matchScore.experienceMatch;
      default:
        return b.matchScore.overallMatch - a.matchScore.overallMatch;
    }
  });

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm h-[calc(100vh-200px)] flex flex-col">
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-bold text-primary">Your Matches</h3>
        <div className="flex flex-wrap gap-2">
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
          <Button 
            variant={filterBy === 'location' ? 'default' : 'outline'}
            onClick={() => setFilterBy('location')}
            size="sm"
          >
            Location
          </Button>
          <Button 
            variant={filterBy === 'experience' ? 'default' : 'outline'}
            onClick={() => setFilterBy('experience')}
            size="sm"
          >
            Experience
          </Button>
        </div>
      </div>
      <div className="space-y-4 overflow-y-auto flex-1">
        {sortedMatches.map((match) => (
          <div 
            key={match.id} 
            className={`flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors ${match.isMutual ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 relative">
                <img src={match.avatar} alt={match.name} />
                {match.isMutual && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                    <Handshake className="h-3 w-3" />
                  </div>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{match.name}</h4>
                  {match.isMutual && (
                    <Badge variant="default" className="text-xs">Mutual</Badge>
                  )}
                </div>
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
                {filterBy === 'overall' && `Overall: ${match.matchScore.overallMatch}%`}
                {filterBy === 'skills' && `Skills: ${match.matchScore.skillsMatch}%`}
                {filterBy === 'interests' && `Interests: ${match.matchScore.interestsMatch}%`}
                {filterBy === 'location' && `Location: ${match.matchScore.locationMatch}%`}
                {filterBy === 'experience' && `Experience: ${match.matchScore.experienceMatch}%`}
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
