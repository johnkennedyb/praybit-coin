
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/AppLayout";
import { usePrayData } from "@/hooks/use-pray-data";
import { ChartNetwork, Copy, Check, Twitter, Facebook, Mail, Link as LinkIcon, UserPlus, Coins, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/contexts/SupabaseContext";

const Referral = () => {
  const { data, incrementReferrals } = usePrayData();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useSupabase();
  
  const referralLink = referralCode ? `${window.location.origin}?ref=${referralCode}` : "";
  
  // Process incoming referral code from URL if user is new
  useEffect(() => {
    const processIncomingReferral = async () => {
      const refCode = searchParams.get('ref');
      
      if (refCode && user) {
        try {
          // Check if the user was just created (within the last minute)
          const userCreatedAt = new Date(user.created_at);
          const now = new Date();
          const isNewUser = (now.getTime() - userCreatedAt.getTime()) < 60000; // 1 minute
          
          if (isNewUser) {
            const { data, error } = await supabase.rpc('process_referral', {
              referral_code: refCode,
              new_user_id: user.id
            });
            
            if (error) throw error;
            
            if (data === true) {
              toast({
                title: "Referral successful!",
                description: "You've been added as a referral.",
              });
            }
          }
        } catch (error: any) {
          console.error('Error processing referral:', error.message);
        }
      }
    };
    
    processIncomingReferral();
  }, [searchParams, user, toast]);
  
  // Load user's referral code and referrals
  useEffect(() => {
    const loadReferralData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get user's referral code
        const { data: codeData, error: codeError } = await supabase
          .from('referrals')
          .select('code')
          .eq('referrer_id', user.id)
          .limit(1);
        
        if (codeError) throw codeError;
        
        if (codeData && codeData.length > 0) {
          setReferralCode(codeData[0].code);
        }
        
        // Get list of completed referrals
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .eq('status', 'completed');
        
        if (referralsError) throw referralsError;
        
        if (referralsData) {
          setReferrals(referralsData);
        }
      } catch (error: any) {
        console.error('Error loading referral data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReferralData();
  }, [user]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "Share this link with your friends.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const generateReferralCode = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a referral link",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_referral_code', {
        user_id: user.id
      });
      
      if (error) throw error;
      
      if (data) {
        setReferralCode(data);
        incrementReferrals();
        
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const shareOptions = [
    { 
      name: "Twitter", 
      icon: <Twitter className="h-5 w-5" />, 
      action: () => window.open(`https://twitter.com/intent/tweet?text=Join%20me%20on%20Praybit%20Coin!%20${encodeURIComponent(referralLink)}`)
    },
    { 
      name: "Facebook", 
      icon: <Facebook className="h-5 w-5" />, 
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`)
    },
    { 
      name: "Email", 
      icon: <Mail className="h-5 w-5" />, 
      action: () => window.open(`mailto:?subject=Join%20me%20on%20Praybit%20Coin!&body=${encodeURIComponent(referralLink)}`)
    },
  ];

  return (
    <AppLayout title="Referral Program">
      <div className="space-y-6">
        {!user ? (
          <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartNetwork className="h-5 w-5 text-yellow-400" />
                Referral Program
              </CardTitle>
              <CardDescription className="text-blue-200">
                Sign up or log in to access the referral program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 border border-dashed border-blue-500/50 rounded-md text-center bg-blue-900/30">
                <h3 className="font-medium text-lg mb-2">Access Referral Program</h3>
                <p className="text-blue-200 text-sm mb-3">
                  Sign up or log in to create your referral link and start earning rewards.
                </p>
                <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
                  <Link to="/profile">Sign Up Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartNetwork className="h-5 w-5 text-yellow-400" />
                  Your Referral Link
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Share your link and earn PRAY coins for each new user who joins.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="py-4 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  </div>
                ) : referralCode ? (
                  <>
                    <div className="flex gap-2">
                      <Input 
                        value={referralLink}
                        readOnly
                        className="bg-blue-900/50 border-blue-700"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-4 border border-blue-700/50 rounded-md bg-blue-900/30">
                      <h4 className="font-medium mb-3">Share on social media</h4>
                      <div className="flex gap-3 justify-center">
                        {shareOptions.map((option, index) => (
                          <Button 
                            key={index}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full border-blue-600"
                            onClick={option.action}
                          >
                            {option.icon}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-5 border border-dashed border-blue-500/50 rounded-md text-center">
                    <h3 className="font-medium mb-2">Generate Your Referral Link</h3>
                    <p className="text-blue-200 text-sm mb-4">
                      Create your unique referral link to share with friends.
                    </p>
                    <Button 
                      onClick={generateReferralCode}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Generate Referral Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-400" /> 
                  Your Referrals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="py-4 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
                  </div>
                ) : referrals.length > 0 ? (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div 
                        key={referral.id}
                        className="flex justify-between items-center p-3 bg-blue-900/30 border border-blue-700/50 rounded-md"
                      >
                        <div>
                          <div className="text-sm font-medium">Referral {referral.id.slice(0, 8)}</div>
                          <div className="text-xs text-blue-300">
                            {new Date(referral.used_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Coins className="h-4 w-4 mr-1" />
                          <span>+10 PRAY</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-300">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No referrals yet. Share your link to start earning!</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-blue-700/50 pt-4">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm">Total Referrals</div>
                  <div className="font-medium">{referrals.length}</div>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle>Referral Program Details</CardTitle>
                <CardDescription>How the PRAY coin referral program works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-900/70 p-2 rounded-full">
                    <LinkIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Share Your Link</h3>
                    <p className="text-sm text-blue-200">Generate and share your unique referral link</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-900/70 p-2 rounded-full">
                    <UserPlus className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Friends Join</h3>
                    <p className="text-sm text-blue-200">When friends sign up using your link</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-900/70 p-2 rounded-full">
                    <Coins className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Earn Rewards</h3>
                    <p className="text-sm text-blue-200">You'll earn 10 PRAY coins for each successful referral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Referral;
