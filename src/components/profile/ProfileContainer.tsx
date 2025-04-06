
import React from "react";
import ProfileHeaderWrapper from "./ProfileHeaderWrapper";
import ProfileMainContent from "./ProfileMainContent";
import ProfileSidebar from "./ProfileSidebar";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileActions } from "@/hooks/useProfileActions";

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
    handleFileChange,
  } = useProfileData();

  const { handleResumeDownload } = useProfileActions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <ProfileHeaderWrapper
          profileData={profileData}
          editMode={editMode}
          editedValues={editedValues}
          setEditMode={setEditMode}
          setEditedValues={setEditedValues}
          handleSave={handleSave}
          handleResumeDownload={handleResumeDownload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <ProfileMainContent
            editMode={editMode}
            editedValues={editedValues}
            setEditedValues={setEditedValues}
            handleSave={handleSave}
            handleFileChange={handleFileChange}
          />

          <ProfileSidebar
            userSkills={userSkills}
            userInterests={userInterests}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
