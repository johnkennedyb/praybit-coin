
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Coins, ArrowUpRight, Clock, RefreshCw } from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Stats = () => {
  const coinsData = [
    { day: 'Mon', coins: 120 },
    { day: 'Tue', coins: 180 },
    { day: 'Wed', coins: 150 },
    { day: 'Thu', coins: 210 },
    { day: 'Fri', coins: 290 },
    { day: 'Sat', coins: 350 },
    { day: 'Sun', coins: 410 },
  ];
  
  const priceData = [
    { name: 'Jan', price: 0.00001 },
    { name: 'Feb', price: 0.000012 },
    { name: 'Mar', price: 0.000018 },
    { name: 'Apr', price: 0.000015 },
    { name: 'May', price: 0.000025 },
    { name: 'Jun', price: 0.00003 },
    { name: 'Jul', price: 0.000035 },
  ];

  const coinStats = [
    { title: "Market Cap", value: "$1.2M", icon: <Coins className="h-5 w-5" />, change: "+5.2%" },
    { title: "Holders", value: "2,543", icon: <Users className="h-5 w-5" />, change: "+12.7%" },
    { title: "24h Volume", value: "$45,800", icon: <RefreshCw className="h-5 w-5" />, change: "-3.1%" },
    { title: "Avg. Hold Time", value: "32 days", icon: <Clock className="h-5 w-5" />, change: "+2.4%" },
  ];

  return (
    <AppLayout title="PRAY Stats">
      <div className="space-y-6">
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-yellow-400" />
              PRAY Price Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-gradient-to-br from-blue-900 to-blue-950">
              <div className="flex items-baseline mb-2">
                <div className="text-2xl font-bold">$0.000035</div>
                <div className="ml-2 text-sm text-green-400 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8.2%
                </div>
              </div>
              <div className="text-xs text-blue-300">Last updated: 15 May 2025, 14:30 UTC</div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e3a8a', 
                      borderColor: '#3b82f6',
                      color: '#white' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          {coinStats.map((stat, index) => (
            <Card key={index} className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-700/50 p-2 rounded-md">
                    {stat.icon}
                  </div>
                  <div className={`text-xs font-medium flex items-center ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-sm text-blue-200">{stat.title}</div>
                <div className="text-xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-blue-800/50 border-blue-700 backdrop-blur-md shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              Your Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coinsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e3a8a', 
                      borderColor: '#3b82f6',
                      color: '#white' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="coins" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ stroke: '#f59e0b', strokeWidth: 2, fill: '#1e3a8a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Stats;
