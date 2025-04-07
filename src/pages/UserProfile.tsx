
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Handshake, MessageCircle, UserCheck, UserX, ArrowLeft } from "lucide-react";
import { FormFeedback } from "@/components/ui/form-feedback";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isConnectionRequest = searchParams.get('connectionRequest') === 'true';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        
        // Get the profile of the requested user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Could not load this user's profile. They may have deactivated their account.");
          setIsLoading(false);
          return;
        }
        
        // Get current user's profile
        const { data: currentUserData, error: currentUserError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (currentUserError) {
          console.error("Error fetching current user profile:", currentUserError);
          setError("Could not load your profile information.");
          setIsLoading(false);
          return;
        }
        
        // Check if there's an existing connection
        const { data: outgoingConnection, error: outgoingError } = await supabase
          .from('matches')
          .select('*')
          .eq('user_id', user.id)
          .eq('matched_user_id', id)
          .maybeSingle();
          
        const { data: incomingConnection, error: incomingError } = await supabase
          .from('matches')
          .select('*')
          .eq('user_id', id)
          .eq('matched_user_id', user.id)
          .maybeSingle();
        
        // Determine connection status
        if (outgoingConnection && incomingConnection) {
          setConnectionStatus('mutual');
        } else if (outgoingConnection) {
          setConnectionStatus(outgoingConnection.status);
        } else if (incomingConnection) {
          setConnectionStatus('incoming');
        } else {
          setConnectionStatus(null);
        }
        
        setProfile(profileData);
        setCurrentUserProfile(currentUserData);
        
      } catch (error) {
        console.error("Error in profile fetch:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
  }, [id, navigate]);
  
  const handleConnect = async () => {
    if (!currentUserProfile?.id || !id) {
      toast({
        title: "Error",
        description: "Could not create connection. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsPending(true);
      
      // Calculate basic match scores
      const skillsMatch = calculateSkillsMatch(currentUserProfile.skills, profile.skills);
      const interestsMatch = calculateInterestsMatch(currentUserProfile.interests, profile.interests);
      const overallMatch = Math.round((skillsMatch + interestsMatch) / 2);
      
      // Check for existing incoming connection
      const { data: incomingConnection, error: checkError } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', id)
        .eq('matched_user_id', currentUserProfile.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // Create the connection
      const { error } = await supabase
        .from('matches')
        .insert([
          { 
            user_id: currentUserProfile.id,
            matched_user_id: id,
            match_score: overallMatch,
            skills_match_score: skillsMatch,
            interests_match_score: interestsMatch,
            status: incomingConnection ? 'mutual' : 'requested'
          }
        ]);
      
      if (error) throw error;
      
      if (incomingConnection) {
        // Update the incoming connection to mutual
        const { error: updateError } = await supabase
          .from('matches')
          .update({ status: 'mutual' })
          .eq('id', incomingConnection.id);
        
        if (updateError) {
          console.error("Error updating connection:", updateError);
        }
        
        setConnectionStatus('mutual');
        toast({
          title: "Connection Confirmed! 🎉",
          description: `You and ${profile.first_name} are now connected!`
        });
      } else {
        setConnectionStatus('requested');
        toast({
          title: "Connection Request Sent",
          description: `A connection request has been sent to ${profile.first_name}.`
        });
      }
      
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "There was an error creating this connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirmConnection = async () => {
    if (!currentUserProfile?.id || !id) {
      toast({
        title: "Error",
        description: "Could not confirm connection. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsPending(true);
      
      // Get the incoming connection request
      const { data: incomingRequest, error: fetchError } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', id)
        .eq('matched_user_id', currentUserProfile.id)
        .maybeSingle();
      
      if (fetchError || !incomingRequest) {
        throw new Error("Could not find the connection request");
      }
      
      // Calculate match scores
      const skillsMatch = calculateSkillsMatch(currentUserProfile.skills, profile.skills);
      const interestsMatch = calculateInterestsMatch(currentUserProfile.interests, profile.interests);
      const overallMatch = Math.round((skillsMatch + interestsMatch) / 2);
      
      // Update the incoming request to mutual
      const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'mutual' })
        .eq('id', incomingRequest.id);
      
      if (updateError) throw updateError;
      
      // Create outgoing connection as mutual
      const { error: createError } = await supabase
        .from('matches')
        .insert([
          { 
            user_id: currentUserProfile.id,
            matched_user_id: id,
            match_score: overallMatch,
            skills_match_score: skillsMatch,
            interests_match_score: interestsMatch,
            status: 'mutual'
          }
        ]);
      
      if (createError) throw createError;
      
      setConnectionStatus('mutual');
      toast({
        title: "Connection Confirmed! 🎉",
        description: `You and ${profile.first_name} are now connected!`
      });
      
    } catch (error) {
      console.error("Error confirming connection:", error);
      toast({
        title: "Confirmation Failed",
        description: "There was an error confirming this connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const handleDeclineConnection = async () => {
    if (!currentUserProfile?.id || !id) return;
    
    try {
      setIsPending(true);
      
      // Get the incoming request
      const { data: incomingRequest, error: fetchError } = await supabase
        .from('matches')
        .select('id')
        .eq('user_id', id)
        .eq('matched_user_id', currentUserProfile.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (incomingRequest) {
        // Delete the request
        const { error: deleteError } = await supabase
          .from('matches')
          .delete()
          .eq('id', incomingRequest.id);
        
        if (deleteError) throw deleteError;
      }
      
      setConnectionStatus(null);
      toast({
        title: "Request Declined",
        description: "You have declined this connection request."
      });
      
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const calculateSkillsMatch = (userSkills: string[], otherSkills: string[]): number => {
    if (!userSkills?.length || !otherSkills?.length) return 0;
    
    const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
    const otherSkillsSet = new Set(otherSkills.map(s => s.toLowerCase()));
    
    // Find intersection
    const intersection = new Set([...userSkillsSet].filter(x => otherSkillsSet.has(x)));
    
    // Calculate Jaccard similarity
    const union = new Set([...userSkillsSet, ...otherSkillsSet]);
    const similarity = intersection.size / union.size;
    
    return Math.round(similarity * 100);
  };
  
  const calculateInterestsMatch = (userInterests: string[], otherInterests: string[]): number => {
    if (!userInterests?.length || !otherInterests?.length) return 0;
    
    const userInterestsSet = new Set(userInterests.map(i => i.toLowerCase()));
    const otherInterestsSet = new Set(otherInterests.map(i => i.toLowerCase()));
    
    // Find intersection
    const intersection = new Set([...userInterestsSet].filter(x => otherInterestsSet.has(x)));
    
    // Calculate Jaccard similarity
    const union = new Set([...userInterestsSet, ...otherInterestsSet]);
    const similarity = intersection.size / union.size;
    
    return Math.round(similarity * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "This profile could not be loaded."}</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <img 
                  src={profile.avatar_url || "/placeholder.svg"} 
                  alt={`${profile.first_name} ${profile.last_name}`} 
                />
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold">{profile.first_name} {profile.last_name}</h1>
                <p className="text-lg text-muted-foreground">{profile.title}</p>
                <div className="flex items-center mt-2">
                  <div className="text-sm text-muted-foreground">{profile.location}</div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                {connectionStatus === 'mutual' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Handshake className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Connected</span>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => toast({
                        title: "Coming soon!",
                        description: "Messaging functionality will be available soon!"
                      })}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                ) : connectionStatus === 'requested' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <UserCheck className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-amber-600">Request Sent</span>
                    <FormFeedback 
                      type="neutral" 
                      message="Waiting for response" 
                    />
                  </div>
                ) : connectionStatus === 'incoming' ? (
                  <div className="space-y-3">
                    <div className="text-center mb-2">
                      <div className="bg-amber-100 p-3 rounded-full inline-block">
                        <UserCheck className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-sm font-medium mt-1">Pending Request</div>
                    </div>
                    <Button 
                      onClick={handleConfirmConnection}
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      ) : (
                        <>Accept</>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDeclineConnection}
                      disabled={isPending}
                      className="w-full"
                    >
                      Decline
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleConnect}
                    disabled={isPending}
                    className={isConnectionRequest ? "animate-pulse" : ""}
                  >
                    {isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    ) : (
                      <>Connect</>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {isConnectionRequest && connectionStatus !== 'mutual' && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-medium">Connection Request</h3>
                <p className="text-sm mt-1">
                  You've initiated a connection with {profile.first_name}. 
                  Click the Connect button to send an official connection request.
                </p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
          </div>
          
          <div className="p-6 border-t">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests listed</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
