
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Share2, Twitter, Facebook, Instagram, Youtube, Github, 
  Twitch, ExternalLink, Check, Loader2, Plus, Trash2 
} from "lucide-react";
import CoinScene from "@/components/CoinScene";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/hooks/use-toast";

interface SocialConnection {
  id: string;
  platform: string;
  username: string;
  profile_url?: string;
  verified: boolean;
}

const Social = () => {
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    platform: "twitter",
    username: "",
    profile_url: ""
  });
  const { user } = useSupabase();
  const { toast } = useToast();

  const socialChannels = [
    {
      name: "Twitter",
      username: "@PraybitCoin",
      icon: <Twitter className="h-8 w-8 text-[#1DA1F2]" />,
      followers: "0",
      url: "https://twitter.com",
      color: "bg-[#1DA1F2]/10 border-[#1DA1F2]/20",
      key: "twitter"
    },
    {
      name: "Discord",
      username: "Praybit Community",
      icon: <Share2 className="h-8 w-8 text-[#5865F2]" />,
      followers: "0",
      url: "https://discord.com",
      color: "bg-[#5865F2]/10 border-[#5865F2]/20",
      key: "discord"
    },
    {
      name: "Instagram",
      username: "@praybitcoin",
      icon: <Instagram className="h-8 w-8 text-[#E4405F]" />,
      followers: "0",
      url: "https://instagram.com",
      color: "bg-[#E4405F]/10 border-[#E4405F]/20",
      key: "instagram"
    },
    {
      name: "YouTube",
      username: "Praybit Official",
      icon: <Youtube className="h-8 w-8 text-[#FF0000]" />,
      followers: "0",
      url: "https://youtube.com",
      color: "bg-[#FF0000]/10 border-[#FF0000]/20",
      key: "youtube"
    },
    {
      name: "GitHub",
      username: "praybit",
      icon: <Github className="h-8 w-8 text-white" />,
      followers: "0",
      url: "https://github.com",
      color: "bg-gray-700/10 border-gray-600/20",
      key: "github"
    },
    {
      name: "Twitch",
      username: "praybitcoin",
      icon: <Twitch className="h-8 w-8 text-[#9146FF]" />,
      followers: "0",
      url: "https://twitch.tv",
      color: "bg-[#9146FF]/10 border-[#9146FF]/20",
      key: "twitch"
    }
  ];

  // Load user's social connections
  useEffect(() => {
    const fetchSocialConnections = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('social_connections')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          setSocialConnections(data);
        }
      } catch (error: any) {
        console.error('Error fetching social connections:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSocialConnections();
  }, [user]);

  const addSocialConnection = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect social accounts",
        variant: "destructive",
      });
      return;
    }
    
    if (!newConnection.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your username for this platform",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Create profile URL if not provided
      let profileUrl = newConnection.profile_url;
      if (!profileUrl) {
        switch (newConnection.platform) {
          case "twitter":
            profileUrl = `https://twitter.com/${newConnection.username}`;
            break;
          case "instagram":
            profileUrl = `https://instagram.com/${newConnection.username}`;
            break;
          case "github":
            profileUrl = `https://github.com/${newConnection.username}`;
            break;
          case "twitch":
            profileUrl = `https://twitch.tv/${newConnection.username}`;
            break;
          case "youtube":
            profileUrl = `https://youtube.com/@${newConnection.username}`;
            break;
        }
      }
      
      const { data, error } = await supabase
        .from('social_connections')
        .insert({
          user_id: user.id,
          platform: newConnection.platform,
          username: newConnection.username,
          profile_url: profileUrl
        })
        .select();
      
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Connection already exists",
            description: `You've already connected your ${newConnection.platform} account`,
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else if (data) {
        setSocialConnections([...socialConnections, data[0]]);
        
        toast({
          title: "Account connected!",
          description: `Your ${newConnection.platform} account has been connected`,
        });
        
        setNewConnection({
          platform: "twitter",
          username: "",
          profile_url: ""
        });
        setIsAddingConnection(false);
      }
    } catch (error: any) {
      toast({
        title: "Failed to connect account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSocialConnection = async (connectionId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('social_connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Update local state
      setSocialConnections(socialConnections.filter(conn => conn.id !== connectionId));
      
      toast({
        title: "Account disconnected",
        description: "Social account has been disconnected",
      });
    } catch (error: any) {
      toast({
        title: "Failed to disconnect account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Social Media">
      <div className="space-y-6">
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4 bg-gradient-to-r from-indigo-900 to-purple-900">
              <div className="flex-shrink-0 w-16 h-16">
                <CoinScene size="small" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-xl text-white">Praybit Coin</h3>
                <p className="text-blue-200 text-sm">@PraybitCoin</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-blue-100 mb-4">
                Join our growing community across all social media platforms! Get the latest updates, participate in discussions, and help us build the Praybit ecosystem.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-800/40">
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {user && (
          <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Connected Accounts</span>
                {!isAddingConnection && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-500 text-blue-300"
                    onClick={() => setIsAddingConnection(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Connect Account
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Connect your social media accounts to earn PRAY rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAddingConnection && (
                <Card className="border-blue-500/40 bg-blue-900/30">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Connect New Account</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div>
                      <label className="text-xs text-blue-200 mb-1 block">Platform</label>
                      <select 
                        className="w-full bg-blue-900/50 border border-blue-700 rounded-md p-2 text-sm"
                        value={newConnection.platform}
                        onChange={(e) => setNewConnection({...newConnection, platform: e.target.value})}
                      >
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                        <option value="twitch">Twitch</option>
                        <option value="discord">Discord</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-blue-200 mb-1 block">Username</label>
                      <Input 
                        placeholder={`Your ${newConnection.platform} username`}
                        value={newConnection.username}
                        onChange={(e) => setNewConnection({...newConnection, username: e.target.value})}
                        className="bg-blue-900/50 border-blue-700"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-blue-200 mb-1 block">Profile URL (Optional)</label>
                      <Input 
                        placeholder={`https://${newConnection.platform}.com/yourusername`}
                        value={newConnection.profile_url}
                        onChange={(e) => setNewConnection({...newConnection, profile_url: e.target.value})}
                        className="bg-blue-900/50 border-blue-700"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={addSocialConnection}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddingConnection(false)}
                        disabled={isLoading}
                        className="border-blue-500 text-blue-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isLoading && !isAddingConnection ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
                </div>
              ) : socialConnections.length > 0 ? (
                <div className="space-y-3">
                  {socialConnections.map((connection) => {
                    // Find the matching social channel for the icon
                    const channelInfo = socialChannels.find(
                      c => c.key === connection.platform
                    ) || socialChannels[0];
                    
                    return (
                      <div 
                        key={connection.id}
                        className="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-700/50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${channelInfo.color.split(' ')[0]}`}>
                            {channelInfo.icon}
                          </div>
                          <div>
                            <div className="font-medium">{connection.platform}</div>
                            <div className="text-sm text-blue-300">{connection.username}</div>
                          </div>
                          {connection.verified && (
                            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <Check className="h-3 w-3 mr-1" /> Verified
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {connection.profile_url && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(connection.profile_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => deleteSocialConnection(connection.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-blue-300 border border-dashed border-blue-700 rounded-md">
                  <Share2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No social accounts connected yet.</p>
                  {!isAddingConnection && (
                    <Button 
                      variant="link" 
                      className="mt-2 text-blue-300"
                      onClick={() => setIsAddingConnection(true)}
                    >
                      Connect your first account
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialChannels.map((channel, index) => (
            <Card 
              key={index} 
              className={`border backdrop-blur-md shadow-xl ${channel.color}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/70 p-2 rounded-lg">
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{channel.name}</h3>
                      <p className="text-xs text-blue-200">{channel.username}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="border-indigo-500 hover:bg-indigo-700"
                    onClick={() => window.open(channel.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle>Social Media Contest</CardTitle>
            <CardDescription>Share Praybit and win PRAY coins</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-200">
              Share Praybit on your social media accounts using #PraybitCoin for a chance to win 1,000 PRAY coins! Contest will begin once we officially launch.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full border-blue-500 text-blue-300">
              Contest Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Social;
