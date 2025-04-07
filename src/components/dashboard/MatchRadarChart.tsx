
import { Info } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";

interface MatchRadarChartProps {
  matchData: Array<{
    subject: string;
    value: number;
    fullMark: number;
  }>;
}

export const MatchRadarChart = ({ matchData }: MatchRadarChartProps) => {
  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-primary">Compatibility Chart</h3>
        <div className="flex items-center text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mr-1" />
          <span>Higher values indicate stronger matches</span>
        </div>
      </div>
      
      <div className="bg-white/50 rounded-lg p-4 shadow-sm h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={matchData}>
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
    </div>
  );
};
