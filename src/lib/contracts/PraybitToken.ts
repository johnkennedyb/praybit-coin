
// ABI for the Praybit Token smart contract
export const PRAYBIT_TOKEN_ABI = [
  // ERC-20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Additional token functions
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 amount)"
];

// Ethereum Mainnet contract address - you would replace this with your actual deployed contract address
export const PRAYBIT_TOKEN_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

// Testnet contract addresses for development
export const TESTNET_CONTRACT_ADDRESSES = {
  goerli: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  sepolia: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  mumbai: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};
