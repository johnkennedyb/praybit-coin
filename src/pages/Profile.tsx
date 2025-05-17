
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import TransferModal from "@/components/TransferModal";
import { usePrayData } from "@/hooks/use-pray-data";
import { Copy, ExternalLink, Key, LogOut, Mail, Shield, User as UserIcon, Wallet } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useSupabase();
  const { account } = useWeb3();
  const { data } = usePrayData();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, bio')
            .eq('id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (profile) {
            setUsername(profile.username || "");
            setBio(profile.bio || "");
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username,
          bio,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (err: any) {
      console.error('Error logging out:', err);
      toast({
        title: "Logout Failed",
        description: err.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };
  
  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <AppLayout title="Profile">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-blue-800/50 p-8 rounded-lg border border-blue-700 shadow-lg">
              <UserIcon className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
              <p className="mb-8 text-blue-200">
                Please sign in to access your profile and start earning PRAY tokens.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout title="My Profile">
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Card className="bg-blue-800/50 border-blue-700 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">
                      {username ? username[0].toUpperCase() : user.email?.[0].toUpperCase() || "?"}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-center">
                    {username || "Praybit User"}
                  </CardTitle>
                  <CardDescription className="text-center text-blue-300">
                    {user.email}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium text-blue-300">PRAY Balance</p>
                  <p className="text-2xl font-bold">{data.coins || 0}</p>
                </div>
                
                <Separator className="bg-blue-700/50" />
                
                <div>
                  <p className="text-sm font-medium text-blue-300 mb-2">User ID</p>
                  <div className="flex items-center justify-between p-2 bg-blue-900/40 rounded-md border border-blue-700/50 text-sm">
                    <span className="truncate max-w-[150px] font-mono">{user.id}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-blue-400 hover:text-blue-100"
                      onClick={() => copyToClipboard(user.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                {account && (
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-2">Connected Wallet</p>
                    <div className="flex items-center justify-between p-2 bg-blue-900/40 rounded-md border border-blue-700/50 text-sm">
                      <span className="truncate max-w-[150px] font-mono">{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-blue-400 hover:text-blue-100"
                          onClick={() => copyToClipboard(account)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-blue-400 hover:text-blue-100"
                          onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 w-full"
                  onClick={() => setIsTransferOpen(true)}
                >
                  <Wallet className="mr-2 h-4 w-4" /> Transfer PRAY
                </Button>
                
                {!account && (
                  <ConnectWalletButton showNetwork className="w-full" />
                )}
                
                <Button variant="outline" className="w-full mt-2 border-blue-700 text-blue-300" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </Button>
              </CardFooter>
            </Card>
            
            {data.coins >= 10000 && (
              <Card className="mt-4 bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border-yellow-500/30">
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-300">Admin Access</p>
                    <p className="text-xs text-yellow-300/70">
                      You have admin privileges.
                    </p>
                    <Button 
                      variant="link" 
                      className="text-yellow-400 px-0 hover:text-yellow-300"
                      onClick={() => navigate('/admin')}
                    >
                      Open Admin Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-blue-800/30 border-blue-700">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-blue-300">Username</label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-blue-900/30 border-blue-700"
                        placeholder="Enter your username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-blue-300">Bio</label>
                      <div className="mt-1">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full rounded-md border border-blue-700 bg-blue-900/30 p-2 text-sm"
                          placeholder="Tell us a little about yourself..."
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="ml-auto bg-blue-600 hover:bg-blue-500" 
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card className="bg-blue-800/30 border-blue-700">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-blue-300">Email</label>
                      <div className="flex mt-1">
                        <Input 
                          value={user.email || ""} 
                          disabled 
                          className="bg-blue-900/30 border-blue-700 flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2 border-blue-700"
                          onClick={() => copyToClipboard(user.email || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> 
                        Your primary email address
                      </p>
                    </div>
                    
                    <Separator className="bg-blue-700/50" />
                    
                    <div>
                      <h3 className="text-sm font-medium text-blue-300">Password</h3>
                      <Button 
                        variant="outline" 
                        className="mt-2 border-blue-700 text-blue-300"
                      >
                        Change Password
                      </Button>
                    </div>
                    
                    <Separator className="bg-blue-700/50" />
                    
                    <div>
                      <h3 className="text-sm font-medium text-yellow-400">Delete Account</h3>
                      <p className="text-xs text-blue-400 mt-1">
                        Permanently delete your account and all your data
                      </p>
                      <Button 
                        variant="destructive" 
                        className="mt-2 bg-red-900/40 hover:bg-red-900/60 text-red-300"
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Card className="bg-blue-800/30 border-blue-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-yellow-400" />
                    PRAY Token
                  </CardTitle>
                  <CardDescription>Information about your PRAY tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-blue-900/40 p-4 rounded-md border border-blue-700/50">
                      <p className="text-sm text-blue-300">Your Balance</p>
                      <p className="text-2xl font-bold">{data.coins || 0}</p>
                    </div>
                    
                    <div className="bg-blue-900/40 p-4 rounded-md border border-blue-700/50">
                      <p className="text-sm text-blue-300">Total Taps</p>
                      <p className="text-2xl font-bold">{data.tapsCount || 0}</p>
                    </div>
                    
                    <div className="bg-blue-900/40 p-4 rounded-md border border-blue-700/50">
                      <p className="text-sm text-blue-300">Mining Power</p>
                      <p className="text-2xl font-bold">{data.miningPower || 1}x</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-md">
                    <p className="text-sm text-yellow-200">
                      <span className="font-medium">PRAY Token Status:</span> Pre-launch phase. The token is not yet listed on exchanges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <TransferModal 
        open={isTransferOpen} 
        onOpenChange={setIsTransferOpen} 
        balance={data.coins || 0} 
      />
    </AppLayout>
  );
};

export default Profile;
