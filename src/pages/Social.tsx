
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Instagram, Youtube, Discord, Twitch, Github, ExternalLink } from "lucide-react";
import CoinScene from "@/components/CoinScene";

const Social = () => {
  const socialChannels = [
    {
      name: "Twitter",
      username: "@PraybitCoin",
      icon: <Twitter className="h-8 w-8 text-[#1DA1F2]" />,
      followers: "0",
      url: "https://twitter.com",
      color: "bg-[#1DA1F2]/10 border-[#1DA1F2]/20"
    },
    {
      name: "Discord",
      username: "Praybit Community",
      icon: <Discord className="h-8 w-8 text-[#5865F2]" />,
      followers: "0",
      url: "https://discord.com",
      color: "bg-[#5865F2]/10 border-[#5865F2]/20"
    },
    {
      name: "Instagram",
      username: "@praybitcoin",
      icon: <Instagram className="h-8 w-8 text-[#E4405F]" />,
      followers: "0",
      url: "https://instagram.com",
      color: "bg-[#E4405F]/10 border-[#E4405F]/20"
    },
    {
      name: "YouTube",
      username: "Praybit Official",
      icon: <Youtube className="h-8 w-8 text-[#FF0000]" />,
      followers: "0",
      url: "https://youtube.com",
      color: "bg-[#FF0000]/10 border-[#FF0000]/20"
    },
    {
      name: "GitHub",
      username: "praybit",
      icon: <Github className="h-8 w-8 text-white" />,
      followers: "0",
      url: "https://github.com",
      color: "bg-gray-700/10 border-gray-600/20"
    },
    {
      name: "Twitch",
      username: "praybitcoin",
      icon: <Twitch className="h-8 w-8 text-[#9146FF]" />,
      followers: "0",
      url: "https://twitch.tv",
      color: "bg-[#9146FF]/10 border-[#9146FF]/20"
    }
  ];

  return (
    <AppLayout title="Social Media">
      <div className="space-y-6">
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4 bg-gradient-to-r from-indigo-900 to-purple-900">
              <div className="flex-shrink-0 w-16 h-16">
                <CoinScene size="small" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-xl text-white">Praybit Coin</h3>
                <p className="text-blue-200 text-sm">@PraybitCoin</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-blue-100 mb-4">
                Join our growing community across all social media platforms! Get the latest updates, participate in discussions, and help us build the Praybit ecosystem.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-900 font-medium">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-800/40">
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialChannels.map((channel, index) => (
            <Card 
              key={index} 
              className={`border backdrop-blur-md shadow-xl ${channel.color}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/70 p-2 rounded-lg">
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{channel.name}</h3>
                      <p className="text-xs text-blue-200">{channel.username}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="border-indigo-500 hover:bg-indigo-700"
                    onClick={() => window.open(channel.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs text-blue-300">Coming soon</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-blue-800/50 border-blue-700/60 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle>Social Media Contest</CardTitle>
            <CardDescription>Share Praybit and win PRAY coins</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-200">
              Share Praybit on your social media accounts using #PraybitCoin for a chance to win 1,000 PRAY coins! Contest will begin once we officially launch.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full border-blue-500 text-blue-300">
              Contest Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Social;
