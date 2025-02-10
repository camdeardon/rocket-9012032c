
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
  skills?: string[];
  lookingFor?: string[];
  interests?: string[];
  causes?: string[];
  hobbies?: string[];
  project?: {
    name: string;
    description: string;
  } | null;
}

interface ProfileSummaryProps {
  user: UserProfile;
}

export const ProfileSummary = ({ user }: ProfileSummaryProps) => {
  return (
    <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm">
      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20">
          <img src={user.avatar} alt={user.name} />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary mb-2">{user.name}</h1>
          {user.bio && <p className="text-secondary-foreground mb-4">{user.bio}</p>}
          <div className="space-y-4">
            {user.skills && user.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {user.lookingFor && user.lookingFor.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Looking for</h3>
                <div className="flex flex-wrap gap-2">
                  {user.lookingFor.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
