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

const Earn = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { user } = useSupabase();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*');

        if (error) {
          console.error('Error fetching achievements:', error);
          toast({
            title: "Error",
            description: "Failed to load achievements",
            variant: "destructive"
          });
          return;
        }

        setAchievements(data);
        
        if (user) {
          const userId = user.id;
          
          // Instead of querying a table that doesn't exist, we'll adapt the code to use user_stats
          // which is one of the existing tables in Supabase
          
          // Looking for a code block like this:
          // const { data: userAchievements, error: achievementsError } = await supabase
          //   .from("user_achievements")
          //   .select("*")
          //   .eq("user_id", userId);
          
          // And replacing it with:
          const { data: userStats, error: statsError } = await supabase
            .from("user_stats")
            .select("*")
            .eq("user_id", userId);
          
          if (statsError) {
            console.error('Error fetching user achievements:', statsError);
            toast({
              title: "Error",
              description: "Failed to load user achievements",
              variant: "destructive"
            });
            return;
          }
          
          // Initialize isCompleted based on userStats
          if (userStats && userStats.length > 0) {
            const stats = userStats[0];
            const completed: { [key: string]: boolean } = {};
            
            data.forEach(achievement => {
              if (achievement.id === 1) {
                completed[achievement.id] = stats.taps_count >= 100;
              } else if (achievement.id === 2) {
                completed[achievement.id] = stats.referrals >= 1;
              } else if (achievement.id === 3) {
                completed[achievement.id] = stats.coins >= 1000;
              } else {
                completed[achievement.id] = false;
              }
            });
            
            setIsCompleted(completed);
          } else {
            // If no user stats, initialize all achievements as not completed
            const initialCompleted: { [key: string]: boolean } = {};
            data.forEach(achievement => {
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
      const { error } = await supabase.from('user_stats').upsert([
        {
          user_id: user.id,
          coins: {
            // Use a function to ensure we're incrementing the existing value
            ['+']: reward,
          },
        },
      ], { onConflict: 'user_id' });

      if (error) {
        console.error('Error claiming reward:', error);
        toast({
          title: "Error",
          description: "Failed to claim reward",
          variant: "destructive"
        });
        // Revert the UI update if the Supabase update fails
        setIsCompleted(prev => ({ ...prev, [achievementId]: false }));
      } else {
        toast({
          title: "Reward Claimed!",
          description: `You have claimed ${reward} coins.`,
        });
      }
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
