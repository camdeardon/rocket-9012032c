
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-primary">
                Welcome Back
              </h1>
              <p className="text-xl text-foreground leading-relaxed">
                Log in to connect with co-founders, manage your projects, and continue 
                building your dream team.
              </p>
              <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-primary">
                  Don't have an account?
                </h2>
                <p className="text-foreground">
                  Join Rocket and start your journey to finding the perfect co-founder. 
                  Create meaningful connections and bring your ideas to life.
                </p>
                <Link 
                  to="/signup"
                  className="inline-block text-primary hover:underline"
                >
                  Sign up now →
                </Link>
              </div>
            </div>
          </div>

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
                <Link to="/signup" className="text-primary hover:underline">
                  Need an account? Sign up
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
