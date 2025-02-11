
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import AboutSection from "./AboutSection";
import LocationSection from "./LocationSection";
import BackgroundSection from "./BackgroundSection";
import ProfileEnhancement from "./ProfileEnhancement";
import ProfileWorkPreferences from "./ProfileWorkPreferences";
import ProfileBusinessDetails from "./ProfileBusinessDetails";

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
    preferred_work_timezone: string;
    work_style: string;
    preferred_communication: string[];
    preferred_team_size: string;
    availability_hours: number;
    remote_preference: string;
    business_focus: string[];
    investment_preferences: string[];
    entrepreneurial_experience: string;
    core_values: string[];
  };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  editMode?: boolean;
}

const ProfileForm = ({ formData, isLoading, onChange, onFileChange, onSubmit, editMode = false }: ProfileFormProps) => {
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

        <div className="space-y-8">
          <BackgroundSection
            background={formData.background}
            interests={formData.interests}
            dateOfBirth={formData.dateOfBirth}
            onChange={onChange}
          />
          
          <ProfileWorkPreferences
            formData={formData}
            onChange={onChange}
            editMode={editMode}
          />

          <ProfileBusinessDetails
            formData={formData}
            onChange={onChange}
            editMode={editMode}
          />
        </div>
      </div>

      <ProfileEnhancement onFileChange={onFileChange} />

      <Button 
        type="submit" 
        className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : editMode ? "Save Changes" : "Complete Profile"}
        <ChevronRight className="ml-2" />
      </Button>
    </form>
  );
};

export default ProfileForm;
