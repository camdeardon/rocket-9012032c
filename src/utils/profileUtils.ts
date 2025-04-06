
/**
 * Checks if user has completed their required profile sections
 * @param profileData The user's profile data object
 * @returns Boolean indicating if profile has minimum required data
 */
export const isProfileComplete = (profileData: any): boolean => {
  if (!profileData) return false;
  
  // Check for required fields
  const requiredFields = [
    'first_name', 
    'last_name', 
    'bio',
    'skills',
    'interests'
  ];
  
  for (const field of requiredFields) {
    // Check if the field exists and is not empty
    if (!profileData[field]) return false;
    
    // For array fields, check if they have content
    if (Array.isArray(profileData[field]) && profileData[field].length === 0) {
      return false;
    }
    
    // For string fields, check if they're not just whitespace
    if (typeof profileData[field] === 'string' && !profileData[field].trim()) {
      return false;
    }
  }
  
  return true;
};
