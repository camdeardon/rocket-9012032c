
import React from "react";
import { Card } from "@/components/ui/card";
import ProfileSkills from "./ProfileSkills";
import ProfileInterests from "./ProfileInterests";

interface ProfileSidebarProps {
  userSkills: any[];
  userInterests: any[];
}

const ProfileSidebar = ({ userSkills, userInterests }: ProfileSidebarProps) => {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <ProfileSkills userSkills={userSkills} />
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <ProfileInterests userInterests={userInterests} />
      </Card>
    </div>
  );
};

export default ProfileSidebar;
