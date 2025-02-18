
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    skills: "",
    background: "",
    interests: "",
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
    
    // For array fields, split by commas and preserve spaces within items
    if (['preferred_communication', 'business_focus', 'investment_preferences', 'core_values'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean),
      });
    } else {
      // For regular text fields, preserve spaces
      setFormData({
        ...formData,
        [name]: value,
      });
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

      // For array fields, ensure we have arrays even if they're empty
      const skillsArray = formData.skills 
        ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];

      const interestsArray = formData.interests
        ? formData.interests.split(',').map(interest => interest.trim()).filter(Boolean)
        : [];

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.about,
          background: formData.background,
          location: location,
          skills: skillsArray,
          interests: interestsArray,
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
