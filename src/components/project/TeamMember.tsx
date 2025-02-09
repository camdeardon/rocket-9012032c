
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface TeamMemberProps {
  member: {
    id: number;
    name: string;
    avatar: string;
    role: string;
    location: string;
    bio: string;
    experience: string;
    hobbies: string[];
    passions: string[];
    skills: string[];
  };
}

const TeamMember = ({ member }: TeamMemberProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <img src={member.avatar} alt={member.name} />
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{member.role}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {member.location}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground mb-2">{member.bio}</p>
          <p className="text-sm text-muted-foreground">{member.experience}</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.skills.map((skill) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-1">Passions</h4>
            <div className="flex flex-wrap gap-1">
              {member.passions.map((passion) => (
                <span key={passion} className="text-sm text-muted-foreground">
                  {passion}{passion !== member.passions[member.passions.length - 1] ? " • " : ""}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-1">Hobbies</h4>
            <div className="flex flex-wrap gap-1">
              {member.hobbies.map((hobby) => (
                <span key={hobby} className="text-sm text-muted-foreground">
                  {hobby}{hobby !== member.hobbies[member.hobbies.length - 1] ? " • " : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
