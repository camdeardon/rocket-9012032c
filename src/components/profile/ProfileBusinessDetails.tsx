
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, LineChart, Edit2, Save, Target } from "lucide-react";

interface ProfileBusinessDetailsProps {
  profileData: {
    business_focus?: string[] | null;
    investment_preferences?: string[] | null;
    entrepreneurial_experience?: string | null;
    core_values?: string[] | null;
  } | null;
  editMode: string | null;
  editedValues: {
    business_focus: string[];
    investment_preferences: string[];
    entrepreneurial_experience: string;
    core_values: string[];
  };
  setEditMode: (mode: string | null) => void;
  setEditedValues: (values: any) => void;
  handleSave: (section: string) => void;
}

const ProfileBusinessDetails = ({
  profileData,
  editMode,
  editedValues,
  setEditMode,
  setEditedValues,
  handleSave,
}: ProfileBusinessDetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Business Details</h2>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setEditMode('business_details')}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {editMode === 'business_details' ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Business Focus Areas</label>
            <Textarea
              value={editedValues.business_focus.join(', ')}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                business_focus: e.target.value.split(',').map(item => item.trim())
              }))}
              placeholder="Enter business focus areas (comma-separated)"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Investment Preferences</label>
            <Textarea
              value={editedValues.investment_preferences.join(', ')}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                investment_preferences: e.target.value.split(',').map(item => item.trim())
              }))}
              placeholder="Enter investment preferences (comma-separated)"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Entrepreneurial Experience</label>
            <Textarea
              value={editedValues.entrepreneurial_experience}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                entrepreneurial_experience: e.target.value
              }))}
              placeholder="Describe your entrepreneurial experience"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Core Values</label>
            <Textarea
              value={editedValues.core_values.join(', ')}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                core_values: e.target.value.split(',').map(item => item.trim())
              }))}
              placeholder="Enter core values (comma-separated)"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleSave('business_details')}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditMode(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <Target className="h-4 w-4 inline mr-2" />
              Business Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.business_focus?.map((focus, index) => (
                <Badge key={index} variant="secondary">{focus}</Badge>
              )) || "No focus areas specified"}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <LineChart className="h-4 w-4 inline mr-2" />
              Investment Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.investment_preferences?.map((pref, index) => (
                <Badge key={index} variant="secondary">{pref}</Badge>
              )) || "No preferences specified"}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Experience
            </h3>
            <p className="text-sm">{profileData?.entrepreneurial_experience || "No experience specified"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Core Values
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.core_values?.map((value, index) => (
                <Badge key={index} variant="outline">{value}</Badge>
              )) || "No core values specified"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBusinessDetails;
