
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CoinTapperProps {
  onTap: () => void;
  coins: number;
  coinsPerTap: number;
  isSyncing?: boolean;
}

const CoinTapper = ({ onTap, coins, coinsPerTap, isSyncing = false }: CoinTapperProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showSyncBadge, setShowSyncBadge] = useState(false);
  
  useEffect(() => {
    if (isSyncing) {
      setShowSyncBadge(true);
      const timeout = setTimeout(() => setShowSyncBadge(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSyncing]);
  
  const handleTap = () => {
    setIsAnimating(true);
    setShowParticles(true);
    onTap();
    setTimeout(() => setIsAnimating(false), 300);
    setTimeout(() => setShowParticles(false), 1000);
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
    <div className="flex flex-col items-center justify-center w-full gap-6 py-8">
      <div className="flex flex-col items-center">
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent animate-pulse">
          {formatNumber(coins)} <span className="text-base text-yellow-200">PRAY</span>
        </div>
        <div className="text-sm text-indigo-300 mt-1">
          Praybit Coin • PRAY
        </div>
        <div className="mt-2 px-3 py-1 bg-indigo-600/30 rounded-full text-xs text-indigo-400 font-medium border border-indigo-500/30 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span>ERC-20 Token</span>
          {showSyncBadge && (
            <Badge variant="outline" className="ml-2 bg-green-600/20 text-green-400 text-xs border-green-500/20 flex items-center gap-1 px-1.5 animate-pulse">
              <Check className="h-2.5 w-2.5" /> Synced
            </Badge>
          )}
        </div>
      </div>
      
      <div className="relative flex justify-center w-full">
        <Button 
          className={`h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500 shadow-lg shadow-amber-600/30 transition-all ${isAnimating ? 'scale-95' : 'scale-100'}`}
          size="lg"
          onClick={handleTap}
        >
          <div className="relative">
            <Coins className="h-16 w-16 text-white drop-shadow-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-amber-800">P</span>
            </div>
          </div>
        </Button>
        
        {/* Particle effects */}
        {showParticles && (
          <>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-yellow-400 w-2 h-2 opacity-0"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
                  animation: `fadeOutUp 1s ease-out ${i * 0.1}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-center text-indigo-200">
          Mine <span className="font-bold text-yellow-400">{coinsPerTap} PRAY</span> tokens
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <p className="text-xs text-indigo-400">
            ERC-20 Standard Compliant
          </p>
        </div>
        
        {coinsPerTap > 1 && (
          <div className="mt-3 px-4 py-1.5 bg-indigo-900/50 rounded-lg border border-indigo-700/60 hover:bg-indigo-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <p className="text-xs text-indigo-200">
                Mining power: <span className="font-medium text-yellow-400">{coinsPerTap}x</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinTapper;
