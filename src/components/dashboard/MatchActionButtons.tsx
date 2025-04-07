
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MatchActionButtonsProps {
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
}

export const MatchActionButtons = ({ onLike, onPass, onMessage }: MatchActionButtonsProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();
  
  const handleLike = async () => {
    try {
      setIsLiking(true);
      await onLike();
    } catch (error: any) {
      console.error("Error creating match:", error);
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
        onClick={handleLike}
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
  );
};
