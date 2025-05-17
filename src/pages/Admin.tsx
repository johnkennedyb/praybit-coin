
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/contexts/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Shield, Users, Coins, Settings, ArrowRight, 
  Search, Award, TrendingUp, Gift, AlertTriangle, Lock
} from "lucide-react";

interface UserStats {
  id: string;
  user_id: string;
  coins: number;
  taps_count: number;
  referrals: number;
  last_daily_reward?: string;
  email?: string;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [adminSettings, setAdminSettings] = useState({
    miningRate: 1,
    dailyReward: 5,
    referralReward: 10
  });

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You must be logged in to access the admin dashboard",
          variant: "destructive",
        });
        return;
      }

      // In a real app, we would check if the user is an admin
      // For this demo, we'll consider users with "admin" in their email as admins
      if (!user.email?.includes('admin')) {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions",
          variant: "destructive",
        });
        return;
      }
      
      setIsAdmin(true);
      fetchUsers();
      calculateTotalTokens();
    };

    checkAdmin();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const { data: userStats, error } = await supabase
        .from("user_stats")
        .select("*")
        .order("coins", { ascending: false });
      
      if (error) throw error;
      
      // Fetch emails from auth - note: this is a simplified approach for demo
      // In a real app, this would typically be handled by a server-side function
      if (userStats && userStats.length > 0) {
        // We'll just set emails using the user_id for demo purposes
        // since we don't have direct access to auth.users
        const usersWithEmail = userStats.map(stat => ({
          ...stat,
          email: `user-${stat.user_id.substring(0, 8)}@example.com`
        }));
          
        setUsers(usersWithEmail);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalTokens = async () => {
    try {
      // Get the sum of all coins from user_stats
      const { data, error } = await supabase
        .from('user_stats')
        .select('coins');
      
      if (error) throw error;
      
      // Calculate the total coins
      const total = data?.reduce((sum, row) => sum + (row.coins || 0), 0) || 0;
      setTotalTokens(total);
    } catch (error) {
      console.error("Error calculating total tokens:", error);
      // Fallback calculation
      const total = users.reduce((sum, user) => sum + user.coins, 0);
      setTotalTokens(total);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.user_id.includes(searchTerm)
  );

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(Number(e.target.value));
  };

  const handleSettingChange = (setting: string, value: number) => {
    setAdminSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const updateSettings = async () => {
    // In a real app, update settings in database
    toast({
      title: "Settings Updated",
      description: "The mining rates and rewards have been updated.",
    });
  };
  
  const handleSendTokens = async () => {
    if (!selectedUser || tokenAmount <= 0) return;
    
    try {
      // Call the increment_coins RPC function
      const { data, error } = await supabase
        .rpc('increment_coins', { 
          user_id_input: selectedUser.user_id, 
          amount: tokenAmount 
        });
      
      if (error) throw error;
      
      toast({
        title: "Tokens Sent",
        description: `${tokenAmount} PRAY tokens sent to user.`,
      });
      
      // Refresh user data
      fetchUsers();
      calculateTotalTokens();
      setSelectedUser(null);
      setTokenAmount(0);
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast({
        title: "Error",
        description: "Failed to send tokens",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin || loading) {
    return (
      <AppLayout title="Admin Access">
        <div className="container mx-auto py-12">
          <div className="flex flex-col items-center justify-center">
            <Lock className="h-16 w-16 text-yellow-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying Admin Access</h1>
            <p>Please wait while we verify your credentials...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin Dashboard">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-yellow-400" />
              Admin Dashboard
            </h1>
            <p className="text-blue-300">Manage users, tokens, and app settings</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg flex items-center gap-3 md:max-w-md">
            <AlertTriangle className="text-yellow-400 h-5 w-5 shrink-0" />
            <p className="text-sm text-yellow-200">
              <span className="font-medium">Admin Controls:</span> Changes made here directly affect the app and users.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-blue-800/50 border-blue-700">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-sm text-blue-300">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-800/50 border-blue-700">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Coins className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-sm text-blue-300">Total PRAY Tokens</p>
              <p className="text-3xl font-bold">{totalTokens.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-800/50 border-blue-700">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <TrendingUp className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-sm text-blue-300">Avg. Tokens per User</p>
              <p className="text-3xl font-bold">
                {users.length > 0 ? Math.round(totalTokens / users.length).toLocaleString() : 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-800/50 border-blue-700">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Award className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-sm text-blue-300">Total Referrals</p>
              <p className="text-3xl font-bold">
                {users.reduce((sum, user) => sum + (user.referrals || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6 w-full md:w-auto">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="token-management" className="flex items-center gap-2">
              <Coins className="h-4 w-4" /> Token Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="bg-blue-800/30 border-blue-700">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users in the system</CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input 
                    placeholder="Search by email or user ID" 
                    className="pl-9 bg-blue-900/30 border-blue-700"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-blue-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-right">PRAY Balance</th>
                          <th className="px-4 py-3 text-right">Taps</th>
                          <th className="px-4 py-3 text-right">Referrals</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t border-blue-700 hover:bg-blue-800/30">
                              <td className="px-4 py-3">{user.email || 'Unknown'}</td>
                              <td className="px-4 py-3 text-right">{user.coins.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right">{user.taps_count}</td>
                              <td className="px-4 py-3 text-right">{user.referrals}</td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  Send Tokens
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-center text-blue-300">
                              {searchTerm ? 'No users found matching your search' : 'No users found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="token-management">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-blue-800/30 border-blue-700">
                <CardHeader>
                  <CardTitle>Send Tokens</CardTitle>
                  <CardDescription>Send PRAY tokens to specific users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedUser ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-900/40 rounded-md border border-blue-700/50">
                        <p className="text-sm text-blue-300">Selected User:</p>
                        <p className="font-medium">{selectedUser.email || selectedUser.user_id}</p>
                        <p className="text-xs text-blue-400 mt-1">Current Balance: {selectedUser.coins} PRAY</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-blue-300 mb-1 block">Amount to Send</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={tokenAmount}
                          onChange={handleTokenAmountChange}
                          className="bg-blue-900/30 border-blue-700"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-500"
                          disabled={tokenAmount <= 0}
                          onClick={handleSendTokens}
                        >
                          Send Tokens
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-blue-700"
                          onClick={() => {
                            setSelectedUser(null);
                            setTokenAmount(0);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Gift className="h-12 w-12 text-yellow-400 mb-2 opacity-70" />
                      <p className="text-blue-300">
                        Select a user from the Users tab to send them PRAY tokens
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                        onClick={() => {
                          document.querySelector('[data-value="users"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                        }}
                      >
                        Go to Users <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-blue-800/30 border-blue-700">
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                  <CardDescription>Overview of token distribution in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-blue-300 mb-1">Total Supply</p>
                      <p className="text-2xl font-bold">{totalTokens.toLocaleString()} PRAY</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-blue-300 mb-1">Top Holders</p>
                      <div className="space-y-2 mt-2">
                        {users.slice(0, 5).map((user, index) => (
                          <div key={user.id} className="flex justify-between items-center p-2 bg-blue-900/20 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm truncate max-w-[150px]">{user.email || user.user_id.substring(0, 8)}</span>
                            </div>
                            <span className="font-medium">{user.coins.toLocaleString()} PRAY</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-blue-800/30 border-blue-700">
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Configure mining rates and rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-blue-300 mb-1 block">Mining Rate (PRAY per tap)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={adminSettings.miningRate}
                    onChange={(e) => handleSettingChange('miningRate', Number(e.target.value))}
                    className="bg-blue-900/30 border-blue-700"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-blue-300 mb-1 block">Daily Reward (PRAY)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={adminSettings.dailyReward}
                    onChange={(e) => handleSettingChange('dailyReward', Number(e.target.value))}
                    className="bg-blue-900/30 border-blue-700"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-blue-300 mb-1 block">Referral Reward (PRAY)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={adminSettings.referralReward}
                    onChange={(e) => handleSettingChange('referralReward', Number(e.target.value))}
                    className="bg-blue-900/30 border-blue-700"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="ml-auto bg-green-600 hover:bg-green-500"
                  onClick={updateSettings}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminPage;
