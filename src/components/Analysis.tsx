import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Tick {
  time: number;
  quote: number;
}

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=82991';

const Analysis = () => {
  const [tickHistory, setTickHistory] = useState<Tick[]>([]);
  const getInitialSymbol = () => localStorage.getItem('selectedSymbol') || 'R_100';
  const [currentSymbol, setCurrentSymbol] = useState(getInitialSymbol());
  const tickCount = 1000;
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const derivWsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const symbolOptions = [
    { value: "R_10", label: "Vol 10" },
    { value: "1HZ10V", label: "Vol 10 (1s)" },
    { value: "R_25", label: "Vol 25" },
    { value: "1HZ25V", label: "Vol 25 (1s)" },
    { value: "R_50", label: "Vol 50" },
    { value: "1HZ50V", label: "Vol 50 (1s)" },
    { value: "R_75", label: "Vol 75" },
    { value: "1HZ75V", label: "Vol 75 (1s)" },
    { value: "R_100", label: "Vol 100" },
    { value: "1HZ100V", label: "Vol 100 (1s)" },
    { value: "JD10", label: "Jump 10" },
    { value: "JD25", label: "Jump 25" },
    { value: "JD50", label: "Jump 50" },
    { value: "JD100", label: "Jump 100" },
    { value: "RDBEAR", label: "Bear Market" },
    { value: "RDBULL", label: "Bull Market" }
  ];

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (derivWsRef.current) derivWsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    if (derivWsRef.current) {
      derivWsRef.current.onclose = null;
      derivWsRef.current.close();
    }

    const ws = new WebSocket(WS_URL);
    derivWsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      requestTickHistory();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.history) {
        const newTickHistory = data.history.prices.map((price: string, index: number) => ({
          time: data.history.times[index],
          quote: parseFloat(price)
        }));
        setTickHistory(newTickHistory);
        detectDecimalPlaces(newTickHistory);
      } else if (data.tick) {
        const tickQuote = parseFloat(data.tick.quote);
        setTickHistory(prev => {
          const updated = [...prev, { time: data.tick.epoch, quote: tickQuote }];
          return updated.length > tickCount ? updated.slice(-tickCount) : updated;
        });
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 2000);
    };

    ws.onerror = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 2000);
    };
  };

  const requestTickHistory = () => {
    if (derivWsRef.current && derivWsRef.current.readyState === WebSocket.OPEN) {
      const request = {
        ticks_history: currentSymbol,
        count: tickCount,
        end: "latest",
        style: "ticks",
        subscribe: 1
      };
      derivWsRef.current.send(JSON.stringify(request));
    }
  };

  const detectDecimalPlaces = (history: Tick[]) => {
    if (history.length === 0) return;
    const decimalCounts = history.map(tick => {
      const decimalPart = tick.quote.toString().split(".")[1] || "";
      return decimalPart.length;
    });
    setDecimalPlaces(Math.max(...decimalCounts, 2));
  };

  const getLastDigit = (price: number): number => {
    const priceStr = price.toString();
    const priceParts = priceStr.split(".");
    let decimals = priceParts[1] || "";
    while (decimals.length < decimalPlaces) {
      decimals += "0";
    }
    return Number(decimals.slice(-1));
  };

  const getDigitAnalysis = () => {
    const digitCounts = new Array(10).fill(0);
    tickHistory.forEach(tick => {
      const lastDigit = getLastDigit(tick.quote);
      digitCounts[lastDigit]++;
    });
    return digitCounts.map(count => (count / tickHistory.length) * 100);
  };

  const getEvenOddAnalysis = () => {
    const digitCounts = new Array(10).fill(0);
    tickHistory.forEach(tick => {
      const lastDigit = getLastDigit(tick.quote);
      digitCounts[lastDigit]++;
    });
    const evenCount = digitCounts.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);
    const oddCount = digitCounts.filter((_, i) => i % 2 !== 0).reduce((a, b) => a + b, 0);
    const total = evenCount + oddCount;
    return {
      even: total > 0 ? (evenCount / total) * 100 : 0,
      odd: total > 0 ? (oddCount / total) * 100 : 0
    };
  };

  const getRiseFallAnalysis = () => {
    let riseCount = 0, fallCount = 0;
    for (let i = 1; i < tickHistory.length; i++) {
      if (tickHistory[i].quote > tickHistory[i - 1].quote) riseCount++;
      else if (tickHistory[i].quote < tickHistory[i - 1].quote) fallCount++;
    }
    const total = riseCount + fallCount;
    return {
      rise: total > 0 ? (riseCount / total) * 100 : 0,
      fall: total > 0 ? (fallCount / total) * 100 : 0
    };
  };

  const getSelectedDigitAnalysis = () => {
    if (selectedDigit === null) return { over: 0, under: 0, equal: 0 };
    let overCount = 0, underCount = 0, equalCount = 0;
    tickHistory.forEach(tick => {
      const lastDigit = getLastDigit(tick.quote);
      if (lastDigit > selectedDigit) overCount++;
      else if (lastDigit < selectedDigit) underCount++;
      else equalCount++;
    });
    const total = tickHistory.length;
    return {
      over: total > 0 ? (overCount / total) * 100 : 0,
      under: total > 0 ? (underCount / total) * 100 : 0,
      equal: total > 0 ? (equalCount / total) * 100 : 0
    };
  };

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
    localStorage.setItem('selectedSymbol', newSymbol);
    setTickHistory([]);
    setTimeout(() => {
      requestTickHistory();
    }, 500);
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (derivWsRef.current) derivWsRef.current.close();
    };
  }, [currentSymbol]);

  const digitAnalysis = getDigitAnalysis();
  const evenOddAnalysis = getEvenOddAnalysis();
  const riseFallAnalysis = getRiseFallAnalysis();
  const selectedDigitAnalysis = getSelectedDigitAnalysis();
  const currentPrice = tickHistory.length > 0 ? tickHistory[tickHistory.length - 1].quote : null;
  const currentDigit = currentPrice ? getLastDigit(currentPrice) : null;
  const maxPercentage = Math.max(...digitAnalysis);
  const minPercentage = Math.min(...digitAnalysis.filter(p => p > 0));
  const last50Digits = tickHistory.slice(-50).map(tick => getLastDigit(tick.quote));

  return (
    <div className="space-y-6">
      {/* Current Price & Market Selector */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Current Price</p>
          <p className="text-4xl font-bold">
            {currentPrice ? currentPrice.toFixed(decimalPlaces) : 'N/A'}
          </p>
          <Badge variant="outline" className="mt-2">
            {isConnected ? "● Live" : "○ Connecting..."}
          </Badge>
        </Card>

        <Card className="p-6 gradient-card border-border">
          <p className="text-sm text-muted-foreground mb-3">Market</p>
          <select
            value={currentSymbol}
            onChange={(e) => handleSymbolChange(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-4 py-2 text-foreground"
          >
            {symbolOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Card>
      </div>

      {/* Digit Distribution */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-6">Digit Distribution</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {digitAnalysis.map((percentage, digit) => {
            const isLowest = percentage === minPercentage && percentage > 0;
            const isHighest = percentage === maxPercentage && percentage > 0;
            const fillPercentage = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;
            return (
              <div key={digit} className="flex flex-col items-center gap-2">
                {digit === currentDigit && (
                  <div className="text-primary text-xs">▼</div>
                )}
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={isLowest ? "hsl(var(--destructive))" : isHighest ? "hsl(var(--success))" : "hsl(var(--primary))"}
                      strokeWidth="4"
                      strokeDasharray={`${(fillPercentage / 100) * 176} 176`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${
                      digit === currentDigit ? 'text-primary' : 
                      isLowest ? 'text-destructive' : 
                      isHighest ? 'text-success' : ''
                    }`}>
                      {digit}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  isLowest ? 'text-destructive' : 
                  isHighest ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Digit Comparison */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4">Digit Comparison</h2>
        <p className="text-sm text-muted-foreground mb-4">Select a digit to analyze:</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <Button
              key={digit}
              variant={selectedDigit === digit ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDigit(digit)}
              className={selectedDigit === digit ? "glow-primary" : ""}
            >
              {digit}
            </Button>
          ))}
        </div>
        {selectedDigit !== null && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-secondary border-success/30">
              <p className="text-2xl font-bold text-success">{selectedDigitAnalysis.over.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Over {selectedDigit}</p>
            </Card>
            <Card className="p-4 bg-secondary border-destructive/30">
              <p className="text-2xl font-bold text-destructive">{selectedDigitAnalysis.under.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Under {selectedDigit}</p>
            </Card>
            <Card className="p-4 bg-secondary border-accent/30">
              <p className="text-2xl font-bold text-accent">{selectedDigitAnalysis.equal.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Equal {selectedDigit}</p>
            </Card>
          </div>
        )}
      </Card>

      {/* Even/Odd Pattern */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-6">Even/Odd Pattern</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-secondary border-primary/30">
            <p className="text-3xl font-bold text-primary">{evenOddAnalysis.even.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Even</p>
          </Card>
          <Card className="p-4 bg-secondary border-accent/30">
            <p className="text-3xl font-bold text-accent">{evenOddAnalysis.odd.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Odd</p>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Last 50 Digits</p>
        <div className="grid grid-cols-10 gap-1">
          {last50Digits.map((digit, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-xs font-semibold rounded ${
                digit % 2 === 0 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-accent/20 text-accent'
              }`}
            >
              {digit % 2 === 0 ? 'E' : 'O'}
            </div>
          ))}
        </div>
      </Card>

      {/* Rise/Fall Analysis */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-6">Market Movement</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-secondary border-success/30">
            <p className="text-3xl font-bold text-success">{riseFallAnalysis.rise.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Rise</p>
          </Card>
          <Card className="p-4 bg-secondary border-destructive/30">
            <p className="text-3xl font-bold text-destructive">{riseFallAnalysis.fall.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Fall</p>
          </Card>
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-6 gradient-card border-border">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Ticks:</span>
            <span className="font-semibold">{tickHistory.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Decimal Places:</span>
            <span className="font-semibold">{decimalPlaces}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analysis;
