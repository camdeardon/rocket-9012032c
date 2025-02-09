
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, Linkedin, Video, ChevronRight } from "lucide-react";

const CompleteProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    about: "",
    skills: "",
    background: "",
    interests: "",
    resume: null as File | null,
    linkedinUrl: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Profile data:", formData);
    toast({
      title: "Profile completed!",
      description: "Your profile has been successfully updated.",
    });
    // navigate("/dashboard");
  };

  const handleLinkedInConnect = () => {
    // Implement LinkedIn OAuth flow
    toast({
      title: "LinkedIn Integration",
      description: "LinkedIn integration coming soon!",
    });
  };

  const handleVideoIntro = () => {
    // Implement video recording feature
    toast({
      title: "Video Introduction",
      description: "Video introduction feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Complete Your Profile</h1>
            <p className="mt-2 text-xl text-secondary-foreground">
              Help us match you with the perfect co-founder
            </p>
          </div>

          <Card className="p-8 space-y-8 bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* About Section */}
              <div className="space-y-4">
                <Label htmlFor="about" className="text-lg font-semibold">
                  Tell us about yourself
                </Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Share your story, what drives you, and what you're looking to achieve..."
                  value={formData.about}
                  onChange={handleChange}
                  className="min-h-[120px]"
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <Label htmlFor="skills" className="text-lg font-semibold">
                  What are your key skills?
                </Label>
                <Textarea
                  id="skills"
                  name="skills"
                  placeholder="List your technical skills, business expertise, or any other relevant abilities..."
                  value={formData.skills}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Background Section */}
              <div className="space-y-4">
                <Label htmlFor="background" className="text-lg font-semibold">
                  Professional Background
                </Label>
                <Textarea
                  id="background"
                  name="background"
                  placeholder="Share your work experience, education, and notable achievements..."
                  value={formData.background}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <Label htmlFor="interests" className="text-lg font-semibold">
                  What industries or areas interest you?
                </Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="Tell us about the industries, technologies, or business areas you're passionate about..."
                  value={formData.interests}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Upload and Integration Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Resume Upload */}
                <div>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => document.getElementById("resume")?.click()}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Resume</span>
                  </Button>
                </div>

                {/* LinkedIn Integration */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={handleLinkedInConnect}
                >
                  <Linkedin className="h-6 w-6" />
                  <span>Connect LinkedIn</span>
                </Button>

                {/* Video Introduction */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={handleVideoIntro}
                >
                  <Video className="h-6 w-6" />
                  <span>Add Video Intro</span>
                </Button>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full text-lg py-6">
                Complete Profile
                <ChevronRight className="ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
