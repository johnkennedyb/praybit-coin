
import { Link, useLocation } from "react-router-dom";
import { Coins, Home, User, BarChart2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home /> },
    { path: "/earn", label: "Earn", icon: <Coins /> },
    { path: "/stats", label: "Stats", icon: <BarChart2 /> },
    { path: "/telegram", label: "Telegram", icon: <MessageCircle /> },
    { path: "/profile", label: "Profile", icon: <User /> },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-blue-900/90 backdrop-blur-lg border-t border-blue-700 flex items-center justify-around z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center px-3 py-1 text-xs transition-colors",
            isActive(item.path)
              ? "text-yellow-400"
              : "text-blue-200 hover:text-white"
          )}
        >
          <div className="h-6 w-6 mb-1">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
