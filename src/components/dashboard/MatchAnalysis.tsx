
import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

interface MatchAnalysisProps {
  matchData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

export const MatchAnalysis = ({ matchData }: MatchAnalysisProps) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-primary mb-6 text-center">Match Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={matchData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              name="Match"
              dataKey="A"
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
          Based on your profiles, you share similar interests in fintech and have complementary skills.
          Sarah's design expertise could be valuable for your project's user experience.
        </p>
      </div>
    </Card>
  );
};
