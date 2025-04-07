
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skillId: string, proficiencyLevel: string, yearsExperience: number) => Promise<boolean | void>;
  availableSkills: any[];
  isLoading: boolean;
}

export const AddSkillDialog = ({
  open,
  onOpenChange,
  onAddSkill,
  availableSkills,
  isLoading,
}: AddSkillDialogProps) => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("Beginner");
  const [yearsExperience, setYearsExperience] = useState("1");
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedSkill("");
      setProficiencyLevel("Beginner");
      setYearsExperience("1");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedSkill) return;
    
    const years = parseInt(yearsExperience) || 0;
    await onAddSkill(selectedSkill, proficiencyLevel, years);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Select Skill</Label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name} {skill.category ? `(${skill.category})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              min="0"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedSkill}
          className="w-full"
        >
          {isLoading ? "Adding..." : "Add Skill"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
