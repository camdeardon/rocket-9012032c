
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CircleDashed, Brain, BrainCircuit, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { generateMLRecommendations } from "@/utils/mlUtils";

interface MatchMLInsightsProps {
  userId: string | undefined;
  matchType?: string;
  onRecommendationsGenerated?: () => void;
}

export const MatchMLInsights = ({ userId, matchType = 'basic', onRecommendationsGenerated }: MatchMLInsightsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  
  // Generate ML recommendations when component mounts if user ID is available
  useEffect(() => {
    const checkAndGenerateRecommendations = async () => {
      if (userId && matchType === 'basic') {
        setIsGenerating(true);
        const result = await generateMLRecommendations(userId);
        setIsGenerating(false);
        
        if (result.success) {
          setLastGenerated(new Date());
          if (onRecommendationsGenerated) {
            onRecommendationsGenerated();
          }
        }
      }
    };
    
    checkAndGenerateRecommendations();
  }, [userId, matchType, onRecommendationsGenerated]);
  
  const MatchTypeIcon = matchType === 'hybrid' ? BrainCircuit : 
                      matchType === 'collaborative' ? Brain : CircleDashed;
  
  return (
    <Card className="p-3 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MatchTypeIcon className={`h-4 w-4 ${
            matchType === 'hybrid' ? 'text-primary' : 
            matchType === 'collaborative' ? 'text-blue-500' : 'text-slate-400'
          }`} />
          
          <Badge variant={matchType === 'basic' ? "outline" : "default"} className="text-xs">
            {matchType === 'hybrid' ? 'ML Enhanced Match' : 
             matchType === 'collaborative' ? 'Collaborative Match' : 
             'Basic Match'}
          </Badge>
        </div>
        
        {isGenerating ? (
          <div className="flex items-center gap-1">
            <div className="animate-spin h-3 w-3 border border-b-transparent border-primary rounded-full" />
            <span className="text-xs text-muted-foreground">Analyzing</span>
          </div>
        ) : lastGenerated ? (
          <div className="flex items-center gap-1">
            <CircleCheck className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground">
              ML Enhanced
            </span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
