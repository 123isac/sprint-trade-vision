import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  BarChart3, 
  Bot, 
  BookOpen, 
  Settings,
  TrendingUp,
  Play,
  Pause,
  Square
} from "lucide-react";
import Analysis from "@/components/Analysis";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [accountType, setAccountType] = useState<"demo" | "real">("demo");
  const [balance] = useState(10000);
  const [botStatus, setBotStatus] = useState<"stopped" | "running" | "paused">("stopped");

  const toggleAccountType = () => {
    if (accountType === "demo") {
      const confirmed = window.confirm(
        "⚠️ Switch to REAL account? Real money will be at risk."
      );
      if (confirmed) setAccountType("real");
    } else {
      setAccountType("demo");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border gradient-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TradeSprint
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavButton
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavButton
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analysis"
            active={activeTab === "analysis"}
            onClick={() => setActiveTab("analysis")}
          />
          <NavButton
            icon={<Bot className="w-5 h-5" />}
            label="Bots"
            active={activeTab === "bots"}
            onClick={() => setActiveTab("bots")}
          />
          <NavButton
            icon={<BookOpen className="w-5 h-5" />}
            label="Trade Journal"
            active={activeTab === "journal"}
            onClick={() => setActiveTab("journal")}
          />
          <NavButton
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        {/* Risk Warning Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive font-semibold">Risk Warning:</span> Trading 
            carries significant risk. Only trade with funds you can afford to lose.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border gradient-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
              </div>
              <Button
                variant={accountType === "demo" ? "outline" : "destructive"}
                size="sm"
                onClick={toggleAccountType}
                className={accountType === "demo" ? "border-accent text-accent hover:bg-accent/10" : ""}
              >
                {accountType === "demo" ? "DEMO" : "REAL"} Account
              </Button>
            </div>

            {/* Bot Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={botStatus === "running" ? "default" : "outline"}
                onClick={() => setBotStatus(botStatus === "running" ? "stopped" : "running")}
                className={botStatus === "running" ? "bg-success hover:bg-success/90" : ""}
              >
                {botStatus === "running" ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Bot
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Bot
                  </>
                )}
              </Button>
              {botStatus === "running" && (
                <Button size="sm" variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "analysis" && (
            <div className="max-w-7xl mx-auto">
              <Analysis />
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Today's P/L" value="+$245.50" positive />
                <StatCard title="Win Rate" value="68%" />
                <StatCard title="Total Trades" value="24" />
              </div>
              <Card className="p-6 gradient-card border-border">
                <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                <p className="text-muted-foreground">
                  Dashboard overview coming soon...
                </p>
              </Card>
            </div>
          )}

          {activeTab === "bots" && (
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Trading Bots</h1>
              <Card className="p-6 gradient-card border-border">
                <p className="text-muted-foreground">
                  Strategy configuration and bot management coming soon...
                </p>
              </Card>
            </div>
          )}

          {activeTab === "journal" && (
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Trade Journal</h1>
              <Card className="p-6 gradient-card border-border">
                <p className="text-muted-foreground">
                  Trade history and performance analytics coming soon...
                </p>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Settings</h1>
              <Card className="p-6 gradient-card border-border">
                <p className="text-muted-foreground">
                  Configuration and preferences coming soon...
                </p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active 
          ? "bg-primary text-primary-foreground glow-primary" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

const StatCard = ({ 
  title, 
  value, 
  positive 
}: { 
  title: string; 
  value: string; 
  positive?: boolean;
}) => {
  return (
    <Card className="p-6 gradient-card border-border">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className={`text-3xl font-bold ${positive ? "text-success" : ""}`}>
        {value}
      </p>
    </Card>
  );
};

export default Dashboard;
