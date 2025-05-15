
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, Network } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showNetwork?: boolean;
}

export default function ConnectWalletButton({ 
  variant = "default", 
  size = "default",
  className = "",
  showNetwork = true
}: ConnectWalletButtonProps) {
  const { account, connectWallet, disconnectWallet, isConnecting, networkName } = useWeb3();
  
  if (account) {
    // Wallet is connected - show address and disconnect button
    const shortAddress = `${account.slice(0, 6)}...${account.slice(-4)}`;
    
    return (
      <div className="flex items-center gap-2">
        {showNetwork && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-900/50 border border-blue-700">
                <Network className="h-3 w-3" />
                <span className="max-w-[100px] truncate">{networkName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connected to {networkName}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Button
          variant="outline"
          size={size}
          onClick={disconnectWallet}
          className={`border-blue-500 hover:bg-blue-800 group ${className}`}
        >
          <span className="text-blue-200 group-hover:hidden">{shortAddress}</span>
          <LogOut className="hidden group-hover:block h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={connectWallet}
      disabled={isConnecting}
      className={`${className} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
