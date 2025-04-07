
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Linkedin, Video, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface ProfileEnhancementProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEnhancement = ({ onFileChange }: ProfileEnhancementProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleLinkedInConnect = () => {
    toast({
      title: "LinkedIn Integration",
      description: "LinkedIn integration coming soon!",
    });
  };

  const handleVideoIntro = () => {
    toast({
      title: "Video Introduction",
      description: "Video introduction feature coming soon!",
    });
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-pictures/${uuidv4()}.${fileExt}`;
    
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
      const { data: publicURL } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
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
    <div className="pt-4 border-t">
      <Label className="text-lg font-semibold mb-4 block">
        Enhance your profile
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-accent/5"
            onClick={() => document.getElementById("resume")?.click()}
          >
            <Upload className="h-6 w-6" />
            <span>Upload Resume</span>
          </Button>
        </div>

        <div>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-accent/5"
            onClick={() => document.getElementById("profile-picture")?.click()}
            disabled={isUploading}
          >
            <Image className="h-6 w-6" />
            <span>{isUploading ? "Uploading..." : "Upload Picture"}</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-accent/5"
          onClick={handleLinkedInConnect}
        >
          <Linkedin className="h-6 w-6" />
          <span>Connect LinkedIn</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-accent/5"
          onClick={handleVideoIntro}
        >
          <Video className="h-6 w-6" />
          <span>Add Video Intro</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileEnhancement;
