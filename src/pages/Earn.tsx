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
  BadgePercent,
  Gift,
  Clock,
  AlertTriangle
} from "lucide-react";

// Define tasks for users to complete
interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  completedKey?: string; // Property in user data to check if task is completed
  verificationFn?: (data: any) => boolean; // Function to verify task completion
}

const Earn = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { user } = useSupabase();
  const { data: prayData, updateCoins, incrementTaps, claimDailyReward, completeTask } = usePrayData();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<{[key: number]: boolean}>({});
  
  // Define tasks
  const tasks: Task[] = [
    {
      id: 1,
      title: "Daily Login",
      description: "Log in to the app today",
      reward: 5,
      verificationFn: (data) => Boolean(data.lastDailyReward === new Date().toISOString().split('T')[0])
    },
    {
      id: 2,
      title: "Tap 50 Times",
      description: "Mine PRAY coins by tapping 50 times",
      reward: 10,
      verificationFn: (data) => data.tapsCount >= 50
    },
    {
      id: 3,
      title: "Refer a Friend",
      description: "Invite a friend to join Praybit",
      reward: 20,
      verificationFn: (data) => data.referrals > 0
    },
    {
      id: 4,
      title: "Accumulate 100 PRAY",
      description: "Collect a total of 100 PRAY coins",
      reward: 25,
      verificationFn: (data) => data.coins >= 100
    }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const userId = user.id;
          
          // Get user stats
          const { data: userStats, error: statsError } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", userId)
            .single();
          
          if (statsError && statsError.code !== 'PGRST116') {
            console.error('Error fetching user stats:', statsError);
            toast({
              title: "Error",
              description: "Failed to load user data",
              variant: "destructive"
            });
            return;
          }
          
          // Update referral count
          if (userStats) {
            setReferralCount(userStats.referrals || 0);
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
          
          // Check task completion
          const completed: {[key: number]: boolean} = {};
          tasks.forEach(task => {
            if (task.verificationFn) {
              completed[task.id] = task.verificationFn(prayData);
            } else if (task.completedKey && prayData[task.completedKey as keyof typeof prayData]) {
              completed[task.id] = true;
            } else {
              completed[task.id] = false;
            }
          });
          setCompletedTasks(completed);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
  }, [user, prayData]);

  const handleClaimTaskReward = async (taskId: number, reward: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to claim rewards",
        variant: "destructive",
      });
      return;
    }
    
    // Check if task is completed
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    let isCompleted = false;
    
    if (task.verificationFn) {
      isCompleted = task.verificationFn(prayData);
    } else if (task.completedKey) {
      isCompleted = Boolean(prayData[task.completedKey as keyof typeof prayData]);
    }
    
    if (!isCompleted) {
      toast({
        title: "Task not completed",
        description: "Complete the task before claiming the reward",
        variant: "destructive",
      });
      return;
    }
    
    // If already claimed, prevent double claim
    if (completedTasks[taskId]) {
      toast({
        title: "Already claimed",
        description: "You've already claimed this reward",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = completeTask(taskId, reward);
      
      if (success) {
        // Mark as completed locally
        setCompletedTasks(prev => ({
          ...prev,
          [taskId]: true
        }));
      }
    } catch (err) {
      console.error('Error claiming task reward:', err);
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive"
      });
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
        setReferralLink(`https://coin.praybit.vercel.app?ref=${data}`);
        
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
        <div className="mb-6">
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="text-yellow-400 h-5 w-5 shrink-0" />
            <p className="text-sm text-yellow-200">
              <span className="font-medium">PRAY Token Status:</span> Pre-launch phase. The token is not yet listed on exchanges.
            </p>
          </div>
        </div>
        
        {/* Tasks and Achievements Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-400" />
            Daily Tasks
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map(task => {
              const isCompleted = task.verificationFn ? task.verificationFn(prayData) : false;
              const isClaimed = completedTasks[task.id] || false;
              
              return (
                <Card key={task.id} className="bg-blue-800/80 border-blue-700 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-blue-900'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-300" />
                        )}
                      </div>
                      {task.title}
                    </CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-blue-300">
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="text-yellow-400 font-semibold">
                        +{task.reward} PRAY
                      </span>
                    </div>
                    
                    <Progress 
                      value={isCompleted ? 100 : 0} 
                      className="h-2 mb-3" 
                      indicatorClassName={isCompleted ? "bg-green-500" : ""} 
                    />
                    
                    <Button 
                      variant="outline" 
                      className={`w-full ${isCompleted && !isClaimed 
                        ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20'
                        : isCompleted && isClaimed
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-700'
                        : 'border-blue-600 text-blue-400 hover:bg-blue-800'}`}
                      disabled={!isCompleted || isClaimed}
                      onClick={() => handleClaimTaskReward(task.id, task.reward)}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Claimed
                        </>
                      ) : isCompleted ? (
                        'Claim Reward'
                      ) : (
                        'Complete Task'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      
        {/* Other earning methods */}
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
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 w-full"
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
