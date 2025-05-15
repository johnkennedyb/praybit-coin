
import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
}

const AppLayout = ({ children, showHeader = true, title = "Praybit Coin" }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-black text-white pb-16">
      {showHeader && (
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-indigo-900/80 border-b border-indigo-700/50 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 p-2 rounded-full shadow-lg shadow-yellow-600/20">
                <Coins className="h-6 w-6 text-indigo-900" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                {title}
              </h1>
            </Link>
          </div>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-4">
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 -left-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-32 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
