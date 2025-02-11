
import { Card } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBackground from "@/components/profile/ProfileBackground";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileInterests from "@/components/profile/ProfileInterests";
import ProfileWorkPreferences from "@/components/profile/ProfileWorkPreferences";
import ProfileBusinessDetails from "@/components/profile/ProfileBusinessDetails";
import AboutSection from "@/components/profile/AboutSection";
import LocationSection from "@/components/profile/LocationSection";
import BackgroundSection from "@/components/profile/BackgroundSection";
import ProfileEnhancement from "@/components/profile/ProfileEnhancement";
import { useProfileData } from "@/hooks/useProfileData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ProfileContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
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
  } = useProfileData();

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

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <AboutSection
                about={editedValues.bio || ""}
                skills={editedValues.skills?.join(", ") || ""}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  [e.target.name === "about" ? "bio" : e.target.name]: 
                  e.target.name === "skills" ? e.target.value.split(",").map(s => s.trim()) : e.target.value
                }))}
              />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <LocationSection
                formData={{
                  street: editedValues.street || "",
                  city: editedValues.city || "",
                  state: editedValues.state || "",
                  zipCode: editedValues.zipCode || "",
                  country: editedValues.country || "",
                }}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))}
              />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <BackgroundSection
                background={editedValues.background || ""}
                interests={editedValues.interests?.join(", ") || ""}
                dateOfBirth={editedValues.dateOfBirth || ""}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  [e.target.name]: e.target.name === "interests" 
                    ? e.target.value.split(",").map(i => i.trim()) 
                    : e.target.value
                }))}
              />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileWorkPreferences
                formData={{
                  preferred_work_timezone: editedValues.preferred_work_timezone,
                  work_style: editedValues.work_style,
                  preferred_communication: editedValues.preferred_communication,
                  preferred_team_size: editedValues.preferred_team_size,
                  availability_hours: editedValues.availability_hours,
                  remote_preference: editedValues.remote_preference,
                }}
                editMode={editMode}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value
                }))}
              />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileBusinessDetails
                formData={{
                  business_focus: editedValues.business_focus,
                  investment_preferences: editedValues.investment_preferences,
                  entrepreneurial_experience: editedValues.entrepreneurial_experience,
                  core_values: editedValues.core_values,
                }}
                editMode={editMode}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  [e.target.name]: e.target.name === "entrepreneurial_experience" 
                    ? e.target.value 
                    : e.target.value.split(",").map(v => v.trim())
                }))}
              />
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <ProfileEnhancement onFileChange={handleFileChange} />
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

export default ProfileContainer;
