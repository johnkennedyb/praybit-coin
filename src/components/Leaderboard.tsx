
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardUser {
  user_id: string;
  coins: number;
  rank: number;
}

export function Leaderboard() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        setLoading(true);
        // Fetch top 3 users by coin count
        const { data, error } = await supabase
          .from('user_stats')
          .select('user_id, coins')
          .order('coins', { ascending: false })
          .limit(3);

        if (error) throw error;

        // Add rank to each user
        const usersWithRank = data?.map((user, index) => ({
          ...user,
          rank: index + 1
        })) || [];

        setTopUsers(usersWithRank);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopUsers();
  }, []);

  // Helper function to get rank badge
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Users className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Miners
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 rounded-full border-4 border-t-yellow-400 border-b-yellow-400 border-r-transparent border-l-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {topUsers.length > 0 ? (
              topUsers.map((user) => (
                <div 
                  key={user.user_id} 
                  className={cn(
                    "flex justify-between items-center p-3 rounded-md",
                    user.rank === 1 ? "bg-yellow-400/20 border border-yellow-400/30" :
                    user.rank === 2 ? "bg-gray-400/10 border border-gray-400/30" :
                    "bg-amber-700/10 border border-amber-700/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900/70 flex items-center justify-center">
                      {getRankBadge(user.rank)}
                    </div>
                    <div>
                      <p className="font-medium">Player #{user.user_id.substring(0, 6)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{user.coins.toLocaleString()}</span>
                    <span className="text-yellow-400 text-sm">PRAY</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-blue-300">
                No miners found yet. Start mining to compete!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
