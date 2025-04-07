import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AboutSection from "./AboutSection";
import LocationSection from "./LocationSection";
import BackgroundSection from "./BackgroundSection";
import ProfileWorkPreferences from "./ProfileWorkPreferences";
import ProfileBusinessDetails from "./ProfileBusinessDetails";
import ProfileEnhancement from "./ProfileEnhancement";

interface ProfileMainContentProps {
  editMode: string | null;
  editedValues: any;
  setEditedValues: (values: any) => void;
  handleSave: (section: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileMainContent = ({
  editMode,
  editedValues,
  setEditedValues,
  handleSave,
  handleFileChange,
}: ProfileMainContentProps) => {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <AboutSection
          about={editedValues.bio || ""}
          onChange={(e) => setEditedValues(prev => ({
            ...prev,
            [e.target.name === "about" ? "bio" : e.target.name]: e.target.value
          }))}
        />
        {editMode === 'about' && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSave('about')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <LocationSection
          formData={{
            street: editedValues.street || "",
            city: editedValues.city || "",
            state: editedValues.state || "",
            zipCode: editedValues.zipCode || "",
            country: editedValues.country || "",
          }}
          onChange={(e) => setEditedValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))}
        />
        {editMode === 'location' && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSave('location')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <BackgroundSection
          background={editedValues.background || ""}
          interests={editedValues.interests?.join(", ") || ""}
          dateOfBirth={editedValues.dateOfBirth || ""}
          onChange={(e) => setEditedValues(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "interests" 
              ? e.target.value.split(/\s*,\s*/).filter(Boolean) 
              : e.target.value
          }))}
        />
        {editMode === 'background' && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSave('background')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <ProfileWorkPreferences
          formData={{
            preferred_work_timezone: editedValues.preferred_work_timezone,
            work_style: editedValues.work_style,
            preferred_communication: editedValues.preferred_communication,
            preferred_team_size: editedValues.preferred_team_size,
            availability_hours: editedValues.availability_hours,
            remote_preference: editedValues.remote_preference,
          }}
          editMode={editMode}
          onChange={(e) => setEditedValues(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "preferred_communication"
              ? e.target.value.split(/\s*,\s*/).filter(Boolean)
              : e.target.value
          }))}
        />
        {editMode === 'workPreferences' && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSave('workPreferences')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <ProfileBusinessDetails
          formData={{
            business_focus: editedValues.business_focus,
            investment_preferences: editedValues.investment_preferences,
            entrepreneurial_experience: editedValues.entrepreneurial_experience,
            core_values: editedValues.core_values,
          }}
          editMode={editMode}
          onChange={(e) => setEditedValues(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "entrepreneurial_experience" 
              ? e.target.value 
              : e.target.value.split(/\s*,\s*/).filter(Boolean)
          }))}
        />
        {editMode === 'businessDetails' && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleSave('businessDetails')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-sm">
        <ProfileEnhancement onFileChange={handleFileChange} />
      </Card>
    </div>
  );
};

export default ProfileMainContent;
