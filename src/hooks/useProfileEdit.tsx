
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileEdit = (profileData: any, setProfileData: (data: any) => void) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    first_name: "",
    last_name: "",
    title: "",
    location: "",
    bio: "",
    background: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
    skills: [] as string[],
    interests: [] as string[],
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

  // Initialize editedValues whenever profileData changes
  useState(() => {
    if (profileData) {
      setEditedValues({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        title: profileData.title || "",
        location: profileData.location || "",
        bio: profileData.bio || "",
        background: profileData.background || "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        dateOfBirth: "",
        skills: profileData.skills || [],
        interests: profileData.interests || [],
        preferred_work_timezone: profileData.preferred_work_timezone || "",
        work_style: profileData.work_style || "",
        preferred_communication: profileData.preferred_communication || [],
        preferred_team_size: profileData.preferred_team_size || "",
        availability_hours: profileData.availability_hours || 0,
        remote_preference: profileData.remote_preference || "",
        business_focus: profileData.business_focus || [],
        investment_preferences: profileData.investment_preferences || [],
        entrepreneurial_experience: profileData.entrepreneurial_experience || "",
        core_values: profileData.core_values || [],
      });
    }
  }, [profileData]);

  const handleSave = async (section: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Debug to see what's being saved
      console.log('Saving profile with values for section:', section, editedValues);

      // Prepare the data for update based on the section being edited
      let updateData: any = {};

      if (section === 'header') {
        // For header section, update personal info
        updateData = {
          first_name: editedValues.first_name,
          last_name: editedValues.last_name,
          title: editedValues.title,
          location: editedValues.location,
          bio: editedValues.bio
        };
      } else if (section === 'about') {
        updateData = {
          bio: editedValues.bio,
          skills: editedValues.skills
        };
      } else if (section === 'location') {
        // Combine location fields into a formatted string
        const locationParts = [
          editedValues.city,
          editedValues.state,
          editedValues.country
        ].filter(Boolean);
        
        updateData = {
          location: locationParts.join(', ')
        };
      } else if (section === 'background') {
        updateData = {
          background: editedValues.background,
          interests: editedValues.interests
        };
      } else if (section === 'workPreferences') {
        updateData = {
          preferred_work_timezone: editedValues.preferred_work_timezone,
          work_style: editedValues.work_style,
          preferred_communication: editedValues.preferred_communication,
          preferred_team_size: editedValues.preferred_team_size,
          availability_hours: editedValues.availability_hours,
          remote_preference: editedValues.remote_preference
        };
      } else if (section === 'businessDetails') {
        updateData = {
          business_focus: editedValues.business_focus,
          investment_preferences: editedValues.investment_preferences,
          entrepreneurial_experience: editedValues.entrepreneurial_experience,
          core_values: editedValues.core_values
        };
      } else {
        // For a full profile update or unknown section
        updateData = {
          first_name: editedValues.first_name,
          last_name: editedValues.last_name,
          title: editedValues.title,
          location: editedValues.location,
          bio: editedValues.bio,
          background: editedValues.background,
          skills: editedValues.skills,
          interests: editedValues.interests,
          preferred_work_timezone: editedValues.preferred_work_timezone,
          work_style: editedValues.work_style,
          preferred_communication: editedValues.preferred_communication,
          preferred_team_size: editedValues.preferred_team_size,
          availability_hours: editedValues.availability_hours,
          remote_preference: editedValues.remote_preference,
          business_focus: editedValues.business_focus,
          investment_preferences: editedValues.investment_preferences,
          entrepreneurial_experience: editedValues.entrepreneurial_experience,
          core_values: editedValues.core_values,
        };
      }

      console.log('Updating profile with data:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update successful, response:', data);

      // Update the local profile data to reflect changes
      setProfileData(prev => ({ ...prev, ...updateData }));
      setEditMode(null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return {
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave
  };
};
