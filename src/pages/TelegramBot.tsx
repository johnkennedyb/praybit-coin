
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, ArrowRight, Send, Bot, Copy, Check } from "lucide-react";

const TelegramBot = () => {
  const [copied, setCopied] = useState(false);
  const botUsername = "@PraybitBot";
  
  const copyBotUsername = () => {
    navigator.clipboard.writeText(botUsername);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const commands = [
    { cmd: "/start", desc: "Start the bot and get a welcome message" },
    { cmd: "/balance", desc: "Check your PRAY coin balance" },
    { cmd: "/earn", desc: "View ways to earn more PRAY coins" },
    { cmd: "/transfer", desc: "Transfer PRAY coins to another user" },
    { cmd: "/price", desc: "Check current PRAY coin price" },
    { cmd: "/help", desc: "Get list of available commands" }
  ];

  return (
    <AppLayout title="Telegram Bot">
      <div className="space-y-6">
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              Praybit Telegram Bot
            </CardTitle>
            <CardDescription>
              Use our Telegram bot to manage your PRAY coins on the go
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-blue-900/50 p-4 rounded-lg border border-blue-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                <span className="font-mono">{botUsername}</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyBotUsername}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            
            <div className="relative">
              <a 
                href="https://t.me/praybitbot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium p-3 rounded-lg text-center transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Open in Telegram
                  <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Available Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commands.map((command, index) => (
              <div key={index} className="bg-blue-900/50 p-3 rounded-lg border border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-blue-300">{command.cmd}</div>
                  <div className="text-sm">{command.desc}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Send Test Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Type your command here..." 
                className="bg-blue-900/50 border-blue-700 focus-visible:ring-yellow-500"
              />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-blue-300">
            Note: This is a simulated interface. Use the actual Telegram bot for real interactions.
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TelegramBot;
