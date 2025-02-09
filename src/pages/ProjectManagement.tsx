
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, ListTodo, MessageSquare, Users, Briefcase, Lightbulb, Target } from "lucide-react";
import TeamMember from "@/components/project/TeamMember";

// Mock project data - in a real app this would come from your backend
const projectInfo = {
  name: "InvestEasy",
  vision: "Democratizing investment opportunities for everyone through accessible technology and education.",
  goal: "Build a platform that allows anyone to invest in fractional shares while learning about financial markets.",
  approach: [
    "Develop user-friendly mobile-first interface",
    "Create educational content partnerships",
    "Build secure trading infrastructure",
    "Launch beta with 1000 users by Q2"
  ]
};

// Mock team data - in a real app this would come from your backend
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg",
    role: "Project Lead",
    bio: "Building a fintech startup focused on democratizing access to investment opportunities.",
    skills: ["React", "Node.js", "Product Management"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    role: "UX Designer",
    bio: "UX designer with 5 years of experience in fintech",
    skills: ["UI/UX Design", "User Research", "Figma"],
  },
  {
    id: 3,
    name: "Michael Park",
    avatar: "/placeholder.svg",
    role: "Backend Developer",
    bio: "Full-stack developer passionate about AI",
    skills: ["React", "Node.js", "Machine Learning"],
  },
];

const ProjectManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{projectInfo.name}</h1>
        <Button className="hover-lift">
          <Briefcase className="mr-2" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Project Vision Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Project Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center font-medium text-muted-foreground mb-6">
                  {projectInfo.vision}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Target className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-semibold mb-2">Our Goal</h4>
                        <p className="text-muted-foreground">{projectInfo.goal}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How We'll Get There</h4>
                    <ul className="space-y-2">
                      {projectInfo.approach.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">4 due this week</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Upcoming Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Next: Strategy Review</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Full team assembled</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">New comment on "MVP Features"</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <ListTodo className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Task completed: "Setup Repository"</p>
                      <p className="text-sm text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Task management view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Full calendar view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagement;

