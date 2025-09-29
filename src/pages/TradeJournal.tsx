import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  contractType: string;
  stake: number;
  direction: 'rise' | 'fall' | 'even' | 'odd' | 'over' | 'under';
  result: 'win' | 'loss';
  payout: number;
  profit: number;
  strategy: string;
}

const TradeJournal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss'>('all');

  // Sample trade data
  const [trades] = useState<Trade[]>([
    {
      id: '1',
      timestamp: '2025-01-15 14:23:45',
      symbol: 'R_100',
      contractType: 'Digit Even',
      stake: 10,
      direction: 'even',
      result: 'win',
      payout: 19.50,
      profit: 9.50,
      strategy: 'Digit Distribution'
    },
    {
      id: '2',
      timestamp: '2025-01-15 14:28:12',
      symbol: 'R_100',
      contractType: 'Digit Odd',
      stake: 10,
      direction: 'odd',
      result: 'loss',
      payout: 0,
      profit: -10,
      strategy: 'Even/Odd Pattern'
    },
    {
      id: '3',
      timestamp: '2025-01-15 14:32:56',
      symbol: 'R_75',
      contractType: 'Rise',
      stake: 15,
      direction: 'rise',
      result: 'win',
      payout: 28.50,
      profit: 13.50,
      strategy: 'Market Movement'
    },
    {
      id: '4',
      timestamp: '2025-01-15 14:38:23',
      symbol: 'R_50',
      contractType: 'Digit Over 5',
      stake: 10,
      direction: 'over',
      result: 'win',
      payout: 19.20,
      profit: 9.20,
      strategy: 'Digit Distribution'
    },
    {
      id: '5',
      timestamp: '2025-01-15 14:45:11',
      symbol: 'R_100',
      contractType: 'Fall',
      stake: 12,
      direction: 'fall',
      result: 'loss',
      payout: 0,
      profit: -12,
      strategy: 'Market Movement'
    }
  ]);

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.contractType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResult === 'all' || trade.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.result === 'win').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const totalStake = trades.reduce((sum, t) => sum + t.stake, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trade Journal</h1>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Profit/Loss</p>
          <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
          <p className="text-3xl font-bold">{winRate.toFixed(1)}%</p>
        </Card>
        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
          <p className="text-3xl font-bold">{totalTrades}</p>
        </Card>
        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
          <p className="text-3xl font-bold">${totalStake.toFixed(2)}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 gradient-card border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol, contract type, or strategy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterResult === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterResult('all')}
            >
              <Filter className="w-4 h-4 mr-1" />
              All
            </Button>
            <Button
              variant={filterResult === 'win' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterResult('win')}
              className={filterResult === 'win' ? 'bg-success hover:bg-success/90' : ''}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Wins
            </Button>
            <Button
              variant={filterResult === 'loss' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterResult('loss')}
              className={filterResult === 'loss' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Losses
            </Button>
          </div>
        </div>
      </Card>

      {/* Trade Table */}
      <Card className="gradient-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Stake</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="font-mono text-sm">{trade.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{trade.symbol}</Badge>
                  </TableCell>
                  <TableCell>{trade.contractType}</TableCell>
                  <TableCell>${trade.stake.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trade.strategy}</TableCell>
                  <TableCell>
                    <Badge variant={trade.result === 'win' ? 'default' : 'destructive'}>
                      {trade.result === 'win' ? 'WIN' : 'LOSS'}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${
                    trade.profit >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {filteredTrades.length === 0 && (
        <Card className="p-12 gradient-card border-border text-center">
          <p className="text-muted-foreground">No trades found matching your filters</p>
        </Card>
      )}
    </div>
  );
};

export default TradeJournal;
