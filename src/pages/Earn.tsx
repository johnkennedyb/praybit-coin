
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePrayData } from '@/hooks/use-pray-data';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Users, 
  Trophy, 
  Calendar, 
  Link as LinkIcon, 
  Copy, 
  Check,
  Coins,
  CircleDollarSign,
  Sparkles,
  ArrowRight,
  BadgePercent
} from "lucide-react";

// Define a type for achievements
interface Achievement {
  id: number;
  title: string;
  description: string;
  reward: number;
}

const Earn = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { user } = useSupabase();
  const { data: prayData, updateCoins, incrementTaps, claimDailyReward } = usePrayData();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isCompleted, setIsCompleted] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Define achievements
        const defaultAchievements: Achievement[] = [
          { 
            id: 1, 
            title: "Tap Master", 
            description: "Tap 100 times to earn coins", 
            reward: 50 
          },
          { 
            id: 2, 
            title: "Social Butterfly", 
            description: "Refer a friend to earn coins", 
            reward: 100 
          },
          { 
            id: 3, 
            title: "Coin Collector", 
            description: "Accumulate 1000 PRAY coins", 
            reward: 200 
          }
        ];
        
        setAchievements(defaultAchievements);
        
        if (user) {
          const userId = user.id;
          
          // Get user stats to check achievements
          const { data: userStats, error: statsError } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", userId)
            .single();
          
          if (statsError && statsError.code !== 'PGRST116') {
            console.error('Error fetching user achievements:', statsError);
            toast({
              title: "Error",
              description: "Failed to load user achievements",
              variant: "destructive"
            });
            return;
          }
          
          // Initialize isCompleted based on userStats
          if (userStats) {
            const completed: { [key: number]: boolean } = {};
            setReferralCount(userStats.referrals || 0);
            
            defaultAchievements.forEach(achievement => {
              if (achievement.id === 1) {
                completed[achievement.id] = userStats.taps_count >= 100;
              } else if (achievement.id === 2) {
                completed[achievement.id] = userStats.referrals >= 1;
              } else if (achievement.id === 3) {
                completed[achievement.id] = userStats.coins >= 1000;
              } else {
                completed[achievement.id] = false;
              }
            });
            
            setIsCompleted(completed);
          } else {
            // If no user stats, initialize all achievements as not completed
            const initialCompleted: { [key: number]: boolean } = {};
            defaultAchievements.forEach(achievement => {
              initialCompleted[achievement.id] = false;
            });
            setIsCompleted(initialCompleted);
          }
          
          // Fetch referral code if it exists
          const { data: existingReferrals, error } = await supabase
            .from('referrals')
            .select('code')
            .eq('referrer_id', user.id)
            .limit(1);
          
          if (!error && existingReferrals && existingReferrals.length > 0) {
            setReferralCode(existingReferrals[0].code);
            setReferralLink(`https://coin.praybit.com?ref=${existingReferrals[0].code}`);
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleClaimReward = async (achievementId: number, reward: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to claim rewards",
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimistically update the UI
      setIsCompleted(prev => ({ ...prev, [achievementId]: true }));

      // Using our new increment_coins function from Supabase
      const { data, error } = await supabase
        .rpc('increment_coins', {
          user_id_input: user.id,
          amount: reward
        });

      if (error) {
        console.error('Error claiming reward:', error);
        
        // Let's try a fallback method if there's an issue with the RPC
        const { error: fallbackError } = await supabase
          .from('user_stats')
          .update({ coins: reward }) // Just set the reward amount directly as fallback
          .eq('user_id', user.id);

        if (fallbackError) {
          console.error('Error with fallback update:', fallbackError);
          toast({
            title: "Error",
            description: "Failed to claim reward",
            variant: "destructive"
          });
          // Revert the UI update if both methods fail
          setIsCompleted(prev => ({ ...prev, [achievementId]: false }));
          return;
        }
      }

      toast({
        title: "Reward Claimed!",
        description: `You have claimed ${reward} coins.`,
      });
      
    } catch (err) {
      console.error('Error in handleClaimReward:', err);
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive"
      });
      // Revert the UI update if an error occurs
      setIsCompleted(prev => ({ ...prev, [achievementId]: false }));
    }
  };

  const handleTap = () => {
    incrementTaps();
    toast({
      title: "PRAY Mined!",
      description: `You earned ${prayData.miningPower || 1} PRAY tokens`,
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

  const generateReferralCode = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a referral link",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the generate_referral_code function via RPC
      const { data, error } = await supabase.rpc('generate_referral_code', {
        user_id: user.id
      });
      
      if (error) throw error;
      
      if (data) {
        setReferralCode(data);
        setReferralLink(`https://coin.praybit.com?ref=${data}`);
        
        toast({
          title: "Referral link created!",
          description: "Share with friends to earn PRAY coins.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to generate referral link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "Share this link with your friends.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <AppLayout title="Earn Rewards">
      <div className="container mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Praybit Tapper Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Praybit Tapper
              </CardTitle>
              <CardDescription>Tap to earn PRAY tokens</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent animate-pulse mb-1">
                  {formatNumber(prayData?.coins || 0)}
                </div>
                <div className="text-sm text-blue-200">Praybit Coin • PRAY</div>
                <div className="mt-2 px-3 py-1 bg-blue-900/40 rounded-full text-xs text-blue-300 border border-blue-700/50 inline-flex items-center">
                  <Sparkles className="h-3 w-3 text-yellow-400 mr-1" />
                  ERC-20 Token
                </div>
              </div>
              
              <Button 
                className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500 shadow-lg shadow-amber-600/30 mb-4"
                onClick={handleTap}
              >
                <Coins className="h-10 w-10 text-white drop-shadow-md" />
              </Button>
              
              <p className="text-center text-sm text-blue-200">
                Mine <span className="font-bold text-yellow-400">{prayData?.miningPower || 1} PRAY</span> tokens
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-blue-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                ERC-20 Standard Compliant
              </div>
            </CardContent>
          </Card>

          {/* Referral Program Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                Referral Program
              </CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-200">Invite friends and earn PRAY coins for each referral.</p>
              
              {!referralCode ? (
                <Button 
                  variant="outline" 
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black w-full"
                  onClick={generateReferralCode}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Generate Referral Link
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      value={referralLink}
                      readOnly
                      className="bg-blue-900/30 border-blue-700"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-blue-600 text-blue-400 hover:bg-blue-800"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-blue-300 p-2 bg-blue-900/30 rounded-md border border-blue-700/50">
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      <span>Your referral code: <span className="font-mono">{referralCode}</span></span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs text-blue-300 hover:text-blue-100 p-1"
                      onClick={() => navigate("/referral")}
                    >
                      Details
                    </Button>
                  </div>
                  
                  <div className="text-center pt-2">
                    <p className="text-xs text-blue-300">Total Referrals: {referralCount}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Rewards Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-400" />
                Daily Rewards
              </CardTitle>
              <CardDescription>Claim your daily PRAY tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl font-bold text-white">+5</span>
              </div>
              <p className="text-center text-sm text-blue-200">
                Come back every day to claim free PRAY tokens!
              </p>
              <Button 
                onClick={handleDailyReward}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              >
                Claim Daily Reward
              </Button>
            </CardContent>
          </Card>

          {/* Staking Rewards Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgePercent className="h-5 w-5 text-yellow-400" />
                Staking Rewards
              </CardTitle>
              <CardDescription>Stake PRAY and earn passive income</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-200">
                Stake your PRAY tokens to earn rewards. The more you stake, the more you earn!
              </p>
              <div className="p-3 bg-blue-900/40 rounded-md border border-blue-700/50">
                <p className="text-yellow-400 font-medium">Coming soon!</p>
                <p className="text-xs text-blue-300 mt-1">
                  Staking will be available after token launch.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-yellow-500 text-yellow-400"
                disabled
              >
                Stake PRAY
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Rewards Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Achievement Rewards
              </CardTitle>
              <CardDescription>Complete tasks and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Referral Milestone</h3>
                    <span className="text-xs text-blue-300">1/3 friends invited</span>
                  </div>
                  <Progress value={33} className="h-2 bg-blue-900" />
                  <p className="text-xs text-blue-300 mt-1">
                    Invite 3 friends to Praybit and unlock a special reward!
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/20"
                  disabled={referralCount < 3}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  {referralCount >= 3 ? "Claim Reward" : "Invite 3 Friends to Claim"}
                </Button>
              </div>
              
              <div className="border-t border-blue-700/50 pt-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-200 hover:text-blue-100"
                  onClick={() => navigate("/achievements")}
                >
                  View All Achievements <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Card */}
          <Card className="bg-blue-800/80 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top PRAY earners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-200">
                See who's earning the most PRAY and compete for the top spot!
              </p>
              
              <div className="p-3 bg-blue-900/40 rounded-md border border-blue-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-400 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-2">
                      1
                    </div>
                    <span className="text-blue-100">User 1</span>
                  </div>
                  <div className="font-medium text-yellow-400">
                    {formatNumber(prayData?.coins || 0)} PRAY
                  </div>
                </div>
                <div className="text-xs text-blue-300 mt-1 text-right italic">
                  (You)
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/leaderboard")}
              >
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* User Stats Summary */}
        <Card className="mt-6 bg-blue-900/60 border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-yellow-400" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-blue-300">PRAY Balance</div>
                  <div className="font-bold">{formatNumber(prayData?.coins || 0)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-blue-300">Total Taps</div>
                  <div className="font-bold">{prayData?.tapsCount || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-blue-300">Referrals</div>
                  <div className="font-bold">{prayData?.referrals || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Earn;
