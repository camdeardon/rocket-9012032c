
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface UserSkill {
  id: string;
  skill: {
    name: string;
    category: string;
  };
  proficiency_level: string;
  years_experience: number;
}

interface ProfileSkillsProps {
  skills: UserSkill[];
  onRemoveSkill?: (skillId: string) => void;
}

export const ProfileSkills = ({ skills, onRemoveSkill }: ProfileSkillsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((userSkill) => (
          <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2">
            {userSkill.skill.name}
            <button 
              className="hover:text-destructive"
              onClick={() => onRemoveSkill?.(userSkill.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
