
interface MatchScoreProps {
  matchScore: {
    skillsMatch: number;
    interestsMatch: number;
    locationMatch?: number;
    experienceMatch?: number;
    overallMatch: number;
  };
}

export const MatchScoreIndicator = ({ matchScore }: MatchScoreProps) => {
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-primary";
    if (score >= 60) return "bg-accent";
    return "bg-coral";
  };

  return (
    <div className="bg-slate-50/50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Match Analysis</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-secondary-foreground">Skills Match:</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(matchScore.skillsMatch)}`}
                style={{ width: `${matchScore.skillsMatch}%` }}
              ></div>
            </div>
            <span className="font-medium">{matchScore.skillsMatch}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-foreground">Interests Match:</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(matchScore.interestsMatch)}`}
                style={{ width: `${matchScore.interestsMatch}%` }}
              ></div>
            </div>
            <span className="font-medium">{matchScore.interestsMatch}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-foreground">Overall Match:</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(matchScore.overallMatch)}`}
                style={{ width: `${matchScore.overallMatch}%` }}
              ></div>
            </div>
            <span className="font-medium">{matchScore.overallMatch}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 border-t border-gray-200 pt-4">
          The radar chart shows compatibility across different dimensions.
          Higher values indicate stronger matches in each area.
        </p>
      </div>
    </div>
  );
};
