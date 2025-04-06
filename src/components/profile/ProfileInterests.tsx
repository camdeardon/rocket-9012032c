
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Interest {
  id: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tempInterests, setTempInterests] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // If user types a comma, add the interest
    if (e.target.value.includes(",")) {
      const interests = e.target.value.split(",");
      const lastInterest = interests.pop() || "";
      
      // Add all complete interests except the last one (which might be incomplete)
      interests.forEach(interest => {
        const trimmedInterest = interest.trim();
        if (trimmedInterest && !tempInterests.includes(trimmedInterest)) {
          setTempInterests(prev => [...prev, trimmedInterest]);
        }
      });
      
      // Set the input to the last part after the comma
      setInputValue(lastInterest);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add interest on Enter key
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedInterest = inputValue.trim();
      if (!tempInterests.includes(trimmedInterest)) {
        setTempInterests(prev => [...prev, trimmedInterest]);
        setInputValue("");
      }
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setTempInterests(tempInterests.filter(interest => interest !== interestToRemove));
  };

  const handleAddInterests = async () => {
    // Add any remaining interest in the input
    const finalInterests = [...tempInterests];
    if (inputValue.trim() && !finalInterests.includes(inputValue.trim())) {
      finalInterests.push(inputValue.trim());
    }

    if (finalInterests.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one interest",
        variant: "destructive",
      });
      return;
    }

    // Add each interest one by one
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      for (const interestName of finalInterests) {
        const trimmedInterest = interestName.trim();
        if (!trimmedInterest) continue;

        // First, check if the interest already exists
        let { data: existingInterest, error: searchError } = await supabase
          .from('interests')
          .select('id')
          .ilike('name', trimmedInterest)
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          console.error('Error searching for interest:', searchError);
        }

        let interestId;
        
        if (!existingInterest) {
          // Create new interest if it doesn't exist
          const { data: newInterestData, error: interestError } = await supabase
            .from('interests')
            .insert([{ name: trimmedInterest }])
            .select('id')
            .single();

          if (interestError) throw interestError;
          interestId = newInterestData.id;
        } else {
          interestId = existingInterest.id;
        }

        // Check if user already has this interest
        const { data: existingUserInterest } = await supabase
          .from('user_interests')
          .select('id')
          .eq('user_id', user.id)
          .eq('interest_id', interestId)
          .single();

        if (existingUserInterest) {
          console.log(`Interest '${trimmedInterest}' already exists for user`);
          continue;
        }

        // Add user_interest association
        const { error: userInterestError } = await supabase
          .from('user_interests')
          .insert([{
            user_id: user.id,
            interest_id: interestId,
          }]);

        if (userInterestError) throw userInterestError;
      }

      toast({
        title: "Success",
        description: `Added ${finalInterests.length} interest(s)`,
      });
      
      // Clear temporary interests and input
      setTempInterests([]);
      setInputValue("");
      
      // Refresh the page to show new interests
      window.location.reload();
    } catch (error) {
      console.error('Error adding interests:', error);
      toast({
        title: "Error",
        description: "Failed to add all interests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveInterest = async (userInterestId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('id', userInterestId);

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
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter interests separated by commas"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAddInterests} disabled={isLoading && tempInterests.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Type industry interests and press Enter or comma (,) to add multiple interests
          </p>
        </div>
        
        {tempInterests.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Interests to add:</p>
            <div className="flex flex-wrap gap-2">
              {tempInterests.map((interest, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2">
                  {interest}
                  <button 
                    className="hover:text-destructive"
                    onClick={() => removeInterest(interest)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">Your interests:</p>
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
    </div>
  );
};

export default ProfileInterests;
