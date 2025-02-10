
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Check, Calendar } from "lucide-react";

interface BackgroundSectionProps {
  background: string;
  interests: string;
  dateOfBirth: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BackgroundSection = ({ background, interests, dateOfBirth, onChange }: BackgroundSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="background" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Professional Background
        </Label>
        <Textarea
          id="background"
          name="background"
          placeholder="Share your work experience, education, and notable achievements..."
          value={background}
          onChange={onChange}
          className="min-h-[100px] bg-white"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="interests" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          What industries interest you?
        </Label>
        <Textarea
          id="interests"
          name="interests"
          placeholder="Tell us about the industries, technologies, or business areas you're passionate about..."
          value={interests}
          onChange={onChange}
          className="min-h-[100px] bg-white"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Date of Birth
        </Label>
        <Input
          type="date"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={onChange}
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default BackgroundSection;
