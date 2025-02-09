
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Rocket, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-secondary">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
              Find Your Perfect Co-Founder Match
            </h1>
            <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
              Using machine learning to connect ambitious founders with skilled professionals 
              who share their vision, interests, and drive for success.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/signup")}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
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

        {/* Mission Statement */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-secondary-foreground/80">
              At Rocket, we understand that finding those early team members is vital to building a successful team. 
              We use machine learning to not only find people with the skills you need but also match you 
              to people with similar interests and experiences. We believe by creating the right matches we can 
              kickstart success through empowered collaboration.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community of ambitious founders and skilled professionals today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/signup")}
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
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
  <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm hover-lift">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
    <p className="text-secondary-foreground/80">{description}</p>
  </div>
);

export default Index;

