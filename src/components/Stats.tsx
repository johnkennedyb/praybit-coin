
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, HandCoins, UserPlus } from "lucide-react";

interface StatsProps {
  coins: number;
  tapsCount: number;
  referrals: number;
}

const Stats = ({ coins, tapsCount, referrals }: StatsProps) => {
  return (
    <Card className="bg-blue-800 border-blue-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-400" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              PRAY Balance
            </span>
            <span className="font-semibold">{coins}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <HandCoins className="h-4 w-4 text-yellow-400" />
              Total Taps
            </span>
            <span className="font-semibold">{tapsCount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-yellow-400" />
              Referrals
            </span>
            <span className="font-semibold">{referrals}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;
