
import { useState } from "react";
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
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [walletAddress, setWalletAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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
  
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate with your backend
    if (email && password) {
      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would register with your backend
    const { name, email, password, confirmPassword } = registerForm;
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    if (name && email && password) {
      setIsLoggedIn(true);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
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

  return (
    <AppLayout title="Profile">
      <div className="space-y-6">
        {!isLoggedIn ? (
          <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
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
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium">
                    Login
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
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium">
                    Create Account
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
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-yellow-400" />
                  Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                  <div className="text-sm text-blue-200 mb-1">Wallet Address</div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm overflow-hidden text-ellipsis">
                      {walletAddress}
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyWalletAddress}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                    <div className="text-xs text-blue-200">Balance</div>
                    <div className="font-bold text-xl">285 PRAY</div>
                  </div>
                  <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                    <div className="text-xs text-blue-200">Value</div>
                    <div className="font-bold text-xl">$9.98</div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-blue-900 font-medium">
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
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
                  onClick={() => setIsLoggedIn(false)}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
