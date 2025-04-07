
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle } from "lucide-react";
import AboutSection from "./AboutSection";
import LocationSection from "./LocationSection";
import BackgroundSection from "./BackgroundSection";
import ProfileEnhancement from "./ProfileEnhancement";
import ProfileWorkPreferences from "./ProfileWorkPreferences";
import ProfileBusinessDetails from "./ProfileBusinessDetails";
import ProfileSkills from "./ProfileSkills";

interface ProfileFormProps {
  formData: {
    about: string;
    skills?: string[] | string;
    background: string;
    interests: string[] | string;
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
  editMode: boolean;
  userSkills?: any[];
}

const ProfileForm = ({ 
  formData, 
  isLoading, 
  onChange, 
  onFileChange, 
  onSubmit, 
  editMode,
  userSkills = []
}: ProfileFormProps) => {
  const [sections, setSections] = useState({
    about: true,
    location: true,
    background: true,
    workPreferences: true,
    businessDetails: true
  });

  // Get input value for arrays
  const getInputValue = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      formData.about, 
      formData.background,
      formData.city, 
      formData.country
    ];
    
    const filledFields = requiredFields.filter(Boolean).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-white p-4 rounded-md shadow-sm mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Profile Completion</h3>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          {completionPercentage === 100 && (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Complete!</span>
            </div>
          )}
        </div>
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AboutSection
            about={formData.about}
            onChange={onChange}
          />
          <LocationSection formData={formData} onChange={onChange} />
        </div>

        <div className="space-y-8">
          <BackgroundSection
            background={formData.background}
            interests={getInputValue(formData.interests)}
            dateOfBirth={formData.dateOfBirth}
            onChange={onChange}
          />
          
          <div className="animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
            <ProfileWorkPreferences
              formData={formData}
              onChange={onChange}
              editMode={editMode ? "true" : "false"}
            />
          </div>

          <div className="animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
            <ProfileBusinessDetails
              formData={formData}
              onChange={onChange}
              editMode={editMode ? "true" : "false"}
            />
          </div>
          
          <div className="animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
            <ProfileSkills userSkills={userSkills} />
          </div>
        </div>
      </div>

      <ProfileEnhancement onFileChange={onFileChange} />

      <div className="animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
        <Button 
          type="submit" 
          className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {editMode ? "Saving..." : "Updating..."}
            </>
          ) : (
            <>
              {editMode ? "Save Changes" : "Complete Profile"}
              <ChevronRight className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
