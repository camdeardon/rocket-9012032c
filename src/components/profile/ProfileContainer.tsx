
import React, { useState, useEffect } from "react";
import ProfileHeaderWrapper from "./ProfileHeaderWrapper";
import ProfileMainContent from "./ProfileMainContent";
import ProfileSidebar from "./ProfileSidebar";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileActions } from "@/hooks/useProfileActions";
import { ProfileSkeleton } from "@/components/ui/skeleton-loader";
import { useToast } from "@/hooks/use-toast";

const ProfileContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  } = useProfileData();

  const { handleResumeDownload } = useProfileActions();

  // Add a short artificial delay for smoother transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Welcome message when profile loads
      if (profileData?.name) {
        toast({
          title: `Welcome back, ${profileData.name.split(' ')[0]}!`,
          description: "Your profile is ready to be viewed and edited.",
        });
      }
    }, 600);
    
    return () => clearTimeout(timer);
  }, [profileData, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="animate-slide-in-top">
          <ProfileHeaderWrapper
            profileData={profileData}
            editMode={editMode}
            editedValues={editedValues}
            setEditMode={setEditMode}
            setEditedValues={setEditedValues}
            handleSave={handleSave}
            handleResumeDownload={handleResumeDownload}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
            <ProfileMainContent
              editMode={editMode}
              editedValues={editedValues}
              setEditedValues={setEditedValues}
              handleSave={handleSave}
              handleFileChange={handleFileChange}
            />
          </div>

          <div className="animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
            <ProfileSidebar
              userSkills={userSkills}
              userInterests={userInterests}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
