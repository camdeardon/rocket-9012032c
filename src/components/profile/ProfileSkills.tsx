import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SkillsList } from "./SkillsList";
import { AddSkillDialog } from "./AddSkillDialog";

interface ProfileSkillsProps {
  userSkills: any[];
}

const ProfileSkills = ({ userSkills }: ProfileSkillsProps) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<any[]>(userSkills);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  useEffect(() => {
    setSkills(userSkills);
  }, [userSkills]);

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
        setIsLoading(false);
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

      setSkills([...skills, data]);
      
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

      setShowAddDialog(false);
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error adding skill",
        description: error.message || "An error occurred while adding the skill",
        variant: "destructive",
      });
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
      const removedSkill = skills.find(s => s.id === skillId);
      if (removedSkill) {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('skills')
          .eq('id', user.id)
          .single();
        
        if (profileErr) throw profileErr;
        
        const updatedProfileSkills = (profileData.skills || []).filter(
          (name: string) => name !== removedSkill.skill.name
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
    } catch (error: any) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error removing skill",
        description: error.message || "An error occurred while removing the skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        onAddSkill={handleAddSkill}
        availableSkills={availableSkills}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfileSkills;
