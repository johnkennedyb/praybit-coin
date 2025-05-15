
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, UserPlus, HandCoins, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import CoinTapper from "@/components/CoinTapper";
import ReferralSystem from "@/components/ReferralSystem";
import Stats from "@/components/Stats";

const Index = () => {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("praybitCoins");
    return saved ? parseInt(saved) : 0;
  });
  
  const [tapsCount, setTapsCount] = useState(() => {
    const saved = localStorage.getItem("praybitTaps");
    return saved ? parseInt(saved) : 0;
  });

  const [coinsPerTap, setCoinsPerTap] = useState(1);
  const [referrals, setReferrals] = useState(() => {
    const saved = localStorage.getItem("praybitReferrals");
    return saved ? parseInt(saved) : 0;
  });
  
  const isMobile = useIsMobile();

  // Save coins to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("praybitCoins", coins.toString());
    localStorage.setItem("praybitTaps", tapsCount.toString());
    localStorage.setItem("praybitReferrals", referrals.toString());
  }, [coins, tapsCount, referrals]);

  const handleTap = useCallback(() => {
    setCoins(prev => prev + coinsPerTap);
    setTapsCount(prev => prev + 1);
  }, [coinsPerTap]);

  const handleReferral = useCallback(() => {
    // Generate a referral link
    const referralLink = `${window.location.origin}/?ref=${Date.now()}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied!",
      description: "Share this link with friends to earn bonus coins!",
    });
    // In a real app, you would track this referral in a database
    setReferrals(prev => prev + 1);
    // Give reward for sharing
    setCoins(prev => prev + 10);
  }, []);

  const connectWallet = useCallback(() => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature coming soon!",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Praybit Coin</h1>
          </div>
          <Button variant="outline" onClick={connectWallet}>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-blue-800 border-blue-700">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Tap to Earn PRAY Coins</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <CoinTapper onTap={handleTap} coins={coins} coinsPerTap={coinsPerTap} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-blue-300">You've tapped {tapsCount} times</p>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <Stats coins={coins} tapsCount={tapsCount} referrals={referrals} />
            
            <Card className="bg-blue-800 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-yellow-400" />
                  Referral System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReferralSystem onRefer={handleReferral} referralCount={referrals} />
              </CardContent>
            </Card>
            
            <Card className="bg-blue-800 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandCoins className="h-5 w-5 text-yellow-400" />
                  Praybit Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Earn more coins by completing tasks:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>• Daily login</span>
                    <span>+5 PRAY</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Refer a friend</span>
                    <span>+10 PRAY</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Connect wallet</span>
                    <span>+50 PRAY</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/about" className="text-sm text-blue-300 hover:text-blue-100 transition-colors w-full text-center">
                  Learn more about Praybit Coin
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
