
import { useState, useMemo } from "react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { MatchAnalysis } from "@/components/dashboard/MatchAnalysis";
import { AlertCircle, ArrowLeft, RefreshCw, Sparkles, PieChart as PieChartIcon, BarChart3, Network } from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loader";
import { FormFeedback } from "@/components/ui/form-feedback";
import { analyzeMatchData } from "@/utils/nlpAnalytics";

const AllMatches = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { matches, isLoading, error, refreshMatches } = useMatchData();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState("topic-clusters");
  
  // Process data for enhanced NLP analysis
  const nlpAnalytics = useMemo(() => {
    return analyzeMatchData(matches);
  }, [matches]);

  const handleRefresh = async () => {
    try {
      toast({
        title: "Refreshing matches",
        description: "Please wait while we update your matches and analyze the data...",
      });
      
      await refreshMatches();
      
      toast({
        title: "Success",
        description: "Your matches have been refreshed and insights updated.",
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
  
  // Original data preparation functions
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
  
  // Colors for visualizations with a more cohesive palette
  const COLORS = ['#529493', '#96cce9', '#8BC34A', '#CDDC39', '#FFEB3B', '#FF9800'];
  const TOPIC_COLORS = ['#529493', '#96cce9', '#6182BA', '#7C6990', '#A3856B', '#BEAB5E'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={handleBack} size="sm" disabled>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">All Matches</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8 mb-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton className="h-[400px]" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 flex flex-col items-center justify-center px-4">
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
    <div className="min-h-screen bg-background py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button variant="ghost" onClick={handleBack} size="sm" className="hover:bg-secondary/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">All Matches</h1>
          </div>
          <Button onClick={handleRefresh} className="hover:scale-105 transition-all shadow-sm group">
            <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Matches
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8 mb-8">
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-primary mb-4">Match Insights</h2>
            
            <Tabs defaultValue="topic-clusters" value={analyticsTab} onValueChange={setAnalyticsTab}>
              <TabsList className="mb-6 bg-secondary/40 p-1">
                <TabsTrigger value="topic-clusters" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-1.5 items-center">
                  <Network className="h-4 w-4" />
                  <span>Topic Clusters</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-1.5 items-center">
                  <BarChart3 className="h-4 w-4" />
                  <span>Skills</span>
                </TabsTrigger>
                <TabsTrigger value="interests" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-1.5 items-center">
                  <Sparkles className="h-4 w-4" />
                  <span>Interests</span>
                </TabsTrigger>
                <TabsTrigger value="distribution" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex gap-1.5 items-center">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Scores</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="topic-clusters" className="mt-0 animate-fade-up">
                {nlpAnalytics.topicClusters.length > 0 ? (
                  <>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={nlpAnalytics.topicTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          {nlpAnalytics.topicClusters.slice(0, 5).map((cluster, index) => (
                            <Line 
                              key={cluster.name}
                              type="monotone" 
                              dataKey={`topic${index + 1}`} 
                              name={cluster.name}
                              stroke={TOPIC_COLORS[index % TOPIC_COLORS.length]} 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2 text-lg">Top Topic Clusters</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nlpAnalytics.topicClusters.slice(0, 4).map((cluster, index) => (
                          <Card key={index} className="p-4 bg-secondary/30 border-secondary">
                            <h4 className="font-medium text-primary">{cluster.name}</h4>
                            <p className="text-sm text-muted-foreground">{cluster.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cluster.keywords.slice(0, 4).map((keyword, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-muted-foreground">No topic data available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0 animate-fade-up">
                <div className="h-[400px]">
                  {skillsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis label={{ value: 'Number of matches', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="count" name="Matches with skill" fill="#529493" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No skills data available</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-lg">Skill Analysis</h3>
                  <p className="text-secondary-foreground">
                    {nlpAnalytics.skillsInsight || 
                      "These are the most common skills among your matches. Consider focusing on these areas for potential collaborations."}
                  </p>
                  {nlpAnalytics.skillGaps && (
                    <FormFeedback 
                      type="neutral"
                      message={`Skill Gap Opportunity: ${nlpAnalytics.skillGaps}`}
                      className="mt-4"
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="interests" className="mt-0 animate-fade-up">
                <div className="h-[400px]">
                  {interestsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={interestsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis label={{ value: 'Number of matches', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="count" name="Matches with interest" fill="#96cce9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No interests data available</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-lg">Interest Analysis</h3>
                  <p className="text-secondary-foreground">
                    {nlpAnalytics.interestsInsight || 
                      "These common interests can be excellent conversation starters when connecting with your matches."}
                  </p>
                  {nlpAnalytics.interestRecommendation && (
                    <FormFeedback 
                      type="success"
                      message={nlpAnalytics.interestRecommendation}
                      className="mt-4"
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="mt-0 animate-fade-up">
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
                      <Tooltip 
                        formatter={(value) => [`${value} matches`, 'Count']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-lg">Score Distribution</h3>
                  <p className="text-secondary-foreground">
                    {nlpAnalytics.scoreDistributionInsight ||
                      "This chart shows how your matches are distributed across different match score ranges."}
                  </p>
                  {nlpAnalytics.matchQualityTip && (
                    <FormFeedback 
                      type={matches.some(m => m.matchScore?.overallMatch >= 85) ? "success" : "neutral"}
                      message={nlpAnalytics.matchQualityTip}
                      className="mt-4"
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          {selectedMatchData ? (
            <MatchAnalysis 
              matchData={prepareMatchDataForRadar(selectedMatchData)} 
              matchReason={
                nlpAnalytics.matchReasons?.[selectedMatchData.id] ||
                `You and ${selectedMatchData.name} share ${selectedMatchData.skills?.length > 0 ? `skills like ${selectedMatchData.skills.slice(0, 2).join(', ')}` : 'several skills'} and ${selectedMatchData.interests?.length > 0 ? `interests like ${selectedMatchData.interests.slice(0, 2).join(', ')}` : 'common interests'}.`
              }
            />
          ) : (
            <Card className="p-6 bg-white shadow-md flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Select a Match</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any match from the table below to view detailed analytics.
                </p>
              </div>
            </Card>
          )}
        </div>
        
        <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-primary mb-4">Your Matches</h2>
          
          {matches && matches.length > 0 ? (
            <Table>
              <TableCaption>A list of all your current matches</TableCaption>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/40">
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
                    className={`cursor-pointer hover:bg-secondary/20 transition-colors ${selectedMatch === match.id ? 'bg-secondary/30' : ''}`}
                    onClick={() => setSelectedMatch(match.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
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
                      <Badge variant={match.matchScore.overallMatch > 75 ? "default" : "outline"} 
                        className={match.matchScore.overallMatch > 85 ? "bg-primary text-white" : ""}>
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
