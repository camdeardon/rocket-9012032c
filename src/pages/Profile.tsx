
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBackground } from "@/components/profile/ProfileBackground";
import { ProfileSkills } from "@/components/profile/ProfileSkills";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { useAuthentication } from "@/hooks/useAuthentication";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) return;

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user skills with skill details
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

        // Fetch user interests with interest details
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
  }, [user, toast]);

  const handleSaveProfile = async (updates: any) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => prev ? { ...prev, ...updates } : null);
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
          {profileData && (
            <ProfileHeader 
              profileData={profileData}
              onSave={handleSaveProfile}
            />
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileBackground
                background={profileData?.background || null}
                onSave={handleSaveProfile}
              />
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileSkills skills={userSkills} />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileInterests interests={userInterests} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
