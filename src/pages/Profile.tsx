import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBackground from "@/components/profile/ProfileBackground";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileInterests from "@/components/profile/ProfileInterests";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  location: string | null;
  avatar_url: string | null;
  bio: string | null;
  background: string | null;
  resume_url: string | null;
  onboarding_completed: boolean | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
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

        if (!profile.onboarding_completed) {
          navigate('/complete-profile');
          return;
        }

        const { data: skills, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            id,
            proficiency_level,
            years_experience,
            skill:skills (
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
        });
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

  const handleSave = async (section: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: any = {};
      switch (section) {
        case 'header':
          updates.first_name = editedValues.first_name;
          updates.last_name = editedValues.last_name;
          updates.title = editedValues.title;
          updates.location = editedValues.location;
          updates.bio = editedValues.bio;
          break;
        case 'background':
          updates.background = editedValues.background;
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => prev ? { ...prev, ...updates } : null);
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResumeDownload = async () => {
    if (!profileData?.resume_url) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(profileData.resume_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = profileData.resume_url.split('/').pop() || 'resume';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <ProfileHeader
            profileData={profileData}
            editMode={editMode}
            editedValues={editedValues}
            setEditMode={setEditMode}
            setEditedValues={setEditedValues}
            handleSave={handleSave}
            handleLogout={handleLogout}
            handleResumeDownload={handleResumeDownload}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileBackground
                profileData={profileData}
                editMode={editMode}
                editedValues={editedValues}
                setEditMode={setEditMode}
                setEditedValues={setEditedValues}
                handleSave={handleSave}
              />
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileSkills userSkills={userSkills} />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileInterests userInterests={userInterests} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
