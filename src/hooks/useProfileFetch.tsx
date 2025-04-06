
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileFetch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [userInterests, setUserInterests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching profile for user:", user.id);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          if (profileError.code === 'PGRST116') {
            console.log("No profile found for user");
          }
          throw profileError;
        }

        console.log("Received profile:", profile);

        const { data: skills, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            id,
            proficiency_level,
            years_experience,
            skill:skills (
              id,
              name,
              category
            )
          `)
          .eq('user_id', user.id);

        if (skillsError) {
          console.error('Skills error:', skillsError);
          throw skillsError;
        }

        console.log("Received skills:", skills);

        const { data: interests, error: interestsError } = await supabase
          .from('user_interests')
          .select(`
            id,
            interest:interests (
              id,
              name,
              category
            )
          `)
          .eq('user_id', user.id);

        if (interestsError) {
          console.error('Interests error:', interestsError);
          throw interestsError;
        }

        console.log("Received interests:", interests);

        setProfileData(profile);
        setUserSkills(skills || []);
        setUserInterests(interests || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, toast]);

  return {
    profileData,
    setProfileData,
    userSkills,
    userInterests,
    isLoading
  };
};
