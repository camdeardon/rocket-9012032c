
import React from "react";
import { Card } from "@/components/ui/card";
import ProfileHeader from "./ProfileHeader";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderWrapperProps {
  profileData: any;
  editMode: string | null;
  editedValues: any;
  setEditMode: (mode: string | null) => void;
  setEditedValues: (values: any) => void;
  handleSave: (section: string) => void;
  handleResumeDownload: (resume_url: string | null) => Promise<void>;
}

const ProfileHeaderWrapper = ({
  profileData,
  editMode,
  editedValues,
  setEditMode,
  setEditedValues,
  handleSave,
  handleResumeDownload,
}: ProfileHeaderWrapperProps) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <ProfileHeader
          profileData={profileData}
          editMode={editMode}
          editedValues={editedValues}
          setEditMode={setEditMode}
          setEditedValues={setEditedValues}
          handleSave={handleSave}
          handleLogout={() => {}}
          handleResumeDownload={handleResumeDownload}
        />
        <ProfileActions handleResumeDownload={() => handleResumeDownload(profileData?.resume_url)} />
      </div>
    </Card>
  );
};

export default ProfileHeaderWrapper;
