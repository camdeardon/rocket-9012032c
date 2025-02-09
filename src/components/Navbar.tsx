
import { Link } from "react-router-dom";
import { Home, MessageSquare, BriefcaseIcon, Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">SocialBridge</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<Home className="w-6 h-6" />} label="Home" />
            <NavLink to="/messages" icon={<MessageSquare className="w-6 h-6" />} label="Messages" />
            <NavLink to="/jobs" icon={<BriefcaseIcon className="w-6 h-6" />} label="Jobs" />
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
    className="flex flex-col items-center text-gray-500 hover:text-primary transition-colors duration-200"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Navbar;
