import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "@/hooks/use-toast";

export interface TransferModalProps {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  balance: number;
}

const TransferModal = ({ onOpenChange, open, balance }: TransferModalProps) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!recipientAddress.trim()) {
      toast({
        title: "Recipient address required",
        description: "Please enter the recipient's address.",
        variant: "destructive",
      });
      return;
    }

    if (transferAmount <= 0) {
      toast({
        title: "Invalid transfer amount",
        description: "Please enter a valid amount to transfer.",
        variant: "destructive",
      });
      return;
    }

    if (transferAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You do not have enough PRAY tokens to transfer.",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      // Simulate transfer process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Transfer Successful",
        description: `${transferAmount} PRAY tokens have been sent to ${recipientAddress}.`,
      });

      onOpenChange(false);
      setRecipientAddress("");
      setTransferAmount(0);
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "There was an error processing your transfer.",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-blue-900/80 border-blue-700/50 backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Transfer PRAY Tokens</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the recipient's address and the amount of PRAY tokens to transfer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="address" className="text-right text-sm font-medium text-blue-300">
              Recipient Address
            </label>
            <Input
              id="address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="col-span-3 bg-blue-900/50 border-blue-700"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount" className="text-right text-sm font-medium text-blue-300">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="col-span-3 bg-blue-900/50 border-blue-700"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleTransfer} disabled={isTransferring}>
            {isTransferring ? "Transferring..." : "Transfer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TransferModal;
