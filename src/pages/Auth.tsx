
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-primary">
                Find Your Perfect Co-Founder
              </h1>
              <p className="text-xl text-foreground leading-relaxed">
                Join Rocket and connect with like-minded professionals who share your 
                vision and passion. Our AI-powered matching algorithm helps you find 
                the right people to build your dream team.
              </p>
              <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-primary">
                  How it works:
                </h2>
                <ul className="space-y-3 text-foreground">
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
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#529493',
                      brandAccent: '#457C7B',
                    },
                  },
                },
              }}
              providers={['google', 'github']}
              redirectTo={window.location.origin + '/dashboard'}
              onlyThirdPartyProviders={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
