
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isCompleted, setIsCompleted] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        // Since there's no achievements table, we'll create them directly in code
        // This is a temporary solution until an achievements table is created in Supabase
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
        }
      } catch (err) {
        console.error('Error in fetchAchievements:', err);
        toast({
          title: "Error",
          description: "Failed to load achievements",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user, toast]);

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

      // Update user's coin balance in Supabase
      const { error } = await supabase.rpc('increment_coins', {
        user_id_input: user.id,
        amount: reward
      }).single();

      if (error) {
        console.error('Error claiming reward:', error);
        
        // Let's try a fallback method if the RPC doesn't exist yet
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ coins: supabase.rpc('get_coins', { user_id_input: user.id }) + reward })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error with fallback update:', updateError);
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

  return (
    <AppLayout title="Earn Rewards">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Earn Rewards</h1>
        <p className="text-blue-200 mb-6">Complete tasks and achievements to earn PRAY tokens!</p>

        {isLoading ? (
          <p className="text-center text-blue-300">Loading achievements...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-blue-800 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Reward: {achievement.reward} PRAY</span>
                    {isCompleted[achievement.id] ? (
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  {!isCompleted[achievement.id] ? (
                    <Button onClick={() => handleClaimReward(achievement.id, achievement.reward)} variant="outline" className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black">
                      Claim Reward
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Claimed
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Earn;
