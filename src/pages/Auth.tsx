
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Login from "./Login";
import SignUp from "./SignUp";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if profile is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session?.user?.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/complete-profile');
        }
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
                {mode === 'signin' ? 'Welcome Back' : 'Find Your Perfect Co-Founder'}
              </h1>
              <p className="text-xl text-foreground leading-relaxed">
                {mode === 'signin' 
                  ? 'Sign in to connect with co-founders and continue building your dream team.'
                  : 'Join Rocket and connect with like-minded professionals who share your vision and passion.'}
              </p>
              <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-primary">
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                </h2>
                <p className="text-foreground">
                  {mode === 'signin' 
                    ? 'Join Rocket and start your journey to finding the perfect co-founder.'
                    : 'Sign in to continue building your dream team.'}
                </p>
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => navigate(`/auth?mode=${mode === 'signin' ? 'signup' : 'signin'}`)}
                >
                  {mode === 'signin' ? 'Sign up now →' : 'Sign in →'}
                </Button>
              </div>
            </div>
          </div>

          {mode === 'signin' ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
