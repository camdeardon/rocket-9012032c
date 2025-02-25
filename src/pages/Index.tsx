import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Rocket, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <img 
                src="/lovable-uploads/93a57052-fc29-4425-9b65-2a5b0d987b96.png" 
                alt="Rocket Logo" 
                className="h-20 w-auto"
              />
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost"
                onClick={() => navigate("/auth?mode=signin")}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/35a51d87-fe5a-4e06-9a5a-ae308d831a6f.png" 
                alt="Rocket Logo" 
                className="h-24 w-auto animate-fade-in"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
              Build Your Dream Team
            </h1>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Whether you're a startup founder, creative entrepreneur, or established business, 
              Rocket connects you with the perfect team members who share your vision. We match 
              skills, experience, and interests to help turn your ideas into reality through 
              meaningful collaboration and future funding opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => navigate("/auth")}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Why Choose Rocket?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Brain className="h-8 w-8" />}
                title="AI-Powered Matching"
                description="Our advanced algorithms analyze skills, experience, and personality traits to find your ideal co-founder match."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8" />}
                title="Like-Minded Partners"
                description="Connect with professionals who share your interests, values, and vision for success."
              />
              <FeatureCard 
                icon={<Rocket className="h-8 w-8" />}
                title="Launch Together"
                description="From idea to execution, find the perfect partner to help bring your vision to life."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StepCard 
                number="1"
                title="Create Profile"
                description="Sign up and tell us about your skills, experience, and vision."
              />
              <StepCard 
                number="2"
                title="Get Matched"
                description="Our AI algorithm finds potential co-founders based on compatibility."
              />
              <StepCard 
                number="3"
                title="Connect"
                description="Review matches and connect with potential partners."
              />
              <StepCard 
                number="4"
                title="Collaborate"
                description="Start working together to bring your ideas to life."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community of ambitious founders and skilled professionals today.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/lovable-uploads/93a57052-fc29-4425-9b65-2a5b0d987b96.png" 
                alt="Rocket Logo" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-secondary-foreground">
                Connecting ambitious founders with their perfect co-founder match.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>Features</li>
                <li>How it Works</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-secondary-foreground flex flex-col items-center justify-center gap-2">
            <div>© {new Date().getFullYear()} Rocket. All rights reserved.</div>
            <div className="flex items-center gap-2">
              Made in Toronto 🇨🇦 className="h-5 w-auto"
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
    <p className="text-secondary-foreground">{description}</p>
  </div>
);

const StepCard = ({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string;
}) => (
  <div className="relative p-6 rounded-lg bg-white shadow-lg">
    <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-primary mb-2 mt-2">{title}</h3>
    <p className="text-secondary-foreground">{description}</p>
  </div>
);

export default Index;
