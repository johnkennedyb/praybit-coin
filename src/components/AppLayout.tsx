
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white pb-16">
      {showHeader && (
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-blue-900/80 border-b border-blue-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 p-2 rounded-full shadow-lg">
                <Coins className="h-6 w-6 text-blue-900" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </Link>
          </div>
        </header>
      )}
      
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
