
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Interest {
  id: string; // Updated from number to string
  interest: {
    name: string;
    category: string;
  };
}

interface ProfileInterestsProps {
  userInterests: Interest[];
}

const ProfileInterests = ({ userInterests }: ProfileInterestsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddInterest = async () => {
    if (!newInterest.trim()) {
      toast({
        title: "Error",
        description: "Please enter an interest",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // First, check if the interest already exists
      let { data: existingInterest } = await supabase
        .from('interests')
        .select('id')
        .eq('name', newInterest.trim())
        .single();

      let interestId;
      
      if (!existingInterest) {
        // Create new interest if it doesn't exist
        const { data: newInterestData, error: interestError } = await supabase
          .from('interests')
          .insert([{ name: newInterest.trim() }])
          .select('id')
          .single();

        if (interestError) throw interestError;
        interestId = newInterestData.id;
      } else {
        interestId = existingInterest.id;
      }

      // Add user_interest association
      const { error: userInterestError } = await supabase
        .from('user_interests')
        .insert([{
          user_id: user.id,
          interest_id: interestId,
        }]);

      if (userInterestError) throw userInterestError;

      toast({
        title: "Success",
        description: "Interest added successfully",
      });
      
      setIsOpen(false);
      setNewInterest("");
      
      // Refresh the page to show new interest
      window.location.reload();
    } catch (error) {
      console.error('Error adding interest:', error);
      toast({
        title: "Error",
        description: "Failed to add interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveInterest = async (interestId: string) => { // Updated from number to string
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('user_interests')
        .delete()
        .eq('id', interestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Interest removed successfully",
      });
      
      // Refresh the page to show updated interests
      window.location.reload();
    } catch (error) {
      console.error('Error removing interest:', error);
      toast({
        title: "Error",
        description: "Failed to remove interest. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Interests</h2>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Interest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Interest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="interest">Interest Name</Label>
                <Input
                  id="interest"
                  placeholder="Enter interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleAddInterest}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Adding..." : "Add Interest"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2">
        {userInterests.map((userInterest) => (
          <Badge key={userInterest.id} variant="outline" className="flex items-center gap-2">
            {userInterest.interest.name}
            <button 
              className="hover:text-destructive"
              onClick={() => handleRemoveInterest(userInterest.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfileInterests;
