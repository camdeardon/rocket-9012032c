
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileEdit = (profileData: any, setProfileData: (data: any) => void) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const { toast } = useToast();

  const handleSave = async (section: string) => {
    try {
      if (!profileData?.id) {
        throw new Error("Profile ID not found");
      }

      // Apply edits specific to the section
      const updates: any = {};
      
      switch (section) {
        case 'header':
          updates.first_name = editedValues.first_name || profileData.first_name;
          updates.last_name = editedValues.last_name || profileData.last_name;
          updates.title = editedValues.title || profileData.title;
          break;
        case 'about':
          updates.bio = editedValues.bio || profileData.bio;
          break;
        case 'location':
          updates.location = editedValues.location || profileData.location;
          break;
        case 'background':
          updates.background = editedValues.background || profileData.background;
          break;
        case 'business':
          updates.business_focus = editedValues.business_focus || profileData.business_focus;
          updates.core_values = editedValues.core_values || profileData.core_values;
          updates.entrepreneurial_experience = editedValues.entrepreneurial_experience || profileData.entrepreneurial_experience;
          updates.investment_preferences = editedValues.investment_preferences || profileData.investment_preferences;
          break;
        case 'work-preferences':
          updates.preferred_work_timezone = editedValues.preferred_work_timezone || profileData.preferred_work_timezone;
          updates.work_style = editedValues.work_style || profileData.work_style;
          updates.preferred_communication = editedValues.preferred_communication || profileData.preferred_communication;
          updates.preferred_team_size = editedValues.preferred_team_size || profileData.preferred_team_size;
          updates.personality_traits = editedValues.personality_traits || profileData.personality_traits;
          updates.collaboration_style = editedValues.collaboration_style || profileData.collaboration_style;
          updates.remote_preference = editedValues.remote_preference || profileData.remote_preference;
          updates.availability_hours = editedValues.availability_hours || profileData.availability_hours;
          break;
        default:
          throw new Error(`Unknown section: ${section}`);
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileData.id);

      if (error) throw error;

      // Update local state
      setProfileData({ ...profileData, ...updates });
      setEditMode(null);
      setEditedValues({});

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
    handleSave,
  };
};
