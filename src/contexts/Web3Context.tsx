import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, formatEther, Contract, parseEther } from 'ethers';
import { MetaMaskSDK } from '@metamask/sdk';
import { PRAYBIT_TOKEN_ABI, PRAYBIT_TOKEN_ADDRESS } from '@/lib/contracts/PraybitToken';
import { toast } from '@/hooks/use-toast';

interface Web3ContextType {
  account: string | null;
  chainId: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  praybitBalance: string;
  ethBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  transferPray: (to: string, amount: string) => Promise<boolean>;
  networkName: string;
}

const defaultContext: Web3ContextType = {
  account: null,
  chainId: null,
  signer: null,
  provider: null,
  praybitBalance: '0',
  ethBalance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  transferPray: async () => false,
  networkName: 'Unknown Network'
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

// Helper function to get network name from chainId
const getNetworkName = (chainId: string): string => {
  const networks: Record<string, string> = {
    '0x1': 'Ethereum Mainnet',
    '0x3': 'Ropsten',
    '0x4': 'Rinkeby',
    '0x5': 'Goerli',
    '0xaa36a7': 'Sepolia',
    '0x38': 'BNB Smart Chain',
    '0x89': 'Polygon',
    '0xa86a': 'Avalanche'
  };
  
  return networks[chainId] || `Chain ID: ${chainId}`;
};

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [praybitBalance, setPraybitBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState('Unknown Network');
  const [mmSDK] = useState(new MetaMaskSDK());

  const fetchBalances = async (address: string, currentSigner: JsonRpcSigner) => {
    try {
      // Get ETH balance
      const balance = await currentSigner.provider.getBalance(address);
      setEthBalance(formatEther(balance));

      // Get PRAY token balance using contract
      const contract = new Contract(PRAYBIT_TOKEN_ADDRESS, PRAYBIT_TOKEN_ABI, currentSigner);
      const tokenBalance = await contract.balanceOf(address);
      setPraybitBalance(formatEther(tokenBalance));
    } catch (error) {
      console.error("Error fetching balances:", error);
      setPraybitBalance('0'); // No dummy data, default to zero
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension to connect.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsConnecting(true);
      // Request account access
      const ethereum = mmSDK.getProvider();
      await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create ethers provider and signer
      const newProvider = new BrowserProvider(ethereum);
      const newSigner = await newProvider.getSigner();
      const newAddress = await newSigner.getAddress();
      
      // Fix TypeScript error: Ensure chainId is a string
      const chainIdValue = await ethereum.request({ method: 'eth_chainId' });
      const chainIdString = typeof chainIdValue === 'string' ? chainIdValue : String(chainIdValue);
      
      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(newAddress);
      setChainId(chainIdString);
      setNetworkName(getNetworkName(chainIdString));
      
      // Fetch balances
      await fetchBalances(newAddress, newSigner);

      // Setup event listeners
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected!",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    setPraybitBalance('0');
    setEthBalance('0');
    setNetworkName('Unknown Network');
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      if (signer) {
        await fetchBalances(accounts[0], signer);
      }
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    // Ensure chainId is a string before setting state
    const chainIdString = typeof chainIdHex === 'string' ? chainIdHex : String(chainIdHex);
    setChainId(chainIdString);
    setNetworkName(getNetworkName(chainIdString));
    window.location.reload();
  };

  const transferPray = async (to: string, amount: string): Promise<boolean> => {
    if (!signer || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make transfers.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const contract = new Contract(PRAYBIT_TOKEN_ADDRESS, PRAYBIT_TOKEN_ABI, signer);
      const parsedAmount = parseEther(amount);
      
      // Show pending toast
      toast({
        title: "Transfer Initiated",
        description: `Sending ${amount} P to ${to.substring(0, 6)}...`,
      });
      
      const tx = await contract.transfer(to, parsedAmount);
      await tx.wait();
      
      // Update balance after successful transfer
      await fetchBalances(account, signer);
      
      toast({
        title: "Transfer Successful",
        description: `Successfully sent ${amount} P to ${to.substring(0, 6)}...`,
      });
      
      return true;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer tokens. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethereum = window.ethereum;
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            // User is already connected, set up the connection
            const newProvider = new BrowserProvider(ethereum);
            const newSigner = await newProvider.getSigner();
            const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
            
            setProvider(newProvider);
            setSigner(newSigner);
            setAccount(accounts[0]);
            setChainId(chainIdHex);
            setNetworkName(getNetworkName(chainIdHex));
            
            // Fetch balances
            await fetchBalances(accounts[0], newSigner);
            
            // Setup event listeners
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const value = {
    account,
    chainId,
    signer,
    provider,
    praybitBalance,
    ethBalance,
    connectWallet,
    disconnectWallet,
    isConnecting,
    transferPray,
    networkName
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
