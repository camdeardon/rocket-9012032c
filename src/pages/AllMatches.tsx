
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useMatchData } from "@/hooks/useMatchData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MatchAnalysis } from "@/components/dashboard/MatchAnalysis";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const AllMatches = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { matches, isLoading, error, refreshMatches } = useMatchData();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      toast({
        title: "Refreshing matches",
        description: "Please wait while we update your matches...",
      });
      
      await refreshMatches();
      
      toast({
        title: "Success",
        description: "Your matches have been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing matches:', error);
      toast({
        title: "Error",
        description: "Failed to refresh matches. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  // Analytics data preparation
  const prepareSkillsData = () => {
    if (!matches || matches.length === 0) return [];
    
    // Count skills frequencies across all matches
    const skillsCount: Record<string, number> = {};
    matches.forEach(match => {
      if (match.skills && Array.isArray(match.skills)) {
        match.skills.forEach((skill: string) => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
      }
    });
    
    // Sort by frequency and take top 10
    return Object.entries(skillsCount)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };
  
  const prepareInterestsData = () => {
    if (!matches || matches.length === 0) return [];
    
    // Count interests frequencies across all matches
    const interestsCount: Record<string, number> = {};
    matches.forEach(match => {
      if (match.interests && Array.isArray(match.interests)) {
        match.interests.forEach((interest: string) => {
          interestsCount[interest] = (interestsCount[interest] || 0) + 1;
        });
      }
    });
    
    // Sort by frequency and take top 10
    return Object.entries(interestsCount)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };
  
  const prepareScoreDistributionData = () => {
    if (!matches || matches.length === 0) return [];
    
    // Create score ranges
    const ranges = [
      { name: "90-100%", range: [90, 100], count: 0 },
      { name: "80-89%", range: [80, 89], count: 0 },
      { name: "70-79%", range: [70, 79], count: 0 },
      { name: "60-69%", range: [60, 69], count: 0 },
      { name: "50-59%", range: [50, 59], count: 0 },
      { name: "<50%", range: [0, 49], count: 0 }
    ];
    
    // Count matches in each range
    matches.forEach(match => {
      const score = match.matchScore?.overallMatch || 0;
      const range = ranges.find(r => score >= r.range[0] && score <= r.range[1]);
      if (range) range.count++;
    });
    
    return ranges;
  };
  
  const skillsData = prepareSkillsData();
  const interestsData = prepareInterestsData();
  const scoreDistributionData = prepareScoreDistributionData();
  
  // Colors for pie chart
  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8 flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Error Loading Matches</h2>
        <p className="text-center mb-6">We encountered an error while loading your matches.</p>
        <div className="flex gap-4">
          <Button onClick={handleRefresh}>Try Again</Button>
          <Button variant="outline" onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  const selectedMatchData = selectedMatch 
    ? matches.find(m => m.id === selectedMatch) 
    : null;
  
  // Prepare match data for radar chart
  const prepareMatchDataForRadar = (match: any) => {
    if (!match) return [];
    
    return [
      { subject: 'Skills', value: match.matchScore.skillsMatch, fullMark: 100 },
      { subject: 'Interests', value: match.matchScore.interestsMatch, fullMark: 100 },
      { subject: 'Location', value: match.matchScore.locationMatch, fullMark: 100 },
      { subject: 'Experience', value: match.matchScore.experienceMatch, fullMark: 100 },
    ];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button variant="ghost" onClick={handleBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">All Matches</h1>
          </div>
          <Button onClick={handleRefresh} className="hover:scale-105 transition-transform">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Matches
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-primary mb-4">Match Analytics</h2>
            
            <Tabs defaultValue="skills">
              <TabsList className="mb-4">
                <TabsTrigger value="skills">Top Skills</TabsTrigger>
                <TabsTrigger value="interests">Top Interests</TabsTrigger>
                <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills">
                <div className="h-[400px]">
                  {skillsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Number of matches', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Matches with skill" fill="#529493" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No skills data available</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This chart shows the most common skills among your matches. These are areas where you might find good collaboration opportunities.
                </p>
              </TabsContent>
              
              <TabsContent value="interests">
                <div className="h-[400px]">
                  {interestsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={interestsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Number of matches', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Matches with interest" fill="#8BC34A" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No interests data available</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This chart shows the most common interests among your matches. These are topics you could discuss to build rapport with your matches.
                </p>
              </TabsContent>
              
              <TabsContent value="distribution">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} matches`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This chart shows the distribution of match scores across all your matches. Higher percentages indicate stronger overall compatibility.
                </p>
              </TabsContent>
            </Tabs>
          </Card>
          
          {selectedMatchData ? (
            <MatchAnalysis 
              matchData={prepareMatchDataForRadar(selectedMatchData)} 
              matchReason={`You and ${selectedMatchData.name} share ${selectedMatchData.skills?.length > 0 ? `skills like ${selectedMatchData.skills.slice(0, 2).join(', ')}` : 'several skills'} and ${selectedMatchData.interests?.length > 0 ? `interests like ${selectedMatchData.interests.slice(0, 2).join(', ')}` : 'common interests'}.`}
            />
          ) : (
            <Card className="p-6 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Select a Match</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any match from the table below to view detailed analytics.
                </p>
              </div>
            </Card>
          )}
        </div>
        
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-primary mb-4">Your Matches</h2>
          
          {matches && matches.length > 0 ? (
            <Table>
              <TableCaption>A list of all your current matches</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead className="text-right">Overall Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow 
                    key={match.id} 
                    className={`cursor-pointer hover:bg-accent/20 ${selectedMatch === match.id ? 'bg-accent/20' : ''}`}
                    onClick={() => setSelectedMatch(match.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src={match.avatar} alt={match.name} />
                        </Avatar>
                        <div>
                          <p className="font-medium">{match.name}</p>
                          <p className="text-xs text-muted-foreground">{match.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {match.skills?.slice(0, 2).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {match.skills?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {match.interests?.slice(0, 2).map((interest: string) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {match.interests?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={match.matchScore.overallMatch > 75 ? "default" : "outline"}>
                        {match.matchScore.overallMatch}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Matches Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find any matches for your profile yet.
              </p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Matches
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AllMatches;
