
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseSkillsManagementProps {
  initialSkills?: any[];
}

export const useSkillsManagement = ({ initialSkills = [] }: UseSkillsManagementProps = {}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<any[]>(initialSkills);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  useEffect(() => {
    const fetchAvailableSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('id, name, category');

        if (error) throw error;
        setAvailableSkills(data || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchAvailableSkills();
  }, []);

  const handleAddSkill = async (
    skillId: string, 
    proficiencyLevel: string, 
    yearsExperience: number
  ) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to add skills");
      }

      // Check if the skill already exists for the user
      const { data: existingSkill, error: checkError } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingSkill) {
        toast({
          title: "Skill already added",
          description: "You already have this skill in your profile",
          variant: "destructive",
        });
        return;
      }

      // Add the skill
      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
          years_experience: yearsExperience
        })
        .select(`
          id,
          proficiency_level,
          years_experience,
          skill:skills (
            id,
            name,
            category
          )
        `)
        .single();

      if (error) throw error;

      setSkills(prevSkills => [...prevSkills, data]);
      
      // Update skills array in the profiles table
      const selectedSkill = availableSkills.find(s => s.id === skillId);
      if (selectedSkill) {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();
        
        if (profileErr) throw profileErr;
        
        const updatedSkills = [...(profileData.skills || []), selectedSkill.name];
        
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ skills: updatedSkills })
          .eq('id', user.id);
          
        if (updateErr) throw updateErr;
      }

      toast({
        title: "Skill added",
        description: "Skill successfully added to your profile",
      });

      return true;
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error adding skill",
        description: error.message || "An error occurred while adding the skill",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to remove skills");
      }

      // Get the skill before removal for profile update
      const skillToRemove = skills.find(s => s.id === skillId);

      // Remove the skill from user_skills table
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      // Update the local state
      const updatedSkills = skills.filter(s => s.id !== skillId);
      setSkills(updatedSkills);
      
      // Update skills array in the profiles table
      if (skillToRemove) {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();
        
        if (profileErr) throw profileErr;
        
        const updatedProfileSkills = (profileData.skills || []).filter(
          (name: string) => name !== skillToRemove.skill.name
        );
        
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ skills: updatedProfileSkills })
          .eq('id', user.id);
          
        if (updateErr) throw updateErr;
      }

      toast({
        title: "Skill removed",
        description: "Skill successfully removed from your profile",
      });

      return true;
    } catch (error: any) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error removing skill",
        description: error.message || "An error occurred while removing the skill",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    skills,
    setSkills,
    availableSkills,
    isLoading,
    handleAddSkill,
    handleRemoveSkill
  };
};
