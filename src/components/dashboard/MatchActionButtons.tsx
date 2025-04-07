
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Zap } from "lucide-react";

interface MatchActionButtonsProps {
  onLike: () => Promise<void>;
  onPass: () => void;
  onMessage: () => void;
}

export const MatchActionButtons = ({ onLike, onPass, onMessage }: MatchActionButtonsProps) => {
  const [isLiking, setIsLiking] = useState(false);
  
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Button
        size="lg"
        variant="outline"
        className="rounded-full p-4 hover:bg-destructive/10 hover:border-destructive transition-colors"
        onClick={onPass}
      >
        <X className="h-6 w-6" />
      </Button>
      <Button
        size="lg"
        className={`rounded-full p-4 bg-primary hover:bg-primary/90 transition-colors ${isLiking ? 'opacity-80' : 'animate-pulse'}`}
        onClick={handleLike}
        disabled={isLiking}
      >
        <Zap className="h-6 w-6" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="rounded-full p-4 hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
        onClick={onMessage}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};
