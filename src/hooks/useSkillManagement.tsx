
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseSkillManagementProps {
  onSuccess?: () => void;
}

export const useSkillManagement = ({ onSuccess }: UseSkillManagementProps = {}) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .eq('name', newSkill.trim())
        .single();

      let skillId;
      
      if (!existingSkill) {
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
      
      onSuccess?.();
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

  const handleRemoveSkill = async (skillId: string) => {
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
      
      onSuccess?.();
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
