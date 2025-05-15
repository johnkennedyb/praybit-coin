
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
      <div className="text-4xl md:text-6xl font-bold text-yellow-400">
        {coins} <span className="text-base text-yellow-200">PRAY</span>
      </div>
      
      <Button 
        className={`h-32 w-32 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-all ${isAnimating ? 'scale-95' : 'scale-100'}`}
        size="lg"
        onClick={handleTap}
      >
        <Coins className="h-16 w-16 text-white" />
      </Button>
      
      <p className="text-center text-blue-200">
        Tap to earn <span className="font-bold text-yellow-400">{coinsPerTap}</span> PRAY coins
      </p>
    </div>
  );
};

export default CoinTapper;
