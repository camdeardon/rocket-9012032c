
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { MatchProfileHeader } from "./MatchProfileHeader";
import { MatchActionButtons } from "./MatchActionButtons";
import { MatchScoreIndicator } from "./MatchScoreIndicator";
import { MatchRadarChart } from "./MatchRadarChart";
import { MatchMLInsights } from "./MatchMLInsights";

interface MatchProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  matchType?: string;
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
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
  currentUserId?: string;
}

export const MatchProfile = ({ match, onLike, onPass, onMessage, currentUserId }: MatchProfileProps) => {
  // Ensure match data exists with fallbacks
  const safeMatch = {
    ...match,
    matchScore: {
      skillsMatch: match.matchScore?.skillsMatch || 0,
      interestsMatch: match.matchScore?.interestsMatch || 0,
      locationMatch: match.matchScore?.locationMatch || 0,
      experienceMatch: match.matchScore?.experienceMatch || 0,
      overallMatch: match.matchScore?.overallMatch || 0
    },
    matchType: match.matchType || 'basic'
  };

  // Transform the data for the radar chart
  const matchData = [
    { subject: 'Skills', value: safeMatch.matchScore.skillsMatch, fullMark: 100 },
    { subject: 'Interests', value: safeMatch.matchScore.interestsMatch, fullMark: 100 },
    { subject: 'Location', value: safeMatch.matchScore.locationMatch, fullMark: 100 },
    { subject: 'Experience', value: safeMatch.matchScore.experienceMatch, fullMark: 100 },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
      {safeMatch.matchType !== 'basic' && (
        <div className="mb-4">
          <MatchMLInsights 
            userId={currentUserId} 
            matchType={safeMatch.matchType}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8">
        <div className="space-y-6">
          <MatchProfileHeader 
            name={safeMatch.name}
            avatar={safeMatch.avatar}
            location={safeMatch.location}
            bio={safeMatch.bio}
            skills={safeMatch.skills}
            interests={safeMatch.interests}
          />
          
          <MatchActionButtons 
            onLike={onLike}
            onPass={onPass}
            onMessage={onMessage}
            matchId={safeMatch.id}
            matchName={safeMatch.name}
          />
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <MatchRadarChart matchData={matchData} />
          </div>
          
          <MatchScoreIndicator matchScore={safeMatch.matchScore} />
        </div>
      </div>
    </Card>
  );
};
