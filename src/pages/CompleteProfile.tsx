
import { Card } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useProfileForm } from "@/hooks/useProfileForm";

const CompleteProfile = () => {
  const { 
    profileData, 
    editMode, 
    editedValues, 
    setEditMode, 
    setEditedValues, 
    handleSave 
  } = useProfileData();

  const { handleLogout, handleResumeDownload } = useProfileActions();
  const { 
    formData, 
    isLoading, 
    handleFileChange, 
    handleChange, 
    handleSubmit 
  } = useProfileForm();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-secondary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
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
          <Card className="p-8 space-y-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <ProfileForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
