
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ReferralSystemProps {
  onRefer: () => void;
  referralCount: number;
}

const ReferralSystem = ({ onRefer, referralCount }: ReferralSystemProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm">Invite friends and earn PRAY coins for each referral.</p>
      
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
          onClick={onRefer}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Generate Referral Link
        </Button>
      </div>
      
      <div className="text-center pt-2">
        <p className="text-xs text-blue-300">Total Referrals: {referralCount}</p>
      </div>
    </div>
  );
};

export default ReferralSystem;
