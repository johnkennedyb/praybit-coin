
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Rocket, ChevronRight, BarChart2, Zap, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const Index = () => {
  const stats = [
    { label: "Total Users", value: "12,354", icon: <Users className="h-5 w-5 text-blue-400" /> },
    { label: "Market Cap", value: "$1.2M", icon: <Coins className="h-5 w-5 text-yellow-400" /> },
    { label: "Holders", value: "2,543", icon: <BarChart2 className="h-5 w-5 text-green-400" /> },
  ];
  
  const features = [
    {
      title: "Earn PRAY",
      description: "Tap to earn PRAY coins and complete tasks for rewards",
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      link: "/earn"
    },
    {
      title: "Track Stats",
      description: "View your earnings and the PRAY market performance",
      icon: <BarChart2 className="h-8 w-8 text-blue-400" />,
      link: "/stats"
    },
    {
      title: "Telegram Bot",
      description: "Manage your PRAY coins on the go with our Telegram bot",
      icon: <Rocket className="h-8 w-8 text-purple-400" />,
      link: "/telegram"
    }
  ];

  return (
    <AppLayout showHeader={false}>
      <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)]">
        {/* Hero Section */}
        <div className="py-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 p-4 rounded-full shadow-lg shadow-yellow-600/20">
              <Coins className="h-12 w-12 text-blue-900" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Praybit Coin
          </h1>
          
          <p className="text-blue-200 max-w-md mx-auto">
            The community-driven meme coin with real utility. Earn, trade, and transact with PRAY.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium">
              <Link to="/earn">
                <Zap className="mr-2 h-4 w-4" />
                Start Earning
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-500">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
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
              <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl hover:bg-blue-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-900/70 p-2 rounded-lg">
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
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700 shadow-xl mb-8">
          <CardContent className="p-5 text-center">
            <h3 className="font-bold text-xl mb-2">Join the Community</h3>
            <p className="text-sm text-blue-100 mb-4">
              Be part of the PRAY ecosystem and help shape its future.
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
