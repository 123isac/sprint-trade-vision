import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Play, Pause, Settings as SettingsIcon, TrendingUp } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  winRate: number;
  totalTrades: number;
  profit: number;
}

const Bots = () => {
  const [strategies] = useState<Strategy[]>([
    {
      id: 'digit-analysis',
      name: 'Digit Distribution Strategy',
      description: 'Trades based on digit frequency analysis and pattern recognition',
      status: 'stopped',
      winRate: 68,
      totalTrades: 147,
      profit: 245.50
    },
    {
      id: 'even-odd',
      name: 'Even/Odd Pattern',
      description: 'Analyzes even/odd digit patterns for entry signals',
      status: 'stopped',
      winRate: 62,
      totalTrades: 89,
      profit: 123.20
    },
    {
      id: 'rise-fall',
      name: 'Market Movement',
      description: 'Trades based on rise/fall momentum and trend analysis',
      status: 'stopped',
      winRate: 71,
      totalTrades: 203,
      profit: 387.90
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Bots</h1>
        <Button className="glow-primary">
          <Bot className="w-4 h-4 mr-2" />
          Create New Strategy
        </Button>
      </div>

      {/* Strategy Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-6 gradient-card border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={
                  strategy.status === 'active' ? 'default' : 
                  strategy.status === 'paused' ? 'secondary' : 
                  'outline'
                }>
                  {strategy.status}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedStrategy(strategy.id)}>
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="font-semibold mb-2">{strategy.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="font-semibold text-success">{strategy.winRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trades</p>
                <p className="font-semibold">{strategy.totalTrades}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className={`font-semibold ${strategy.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ${strategy.profit.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-success hover:bg-success/90">
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Strategy Configuration */}
      {selectedStrategy && (
        <Card className="p-6 gradient-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Strategy Configuration</h2>
            <Button variant="outline" onClick={() => setSelectedStrategy(null)}>
              Close
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Trading Symbol</Label>
                <select id="symbol" className="w-full px-3 py-2 bg-secondary border border-border rounded-md">
                  <option value="R_100">Volatility 100</option>
                  <option value="R_75">Volatility 75</option>
                  <option value="R_50">Volatility 50</option>
                  <option value="R_25">Volatility 25</option>
                  <option value="R_10">Volatility 10</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract-type">Contract Type</Label>
                <select id="contract-type" className="w-full px-3 py-2 bg-secondary border border-border rounded-md">
                  <option value="DIGITEVEN">Digit Even</option>
                  <option value="DIGITODD">Digit Odd</option>
                  <option value="DIGITOVER">Digit Over</option>
                  <option value="DIGITUNDER">Digit Under</option>
                  <option value="DIGITMATCH">Digit Matches</option>
                  <option value="DIGITDIFF">Digit Differs</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Ticks)</Label>
                <Input id="duration" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stake">Stake Amount</Label>
                <Input id="stake" type="number" defaultValue="10" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confidence">Min Confidence %</Label>
                <Input id="confidence" type="number" defaultValue="65" />
                <p className="text-xs text-muted-foreground">
                  Only trade when strategy confidence is above this threshold
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-tp">Session Take Profit ($)</Label>
                <Input id="session-tp" type="number" defaultValue="100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-sl">Session Stop Loss ($)</Label>
                <Input id="session-sl" type="number" defaultValue="50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-losses">Max Consecutive Losses</Label>
                <Input id="max-losses" type="number" defaultValue="5" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button className="flex-1">
              Save Configuration
            </Button>
            <Button variant="outline" className="flex-1">
              Test Strategy
            </Button>
          </div>
        </Card>
      )}

      {/* Performance Summary */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Overall Performance
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
            <p className="text-2xl font-bold text-success">$756.60</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
            <p className="text-2xl font-bold">67%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
            <p className="text-2xl font-bold">439</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active Strategies</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Bots;
