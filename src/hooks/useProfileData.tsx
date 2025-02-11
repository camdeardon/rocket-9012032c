
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    first_name: "",
    last_name: "",
    title: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfileData(profile);
        setEditedValues({
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          title: profile?.title || "",
          location: profile?.location || "",
          bio: profile?.bio || "",
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, [navigate]);

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
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave,
    setProfileData,
  };
};
