
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { FormFeedback } from "../ui/form-feedback";

interface MatchActionButtonsProps {
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
  matchId?: string; // Add match ID prop
  matchName?: string; // Add match name for feedback
}

export const MatchActionButtons = ({ 
  onLike, 
  onPass, 
  onMessage, 
  matchId,
  matchName = "this person"
}: MatchActionButtonsProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    if (!matchId) {
      toast({
        title: "Error",
        description: "Could not find profile information for this match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Viewing Profile",
      description: `You'll be redirected to ${matchName}'s profile to confirm the connection.`,
    });
    
    // Store the connection request in local storage
    try {
      const pendingConnections = JSON.parse(localStorage.getItem('pendingConnections') || '{}');
      pendingConnections[matchId] = {
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem('pendingConnections', JSON.stringify(pendingConnections));
    } catch (error) {
      console.error("Error saving pending connection:", error);
    }
    
    // Navigate to a profile view page with the match ID
    navigate(`/profile/${matchId}?connectionRequest=true`);
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      setFeedback(`Sending connection request to ${matchName}...`);
      await onLike();
      setFeedback(`Connection request sent to ${matchName}!`);
      
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
      
    } catch (error: any) {
      console.error("Error creating match:", error);
      setFeedback(null);
      toast({
        title: "Failed to save match",
        description: error.message || "There was an error connecting with this person. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full p-4 hover:bg-coral/10 hover:border-coral transition-colors"
          onClick={onPass}
        >
          <X className="h-6 w-6 text-coral" />
        </Button>
        <Button
          size="lg"
          className={`rounded-full p-4 bg-coral hover:bg-coral/90 transition-colors ${isLiking ? 'opacity-80' : ''}`}
          onClick={matchId ? handleViewProfile : handleLike}
          disabled={isLiking}
        >
          <Zap className={`h-6 w-6 text-white ${isLiking ? '' : 'animate-pulse'}`} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full p-4 hover:bg-accent/10 hover:border-accent transition-colors"
          onClick={onMessage}
        >
          <MessageCircle className="h-6 w-6 text-accent" />
        </Button>
      </div>
      
      {feedback && (
        <FormFeedback
          type="success"
          message={feedback}
          className="text-center"
        />
      )}
    </div>
  );
};
