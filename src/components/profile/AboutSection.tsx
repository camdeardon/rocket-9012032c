
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AboutSectionProps {
  about: string;
  skills: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AboutSection = ({ about, skills, onChange }: AboutSectionProps) => {
  const skillList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  
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
          placeholder="List your skills (e.g., 'Web Development, Project Management, Digital Marketing')"
          value={skills}
          onChange={onChange}
          className="min-h-[100px] bg-white"
        />
        <p className="text-sm text-muted-foreground">
          Separate skills with commas. After saving, you can manage individual skills in the Skills section on the right.
        </p>
        
        {skillList.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSection;
