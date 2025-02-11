
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
      const location = `${formData.city}, ${formData.state}, ${formData.country}`.trim();
      
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
