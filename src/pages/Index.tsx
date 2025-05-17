
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import CoinTapper from "@/components/CoinTapper";
import CoinScene from "@/components/CoinScene";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/contexts/SupabaseContext";
import { usePrayData } from "@/hooks/use-pray-data";
import { toast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  const navigate = useNavigate();
  const { account, chainId } = useWeb3();
  const { user } = useSupabase();
  const { data, incrementTaps } = usePrayData();
  
  const handleTap = () => {
    incrementTaps();
    toast({
      title: "PRAY Mined!",
      description: `You earned ${data.miningPower} PRAY tokens`,
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <CoinScene />
      <header className="px-6 pt-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="sm:flex sm:justify-between sm:gap-4">
            <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Praybit
            </div>
            <div className="mt-4 flex justify-end gap-4 sm:mt-0">
              {user ? (
                <ConnectWalletButton showNetwork={false} />
              ) : (
                <Button onClick={() => navigate("/profile")}>
                  Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="relative mt-16 flex-grow px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Tap to earn PRAY tokens
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Join the Praybit ecosystem and start earning PRAY tokens by
              tapping the coin. The more you tap, the more you earn!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {account ? (
                <CoinTapper 
                  onTap={handleTap}
                  coins={data.coins || 0}
                  coinsPerTap={data.miningPower || 1}
                />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-blue-200 mb-3">
                    Connect your wallet to start earning!
                  </p>
                  <ConnectWalletButton />
                </div>
              )}
            </div>
          </div>
          <div className="mt-16 border-t border-blue-900/50 pt-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Why Choose Praybit?
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <TrendingUp className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Rewarding Experience
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Earn PRAY tokens simply by tapping the coin. It's fun and
                  rewarding!
                </p>
              </div>
              <div>
                <Zap className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Instant Gratification
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  See your PRAY token balance grow in real-time as you tap.
                </p>
              </div>
              <div>
                <Shield className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">Secure</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Your PRAY tokens are stored securely in your connected wallet.
                </p>
              </div>
              <div>
                <Users className="mx-auto h-10 w-10 text-yellow-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Community Driven
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  Join a vibrant community of PRAY token earners and
                  enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="relative mt-16 border-t border-blue-900/50 py-8 px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Praybit. All rights reserved.
        </div>
      </footer>
      <BottomNavigation />
    </div>
  );
};

export default Index;
