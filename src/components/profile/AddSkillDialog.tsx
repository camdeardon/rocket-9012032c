
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface AddSkillDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  proficiencyLevel: string;
  setProficiencyLevel: (level: string) => void;
  yearsExperience: string;
  setYearsExperience: (years: string) => void;
  isLoading: boolean;
  onAdd: () => void;
}

export const AddSkillDialog = ({
  isOpen,
  setIsOpen,
  newSkill,
  setNewSkill,
  proficiencyLevel,
  setProficiencyLevel,
  yearsExperience,
  setYearsExperience,
  isLoading,
  onAdd,
}: AddSkillDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Skill Name</Label>
            <Input
              id="skill"
              placeholder="Enter skill name"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
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
              placeholder="Years of experience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={onAdd}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Adding..." : "Add Skill"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
