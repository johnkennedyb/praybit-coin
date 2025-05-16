
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Check, Link as LinkIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";

interface ReferralSystemProps {
  onRefer: () => void;
  referralCount: number;
}

const ReferralSystem = ({ onRefer, referralCount }: ReferralSystemProps) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();

  // Fetch existing referral code or generate new one when user is loaded
  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!user) return;
      
      try {
        // Check if user already has a referral code
        const { data: existingReferrals, error } = await supabase
          .from('referrals')
          .select('code')
          .eq('referrer_id', user.id)
          .limit(1);
        
        if (error) throw error;

        if (existingReferrals && existingReferrals.length > 0) {
          setReferralCode(existingReferrals[0].code);
          setReferralLink(`${window.location.origin}?ref=${existingReferrals[0].code}`);
        }
      } catch (error: any) {
        console.error('Error fetching referral code:', error.message);
      }
    };

    fetchReferralCode();
  }, [user]);

  const generateReferralCode = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a referral link",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the generate_referral_code function via RPC
      const { data, error } = await supabase.rpc('generate_referral_code', {
        user_id: user.id
      });
      
      if (error) throw error;
      
      if (data) {
        setReferralCode(data);
        setReferralLink(`${window.location.origin}?ref=${data}`);
        onRefer();
        
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "Share this link with your friends.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">Invite friends and earn PRAY coins for each referral.</p>
      
      {!referralCode ? (
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
            onClick={generateReferralCode}
            disabled={isLoading}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Referral Link"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input 
              value={referralLink}
              readOnly
              className="bg-indigo-900/30 border-indigo-700"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="border-indigo-600 text-indigo-400 hover:bg-indigo-800"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-blue-300 p-2 bg-blue-900/30 rounded-md border border-blue-700/50">
            <div className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <span>Your referral code: <span className="font-mono">{referralCode}</span></span>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-6 text-xs text-blue-300 hover:text-blue-100 p-1"
              onClick={() => window.open(`${window.location.origin}/referral`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-center pt-2">
        <p className="text-xs text-blue-300">Total Referrals: {referralCount}</p>
      </div>
    </div>
  );
};

export default ReferralSystem;
