
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-3">
            <ProfileCard />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            <NewPost />
            <FeedPosts />
          </div>

          {/* Network Section */}
          <div className="lg:col-span-3">
            <NetworkSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileCard = () => (
  <Card className="p-6 animate-fade-up">
    <div className="relative">
      <div className="h-24 bg-gradient-to-r from-primary to-accent rounded-t-lg" />
      <div className="absolute -bottom-12 left-6">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200" />
      </div>
    </div>
    <div className="mt-14 space-y-4">
      <h2 className="text-xl font-semibold">John Doe</h2>
      <p className="text-sm text-gray-600">Senior Software Engineer at Tech Corp</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">React</Badge>
        <Badge variant="secondary">TypeScript</Badge>
        <Badge variant="secondary">Node.js</Badge>
      </div>
    </div>
  </Card>
);

const NewPost = () => (
  <Card className="p-4 animate-fade-up">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <input
        type="text"
        placeholder="Share your thoughts..."
        className="flex-1 rounded-full bg-secondary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  </Card>
);

const FeedPosts = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((post) => (
      <Card key={post} className="p-6 animate-fade-up">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div>
            <h3 className="font-semibold">Jane Smith</h3>
            <p className="text-sm text-gray-500">Product Designer • 2h ago</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          Just finished an amazing project with the team! Excited to share more details soon.
        </p>
        <div className="flex items-center space-x-6 text-gray-500">
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <ThumbsUp className="w-5 h-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </Card>
    ))}
  </div>
);

const NetworkSuggestions = () => (
  <Card className="p-6 animate-fade-up">
    <h3 className="font-semibold mb-4">People You May Know</h3>
    <div className="space-y-4">
      {[1, 2, 3].map((suggestion) => (
        <div key={suggestion} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1">
            <h4 className="font-medium">Alex Johnson</h4>
            <p className="text-sm text-gray-500">Frontend Developer</p>
          </div>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Connect
          </button>
        </div>
      ))}
    </div>
  </Card>
);

export default Index;
