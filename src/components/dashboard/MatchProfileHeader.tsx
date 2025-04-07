
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MatchProfileHeaderProps {
  name: string;
  avatar: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
}

export const MatchProfileHeader = ({
  name,
  avatar,
  location,
  bio,
  skills,
  interests
}: MatchProfileHeaderProps) => {
  return (
    <>
      <div className="text-center">
        <Avatar className="h-32 w-32 mx-auto mb-4 ring-2 ring-primary/20 shadow-md">
          <img src={avatar} alt={name} className="object-cover" />
        </Avatar>
        <h2 className="text-2xl font-bold text-primary">{name}</h2>
        <p className="text-secondary-foreground flex items-center justify-center gap-1">
          {location || "No location specified"}
        </p>
      </div>
      
      <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg">
        <p className="text-secondary-foreground italic">{bio || "No bio available"}</p>
        <div>
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills && skills.length > 0 ? (
              <>
                {skills.slice(0, 5).map(skill => (
                  <Badge key={skill} variant="secondary" className="animate-fade-in">{skill}</Badge>
                ))}
                {skills.length > 5 && (
                  <Badge variant="outline">+{skills.length - 5} more</Badge>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No skills listed</span>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-primary/70">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests && interests.length > 0 ? (
              <>
                {interests.slice(0, 5).map(interest => (
                  <Badge key={interest} variant="outline" className="animate-fade-in">{interest}</Badge>
                ))}
                {interests.length > 5 && (
                  <Badge variant="outline">+{interests.length - 5} more</Badge>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No interests listed</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
