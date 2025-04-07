
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates and stores ML-based match recommendations for a user
 * @param userId The ID of the user to generate recommendations for
 * @returns Object with success status and message
 */
export const generateMLRecommendations = async (userId: string): Promise<{success: boolean, message: string}> => {
  try {
    console.log("Generating ML recommendations for user:", userId);
    
    // First, calculate collaborative filtering recommendations
    // This is a simplified version - in a real system this would be more sophisticated
    const { data: userSkills, error: skillsError } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);
      
    if (skillsError) throw skillsError;
    
    const skillIds = userSkills?.map(item => item.skill_id) || [];
    
    // Find users with similar skills
    const { data: similarUsers, error: similarUsersError } = await supabase
      .from('user_skills')
      .select('user_id, count(*)', { count: 'exact' })
      .in('skill_id', skillIds)
      .neq('user_id', userId)
      .order('count', { ascending: false })
      .limit(20);
      
    if (similarUsersError) throw similarUsersError;
    
    // Calculate content-based similarity scores
    // In a real ML system, this would involve more complex calculations
    // using embeddings, clustering, etc.
    const recommendations = await Promise.all(
      (similarUsers || []).map(async (similarUser: any) => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', similarUser.user_id)
          .single();
          
        if (profileError) {
          console.error(`Error fetching profile ${similarUser.user_id}:`, profileError);
          return null;
        }
        
        // Calculate a recommendation score based on multiple factors
        // This is simplified - a real ML system would use a trained model
        const skillsWeight = 0.4;
        const interestsWeight = 0.3; 
        const collaborationWeight = 0.2;
        const locationWeight = 0.1;
        
        const skillsScore = similarUser.count * 10; // Base on common skills
        
        // Get user interests for similarity calculation
        const { data: userInterests, error: interestsError } = await supabase
          .from('user_interests')
          .select('interest_id')
          .eq('user_id', userId);
          
        if (interestsError) {
          console.error('Error fetching interests:', interestsError);
          return null;
        }
        
        const interestIds = userInterests?.map(item => item.interest_id) || [];
        
        // Calculate interest overlap
        const { count: interestCount, error: commonInterestsError } = await supabase
          .from('user_interests')
          .select('*', { count: 'exact', head: false })
          .in('interest_id', interestIds)
          .eq('user_id', similarUser.user_id);
        
        if (commonInterestsError) {
          console.error('Error counting common interests:', commonInterestsError);
          return null;
        }
        
        const interestsScore = interestCount || 0;
        
        // Simplified collaboration score based on work style
        // In reality, this would be based on more factors
        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .select('work_style, personality_traits, location')
          .eq('id', userId)
          .single();
          
        if (userProfileError) {
          console.error('Error fetching user profile:', userProfileError);
          return null;
        }
        
        // Simple collaboration compatibility based on work style
        const collaborationScore = 
          userProfile.work_style === profile.work_style ? 100 : 
          userProfile.work_style && profile.work_style ? 50 : 30;
        
        // Location score (100 if same location, 50 if not)
        const locationScore = 
          (userProfile.location && profile.location && 
          userProfile.location.toLowerCase() === profile.location.toLowerCase()) ? 100 : 50;
          
        // Calculate weighted score (0-100 scale)
        const weightedScore = Math.min(100, Math.max(0, Math.round(
          (skillsScore * skillsWeight) +
          (interestsScore * 20 * interestsWeight) +
          (collaborationScore * collaborationWeight) +
          (locationScore * locationWeight)
        )));
        
        // Store features for explainability
        const features = {
          skills_count: similarUser.count,
          interests_count: interestCount || 0,
          work_style_match: userProfile.work_style === profile.work_style,
          location_match: locationScore,
          skills_score: skillsScore,
          interests_score: interestsScore * 20,
          collaboration_score: collaborationScore,
          location_score: locationScore
        };
        
        return {
          user_id: userId,
          matched_user_id: similarUser.user_id,
          recommendation_score: weightedScore,
          features,
          recommendation_type: 'hybrid'
        };
      })
    );
    
    // Filter out null values and store recommendations
    const validRecommendations = recommendations.filter(Boolean);
    
    if (validRecommendations.length > 0) {
      // Use table insert instead of type-checking issues
      for (const rec of validRecommendations) {
        const { error: insertError } = await supabase
          .from('ml_match_recommendations')
          .upsert([rec], { 
            onConflict: 'user_id,matched_user_id,recommendation_type' 
          });
          
        if (insertError) {
          console.error('Error storing recommendation:', insertError);
        }
      }
      
      return { 
        success: true, 
        message: `Generated ${validRecommendations.length} ML-based recommendations` 
      };
    } else {
      return { success: false, message: 'No valid recommendations could be generated' };
    }
    
  } catch (error: any) {
    console.error('Error in ML recommendation generation:', error);
    return { 
      success: false, 
      message: `ML recommendation error: ${error.message || 'Unknown error'}` 
    };
  }
};
