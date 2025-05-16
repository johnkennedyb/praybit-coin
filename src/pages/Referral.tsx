import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/AppLayout";
import { usePrayData } from "@/hooks/use-pray-data";
import { ChartNetwork, Copy, Check, Twitter, Facebook, Mail, Link as LinkIcon, UserPlus, Coins } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Referral = () => {
  const { data, incrementReferrals } = usePrayData();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate unique referral link based on local storage data
  const generateReferralId = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${randomString}-pray`;
  };
  
  const [referralId] = useState(() => generateReferralId());
  const referralLink = `${window.location.origin}?ref=${referralId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Share this link with your friends.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const simulateReferral = () => {
    incrementReferrals();
    toast({
      title: "Referral simulated!",
      description: "You've earned 10 PRAY coins as a reward.",
      variant: "default",
    });
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
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartNetwork className="h-5 w-5 text-yellow-400" />
              Referral Program (Coming Soon)
            </CardTitle>
            <CardDescription className="text-blue-200">
              This feature will be available once you sign up and connect your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-5 border border-dashed border-blue-500/50 rounded-md text-center bg-blue-900/30">
              <h3 className="font-medium text-lg mb-2">Referral Program Coming Soon</h3>
              <p className="text-blue-200 text-sm mb-3">
                Our referral system will be activated soon. Sign up to be notified when it's ready.
              </p>
              <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
                <Link to="/profile">Sign Up Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">How it will work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-900/70 p-2 rounded-full">
                <LinkIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium">Share Your Link</h3>
                <p className="text-sm text-blue-200">You'll get a unique referral link to share with friends</p>
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
                <p className="text-sm text-blue-200">You'll earn PRAY coins for each successful referral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Referral;
