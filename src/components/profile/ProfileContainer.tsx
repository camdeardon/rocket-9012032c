
import { Card } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBackground from "@/components/profile/ProfileBackground";
import ProfileSkills from "@/components/profile/ProfileSkills";
import ProfileInterests from "@/components/profile/ProfileInterests";
import { useProfileData } from "@/hooks/useProfileData";

const ProfileContainer = () => {
  const {
    profileData,
    userSkills,
    userInterests,
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave,
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

export default ProfileContainer;
