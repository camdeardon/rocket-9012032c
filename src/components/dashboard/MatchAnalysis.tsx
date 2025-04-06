
import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";

interface MatchAnalysisProps {
  matchData: Array<{
    subject: string;
    value: number;
    fullMark: number;
  }>;
  matchReason?: string;
}

export const MatchAnalysis = ({ matchData, matchReason }: MatchAnalysisProps) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-primary mb-6 text-center">Match Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={matchData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Match Score']} 
              labelFormatter={(label) => `${label} Match`}
            />
            <Radar
              name="Match"
              dataKey="value"
              stroke="#529493"
              fill="#529493"
              fillOpacity={0.6}
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
