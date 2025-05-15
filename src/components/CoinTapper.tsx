
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
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num;
  };
  
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center">
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          {formatNumber(coins)} <span className="text-base text-yellow-200">PRAY</span>
        </div>
        <div className="text-sm text-blue-300 mt-1">
          Praybit Coin • PRAY
        </div>
        <div className="mt-2 px-3 py-1 bg-green-600/20 rounded-full text-xs text-green-400 font-medium border border-green-500/30">
          Exchange Ready
        </div>
      </div>
      
      <Button 
        className={`h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-amber-600/30 transition-all ${isAnimating ? 'scale-95' : 'scale-100'}`}
        size="lg"
        onClick={handleTap}
      >
        <Coins className="h-16 w-16 text-white drop-shadow-md" />
      </Button>
      
      <div className="flex flex-col items-center">
        <p className="text-center text-blue-200">
          Mine <span className="font-bold text-yellow-400">{coinsPerTap} PRAY</span> tokens
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-xs text-green-400">
            ERC-20 Standard Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoinTapper;
