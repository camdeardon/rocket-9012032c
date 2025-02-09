
import { Link } from "react-router-dom";
import { Home, MessageSquare, Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/93a57052-fc29-4425-9b65-2a5b0d987b96.png" 
                alt="Rocket Logo" 
                className="h-16 w-auto" // Increased from h-12 to h-16
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Home className="w-6 h-6" />} label="Home" />
            <NavLink to="/messages" icon={<MessageSquare className="w-6 h-6" />} label="Messages" />
            <NavLink to="/notifications" icon={<Bell className="w-6 h-6" />} label="Notifications" />
            <NavLink to="/profile" icon={<UserCircle className="w-6 h-6" />} label="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-secondary-foreground hover:text-primary transition-colors duration-200"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Navbar;
