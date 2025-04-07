
import { Card } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useEffect, useState } from "react";
import { ProfileSkeleton } from "@/components/ui/skeleton-loader";
import { useToast } from "@/hooks/use-toast";

const CompleteProfile = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();
  
  const { 
    profileData, 
    userSkills,
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

  useEffect(() => {
    // Simulate a short loading time for smoother transitions
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Notify users when they arrive on the page
  useEffect(() => {
    if (!isPageLoading) {
      toast({
        title: "Let's complete your profile",
        description: "This information will help us match you with compatible partners.",
      });
    }
  }, [isPageLoading, toast]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-background py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="animate-slide-in-top">
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
          </div>
          <Card className="p-8 space-y-8 bg-white/95 backdrop-blur-sm shadow-lg card-shadow animate-fade-in">
            <ProfileForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              editMode={false}
              userSkills={userSkills}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
