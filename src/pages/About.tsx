
import { Link } from "react-router-dom";
import { Coins, ArrowLeft, Wallet, Bitcoin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Praybit Coin</h1>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </header>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-blue-800 border-blue-700 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bitcoin className="h-6 w-6 text-yellow-400" />
                What is Praybit Coin?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p>
                Praybit Coin (PRAY) is a digital currency designed for fun, community engagement, and real-world utility. 
                It's a blockchain-based meme coin that rewards users for their interactions and participation.
              </p>
              <p>
                Our mission is to create an engaging ecosystem where users can earn, trade, and use PRAY tokens
                in a friendly and accessible environment, even for those new to cryptocurrency.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-blue-800 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-yellow-400" />
                  Tokenomics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Total Supply: 1,000,000,000 PRAY</li>
                  <li>• Circulating Supply: 250,000,000 PRAY</li>
                  <li>• Community Rewards: 40%</li>
                  <li>• Development Fund: 30%</li>
                  <li>• Marketing: 20%</li>
                  <li>• Team: 10%</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-800 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-yellow-400" />
                  Blockchain Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Network: Ethereum</li>
                  <li>• Token Type: ERC-20</li>
                  <li>• Smart Contract: 0x...</li>
                  <li>• Block Explorer: Etherscan</li>
                  <li>• Liquidity: Locked for 1 year</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-800 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-yellow-400" />
                Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-blue-600 pl-6 pb-6 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">1</div>
                  <h3 className="text-lg font-bold">Q2 2025</h3>
                  <p className="text-sm text-blue-200">Launch of Praybit Coin and web application</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">2</div>
                  <h3 className="text-lg font-bold">Q3 2025</h3>
                  <p className="text-sm text-blue-200">Listing on decentralized exchanges</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">3</div>
                  <h3 className="text-lg font-bold">Q4 2025</h3>
                  <p className="text-sm text-blue-200">Mobile app release and NFT integration</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">4</div>
                  <h3 className="text-lg font-bold">Q1 2026</h3>
                  <p className="text-sm text-blue-200">Cross-chain expansion and merchant partnerships</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
