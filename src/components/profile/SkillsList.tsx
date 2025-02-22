
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Skill {
  id: string;
  skill: {
    name: string;
    category: string;
  };
  proficiency_level?: string;
  years_experience?: number;
}

interface SkillsListProps {
  skills: Skill[];
  onRemove: (skillId: string) => void;
}

export const SkillsList = ({ skills, onRemove }: SkillsListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((userSkill) => (
        <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2">
          {userSkill.skill.name}
          {userSkill.proficiency_level && ` (${userSkill.proficiency_level})`}
          <button 
            className="hover:text-destructive"
            onClick={() => onRemove(userSkill.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
