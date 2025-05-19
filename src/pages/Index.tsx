
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TrendingUp, Zap, Shield, Users, CircleDollarSign, Trophy, CheckCircle2 } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import CoinTapper from "@/components/CoinTapper";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useSupabase } from "@/contexts/SupabaseContext";
import { usePrayData } from "@/hooks/use-pray-data";
import { toast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Stats from "@/components/Stats";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const navigate = useNavigate();
  const { account, chainId } = useWeb3();
  const { user } = useSupabase();
  const { data, incrementTaps, claimDailyReward, completeTask, isInitialized } = usePrayData();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Simple task system
  const dailyTask = {
    id: 1,
    title: "Daily Login",
    description: "Log in to the app today",
    reward: 5,
    isCompleted: Boolean(data.lastDailyReward === new Date().toISOString().split('T')[0])
  };
  
  const handleTap = () => {
    incrementTaps();
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
    
    toast({
      title: "PRAY Mined!",
      description: `You earned ${data.miningPower} PRAY tokens`,
    });
  };

  const handleDailyReward = () => {
    const claimed = claimDailyReward();
    if (claimed) {
      toast({
        title: "Daily Reward Claimed!",
        description: "You earned 5 PRAY tokens.",
      });
    } else {
      toast({
        title: "Already Claimed",
        description: "You've already claimed your daily reward today.",
        variant: "destructive",
      });
    }
  };
  
  const handleCompleteTask = () => {
    if (!dailyTask.isCompleted) {
      completeTask(dailyTask.id, dailyTask.reward);
      
      // Mark task as completed locally
      dailyTask.isCompleted = true;
    } else {
      toast({
        title: "Task Already Completed",
        description: "You've already completed this task today.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout showHeader={false}>
      <header className="px-8 pt-8 lg:px-10 bg-blue-900/20 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 items-center">
            <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Praybit
            </div>
            <div className="mt-4 sm:mt-0">
              {user ? (
                <ConnectWalletButton showNetwork={false} />
              ) : (
                <Button onClick={() => navigate("/profile")}>
                  Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative mt-8 px-8 lg:px-10 py-6 flex-grow bg-blue-900/30">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Tap to earn PRAY tokens
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Join the Praybit ecosystem and start earning PRAY tokens by
              tapping the coin. The more you tap, the more you earn!
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-300 px-3 py-1 rounded-full text-sm border border-yellow-400/20">
              <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
              Pre-launch Phase • Not Listed Yet
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl p-2">
  <CardHeader className="px-6">
    <CardTitle className="text-xl flex items-center gap-2">
      <Zap className="h-5 w-5 text-yellow-400" />
      Praybit Mining
    </CardTitle>
    <CardDescription>Tap to earn PRAY tokens</CardDescription>
  </CardHeader>
  
  <CardContent className="px-6 pb-6">
    <div className="flex justify-center">
      <CoinTapper 
        onTap={handleTap}
        coins={data.coins || 0}
        coinsPerTap={data.miningPower || 1}
        isSyncing={isSyncing}
      />
    </div>

    {!user && (
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-200 mb-2">
          Register to save your progress and earn more rewards!
        </p>
        <Button onClick={() => navigate("/profile")} variant="outline">
          Register Now
        </Button>
      </div>
    )}
  </CardContent>
</Card>


            {user ? (
              <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl p-2">
                <CardHeader className="px-6">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Daily Tasks
                  </CardTitle>
                  <CardDescription>Complete tasks to earn bonus rewards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-blue-100">{dailyTask.title}</h3>
                        <p className="text-xs text-blue-300 mt-0.5">{dailyTask.description}</p>
                      </div>
                      <div className="text-yellow-400 font-semibold text-sm flex items-center">
                        +{dailyTask.reward} PRAY
                      </div>
                    </div>
                    
                    <Progress value={dailyTask.isCompleted ? 100 : 0} className="h-2 bg-blue-900" />
                    
                    <Button 
                      onClick={handleCompleteTask}
                      className={`w-full ${dailyTask.isCompleted 
                        ? 'bg-green-600 hover:bg-green-500' 
                        : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium'}`}
                      disabled={dailyTask.isCompleted}
                    >
                      {dailyTask.isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                        </>
                      ) : "Complete Task"}
                    </Button>
                  </div>
                  
                  <div className="border-t border-blue-700 pt-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate("/earn")}>
                      View All Tasks & Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl p-2">
                <CardHeader className="px-6">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-yellow-400" />
                    Daily Rewards
                  </CardTitle>
                  <CardDescription>Claim your daily bonus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col items-center px-6 pb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-900">+5</span>
                  </div>
                  <p className="text-center text-sm text-blue-200">
                    Come back every day to claim free PRAY tokens!
                  </p>
                  <Button 
                    onClick={handleDailyReward}
                    className="mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
                  >
                    Claim Daily Reward
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {user && (
            <div className="mt-8">
              <Stats 
                coins={data.coins || 0} 
                tapsCount={data.tapsCount || 0} 
                referrals={data.referrals || 0} 
              />
            </div>
          )}
          
          <div className="mt-16 border-t border-blue-900/50 pt-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ways to Earn PRAY
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-blue-800/30 rounded-lg border border-blue-700/50">
                <TrendingUp className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Mining
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Earn PRAY tokens by tapping the mining button
                </p>
              </div>
              <div className="p-6 bg-blue-800/30 rounded-lg border border-blue-700/50">
                <Users className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Referrals
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Invite friends and earn 10 PRAY per referral
                </p>
              </div>
              <div className="p-6 bg-blue-800/30 rounded-lg border border-blue-700/50">
                <Shield className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Staking
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Earn passive income by staking your PRAY tokens
                </p>
              </div>
              <div className="p-6 bg-blue-800/30 rounded-lg border border-blue-700/50">
                <Trophy className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Achievements
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Complete tasks to earn rewards and bonuses
                </p>
              </div>
            </div>
            
            <div className="mt-8 pb-4">
              <Button onClick={() => navigate("/earn")} variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20">
                View All Earning Options
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative mt-12 border-t border-blue-900/50 py-8 px-8 lg:px-10 pb-24 bg-blue-900/20">
        {/* Footer content without rights reserved text */}
      </footer>
      
      <BottomNavigation />
    </AppLayout>
  );
};

export default Index;
