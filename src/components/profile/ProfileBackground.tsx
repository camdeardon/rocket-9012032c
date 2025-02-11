
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit2, Save } from "lucide-react";

interface ProfileBackgroundProps {
  profileData: { background: string | null } | null;
  editMode: string | null;
  editedValues: { background: string };
  setEditMode: (mode: string | null) => void;
  setEditedValues: (values: any) => void;
  handleSave: (section: string) => void;
}

const ProfileBackground = ({
  profileData,
  editMode,
  editedValues,
  setEditMode,
  setEditedValues,
  handleSave,
}: ProfileBackgroundProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Background</h2>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setEditMode('background')}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      {editMode === 'background' ? (
        <div className="space-y-4">
          <Textarea
            value={editedValues.background}
            onChange={(e) => setEditedValues(prev => ({
              ...prev,
              background: e.target.value
            }))}
            className="min-h-[150px]"
          />
          <div className="flex gap-2">
            <Button onClick={() => handleSave('background')}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditMode(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-secondary-foreground">{profileData?.background}</p>
      )}
    </div>
  );
};

export default ProfileBackground;
