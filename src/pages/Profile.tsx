
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wallet, 
  User, 
  Mail, 
  Lock, 
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  ChevronRight,
  Settings,
  Send,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import TransferModal from "@/components/TransferModal";

const Profile = () => {
  const { account, praybitBalance, ethBalance, connectWallet } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showLoginForm, setShowLoginForm] = useState(true);
  
  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        setIsLoggedIn(true);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const copyWalletAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Praybit!",
      });
      
      setIsLoggedIn(true);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            name: registerForm.name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      // Auto switch to login form after successful registration
      setShowLoginForm(true);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      setIsLoggedIn(false);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };
  
  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to view wallet on block explorer
  const viewOnExplorer = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, '_blank');
    }
  };

  return (
    <AppLayout title="Profile">
      <div className="space-y-6">
        {!isLoggedIn ? (
          <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {showLoginForm ? "Login to Your Account" : "Create an Account"}
              </CardTitle>
              <CardDescription>
                {showLoginForm 
                  ? "Access your Praybit wallet and earn rewards" 
                  : "Join Praybit ecosystem and start earning"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>              
              {showLoginForm ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-blue-900/50 border-blue-700"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="link" onClick={toggleForm} className="w-full text-blue-300">
                {showLoginForm ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-yellow-400" />
                    Blockchain Wallet
                  </div>
                  <ConnectWalletButton />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {account ? (
                  <>
                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                      <div className="text-sm text-blue-200 mb-1">Wallet Address</div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm overflow-hidden text-ellipsis">
                          {account}
                        </div>
                        <Button variant="ghost" size="sm" onClick={copyWalletAddress}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                        <div className="text-xs text-blue-200">PRAY Balance</div>
                        <div className="font-bold text-xl">{praybitBalance} PRAY</div>
                      </div>
                      <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                        <div className="text-xs text-blue-200">ETH Balance</div>
                        <div className="font-bold text-xl">{parseFloat(ethBalance).toFixed(4)} ETH</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium"
                        onClick={viewOnExplorer}
                      >
                        View on Explorer
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <Button 
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
                        onClick={() => setShowTransferModal(true)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Transfer PRAY
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="bg-blue-900/30 rounded-full p-4 inline-block mx-auto">
                      <Wallet className="h-10 w-10 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-medium">Connect Your Wallet</h3>
                    <p className="text-sm text-blue-200">
                      Connect your MetaMask wallet to access your PRAY tokens and make transactions
                    </p>
                    <div className="pt-2">
                      <ConnectWalletButton 
                        variant="default"
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-0">
                <Button variant="ghost" className="w-full justify-between px-4 py-3 h-auto">
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-blue-400" />
                    <span>Personal Information</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="w-full justify-between px-4 py-3 h-auto">
                  <div className="flex items-center">
                    <Key className="mr-3 h-5 w-5 text-blue-400" />
                    <span>Security Settings</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="w-full justify-between px-4 py-3 h-auto">
                  <div className="flex items-center">
                    <Settings className="mr-3 h-5 w-5 text-blue-400" />
                    <span>Preferences</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>

            {/* Transfer Modal */}
            <TransferModal 
              isOpen={showTransferModal} 
              onClose={() => setShowTransferModal(false)} 
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
