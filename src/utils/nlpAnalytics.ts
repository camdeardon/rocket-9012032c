
/**
 * NLP Analytics Utility
 * Provides natural language processing functions for analyzing match data
 */

interface TopicCluster {
  name: string;
  description: string;
  keywords: string[];
  value: number;
}

interface NlpAnalyticsResult {
  topicClusters: TopicCluster[];
  topicTrends: { name: string; topic1: number; topic2: number; topic3: number; topic4: number; topic5: number; }[];
  skillsInsight: string;
  interestsInsight: string;
  scoreDistributionInsight: string;
  skillGaps: string | null;
  interestRecommendation: string | null;
  matchQualityTip: string | null;
  matchReasons: Record<string, string>;
}

/**
 * Analyzes match data using various NLP techniques
 * @param matches Array of match objects
 * @returns Analysis results with insights
 */
export const analyzeMatchData = (matches: any[]): NlpAnalyticsResult => {
  if (!matches || matches.length === 0) {
    return {
      topicClusters: [],
      topicTrends: [],
      skillsInsight: "",
      interestsInsight: "",
      scoreDistributionInsight: "",
      skillGaps: null,
      interestRecommendation: null,
      matchQualityTip: null,
      matchReasons: {},
    };
  }

  // Extract all skills and interests
  const allSkills: string[] = [];
  const allInterests: string[] = [];
  const highQualityMatches = matches.filter(m => m.matchScore?.overallMatch >= 75);
  
  matches.forEach(match => {
    if (match.skills && Array.isArray(match.skills)) {
      allSkills.push(...match.skills);
    }
    if (match.interests && Array.isArray(match.interests)) {
      allInterests.push(...match.interests);
    }
  });
  
  // 1. Generate topic clusters using simple frequency-based clustering
  const topicClusters = identifyTopicClusters(allSkills, allInterests);
  
  // 2. Create simulated topic trends (would normally use time-series data)
  const topicTrends = generateTopicTrends(topicClusters);
  
  // 3. Generate insights based on skills
  const skillsInsight = generateSkillsInsight(matches, allSkills);
  
  // 4. Generate insights based on interests
  const interestsInsight = generateInterestsInsight(matches, allInterests);
  
  // 5. Generate score distribution insights
  const scoreDistributionInsight = generateScoreInsight(matches);
  
  // 6. Generate skill gaps insight
  const skillGaps = identifySkillGaps(allSkills);
  
  // 7. Generate interest recommendations
  const interestRecommendation = generateInterestRecommendation(allInterests);
  
  // 8. Generate match quality tip
  const matchQualityTip = generateMatchQualityTip(matches);
  
  // 9. Generate personalized match reasons
  const matchReasons = generateMatchReasons(matches);
  
  return {
    topicClusters,
    topicTrends,
    skillsInsight,
    interestsInsight,
    scoreDistributionInsight,
    skillGaps,
    interestRecommendation,
    matchQualityTip,
    matchReasons,
  };
};

/**
 * Identifies topic clusters from skills and interests
 */
function identifyTopicClusters(skills: string[], interests: string[]): TopicCluster[] {
  // This is a simplified approach - in a real system, you'd use an actual clustering algorithm
  
  // Define some common business domains/clusters
  const techCluster = {
    name: "Technology",
    keywords: ["JavaScript", "React", "Programming", "Software", "IT", "Development", "Coding", "Tech", "AI", "Web"],
    matches: 0,
  };
  
  const businessCluster = {
    name: "Business Operations",
    keywords: ["Management", "Marketing", "Strategy", "Leadership", "Business", "Operations", "Finance", "Sales", "Growth"],
    matches: 0,
  };
  
  const creativeCluster = {
    name: "Creative Industries",
    keywords: ["Design", "Art", "Creative", "Media", "Visual", "Writing", "Content", "UX", "UI"],
    matches: 0,
  };
  
  const analyticsCluster = {
    name: "Data & Analytics",
    keywords: ["Data", "Analytics", "Research", "Statistics", "Analysis", "Science", "Metrics", "Insights"],
    matches: 0,
  };
  
  const consultingCluster = {
    name: "Consulting & Advisory",
    keywords: ["Consulting", "Advisory", "Strategy", "Mentoring", "Coaching", "Solutions"],
    matches: 0,
  };
  
  // Count matches for each cluster
  const allTerms = [...skills, ...interests].map(term => term.toLowerCase());
  
  allTerms.forEach(term => {
    if (techCluster.keywords.some(keyword => term.includes(keyword.toLowerCase()))) {
      techCluster.matches++;
    }
    if (businessCluster.keywords.some(keyword => term.includes(keyword.toLowerCase()))) {
      businessCluster.matches++;
    }
    if (creativeCluster.keywords.some(keyword => term.includes(keyword.toLowerCase()))) {
      creativeCluster.matches++;
    }
    if (analyticsCluster.keywords.some(keyword => term.includes(keyword.toLowerCase()))) {
      analyticsCluster.matches++;
    }
    if (consultingCluster.keywords.some(keyword => term.includes(keyword.toLowerCase()))) {
      consultingCluster.matches++;
    }
  });
  
  const clusters = [
    {
      name: techCluster.name,
      description: "Technology and software development skills and interests",
      keywords: techCluster.keywords,
      value: techCluster.matches,
    },
    {
      name: businessCluster.name,
      description: "Business management, strategy and operational skills",
      keywords: businessCluster.keywords,
      value: businessCluster.matches,
    },
    {
      name: creativeCluster.name,
      description: "Creative design, art and media related skills",
      keywords: creativeCluster.keywords, 
      value: creativeCluster.matches,
    },
    {
      name: analyticsCluster.name,
      description: "Data analysis, research and statistical skills",
      keywords: analyticsCluster.keywords,
      value: analyticsCluster.matches,
    },
    {
      name: consultingCluster.name,
      description: "Advisory and consulting expertise",
      keywords: consultingCluster.keywords,
      value: consultingCluster.matches,
    }
  ];
  
  // Sort by frequency
  return clusters.sort((a, b) => b.value - a.value);
}

/**
 * Generates simulated topic trends data
 */
function generateTopicTrends(clusters: TopicCluster[]) {
  // In a real application, we'd use historical data to build these trends
  // For this demo, we'll simulate trend data
  const periods = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  return periods.map((period, i) => {
    const result: any = { name: period };
    
    // Add data for top 5 clusters with some randomization to simulate trends
    clusters.slice(0, 5).forEach((cluster, index) => {
      // Create a trend that increases/decreases over time with some randomness
      const baseValue = cluster.value * (0.7 + (i * 0.05));
      const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1 random factor
      result[`topic${index + 1}`] = Math.round(baseValue * randomFactor);
    });
    
    return result;
  });
}

/**
 * Generates insights based on skills analysis
 */
function generateSkillsInsight(matches: any[], skills: string[]): string {
  const skillCount = new Map<string, number>();
  
  skills.forEach(skill => {
    skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
  });
  
  // Get top skills
  const topSkills = Array.from(skillCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  
  if (topSkills.length === 0) {
    return "No common skills identified among your matches.";
  }
  
  // Generate insight message
  const skillsPhrase = topSkills.length > 1 
    ? `${topSkills.slice(0, -1).join(', ')} and ${topSkills[topSkills.length-1]}` 
    : topSkills[0];
    
  return `Your matches show strong emphasis on ${skillsPhrase}. These are valuable skills that could lead to potential collaborations or partnerships.`;
}

/**
 * Generates insights based on interests analysis
 */
function generateInterestsInsight(matches: any[], interests: string[]): string {
  const interestCount = new Map<string, number>();
  
  interests.forEach(interest => {
    interestCount.set(interest, (interestCount.get(interest) || 0) + 1);
  });
  
  // Get top interests
  const topInterests = Array.from(interestCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  
  if (topInterests.length === 0) {
    return "No common interests identified among your matches.";
  }
  
  // Generate insight message
  const interestsPhrase = topInterests.length > 1 
    ? `${topInterests.slice(0, -1).join(', ')} and ${topInterests[topInterests.length-1]}` 
    : topInterests[0];
    
  return `Conversations about ${interestsPhrase} are likely to resonate with your matches. These shared interests provide excellent starting points for meaningful connections.`;
}

/**
 * Generates insights based on match scores
 */
function generateScoreInsight(matches: any[]): string {
  if (!matches || matches.length === 0) {
    return "No match score data available.";
  }
  
  // Calculate average score
  const scores = matches.map(m => m.matchScore?.overallMatch || 0);
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Count high-quality matches
  const highQualityMatches = matches.filter(m => m.matchScore?.overallMatch >= 80).length;
  const highQualityPercentage = Math.round((highQualityMatches / matches.length) * 100);
  
  if (avgScore >= 75) {
    return `You have excellent match quality with ${highQualityPercentage}% of your matches scoring 80% or higher. Your profile is attracting highly compatible connections.`;
  } else if (avgScore >= 60) {
    return `You have good match quality overall with an average score of ${Math.round(avgScore)}%. ${highQualityPercentage}% of your matches score 80% or higher.`;
  } else {
    return `Your average match score is ${Math.round(avgScore)}%. Consider updating your profile to attract more relevant matches.`;
  }
}

/**
 * Identifies potential skill gaps
 */
function identifySkillGaps(skills: string[]): string | null {
  // Count skill frequencies
  const skillCount = new Map<string, number>();
  skills.forEach(skill => {
    skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
  });
  
  // Common complementary skills pairs in business contexts
  const complementarySkills: Record<string, string[]> = {
    "Programming": ["Project Management", "UX Design", "Business Analysis"],
    "Marketing": ["Data Analysis", "Copywriting", "Design"],
    "Sales": ["Marketing", "Customer Success", "Relationship Management"],
    "Finance": ["Business Strategy", "Operations", "Analytics"],
    "Design": ["Development", "Marketing", "Product Management"],
    "Project Management": ["Technical Skills", "Leadership", "Communication"],
  };
  
  // Find the most common skill
  let mostCommonSkill = "";
  let highestCount = 0;
  
  skillCount.forEach((count, skill) => {
    if (count > highestCount) {
      mostCommonSkill = skill;
      highestCount = count;
    }
  });
  
  // Check for gap in complementary skills
  if (mostCommonSkill && complementarySkills[mostCommonSkill]) {
    const complementary = complementarySkills[mostCommonSkill];
    
    // Check if any complementary skills are missing
    const missingSkills = complementary.filter(skill => 
      !Array.from(skillCount.keys()).some(s => 
        s.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    if (missingSkills.length > 0) {
      return `Your matches are strong in ${mostCommonSkill}, but might benefit from ${missingSkills.join(' or ')} skills to create more balanced teams.`;
    }
  }
  
  return null;
}

/**
 * Generates interest-based recommendations
 */
function generateInterestRecommendation(interests: string[]): string | null {
  if (interests.length === 0) return null;
  
  // Count interest frequencies
  const interestCount = new Map<string, number>();
  interests.forEach(interest => {
    interestCount.set(interest, (interestCount.get(interest) || 0) + 1);
  });
  
  // Get top interests
  const topInterests = Array.from(interestCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0]);
    
  if (topInterests.length === 0) return null;
  
  // Generate recommendation
  if (topInterests.length === 2) {
    return `Try organizing a networking event around ${topInterests[0]} or ${topInterests[1]} to engage with your matches.`;
  } else {
    return `Consider highlighting your knowledge of ${topInterests[0]} when connecting with your matches.`;
  }
}

/**
 * Generates advice based on match quality
 */
function generateMatchQualityTip(matches: any[]): string | null {
  if (!matches || matches.length === 0) return null;
  
  // Calculate score statistics
  const scores = matches.map(m => m.matchScore?.overallMatch || 0);
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  if (avgScore >= 85) {
    return "You have exceptional match quality. Focus on deepening connections with your top matches.";
  } else if (avgScore >= 75) {
    return "Your matches are strong. Consider reaching out to your highest-scoring connections first.";
  } else if (avgScore >= 65) {
    return "Your matches show good potential. Try updating your profile skills to improve match quality.";
  } else {
    return "Consider refining your profile to attract higher-quality matches aligned with your goals.";
  }
}

/**
 * Generates personalized reasons for specific matches
 */
function generateMatchReasons(matches: any[]): Record<string, string> {
  const reasons: Record<string, string> = {};
  
  matches.forEach(match => {
    if (!match.id) return;
    
    const skillMatches = match.matchScore?.skillsMatch || 0;
    const interestMatches = match.matchScore?.interestsMatch || 0;
    const overallMatch = match.matchScore?.overallMatch || 0;
    
    let reason = "";
    
    // Generate a personalized reason based on the match metrics
    if (skillMatches > 80 && interestMatches > 80) {
      // Both skills and interests are high
      reason = `You and ${match.name} have an exceptional match in both professional skills and personal interests. This suggests potential for both productive collaboration and enjoyable personal connection.`;
    } else if (skillMatches > 80) {
      // Skills are high but interests are lower
      reason = `You and ${match.name} have highly compatible professional skills. You could form an effective working partnership based on complementary abilities.`;
    } else if (interestMatches > 80) {
      // Interests are high but skills are lower
      reason = `You and ${match.name} share many personal interests, which could form the foundation of a good relationship outside of purely professional collaboration.`;
    } else if (overallMatch > 75) {
      // Overall good match
      reason = `You and ${match.name} have a strong overall match despite not specializing in any one area. This well-rounded compatibility suggests versatile partnership potential.`;
    } else {
      // Generic reason
      const skillsList = match.skills?.slice(0, 2).join(' and ') || 'various skills';
      const interestsList = match.interests?.slice(0, 2).join(' and ') || 'shared interests';
      reason = `Your match with ${match.name} is based on ${skillsList} and ${interestsList}. While not the strongest match, there may still be valuable connection opportunities.`;
    }
    
    reasons[match.id] = reason;
  });
  
  return reasons;
}
