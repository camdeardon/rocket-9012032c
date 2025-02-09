import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/utils/api";

const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await signUp(formData);
      localStorage.setItem('authToken', response.token);
      
      toast({
        title: "Account created!",
        description: "Let's complete your profile to find your perfect match.",
      });
      navigate("/complete-profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-primary">
                Find Your Perfect Co-Founder
              </h1>
              <p className="text-xl text-secondary-foreground leading-relaxed">
                Join Rocket and connect with like-minded professionals who share your 
                vision and passion. Our AI-powered matching algorithm helps you find 
                the right people to build your dream team.
              </p>
              <div className="space-y-4 bg-white/60 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-primary">
                  How it works:
                </h2>
                <ul className="space-y-3 text-secondary-foreground">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    Create your account
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    Complete your profile with your skills and interests
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    Get matched with potential co-founders
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Card className="p-8 shadow-lg bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold text-primary">Get Started</h2>
                <p className="text-secondary-foreground">
                  Create your account in seconds
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg py-6" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-sm text-center text-secondary-foreground/80">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
