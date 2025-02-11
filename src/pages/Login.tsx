
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user?.id)
        .single();
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      // Redirect based on profile completion status
      if (profile?.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/complete-profile');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid email or password. Please try again.",
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
    <Card className="p-8 shadow-lg bg-white/90 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Login</h2>
          <p className="text-foreground">
            Welcome back to your journey
          </p>
        </div>

        <div className="space-y-4">
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
        </div>

        <Button 
          type="submit" 
          className="w-full text-lg py-6 bg-primary hover:bg-primary/90" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-foreground/80">
          <Link to="/auth?mode=signup" className="text-primary hover:underline">
            Need an account? Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Login;
