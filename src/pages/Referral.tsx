
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/AppLayout";
import { usePrayData } from "@/hooks/use-pray-data";
import { ShareNetwork, Copy, Check, Twitter, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      variant: "success",
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
              <ShareNetwork className="h-5 w-5 text-yellow-400" />
              Referral Program
            </CardTitle>
            <CardDescription className="text-blue-200">
              Invite friends to earn PRAY coins. Get 10 PRAY for each successful referral!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-indigo-900/40 rounded-lg border border-indigo-700/60 text-center">
              <div className="text-3xl font-bold text-yellow-400">{data.referrals}</div>
              <div className="text-sm text-blue-200">Total Referrals</div>
              <div className="text-xs text-blue-300 mt-1">
                You've earned {data.referrals * 10} PRAY coins from referrals
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-2">
                <Input 
                  value={referralLink}
                  readOnly
                  className="bg-indigo-900/40 border-indigo-700/60 text-blue-100"
                />
                <Button onClick={copyToClipboard} variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 pt-2">
              {shareOptions.map((option) => (
                <Button 
                  key={option.name}
                  onClick={option.action}
                  variant="outline" 
                  size="sm"
                  className="border-indigo-600 bg-indigo-800/40 hover:bg-indigo-700/60"
                >
                  {option.icon}
                  <span className="ml-2">{option.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-900/70 p-2 rounded-full">
                <LinkIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium">Share Your Link</h3>
                <p className="text-sm text-blue-200">Copy your unique referral link and share it with friends</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-indigo-900/70 p-2 rounded-full">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium">Friends Join</h3>
                <p className="text-sm text-blue-200">When friends click your link and join Praybit</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-indigo-900/70 p-2 rounded-full">
                <Coins className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium">Earn Rewards</h3>
                <p className="text-sm text-blue-200">You earn 10 PRAY coins for each successful referral</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-indigo-700/60">
              <Button onClick={simulateReferral} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
                <ShareNetwork className="mr-2 h-4 w-4" />
                Simulate a Referral
              </Button>
              <p className="text-xs text-center mt-2 text-blue-300">
                For testing purposes: Click to simulate a friend using your referral link
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Referral;
