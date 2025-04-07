
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Handshake, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  currentUserId?: string;
  onRefresh?: () => void;
}

export const MatchesPanel = ({ matches, onMessage, currentUserId, onRefresh }: MatchesPanelProps) => {
  const [filterBy, setFilterBy] = useState<'overall' | 'skills' | 'interests' | 'location' | 'experience'>('overall');
  const [savingMatch, setSavingMatch] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleQuickMatch = async (matchId: string) => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "You must be logged in to create matches",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingMatch(matchId);
      const matchedProfile = matches.find(match => match.id === matchId);
      
      if (!matchedProfile) {
        throw new Error("User not found");
      }
      
      // First check if this is already a mutual match (the other user already liked this user)
      const { data: existingMatch, error: checkError } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', matchId)
        .eq('matched_user_id', currentUserId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking for existing match:", checkError);
        throw checkError;
      }
      
      // Save the match to the database
      const { error } = await supabase
        .from('matches')
        .insert([
          { 
            user_id: currentUserId,
            matched_user_id: matchId,
            match_score: matchedProfile.matchScore.overallMatch,
            skills_match_score: matchedProfile.matchScore.skillsMatch,
            interests_match_score: matchedProfile.matchScore.interestsMatch,
            status: existingMatch ? 'mutual' : 'matched'
          }
        ]);
      
      if (error) {
        console.error("Error saving match:", error);
        throw error;
      }
      
      // If this completes a mutual match, update the other user's match status to mutual
      if (existingMatch) {
        const { error: updateError } = await supabase
          .from('matches')
          .update({ status: 'mutual' })
          .eq('id', existingMatch.id);
        
        if (updateError) {
          console.error("Error updating mutual match:", updateError);
          // Continue despite the error
        }
        
        toast({
          title: "It's a Mutual Match! 🎉✨",
          description: `You and ${matchedProfile.name} have matched with each other!`,
        });
      } else {
        toast({
          title: "Match Created! ⚡",
          description: `You've matched with ${matchedProfile.name}!`,
        });
      }
      
      // Refresh the matches
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error("Error in match process:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingMatch(null);
    }
  };

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
            <div className="flex items-center gap-2">
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
                className="text-rose-500 hover:bg-rose-100"
                onClick={() => handleQuickMatch(match.id)}
                disabled={savingMatch === match.id || match.isMutual}
              >
                <Heart className={`h-5 w-5 ${savingMatch === match.id ? 'animate-pulse' : ''}`} />
              </Button>
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

        {sortedMatches.length === 0 && (
          <div className="flex items-center justify-center h-40 text-center">
            <div>
              <p className="text-muted-foreground mb-2">No matches found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your profile to improve match results</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
