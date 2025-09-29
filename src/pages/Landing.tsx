import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initiateDerivLogin } from "@/lib/deriv-auth";
import { useDerivAuth } from "@/hooks/useDerivAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDerivAuth();

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      initiateDerivLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-30" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <TrendingUp className="w-12 h-12 text-primary" strokeWidth={2.5} />
                <div className="absolute inset-0 blur-xl bg-primary opacity-50" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                TradeSprint
              </h1>
            </div>

            {/* Tagline */}
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Analyze. Automate. Trade Sprint.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional Deriv trading and analysis system with automated strategies, 
              real-time insights, and intelligent risk management.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="text-lg px-8 glow-primary hover:glow-primary transition-all"
                onClick={handleLogin}
              >
                {isAuthenticated ? 'Open Dashboard' : 'Login via Deriv'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-primary/50 hover:border-primary hover:bg-primary/10"
                onClick={() => navigate('/dashboard')}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-primary" />}
            title="Advanced Analysis"
            description="Real-time digit distribution, pattern recognition, and market movement tracking"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-accent" />}
            title="Automated Trading"
            description="Strategy-driven bot execution with customizable rules and conditions"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-success" />}
            title="Risk Management"
            description="Take profit, stop loss, and daily limits to protect your capital"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-chart-rise" />}
            title="Trade Journal"
            description="Complete trade history with performance analytics and insights"
          />
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
            <strong className="text-destructive">Risk Warning:</strong> Trading derivatives 
            carries a high level of risk. Only trade with funds you can afford to lose. 
            Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="gradient-card rounded-lg border border-border p-6 hover:border-primary/50 transition-all hover:glow-primary">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
