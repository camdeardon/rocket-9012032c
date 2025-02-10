
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

interface AboutSectionProps {
  about: string;
  skills: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AboutSection = ({ about, skills, onChange }: AboutSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="about" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Tell us about yourself
        </Label>
        <Textarea
          id="about"
          name="about"
          placeholder="Share your story, what drives you, and what you're looking to achieve..."
          value={about}
          onChange={onChange}
          className="min-h-[120px] bg-white"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="skills" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          What are your key skills?
        </Label>
        <Textarea
          id="skills"
          name="skills"
          placeholder="List your technical skills, business expertise, or any other relevant abilities..."
          value={skills}
          onChange={onChange}
          className="min-h-[100px] bg-white"
        />
      </div>
    </div>
  );
};

export default AboutSection;
