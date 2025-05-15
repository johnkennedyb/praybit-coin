
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface CoinTapperProps {
  onTap: () => void;
  coins: number;
  coinsPerTap: number;
}

const CoinTapper = ({ onTap, coins, coinsPerTap }: CoinTapperProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleTap = () => {
    setIsAnimating(true);
    onTap();
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
        {coins} <span className="text-base text-yellow-200">P</span>
      </div>
      
      <Button 
        className={`h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-amber-600/30 transition-all ${isAnimating ? 'scale-95' : 'scale-100'}`}
        size="lg"
        onClick={handleTap}
      >
        <Coins className="h-16 w-16 text-white drop-shadow-md" />
      </Button>
      
      <p className="text-center text-blue-200">
        Tap to earn <span className="font-bold text-yellow-400">{coinsPerTap}</span> P coins
      </p>
    </div>
  );
};

export default CoinTapper;
