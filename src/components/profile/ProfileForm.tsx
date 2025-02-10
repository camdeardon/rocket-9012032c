
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import AboutSection from "./AboutSection";
import LocationSection from "./LocationSection";
import BackgroundSection from "./BackgroundSection";
import ProfileEnhancement from "./ProfileEnhancement";

interface ProfileFormProps {
  formData: {
    about: string;
    skills: string;
    background: string;
    interests: string;
    linkedinUrl: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    dateOfBirth: string;
    resume: File | null;
  };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({ formData, isLoading, onChange, onFileChange, onSubmit }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AboutSection
            about={formData.about}
            skills={formData.skills}
            onChange={onChange}
          />
          <LocationSection formData={formData} onChange={onChange} />
        </div>

        <BackgroundSection
          background={formData.background}
          interests={formData.interests}
          dateOfBirth={formData.dateOfBirth}
          onChange={onChange}
        />
      </div>

      <ProfileEnhancement onFileChange={onFileChange} />

      <Button 
        type="submit" 
        className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Complete Profile"}
        <ChevronRight className="ml-2" />
      </Button>
    </form>
  );
};

export default ProfileForm;
