
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    background: "",
    skills: [] as string[], // Keep this for compatibility
    interests: [] as string[],
    resume: null as File | null,
    linkedinUrl: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
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

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData(prevData => ({
            ...prevData,
            about: profile.bio || "",
            background: profile.background || "",
            skills: profile.skills || [], // Keep this for compatibility
            interests: profile.interests || [],
            preferred_work_timezone: profile.preferred_work_timezone || "",
            work_style: profile.work_style || "",
            preferred_communication: profile.preferred_communication || [],
            preferred_team_size: profile.preferred_team_size || "",
            availability_hours: profile.availability_hours || 0,
            remote_preference: profile.remote_preference || "",
            business_focus: profile.business_focus || [],
            investment_preferences: profile.investment_preferences || [],
            entrepreneurial_experience: profile.entrepreneurial_experience || "",
            core_values: profile.core_values || [],
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (['preferred_communication', 'business_focus', 'investment_preferences', 'core_values', 'skills', 'interests'].includes(name)) {
      // Fix: Correctly split by commas while preserving spaces within items
      const items = value.split(/\s*,\s*/).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        [name]: items,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const location = [formData.city, formData.state, formData.country]
        .filter(Boolean)
        .join(", ");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.about,
          background: formData.background,
          location: location,
          interests: formData.interests,
          preferred_work_timezone: formData.preferred_work_timezone,
          work_style: formData.work_style,
          preferred_communication: formData.preferred_communication,
          preferred_team_size: formData.preferred_team_size,
          availability_hours: formData.availability_hours,
          remote_preference: formData.remote_preference,
          business_focus: formData.business_focus,
          investment_preferences: formData.investment_preferences,
          entrepreneurial_experience: formData.entrepreneurial_experience,
          core_values: formData.core_values,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleFileChange,
    handleChange,
    handleSubmit,
  };
};
