
import { Link } from "react-router-dom";
import { Coins, ArrowLeft, Wallet, Bitcoin, Link2, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const About = () => {
  return (
    <AppLayout title="About PRAY">
      <div className="space-y-6 pb-6">
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-yellow-400" />
              What is Praybit Coin?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-blue-100">
              Praybit Coin (PRAY) is a digital currency designed for fun, community engagement, and real-world utility. 
              It's a blockchain-based meme coin that rewards users for their interactions and participation.
            </p>
            <p className="text-blue-100">
              Our mission is to create an engaging ecosystem where users can earn, trade, and use PRAY tokens
              in a friendly and accessible environment, even for those new to cryptocurrency.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-yellow-400" />
                Tokenomics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { label: "Total Supply", value: "1,000,000,000 PRAY" },
                  { label: "Circulating Supply", value: "250,000,000 PRAY" },
                  { label: "Community Rewards", value: "40%" },
                  { label: "Development Fund", value: "30%" },
                  { label: "Marketing", value: "20%" },
                  { label: "Team", value: "10%" }
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-blue-900/30 p-3 rounded-md">
                    <span className="text-blue-200">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-yellow-400" />
                Blockchain Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { label: "Network", value: "Ethereum" },
                  { label: "Token Type", value: "ERC-20" },
                  { label: "Smart Contract", value: "0x71C7656E..." },
                  { label: "Block Explorer", value: "Etherscan" },
                  { label: "Liquidity", value: "Locked for 1 year" }
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-blue-900/30 p-3 rounded-md">
                    <span className="text-blue-200">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-yellow-400" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-blue-600 pl-6 pb-3 space-y-8">
              {[
                { quarter: "Q2 2025", milestone: "Launch of Praybit Coin and web application", current: true },
                { quarter: "Q3 2025", milestone: "Listing on decentralized exchanges" },
                { quarter: "Q4 2025", milestone: "Mobile app release and NFT integration" },
                { quarter: "Q1 2026", milestone: "Cross-chain expansion and merchant partnerships" }
              ].map((phase, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full ${phase.current ? 'bg-yellow-500' : 'bg-blue-600'} text-white`}>
                    {i + 1}
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded-md">
                    <h3 className="text-lg font-bold">{phase.quarter}</h3>
                    <p className="text-sm text-blue-200">{phase.milestone}</p>
                    {phase.current && (
                      <div className="mt-2 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs text-green-500">Current Phase</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
