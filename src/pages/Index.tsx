
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Rocket, ChevronRight, ChartNetwork, Zap, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Coin3D from "@/components/Coin3D";

const Index = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalHolders, setTotalHolders] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Fetch stats from Supabase
    const fetchStats = async () => {
      try {
        // Count users in auth.users table
        const { count: userCount, error: userError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Count holders (users with wallet connected)
        const { count: holderCount, error: holderError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .not('wallet_address', 'is', null);
          
        if (holderError) throw holderError;
        
        setTotalUsers(userCount || 0);
        setTotalHolders(holderCount || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Use placeholder values if error occurs
        setTotalUsers(0);
        setTotalHolders(0);
      }
    };
    
    fetchStats();
  }, []);
  
  const handleCoinClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const stats = [
    { 
      label: "Total Users", 
      value: totalUsers !== null ? totalUsers.toString() : "Loading...", 
      icon: <Users className="h-5 w-5 text-blue-400" /> 
    },
    { 
      label: "Market Cap", 
      value: "Coming Soon", 
      icon: <Coins className="h-5 w-5 text-yellow-400" /> 
    },
    { 
      label: "Holders", 
      value: totalHolders !== null ? totalHolders.toString() : "Loading...", 
      icon: <Users className="h-5 w-5 text-green-400" /> 
    },
  ];
  
  const features = [
    {
      title: "Earn PRAY",
      description: "Tap to earn PRAY coins and complete tasks for rewards",
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      link: "/earn"
    },
    {
      title: "Referrals",
      description: "Invite friends and earn rewards for each referral (Coming Soon)",
      icon: <ChartNetwork className="h-8 w-8 text-blue-400" />,
      link: "/referral"
    },
    {
      title: "Social Media",
      description: "Connect with the PRAY community on social media",
      icon: <Rocket className="h-8 w-8 text-purple-400" />,
      link: "/social"
    }
  ];

  return (
    <AppLayout showHeader={false}>
      <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)]">
        {/* Hero Section with better coin placement */}
        <div className="py-8 text-center">
          <div className="mx-auto w-64 h-64 mb-6 flex items-center justify-center">
            <Coin3D isAnimating={isAnimating} onClick={handleCoinClick} />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Praybit Coin
          </h1>
          
          <p className="text-blue-200 max-w-md mx-auto mt-2">
            The community-driven meme coin with real utility. Earn, trade, and transact with PRAY.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
              <Link to="/earn">
                <Zap className="mr-2 h-4 w-4" />
                Start Earning
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-indigo-500 hover:bg-indigo-700">
              <Link to="/profile">Sign Up</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-indigo-800/40 border-indigo-700/60 backdrop-blur-md shadow-xl">
              <CardContent className="p-3 text-center">
                <div className="flex justify-center mb-1">
                  {stat.icon}
                </div>
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs text-blue-300">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="space-y-4 mb-6">
          {features.map((feature, i) => (
            <Link key={i} to={feature.link}>
              <Card className="bg-indigo-800/40 border-indigo-700/60 backdrop-blur-md shadow-xl hover:bg-indigo-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-900/70 p-2 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-xs text-blue-200">{feature.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-blue-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-indigo-700/60 shadow-xl mb-8">
          <CardContent className="p-5 text-center">
            <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Join the Community</h3>
            <p className="text-sm text-blue-100 mb-4">
              Sign up now and be part of the PRAY ecosystem.
            </p>
            <Button asChild variant="outline" className="border-white/40 bg-white/10 hover:bg-white/20">
              <Link to="/profile">
                Create Account
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
