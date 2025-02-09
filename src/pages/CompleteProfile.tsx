import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, Linkedin, Video, ChevronRight, Check, MapPin, Calendar } from "lucide-react";

const CompleteProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    about: "",
    skills: "",
    background: "",
    interests: "",
    resume: null as File | null,
    linkedinUrl: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
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
    console.log("Profile data:", formData);
    toast({
      title: "Profile completed!",
      description: "Your profile has been successfully updated.",
    });
    navigate("/dashboard");
  };

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
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-secondary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">Build Your Co-Founder Profile</h1>
            <p className="mt-2 text-xl text-secondary-foreground">
              Help us understand you better to find your perfect match
            </p>
          </div>

          <Card className="p-8 space-y-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      value={formData.about}
                      onChange={handleChange}
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
                      value={formData.skills}
                      onChange={handleChange}
                      className="min-h-[100px] bg-white"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="street"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={handleChange}
                      />
                      <Input
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      <Input
                        name="state"
                        placeholder="State/Province"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      <Input
                        name="zipCode"
                        placeholder="ZIP/Postal Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                      <Input
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                </div>

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
                      value={formData.background}
                      onChange={handleChange}
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
                      value={formData.interests}
                      onChange={handleChange}
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
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

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
                      onChange={handleFileChange}
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

              <Button 
                type="submit" 
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-colors"
              >
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
