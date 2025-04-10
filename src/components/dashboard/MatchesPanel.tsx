
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Handshake, UserCheck, Search, BrainCircuit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Match {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  isMutual?: boolean;
  matchType?: string;
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
  currentUserId?: string;
  onRefresh?: () => void;
}

export const MatchesPanel = ({ matches, onMessage, currentUserId, onRefresh }: MatchesPanelProps) => {
  const [filterBy, setFilterBy] = useState<'overall' | 'skills' | 'interests' | 'location' | 'experience'>('overall');
  const [savingMatch, setSavingMatch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    match.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    // Always prioritize mutual matches
    if (a.isMutual && !b.isMutual) return -1;
    if (!a.isMutual && b.isMutual) return 1;
    
    // Prioritize ML-enhanced matches if sorting by overall
    if (filterBy === 'overall') {
      const aIsML = a.matchType && a.matchType !== 'basic';
      const bIsML = b.matchType && b.matchType !== 'basic';
      if (aIsML && !bIsML) return -1;
      if (!aIsML && bIsML) return 1;
    }
    
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

  // Handle viewing a user's profile
  const handleViewProfile = (matchId: string) => {
    navigate(`/profile/${matchId}${!matches.find(m => m.id === matchId)?.isMutual ? '?connectionRequest=true' : ''}`);
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm h-[calc(100vh-200px)] flex flex-col shadow-md">
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-bold text-primary">Your Matches</h3>
        
        <div className="relative">
          <Input 
            placeholder="Search by name or skill..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterBy === 'overall' ? 'default' : 'outline'}
            onClick={() => setFilterBy('overall')}
            size="sm"
            className="transition-all"
          >
            Overall
          </Button>
          <Button 
            variant={filterBy === 'skills' ? 'default' : 'outline'}
            onClick={() => setFilterBy('skills')}
            size="sm"
            className="transition-all"
          >
            Skills
          </Button>
          <Button 
            variant={filterBy === 'interests' ? 'default' : 'outline'}
            onClick={() => setFilterBy('interests')}
            size="sm"
            className="transition-all"
          >
            Interests
          </Button>
          <Button 
            variant={filterBy === 'experience' ? 'default' : 'outline'}
            onClick={() => setFilterBy('experience')}
            size="sm"
            className="transition-all"
          >
            Experience
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {sortedMatches.map((match) => (
          <div 
            key={match.id} 
            className={`flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer ${match.isMutual ? 'border-primary/50 bg-primary/5 shadow-sm' : match.matchType && match.matchType !== 'basic' ? 'border-blue-300/50 bg-blue-50/30' : ''}`}
            onClick={() => handleViewProfile(match.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 relative">
                <img src={match.avatar} alt={match.name} className="object-cover" />
                {match.isMutual && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                    <Handshake className="h-3 w-3" />
                  </div>
                )}
                {match.matchType && match.matchType !== 'basic' && (
                  <div className="absolute -bottom-1 -left-1 bg-blue-500 text-white rounded-full p-1">
                    <BrainCircuit className="h-3 w-3" />
                  </div>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{match.name}</h4>
                  {match.isMutual && (
                    <Badge variant="default" className="text-[10px] py-0 h-4">Mutual</Badge>
                  )}
                  {match.matchType && match.matchType !== 'basic' && (
                    <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-blue-100 text-blue-800">ML</Badge>
                  )}
                </div>
                <div className="flex gap-1 mt-0.5">
                  {match.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] py-0 h-4">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={filterBy === 'skills' ? 'default' : 'outline'} className="text-xs">
                {filterBy === 'overall' && `${match.matchScore?.overallMatch || 0}%`}
                {filterBy === 'skills' && `${match.matchScore?.skillsMatch || 0}%`}
                {filterBy === 'interests' && `${match.matchScore?.interestsMatch || 0}%`}
                {filterBy === 'experience' && `${match.matchScore?.experienceMatch || 0}%`}
              </Badge>
              {match.isMutual && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage(match.id);
                  }}
                  className="text-primary h-7 w-7"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              {!match.isMutual && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(match.id);
                  }}
                  className="h-7 w-7 text-primary"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {sortedMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center bg-slate-50/70 rounded-lg p-4">
            <div className="text-muted-foreground">
              {searchQuery ? (
                <>
                  <p className="font-medium mb-2">No matches found for "{searchQuery}"</p>
                  <p className="text-sm">Try adjusting your search term</p>
                </>
              ) : (
                <>
                  <p className="font-medium mb-2">No matches found</p>
                  <p className="text-sm">Try adjusting your profile to improve match results</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
