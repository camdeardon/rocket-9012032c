
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";

const CompleteProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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

  // Check authentication and profile status
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to complete your profile.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Check if profile is already completed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.onboarding_completed) {
          toast({
            title: "Profile already completed",
            description: "Redirecting to dashboard...",
          });
          navigate('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Auth/Profile check error:', error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    checkAuthAndProfile();

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      const location = `${formData.city}, ${formData.state}, ${formData.country}`.trim();
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio: formData.about,
          background: formData.background,
          location: location,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully updated.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/10 to-secondary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-secondary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <ProfileHeader />
          <Card className="p-8 space-y-8 bg-white/95 backdrop-blur-sm shadow-lg">
            <ProfileForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
