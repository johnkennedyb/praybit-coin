
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift, Award, TrendingUp, Rocket } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import CoinScene from "@/components/CoinScene";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSupabase } from "@/contexts/SupabaseContext";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { usePrayData } from "@/hooks/use-pray-data";
import { supabase } from "@/lib/supabase";

const Earn = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  const { account, praybitBalance } = useWeb3();
  const { user } = useSupabase();
  const { data, incrementTaps, claimDailyReward } = usePrayData();
  
  // Mining power increases with number of taps
  const [miningPower, setMiningPower] = useState(1);
  
  // Calculate mining power based on taps
  useEffect(() => {
    const power = Math.floor(1 + (data.tapsCount / 100));
    setMiningPower(power);
  }, [data.tapsCount]);

  // Track taps in Supabase if user is logged in
  useEffect(() => {
    if (user && data.tapsCount > 0) {
      const syncTaps = async () => {
        try {
          const { error } = await supabase
            .from('user_stats')
            .upsert(
              { 
                user_id: user.id, 
                taps_count: data.tapsCount,
                coins: data.coins,
                mining_power: miningPower
              },
              { onConflict: 'user_id' }
            );
            
          if (error) throw error;
        } catch (error) {
          console.error("Error syncing taps:", error);
        }
      };
      
      syncTaps();
    }
  }, [user, data.tapsCount, data.coins, miningPower]);
  
  const earnCoins = async () => {
    setIsAnimating(true);
    
    // Always increment local taps counter
    incrementTaps();
    
    // If connected to wallet, we could mint tokens here
    if (account) {
      // In a real app, we would call a smart contract function to mint tokens
      toast({
        title: "Mining PRAY",
        description: `You tapped and earned ${miningPower} PRAY token${miningPower > 1 ? 's' : ''}!`,
      });
    } else {
      toast({
        title: "Wallet Not Connected",
        description: user ? "Connect your wallet to earn real PRAY tokens" : "Sign up and connect your wallet to earn real PRAY tokens",
      });
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const handleDailyReward = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Sign up or login to claim rewards",
        variant: "destructive"
      });
      return;
    }
    
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to claim rewards",
        variant: "destructive"
      });
      return;
    }
    
    const claimed = claimDailyReward();
    
    if (claimed) {
      toast({
        title: "Daily Reward Claimed!",
        description: "You earned 5 PRAY coins",
      });
    } else {
      toast({
        title: "Already Claimed",
        description: "You've already claimed your daily reward today",
        variant: "destructive"
      });
    }
  };
  
  const tasks = [
    { name: "Daily Login", reward: 5, action: handleDailyReward, icon: <Gift className="h-5 w-5 text-purple-400" /> },
    { name: "Share on Twitter", reward: 10, action: () => toast({ title: "Coming Soon", description: "This feature will be available soon!" }), icon: <TrendingUp className="h-5 w-5 text-blue-400" /> },
    { name: "Complete Profile", reward: 20, action: () => toast({ title: "Coming Soon", description: "This feature will be available soon!" }), icon: <Award className="h-5 w-5 text-yellow-400" /> },
  ];

  return (
    <AppLayout title="Earn PRAY">
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-br from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            {account ? praybitBalance : data.coins.toFixed(2)} <span className="text-lg">PRAY</span>
          </div>
          <p className="text-blue-200 text-sm mt-1">Total Taps: {data.tapsCount}</p>
          
          {!user && (
            <Button 
              className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
              onClick={() => window.location.href = '/profile'}
            >
              Sign Up to Earn
            </Button>
          )}
          
          {user && !account && (
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
              Tap to Mine PRAY
            </CardTitle>
            <p className="text-sm text-blue-200">Your mining power: {miningPower} PRAY per tap</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-4">
            <CoinScene isAnimating={isAnimating} onTap={earnCoins} />
            <div className="flex flex-col items-center mt-4">
              <p className="text-sm text-blue-200">Tap the coin to mine PRAY tokens</p>
              <div className="mt-2 text-xs text-green-300">
                Mining power increases with every 100 taps
              </div>
            </div>
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
        
        <Card className="bg-indigo-800/40 border-indigo-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              <Rocket className="h-5 w-5 text-blue-400" />
              Getting Listed on Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-blue-200">
              Praybit (PRAY) is an ERC-20 standard token which makes it compatible with most cryptocurrency exchanges. Here's how to get it listed:
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-300">1. Deploy Your Token</h4>
              <p className="text-xs text-blue-300">The smart contract for PRAY tokens is ready. You would need to deploy this contract on Ethereum or another compatible blockchain.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-300">2. Apply for Exchange Listings</h4>
              <p className="text-xs text-blue-300">Submit applications to exchanges like Uniswap, PancakeSwap, or centralized exchanges. Each has its own listing process.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-300">3. Provide Liquidity</h4>
              <p className="text-xs text-blue-300">For DEXes, you'll need to create a liquidity pool by pairing PRAY with ETH or a stablecoin.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-300">4. Market Your Token</h4>
              <p className="text-xs text-blue-300">Build a community, create a website, and establish social media presence for your token.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="default"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500"
              onClick={() => window.open("https://ethereum.org/en/developers/docs/standards/tokens/erc-20/", "_blank")}
            >
              Learn About ERC-20 Tokens
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Earn;
