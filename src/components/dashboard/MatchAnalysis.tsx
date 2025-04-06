
import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";
import { Info } from "lucide-react";

interface MatchAnalysisProps {
  matchData: Array<{
    subject: string;
    value: number;
    fullMark: number;
  }>;
  matchReason?: string;
}

export const MatchAnalysis = ({ matchData, matchReason }: MatchAnalysisProps) => {
  // Ensure we always have data to display
  const safeMatchData = matchData?.length > 0 
    ? matchData 
    : [
        { subject: 'Skills', value: 0, fullMark: 100 },
        { subject: 'Interests', value: 0, fullMark: 100 },
        { subject: 'Experience', value: 0, fullMark: 100 },
        { subject: 'Location', value: 0, fullMark: 100 },
      ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">Match Analysis</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mr-1" />
          <span>Higher values indicate stronger matches</span>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={safeMatchData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Match Score']} 
              labelFormatter={(label) => `${label} Match`}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Radar
              name="Match"
              dataKey="value"
              stroke="#529493"
              fill="#529493"
              fillOpacity={0.6}
              animationDuration={1000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Why this match?</h4>
        <p className="text-secondary-foreground">
          {matchReason || 
            "Based on your profiles, you share similar interests and have complementary skills. " +
            "Your match scores indicate areas where you could collaborate effectively."}
        </p>
      </div>
    </Card>
  );
};
