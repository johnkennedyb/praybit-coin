
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift, Award, TrendingUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import CoinScene from "@/components/CoinScene";
import { useWeb3 } from "@/contexts/Web3Context";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const Earn = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  const { account, praybitBalance } = useWeb3();
  
  const [tapsCount, setTapsCount] = useState(() => {
    const saved = localStorage.getItem("praybitTaps");
    return saved ? parseInt(saved) : 0;
  });
  
  const earnCoins = async () => {
    setIsAnimating(true);
    setTapsCount(prev => prev + 1);
    localStorage.setItem("praybitTaps", (tapsCount + 1).toString());
    
    // If connected to wallet, we could mint tokens here
    if (account) {
      // In a real app, we would call a smart contract function to mint tokens
      toast({
        title: "Mining PRAY",
        description: "You tapped and earned 1 PRAY token!",
      });
    } else {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to earn real PRAY tokens",
      });
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const claimDailyReward = () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to claim rewards",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would call a smart contract function to claim rewards
    toast({
      title: "Daily Reward Claimed!",
      description: "You earned 5 PRAY coins",
    });
  };
  
  const tasks = [
    { name: "Daily Login", reward: 5, action: claimDailyReward, icon: <Gift className="h-5 w-5 text-purple-400" /> },
    { name: "Share on Twitter", reward: 10, action: () => toast({ title: "Coming Soon", description: "This feature will be available soon!" }), icon: <TrendingUp className="h-5 w-5 text-blue-400" /> },
    { name: "Complete Profile", reward: 20, action: () => toast({ title: "Coming Soon", description: "This feature will be available soon!" }), icon: <Award className="h-5 w-5 text-yellow-400" /> },
  ];

  return (
    <AppLayout title="Earn PRAY">
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            {account ? praybitBalance : "0"} <span className="text-lg">PRAY</span>
          </div>
          <p className="text-blue-200 text-sm mt-1">Total Taps: {tapsCount}</p>
          
          {!account && (
            <div className="mt-4">
              <ConnectWalletButton 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
              />
            </div>
          )}
        </div>
        
        <Card className="bg-indigo-800/40 border-indigo-700/60 backdrop-blur-md shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Tap to Earn
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-4">
            <CoinScene isAnimating={isAnimating} onTap={earnCoins} />
            <p className="text-sm text-blue-200 mt-4">Tap the coin to earn PRAY</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-800/40 border-indigo-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Complete Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between bg-indigo-900/50 rounded-lg p-3 border border-indigo-700/60 transition hover:bg-indigo-800/50">
                  <div className="flex items-center gap-3">
                    {task.icon}
                    <span>{task.name}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-indigo-900"
                    onClick={task.action}
                  >
                    +{task.reward} PRAY
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Earn;
