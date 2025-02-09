
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Edit2, Save } from "lucide-react";

interface ProfileHeaderProps {
  profileData: {
    first_name: string;
    last_name: string;
    title: string | null;
    location: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  onSave: (updates: any) => Promise<void>;
}

export const ProfileHeader = ({ profileData, onSave }: ProfileHeaderProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    first_name: profileData.first_name || "",
    last_name: profileData.last_name || "",
    title: profileData.title || "",
    location: profileData.location || "",
    bio: profileData.bio || "",
  });

  const handleSave = async () => {
    await onSave(editedValues);
    setEditMode(false);
  };

  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-32 w-32">
        <img 
          src={profileData.avatar_url || "/placeholder.svg"} 
          alt={`${profileData.first_name} ${profileData.last_name}`} 
          className="object-cover" 
        />
      </Avatar>
      <div className="flex-1">
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={editedValues.first_name}
                  onChange={(e) => setEditedValues(prev => ({
                    ...prev,
                    first_name: e.target.value
                  }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={editedValues.last_name}
                  onChange={(e) => setEditedValues(prev => ({
                    ...prev,
                    last_name: e.target.value
                  }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedValues.title}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={editedValues.location}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={editedValues.bio}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  bio: e.target.value
                }))}
              />
            </div>
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
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {profileData.first_name} {profileData.last_name}
                </h1>
                <p className="text-xl text-secondary-foreground">{profileData.title}</p>
                {profileData.location && (
                  <div className="flex items-center gap-2 mt-2 text-secondary-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setEditMode(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            {profileData.bio && (
              <p className="mt-4 text-secondary-foreground">{profileData.bio}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
