
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillsList } from "./SkillsList";
import { AddSkillDialog } from "./AddSkillDialog";
import { useSkillsManagement } from "@/hooks/useSkillsManagement";

interface ProfileSkillsProps {
  userSkills: any[];
}

const ProfileSkills = ({ userSkills }: ProfileSkillsProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const {
    skills,
    availableSkills,
    isLoading,
    handleAddSkill,
    handleRemoveSkill
  } = useSkillsManagement({ initialSkills: userSkills });

  // Create a wrapper function to adapt the return type
  const handleAddSkillWrapper = async (
    skillId: string, 
    proficiencyLevel: string, 
    yearsExperience: number
  ): Promise<void> => {
    await handleAddSkill(skillId, proficiencyLevel, yearsExperience);
    // We discard the boolean return value to match the expected Promise<void> type
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button 
          variant="ghost" 
          className="text-primary flex items-center gap-1"
          onClick={() => setShowAddDialog(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add Skill
        </Button>
      </div>
      
      <SkillsList skills={skills} onRemove={handleRemoveSkill} />
      
      <AddSkillDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddSkill={handleAddSkillWrapper}
        availableSkills={availableSkills}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfileSkills;
