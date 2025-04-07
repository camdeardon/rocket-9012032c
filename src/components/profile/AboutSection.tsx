
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { FormFeedback } from "@/components/ui/form-feedback";

interface AboutSectionProps {
  about: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AboutSection = ({ about, onChange }: AboutSectionProps) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  const getValidationState = () => {
    if (!touched) return null;
    
    if (about && about.length < 20) {
      return {
        error: "Tell us a bit more about yourself (at least 20 characters)",
      };
    }
    
    if (about && about.length >= 20) {
      return {
        success: true,
        message: "Great! This will help others get to know you better",
      };
    }
    
    return {
      error: "This field is required",
    };
  };

  const validation = getValidationState();
  const hasError = validation?.error;
  const isSuccess = validation?.success;

  return (
    <div className="space-y-8 animate-fade-in">
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
          onBlur={handleBlur}
          className={`min-h-[120px] bg-white form-input-focus animate-soft ${
            hasError ? 'form-error' : isSuccess ? 'form-success' : ''
          }`}
          aria-invalid={!!hasError}
        />
        {hasError && <FormFeedback type="error" message={validation?.error} />}
        {isSuccess && <FormFeedback type="success" message={validation?.message} />}
      </div>
    </div>
  );
};

export default AboutSection;
