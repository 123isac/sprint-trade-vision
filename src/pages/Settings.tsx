import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDerivAuth } from '@/hooks/useDerivAuth';
import { initiateDerivLogin } from '@/lib/deriv-auth';
import { Badge } from '@/components/ui/badge';
import { Trash2, Key } from 'lucide-react';

const Settings = () => {
  const { tokens, activeToken, logout } = useDerivAuth();
  const [defaultStake, setDefaultStake] = useState('10');
  const [takeProfit, setTakeProfit] = useState('100');
  const [stopLoss, setStopLoss] = useState('50');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Token Management */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Tokens
        </h2>
        
        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tokens connected</p>
            <Button onClick={initiateDerivLogin} className="glow-primary">
              Connect Deriv Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold">{token.loginId}</p>
                    <p className="text-sm text-muted-foreground">
                      {token.currency} {token.balance.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={token.accountType === 'demo' ? 'outline' : 'destructive'}>
                    {token.accountType === 'demo' ? 'DEMO' : 'REAL'}
                  </Badge>
                  {activeToken?.loginId === token.loginId && (
                    <Badge className="bg-success">Active</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Switch
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button onClick={initiateDerivLogin} variant="outline">
                Add Another Account
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout All
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Trading Defaults */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4">Default Trading Parameters</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stake">Default Stake</Label>
            <Input
              id="stake"
              type="number"
              value={defaultStake}
              onChange={(e) => setDefaultStake(e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp">Take Profit ($)</Label>
            <Input
              id="tp"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sl">Stop Loss ($)</Label>
            <Input
              id="sl"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="50"
            />
          </div>
        </div>
        <Button className="mt-4">Save Settings</Button>
      </Card>

      {/* Risk Management */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4">Risk Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Max Daily Loss</p>
              <p className="text-sm text-muted-foreground">Stop trading after daily loss limit</p>
            </div>
            <Input type="number" className="w-32" placeholder="200" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Max Consecutive Losses</p>
              <p className="text-sm text-muted-foreground">Pause bot after X losses in a row</p>
            </div>
            <Input type="number" className="w-32" placeholder="5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Stake Scaling</p>
              <p className="text-sm text-muted-foreground">Adjust stake after wins/losses</p>
            </div>
            <select className="px-3 py-2 bg-secondary border border-border rounded-md">
              <option value="flat">Flat</option>
              <option value="martingale">Martingale</option>
              <option value="anti-martingale">Anti-Martingale</option>
            </select>
          </div>
        </div>
        <Button className="mt-4">Save Risk Settings</Button>
      </Card>

      {/* About */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-2">About TradeSprint</h2>
        <p className="text-sm text-muted-foreground mb-2">Version 1.0.0</p>
        <p className="text-sm text-muted-foreground">
          Professional trading analysis and automation platform for Deriv markets.
        </p>
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive font-semibold">⚠️ Risk Warning</p>
          <p className="text-xs text-muted-foreground mt-1">
            Trading derivatives carries a high level of risk to your capital. Only trade with 
            funds you can afford to lose. Past performance does not guarantee future results.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
