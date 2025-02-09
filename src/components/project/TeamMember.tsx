
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TeamMemberProps {
  member: {
    id: number;
    name: string;
    avatar: string;
    role: string;
    skills: string[];
    bio: string;
  };
}

const TeamMember = ({ member }: TeamMemberProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <img src={member.avatar} alt={member.name} />
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <Badge variant="secondary">{member.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{member.bio}</p>
        <div className="flex flex-wrap gap-2">
          {member.skills.map((skill) => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
