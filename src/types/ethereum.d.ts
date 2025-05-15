
interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<any>;
  on: (eventName: string, listener: (...args: any[]) => void) => void;
  removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
}

interface Window {
  ethereum?: Ethereum;
}
