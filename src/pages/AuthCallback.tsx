import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createDerivWS, authorizeToken, getBalance, saveTokens, setActiveToken, DerivToken } from '@/lib/deriv-auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get tokens from URL (support both ?query and #hash)
        const searchParams = new URLSearchParams(window.location.search);
        const hashString = window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : '';
        const hashParams = new URLSearchParams(hashString);
        const getParam = (k: string) => searchParams.get(k) || hashParams.get(k);

        console.log('Auth callback - Full URL:', window.location.href);
        console.log('Auth callback - Query params:', Array.from(searchParams.entries()));
        console.log('Auth callback - Hash params:', Array.from(hashParams.entries()));
        
        const accounts = getParam('acct1') || getParam('accounts');
        const token1 = getParam('token1');
        const token2 = getParam('token2');
        const token3 = getParam('token3');
        const tokenSingle = getParam('token');

        if (!(accounts || token1 || token2 || token3 || tokenSingle)) {
          throw new Error('No authentication tokens received');
        }

        setStatus('Validating tokens...');

        // Parse accounts and tokens
        const accountList = (accounts ? accounts.split(',') : []).filter(Boolean);
        const tokenList = [token1, token2, token3, tokenSingle].filter(Boolean) as string[];

        const ws = createDerivWS();

        await new Promise((resolve) => {
          ws.onopen = resolve;
        });

        const derivTokens: DerivToken[] = [];

        // Authorize and get balance for each token
        for (let i = 0; i < tokenList.length; i++) {
          const token = tokenList[i];
          if (!token) continue;

          try {
            const authResult = await authorizeToken(ws, token);
            const balanceResult = await getBalance(ws);

            derivTokens.push({
              token,
              accountType: authResult.is_virtual ? 'demo' : 'real',
              loginId: authResult.loginid,
              currency: authResult.currency,
              balance: parseFloat(balanceResult.balance)
            });
          } catch (error) {
            console.error('Failed to process token:', error);
          }
        }

        if (derivTokens.length === 0) {
          throw new Error('No valid tokens found');
        }

        // Save tokens
        saveTokens(derivTokens);
        
        // Set first demo account as active, or first real if no demo
        const demoAccount = derivTokens.find(t => t.accountType === 'demo');
        const activeAccount = demoAccount || derivTokens[0];
        setActiveToken(activeAccount);

        ws.close();

        setStatus('Authentication successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('Authentication error:', error);
        setStatus(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full gradient-card border-border text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authenticating</h2>
        <p className="text-muted-foreground">{status}</p>
      </Card>
    </div>
  );
};

export default AuthCallback;
