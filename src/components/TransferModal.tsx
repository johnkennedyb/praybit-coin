
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from '@/hooks/use-toast';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  
  const { transferPray, praybitBalance } = useWeb3();
  
  const handleTransfer = async () => {
    // Validate input
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (Number(amount) > Number(praybitBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough PRAY tokens",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransferring(true);
    
    try {
      const success = await transferPray(recipient, amount);
      
      if (success) {
        onClose();
        setRecipient('');
        setAmount('');
      }
    } finally {
      setIsTransferring(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-blue-800/90 border-blue-700 backdrop-blur-md text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-yellow-400">Transfer PRAY Tokens</DialogTitle>
          <DialogDescription className="text-blue-200">
            Send PRAY tokens to another wallet address
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="bg-blue-900/50 border-blue-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                type="number"
                min="0"
                step="any"
                className="bg-blue-900/50 border-blue-700 text-white pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-yellow-400">
                PRAY
              </div>
            </div>
            <p className="text-xs text-blue-300">Available: {praybitBalance} PRAY</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-blue-500 text-blue-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isTransferring}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
          >
            {isTransferring ? "Transferring..." : "Transfer PRAY"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
