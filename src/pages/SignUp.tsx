
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "founder",
    interests: "",
    background: "",
    projectIdeas: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    toast({
      title: "Sign up successful!",
      description: "We'll reach out when the app is ready.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Marketing Content */}
          <div className="space-y-8">
            <div>
              <img 
                src="/lovable-uploads/0a5d559d-482d-4275-a21c-51a53fc846cf.png" 
                alt="Rocket Logo" 
                className="h-12"
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">Help us find your team</h1>
              <p className="text-lg text-gray-600">
                At Rocket, we understand that finding those early team members is vital to building a successful team. 
                At Rocket we machine learning to not only find people with the skills you need but also match you 
                to people with similar interests and experiences. We believe by creating the right matches we can 
                kickstart success through empowered collaboration.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800">
                Sound interesting? Sign up and we'll reach out to you when the app is ready!
              </h2>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign Up</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Create a New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Who are you</Label>
                <RadioGroup
                  defaultValue="founder"
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="founder" id="founder" />
                    <Label htmlFor="founder">Founder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="joining" id="joining" />
                    <Label htmlFor="joining">Joining a team</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undecided" id="undecided" />
                    <Label htmlFor="undecided">Undecided</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Tell us about yourself and include your goals</Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="I'm passionate about...."
                  value={formData.interests}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Provide a bio about your background, education or experience</Label>
                <Textarea
                  id="background"
                  name="background"
                  placeholder="I've spent 5 years designing brand materials...."
                  value={formData.background}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectIdeas">Tell us about the projects you'd like to join or found</Label>
                <Textarea
                  id="projectIdeas"
                  name="projectIdeas"
                  placeholder="I'd like to join a early biotech company specialising in Immunotherapies...."
                  value={formData.projectIdeas}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
