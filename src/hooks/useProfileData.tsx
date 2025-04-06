
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

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
        
        if (profile) {
          setEditedValues({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            title: profile.title || "",
            location: profile.location || "",
            bio: profile.bio || "",
            background: profile.background || "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            dateOfBirth: "",
            skills: profile.skills || [],
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
          });
        }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: filePath })
        .eq('id', profileData.id);

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, resume_url: filePath }));

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    }
  };

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
    profileData,
    userSkills,
    userInterests,
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave,
    handleFileChange,
    setProfileData,
  };
};
