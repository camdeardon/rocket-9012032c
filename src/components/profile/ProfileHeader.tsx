
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, LogOut, Download, MapPin, Save, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  location: string | null;
  avatar_url: string | null;
  bio: string | null;
  resume_url: string | null;
}

interface ProfileHeaderProps {
  profileData: ProfileData | null;
  editMode: string | null;
  editedValues: {
    first_name: string;
    last_name: string;
    title: string;
    location: string;
    bio: string;
  };
  setEditMode: (mode: string | null) => void;
  setEditedValues: (values: any) => void;
  handleSave: (section: string) => void;
  handleLogout: () => void;
  handleResumeDownload: (resume_url: string | null) => Promise<void>;
}

const ProfileHeader = ({
  profileData,
  editMode,
  editedValues,
  setEditMode,
  setEditedValues,
  handleSave,
  handleLogout,
  handleResumeDownload,
}: ProfileHeaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;
    
    setIsUploading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURLData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      if (!publicURLData || !publicURLData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURLData.publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated.",
      });
      
      // Reload the page to see changes
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was a problem uploading your profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-6">
        <div className="relative group">
          <Avatar className="h-32 w-32">
            <img 
              src={profileData?.avatar_url || "/placeholder.svg"} 
              alt={`${profileData?.first_name} ${profileData?.last_name}`} 
              className="object-cover h-full w-full" 
            />
          </Avatar>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full bg-primary/90 hover:bg-primary text-white opacity-90 group-hover:opacity-100 transition-opacity"
            onClick={() => document.getElementById("profile-picture")?.click()}
            disabled={isUploading}
            aria-label="Change profile picture"
          >
            <Camera size={16} />
          </Button>
        </div>
        <div className="flex-1">
          {editMode === 'header' ? (
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
                <Button onClick={() => handleSave('header')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditMode(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    {profileData?.first_name} {profileData?.last_name}
                  </h1>
                  <p className="text-xl text-secondary-foreground">{profileData?.title}</p>
                  {profileData?.location && (
                    <div className="flex items-center gap-2 mt-2 text-secondary-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditMode('header')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {profileData?.bio && (
                <p className="mt-4 text-secondary-foreground">{profileData.bio}</p>
              )}
              {profileData?.resume_url && (
                <Button
                  variant="outline"
                  onClick={() => handleResumeDownload(profileData.resume_url)}
                  className="mt-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default ProfileHeader;
