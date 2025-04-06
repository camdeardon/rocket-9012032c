
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BackgroundSectionProps {
  background: string;
  interests: string;
  dateOfBirth: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BackgroundSection = ({
  background,
  interests,
  dateOfBirth,
  onChange,
}: BackgroundSectionProps) => {
  const interestList = typeof interests === 'string' 
    ? interests.split(',').map(i => i.trim()).filter(Boolean)
    : [];
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="background" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Background & Experience
        </Label>
        <Textarea
          id="background"
          name="background"
          placeholder="Tell us about your professional background and experiences..."
          value={background}
          onChange={onChange}
          className="min-h-[120px] bg-white"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="interests" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Interests & Hobbies
        </Label>
        <Textarea
          id="interests"
          name="interests"
          placeholder="What are you passionate about? (e.g., 'Technology, Travel, Photography')"
          value={interests}
          onChange={onChange}
          className="min-h-[100px] bg-white"
        />
        <p className="text-sm text-muted-foreground">
          Separate interests with commas. After saving, you can manage individual interests on the right.
        </p>
        
        {interestList.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="flex flex-wrap gap-2">
              {interestList.map((interest, index) => (
                <Badge key={index} variant="outline">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="dateOfBirth" className="text-lg font-semibold flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Date of Birth
        </Label>
        <Input
          type="date"
          id="dateOfBirth"
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
