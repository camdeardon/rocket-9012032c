
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit2, Save } from "lucide-react";

interface ProfileBackgroundProps {
  background: string | null;
  onSave: (updates: { background: string }) => Promise<void>;
}

export const ProfileBackground = ({ background, onSave }: ProfileBackgroundProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedBackground, setEditedBackground] = useState(background || "");

  const handleSave = async () => {
    await onSave({ background: editedBackground });
    setEditMode(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Background</h2>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setEditMode(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      {editMode ? (
        <div className="space-y-4">
          <Textarea
            value={editedBackground}
            onChange={(e) => setEditedBackground(e.target.value)}
            className="min-h-[150px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-secondary-foreground">{background}</p>
      )}
    </div>
  );
};
