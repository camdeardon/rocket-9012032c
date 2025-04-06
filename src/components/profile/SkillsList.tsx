
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
  if (skills.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No skills added yet. Add skills above.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((userSkill) => (
        <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2 py-1 px-3">
          {userSkill.skill.name}
          {userSkill.proficiency_level && ` (${userSkill.proficiency_level})`}
          <button 
            className="hover:text-destructive ml-1"
            onClick={() => onRemove(userSkill.id)}
            aria-label={`Remove ${userSkill.skill.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
