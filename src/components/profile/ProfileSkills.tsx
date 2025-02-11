
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string; // Updated from number to string
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

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const ProfileSkills = ({ userSkills }: ProfileSkillsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // First, check if the skill already exists
      let { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .eq('name', newSkill.trim())
        .single();

      let skillId;
      
      if (!existingSkill) {
        // Create new skill if it doesn't exist
        const { data: newSkillData, error: skillError } = await supabase
          .from('skills')
          .insert([{ name: newSkill.trim() }])
          .select('id')
          .single();

        if (skillError) throw skillError;
        skillId = newSkillData.id;
      } else {
        skillId = existingSkill.id;
      }

      // Add user_skill association
      const { error: userSkillError } = await supabase
        .from('user_skills')
        .insert([{
          user_id: user.id,
          skill_id: skillId,
          proficiency_level: proficiencyLevel || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        }]);

      if (userSkillError) throw userSkillError;

      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      
      setIsOpen(false);
      setNewSkill("");
      setProficiencyLevel("");
      setYearsExperience("");
      
      // Refresh the page to show new skill
      window.location.reload();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => { // Updated from number to string
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill removed successfully",
      });
      
      // Refresh the page to show updated skills
      window.location.reload();
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
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
              onClick={handleAddSkill}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Adding..." : "Add Skill"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2">
        {userSkills.map((userSkill) => (
          <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2">
            {userSkill.skill.name}
            {userSkill.proficiency_level && ` (${userSkill.proficiency_level})`}
            <button 
              className="hover:text-destructive"
              onClick={() => handleRemoveSkill(userSkill.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;
