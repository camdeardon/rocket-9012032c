
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface Skill {
  id: number;
  skill: {
    name: string;
    category: string;
  };
}

interface ProfileSkillsProps {
  userSkills: Skill[];
}

const ProfileSkills = ({ userSkills }: ProfileSkillsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {userSkills.map((userSkill) => (
          <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2">
            {userSkill.skill.name}
            <button className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;
