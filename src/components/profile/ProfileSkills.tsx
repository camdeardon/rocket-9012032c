
import { useState } from "react";
import { useSkillManagement } from "@/hooks/useSkillManagement";
import { AddSkillDialog } from "./AddSkillDialog";
import { SkillsList } from "./SkillsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // If user types a comma, add the skill
    if (e.target.value.includes(",")) {
      const skills = e.target.value.split(",");
      const lastSkill = skills.pop() || "";
      
      // Add all complete skills except the last one (which might be incomplete)
      skills.forEach(skill => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !tempSkills.includes(trimmedSkill)) {
          setTempSkills(prev => [...prev, trimmedSkill]);
        }
      });
      
      // Set the input to the last part after the comma
      setInputValue(lastSkill);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add skill on Enter key
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedSkill = inputValue.trim();
      if (!tempSkills.includes(trimmedSkill)) {
        setTempSkills(prev => [...prev, trimmedSkill]);
        setInputValue("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setTempSkills(tempSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddTempSkills = async () => {
    // Add any remaining skill in the input
    const finalSkills = [...tempSkills];
    if (inputValue.trim() && !finalSkills.includes(inputValue.trim())) {
      finalSkills.push(inputValue.trim());
    }

    if (finalSkills.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one skill",
        variant: "destructive",
      });
      return;
    }

    // Add each skill one by one
    setIsLoading(true);
    try {
      for (const skill of finalSkills) {
        setNewSkill(skill);
        await handleAddSkill();
      }
      
      // Clear temporary skills and input
      setTempSkills([]);
      setInputValue("");
      toast({
        title: "Success",
        description: `Added ${finalSkills.length} skill(s)`,
      });
    } catch (error) {
      console.error("Error adding skills:", error);
      toast({
        title: "Error",
        description: "Failed to add all skills",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter skills separated by commas"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAddTempSkills} disabled={isLoading && tempSkills.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Type skill names and press Enter or comma (,) to add multiple skills
          </p>
        </div>
        
        {tempSkills.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Skills to add:</p>
            <div className="flex flex-wrap gap-2">
              {tempSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  {skill}
                  <button 
                    className="hover:text-destructive"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">Your skills:</p>
        <SkillsList 
          skills={userSkills}
          onRemove={handleRemoveSkill}
        />
      </div>
    </div>
  );
};

export default ProfileSkills;
