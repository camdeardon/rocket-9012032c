
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";

const CompleteProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    skills: "",
    background: "",
    interests: "",
    resume: null as File | null,
    linkedinUrl: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      const location = [formData.city, formData.state, formData.country]
        .filter(Boolean)
        .join(", ");

      // Update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.about,
          background: formData.background,
          location: location,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          interests: formData.interests.split(',').map(interest => interest.trim()),
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Add skills
      const skillsToAdd = formData.skills.split(',').map(skill => skill.trim());
      for (const skillName of skillsToAdd) {
        if (!skillName) continue;
        
        // First, ensure the skill exists in the skills table
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .single();

        if (skillError && skillError.code !== 'PGRST116') {
          console.error('Error checking skill:', skillError);
          continue;
        }

        let skillId;
        if (!skillData) {
          // Create new skill
          const { data: newSkill, error: createSkillError } = await supabase
            .from('skills')
            .insert({ name: skillName })
            .select('id')
            .single();

          if (createSkillError) {
            console.error('Error creating skill:', createSkillError);
            continue;
          }
          skillId = newSkill.id;
        } else {
          skillId = skillData.id;
        }

        // Add user_skill
        await supabase
          .from('user_skills')
          .insert({
            user_id: user.id,
            skill_id: skillId
          });
      }

      // Add interests
      const interestsToAdd = formData.interests.split(',').map(interest => interest.trim());
      for (const interestName of interestsToAdd) {
        if (!interestName) continue;

        // First, ensure the interest exists in the interests table
        const { data: interestData, error: interestError } = await supabase
          .from('interests')
          .select('id')
          .eq('name', interestName)
          .single();

        if (interestError && interestError.code !== 'PGRST116') {
          console.error('Error checking interest:', interestError);
          continue;
        }

        let interestId;
        if (!interestData) {
          // Create new interest
          const { data: newInterest, error: createInterestError } = await supabase
            .from('interests')
            .insert({ name: interestName })
            .select('id')
            .single();

          if (createInterestError) {
            console.error('Error creating interest:', createInterestError);
            continue;
          }
          interestId = newInterest.id;
        } else {
          interestId = interestData.id;
        }

        // Add user_interest
        await supabase
          .from('user_interests')
          .insert({
            user_id: user.id,
            interest_id: interestId
          });
      }
      
      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully updated.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-secondary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <ProfileHeader />
          <Card className="p-8 space-y-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <ProfileForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
