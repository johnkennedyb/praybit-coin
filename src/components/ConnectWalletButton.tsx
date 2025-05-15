
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function ConnectWalletButton({ 
  variant = "default", 
  size = "default",
  className = ""
}: ConnectWalletButtonProps) {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  
  if (account) {
    // Wallet is connected - show address and disconnect button
    const shortAddress = `${account.slice(0, 6)}...${account.slice(-4)}`;
    
    return (
      <Button
        variant="outline"
        size={size}
        onClick={disconnectWallet}
        className={`border-blue-500 hover:bg-blue-800 group ${className}`}
      >
        <span className="text-blue-200 group-hover:hidden">{shortAddress}</span>
        <LogOut className="hidden group-hover:block h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={connectWallet}
      disabled={isConnecting}
      className={className}
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
