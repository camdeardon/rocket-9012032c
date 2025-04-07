
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Linkedin, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileEnhancementProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEnhancement = ({ onFileChange }: ProfileEnhancementProps) => {
  const { toast } = useToast();

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

  return (
    <div className="pt-4 border-t">
      <Label className="text-lg font-semibold mb-4 block">
        Enhance your profile
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
