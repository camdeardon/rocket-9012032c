
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Plus, X } from "lucide-react";

interface UserInterest {
  id: string;
  interest: {
    name: string;
    category: string;
  };
}

interface ProfileInterestsProps {
  interests: UserInterest[];
  onRemoveInterest?: (interestId: string) => void;
}

export const ProfileInterests = ({ interests, onRemoveInterest }: ProfileInterestsProps) => {
  return (
    <div>
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
        {interests.map((userInterest) => (
          <Badge key={userInterest.id} variant="outline" className="flex items-center gap-2">
            {userInterest.interest.name}
            <button 
              className="hover:text-destructive"
              onClick={() => onRemoveInterest?.(userInterest.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
