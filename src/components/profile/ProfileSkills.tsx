
import { useSkillManagement } from "@/hooks/useSkillManagement";
import { AddSkillDialog } from "./AddSkillDialog";
import { SkillsList } from "./SkillsList";

interface Skill {
  id: string;
  skill: {
    name: string;
    category: string;
  };
  proficiency_level?: string;
  years_experience?: number;
}

interface ProfileSkillsProps {
  userSkills: Skill[];
}

const ProfileSkills = ({ userSkills }: ProfileSkillsProps) => {
  const {
    isOpen,
    setIsOpen,
    newSkill,
    setNewSkill,
    proficiencyLevel,
    setProficiencyLevel,
    yearsExperience,
    setYearsExperience,
    isLoading,
    handleAddSkill,
    handleRemoveSkill,
  } = useSkillManagement({
    onSuccess: () => window.location.reload(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <AddSkillDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          proficiencyLevel={proficiencyLevel}
          setProficiencyLevel={setProficiencyLevel}
          yearsExperience={yearsExperience}
          setYearsExperience={setYearsExperience}
          isLoading={isLoading}
          onAdd={handleAddSkill}
        />
      </div>
      <SkillsList 
        skills={userSkills}
        onRemove={handleRemoveSkill}
      />
    </div>
  );
};

export default ProfileSkills;
