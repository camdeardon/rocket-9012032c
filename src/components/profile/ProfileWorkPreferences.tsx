import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Globe, Briefcase, Edit2, Save } from "lucide-react";

interface ProfileWorkPreferencesProps {
  formData: {
    preferred_work_timezone?: string;
    work_style?: string;
    preferred_communication?: string[];
    preferred_team_size?: string;
    availability_hours?: number;
    remote_preference?: string;
  };
  editMode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileWorkPreferences = ({
  formData,
  editMode,
  onChange,
}: ProfileWorkPreferencesProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Work Preferences</h2>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => {}}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {editMode === 'work_preferences' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Preferred Timezone</label>
              <Input
                value={formData.preferred_work_timezone || ""}
                onChange={onChange}
                name="preferred_work_timezone"
                placeholder="e.g., GMT-5, PST, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Work Style</label>
              <select
                value={formData.work_style || ""}
                onChange={onChange}
                name="work_style"
                className="w-full rounded-md border border-input px-3 py-2"
              >
                <option value="">Select work style</option>
                <option value="structured">Structured</option>
                <option value="flexible">Flexible</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Remote Preference</label>
            <select
              value={formData.remote_preference || ""}
              onChange={onChange}
              name="remote_preference"
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="">Select preference</option>
              <option value="remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="office">Office-based</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Preferred Team Size</label>
            <select
              value={formData.preferred_team_size || ""}
              onChange={onChange}
              name="preferred_team_size"
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="">Select team size</option>
              <option value="solo">Solo/Individual</option>
              <option value="small">Small (2-5)</option>
              <option value="medium">Medium (6-15)</option>
              <option value="large">Large (15+)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Weekly Availability (hours)</label>
            <Input
              type="number"
              value={formData.availability_hours || 0}
              onChange={onChange}
              name="availability_hours"
              min={0}
              max={168}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => {}}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              Timezone
            </h3>
            <p>{formData?.preferred_work_timezone || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <Briefcase className="h-4 w-4 inline mr-2" />
              Work Style
            </h3>
            <p className="capitalize">{formData?.work_style || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              Team Size
            </h3>
            <p className="capitalize">{formData?.preferred_team_size || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Weekly Availability
            </h3>
            <p>{formData?.availability_hours ? `${formData.availability_hours} hours` : "Not specified"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWorkPreferences;
