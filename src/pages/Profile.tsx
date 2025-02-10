import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Briefcase, FileText, Heart, Image, MapPin, User, X, Plus, Save, Edit2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  location: string | null;
  avatar_url: string | null;
  bio: string | null;
  background: string | null;
}

interface UserSkill {
  id: string;
  skill: {
    name: string;
    category: string;
  };
  proficiency_level: string;
  years_experience: number;
}

interface UserInterest {
  id: string;
  interest: {
    name: string;
    category: string;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    first_name: "",
    last_name: "",
    title: "",
    location: "",
    bio: "",
    background: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user skills with skill details
        const { data: skills, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            id,
            proficiency_level,
            years_experience,
            skill:skills (
              name,
              category
            )
          `)
          .eq('user_id', user.id);

        if (skillsError) throw skillsError;

        // Fetch user interests with interest details
        const { data: interests, error: interestsError } = await supabase
          .from('user_interests')
          .select(`
            id,
            interest:interests (
              name,
              category
            )
          `)
          .eq('user_id', user.id);

        if (interestsError) throw interestsError;

        setProfileData(profile);
        setUserSkills(skills || []);
        setUserInterests(interests || []);
        setEditedValues({
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          title: profile?.title || "",
          location: profile?.location || "",
          bio: profile?.bio || "",
          background: profile?.background || "",
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, toast]);

  const handleSave = async (section: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: any = {};
      switch (section) {
        case 'header':
          updates.first_name = editedValues.first_name;
          updates.last_name = editedValues.last_name;
          updates.title = editedValues.title;
          updates.location = editedValues.location;
          updates.bio = editedValues.bio;
          break;
        case 'background':
          updates.background = editedValues.background;
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => prev ? { ...prev, ...updates } : null);
      setEditMode(null);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('authToken');
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary/20 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-6">
              <Avatar className="h-32 w-32">
                <img 
                  src={profileData?.avatar_url || "/placeholder.svg"} 
                  alt={`${profileData?.first_name} ${profileData?.last_name}`} 
                  className="object-cover" 
                />
              </Avatar>
              <div className="flex-1">
                {editMode === 'header' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input
                          value={editedValues.first_name}
                          onChange={(e) => setEditedValues(prev => ({
                            ...prev,
                            first_name: e.target.value
                          }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          value={editedValues.last_name}
                          onChange={(e) => setEditedValues(prev => ({
                            ...prev,
                            last_name: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={editedValues.title}
                        onChange={(e) => setEditedValues(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={editedValues.location}
                        onChange={(e) => setEditedValues(prev => ({
                          ...prev,
                          location: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={editedValues.bio}
                        onChange={(e) => setEditedValues(prev => ({
                          ...prev,
                          bio: e.target.value
                        }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave('header')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold text-primary">
                          {profileData?.first_name} {profileData?.last_name}
                        </h1>
                        <p className="text-xl text-secondary-foreground">{profileData?.title}</p>
                        {profileData?.location && (
                          <div className="flex items-center gap-2 mt-2 text-secondary-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{profileData.location}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditMode('header')}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {profileData?.bio && (
                      <p className="mt-4 text-secondary-foreground">{profileData.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Background</h2>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditMode('background')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              {editMode === 'background' ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedValues.background}
                    onChange={(e) => setEditedValues(prev => ({
                      ...prev,
                      background: e.target.value
                    }))}
                    className="min-h-[150px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave('background')}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-secondary-foreground">{profileData?.background}</p>
              )}
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((userSkill) => (
                  <Badge key={userSkill.id} variant="secondary" className="flex items-center gap-2">
                    {userSkill.skill.name}
                    <button className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Interests</h2>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Interest
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {userInterests.map((userInterest) => (
                  <Badge key={userInterest.id} variant="outline" className="flex items-center gap-2">
                    {userInterest.interest.name}
                    <button className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
