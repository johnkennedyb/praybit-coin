
import { Link, useLocation } from 'react-router-dom';
import { Home, CircleDollarSign, User, Info, Settings, Shield } from 'lucide-react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useSupabase();
  const currentPath = location.pathname;
  
  // Check if user is admin (in a real app, this would check admin status)
  // For demo purposes, any logged-in user is considered an admin
  const isAdmin = !!user;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-950 to-blue-900/95 border-t border-blue-700/50 backdrop-blur-lg z-50">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-around">
        <NavItem to="/" icon={<Home />} label="Home" isActive={currentPath === '/'} />
        
        <NavItem to="/earn" icon={<CircleDollarSign />} label="Earn" isActive={currentPath === '/earn'} />
        
        <NavItem to="/profile" icon={<User />} label="Profile" isActive={currentPath === '/profile'} />
        
        <NavItem to="/about" icon={<Info />} label="About" isActive={currentPath === '/about'} />

        {isAdmin && (
          <NavItem to="/admin" icon={<Shield />} label="Admin" isActive={currentPath === '/admin'} />
        )}
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
  <Link 
    to={to}
    className={cn(
      "flex flex-col items-center justify-center px-2 py-1 rounded-md",
      isActive 
        ? "text-yellow-400" 
        : "text-blue-300 hover:text-blue-100"
    )}
  >
    <div className={cn(
      "p-1.5",
      isActive && "bg-blue-800/40 rounded-md border border-blue-700/50"
    )}>
      {icon}
    </div>
    <span className="text-xs mt-0.5">{label}</span>
  </Link>
);

export default BottomNavigation;
