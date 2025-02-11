
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [userInterests, setUserInterests] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    first_name: "",
    last_name: "",
    title: "",
    location: "",
    bio: "",
    background: "",
    preferred_work_timezone: "",
    work_style: "",
    preferred_communication: [] as string[],
    preferred_team_size: "",
    availability_hours: 0,
    remote_preference: "",
    business_focus: [] as string[],
    investment_preferences: [] as string[],
    entrepreneurial_experience: "",
    core_values: [] as string[],
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user skills with skill names
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

        if (skillsError) throw skillsError;

        // Fetch user interests with interest names
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

        if (interestsError) throw interestsError;

        setProfileData(profile);
        setUserSkills(skills || []);
        setUserInterests(interests || []);
        setEditedValues({
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          title: profile?.title || "",
          location: profile?.location || "",
          bio: profile?.bio || "",
          background: profile?.background || "",
          preferred_work_timezone: profile?.preferred_work_timezone || "",
          work_style: profile?.work_style || "",
          preferred_communication: profile?.preferred_communication || [],
          preferred_team_size: profile?.preferred_team_size || "",
          availability_hours: profile?.availability_hours || 0,
          remote_preference: profile?.remote_preference || "",
          business_focus: profile?.business_focus || [],
          investment_preferences: profile?.investment_preferences || [],
          entrepreneurial_experience: profile?.entrepreneurial_experience || "",
          core_values: profile?.core_values || [],
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    fetchProfileData();
  }, [navigate, toast]);

  const handleSave = async (section: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(editedValues)
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => ({ ...prev, ...editedValues }));
      setEditMode(null);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return {
    profileData,
    userSkills,
    userInterests,
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave,
    setProfileData,
  };
};
