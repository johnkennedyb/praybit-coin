
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import { Coins, UserIcon, LogOut, Settings, Check, Copy, Loader2, Plus, ExternalLink } from "lucide-react";
import CoinScene from "@/components/CoinScene";
import { usePrayData } from "@/hooks/use-pray-data";
import TransferModal from "@/components/TransferModal";

interface UserProfile {
  username: string;
  bio: string;
}

const Profile = () => {
  const { user, signOut } = useSupabase();
  const { data: prayData } = usePrayData();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    bio: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    username: '',
    bio: ''
  });
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // For demo purpose, let's simulate profile data without actual database table
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Simulate profile data since we don't have a profiles table yet
        const username = user.email?.split('@')[0] || 'anonymous';
        const simulatedProfile = {
          username,
          bio: `Hello, I'm ${username}! I'm excited about PRAY tokens.`
        };
        
        setProfile(simulatedProfile);
        setEditedProfile(simulatedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate saving profile data
      // In a real app, this would update a profiles table
      setProfile(editedProfile);
      setEditMode(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing out.",
        variant: "destructive",
      });
    }
  };

  // Non-authenticated view
  if (!user) {
    return (
      <AppLayout title="Profile">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Card className="w-full max-w-md bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to view and manage your profile.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium"
                onClick={() => {
                  // Open login dialog logic would go here
                  // For now, just show a toast
                  toast({
                    title: "Authentication",
                    description: "Authentication dialog would open here.",
                  });
                }}
              >
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile">
      <div className="space-y-6 pb-16 pt-4">
        {/* Profile Card */}
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 pt-6 pb-8 px-6 flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-blue-700">
                <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                <AvatarFallback className="bg-blue-700">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <CoinScene size="small" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{profile.username}</h2>
            <p className="text-blue-200 text-sm">{user.email}</p>
          </div>
          
          <CardContent className="pt-6 pb-4 px-6">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-300 mb-1 block">Username</label>
                  <Input 
                    name="username"
                    value={editedProfile.username}
                    onChange={handleInputChange}
                    className="bg-blue-900/30 border-blue-700"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-blue-300 mb-1 block">Bio</label>
                  <Textarea 
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                    className="bg-blue-900/30 border-blue-700"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditedProfile(profile);
                      setEditMode(false);
                    }}
                    disabled={isLoading}
                    className="border-blue-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-blue-300 mb-1">Bio</p>
                  <p>{profile.bio}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(true)}
                  className="border-blue-700"
                >
                  Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Wallet Card */}
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Wallet</span>
              <Badge variant="outline" className="bg-blue-900/40 text-yellow-400 border-yellow-500/30">
                <Coins className="mr-1 h-3.5 w-3.5" /> 
                {prayData?.coins.toLocaleString() || 0} PRAY
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-blue-300 mb-2 block">Your PRAY Address</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-blue-900/30 p-2 rounded border border-blue-700 overflow-x-auto">
                  {user.id || '0x0000000000000000000000000000000000000000'}
                </code>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-blue-700"
                  onClick={() => {
                    navigator.clipboard.writeText(user.id || '');
                    toast({
                      title: "Address Copied",
                      description: "Your address has been copied to clipboard.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium"
                onClick={() => setIsTransferModalOpen(true)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Transfer PRAY
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Settings Card */}
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-yellow-400" /> 
              Account Settings
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-sm text-blue-300">
              <p>Email: {user.email}</p>
              <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            
            <Button 
              variant="outline" 
              className="border-red-500 text-red-400 hover:bg-red-950/30 hover:text-red-300"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <TransferModal 
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        balance={prayData?.coins || 0}
      />
    </AppLayout>
  );
};

export default Profile;
